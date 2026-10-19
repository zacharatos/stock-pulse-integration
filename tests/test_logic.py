"""The pure rules in logic.py."""

from datetime import date
import json
from pathlib import Path

import pytest

from custom_components.stock_pulse.logic import (
    batch_fields,
    batches_of,
    buy_amount,
    effective_expiry,
    expiry_state,
    fmt_number,
    is_low,
    norm_barcode,
    norm_batches,
    open_pack_finished,
    parse_summary,
    product_suggestion,
    put_batches,
    repair_batches,
    shopping_summary,
    stock_changes,
    take_batches,
)

# The same vectors run in test/model.test.mjs against src/model.ts: the two must agree.
VECTORS = json.loads((Path(__file__).parent.parent / "test" / "batch-vectors.json").read_text())


def test_low_needs_a_threshold():
    assert not is_low({"quantity": 0})
    assert is_low({"quantity": 2, "min_quantity": 2})
    assert not is_low({"quantity": 2.5, "min_quantity": 2})


def test_buy_amount():
    assert buy_amount({"quantity": 2, "min_quantity": 2}) == 1
    assert buy_amount({"quantity": 0, "min_quantity": 2}) == 3
    assert buy_amount({"quantity": 0.5, "min_quantity": 1}) == 1
    assert buy_amount({"quantity": 0, "min_quantity": 2, "restock_quantity": 12}) == 12
    assert buy_amount({"quantity": 0}) == 1


def test_summary_round_trip():
    item = {"name": "Toilet paper", "unit": "roll"}
    assert shopping_summary(item, 6) == "Toilet paper (6 rolls)"
    assert shopping_summary(item, 1, "el") == "Toilet paper (1 ρολό)"
    assert shopping_summary({"name": "Bread", "unit": "pcs"}, 1) == "Bread"
    assert shopping_summary({"name": "Rice", "unit": "kg"}, 0.5) == "Rice (0.5 kg)"
    assert shopping_summary({"name": "Oat milk", "unit": "carton"}, 2) == "Oat milk (2 carton)"
    assert parse_summary("Toilet paper (6 rolls)") == ("Toilet paper", 6)
    assert parse_summary("Rice (0,5 kg)") == ("Rice", 0.5)
    assert parse_summary("Milk") == ("Milk", None)
    assert parse_summary("Cheese (feta)") == ("Cheese (feta)", None)


def test_expiry():
    today = date(2026, 10, 7)
    assert expiry_state({"quantity": 1, "expiry": "2026-10-06"}, today, 3) == "expired"
    assert expiry_state({"quantity": 1, "expiry": "2026-10-07"}, today, 3) == "soon"
    assert expiry_state({"quantity": 1, "expiry": "2026-10-10"}, today, 3) == "soon"
    assert expiry_state({"quantity": 1, "expiry": "2026-10-11"}, today, 3) is None
    assert expiry_state({"quantity": 0, "expiry": "2026-10-01"}, today, 3) is None


def test_fmt_number():
    assert fmt_number(2.0) == "2"
    assert fmt_number(0.25) == "0.25"


def test_barcodes_are_digits_and_upc_becomes_ean():
    assert norm_barcode("5201127090423") == "5201127090423"
    assert norm_barcode(" 520 1127-090423 ") == "5201127090423"
    assert norm_barcode("036000291452") == "0036000291452"  # UPC-A
    assert norm_barcode("96385074") == "96385074"  # EAN-8
    assert norm_barcode("Milk") is None
    assert norm_barcode("12345") is None
    assert norm_barcode(None) is None


def test_product_suggestion():
    product = {
        "product_name": "Soft light",
        "product_name_el": "Βιτάμ Soft light",
        "brands": "Βιτάμ, Flora Food Group",
        "quantity": "225 g",
        "categories_tags": ["en:spreads", "en:margarines"],
        "image_front_small_url": "https://images.example/1.jpg",
    }
    # The HA language first; a brand already in the name isn't repeated in the note.
    assert product_suggestion(product, "openfoodfacts", "el") == {
        "name": "Βιτάμ Soft light", "category": "food", "notes": "225 g", "image": "https://images.example/1.jpg",
    }
    english = product_suggestion(product, "openfoodfacts", "en")
    assert english["name"] == "Soft light" and english["notes"] == "Βιτάμ · 225 g"
    assert product_suggestion({"product_name": "Ice", "categories_tags": ["en:frozen-foods"]}, "openfoodfacts")["category"] == "frozen"
    assert product_suggestion({"product_name": "Shampoo"}, "openbeautyfacts")["category"] == "toiletries"
    assert product_suggestion({"product_name": "Bulb"}, "openproductsfacts")["notes"] is None
    assert product_suggestion({"product_name": " "}, "openfoodfacts") is None


def test_an_opened_pack_counts_from_opening():
    turkey = {"quantity": 1, "expiry": "2026-12-29", "opened_on": "2026-10-05", "days_after_opening": 10}
    assert effective_expiry(turkey) == ("2026-10-15", True)
    assert expiry_state(turkey, date(2026, 10, 13), 3) == "soon"
    assert expiry_state(turkey, date(2026, 10, 16), 3) == "expired"
    # The label's date still wins when it is earlier.
    assert effective_expiry({**turkey, "expiry": "2026-10-10"}) == ("2026-10-10", False)
    # Opened but no keeping time, or a keeping time but not opened: the label's date.
    assert effective_expiry({**turkey, "days_after_opening": None}) == ("2026-12-29", False)
    assert effective_expiry({**turkey, "opened_on": None}) == ("2026-12-29", False)
    assert effective_expiry({"quantity": 1, "opened_on": "2026-10-05", "days_after_opening": 3}) == ("2026-10-08", True)
    # Items stored before these fields existed.
    assert effective_expiry({"quantity": 1}) == (None, False)


OPENED = {"opened_on": "2026-10-05"}


def test_open_pack_finished_counted_units():
    pcs = {"unit": "pcs", "quantity": 2, **OPENED}
    for before, after in [(2, 1), (3, 2), (1.5, 1), (1, 0), (0, 1)]:
        assert open_pack_finished(pcs, before, after), (before, after)
    for before, after in [(2, 1.5), (2, 3), (2, 2), (0, 0)]:
        assert not open_pack_finished(pcs, before, after), (before, after)
    assert open_pack_finished({**pcs, "unit": "carton"}, 2, 1)
    # Never opened, or stored before the field existed.
    assert not open_pack_finished({"unit": "pcs", "opened_on": None}, 2, 1)
    assert not open_pack_finished({"quantity": 2}, 2, 1)
    # No unit at all counts as pieces.
    assert open_pack_finished(OPENED, 2, 1)


def test_open_pack_finished_weighed_units():
    feta = {"unit": "g", "restock_quantity": 400, **OPENED}
    assert not open_pack_finished(feta, 800, 700)
    assert open_pack_finished(feta, 700, 400)
    assert open_pack_finished(feta, 800, 350)
    assert not open_pack_finished(feta, 400, 300)
    # Without a buy amount the pack size is unknown: only running out clears it.
    rice = {"unit": "kg", **OPENED}
    assert not open_pack_finished(rice, 1.5, 1)
    assert open_pack_finished(rice, 1.5, 0)
    assert not open_pack_finished({**rice, "restock_quantity": 0}, 1.5, 1)
    # 0.3 / 0.1 is not exactly 3 in floating point.
    assert open_pack_finished({"unit": "kg", "restock_quantity": 0.1, **OPENED}, 0.3, 0.2)


def test_stock_changes_clears_or_keeps_opened_on():
    turkey = {"unit": "pack", "quantity": 2, **OPENED}
    assert stock_changes(turkey, {"quantity": 1}) == {"quantity": 1, "opened_on": None}
    assert stock_changes(turkey, {"quantity": 1.5}) == {"quantity": 1.5}
    # An opened_on in the same update always wins.
    assert stock_changes(turkey, {"quantity": 1, "opened_on": "2026-10-09"}) == {"quantity": 1, "opened_on": "2026-10-09"}
    # No quantity in the changes: nothing to decide.
    assert stock_changes(turkey, {"notes": "x"}) == {"notes": "x"}
    # A unit change in the same update is used: 700 g of a 400 g tub is still two packs.
    feta = {"unit": "g", "restock_quantity": 400, "quantity": 800, **OPENED}
    assert stock_changes(feta, {"quantity": 700}) == {"quantity": 700}
    assert stock_changes(feta, {"quantity": 700, "unit": "pcs"}) == {"quantity": 700, "unit": "pcs", "opened_on": None}


@pytest.mark.parametrize("case", VECTORS["of"])
def test_batches_of_implicit_single(case):
    assert batches_of(case["item"]) == case["out"]


@pytest.mark.parametrize("case", VECTORS["norm"])
def test_norm_batches_merges_sorts_and_drops(case):
    # Undated last, the same date merged (the time of day is ignored), zeros dropped, three places.
    assert norm_batches(case["in"]) == case["out"]


@pytest.mark.parametrize("case", VECTORS["take"])
def test_take_batches_first_expiring_first(case):
    assert take_batches(case["in"], case["amount"]) == case["out"]


@pytest.mark.parametrize("case", VECTORS["put"])
def test_put_batches_with_and_without_date(case):
    assert put_batches(case["in"], case["amount"], case["expiry"]) == case["out"]


@pytest.mark.parametrize("case", VECTORS["fields"])
def test_batch_fields_collapse_and_derive(case):
    assert batch_fields(case["in"]) == case["out"]


@pytest.mark.parametrize("case", VECTORS["changes"], ids=lambda c: c["name"])
def test_stock_changes_with_batches(case):
    assert stock_changes(case["item"], case["changes"]) == case["out"]


def test_repair_batches():
    batches = [{"quantity": 1, "expiry": "2026-10-25"}, {"quantity": 2, "expiry": "2026-11-30"}]
    item = {"quantity": 3, "expiry": "2026-10-25", "batches": batches}
    # In step: nothing to do. Plain items, with or without the field: nothing either.
    assert repair_batches(item) is None
    assert repair_batches({"quantity": 3, "expiry": "2026-10-25"}) is None
    assert repair_batches({"quantity": 3, "expiry": "2026-10-25", "batches": []}) is None
    # An older release raised the quantity: the difference joins the latest batch.
    assert repair_batches({**item, "quantity": 5}) == {"batches": [batches[0], {"quantity": 4.0, "expiry": "2026-11-30"}]}
    # ... or lowered it: taken from the first-expiring batch, onwards (here one batch is left: a plain item).
    assert repair_batches({**item, "quantity": 1.5}) == {"batches": [], "expiry": "2026-11-30"}
    assert repair_batches({**item, "quantity": 0}) == {"batches": []}
    # It re-dated the item: the first batch follows.
    assert repair_batches({**item, "expiry": "2026-12-24"}) == {
        "batches": [{"quantity": 2.0, "expiry": "2026-11-30"}, {"quantity": 1.0, "expiry": "2026-12-24"}],
        "expiry": "2026-11-30",
    }
    # A list that holds one batch only collapses.
    assert repair_batches({"quantity": 3, "expiry": "2026-10-25", "batches": [batches[0]]}) == {"batches": []}
    # Once repaired, an item is in step.
    raised = {**item, "quantity": 5}
    assert repair_batches({**raised, **repair_batches(raised)}) is None
