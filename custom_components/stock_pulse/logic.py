"""Pure inventory rules. No Home Assistant imports, so they are easy to test."""

from __future__ import annotations

from datetime import date, timedelta
import math
import re
from typing import Any

# Unit labels used when an item is written to a shopping list. The card has its own,
# fuller set; the integration only needs enough to write "Milk (2 bottles)".
UNIT_LABELS: dict[str, dict[str, tuple[str, str]]] = {
    "en": {
        "pcs": ("piece", "pieces"),
        "pack": ("pack", "packs"),
        "roll": ("roll", "rolls"),
        "bottle": ("bottle", "bottles"),
        "can": ("can", "cans"),
        "box": ("box", "boxes"),
        "bag": ("bag", "bags"),
        "jar": ("jar", "jars"),
        "kg": ("kg", "kg"),
        "g": ("g", "g"),
        "l": ("L", "L"),
        "ml": ("ml", "ml"),
    },
    "el": {
        "pcs": ("τεμάχιο", "τεμάχια"),
        "pack": ("πακέτο", "πακέτα"),
        "roll": ("ρολό", "ρολά"),
        "bottle": ("μπουκάλι", "μπουκάλια"),
        "can": ("κουτάκι", "κουτάκια"),
        "box": ("κουτί", "κουτιά"),
        "bag": ("σακούλα", "σακούλες"),
        "jar": ("βάζο", "βάζα"),
        "kg": ("kg", "kg"),
        "g": ("g", "g"),
        "l": ("L", "L"),
        "ml": ("ml", "ml"),
    },
}

_SUMMARY_RE = re.compile(r"^(?P<name>.*?)\s*\((?P<amount>\d+(?:[.,]\d+)?)(?:\s*(?P<unit>[^)]*))?\)\s*$")


def fmt_number(value: float) -> str:
    """2.0 -> "2", 0.5 -> "0.5"."""
    if math.isclose(value, round(value)):
        return str(int(round(value)))
    return f"{value:.2f}".rstrip("0").rstrip(".")


def unit_label(unit: str | None, amount: float, language: str = "en") -> str:
    """Human label for a unit key, singular or plural. Custom units are returned as typed."""
    if not unit:
        return ""
    labels = UNIT_LABELS.get(language.split("-")[0], UNIT_LABELS["en"])
    pair = labels.get(unit)
    if pair is None:
        return unit
    return pair[0] if math.isclose(amount, 1) else pair[1]


def is_out(item: dict[str, Any]) -> bool:
    return float(item.get("quantity") or 0) <= 0


def is_low(item: dict[str, Any]) -> bool:
    """Low means at or below the item's threshold. Items without a threshold are never low."""
    threshold = item.get("min_quantity")
    if threshold is None:
        return False
    return float(item.get("quantity") or 0) <= float(threshold)


def buy_amount(item: dict[str, Any]) -> float:
    """How much to put on the shopping list.

    An explicit restock quantity wins (you always buy a 6-pack). Otherwise buy just enough to
    get back above the threshold, and at least one.
    """
    restock = item.get("restock_quantity")
    if restock:
        return float(restock)
    quantity = float(item.get("quantity") or 0)
    threshold = item.get("min_quantity")
    if threshold is None:
        return 1.0
    return float(max(1, math.floor(float(threshold) - quantity) + 1))


def shopping_summary(item: dict[str, Any], amount: float, language: str = "en") -> str:
    """Text of the shopping-list entry, e.g. "Toilet paper (2 rolls)".

    A single piece is written as just the name, which is how people write shopping lists.
    """
    name = item["name"]
    unit = item.get("unit") or "pcs"
    if unit == "pcs" and math.isclose(amount, 1):
        return name
    label = unit_label(unit, amount, language)
    return f"{name} ({fmt_number(amount)} {label})".rstrip() if label else f"{name} ({fmt_number(amount)})"


def parse_summary(summary: str) -> tuple[str, float | None]:
    """Split "Toilet paper (2 rolls)" into ("Toilet paper", 2). Plain text gives (text, None)."""
    text = (summary or "").strip()
    match = _SUMMARY_RE.match(text)
    if not match or not match.group("name"):
        return text, None
    return match.group("name").strip(), float(match.group("amount").replace(",", "."))


def norm_name(name: str) -> str:
    return " ".join((name or "").casefold().split())


def norm_barcode(value: Any) -> str | None:
    """The digits of a product barcode, or None when it isn't one.

    Spaces and dashes are dropped. A 12-digit UPC-A becomes its 13-digit EAN form (a leading 0),
    so the same pack matches whether the camera reports UPC-A or EAN-13.
    """
    text = re.sub(r"[\s-]", "", str(value or ""))
    if not text.isdigit() or not 6 <= len(text) <= 14:
        return None
    return "0" + text if len(text) == 12 else text


# Open Food Facts category tags -> our built-in categories. The first match wins.
_CATEGORY_TAGS: tuple[tuple[str, str], ...] = (
    ("en:frozen-foods", "frozen"),
    ("en:beverages", "drinks"),
    ("en:baby-foods", "baby"),
    ("en:pet-food", "pets"),
)
# Which database answered says what kind of thing it is, when the tags don't.
_SOURCE_CATEGORY = {"openbeautyfacts": "toiletries", "openproductsfacts": "household", "openpetfoodfacts": "pets"}


def product_suggestion(product: dict[str, Any], source: str, language: str = "en") -> dict[str, Any] | None:
    """Item fields to prefill from an Open Food Facts product, or None when it has no usable name.

    Only fills what the database says for sure: the name (in the HA language when there is one),
    a category, and brand + pack size as a note. Quantity, unit and dates stay with the person.
    """
    lang = (language or "en").split("-")[0]
    name = next(
        (
            str(product[key]).strip()
            for key in (f"product_name_{lang}", "product_name", "product_name_en", "generic_name")
            if str(product.get(key) or "").strip()
        ),
        None,
    )
    if not name:
        return None
    category = _SOURCE_CATEGORY.get(source)
    if source == "openfoodfacts":
        tags = product.get("categories_tags") or []
        category = next((cat for tag, cat in _CATEGORY_TAGS if tag in tags), "food")
    brand = str(product.get("brands") or "").split(",")[0].strip()
    size = str(product.get("quantity") or "").strip()
    note = " · ".join(part for part in (brand if brand and brand.casefold() not in name.casefold() else "", size) if part)
    return {
        "name": name[:100],
        "category": category,
        "notes": note or None,
        "image": product.get("image_front_small_url") or product.get("image_small_url") or None,
    }


def days_until(expiry: str | None, today: date) -> int | None:
    if not expiry:
        return None
    try:
        return (date.fromisoformat(expiry[:10]) - today).days
    except ValueError:
        return None


def _iso(value: str | None) -> date | None:
    try:
        return date.fromisoformat(value[:10]) if value else None
    except ValueError:
        return None


def effective_expiry(item: dict[str, Any]) -> tuple[str | None, bool]:
    """The date that counts, and whether it comes from opening the pack.

    An opened pack that keeps N days is good until opened_on + N, or its best-before date if that is
    earlier: the turkey that keeps 10 days once open stops waiting for December.
    """
    best_before = _iso(item.get("expiry"))
    opened = _iso(item.get("opened_on"))
    keeps = item.get("days_after_opening")
    by_opening = opened + timedelta(days=int(keeps)) if opened and keeps else None
    if by_opening and (best_before is None or by_opening < best_before):
        return by_opening.isoformat(), True
    return (best_before.isoformat() if best_before else None), False


def expiry_state(item: dict[str, Any], today: date, soon_days: int) -> str | None:
    """None, "soon" (within soon_days, today included) or "expired", by the date that counts."""
    days = days_until(effective_expiry(item)[0], today)
    if days is None or is_out(item):
        return None
    if days < 0:
        return "expired"
    if days <= soon_days:
        return "soon"
    return None
