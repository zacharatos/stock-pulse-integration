// Pure logic: what the card shows, decided from the snapshot and the config. No DOM here.

import type { Batch, GroupBy, Item, SortBy, StockPulseCardConfig } from "./types";

export interface ItemStatus {
  out: boolean;
  low: boolean;
  /** Days until the date that counts (best-before, or sooner once opened); negative when past; null without one. */
  days: number | null;
  /** That date comes from opening the pack ("keeps 10 days once open"), not from the label. */
  byOpening: boolean;
  /** Days since the pack was opened, or null when it isn't. */
  openedDays: number | null;
  expired: boolean;
  soon: boolean;
  onList: boolean;
}

/** Today's date in the browser's time zone, as YYYY-MM-DD. */
export function todayISO(now: Date = new Date()): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
}

export function daysBetween(fromISO: string, toISO: string): number | null {
  const a = Date.parse(`${fromISO.slice(0, 10)}T00:00:00Z`);
  const b = Date.parse(`${toISO.slice(0, 10)}T00:00:00Z`);
  if (Number.isNaN(a) || Number.isNaN(b)) return null;
  return Math.round((b - a) / 86_400_000);
}

/** Add days to an ISO date. */
export function addDays(iso: string, days: number): string {
  const d = new Date(`${iso.slice(0, 10)}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

/** The date that counts and why: the earlier of best-before and opened + days it keeps (as logic.py). */
export function effectiveExpiry(item: Item): { date: string | null; byOpening: boolean } {
  const byOpening = item.opened_on && item.days_after_opening ? addDays(item.opened_on, item.days_after_opening) : null;
  if (byOpening && (!item.expiry || byOpening < item.expiry.slice(0, 10))) return { date: byOpening, byOpening: true };
  return { date: item.expiry ? item.expiry.slice(0, 10) : null, byOpening: false };
}

/** Units that measure an amount instead of counting packs (as logic.py). */
export const MEASURED_UNITS = ["kg", "g", "l", "ml"];

/** What the open-pack rule reads from an item. */
type PackItem = Pick<Item, "unit" | "restock_quantity" | "opened_on">;

/** How much one pack holds: 1 for counted units, the buy amount for measured ones, else unknown (as logic.py). */
export function packSize(item: Pick<Item, "unit" | "restock_quantity">): number | null {
  if (!MEASURED_UNITS.includes(item.unit || "pcs")) return 1;
  return item.restock_quantity && item.restock_quantity > 0 ? item.restock_quantity : null;
}

/** Packs it takes to hold the quantity; a started pack counts as one. */
export function packsLeft(quantity: number, size: number): number {
  return quantity > 0 ? Math.ceil(Math.round((quantity / size) * 1e6) / 1e6) : 0;
}

/** Whether a change of quantity used up the open pack, so its Opened date no longer applies (as logic.py). */
export function openPackFinished(item: PackItem, before: number, after: number): boolean {
  if (!item.opened_on) return false;
  if (before <= 0) return after > 0;
  if (after >= before) return false;
  if (after <= 0) return true;
  const size = packSize(item);
  return size != null && packsLeft(after, size) < packsLeft(before, size);
}

// ---- Batches: packs of one item with their own best-before dates (as logic.py) ----------------------

/** Most batches one item can hold. */
export const MAX_BATCHES = 10;

/** What reading an item's batches needs. */
export type BatchedItem = Pick<Item, "quantity" | "expiry"> & { batches?: Batch[] | null };

/** What the batch rules read from an item. */
export type StockItem = PackItem & BatchedItem;

const round3 = (n: number) => Math.round(n * 1000) / 1000;
const dayOf = (value: string | null | undefined) => (value ? String(value).slice(0, 10) : null);

/** Batches as stored: rounded, empty ones dropped, one per date, dated first and soonest first, undated last. */
export function normBatches(batches: readonly Batch[] | null | undefined): Batch[] {
  const merged = new Map<string | null, number>();
  for (const batch of batches ?? []) {
    const quantity = round3(Number(batch.quantity) || 0);
    if (quantity > 0) {
      const date = dayOf(batch.expiry);
      merged.set(date, round3((merged.get(date) ?? 0) + quantity));
    }
  }
  const key = (date: string | null) => date ?? "";
  return [...merged.entries()]
    .sort(([a], [b]) => (a === null ? 1 : 0) - (b === null ? 1 : 0) || (key(a) < key(b) ? -1 : key(a) > key(b) ? 1 : 0))
    .map(([expiry, quantity]) => ({ quantity, expiry }));
}

/** An item's batches: the stored list when it has two or more, else the item itself as one batch. */
export function batchesOf(item: BatchedItem): Batch[] {
  const stored = item.batches ?? [];
  if (stored.length >= 2) return stored.map((b) => ({ ...b }));
  return [{ quantity: Number(item.quantity) || 0, expiry: dayOf(item.expiry) }];
}

/** The total of some batches. */
export const totalOf = (batches: readonly Batch[]) => round3(batches.reduce((sum, b) => sum + (Number(b.quantity) || 0), 0));

/** Use up an amount, first-expiring batch first and carrying on into the next. More than there is leaves none. */
export function takeBatches(batches: readonly Batch[], amount: number): Batch[] {
  let left = round3(amount);
  const kept: Batch[] = [];
  for (const batch of normBatches(batches)) {
    if (left >= batch.quantity) left = round3(left - batch.quantity);
    else {
      kept.push({ ...batch, quantity: round3(batch.quantity - left) });
      left = 0;
    }
  }
  return kept;
}

/** Add an amount. With a date it joins the batch with that date or starts one; without, the latest batch. */
export function putBatches(batches: readonly Batch[], amount: number, expiry: string | null = null): Batch[] {
  const result = normBatches(batches);
  const date = dayOf(expiry);
  const target = date ? result.find((b) => b.expiry === date) : result[result.length - 1];
  if (target) target.quantity = round3(target.quantity + amount);
  else result.push({ quantity: round3(amount), expiry: date });
  return normBatches(result);
}

/** The fields an item stores for some batches: the list (two or more), the total and the earliest date. */
export function batchFields(batches: readonly Batch[]): { batches: Batch[]; quantity: number; expiry?: string | null } {
  const result = normBatches(batches);
  if (result.length >= 2) return { batches: result, quantity: totalOf(result), expiry: result[0].expiry };
  if (result.length) return { batches: [], quantity: result[0].quantity, expiry: result[0].expiry };
  return { batches: [], quantity: 0 };
}

/** An item's batches after a plain quantity and/or expiry change, and the date its first batch has now. */
function scalarBatches(item: StockItem, changes: Record<string, unknown>): [Batch[], string | null] {
  let result = normBatches(batchesOf(item));
  let first = result.length ? result[0].expiry : dayOf(item.expiry);
  if ("expiry" in changes && result.length) {
    first = dayOf(changes.expiry as string | null);
    result = normBatches([{ ...result[0], expiry: first }, ...result.slice(1)]);
  }
  if ("quantity" in changes) {
    const total = totalOf(result);
    const wanted = round3(Number(changes.quantity) || 0);
    if (wanted < total) result = takeBatches(result, total - wanted);
    else if (wanted > total) result = putBatches(result, wanted - total);
  }
  return [result, first];
}

/** Whether a change of batches used up the open pack, which is in the first-expiring batch (as logic.py). */
function firstBatchFinished(item: PackItem, before: Batch[], after: Batch[], first: string | null): boolean {
  const totalBefore = totalOf(before);
  const totalAfter = totalOf(after);
  if (totalBefore <= 0) return openPackFinished(item, 0, totalAfter);
  if (totalAfter >= totalBefore) return false;
  const left = after.find((b) => b.expiry === first)?.quantity ?? 0;
  return openPackFinished(item, before[0].quantity, left);
}

/**
 * What an update really stores for the stock fields, and opened_on once the open pack is used up (as
 * logic.py stock_changes). `batches` wins over quantity and expiry; on an item with batches a quantity is
 * a difference against the total and an expiry re-dates the first batch; a plain item is stored as given.
 */
export function stockChanges(item: StockItem, changes: Record<string, unknown>): Record<string, unknown> {
  const hasBatches = (item.batches?.length ?? 0) >= 2;
  if ("batches" in changes || (hasBatches && ("quantity" in changes || "expiry" in changes))) {
    const before = normBatches(batchesOf(item));
    let first = before.length ? before[0].expiry : dayOf(item.expiry);
    let after: Batch[];
    if ("batches" in changes) after = normBatches(changes.batches as Batch[]);
    else [after, first] = scalarBatches(item, changes);
    const stored: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(changes)) if (!["batches", "quantity", "expiry"].includes(key)) stored[key] = value;
    Object.assign(stored, batchFields(after));
    if (!("opened_on" in changes) && firstBatchFinished({ ...item, ...stored } as PackItem, before, after, first)) stored.opened_on = null;
    return stored;
  }
  if (
    "quantity" in changes &&
    !("opened_on" in changes) &&
    openPackFinished({ ...item, ...changes } as PackItem, Number(item.quantity) || 0, Number(changes.quantity) || 0)
  ) {
    return { ...changes, opened_on: null };
  }
  return changes;
}

/** The item after + or - of some amount, as the integration will store it (first-expiring batch used first). */
export function adjusted(item: Item, delta: number): Item {
  const quantity = Math.max(0, round3(item.quantity + delta));
  return { ...item, ...stockChanges(item, { quantity }) } as Item;
}

export function itemStatus(item: Item, today: string, soonDays: number): ItemStatus {
  const out = item.quantity <= 0;
  const low = item.min_quantity != null && item.quantity <= item.min_quantity;
  const effective = effectiveExpiry(item);
  const days = effective.date ? daysBetween(today, effective.date) : null;
  const openedDays = item.opened_on && !out ? daysBetween(item.opened_on, today) : null;
  // An empty item can't go off: the date belonged to the batch that is gone.
  const expired = !out && days != null && days < 0;
  const soon = !out && days != null && days >= 0 && days <= soonDays;
  return { out, low, days, expired, soon, onList: !!item.shopping, byOpening: effective.byOpening, openedDays };
}

/** Whether an item needs attention (drives the icon tint and the "Low" filter). */
export function needsStock(s: ItemStatus): boolean {
  return s.out || s.low;
}

export function fmtQty(n: number): string {
  if (Math.abs(n - Math.round(n)) < 1e-9) return String(Math.round(n));
  return String(Number(n.toFixed(2)));
}

/**
 * How much to buy, the same rule as the integration's `buy_amount` (logic.py): an explicit buy
 * amount wins, otherwise just enough to get back above the threshold, and at least one.
 */
export function buyAmount(item: Item): number {
  if (item.restock_quantity) return item.restock_quantity;
  if (item.min_quantity == null) return 1;
  return Math.max(1, Math.floor(item.min_quantity - item.quantity) + 1);
}

/**
 * What the "Bought" button adds: the amount on the shopping-list entry when there is one (the user
 * may have changed it there, and that is what gets restocked when it's ticked off), else buyAmount.
 * Null when buying isn't the obvious next step (stocked, not low, not on the list).
 */
export function boughtAmount(item: Item, s: ItemStatus): number | null {
  if (item.shopping?.amount && item.shopping.amount > 0) return item.shopping.amount;
  if (s.out || s.low) return buyAmount(item);
  return null;
}

/** How much one tap on +/- changes, by unit. */
export function stepFor(unit: string): number {
  switch (unit) {
    case "g":
    case "ml":
      return 100;
    case "kg":
    case "l":
      return 0.5;
    default:
      return 1;
  }
}

const CATEGORY_ICONS: Record<string, string> = {
  food: "mdi:food-apple-outline",
  drinks: "mdi:bottle-soda-classic-outline",
  frozen: "mdi:snowflake",
  cleaning: "mdi:spray-bottle",
  toiletries: "mdi:paper-roll-outline",
  household: "mdi:home-variant-outline",
  baby: "mdi:baby-bottle-outline",
  pets: "mdi:paw-outline",
  medicine: "mdi:pill",
  other: "mdi:package-variant-closed",
};
const LOCATION_ICONS: Record<string, string> = {
  pantry: "mdi:cupboard-outline",
  fridge: "mdi:fridge-outline",
  freezer: "mdi:snowflake",
  bathroom: "mdi:shower",
  cleaning: "mdi:spray-bottle",
};

export function itemIcon(item: Item): string {
  return (
    item.icon ||
    (item.category && CATEGORY_ICONS[item.category]) ||
    (item.location && LOCATION_ICONS[item.location]) ||
    "mdi:package-variant-closed"
  );
}

export const norm = (s: string | null | undefined) => (s ?? "").trim().toLocaleLowerCase();

/** Items the card is set up to show at all (its locations/categories scope). */
export function scoped(items: Item[], config: StockPulseCardConfig): Item[] {
  const locations = (config.locations ?? []).map(norm);
  const categories = (config.categories ?? []).map(norm);
  return items.filter(
    (i) =>
      (!locations.length || locations.includes(norm(i.location))) &&
      (!categories.length || categories.includes(norm(i.category)))
  );
}

/** A filter chip: a status, or a location / category value. */
export type Filter =
  | { kind: "all" }
  | { kind: "low" }
  | { kind: "expiring" }
  | { kind: "list" }
  | { kind: "location"; value: string }
  | { kind: "category"; value: string };

export function matchesQuery(item: Item, query: string): boolean {
  const q = norm(query);
  if (!q) return true;
  return [item.name, item.notes, item.category, item.location, ...(item.barcodes ?? [])].some((f) => norm(f).includes(q));
}

export function applyFilter(
  items: Item[],
  filter: Filter,
  query: string,
  statuses: Map<string, ItemStatus>,
  hideOut: boolean
): Item[] {
  return items.filter((item) => {
    const s = statuses.get(item.id)!;
    if (!matchesQuery(item, query)) return false;
    switch (filter.kind) {
      case "low":
        return needsStock(s);
      case "expiring":
        return s.expired || s.soon;
      case "list":
        return s.onList;
      case "location":
        return norm(item.location) === norm(filter.value) && !(hideOut && s.out && !query);
      case "category":
        return norm(item.category) === norm(filter.value) && !(hideOut && s.out && !query);
      default:
        // "Out of stock" is hidden on the plain list only; the status filters still find it.
        return !(hideOut && s.out && !query);
    }
  });
}

export function sortItems(items: Item[], sort: SortBy, statuses: Map<string, ItemStatus>): Item[] {
  const byName = (a: Item, b: Item) => a.name.localeCompare(b.name, undefined, { sensitivity: "base" });
  const sorted = [...items];
  if (sort === "quantity") {
    sorted.sort((a, b) => a.quantity - b.quantity || byName(a, b));
  } else if (sort === "expiry") {
    const key = (i: Item) => statuses.get(i.id)?.days ?? Number.POSITIVE_INFINITY;
    sorted.sort((a, b) => key(a) - key(b) || byName(a, b));
  } else {
    sorted.sort(byName);
  }
  return sorted;
}

export interface Group {
  /** Category/location value, or "" for items without one. */
  key: string;
  items: Item[];
}

/**
 * Group in the order the integration lists its built-in keys, then custom values A-Z,
 * then items without a value. The item order inside a group is kept.
 */
export function groupItems(items: Item[], by: GroupBy, builtIn: string[]): Group[] {
  if (by === "none") return [{ key: "", items }];
  const groups = new Map<string, Item[]>();
  for (const item of items) {
    const key = (by === "category" ? item.category : item.location) ?? "";
    const list = groups.get(key);
    if (list) list.push(item);
    else groups.set(key, [item]);
  }
  const rank = (key: string) => {
    if (!key) return [2, ""] as const;
    const i = builtIn.indexOf(key);
    return i >= 0 ? ([0, String(i).padStart(3, "0")] as const) : ([1, key.toLocaleLowerCase()] as const);
  };
  return [...groups.entries()]
    .sort(([a], [b]) => {
      const [ra, ka] = rank(a);
      const [rb, kb] = rank(b);
      return ra - rb || ka.localeCompare(kb);
    })
    .map(([key, list]) => ({ key, items: list }));
}

/** The values present for a field, built-in ones first in their order, then the rest A-Z. */
export function presentValues(items: Item[], field: "location" | "category", builtIn: string[]): string[] {
  const seen = new Set(items.map((i) => i[field]).filter((v): v is string => !!v));
  const known = builtIn.filter((k) => seen.has(k));
  const custom = [...seen].filter((v) => !builtIn.includes(v)).sort((a, b) => a.localeCompare(b));
  return [...known, ...custom];
}

/**
 * The value chips of one kind: nothing unless two or more values are present (one chip would
 * filter nothing), and the selected value stays even when its items are gone, so it can be tapped off.
 */
export function chipValues(present: string[], filter: Filter, kind: "location" | "category"): string[] {
  const values = present.length > 1 ? [...present] : [];
  if (filter.kind === kind && !values.includes(filter.value)) values.push(filter.value);
  return values;
}

/** Only the fields that changed, with "" turned into null. */
export function diffFields<T extends Record<string, unknown>>(before: Partial<T>, after: Partial<T>): Partial<T> {
  const out: Record<string, unknown> = {};
  for (const [key, raw] of Object.entries(after)) {
    const value = raw === "" || raw === undefined ? null : raw;
    const prev = (before as Record<string, unknown>)[key] ?? null;
    if (value !== prev) out[key] = value;
  }
  return out as Partial<T>;
}

/** "520 1127, 5208069003184" -> ["5201127", "5208069003184"]: what the sheet's text field holds, as a list. */
export function parseBarcodes(text: string | null | undefined): string[] {
  const out: string[] = [];
  for (const part of String(text ?? "").split(/[,;\n]+/)) {
    const code = part.replace(/[\s-]/g, "");
    if (code && !out.includes(code)) out.push(code);
  }
  return out;
}

export function formatBarcodes(codes: string[] | null | undefined): string {
  return (codes ?? []).join(", ");
}

/** Digits a camera or a handheld scanner gives for a product barcode (EAN-8/13, UPC-A/E). */
export function looksLikeBarcode(text: string): boolean {
  return /^\d{6,14}$/.test(text.replace(/[\s-]/g, ""));
}
