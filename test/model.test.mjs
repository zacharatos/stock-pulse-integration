import { test } from "node:test";
import assert from "node:assert/strict";

import {
  applyFilter,
  boughtAmount,
  buyAmount,
  chipValues,
  daysBetween,
  diffFields,
  effectiveExpiry,
  fmtQty,
  formatBarcodes,
  groupItems,
  itemStatus,
  looksLikeBarcode,
  matchesQuery,
  openPackFinished,
  parseBarcodes,
  presentValues,
  scoped,
  sortItems,
  stepFor,
  todayISO,
} from "../src/model.ts";
import { labelFor, localize } from "../src/localize.ts";

const base = {
  unit: "pcs", category: null, location: null, expiry: null, min_quantity: null, restock_quantity: null,
  auto_shop: true, notes: null, icon: null, created: "", updated: "", shopping: null, shopping_dismissed: false,
};
const item = (id, name, extra = {}) => ({ ...base, id, name, quantity: 1, ...extra });
const TODAY = "2026-10-07";

const items = [
  item("a", "Toilet paper", { quantity: 2, min_quantity: 2, unit: "roll", category: "toiletries", location: "bathroom" }),
  item("b", "Peas", { quantity: 1, category: "frozen", location: "freezer", expiry: "2026-10-09" }),
  item("c", "Ham", { quantity: 1, category: "food", location: "fridge", expiry: "2026-10-05" }),
  item("d", "Pasta", { quantity: 0, category: "food", location: "pantry", shopping: { uid: "x", summary: "Pasta", amount: 1, auto: true } }),
  item("e", "Kombucha", { quantity: 3, category: "Ferments", location: "fridge" }),
];
const statuses = new Map(items.map((i) => [i.id, itemStatus(i, TODAY, 3)]));

test("status", () => {
  assert.deepEqual(statuses.get("a"), { out: false, low: true, days: null, expired: false, soon: false, onList: false, byOpening: false, openedDays: null });
  assert.equal(statuses.get("b").soon, true);
  assert.equal(statuses.get("c").expired, true);
  assert.equal(statuses.get("d").out, true);
  assert.equal(statuses.get("d").onList, true);
  // An empty item's old date doesn't count as expired.
  assert.equal(itemStatus(item("z", "z", { quantity: 0, expiry: "2020-01-01" }), TODAY, 3).expired, false);
});

test("dates", () => {
  assert.equal(daysBetween("2026-10-07", "2026-10-09"), 2);
  assert.equal(daysBetween("2026-10-07", "2026-10-06"), -1);
  assert.equal(daysBetween("2026-03-28", "2026-03-30"), 2); // across a DST change
  assert.equal(todayISO(new Date(2026, 0, 5, 23, 30)), "2026-01-05");
});

test("filters", () => {
  const ids = (list) => list.map((i) => i.id).sort().join("");
  assert.equal(ids(applyFilter(items, { kind: "all" }, "", statuses, false)), "abcde");
  assert.equal(ids(applyFilter(items, { kind: "all" }, "", statuses, true)), "abce");
  assert.equal(ids(applyFilter(items, { kind: "low" }, "", statuses, true)), "ad");
  assert.equal(ids(applyFilter(items, { kind: "expiring" }, "", statuses, false)), "bc");
  assert.equal(ids(applyFilter(items, { kind: "list" }, "", statuses, false)), "d");
  assert.equal(ids(applyFilter(items, { kind: "location", value: "fridge" }, "", statuses, false)), "ce");
  assert.equal(ids(applyFilter(items, { kind: "all" }, "  PEA ", statuses, false)), "b");
  // A search finds an empty item even when those are hidden.
  assert.equal(ids(applyFilter(items, { kind: "all" }, "pasta", statuses, true)), "d");
});

test("category chips filter by category, with search, hiding what ran out", () => {
  const ids = (list) => list.map((i) => i.id).sort().join("");
  const food = { kind: "category", value: "food" };
  assert.equal(ids(applyFilter(items, food, "", statuses, false)), "cd");
  // Like the plain list, a category or location chip hides what ran out ...
  assert.equal(ids(applyFilter(items, food, "", statuses, true)), "c");
  assert.equal(ids(applyFilter(items, { kind: "location", value: "pantry" }, "", statuses, true)), "");
  assert.equal(ids(applyFilter(items, { kind: "location", value: "fridge" }, "", statuses, true)), "ce");
  // ... unless you are searching, and the search narrows within the chip.
  assert.equal(ids(applyFilter(items, food, "pasta", statuses, true)), "d");
  assert.equal(ids(applyFilter(items, food, "ham", statuses, true)), "c");
  // Names match without regard to case or spaces around them; your own categories work too.
  assert.equal(ids(applyFilter(items, { kind: "category", value: " ferments " }, "", statuses, false)), "e");
  // An item without a category never matches a category chip.
  const loose = [...items, item("f", "Mystery")];
  const looseStatuses = new Map(loose.map((i) => [i.id, itemStatus(i, TODAY, 3)]));
  assert.equal(ids(applyFilter(loose, food, "", looseStatuses, false)), "cd");
  assert.equal(ids(applyFilter(loose, { kind: "all" }, "", looseStatuses, false)), "abcdef");
});

test("value chips: two or more values, and the selected one stays", () => {
  const all = { kind: "all" };
  assert.deepEqual(chipValues(["food", "frozen"], all, "category"), ["food", "frozen"]);
  // One value would filter nothing.
  assert.deepEqual(chipValues(["food"], all, "category"), []);
  assert.deepEqual(chipValues([], all, "location"), []);
  // The selected value stays when its items are gone, so it can be tapped off.
  assert.deepEqual(chipValues(["food", "frozen"], { kind: "category", value: "baby" }, "category"), ["food", "frozen", "baby"]);
  assert.deepEqual(chipValues([], { kind: "location", value: "fridge" }, "location"), ["fridge"]);
  assert.deepEqual(chipValues(["food"], { kind: "category", value: "food" }, "category"), ["food"]);
  // A selected chip of the other kind is not added.
  assert.deepEqual(chipValues(["pantry", "fridge"], { kind: "category", value: "baby" }, "location"), ["pantry", "fridge"]);
  // Built-in order first, then your own A to Z.
  assert.deepEqual(
    chipValues(presentValues(items, "category", ["food", "drinks", "frozen", "cleaning", "toiletries"]), all, "category"),
    ["food", "frozen", "toiletries", "Ferments"]
  );
});

test("scope", () => {
  assert.deepEqual(scoped(items, { type: "x", locations: ["Freezer"] }).map((i) => i.id), ["b"]);
  assert.deepEqual(scoped(items, { type: "x", categories: ["food"] }).map((i) => i.id), ["c", "d"]);
});

test("sorting", () => {
  assert.deepEqual(sortItems(items, "name", statuses).map((i) => i.name), ["Ham", "Kombucha", "Pasta", "Peas", "Toilet paper"]);
  assert.deepEqual(sortItems(items, "quantity", statuses).map((i) => i.id), ["d", "c", "b", "a", "e"]);
  assert.deepEqual(sortItems(items, "expiry", statuses).map((i) => i.id), ["c", "b", "e", "d", "a"]);
});

test("grouping keeps built-in order, then custom, then none", () => {
  const groups = groupItems([...items, item("f", "Mystery")], "category", ["food", "frozen", "toiletries"]);
  assert.deepEqual(groups.map((g) => g.key), ["food", "frozen", "toiletries", "Ferments", ""]);
  assert.equal(groupItems(items, "none", []).length, 1);
  assert.deepEqual(presentValues(items, "location", ["pantry", "fridge", "freezer", "bathroom"]), ["pantry", "fridge", "freezer", "bathroom"]);
});

test("numbers and steps", () => {
  assert.equal(fmtQty(2), "2");
  assert.equal(fmtQty(0.5), "0.5");
  assert.equal(fmtQty(1.333333), "1.33");
  assert.equal(stepFor("g"), 100);
  assert.equal(stepFor("kg"), 0.5);
  assert.equal(stepFor("roll"), 1);
});

test("buy amounts match the integration's rule", () => {
  // Same cases as buy_amount in logic.py: explicit amount wins, else just above the threshold, at least one.
  assert.equal(buyAmount(item("x", "x", { quantity: 2, min_quantity: 2, restock_quantity: 9 })), 9);
  assert.equal(buyAmount(item("x", "x", { quantity: 2, min_quantity: 2 })), 1);
  assert.equal(buyAmount(item("x", "x", { quantity: 0, min_quantity: 3 })), 4);
  assert.equal(buyAmount(item("x", "x", { quantity: 0.5, min_quantity: 1 })), 1);
  assert.equal(buyAmount(item("x", "x", { quantity: 0 })), 1);
});

test("the Bought button offers the list's amount, else what's needed, else nothing", () => {
  // On the list: the entry's amount (it may have been changed there).
  assert.equal(boughtAmount(items[3], statuses.get("d")), 1);
  const edited = item("p", "Paper", { quantity: 2, min_quantity: 2, restock_quantity: 9, shopping: { uid: "u", summary: "Paper (12)", amount: 12, auto: true } });
  assert.equal(boughtAmount(edited, itemStatus(edited, TODAY, 3)), 12);
  // Low but not on the list: the buy amount.
  assert.equal(boughtAmount(items[0], statuses.get("a")), 1);
  // Stocked and not on the list: no button.
  assert.equal(boughtAmount(items[4], statuses.get("e")), null);
});

test("diff only sends what changed", () => {
  assert.deepEqual(diffFields({ name: "A", notes: null, quantity: 1 }, { name: "A", notes: "", quantity: 2 }), { quantity: 2 });
  assert.deepEqual(diffFields({ expiry: "2026-10-10" }, { expiry: undefined }), { expiry: null });
});

test("localize with plurals and custom values", () => {
  const el = { language: "el" };
  assert.equal(localize(undefined, "n_items", { n: 1 }), "1 item");
  assert.equal(localize(undefined, "n_items", { n: 3 }), "3 items");
  assert.equal(localize(el, "n_items", { n: 1 }), "1 είδος");
  assert.equal(labelFor(undefined, "unit", "roll", 1), "roll");
  assert.equal(labelFor(el, "unit", "roll", 4), "ρολά");
  assert.equal(labelFor(undefined, "loc", "Garage"), "Garage");
});

test("both languages have the same keys", async () => {
  const { DICTS } = await import("../src/localize.ts");
  const enKeys = Object.keys(DICTS.en).sort();
  assert.deepEqual(Object.keys(DICTS.el).sort(), enKeys);
});

test("the edit sheet shows names and stores keys", async () => {
  const { toFormValue, fromFormValue } = await import("../src/localize.ts");
  const el = { language: "el" };
  const units = ["pcs", "roll", "kg"];
  assert.equal(toFormValue(undefined, "unit", "roll"), "Rolls");
  assert.equal(toFormValue(undefined, "unit", "kg"), "kg");
  assert.equal(toFormValue(el, "loc", "freezer"), "Καταψύκτης");
  assert.equal(toFormValue(undefined, "cat", "Ferments"), "Ferments");
  assert.equal(toFormValue(undefined, "unit", "cartons"), "cartons"); // your own words stay as typed
  assert.equal(fromFormValue(undefined, "unit", "Rolls", units), "roll");
  assert.equal(fromFormValue(undefined, "unit", "roll", units), "roll");
  assert.equal(fromFormValue(el, "unit", "Ρολά", units), "roll");
  assert.equal(fromFormValue(el, "loc", "Freezer", ["freezer"]), "freezer");
  assert.equal(fromFormValue(undefined, "unit", " cartons ", units), "cartons");
  assert.equal(fromFormValue(undefined, "cat", "", []), null);
});

test("barcodes: the sheet's text field, scanner input, and search", () => {
  assert.deepEqual(parseBarcodes("5201127090423, 520-8069 003184;5201127090423"), ["5201127090423", "5208069003184"]);
  assert.deepEqual(parseBarcodes(""), []);
  assert.deepEqual(parseBarcodes(undefined), []);
  assert.equal(formatBarcodes(["5201127090423", "5208069003184"]), "5201127090423, 5208069003184");
  assert.equal(formatBarcodes(undefined), "");
  assert.ok(looksLikeBarcode("5202576461208"));
  assert.ok(looksLikeBarcode("9638 5074")); // EAN-8 with a space
  assert.ok(!looksLikeBarcode("Milk"));
  assert.ok(!looksLikeBarcode("12345")); // too short to be a product code
  const gouda = item("g", "Gouda", { barcodes: ["5202576461208"] });
  assert.ok(matchesQuery(gouda, "520257646"));
  // Items stored before barcodes existed have no field at all.
  assert.ok(!matchesQuery(item("x", "Milk"), "520"));
});

test("an opened pack counts from opening, like the integration", () => {
  const turkey = item("t", "Smoked turkey", { expiry: "2026-12-29", opened_on: "2026-10-01", days_after_opening: 10 });
  assert.deepEqual(effectiveExpiry(turkey), { date: "2026-10-11", byOpening: true });
  const s = itemStatus(turkey, TODAY, 3);
  assert.equal(s.days, 4);
  assert.equal(s.byOpening, true);
  assert.equal(s.openedDays, 6);
  assert.ok(!s.soon);
  assert.ok(itemStatus(turkey, "2026-10-09", 3).soon);
  assert.ok(itemStatus(turkey, "2026-10-12", 3).expired);
  assert.deepEqual(effectiveExpiry({ ...turkey, expiry: "2026-10-05" }), { date: "2026-10-05", byOpening: false });
  assert.deepEqual(effectiveExpiry(item("m", "Milk")), { date: null, byOpening: false });
  assert.equal(itemStatus(item("m", "Milk"), TODAY, 3).openedDays, null);
});

test("using up the open pack clears its date, like the integration", () => {
  const opened = { opened_on: "2026-10-01" };
  const pcs = item("p", "Turkey", { quantity: 2, ...opened });
  for (const [before, after] of [[2, 1], [3, 2], [1.5, 1], [1, 0], [0, 1]]) assert.ok(openPackFinished(pcs, before, after), `${before} -> ${after}`);
  for (const [before, after] of [[2, 1.5], [2, 3], [2, 2], [0, 0]]) assert.ok(!openPackFinished(pcs, before, after), `${before} -> ${after}`);
  assert.ok(openPackFinished({ ...pcs, unit: "carton" }, 2, 1));
  // Never opened, or stored before the field existed.
  assert.ok(!openPackFinished(item("n", "Turkey"), 2, 1));
  assert.ok(!openPackFinished({ ...pcs, opened_on: null }, 2, 1));
  // Weighed items: the buy amount is the pack size.
  const feta = item("f", "Feta", { unit: "g", restock_quantity: 400, ...opened });
  assert.ok(!openPackFinished(feta, 800, 700));
  assert.ok(openPackFinished(feta, 700, 400));
  assert.ok(openPackFinished(feta, 800, 350));
  assert.ok(!openPackFinished(feta, 400, 300));
  // Without a buy amount only running out clears it.
  const rice = item("r", "Rice", { unit: "kg", ...opened });
  assert.ok(!openPackFinished(rice, 1.5, 1));
  assert.ok(openPackFinished(rice, 1.5, 0));
  // Floating point: 0.3 / 0.1 is not exactly 3.
  assert.ok(openPackFinished(item("k", "Kg", { unit: "kg", restock_quantity: 0.1, ...opened }), 0.3, 0.2));
});
