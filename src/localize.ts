import type { HomeAssistant } from "./types";

type Dict = Record<string, string>;

const en: Dict = {
  search_or_add: "Search or add…",
  add_item: "Add item",
  add_named: "Add “{name}”",
  new_item: "New item",
  close: "Close",
  save: "Save",
  cancel: "Cancel",
  delete: "Delete",
  delete_confirm: "Tap again to delete",
  add_to_list: "Add to shopping list",
  remove_from_list: "Remove from list",
  bought: "Bought",
  bought_aria: "Bought: add {amount} to the stock",
  restocked: "{name}: +{amount}",
  increase: "Add {step}",
  decrease: "Use {step}",

  chip_all: "All",
  chip_low: "Low",
  chip_expiring: "Expiring",
  chip_list: "On list",

  n_items: "{n} items",
  n_items_one: "1 item",
  n_low: "{n} low",
  n_expiring: "{n} expiring",
  n_on_list: "{n} on the list",
  all_stocked: "All stocked up",

  empty: "Nothing here yet",
  empty_hint: "Add what you keep at home and the card keeps count.",
  no_match: "No items match",

  out_of_stock: "Out of stock",
  low: "Low",
  expires_today: "Expires today",
  expires_tomorrow: "Expires tomorrow",
  expires_in: "Expires in {n} days",
  expires_on: "Best before {date}",
  expired_yesterday: "Expired yesterday",
  expired_ago: "Expired {n} days ago",
  on_list: "On the shopping list",
  no_category: "Uncategorised",
  no_location: "No location",
  everything: "Everything",

  f_name: "Name",
  f_quantity: "Quantity",
  f_unit: "Unit",
  f_category: "Category",
  f_location: "Location",
  f_expiry: "Best before",
  f_min_quantity: "Low at",
  f_restock_quantity: "Buy amount",
  f_auto_shop: "Add to the shopping list when low",
  f_notes: "Notes",
  f_icon: "Icon",
  h_min_quantity: "At or below this it counts as low",
  h_restock_quantity: "Empty: just enough to get back above it",

  not_installed: "The Stock Pulse integration isn't set up yet. Add it in Settings → Devices & services.",
  not_found: "Inventory “{inventory}” was not found.",
  failed: "Something went wrong: {error}",

  unit_pcs: "pieces",
  unit_pcs_one: "piece",
  unit_pack: "packs",
  unit_pack_one: "pack",
  unit_roll: "rolls",
  unit_roll_one: "roll",
  unit_bottle: "bottles",
  unit_bottle_one: "bottle",
  unit_can: "cans",
  unit_can_one: "can",
  unit_box: "boxes",
  unit_box_one: "box",
  unit_bag: "bags",
  unit_bag_one: "bag",
  unit_jar: "jars",
  unit_jar_one: "jar",
  unit_kg: "kg",
  unit_g: "g",
  unit_l: "L",
  unit_ml: "ml",

  cat_food: "Food",
  cat_drinks: "Drinks",
  cat_frozen: "Frozen",
  cat_cleaning: "Cleaning",
  cat_toiletries: "Toiletries",
  cat_household: "Household",
  cat_baby: "Baby",
  cat_pets: "Pets",
  cat_medicine: "Medicine",
  cat_other: "Other",

  loc_pantry: "Pantry",
  loc_fridge: "Fridge",
  loc_freezer: "Freezer",
  loc_bathroom: "Bathroom",
  loc_cleaning: "Cleaning cupboard",
  loc_other: "Other",

  ed_inventory: "Inventory",
  ed_title: "Title",
  ed_icon: "Icon",
  ed_group_by: "Group by",
  ed_sort: "Sort by",
  group_category: "Category",
  group_location: "Location",
  group_none: "Nothing",
  sort_name: "Name",
  sort_quantity: "Quantity (lowest first)",
  sort_expiry: "Best before (soonest first)",
  ed_locations: "Only show these locations",
  ed_categories: "Only show these categories",
  ed_show_search: "Search and quick add",
  ed_show_filters: "Filter chips",
  ed_hide_out_of_stock: "Hide items that ran out",
  ed_compact: "Compact rows",
  ed_max_height: "Maximum list height (e.g. 480px)",
};

const el: Dict = {
  search_or_add: "Αναζήτηση ή προσθήκη…",
  add_item: "Προσθήκη είδους",
  add_named: "Προσθήκη «{name}»",
  new_item: "Νέο είδος",
  close: "Κλείσιμο",
  save: "Αποθήκευση",
  cancel: "Ακύρωση",
  delete: "Διαγραφή",
  delete_confirm: "Πατήστε ξανά για διαγραφή",
  add_to_list: "Στη λίστα αγορών",
  remove_from_list: "Αφαίρεση από τη λίστα",
  bought: "Αγοράστηκε",
  bought_aria: "Αγοράστηκε: πρόσθεσε {amount} στο απόθεμα",
  restocked: "{name}: +{amount}",
  increase: "Πρόσθεσε {step}",
  decrease: "Αφαίρεσε {step}",

  chip_all: "Όλα",
  chip_low: "Τελειώνουν",
  chip_expiring: "Λήγουν",
  chip_list: "Στη λίστα",

  n_items: "{n} είδη",
  n_items_one: "1 είδος",
  n_low: "{n} τελειώνουν",
  n_expiring: "{n} λήγουν",
  n_on_list: "{n} στη λίστα",
  all_stocked: "Τίποτα δεν λείπει",

  empty: "Δεν υπάρχει τίποτα ακόμη",
  empty_hint: "Προσθέστε ό,τι έχετε στο σπίτι και η κάρτα κρατά λογαριασμό.",
  no_match: "Κανένα είδος δεν ταιριάζει",

  out_of_stock: "Τελείωσε",
  low: "Τελειώνει",
  expires_today: "Λήγει σήμερα",
  expires_tomorrow: "Λήγει αύριο",
  expires_in: "Λήγει σε {n} ημέρες",
  expires_on: "Ανάλωση έως {date}",
  expired_yesterday: "Έληξε χθες",
  expired_ago: "Έληξε πριν {n} ημέρες",
  on_list: "Στη λίστα αγορών",
  no_category: "Χωρίς κατηγορία",
  no_location: "Χωρίς θέση",
  everything: "Όλα",

  f_name: "Όνομα",
  f_quantity: "Ποσότητα",
  f_unit: "Μονάδα",
  f_category: "Κατηγορία",
  f_location: "Θέση",
  f_expiry: "Ανάλωση έως",
  f_min_quantity: "Τελειώνει στα",
  f_restock_quantity: "Ποσότητα αγοράς",
  f_auto_shop: "Στη λίστα αγορών όταν τελειώνει",
  f_notes: "Σημειώσεις",
  f_icon: "Εικονίδιο",
  h_min_quantity: "Σε αυτή την ποσότητα ή λιγότερο θεωρείται ότι τελειώνει",
  h_restock_quantity: "Κενό: όσο χρειάζεται για να ξεπεράσει το όριο",

  not_installed: "Η ενσωμάτωση Stock Pulse δεν έχει ρυθμιστεί. Προσθέστε τη στις Ρυθμίσεις → Συσκευές & υπηρεσίες.",
  not_found: "Δεν βρέθηκε το απόθεμα «{inventory}».",
  failed: "Κάτι πήγε στραβά: {error}",

  unit_pcs: "τεμάχια",
  unit_pcs_one: "τεμάχιο",
  unit_pack: "πακέτα",
  unit_pack_one: "πακέτο",
  unit_roll: "ρολά",
  unit_roll_one: "ρολό",
  unit_bottle: "μπουκάλια",
  unit_bottle_one: "μπουκάλι",
  unit_can: "κουτάκια",
  unit_can_one: "κουτάκι",
  unit_box: "κουτιά",
  unit_box_one: "κουτί",
  unit_bag: "σακούλες",
  unit_bag_one: "σακούλα",
  unit_jar: "βάζα",
  unit_jar_one: "βάζο",
  unit_kg: "kg",
  unit_g: "g",
  unit_l: "L",
  unit_ml: "ml",

  cat_food: "Τρόφιμα",
  cat_drinks: "Ποτά",
  cat_frozen: "Κατεψυγμένα",
  cat_cleaning: "Καθαριστικά",
  cat_toiletries: "Είδη υγιεινής",
  cat_household: "Οικιακά",
  cat_baby: "Μωρό",
  cat_pets: "Κατοικίδια",
  cat_medicine: "Φάρμακα",
  cat_other: "Άλλο",

  loc_pantry: "Ντουλάπι",
  loc_fridge: "Ψυγείο",
  loc_freezer: "Καταψύκτης",
  loc_bathroom: "Μπάνιο",
  loc_cleaning: "Ντουλάπι καθαριστικών",
  loc_other: "Άλλο",

  ed_inventory: "Απόθεμα",
  ed_title: "Τίτλος",
  ed_icon: "Εικονίδιο",
  ed_group_by: "Ομαδοποίηση",
  ed_sort: "Ταξινόμηση",
  group_category: "Κατηγορία",
  group_location: "Θέση",
  group_none: "Καμία",
  sort_name: "Όνομα",
  sort_quantity: "Ποσότητα (λιγότερα πρώτα)",
  sort_expiry: "Ανάλωση (πλησιέστερη πρώτα)",
  ed_locations: "Μόνο αυτές οι θέσεις",
  ed_categories: "Μόνο αυτές οι κατηγορίες",
  ed_show_search: "Αναζήτηση και γρήγορη προσθήκη",
  ed_show_filters: "Φίλτρα",
  ed_hide_out_of_stock: "Απόκρυψη ειδών που τελείωσαν",
  ed_compact: "Συμπαγείς γραμμές",
  ed_max_height: "Μέγιστο ύψος λίστας (π.χ. 480px)",
};

export const DICTS: Record<string, Dict> = { en, el };

export function lang(hass?: HomeAssistant): string {
  return (hass?.locale?.language || hass?.language || "en").split("-")[0];
}

export function localize(hass: HomeAssistant | undefined, key: string, vars?: Record<string, string | number>): string {
  const dict = DICTS[lang(hass)] ?? en;
  const n = vars?.n;
  const pluralKey = n === 1 || n === "1" ? `${key}_one` : undefined;
  let text = (pluralKey && (dict[pluralKey] ?? en[pluralKey])) || dict[key] || en[key] || key;
  if (vars) for (const [k, v] of Object.entries(vars)) text = text.replaceAll(`{${k}}`, String(v));
  return text;
}

/** Translated name of a built-in key; custom values are shown as typed. */
export function labelFor(
  hass: HomeAssistant | undefined,
  prefix: "unit" | "cat" | "loc",
  value: string | null | undefined,
  amount = 2
): string {
  if (!value) return "";
  const key = `${prefix}_${value}`;
  if (!(key in en)) return value;
  return localize(hass, key, prefix === "unit" ? { n: amount } : undefined);
}

/**
 * The edit sheet shows names ("Rolls", "Freezer") rather than keys, because a combo box that
 * accepts your own words displays its raw value. These two map between the two forms.
 */
export function toFormValue(
  hass: HomeAssistant | undefined,
  prefix: "unit" | "cat" | "loc",
  key: string | null | undefined
): string | undefined {
  if (!key) return undefined;
  const label = labelFor(hass, prefix, key);
  // "rolls" reads as a list choice when capitalised like the categories; "kg" and "ml" stay as they are.
  const builtIn = `${prefix}_${key}` in en;
  return prefix === "unit" && builtIn && label.length > 2 && label === label.toLocaleLowerCase()
    ? label.charAt(0).toLocaleUpperCase() + label.slice(1)
    : label;
}

export function fromFormValue(
  hass: HomeAssistant | undefined,
  prefix: "unit" | "cat" | "loc",
  text: string | null | undefined,
  builtIn: string[]
): string | null {
  const value = (text ?? "").trim();
  if (!value) return null;
  const wanted = value.toLocaleLowerCase();
  for (const key of builtIn) {
    const names = [key, labelFor(hass, prefix, key), labelFor(undefined, prefix, key)];
    if (prefix === "unit") names.push(labelFor(hass, prefix, key, 1), labelFor(undefined, prefix, key, 1));
    if (names.some((n) => n.toLocaleLowerCase() === wanted)) return key;
  }
  return value;
}
