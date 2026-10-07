"""Fixtures: a Home Assistant with the built-in shopping list and one inventory."""

from __future__ import annotations

import pytest
from pytest_homeassistant_custom_component.common import MockConfigEntry

from homeassistant.core import HomeAssistant
from homeassistant.setup import async_setup_component

from custom_components.stock_pulse.const import DOMAIN

SHOPPING = "todo.shopping_list"


@pytest.fixture(autouse=True)
def auto_enable_custom_integrations(enable_custom_integrations):
    yield


@pytest.fixture
async def shopping_list(hass: HomeAssistant, tmp_path) -> str:
    # The built-in shopping list keeps a JSON file in the config folder: give each test its own.
    hass.config.config_dir = str(tmp_path)
    entry = MockConfigEntry(domain="shopping_list")
    entry.add_to_hass(hass)
    assert await hass.config_entries.async_setup(entry.entry_id)
    await hass.async_block_till_done()
    assert hass.states.get(SHOPPING) is not None
    return SHOPPING


@pytest.fixture
def options() -> dict:
    return {}


@pytest.fixture
async def inventory(hass: HomeAssistant, shopping_list: str, options: dict) -> MockConfigEntry:
    assert await async_setup_component(hass, "homeassistant", {})
    entry = MockConfigEntry(
        domain=DOMAIN,
        title="Home",
        data={"shopping_list": shopping_list, "auto_add": True, "auto_restock": True,
              "match_by_name": True, "remove_completed": False, "expiring_days": 3, **options},
    )
    entry.add_to_hass(hass)
    assert await hass.config_entries.async_setup(entry.entry_id)
    await hass.async_block_till_done()
    return entry
