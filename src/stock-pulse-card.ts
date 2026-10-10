import { LitElement, html, nothing, type PropertyValues, type TemplateResult } from "lit";
import { property, state } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import { styleMap } from "lit/directives/style-map.js";

import type { Item, ItemFields, Snapshot, StockPulseCardConfig } from "./types";
import type { HomeAssistant } from "./types";
import {
  applyFilter,
  boughtAmount,
  diffFields,
  fmtQty,
  groupItems,
  itemIcon,
  itemStatus,
  needsStock,
  norm,
  presentValues,
  scoped,
  sortItems,
  stepFor,
  todayISO,
  type Filter,
  type Group,
  type ItemStatus,
} from "./model";
import { fromFormValue, labelFor, localize, toFormValue } from "./localize";
import { errorCode, errorMessage, loadHaElements, toast } from "./ha";
import { cardStyles, dialogStyles } from "./styles";
import { defineElement } from "./register";
import "./editor";

export const VERSION = "1.2.0";
const WS = "stock_pulse";
const GROUP_BY = ["category", "location", "none"];
const SORT = ["name", "quantity", "expiry"];

declare global {
  interface Window {
    customCards?: Array<Record<string, unknown>>;
  }
  interface HTMLElementTagNameMap {
    "stock-pulse-card": StockPulseCard;
  }
}

interface DialogState {
  mode: "add" | "edit";
  id?: string;
  data: ItemFields;
  original: ItemFields;
  armed: boolean;
  busy: boolean;
  error?: string;
}

interface View {
  statuses: Map<string, ItemStatus>;
  inScope: Item[];
  groups: Group[];
  shown: number;
  counts: { items: number; low: number; expiring: number; list: number };
  locations: string[];
  exact: boolean;
}

const EDITABLE: (keyof ItemFields)[] = [
  "name",
  "quantity",
  "unit",
  "category",
  "location",
  "expiry",
  "min_quantity",
  "restock_quantity",
  "auto_shop",
  "notes",
  "icon",
];

export class StockPulseCard extends LitElement {
  @property({ attribute: false }) hass?: HomeAssistant;
  @property({ type: Boolean, reflect: true }) compact = false;
  @state() private _config?: StockPulseCardConfig;
  @state() private _snap?: Snapshot;
  @state() private _error?: string;
  @state() private _query = "";
  @state() private _filter: Filter = { kind: "all" };
  @state() private _dialog?: DialogState;

  private _unsub?: Promise<() => unknown>;
  private _subscribedTo?: string;
  private _retry?: number;
  private _view?: View;
  private _today = todayISO();

  static styles = [cardStyles, dialogStyles];

  // ---- Lovelace API ---------------------------------------------------------

  static getConfigElement(): HTMLElement {
    return document.createElement("stock-pulse-card-editor");
  }

  static getStubConfig(): Partial<StockPulseCardConfig> {
    return {};
  }

  setConfig(config: StockPulseCardConfig): void {
    if (!config) throw new Error("Invalid configuration");
    if (config.group_by && !GROUP_BY.includes(config.group_by)) {
      throw new Error(`group_by must be one of ${GROUP_BY.join(", ")}`);
    }
    if (config.sort && !SORT.includes(config.sort)) throw new Error(`sort must be one of ${SORT.join(", ")}`);
    for (const key of ["locations", "categories"] as const) {
      if (config[key] !== undefined && !Array.isArray(config[key])) throw new Error(`${key} must be a list`);
    }
    const inventoryChanged = this._config && (this._config.inventory ?? "") !== (config.inventory ?? "");
    this._config = config;
    this.compact = !!config.compact;
    if (inventoryChanged) this._resubscribe();
  }

  getCardSize(): number {
    const rows = this._view?.shown ?? 3;
    return 2 + Math.ceil(Math.min(rows, 12) / 1.5);
  }

  getGridOptions() {
    return { columns: 12, min_columns: 6, rows: "auto" as const };
  }

  // ---- Lifecycle ------------------------------------------------------------

  private _resize = new ResizeObserver(() => {
    for (const el of this.renderRoot.querySelectorAll<HTMLElement>(".chips, .list")) this._markEdges(el);
  });

  connectedCallback(): void {
    super.connectedCallback();
    this._resize.observe(this);
    if (this.hass && this._config) this._subscribe();
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this._resize.disconnect();
    this._unsubscribe();
  }

  protected willUpdate(changed: PropertyValues): void {
    if (changed.has("hass") && this.hass && this._config && !this._unsub) this._subscribe();
    // Recompute what the list shows only when its inputs change, not on every hass update.
    const today = todayISO();
    if (
      !this._view ||
      today !== this._today ||
      changed.has("_snap") ||
      changed.has("_config") ||
      changed.has("_query") ||
      changed.has("_filter")
    ) {
      this._today = today;
      this._view = this._buildView();
    }
  }

  protected shouldUpdate(changed: PropertyValues): boolean {
    if (changed.size === 1 && changed.has("hass")) {
      // Only language changes matter; data comes over our own subscription.
      const old = changed.get("hass") as HomeAssistant | undefined;
      return !old || old.language !== this.hass?.language || !this._snap;
    }
    return true;
  }

  protected updated(): void {
    for (const el of this.renderRoot.querySelectorAll<HTMLElement>(".chips, .list")) this._markEdges(el);
    const dialog = this.renderRoot.querySelector<HTMLDialogElement>("dialog.sp-dialog");
    if (dialog && !dialog.open) {
      try {
        dialog.showModal();
      } catch {
        dialog.setAttribute("open", "");
      }
    }
  }

  /** Mark which ends of a scroller have more content, for the edge fades. */
  private _markEdges(el: HTMLElement): void {
    const horizontal = el.classList.contains("chips");
    const pos = horizontal ? el.scrollLeft : el.scrollTop;
    const size = horizontal ? el.clientWidth : el.clientHeight;
    const total = horizontal ? el.scrollWidth : el.scrollHeight;
    el.classList.toggle("more-start", pos > 1);
    el.classList.toggle("more-end", pos + size < total - 1);
  }

  private _onScroll = (ev: Event) => this._markEdges(ev.currentTarget as HTMLElement);

  private _subscribe(): void {
    if (!this.hass || !this._config || this._unsub || !this.isConnected) return;
    const inventory = this._config.inventory || undefined;
    this._subscribedTo = inventory ?? "";
    this._unsub = this.hass.connection
      .subscribeMessage<Snapshot>(
        (snap) => {
          this._snap = snap;
          this._error = undefined;
        },
        { type: `${WS}/subscribe`, ...(inventory ? { inventory } : {}) }
      )
      .catch((err: unknown) => {
        const code = errorCode(err);
        this._error =
          code === "unknown_command"
            ? localize(this.hass, "not_installed")
            : code === "not_found" && inventory
              ? localize(this.hass, "not_found", { inventory })
              : errorMessage(err);
        this._unsub = undefined;
        // The integration may still be starting: try again in a while.
        window.clearTimeout(this._retry);
        this._retry = window.setTimeout(() => this._subscribe(), 30_000);
        return () => undefined;
      });
  }

  private _unsubscribe(): void {
    window.clearTimeout(this._retry);
    const unsub = this._unsub;
    this._unsub = undefined;
    unsub?.then((fn) => fn()).catch(() => undefined);
  }

  private _resubscribe(): void {
    this._unsubscribe();
    this._snap = undefined;
    this._subscribe();
  }

  // ---- View model -----------------------------------------------------------

  private _buildView(): View {
    const snap = this._snap;
    const config = this._config!;
    const statuses = new Map<string, ItemStatus>();
    if (!snap) {
      return {
        statuses,
        inScope: [],
        groups: [],
        shown: 0,
        counts: { items: 0, low: 0, expiring: 0, list: 0 },
        locations: [],
        exact: false,
      };
    }
    const soonDays = snap.settings.expiring_days;
    for (const item of snap.items) statuses.set(item.id, itemStatus(item, this._today, soonDays));
    const inScope = scoped(snap.items, config);
    const counts = { items: 0, low: 0, expiring: 0, list: 0 };
    for (const item of inScope) {
      const s = statuses.get(item.id)!;
      counts.items++;
      if (needsStock(s)) counts.low++;
      if (s.expired || s.soon) counts.expiring++;
      if (s.onList) counts.list++;
    }
    const filtered = applyFilter(inScope, this._filter, this._query, statuses, !!config.hide_out_of_stock);
    const sorted = sortItems(filtered, config.sort ?? "name", statuses);
    const groupBy = config.group_by ?? "category";
    const builtIn = groupBy === "location" ? snap.locations : snap.categories;
    const q = norm(this._query);
    return {
      statuses,
      inScope,
      groups: groupItems(sorted, groupBy, builtIn),
      shown: sorted.length,
      counts,
      locations: presentValues(inScope, "location", snap.locations),
      exact: !!q && snap.items.some((i) => norm(i.name) === q),
    };
  }

  private _t = (key: string, vars?: Record<string, string | number>) => localize(this.hass, key, vars);

  // ---- Render ---------------------------------------------------------------

  protected render(): TemplateResult | typeof nothing {
    if (!this._config) return nothing;
    const config = this._config;
    const view = this._view!;
    const snap = this._snap;
    const title = config.title ?? snap?.title ?? "Stock";
    const maxHeight = config.max_height;

    return html`
      <ha-card>
        <div class="content">
          <div class="header">
            <div class="badge"><ha-icon .icon=${config.icon || "mdi:package-variant-closed"}></ha-icon></div>
            <div class="titles">
              <div class="title">${title}</div>
              ${snap ? html`<div class="secondary">${this._summary(view)}</div>` : nothing}
            </div>
            ${snap
              ? html`<button class="round" title=${this._t("add_item")} aria-label=${this._t("add_item")} @click=${() => this._openAdd("")}>
                  <ha-icon icon="mdi:plus"></ha-icon>
                </button>`
              : nothing}
          </div>
          ${this._error
            ? html`<div class="notice">${this._error}</div>`
            : snap
              ? html`
                  ${config.show_search !== false ? this._renderSearch() : nothing}
                  ${config.show_filters !== false ? this._renderChips(view, snap) : nothing}
                  <div class="list" style=${styleMap(maxHeight ? { maxHeight } : {})} @scroll=${this._onScroll}>${this._renderList(view, snap)}</div>
                `
              : nothing}
        </div>
        ${this._dialog && snap ? this._renderDialog(this._dialog, snap) : nothing}
      </ha-card>
    `;
  }

  private _summary(view: View): TemplateResult {
    const parts: TemplateResult[] = [html`<span>${this._t("n_items", { n: view.counts.items })}</span>`];
    if (view.counts.low) parts.push(html`<span class="warn">${this._t("n_low", { n: view.counts.low })}</span>`);
    if (view.counts.expiring) parts.push(html`<span class="warn">${this._t("n_expiring", { n: view.counts.expiring })}</span>`);
    // Nothing to act on: say so, so a quiet card reads as "checked, fine" rather than "no data".
    if (view.counts.items && !view.counts.low && !view.counts.expiring) parts.push(html`<span>${this._t("all_stocked")}</span>`);
    return html`${parts.map((p, i) => html`${i ? html`<span class="dot">·</span>` : nothing}${p}`)}`;
  }

  private _renderSearch(): TemplateResult {
    return html`
      <div class="search">
        <ha-icon icon="mdi:magnify"></ha-icon>
        <input
          type="search"
          enterkeyhint="done"
          autocomplete="off"
          .value=${this._query}
          placeholder=${this._t("search_or_add")}
          aria-label=${this._t("search_or_add")}
          @input=${(ev: Event) => (this._query = (ev.target as HTMLInputElement).value)}
          @keydown=${this._onSearchKey}
        />
        ${this._query
          ? html`<button class="clear" aria-label=${this._t("close")} @click=${() => (this._query = "")}>
              <ha-icon icon="mdi:close"></ha-icon>
            </button>`
          : nothing}
      </div>
    `;
  }

  private _onSearchKey = (ev: KeyboardEvent) => {
    if (ev.key === "Escape") {
      this._query = "";
      return;
    }
    if (ev.key !== "Enter" || !this._query.trim() || !this._snap) return;
    // Otherwise the same key press lands on the dialog's first button and closes it again.
    ev.preventDefault();
    const q = norm(this._query);
    const match = this._snap.items.find((i) => norm(i.name) === q);
    if (match) this._openEdit(match);
    else this._openAdd(this._query.trim());
  };

  private _renderChips(view: View, snap: Snapshot): TemplateResult | typeof nothing {
    const chips: { filter: Filter; label: string; count?: number; icon?: string }[] = [
      { filter: { kind: "all" }, label: this._t("chip_all") },
    ];
    if (view.counts.low || this._filter.kind === "low") {
      chips.push({ filter: { kind: "low" }, label: this._t("chip_low"), count: view.counts.low });
    }
    if (view.counts.expiring || this._filter.kind === "expiring") {
      chips.push({ filter: { kind: "expiring" }, label: this._t("chip_expiring"), count: view.counts.expiring });
    }
    if (snap.settings.shopping_list && (view.counts.list || this._filter.kind === "list")) {
      chips.push({ filter: { kind: "list" }, label: this._t("chip_list"), count: view.counts.list, icon: "mdi:cart-outline" });
    }
    if (view.locations.length > 1) {
      for (const loc of view.locations) {
        chips.push({ filter: { kind: "location", value: loc }, label: labelFor(this.hass, "loc", loc) });
      }
    }
    if (chips.length < 2) return nothing;
    const same = (a: Filter, b: Filter) =>
      a.kind === b.kind && (!("value" in a) || ("value" in b && a.value === b.value));
    return html`
      <div class="chips" role="toolbar" @scroll=${this._onScroll}>
        ${chips.map(
          (c) => html`
            <button
              class=${classMap({ chip: true, selected: same(c.filter, this._filter) })}
              aria-pressed=${same(c.filter, this._filter) ? "true" : "false"}
              @click=${() => (this._filter = same(c.filter, this._filter) ? { kind: "all" } : c.filter)}
            >
              ${c.icon ? html`<ha-icon .icon=${c.icon}></ha-icon>` : nothing}${c.label}
              ${c.count != null ? html`<span class="count">${c.count}</span>` : nothing}
            </button>
          `
        )}
      </div>
    `;
  }

  private _renderList(view: View, snap: Snapshot): TemplateResult {
    const query = this._query.trim();
    const addRow =
      query && !view.exact
        ? html`<button class="add-row" @click=${() => this._openAdd(query)}>
            <span class="ricon"><ha-icon icon="mdi:plus"></ha-icon></span>
            <span>${this._t("add_named", { name: query })}</span>
          </button>`
        : nothing;

    if (!snap.items.length && !query) {
      return html`<div class="empty">
        <ha-icon icon="mdi:package-variant"></ha-icon>
        <div class="big">${this._t("empty")}</div>
        <div>${this._t("empty_hint")}</div>
      </div>`;
    }
    if (!view.shown) {
      return html`${addRow}${query ? nothing : html`<div class="empty"><div>${this._t("no_match")}</div></div>`}`;
    }
    const groupBy = this._config!.group_by ?? "category";
    const showHeads = groupBy !== "none" && view.groups.length > 1;
    return html`
      ${addRow}
      ${view.groups.map(
        (g) => html`
          ${showHeads
            ? html`<div class="group-head">
                ${g.key
                  ? labelFor(this.hass, groupBy === "location" ? "loc" : "cat", g.key)
                  : this._t(groupBy === "location" ? "no_location" : "no_category")}
                <span class="n">${g.items.length}</span>
              </div>`
            : nothing}
          ${g.items.map((item) => this._renderRow(item, view.statuses.get(item.id)!))}
        `
      )}
    `;
  }

  private _expiryText(s: ItemStatus, item: Item): string | undefined {
    if (s.days == null || s.out) return undefined;
    if (s.days < 0) return s.days === -1 ? this._t("expired_yesterday") : this._t("expired_ago", { n: -s.days });
    if (s.days === 0) return this._t("expires_today");
    if (s.days === 1) return this._t("expires_tomorrow");
    if (s.soon) return this._t("expires_in", { n: s.days });
    return this._t("expires_on", { date: this._formatDate(item.expiry!) });
  }

  private _formatDate(iso: string): string {
    try {
      const [y, m, d] = iso.split("-").map(Number);
      return new Date(y, m - 1, d).toLocaleDateString(this.hass?.locale?.language ?? this.hass?.language, {
        day: "numeric",
        month: "short",
      });
    } catch {
      return iso;
    }
  }

  private _renderRow(item: Item, s: ItemStatus): TemplateResult {
    const tone = s.out || s.expired ? "bad" : s.low || s.soon ? "warn" : "";
    const groupBy = this._config!.group_by ?? "category";
    const scopedTo = this._config!.locations?.length === 1;
    // Facts under the name, most important first. Ones that don't fit drop out whole (see .meta).
    const meta: { text: string; tone?: string }[] = [];
    if (s.out) meta.push({ text: this._t("out_of_stock"), tone: "bad" });
    else if (s.low) meta.push({ text: this._t("low"), tone: "warn" });
    // A date far away is noise in the list (it's in the sheet); it earns a place when sorting by date.
    const expiry = s.expired || s.soon || this._config!.sort === "expiry" ? this._expiryText(s, item) : undefined;
    if (expiry) meta.push({ text: expiry, tone: s.expired ? "bad" : s.soon ? "warn" : undefined });
    if (item.location && groupBy !== "location" && !scopedTo) {
      meta.push({ text: labelFor(this.hass, "loc", item.location) });
    }
    if (!meta.length && item.expiry && !s.out) meta.push({ text: this._expiryText(s, item)! });
    const important = s.out || s.low || s.expired || s.soon;
    const step = stepFor(item.unit);
    const unit = item.unit === "pcs" ? "" : labelFor(this.hass, "unit", item.unit, item.quantity);

    return html`
      <div class=${classMap({ row: true, out: s.out })}>
        <button class="main" @click=${() => this._openEdit(item)} aria-label=${item.name}>
          <span class=${classMap({ ricon: true, [tone]: !!tone })}><ha-icon .icon=${itemIcon(item)}></ha-icon></span>
          <span class="text">
            <span class="rname">${item.name}</span>
            ${meta.length || s.onList
              ? html`<span class=${classMap({ meta: true, important })}>
                  ${s.onList
                    ? html`<ha-icon class="cart" icon="mdi:cart-outline" title=${this._t("on_list")}></ha-icon>`
                    : nothing}
                  ${meta.map(
                    (m, i) =>
                      html`<span class=${classMap({ part: true, [m.tone ?? ""]: !!m.tone })}
                        >${i ? html`<span class="dot">·</span>` : nothing}${m.text}</span
                      >`
                  )}
                </span>`
              : nothing}
          </span>
        </button>
        <div class="stepper">
          <button
            class="step"
            ?disabled=${item.quantity <= 0}
            aria-label=${this._t("decrease", { step: fmtQty(step) })}
            @click=${() => this._adjust(item, -step)}
          >
            <ha-icon icon="mdi:minus"></ha-icon>
          </button>
          <span class="qty"><b>${fmtQty(item.quantity)}</b>${unit ? html`<small>${unit}</small>` : nothing}</span>
          <button class="step" aria-label=${this._t("increase", { step: fmtQty(step) })} @click=${() => this._adjust(item, step)}>
            <ha-icon icon="mdi:plus"></ha-icon>
          </button>
        </div>
      </div>
    `;
  }

  // ---- Dialog ---------------------------------------------------------------

  private _schema(snap: Snapshot): Record<string, unknown>[] {
    const items = snap.items;
    const options = (field: "unit" | "category" | "location", builtIn: string[], prefix: "unit" | "cat" | "loc") => {
      const custom = [...new Set(items.map((i) => i[field]).filter((v): v is string => !!v && !builtIn.includes(v)))];
      return [...builtIn, ...custom.sort()].map((value) => {
        const label = toFormValue(this.hass, prefix, value)!;
        return { value: label, label };
      });
    };
    const select = (opts: { value: string; label: string }[]) => ({
      select: { options: opts, custom_value: true, mode: "dropdown" },
    });
    const number = { number: { min: 0, step: "any", mode: "box" } };
    return [
      { name: "name", required: true, selector: { text: {} } },
      {
        type: "grid",
        name: "",
        schema: [
          { name: "quantity", selector: number },
          { name: "unit", selector: select(options("unit", snap.units, "unit")) },
        ],
      },
      {
        type: "grid",
        name: "",
        schema: [
          { name: "category", selector: select(options("category", snap.categories, "cat")) },
          { name: "location", selector: select(options("location", snap.locations, "loc")) },
        ],
      },
      { name: "expiry", selector: { date: {} } },
      {
        type: "grid",
        name: "",
        schema: [
          { name: "min_quantity", selector: number },
          { name: "restock_quantity", selector: number },
        ],
      },
      ...(snap.settings.shopping_list ? [{ name: "auto_shop", selector: { boolean: {} } }] : []),
      { name: "notes", selector: { text: { multiline: true } } },
      { name: "icon", selector: { icon: {} } },
    ];
  }

  private async _openAdd(name: string): Promise<void> {
    const config = this._config!;
    const data: ItemFields = { name, quantity: 1, unit: "pcs", auto_shop: true };
    // Start from what the card is looking at: a freezer card adds to the freezer.
    if (this._filter.kind === "location") data.location = this._filter.value;
    else if (config.locations?.length === 1) data.location = config.locations[0];
    if (config.categories?.length === 1) data.category = config.categories[0];
    await loadHaElements();
    this._dialog = { mode: "add", data: this._toForm(data), original: {}, armed: false, busy: false };
  }

  private async _openEdit(item: Item): Promise<void> {
    const data: ItemFields = {};
    for (const key of EDITABLE) (data as Record<string, unknown>)[key] = item[key] ?? undefined;
    await loadHaElements();
    this._dialog = { mode: "edit", id: item.id, data: this._toForm(data), original: data, armed: false, busy: false };
  }

  private _toForm(data: ItemFields): ItemFields {
    return {
      ...data,
      unit: toFormValue(this.hass, "unit", data.unit),
      category: toFormValue(this.hass, "cat", data.category),
      location: toFormValue(this.hass, "loc", data.location),
    };
  }

  private _fromForm(data: ItemFields): ItemFields {
    const snap = this._snap!;
    return {
      ...data,
      name: String(data.name ?? "").trim(),
      unit: fromFormValue(this.hass, "unit", data.unit, snap.units) ?? "pcs",
      category: fromFormValue(this.hass, "cat", data.category, snap.categories),
      location: fromFormValue(this.hass, "loc", data.location, snap.locations),
    };
  }

  private _renderDialog(d: DialogState, snap: Snapshot): TemplateResult {
    const item = d.id ? snap.items.find((i) => i.id === d.id) : undefined;
    const s = item ? this._view!.statuses.get(item.id) : undefined;
    const title = d.mode === "add" ? this._t("new_item") : item?.name ?? d.data.name ?? "";
    const icon = d.data.icon || (item ? itemIcon(item) : "mdi:package-variant-plus");
    const canShop = !!snap.settings.shopping_list && d.mode === "edit" && !!item;
    const expiry = item && s ? this._expiryText(s, item) : undefined;
    // Only for items already saved; a new item has nothing to restock yet.
    const bought = item && s && d.mode === "edit" ? boughtAmount(item, s) : null;

    return html`
      <dialog class="sp-dialog" aria-label=${title} @close=${this._onDialogClosed} @click=${this._onBackdrop}>
        <div class="surface">
          <div class="d-head">
            <div class="badge"><ha-icon .icon=${icon}></ha-icon></div>
            <div class="d-title">${title}</div>
            <button class="round" aria-label=${this._t("close")} @click=${this._closeDialog}>
              <ha-icon icon="mdi:close"></ha-icon>
            </button>
          </div>
          <div class="d-body">
            ${item && s && (s.out || s.low || s.onList || s.expired || s.soon)
              ? html`<div class="d-status">
                  ${s.out
                    ? html`<span class="pill bad"><ha-icon icon="mdi:alert-circle-outline"></ha-icon>${this._t("out_of_stock")}</span>`
                    : s.low
                      ? html`<span class="pill warn"><ha-icon icon="mdi:alert-circle-outline"></ha-icon>${this._t("low")}</span>`
                      : nothing}
                  ${(s.expired || s.soon) && expiry
                    ? html`<span class=${classMap({ pill: true, bad: s.expired, warn: s.soon })}
                        ><ha-icon icon="mdi:clock-alert-outline"></ha-icon>${expiry}</span
                      >`
                    : nothing}
                  ${s.onList
                    ? html`<span class="pill"><ha-icon icon="mdi:cart-outline"></ha-icon>${this._t("on_list")}</span>`
                    : nothing}
                  ${bought != null
                    ? html`<button
                        class="bought"
                        aria-label=${this._t("bought_aria", { amount: this._amountText(item, bought) })}
                        ?disabled=${d.busy}
                        @click=${() => this._onBought(item, bought)}
                      >
                        <ha-icon icon="mdi:cart-check"></ha-icon>${this._t("bought")}
                        <span class="amount">+${this._amountText(item, bought)}</span>
                      </button>`
                    : nothing}
                </div>`
              : nothing}
            <ha-form
              .hass=${this.hass}
              .data=${d.data}
              .schema=${this._schema(snap)}
              .computeLabel=${(f: { name: string }) => this._t(`f_${f.name}`)}
              .computeHelper=${(f: { name: string }) =>
                f.name === "min_quantity" || f.name === "restock_quantity" ? this._t(`h_${f.name}`) : undefined}
              @value-changed=${this._onFormChanged}
            ></ha-form>
            ${d.error ? html`<div class="d-error">${d.error}</div>` : nothing}
          </div>
          <div class="d-foot">
            ${d.mode === "edit"
              ? html`<button
                  class=${classMap({ btn: true, danger: true, armed: d.armed })}
                  aria-label=${d.armed ? this._t("delete_confirm") : this._t("delete")}
                  ?disabled=${d.busy}
                  @click=${this._onDelete}
                >
                  <ha-icon icon="mdi:delete-outline"></ha-icon><span class=${d.armed ? "" : "lbl"}>${d.armed ? this._t("delete_confirm") : this._t("delete")}</span>
                </button>`
              : nothing}
            ${canShop
              ? html`<button
                  class="btn"
                  aria-label=${item!.shopping ? this._t("remove_from_list") : this._t("add_to_list")}
                  ?disabled=${d.busy}
                  @click=${() => this._toggleShopping(item!)}
                >
                  <ha-icon .icon=${item!.shopping ? "mdi:cart-remove" : "mdi:cart-plus"}></ha-icon>
                  <span class="lbl">${item!.shopping ? this._t("remove_from_list") : this._t("add_to_list")}</span>
                </button>`
              : nothing}
            <span class="spacer"></span>
            <button class="btn cancel" @click=${this._closeDialog}>${this._t("cancel")}</button>
            <button class="btn filled" ?disabled=${d.busy || !String(d.data.name ?? "").trim()} @click=${this._onSave}>
              ${this._t("save")}
            </button>
          </div>
        </div>
      </dialog>
    `;
  }

  private _onFormChanged = (ev: CustomEvent<{ value: ItemFields }>) => {
    ev.stopPropagation();
    if (!this._dialog) return;
    this._dialog = { ...this._dialog, data: { ...ev.detail.value }, armed: false, error: undefined };
  };

  private _onBackdrop = (ev: MouseEvent) => {
    if (ev.target === ev.currentTarget) this._closeDialog();
  };

  private _closeDialog = () => {
    this.renderRoot.querySelector<HTMLDialogElement>("dialog.sp-dialog")?.close();
  };

  private _onDialogClosed = () => {
    this._dialog = undefined;
  };

  private async _call<T>(msg: Record<string, unknown>): Promise<T> {
    return this.hass!.callWS<T>({ ...msg, inventory: this._snap!.entry_id });
  }

  private _onSave = async () => {
    const d = this._dialog;
    if (!d || d.busy) return;
    const data = this._fromForm(d.data);
    this._dialog = { ...d, busy: true, error: undefined };
    try {
      if (d.mode === "add") {
        const fields = Object.fromEntries(
          Object.entries(data).filter(([, v]) => v !== undefined && v !== null && v !== "")
        );
        await this._call({ type: `${WS}/item/add`, item: fields });
        this._query = "";
      } else {
        const changes = diffFields(d.original, data);
        if (Object.keys(changes).length) {
          await this._call({ type: `${WS}/item/update`, item_id: d.id, changes });
        }
      }
      this._closeDialog();
    } catch (err) {
      if (this._dialog) this._dialog = { ...this._dialog, busy: false, error: errorMessage(err) };
    }
  };

  private _onDelete = async () => {
    const d = this._dialog;
    if (!d?.id || d.busy) return;
    if (!d.armed) {
      this._dialog = { ...d, armed: true };
      return;
    }
    this._dialog = { ...d, busy: true };
    try {
      await this._call({ type: `${WS}/item/remove`, item_id: d.id });
      this._closeDialog();
    } catch (err) {
      if (this._dialog) this._dialog = { ...this._dialog, busy: false, armed: false, error: errorMessage(err) };
    }
  };

  private async _toggleShopping(item: Item): Promise<void> {
    const d = this._dialog;
    if (!d) return;
    this._dialog = { ...d, busy: true };
    try {
      await this._call({ type: `${WS}/item/shop`, item_id: item.id, on: !item.shopping });
      if (this._dialog) this._dialog = { ...this._dialog, busy: false };
    } catch (err) {
      if (this._dialog) this._dialog = { ...this._dialog, busy: false, error: errorMessage(err) };
    }
  }

  /** "+9 rolls", "+2" for pieces, as the rows show quantities. */
  private _amountText(item: Item, amount: number): string {
    const unit = item.unit === "pcs" ? "" : labelFor(this.hass, "unit", item.unit, amount);
    return unit ? `${fmtQty(amount)} ${unit}` : fmtQty(amount);
  }

  /**
   * Bought without ticking the list (on the way home): add the amount in one go. The integration then
   * clears the entry it added; an entry put on the list by hand from this sheet is removed here too,
   * so "bought" never leaves the item on the list.
   */
  private async _onBought(item: Item, amount: number): Promise<void> {
    const d = this._dialog;
    if (!d || d.busy) return;
    this._dialog = { ...d, busy: true, error: undefined };
    try {
      await this._call({ type: `${WS}/item/adjust`, item_id: item.id, amount });
      if (item.shopping && !item.shopping.auto) {
        await this._call({ type: `${WS}/item/shop`, item_id: item.id, on: false });
      }
      toast(this, this._t("restocked", { name: item.name, amount: this._amountText(item, amount) }));
      this._closeDialog();
    } catch (err) {
      if (this._dialog) this._dialog = { ...this._dialog, busy: false, error: errorMessage(err) };
    }
  }

  // ---- Quantity -------------------------------------------------------------

  private async _adjust(item: Item, delta: number): Promise<void> {
    const snap = this._snap;
    if (!snap) return;
    const quantity = Math.max(0, Math.round((item.quantity + delta) * 1000) / 1000);
    if (quantity === item.quantity) return;
    // Show the new count straight away; the integration's update follows.
    this._snap = { ...snap, items: snap.items.map((i) => (i.id === item.id ? { ...i, quantity } : i)) };
    try {
      await this._call({ type: `${WS}/item/adjust`, item_id: item.id, amount: quantity - item.quantity });
    } catch (err) {
      toast(this, this._t("failed", { error: errorMessage(err) }));
    }
  }
}

if (!window.customCards?.some((c) => c.type === "stock-pulse-card")) {
  window.customCards = window.customCards || [];
  window.customCards.push({
    type: "stock-pulse-card",
    name: "Stock Pulse Card",
    description: "What you have at home, what is running low, and a shopping list that fills itself.",
    preview: true,
    documentationURL: "https://github.com/zacharatos/stock-pulse-integration",
  });
  defineElement("stock-pulse-card", StockPulseCard).then(() =>
    // eslint-disable-next-line no-console
    console.info(
      `%c STOCK-PULSE-CARD %c ${VERSION} `,
      "color:white;background:#555;font-weight:600;border-radius:4px 0 0 4px;padding:2px 4px",
      "color:white;background:var(--primary-color,#03a9f4);border-radius:0 4px 4px 0;padding:2px 4px"
    )
  );
}
