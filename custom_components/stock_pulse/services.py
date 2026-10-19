"""Actions (services) for automations, scripts, voice and NFC tags."""

from __future__ import annotations

from typing import Any

import voluptuous as vol

from homeassistant.core import HomeAssistant, ServiceCall, ServiceResponse, SupportsResponse, callback
from homeassistant.helpers import config_validation as cv

from .const import (
    ATTR_AMOUNT,
    ATTR_BARCODE,
    ATTR_BARCODES,
    ATTR_BATCHES,
    ATTR_EXPIRY,
    ATTR_INVENTORY,
    ATTR_ITEM,
    ATTR_NAME,
    DOMAIN,
)
from .helpers import resolve_manager
from .inventory import ITEM_FIELDS, valid_date
from .logic import norm_barcode

SERVICE_ADD_ITEM = "add_item"
SERVICE_UPDATE_ITEM = "update_item"
SERVICE_REMOVE_ITEM = "remove_item"
SERVICE_ADJUST_QUANTITY = "adjust_quantity"
SERVICE_ADD_TO_SHOPPING_LIST = "add_to_shopping_list"
SERVICE_GET_ITEMS = "get_items"
SERVICE_SYNC = "sync_shopping_list"

BASE = {vol.Optional(ATTR_INVENTORY): cv.string}


def _one_barcode(value: Any) -> str:
    code = norm_barcode(value)
    if code is None:
        raise vol.Invalid(f"not a barcode: {value}")
    return code


# Actions take one `barcode` to add to the item's list, on top of `barcodes` (the whole list).
BARCODE = {vol.Optional(ATTR_BARCODE): _one_barcode}
ITEM_REF = {**BASE, vol.Required(ATTR_ITEM): cv.string}

# For add_item, an existing item with the same name is topped up instead of duplicated.
ADD_SCHEMA = vol.Schema({**BASE, **ITEM_FIELDS, **BARCODE, vol.Required(ATTR_NAME): cv.string})
UPDATE_SCHEMA = vol.Schema({**ITEM_REF, **ITEM_FIELDS, **BARCODE})
ADJUST_SCHEMA = vol.Schema(
    {**ITEM_REF, vol.Required(ATTR_AMOUNT): vol.Coerce(float), vol.Optional(ATTR_EXPIRY): valid_date}
)
GET_SCHEMA = vol.Schema(
    {
        **BASE,
        vol.Optional("only"): vol.In(["all", "low", "out", "on_shopping_list"]),
        vol.Optional("location"): cv.string,
        vol.Optional("category"): cv.string,
    }
)


def _fields(call: ServiceCall, current: list[str] | None = None) -> dict[str, Any]:
    """The item fields of a call, with a single `barcode` folded into `barcodes`."""
    data = {k: v for k, v in call.data.items() if k not in (ATTR_INVENTORY, ATTR_ITEM, ATTR_BARCODE)}
    if code := call.data.get(ATTR_BARCODE):
        codes = list(data.get(ATTR_BARCODES, current or []))
        data[ATTR_BARCODES] = codes if code in codes else [*codes, code]
    return data


@callback
def async_register_services(hass: HomeAssistant) -> None:
    async def add_item(call: ServiceCall) -> ServiceResponse:
        manager = resolve_manager(hass, call.data.get(ATTR_INVENTORY))
        # The same pack scanned again tops up the item that has its barcode, whatever it's called.
        existing = manager.inventory.find_barcode(call.data.get(ATTR_BARCODE)) or manager.inventory.find(
            call.data[ATTR_NAME]
        )
        data = vol.Schema(ITEM_FIELDS)(_fields(call, existing.get(ATTR_BARCODES) if existing else None))
        if existing is not None:
            data.pop(ATTR_NAME)
            if ATTR_BATCHES in data:
                # The batches are the stock: they replace the item's, and there is no amount to add on top.
                data.pop("quantity", None)
                data.pop(ATTR_EXPIRY, None)
                item = await manager.async_update_item(existing["id"], data)
            else:
                amount = data.pop("quantity", 1.0)
                # With batches on, a date on what you add starts a batch for it instead of replacing the item's.
                expiry = data.pop(ATTR_EXPIRY) if manager.batches and amount > 0 and data.get(ATTR_EXPIRY) else None
                if data:
                    await manager.async_update_item(existing["id"], data)
                item = await manager.async_adjust(existing["id"], amount, expiry)
        else:
            item = await manager.async_add_item(data)
        return {"item": item} if call.return_response else None

    async def update_item(call: ServiceCall) -> ServiceResponse:
        manager = resolve_manager(hass, call.data.get(ATTR_INVENTORY))
        current = manager.get(call.data[ATTR_ITEM])
        item = await manager.async_update_item(current["id"], _fields(call, current.get(ATTR_BARCODES)))
        return {"item": item} if call.return_response else None

    async def remove_item(call: ServiceCall) -> None:
        manager = resolve_manager(hass, call.data.get(ATTR_INVENTORY))
        await manager.async_remove_item(call.data[ATTR_ITEM])

    async def adjust_quantity(call: ServiceCall) -> ServiceResponse:
        manager = resolve_manager(hass, call.data.get(ATTR_INVENTORY))
        item = await manager.async_adjust(call.data[ATTR_ITEM], call.data[ATTR_AMOUNT], call.data.get(ATTR_EXPIRY))
        return {"item": item} if call.return_response else None

    async def add_to_shopping_list(call: ServiceCall) -> None:
        manager = resolve_manager(hass, call.data.get(ATTR_INVENTORY))
        await manager.async_add_to_shopping_list(call.data[ATTR_ITEM])

    async def sync(call: ServiceCall) -> None:
        await resolve_manager(hass, call.data.get(ATTR_INVENTORY)).async_reconcile()

    async def get_items(call: ServiceCall) -> ServiceResponse:
        from .logic import is_low, is_out

        manager = resolve_manager(hass, call.data.get(ATTR_INVENTORY))
        only = call.data.get("only", "all")
        items = manager.inventory.sorted_items()
        if only == "low":
            items = [i for i in items if is_low(i)]
        elif only == "out":
            items = [i for i in items if is_out(i)]
        elif only == "on_shopping_list":
            items = [i for i in items if i.get("shopping")]
        if location := call.data.get("location"):
            items = [i for i in items if (i.get("location") or "").casefold() == location.casefold()]
        if category := call.data.get("category"):
            items = [i for i in items if (i.get("category") or "").casefold() == category.casefold()]
        return {"inventory": manager.title, "items": items}

    hass.services.async_register(
        DOMAIN, SERVICE_ADD_ITEM, add_item, schema=ADD_SCHEMA, supports_response=SupportsResponse.OPTIONAL
    )
    hass.services.async_register(
        DOMAIN, SERVICE_UPDATE_ITEM, update_item, schema=UPDATE_SCHEMA, supports_response=SupportsResponse.OPTIONAL
    )
    hass.services.async_register(DOMAIN, SERVICE_REMOVE_ITEM, remove_item, schema=vol.Schema(ITEM_REF))
    hass.services.async_register(
        DOMAIN,
        SERVICE_ADJUST_QUANTITY,
        adjust_quantity,
        schema=ADJUST_SCHEMA,
        supports_response=SupportsResponse.OPTIONAL,
    )
    hass.services.async_register(
        DOMAIN, SERVICE_ADD_TO_SHOPPING_LIST, add_to_shopping_list, schema=vol.Schema(ITEM_REF)
    )
    hass.services.async_register(DOMAIN, SERVICE_SYNC, sync, schema=vol.Schema(BASE))
    hass.services.async_register(
        DOMAIN, SERVICE_GET_ITEMS, get_items, schema=GET_SCHEMA, supports_response=SupportsResponse.ONLY
    )
