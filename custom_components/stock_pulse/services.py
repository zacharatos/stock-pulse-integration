"""Actions (services) for automations, scripts, voice and NFC tags."""

from __future__ import annotations

from typing import Any

import voluptuous as vol

from homeassistant.core import HomeAssistant, ServiceCall, ServiceResponse, SupportsResponse, callback
from homeassistant.helpers import config_validation as cv

from .const import ATTR_AMOUNT, ATTR_INVENTORY, ATTR_ITEM, ATTR_NAME, DOMAIN
from .helpers import resolve_manager
from .inventory import ITEM_FIELDS

SERVICE_ADD_ITEM = "add_item"
SERVICE_UPDATE_ITEM = "update_item"
SERVICE_REMOVE_ITEM = "remove_item"
SERVICE_ADJUST_QUANTITY = "adjust_quantity"
SERVICE_ADD_TO_SHOPPING_LIST = "add_to_shopping_list"
SERVICE_GET_ITEMS = "get_items"
SERVICE_SYNC = "sync_shopping_list"

BASE = {vol.Optional(ATTR_INVENTORY): cv.string}
ITEM_REF = {**BASE, vol.Required(ATTR_ITEM): cv.string}

# For add_item, an existing item with the same name is topped up instead of duplicated.
ADD_SCHEMA = vol.Schema({**BASE, **ITEM_FIELDS, vol.Required(ATTR_NAME): cv.string})
UPDATE_SCHEMA = vol.Schema({**ITEM_REF, **ITEM_FIELDS})
ADJUST_SCHEMA = vol.Schema({**ITEM_REF, vol.Required(ATTR_AMOUNT): vol.Coerce(float)})
GET_SCHEMA = vol.Schema(
    {
        **BASE,
        vol.Optional("only"): vol.In(["all", "low", "out", "on_shopping_list"]),
        vol.Optional("location"): cv.string,
        vol.Optional("category"): cv.string,
    }
)


def _fields(call: ServiceCall) -> dict[str, Any]:
    return {k: v for k, v in call.data.items() if k not in (ATTR_INVENTORY, ATTR_ITEM)}


@callback
def async_register_services(hass: HomeAssistant) -> None:
    async def add_item(call: ServiceCall) -> ServiceResponse:
        manager = resolve_manager(hass, call.data.get(ATTR_INVENTORY))
        data = vol.Schema(ITEM_FIELDS)(_fields(call))
        existing = manager.inventory.find(data[ATTR_NAME])
        if existing is not None:
            amount = data.pop("quantity", 1.0)
            data.pop(ATTR_NAME)
            if data:
                await manager.async_update_item(existing["id"], data)
            item = await manager.async_adjust(existing["id"], amount)
        else:
            item = await manager.async_add_item(data)
        return {"item": item} if call.return_response else None

    async def update_item(call: ServiceCall) -> ServiceResponse:
        manager = resolve_manager(hass, call.data.get(ATTR_INVENTORY))
        item = await manager.async_update_item(call.data[ATTR_ITEM], _fields(call))
        return {"item": item} if call.return_response else None

    async def remove_item(call: ServiceCall) -> None:
        manager = resolve_manager(hass, call.data.get(ATTR_INVENTORY))
        await manager.async_remove_item(call.data[ATTR_ITEM])

    async def adjust_quantity(call: ServiceCall) -> ServiceResponse:
        manager = resolve_manager(hass, call.data.get(ATTR_INVENTORY))
        item = await manager.async_adjust(call.data[ATTR_ITEM], call.data[ATTR_AMOUNT])
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
