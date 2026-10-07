// Minimal Home Assistant frontend types used by the card, kept local (no custom-card-helpers).

export interface HassEntity {
  entity_id: string;
  state: string;
  attributes: Record<string, unknown> & { friendly_name?: string };
}

export interface HassConnection {
  subscribeMessage: <T>(
    callback: (msg: T) => void,
    msg: Record<string, unknown>
  ) => Promise<() => Promise<void> | void>;
}

export interface HomeAssistant {
  states: Record<string, HassEntity>;
  language: string;
  locale?: { language: string };
  themes?: { darkMode?: boolean };
  connection: HassConnection;
  callWS: <T>(msg: Record<string, unknown>) => Promise<T>;
}

/** One item as stored by the integration. */
export interface Item {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  category: string | null;
  location: string | null;
  /** ISO date (YYYY-MM-DD). */
  expiry: string | null;
  /** At or below this the item is low. */
  min_quantity: number | null;
  /** How much to buy; null means "just enough to get above the threshold". */
  restock_quantity: number | null;
  auto_shop: boolean;
  notes: string | null;
  icon: string | null;
  created: string;
  updated: string;
  shopping: { uid: string | null; summary: string; amount: number; auto: boolean } | null;
  shopping_dismissed: boolean;
}

export type ItemFields = Partial<
  Pick<
    Item,
    | "name"
    | "quantity"
    | "unit"
    | "category"
    | "location"
    | "expiry"
    | "min_quantity"
    | "restock_quantity"
    | "auto_shop"
    | "notes"
    | "icon"
  >
>;

/** What the integration sends on subscribe and after every change. */
export interface Snapshot {
  entry_id: string;
  title: string;
  version: string;
  items: Item[];
  settings: {
    shopping_list: string | null;
    auto_add: boolean;
    auto_restock: boolean;
    expiring_days: number;
  };
  units: string[];
  locations: string[];
  categories: string[];
}

export type GroupBy = "category" | "location" | "none";
export type SortBy = "name" | "quantity" | "expiry";

export interface StockPulseCardConfig {
  type: string;
  /** Config entry id or title of the inventory. Optional when there is only one. */
  inventory?: string;
  /** Card title; defaults to the inventory's name. */
  title?: string;
  icon?: string;
  /** Default "category". */
  group_by?: GroupBy;
  /** Default "name". */
  sort?: SortBy;
  /** Only show items in these locations (keys or your own names). */
  locations?: string[];
  /** Only show items in these categories. */
  categories?: string[];
  /** Default true. */
  show_search?: boolean;
  /** Default true. */
  show_filters?: boolean;
  /** Default false. */
  hide_out_of_stock?: boolean;
  /** Tighter rows. Default false. */
  compact?: boolean;
  /** CSS length; the list scrolls inside the card above this height. */
  max_height?: string;
}
