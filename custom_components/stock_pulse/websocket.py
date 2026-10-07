"""WebSocket API used by the card."""

from __future__ import annotations

from collections.abc import Awaitable, Callable
from functools import wraps
from typing import Any

import voluptuous as vol

from homeassistant.components import websocket_api
from homeassistant.core import HomeAssistant, callback
from homeassistant.exceptions import HomeAssistantError
from homeassistant.helpers.dispatcher import async_dispatcher_connect

from .const import DOMAIN, SIGNAL_UPDATED
from .helpers import loaded_managers, resolve_manager
from .inventory import ADD_SCHEMA, UPDATE_SCHEMA
from .manager import StockPulseManager

INVENTORY = vol.Optional("inventory")

type Handler = Callable[[HomeAssistant, StockPulseManager, dict[str, Any]], Awaitable[Any]]


@callback
def async_register_websocket(hass: HomeAssistant) -> None:
    for command in (
        ws_inventories,
        ws_subscribe,
        ws_add,
        ws_update,
        ws_remove,
        ws_adjust,
        ws_shop,
        ws_sync,
    ):
        websocket_api.async_register_command(hass, command)


def _guarded(handler: Handler) -> Callable[..., Awaitable[None]]:
    """Resolve the inventory, run the handler, turn failures into readable errors."""

    @wraps(handler)
    async def wrapper(hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict[str, Any]) -> None:
        try:
            manager = resolve_manager(hass, msg.get("inventory"))
            result = await handler(hass, manager, msg)
        except vol.Invalid as err:
            connection.send_error(msg["id"], "invalid_format", str(err))
            return
        except HomeAssistantError as err:
            connection.send_error(msg["id"], "failed", str(err))
            return
        connection.send_result(msg["id"], result)

    return wrapper


@websocket_api.websocket_command({vol.Required("type"): f"{DOMAIN}/inventories"})
@callback
def ws_inventories(hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict[str, Any]) -> None:
    connection.send_result(
        msg["id"],
        [{"entry_id": entry_id, "title": m.title} for entry_id, m in loaded_managers(hass).items()],
    )


@websocket_api.websocket_command({vol.Required("type"): f"{DOMAIN}/subscribe", INVENTORY: str})
@callback
def ws_subscribe(hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict[str, Any]) -> None:
    """Send the whole inventory now and again after every change."""
    try:
        manager = resolve_manager(hass, msg.get("inventory"))
    except HomeAssistantError as err:
        connection.send_error(msg["id"], "not_found", str(err))
        return
    entry_id = manager.entry.entry_id

    @callback
    def forward() -> None:
        current = loaded_managers(hass).get(entry_id)
        if current is not None:
            connection.send_message(websocket_api.event_message(msg["id"], current.snapshot()))

    connection.subscriptions[msg["id"]] = async_dispatcher_connect(
        hass, SIGNAL_UPDATED.format(entry_id), forward
    )
    connection.send_result(msg["id"])
    forward()


@websocket_api.websocket_command(
    {vol.Required("type"): f"{DOMAIN}/item/add", INVENTORY: str, vol.Required("item"): dict}
)
@websocket_api.async_response
@_guarded
async def ws_add(hass: HomeAssistant, manager: StockPulseManager, msg: dict[str, Any]) -> Any:
    return await manager.async_add_item(ADD_SCHEMA(msg["item"]))


@websocket_api.websocket_command(
    {
        vol.Required("type"): f"{DOMAIN}/item/update",
        INVENTORY: str,
        vol.Required("item_id"): str,
        vol.Required("changes"): dict,
    }
)
@websocket_api.async_response
@_guarded
async def ws_update(hass: HomeAssistant, manager: StockPulseManager, msg: dict[str, Any]) -> Any:
    return await manager.async_update_item(msg["item_id"], UPDATE_SCHEMA(msg["changes"]))


@websocket_api.websocket_command(
    {vol.Required("type"): f"{DOMAIN}/item/remove", INVENTORY: str, vol.Required("item_id"): str}
)
@websocket_api.async_response
@_guarded
async def ws_remove(hass: HomeAssistant, manager: StockPulseManager, msg: dict[str, Any]) -> Any:
    await manager.async_remove_item(msg["item_id"])


@websocket_api.websocket_command(
    {
        vol.Required("type"): f"{DOMAIN}/item/adjust",
        INVENTORY: str,
        vol.Required("item_id"): str,
        vol.Required("amount"): vol.Coerce(float),
    }
)
@websocket_api.async_response
@_guarded
async def ws_adjust(hass: HomeAssistant, manager: StockPulseManager, msg: dict[str, Any]) -> Any:
    return await manager.async_adjust(msg["item_id"], msg["amount"])


@websocket_api.websocket_command(
    {
        vol.Required("type"): f"{DOMAIN}/item/shop",
        INVENTORY: str,
        vol.Required("item_id"): str,
        vol.Required("on"): bool,
    }
)
@websocket_api.async_response
@_guarded
async def ws_shop(hass: HomeAssistant, manager: StockPulseManager, msg: dict[str, Any]) -> Any:
    if msg["on"]:
        return await manager.async_add_to_shopping_list(msg["item_id"])
    return await manager.async_remove_from_shopping_list(msg["item_id"])


@websocket_api.websocket_command({vol.Required("type"): f"{DOMAIN}/sync", INVENTORY: str})
@websocket_api.async_response
@_guarded
async def ws_sync(hass: HomeAssistant, manager: StockPulseManager, msg: dict[str, Any]) -> Any:
    await manager.async_reconcile()
