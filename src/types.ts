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
  /** In the companion app: the bus to the app (its native barcode scanner, among others). */
  auth?: { external?: ExternalBus };
}

/** A command the companion app sends to the frontend over the external bus. */
export interface ExternalCommand {
  id?: number;
  type: "command";
  command: string;
  payload?: Record<string, unknown>;
}

/**
 * The companion app's external bus as the HA frontend exposes it on hass.auth.external. Only the parts
 * the card uses. The command handler is a single slot the frontend fills; the card chains onto it while
 * its scan is open and puts it back afterwards.
 */
export interface ExternalBus {
  config?: { hasBarCodeScanner?: number | boolean };
  fireMessage(msg: Record<string, unknown>): void;
  addCommandHandler(handler: ((msg: ExternalCommand) => boolean) | undefined): void;
  _commandHandler?: (msg: ExternalCommand) => boolean;
}

/** Packs of an item that share a best-before date. */
export interface Batch {
  quantity: number;
  /** ISO date (YYYY-MM-DD), or null when this batch has none. */
  expiry: string | null;
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
  /** EAN/UPC digits; scanning one of them finds this item. Missing on items stored before 1.3.0. */
  barcodes?: string[];
  /** ISO date the pack in use was opened. Missing on items stored before 1.3.0. */
  opened_on?: string | null;
  /** Days it keeps once opened; with opened_on it can bring the date forward. */
  days_after_opening?: number | null;
  /**
   * Two or more packs with their own dates, soonest first (undated last); empty for an item with one date.
   * quantity is then their total and expiry the earliest date. Missing on items stored before 1.5.0.
   */
  batches?: Batch[];
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
    | "barcodes"
    | "opened_on"
    | "days_after_opening"
    | "batches"
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
    /** The inventory's Batches option: the sheet offers "Add a batch". Missing before 1.5.0. */
    batches?: boolean;
  };
  units: string[];
  locations: string[];
  categories: string[];
}

/** What stock_pulse/item/lookup answers for a scanned barcode. */
export interface LookupResult {
  barcode: string;
  /** The item that already has this barcode. */
  item_id: string | null;
  /** Fields to prefill a new item with, from the open product databases. */
  product: { name: string; category: string | null; notes: string | null; image: string | null } | null;
  source: string | null;
  /** Set when the databases couldn't be reached. */
  error: string | null;
}

export type GroupBy = "category" | "location" | "none";
export type SortBy = "name" | "quantity" | "expiry";
export type FilterBy = "location" | "category" | "both" | "none";

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
  /** Value chips after the status chips. Default "location". */
  filter_by?: FilterBy;
  /** Only show items in these locations (keys or your own names). */
  locations?: string[];
  /** Only show items in these categories. */
  categories?: string[];
  /** Default true. */
  show_search?: boolean;
  /** Default true. */
  show_filters?: boolean;
  /** Scan button in the header, where the browser can scan (HTTPS). Default true. */
  show_scan?: boolean;
  /** Default false. */
  hide_out_of_stock?: boolean;
  /** Tighter rows. Default false. */
  compact?: boolean;
  /** CSS length; the list scrolls inside the card above this height. */
  max_height?: string;
}
