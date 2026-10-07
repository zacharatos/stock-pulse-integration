"""Inventory storage: the items of one inventory, saved in .storage."""

from __future__ import annotations

from collections.abc import Callable
from datetime import date
from typing import Any
import uuid

import voluptuous as vol

from homeassistant.core import HomeAssistant, callback
from homeassistant.helpers.storage import Store
from homeassistant.util import dt as dt_util

from .const import (
    ATTR_AUTO_SHOP,
    ATTR_CATEGORY,
    ATTR_EXPIRY,
    ATTR_ICON,
    ATTR_LOCATION,
    ATTR_MIN_QUANTITY,
    ATTR_NAME,
    ATTR_NOTES,
    ATTR_QUANTITY,
    ATTR_RESTOCK_QUANTITY,
    ATTR_UNIT,
    DOMAIN,
    STORAGE_VERSION,
)
from .logic import norm_name

SAVE_DELAY = 2


def _text(value: Any) -> str | None:
    if value is None:
        return None
    text = str(value).strip()
    return text or None


def _date(value: Any) -> str | None:
    if value in (None, ""):
        return None
    if isinstance(value, date):
        return value.isoformat()
    try:
        return date.fromisoformat(str(value)[:10]).isoformat()
    except ValueError as err:
        raise vol.Invalid(f"invalid date: {value}") from err


def _number(value: Any) -> float:
    try:
        number = float(value)
    except (TypeError, ValueError) as err:
        raise vol.Invalid("not a number") from err
    if number != number or number in (float("inf"), float("-inf")):  # NaN / inf
        raise vol.Invalid("not a number")
    return round(number, 3)


def _non_negative(value: Any) -> float:
    number = _number(value)
    if number < 0:
        raise vol.Invalid("must be 0 or more")
    return number


def _optional(validator: Callable[[Any], Any]) -> Callable[[Any], Any]:
    def wrapper(value: Any) -> Any:
        if value in (None, ""):
            return None
        return validator(value)

    return wrapper


def _name(value: Any) -> str:
    text = _text(value)
    if not text:
        raise vol.Invalid("name is required")
    return text[:100]


def _positive(value: Any) -> float:
    number = _number(value)
    if number <= 0:
        raise vol.Invalid("must be more than 0")
    return number


# Every editable field, all optional: used for updates.
ITEM_FIELDS = {
    vol.Optional(ATTR_NAME): _name,
    vol.Optional(ATTR_QUANTITY): _non_negative,
    vol.Optional(ATTR_UNIT): _text,
    vol.Optional(ATTR_CATEGORY): _text,
    vol.Optional(ATTR_LOCATION): _text,
    vol.Optional(ATTR_EXPIRY): _date,
    vol.Optional(ATTR_MIN_QUANTITY): _optional(_non_negative),
    vol.Optional(ATTR_RESTOCK_QUANTITY): _optional(_positive),
    vol.Optional(ATTR_AUTO_SHOP): vol.Coerce(bool),
    vol.Optional(ATTR_NOTES): _text,
    vol.Optional(ATTR_ICON): _text,
}

UPDATE_SCHEMA = vol.Schema(ITEM_FIELDS)
ADD_SCHEMA = vol.Schema({**ITEM_FIELDS, vol.Required(ATTR_NAME): _name})


class Inventory:
    """The items of one inventory and their persistence.

    Every change goes through here, so listeners (shopping sync, sensors, card subscriptions)
    see each one. Business rules live in the manager; this class only stores.
    """

    def __init__(self, hass: HomeAssistant, entry_id: str) -> None:
        self.hass = hass
        self._store: Store[dict[str, Any]] = Store(
            hass, STORAGE_VERSION, f"{DOMAIN}.{entry_id}", private=False, atomic_writes=True
        )
        self.items: dict[str, dict[str, Any]] = {}
        # Shopping-list bookkeeping that is not about a single item.
        self.sync_state: dict[str, Any] = {}
        self._listeners: list[Callable[[], None]] = []

    async def async_load(self) -> None:
        data = await self._store.async_load() or {}
        self.items = {item["id"]: item for item in data.get("items", [])}
        self.sync_state = data.get("sync", {})

    @callback
    def async_add_listener(self, listener: Callable[[], None]) -> Callable[[], None]:
        self._listeners.append(listener)

        def remove() -> None:
            self._listeners.remove(listener)

        return remove

    @callback
    def async_changed(self) -> None:
        """Save soon and tell everyone."""
        self._store.async_delay_save(self._data, SAVE_DELAY)
        for listener in list(self._listeners):
            listener()

    async def async_flush(self) -> None:
        await self._store.async_save(self._data())

    async def async_remove_storage(self) -> None:
        await self._store.async_remove()

    def _data(self) -> dict[str, Any]:
        return {"items": list(self.items.values()), "sync": self.sync_state}

    # ---- queries ------------------------------------------------------------

    def find(self, ref: str) -> dict[str, Any] | None:
        """An item by id, or by name (case-insensitive)."""
        if ref in self.items:
            return self.items[ref]
        wanted = norm_name(ref)
        for item in self.items.values():
            if norm_name(item["name"]) == wanted:
                return item
        return None

    def sorted_items(self) -> list[dict[str, Any]]:
        return sorted(self.items.values(), key=lambda i: norm_name(i["name"]))

    # ---- writes (no side effects beyond storage and listeners) ------------------

    @callback
    def create(self, data: dict[str, Any]) -> dict[str, Any]:
        now = dt_util.utcnow().isoformat()
        item: dict[str, Any] = {
            "id": uuid.uuid4().hex,
            ATTR_NAME: data[ATTR_NAME],
            ATTR_QUANTITY: data.get(ATTR_QUANTITY, 1.0),
            ATTR_UNIT: data.get(ATTR_UNIT) or "pcs",
            ATTR_CATEGORY: data.get(ATTR_CATEGORY),
            ATTR_LOCATION: data.get(ATTR_LOCATION),
            ATTR_EXPIRY: data.get(ATTR_EXPIRY),
            ATTR_MIN_QUANTITY: data.get(ATTR_MIN_QUANTITY),
            ATTR_RESTOCK_QUANTITY: data.get(ATTR_RESTOCK_QUANTITY),
            ATTR_AUTO_SHOP: data.get(ATTR_AUTO_SHOP, True),
            ATTR_NOTES: data.get(ATTR_NOTES),
            ATTR_ICON: data.get(ATTR_ICON),
            "created": now,
            "updated": now,
            # Link to the shopping-list entry this integration created, if any.
            "shopping": None,
            # The user removed our shopping entry while the item was still low: don't add it again
            # until the item has been above its threshold once.
            "shopping_dismissed": False,
        }
        self.items[item["id"]] = item
        return item

    @callback
    def patch(self, item_id: str, changes: dict[str, Any]) -> dict[str, Any]:
        item = self.items[item_id]
        if ATTR_UNIT in changes and not changes[ATTR_UNIT]:
            changes = {**changes, ATTR_UNIT: "pcs"}
        item.update(changes)
        item["updated"] = dt_util.utcnow().isoformat()
        return item

    @callback
    def delete(self, item_id: str) -> dict[str, Any]:
        return self.items.pop(item_id)
