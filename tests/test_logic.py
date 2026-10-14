"""The pure rules in logic.py."""

from datetime import date

from custom_components.stock_pulse.logic import (
    buy_amount,
    effective_expiry,
    expiry_state,
    fmt_number,
    is_low,
    norm_barcode,
    parse_summary,
    product_suggestion,
    shopping_summary,
)


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
