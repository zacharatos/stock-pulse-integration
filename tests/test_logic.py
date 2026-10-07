"""The pure rules in logic.py."""

from datetime import date

from custom_components.stock_pulse.logic import (
    buy_amount,
    expiry_state,
    fmt_number,
    is_low,
    parse_summary,
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
