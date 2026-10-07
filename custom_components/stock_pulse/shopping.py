"""Thin wrapper around a Home Assistant to-do entity used as the shopping list."""

from __future__ import annotations

from typing import Any

from homeassistant.components.todo import TodoListEntityFeature
from homeassistant.const import ATTR_SUPPORTED_FEATURES
from homeassistant.core import HomeAssistant

TODO = "todo"


class ShoppingList:
    """Talks to any to-do list (Shopping list, Local to-do, Bring!, ...) through the todo services.

    Only public services are used, so it works with every to-do integration that supports
    creating, updating and deleting items.
    """

    def __init__(self, hass: HomeAssistant, entity_id: str) -> None:
        self.hass = hass
        self.entity_id = entity_id

    @property
    def available(self) -> bool:
        state = self.hass.states.get(self.entity_id)
        return state is not None and state.state not in ("unavailable", "unknown")

    @property
    def name(self) -> str:
        state = self.hass.states.get(self.entity_id)
        return state.name if state else self.entity_id

    def _supports(self, feature: TodoListEntityFeature) -> bool:
        state = self.hass.states.get(self.entity_id)
        if state is None:
            return False
        return bool(int(state.attributes.get(ATTR_SUPPORTED_FEATURES, 0)) & feature)

    async def async_items(self) -> list[dict[str, Any]]:
        response = await self.hass.services.async_call(
            TODO,
            "get_items",
            {"status": ["needs_action", "completed"]},
            target={"entity_id": self.entity_id},
            blocking=True,
            return_response=True,
        )
        return list((response or {}).get(self.entity_id, {}).get("items", []))

    async def async_add(self, summary: str, description: str | None = None) -> str | None:
        """Add an item and return its uid (looked up afterwards; the service doesn't return it)."""
        data: dict[str, Any] = {"item": summary}
        if description and self._supports(TodoListEntityFeature.SET_DESCRIPTION_ON_ITEM):
            data["description"] = description
        before = {item.get("uid") for item in await self.async_items()}
        await self.hass.services.async_call(
            TODO, "add_item", data, target={"entity_id": self.entity_id}, blocking=True
        )
        candidates = [
            item
            for item in await self.async_items()
            if item.get("uid") not in before and item.get("summary") == summary
        ]
        return candidates[-1].get("uid") if candidates else None

    async def async_rename(self, uid: str, summary: str) -> None:
        await self.hass.services.async_call(
            TODO,
            "update_item",
            {"item": uid, "rename": summary},
            target={"entity_id": self.entity_id},
            blocking=True,
        )

    async def async_remove(self, uids: list[str]) -> None:
        if not uids:
            return
        await self.hass.services.async_call(
            TODO, "remove_item", {"item": uids}, target={"entity_id": self.entity_id}, blocking=True
        )
