"""Summary sensors, mainly so automations can notify about low or expiring stock."""

from __future__ import annotations

from collections.abc import Callable
from dataclasses import dataclass
from typing import Any

from homeassistant.components.sensor import SensorEntity, SensorEntityDescription, SensorStateClass
from homeassistant.core import HomeAssistant, callback
from homeassistant.helpers.device_registry import DeviceEntryType, DeviceInfo
from homeassistant.helpers.dispatcher import async_dispatcher_connect
from homeassistant.helpers.entity_platform import AddConfigEntryEntitiesCallback
from homeassistant.util import dt as dt_util

from . import StockPulseConfigEntry
from .const import DOMAIN, SIGNAL_UPDATED, VERSION
from .logic import expiry_state, is_low, is_out
from .manager import StockPulseManager

MAX_LISTED = 50


@dataclass(frozen=True, kw_only=True)
class StockSensorDescription(SensorEntityDescription):
    select: Callable[[StockPulseManager], list[dict[str, Any]]]


def _today() -> Any:
    return dt_util.now().date()


SENSORS: tuple[StockSensorDescription, ...] = (
    StockSensorDescription(
        key="items",
        translation_key="items",
        icon="mdi:package-variant-closed",
        state_class=SensorStateClass.MEASUREMENT,
        select=lambda m: [i for i in m.inventory.items.values() if not is_out(i)],
    ),
    StockSensorDescription(
        key="low_stock",
        translation_key="low_stock",
        icon="mdi:package-down",
        state_class=SensorStateClass.MEASUREMENT,
        select=lambda m: [i for i in m.inventory.items.values() if is_low(i) or is_out(i)],
    ),
    StockSensorDescription(
        key="expiring_soon",
        translation_key="expiring_soon",
        icon="mdi:calendar-clock",
        state_class=SensorStateClass.MEASUREMENT,
        select=lambda m: [
            i for i in m.inventory.items.values() if expiry_state(i, _today(), m.expiring_days) == "soon"
        ],
    ),
    StockSensorDescription(
        key="expired",
        translation_key="expired",
        icon="mdi:calendar-remove",
        state_class=SensorStateClass.MEASUREMENT,
        select=lambda m: [
            i for i in m.inventory.items.values() if expiry_state(i, _today(), m.expiring_days) == "expired"
        ],
    ),
)


async def async_setup_entry(
    hass: HomeAssistant, entry: StockPulseConfigEntry, async_add_entities: AddConfigEntryEntitiesCallback
) -> None:
    manager = entry.runtime_data
    async_add_entities(StockSensor(manager, description) for description in SENSORS)


class StockSensor(SensorEntity):
    _attr_has_entity_name = True
    _attr_should_poll = False
    entity_description: StockSensorDescription

    def __init__(self, manager: StockPulseManager, description: StockSensorDescription) -> None:
        self.manager = manager
        self.entity_description = description
        entry_id = manager.entry.entry_id
        self._attr_unique_id = f"{entry_id}_{description.key}"
        self._attr_device_info = DeviceInfo(
            identifiers={(DOMAIN, entry_id)},
            name=manager.title,
            manufacturer="Stock Pulse",
            model="Inventory",
            sw_version=VERSION,
            entry_type=DeviceEntryType.SERVICE,
        )
        self._update()

    async def async_added_to_hass(self) -> None:
        self.async_on_remove(
            async_dispatcher_connect(
                self.hass, SIGNAL_UPDATED.format(self.manager.entry.entry_id), self._refresh
            )
        )

    @callback
    def _refresh(self) -> None:
        self._update()
        self.async_write_ha_state()

    def _update(self) -> None:
        items = sorted(self.entity_description.select(self.manager), key=lambda i: i["name"].casefold())
        self._attr_native_value = len(items)
        self._attr_extra_state_attributes = {
            "items": [
                {
                    "name": i["name"],
                    "quantity": i["quantity"],
                    "unit": i.get("unit"),
                    "location": i.get("location"),
                    "expiry": i.get("expiry"),
                    "on_shopping_list": bool(i.get("shopping")),
                }
                for i in items[:MAX_LISTED]
            ]
        }
