import { LitElement, html, nothing, type TemplateResult } from "lit";
import { property, state } from "lit/decorators.js";

import type { HomeAssistant, StockPulseCardConfig } from "./types";
import { labelFor, localize } from "./localize";
import { fireEvent, loadHaElements } from "./ha";
import { defineElement } from "./register";

const LOCATIONS = ["pantry", "fridge", "freezer", "bathroom", "cleaning", "other"];
const CATEGORIES = ["food", "drinks", "frozen", "cleaning", "toiletries", "household", "baby", "pets", "medicine", "other"];

/** Defaults are left out of the YAML; only what differs is written. */
const DEFAULTS: Partial<StockPulseCardConfig> = {
  group_by: "category",
  sort: "name",
  show_search: true,
  show_filters: true,
  hide_out_of_stock: false,
  compact: false,
};

export class StockPulseCardEditor extends LitElement {
  @property({ attribute: false }) hass?: HomeAssistant;
  @state() private _config?: StockPulseCardConfig;
  @state() private _ready = false;
  @state() private _inventories: { entry_id: string; title: string }[] = [];

  connectedCallback(): void {
    super.connectedCallback();
    loadHaElements().then(() => (this._ready = true));
  }

  setConfig(config: StockPulseCardConfig): void {
    this._config = config;
  }

  protected firstUpdated(): void {
    this.hass
      ?.callWS<{ entry_id: string; title: string }[]>({ type: "stock_pulse/inventories" })
      .then((list) => (this._inventories = list))
      .catch(() => undefined);
  }

  private _t = (key: string) => localize(this.hass, key);

  private _schema(): Record<string, unknown>[] {
    const t = this._t;
    const choice = (values: string[], prefix: "loc" | "cat") =>
      values.map((value) => ({ value, label: labelFor(this.hass, prefix, value) }));
    return [
      ...(this._inventories.length > 1
        ? [
            {
              name: "inventory",
              selector: {
                select: {
                  mode: "dropdown",
                  options: this._inventories.map((i) => ({ value: i.entry_id, label: i.title })),
                },
              },
            },
          ]
        : []),
      {
        type: "grid",
        name: "",
        schema: [
          { name: "title", selector: { text: {} } },
          { name: "icon", selector: { icon: {} } },
        ],
      },
      {
        type: "grid",
        name: "",
        schema: [
          {
            name: "group_by",
            selector: {
              select: {
                mode: "dropdown",
                options: ["category", "location", "none"].map((v) => ({ value: v, label: t(`group_${v}`) })),
              },
            },
          },
          {
            name: "sort",
            selector: {
              select: {
                mode: "dropdown",
                options: ["name", "quantity", "expiry"].map((v) => ({ value: v, label: t(`sort_${v}`) })),
              },
            },
          },
        ],
      },
      {
        name: "locations",
        selector: { select: { multiple: true, custom_value: true, mode: "dropdown", options: choice(LOCATIONS, "loc") } },
      },
      {
        name: "categories",
        selector: { select: { multiple: true, custom_value: true, mode: "dropdown", options: choice(CATEGORIES, "cat") } },
      },
      {
        type: "grid",
        name: "",
        schema: [
          { name: "show_search", selector: { boolean: {} } },
          { name: "show_filters", selector: { boolean: {} } },
          { name: "hide_out_of_stock", selector: { boolean: {} } },
          { name: "compact", selector: { boolean: {} } },
        ],
      },
      { name: "max_height", selector: { text: {} } },
    ];
  }

  protected render(): TemplateResult | typeof nothing {
    if (!this.hass || !this._config || !this._ready) return nothing;
    const data = { ...DEFAULTS, ...this._config };
    return html`
      <ha-form
        .hass=${this.hass}
        .data=${data}
        .schema=${this._schema()}
        .computeLabel=${(s: { name: string }) => this._t(`ed_${s.name}`)}
        @value-changed=${this._changed}
      ></ha-form>
    `;
  }

  private _changed(ev: CustomEvent<{ value: Record<string, unknown> }>): void {
    ev.stopPropagation();
    const value = ev.detail.value;
    const config: Record<string, unknown> = { ...this._config };
    // A cleared field may be missing from the form value altogether.
    const names = this._schema().flatMap((s) => ((s.schema as { name: string }[]) ?? [s]).map((f) => f.name as string));
    for (const name of names) if (!(name in value)) delete config[name];
    for (const [key, v] of Object.entries(value)) {
      const empty = v === undefined || v === null || v === "" || (Array.isArray(v) && v.length === 0);
      if (empty || (DEFAULTS as Record<string, unknown>)[key] === v) delete config[key];
      else config[key] = v;
    }
    fireEvent(this, "config-changed", { config });
  }
}

defineElement("stock-pulse-card-editor", StockPulseCardEditor);
