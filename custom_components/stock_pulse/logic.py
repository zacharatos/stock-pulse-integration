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


# Units that measure an amount instead of counting packs.
MEASURED_UNITS = frozenset({"kg", "g", "l", "ml"})


def pack_size(item: dict[str, Any]) -> float | None:
    """How much one pack holds, in the item's unit.

    Counted units (pcs, pack, roll, a custom unit...) are packs of 1. A weighed or measured item has
    no pack size of its own, so its buy amount stands in for it (a 400 g tub); without one it is unknown.
    """
    if (item.get("unit") or "pcs") not in MEASURED_UNITS:
        return 1.0
    size = item.get("restock_quantity")
    return float(size) if size and float(size) > 0 else None


def packs_left(quantity: float, size: float) -> int:
    """Packs it takes to hold the quantity: a started pack counts as one."""
    return math.ceil(round(quantity / size, 6)) if quantity > 0 else 0


def open_pack_finished(item: dict[str, Any], before: float, after: float) -> bool:
    """Whether a change of quantity used up the pack that was open, so its opened_on no longer applies.

    The open pack is used first, so it is gone once fewer packs are left. Buying more never clears it.
    """
    if not item.get("opened_on"):
        return False
    if before <= 0:
        return after > 0  # restocked from nothing: the new packs are sealed
    if after >= before:
        return False
    if after <= 0:
        return True
    size = pack_size(item)
    return size is not None and packs_left(after, size) < packs_left(before, size)


def _day(value: Any) -> str | None:
    """The date part of an ISO date, or None for no date."""
    return str(value)[:10] if value else None


def norm_batches(batches: list[dict[str, Any]] | None) -> list[dict[str, Any]]:
    """Batches as stored: rounded, empty ones dropped, one per date, dated first and soonest first.

    The undated batch (at most one) comes last, because a date you don't know is not the first to go.
    """
    merged: dict[str | None, float] = {}
    for batch in batches or []:
        quantity = round(float(batch.get("quantity") or 0), 3)
        if quantity > 0:
            day = _day(batch.get("expiry"))
            merged[day] = round(merged.get(day, 0.0) + quantity, 3)
    return [{"quantity": q, "expiry": d} for d, q in sorted(merged.items(), key=lambda kv: (kv[0] is None, kv[0] or ""))]


def batches_of(item: dict[str, Any]) -> list[dict[str, Any]]:
    """An item's batches: the stored list when it has two or more, else the item itself as one batch.

    Items stored before batches existed have no list at all, which is the same thing.
    """
    stored = item.get("batches") or []
    if len(stored) >= 2:
        return [dict(b) for b in stored]
    return [{"quantity": float(item.get("quantity") or 0), "expiry": _day(item.get("expiry"))}]


def take_batches(batches: list[dict[str, Any]], amount: float) -> list[dict[str, Any]]:
    """Use up `amount`, first-expiring batch first and carrying on into the next. More than there is leaves none."""
    left = round(float(amount), 3)
    taken: list[dict[str, Any]] = []
    for batch in norm_batches(batches):
        if left >= batch["quantity"]:
            left = round(left - batch["quantity"], 3)
        else:
            taken.append({**batch, "quantity": round(batch["quantity"] - left, 3)})
            left = 0.0
    return taken


def put_batches(batches: list[dict[str, Any]], amount: float, expiry: str | None = None) -> list[dict[str, Any]]:
    """Add `amount`. With a date it joins the batch with that date or starts one; without, the latest batch.

    The latest is the last one: a stock-up you didn't date is most likely the newest, and for a plain
    item that is exactly "+ keeps the date".
    """
    result = norm_batches(batches)
    day = _day(expiry)
    target = next((b for b in result if b["expiry"] == day), None) if day else (result[-1] if result else None)
    if target is not None:
        target["quantity"] = round(target["quantity"] + float(amount), 3)
    else:
        result.append({"quantity": round(float(amount), 3), "expiry": day})
    return norm_batches(result)


def batch_fields(batches: list[dict[str, Any]]) -> dict[str, Any]:
    """The fields an item stores for a list of batches: the list itself (two or more), the total, the earliest date.

    One batch collapses back into a plain item; none leaves the item empty and its date as it was.
    """
    result = norm_batches(batches)
    if len(result) >= 2:
        return {"batches": result, "quantity": round(sum(b["quantity"] for b in result), 3), "expiry": result[0]["expiry"]}
    if result:
        return {"batches": [], "quantity": result[0]["quantity"], "expiry": result[0]["expiry"]}
    return {"batches": [], "quantity": 0.0}


def _scalar_batches(item: dict[str, Any], changes: dict[str, Any]) -> tuple[list[dict[str, Any]], str | None]:
    """An item's batches after a plain quantity and/or expiry change, and the date its first batch has now.

    A new expiry re-dates the first batch; a new quantity is the difference against the total, taken from
    the first-expiring batch or put onto the latest.
    """
    result = norm_batches(batches_of(item))
    first = result[0]["expiry"] if result else _day(item.get("expiry"))
    if "expiry" in changes and result:
        first = _day(changes["expiry"])
        result = norm_batches([{**result[0], "expiry": first}, *result[1:]])
    if "quantity" in changes:
        total = round(sum(b["quantity"] for b in result), 3)
        wanted = round(float(changes["quantity"] or 0), 3)
        if wanted < total:
            result = take_batches(result, total - wanted)
        elif wanted > total:
            result = put_batches(result, wanted - total)
    return result, first


def _first_batch_finished(item: dict[str, Any], before: list[dict[str, Any]], after: list[dict[str, Any]], first: str | None) -> bool:
    """Whether a change of batches used up the open pack, which is in the first-expiring batch.

    Stock that comes back from nothing is sealed. A change that doesn't lower the total used nothing
    (moving stock between batches, correcting a date). Otherwise it is the pack rule applied to the batch
    that was first, found again by its date.
    """
    total_before = round(sum(b["quantity"] for b in before), 3)
    total_after = round(sum(b["quantity"] for b in after), 3)
    if total_before <= 0:
        return open_pack_finished(item, 0.0, total_after)
    if total_after >= total_before:
        return False
    in_use = before[0]["quantity"]
    left = next((b["quantity"] for b in after if b["expiry"] == first), 0.0)
    return open_pack_finished(item, in_use, left)


def stock_changes(item: dict[str, Any], changes: dict[str, Any]) -> dict[str, Any]:
    """What an update really stores for the stock fields, and opened_on once the open pack is used up.

    * `batches` in the update wins: quantity and expiry are then the total and the earliest date, whatever
      the update says.
    * On an item that has batches, `quantity` is a difference against the total (a decrease is taken from
      the first-expiring batch, an increase joins the latest) and `expiry` re-dates the first batch.
    * A plain item is stored as given.

    An opened_on in the update itself always wins; otherwise it is dropped once the open pack is used up
    (the open pack is the first batch, which is used first).
    """
    has_batches = len(item.get("batches") or []) >= 2
    if "batches" in changes or (has_batches and ("quantity" in changes or "expiry" in changes)):
        before = norm_batches(batches_of(item))
        first = before[0]["expiry"] if before else _day(item.get("expiry"))
        if "batches" in changes:
            after = norm_batches(changes["batches"])
        else:
            after, first = _scalar_batches(item, changes)
        stored = {k: v for k, v in changes.items() if k not in ("batches", "quantity", "expiry")}
        stored.update(batch_fields(after))
        if "opened_on" not in changes and _first_batch_finished({**item, **stored}, before, after, first):
            stored["opened_on"] = None
        return stored
    if "quantity" in changes and "opened_on" not in changes and open_pack_finished(
        {**item, **changes}, float(item.get("quantity") or 0), float(changes["quantity"] or 0)
    ):
        return {**changes, "opened_on": None}
    return changes


def repair_batches(item: dict[str, Any]) -> dict[str, Any] | None:
    """The fields that put an item's batches back in step with its quantity and expiry, or None when they are.

    A release without batches (a HACS rollback) edits only quantity and expiry, so the list can fall behind.
    Those two win: the date re-dates the first batch, the quantity is taken or put as a difference.
    """
    if not item.get("batches"):
        return None
    stored = norm_batches(item["batches"])
    if len(stored) >= 2:
        batches, _ = _scalar_batches({**item, "batches": stored}, {"quantity": item.get("quantity"), "expiry": item.get("expiry")})
    else:
        batches = [{"quantity": item.get("quantity"), "expiry": item.get("expiry")}]
    fixed = batch_fields(batches)
    changes = {key: value for key, value in fixed.items() if item.get(key) != value}
    return changes or None
