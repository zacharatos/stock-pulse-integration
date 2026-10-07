"""Finding the inventory a request is about."""

from __future__ import annotations

from typing import TYPE_CHECKING

from homeassistant.config_entries import ConfigEntryState
from homeassistant.core import HomeAssistant
from homeassistant.exceptions import ServiceValidationError

from .const import DOMAIN

if TYPE_CHECKING:
    from .manager import StockPulseManager


def loaded_managers(hass: HomeAssistant) -> dict[str, StockPulseManager]:
    return {
        entry.entry_id: entry.runtime_data
        for entry in hass.config_entries.async_entries(DOMAIN)
        if entry.state is ConfigEntryState.LOADED
    }


def resolve_manager(hass: HomeAssistant, inventory: str | None) -> StockPulseManager:
    """By entry id or title; may be left out when there is only one inventory."""
    managers = loaded_managers(hass)
    if inventory:
        if inventory in managers:
            return managers[inventory]
        for manager in managers.values():
            if manager.title.casefold() == inventory.casefold():
                return manager
        raise ServiceValidationError(
            f"Inventory '{inventory}' not found",
            translation_domain=DOMAIN,
            translation_key="inventory_not_found",
            translation_placeholders={"inventory": inventory},
        )
    if len(managers) == 1:
        return next(iter(managers.values()))
    if not managers:
        raise ServiceValidationError(
            "No inventory is set up", translation_domain=DOMAIN, translation_key="no_inventory"
        )
    raise ServiceValidationError(
        "There is more than one inventory: say which one",
        translation_domain=DOMAIN,
        translation_key="inventory_required",
    )
