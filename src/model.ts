// Pure logic: what the card shows, decided from the snapshot and the config. No DOM here.

import type { GroupBy, Item, SortBy, StockPulseCardConfig } from "./types";

export interface ItemStatus {
  out: boolean;
  low: boolean;
  /** Days until the best-before date; negative when past; null without a date. */
  days: number | null;
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

export function itemStatus(item: Item, today: string, soonDays: number): ItemStatus {
  const out = item.quantity <= 0;
  const low = item.min_quantity != null && item.quantity <= item.min_quantity;
  const days = item.expiry ? daysBetween(today, item.expiry) : null;
  // An empty item can't go off: the date belonged to the batch that is gone.
  const expired = !out && days != null && days < 0;
  const soon = !out && days != null && days >= 0 && days <= soonDays;
  return { out, low, days, expired, soon, onList: !!item.shopping };
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
  return [item.name, item.notes, item.category, item.location].some((f) => norm(f).includes(q));
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
        return norm(item.location) === norm(filter.value);
      case "category":
        return norm(item.category) === norm(filter.value);
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
