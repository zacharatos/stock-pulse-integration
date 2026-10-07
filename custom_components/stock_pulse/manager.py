"""One inventory: its items, its rules, and the link to a shopping list."""

from __future__ import annotations

import asyncio
from copy import deepcopy
from datetime import timedelta
import logging
from typing import Any

from homeassistant.config_entries import ConfigEntry
from homeassistant.core import Event, EventStateChangedData, HomeAssistant, callback
from homeassistant.exceptions import HomeAssistantError, ServiceValidationError
from homeassistant.helpers.debounce import Debouncer
from homeassistant.helpers.dispatcher import async_dispatcher_send
from homeassistant.helpers.event import (
    async_track_state_change_event,
    async_track_time_change,
    async_track_time_interval,
)
from homeassistant.helpers.start import async_at_started
from homeassistant.util import dt as dt_util

from .const import (
    ATTR_QUANTITY,
    CONF_AUTO_ADD,
    CONF_AUTO_RESTOCK,
    CONF_EXPIRING_DAYS,
    CONF_MATCH_BY_NAME,
    CONF_REMOVE_COMPLETED,
    CONF_SHOPPING_LIST,
    DEFAULT_AUTO_ADD,
    DEFAULT_AUTO_RESTOCK,
    DEFAULT_CATEGORIES,
    DEFAULT_EXPIRING_DAYS,
    DEFAULT_LOCATIONS,
    DEFAULT_MATCH_BY_NAME,
    DEFAULT_REMOVE_COMPLETED,
    DEFAULT_UNITS,
    DOMAIN,
    EVENT_ADDED_TO_SHOPPING_LIST,
    EVENT_LOW_STOCK,
    EVENT_RESTOCKED,
    SIGNAL_UPDATED,
    VERSION,
)
from .inventory import Inventory
from .logic import buy_amount, is_low, norm_name, parse_summary, shopping_summary
from .shopping import ShoppingList

_LOGGER = logging.getLogger(__name__)

RECONCILE_INTERVAL = timedelta(minutes=10)
RECONCILE_COOLDOWN = 1.0


def entry_option(entry: ConfigEntry, key: str, default: Any) -> Any:
    """Options win over the data the entry was created with."""
    if key in entry.options:
        return entry.options[key]
    return entry.data.get(key, default)


class StockPulseManager:
    """Applies the inventory rules and keeps the shopping list in step.

    The two automatic flows:
    * an item drops to or below its threshold -> it is written to the shopping list;
    * that shopping-list entry is ticked off -> the bought amount is added back to the item.
    """

    def __init__(self, hass: HomeAssistant, entry: ConfigEntry) -> None:
        self.hass = hass
        self.entry = entry
        self.inventory = Inventory(hass, entry.entry_id)
        shopping_entity = entry_option(entry, CONF_SHOPPING_LIST, None)
        self.shopping = ShoppingList(hass, shopping_entity) if shopping_entity else None
        self.auto_add: bool = entry_option(entry, CONF_AUTO_ADD, DEFAULT_AUTO_ADD)
        self.auto_restock: bool = entry_option(entry, CONF_AUTO_RESTOCK, DEFAULT_AUTO_RESTOCK)
        self.match_by_name: bool = entry_option(entry, CONF_MATCH_BY_NAME, DEFAULT_MATCH_BY_NAME)
        self.remove_completed: bool = entry_option(entry, CONF_REMOVE_COMPLETED, DEFAULT_REMOVE_COMPLETED)
        self.expiring_days: int = int(entry_option(entry, CONF_EXPIRING_DAYS, DEFAULT_EXPIRING_DAYS))
        self._lock = asyncio.Lock()
        self._unsubs: list[Any] = []
        self._debouncer = Debouncer(
            hass,
            _LOGGER,
            cooldown=RECONCILE_COOLDOWN,
            immediate=False,
            function=self.async_reconcile,
        )

    @property
    def title(self) -> str:
        return self.entry.title

    @property
    def language(self) -> str:
        return self.hass.config.language or "en"

    # ---- lifecycle ------------------------------------------------------------

    async def async_setup(self) -> None:
        await self.inventory.async_load()
        self._unsubs.append(self.inventory.async_add_listener(self._notify))
        # Expiry depends on the date, so sensors refresh just after midnight.
        self._unsubs.append(
            async_track_time_change(self.hass, self._midnight, hour=0, minute=0, second=5)
        )
        if self.shopping is None:
            return
        self._unsubs.append(
            async_track_state_change_event(
                self.hass, [self.shopping.entity_id], self._shopping_list_changed
            )
        )
        # A shopping list may be ticked off while HA (or this integration) is down,
        # and not every to-do integration pushes changes, so also check now and then.
        self._unsubs.append(
            async_track_time_interval(self.hass, self._interval, RECONCILE_INTERVAL)
        )
        self._unsubs.append(async_at_started(self.hass, self._started))

    async def async_unload(self) -> None:
        for unsub in self._unsubs:
            unsub()
        self._unsubs.clear()
        self._debouncer.async_shutdown()
        await self.inventory.async_flush()

    @callback
    def _notify(self) -> None:
        async_dispatcher_send(self.hass, SIGNAL_UPDATED.format(self.entry.entry_id))

    @callback
    def _midnight(self, _now: Any) -> None:
        self._notify()

    async def _started(self, _hass: HomeAssistant) -> None:
        await self.async_reconcile()

    async def _interval(self, _now: Any) -> None:
        await self.async_reconcile()

    @callback
    def _shopping_list_changed(self, _event: Event[EventStateChangedData]) -> None:
        self._debouncer.async_schedule_call()

    # ---- what the card and services see -------------------------------------------

    def snapshot(self) -> dict[str, Any]:
        return {
            "entry_id": self.entry.entry_id,
            "title": self.title,
            "version": VERSION,
            "items": self.inventory.sorted_items(),
            "settings": {
                "shopping_list": self.shopping.entity_id if self.shopping else None,
                "auto_add": self.auto_add,
                "auto_restock": self.auto_restock,
                "expiring_days": self.expiring_days,
            },
            "units": DEFAULT_UNITS,
            "locations": DEFAULT_LOCATIONS,
            "categories": DEFAULT_CATEGORIES,
        }

    def get(self, ref: str) -> dict[str, Any]:
        item = self.inventory.find(ref)
        if item is None:
            raise ServiceValidationError(
                f"No item '{ref}' in {self.title}",
                translation_domain=DOMAIN,
                translation_key="item_not_found",
                translation_placeholders={"item": ref, "inventory": self.title},
            )
        return item

    # ---- operations -----------------------------------------------------------

    async def async_add_item(self, data: dict[str, Any]) -> dict[str, Any]:
        item = self.inventory.create(data)
        await self._after_change(item, None)
        return item

    async def async_update_item(self, ref: str, changes: dict[str, Any]) -> dict[str, Any]:
        item = self.get(ref)
        before = deepcopy(item)
        self.inventory.patch(item["id"], changes)
        await self._after_change(item, before)
        return item

    async def async_adjust(self, ref: str, amount: float) -> dict[str, Any]:
        item = self.get(ref)
        quantity = max(0.0, round(float(item[ATTR_QUANTITY]) + amount, 3))
        return await self.async_update_item(item["id"], {ATTR_QUANTITY: quantity})

    async def async_remove_item(self, ref: str) -> None:
        item = self.get(ref)
        self.inventory.delete(item["id"])
        self.inventory.async_changed()
        link = item.get("shopping")
        if self.shopping and link and link.get("uid"):
            # Only an open entry is removed: a ticked-off one is the user's record of a purchase.
            await self._remove_open_entries([link["uid"]])

    async def async_add_to_shopping_list(self, ref: str) -> dict[str, Any]:
        """Put an item on the shopping list by hand, whatever its stock."""
        if self.shopping is None:
            raise ServiceValidationError(
                "No shopping list is set for this inventory",
                translation_domain=DOMAIN,
                translation_key="no_shopping_list",
            )
        item = self.get(ref)
        async with self._lock:
            if not item.get("shopping"):
                await self._link(item, buy_amount(item), auto=False)
                self.inventory.async_changed()
        return item

    async def async_remove_from_shopping_list(self, ref: str) -> dict[str, Any]:
        item = self.get(ref)
        link = item.get("shopping")
        if not link:
            return item
        item["shopping"] = None
        if is_low(item):
            item["shopping_dismissed"] = True
        self.inventory.async_changed()
        if self.shopping and link.get("uid"):
            await self._remove_open_entries([link["uid"]])
        return item

    # ---- rules ----------------------------------------------------------------

    async def _after_change(self, item: dict[str, Any], before: dict[str, Any] | None) -> None:
        self.inventory.async_changed()
        if is_low(item) and (before is None or not is_low(before)):
            self.hass.bus.async_fire(EVENT_LOW_STOCK, self._event_data(item))
        await self._sync_item(item["id"])

    async def _sync_item(self, item_id: str) -> None:
        """Make the shopping list match one item's stock."""
        if self.shopping is None:
            return
        async with self._lock:
            item = self.inventory.items.get(item_id)
            if item is None:
                return
            changed = False
            link = item.get("shopping")
            try:
                if not is_low(item):
                    if item.get("shopping_dismissed"):
                        item["shopping_dismissed"] = False
                        changed = True
                    if link and link.get("auto"):
                        # Stock came back without the list (bought on the way home):
                        # the entry we added is no longer needed.
                        item["shopping"] = None
                        changed = True
                        if link.get("uid"):
                            await self._remove_open_entries([link["uid"]], locked=True)
                elif link:
                    summary = shopping_summary(item, buy_amount(item), self.language)
                    if link.get("uid") and summary != link.get("summary"):
                        await self.shopping.async_rename(link["uid"], summary)
                        link.update(summary=summary, amount=buy_amount(item))
                        changed = True
                elif self.auto_add and item.get("auto_shop", True) and not item.get("shopping_dismissed"):
                    await self._link(item, buy_amount(item), auto=True)
                    changed = True
            except HomeAssistantError as err:
                _LOGGER.warning("Could not update %s for %s: %s", self.shopping.entity_id, item["name"], err)
            if changed:
                self.inventory.async_changed()

    async def _link(self, item: dict[str, Any], amount: float, *, auto: bool) -> None:
        """Write an item to the shopping list and remember the entry. Caller holds the lock."""
        assert self.shopping is not None
        summary = shopping_summary(item, amount, self.language)
        uid = await self.shopping.async_add(summary, description=f"{self.title} · Stock Pulse")
        item["shopping"] = {
            "uid": uid,
            "summary": summary,
            "amount": amount,
            "auto": auto,
            "added": dt_util.utcnow().isoformat(),
        }
        item["shopping_dismissed"] = False
        self.hass.bus.async_fire(
            EVENT_ADDED_TO_SHOPPING_LIST,
            {**self._event_data(item), "amount": amount, "automatic": auto, "shopping_list": self.shopping.entity_id},
        )

    async def _remove_open_entries(self, uids: list[str], *, locked: bool = False) -> None:
        assert self.shopping is not None
        try:
            if locked:
                open_uids = await self._open_uids(uids)
            else:
                async with self._lock:
                    open_uids = await self._open_uids(uids)
            await self.shopping.async_remove(open_uids)
        except HomeAssistantError as err:
            _LOGGER.warning("Could not remove items from %s: %s", self.shopping.entity_id, err)

    async def _open_uids(self, uids: list[str]) -> list[str]:
        assert self.shopping is not None
        wanted = set(uids)
        return [
            todo["uid"]
            for todo in await self.shopping.async_items()
            if todo.get("uid") in wanted and todo.get("status") == "needs_action"
        ]

    async def async_reconcile(self) -> None:
        """Read the shopping list and restock whatever was ticked off."""
        if self.shopping is None or not self.shopping.available:
            return
        restocked: list[tuple[dict[str, Any], dict[str, Any], float]] = []
        to_remove: list[str] = []
        async with self._lock:
            try:
                todos = await self.shopping.async_items()
            except HomeAssistantError as err:
                _LOGGER.debug("Could not read %s: %s", self.shopping.entity_id, err)
                return
            changed = False
            sync = self.inventory.sync_state
            by_uid = {todo.get("uid"): todo for todo in todos}
            completed_uids = {todo.get("uid") for todo in todos if todo.get("status") == "completed"}

            if sync.get("entity_id") != self.shopping.entity_id:
                # First run, or a different list: entries already ticked off are history, not purchases,
                # and links to the old list mean nothing any more.
                sync["entity_id"] = self.shopping.entity_id
                sync["seen"] = sorted(completed_uids)
                for item in self.inventory.items.values():
                    if item.get("shopping"):
                        item["shopping"] = None
                self.inventory.async_changed()
                first_run = True
            else:
                first_run = False
            seen = set(sync.get("seen", []))
            linked: set[str] = set()

            for item in self.inventory.items.values():
                link = item.get("shopping")
                if not link:
                    continue
                if not link.get("uid"):
                    link["uid"] = self._adopt_uid(link, todos, linked)
                    changed = True
                todo = by_uid.get(link.get("uid"))
                if todo is None:
                    # Removed from the list without being bought.
                    item["shopping"] = None
                    item["shopping_dismissed"] = is_low(item)
                    changed = True
                elif todo.get("status") == "completed":
                    item["shopping"] = None
                    changed = True
                    seen.add(todo["uid"])
                    if self.remove_completed:
                        to_remove.append(todo["uid"])
                    if self.auto_restock:
                        _, parsed = parse_summary(todo.get("summary", ""))
                        amount = parsed or float(link.get("amount") or 1)
                        restocked.append((item, deepcopy(item), amount))
                        self._restock(item, amount)
                    else:
                        item["shopping_dismissed"] = is_low(item)
                else:
                    linked.add(link["uid"])

            if self.auto_restock and self.match_by_name and not first_run:
                # Entries typed into the list by hand ("Milk") restock an item with the same name.
                for todo in todos:
                    uid = todo.get("uid")
                    if todo.get("status") != "completed" or uid in seen:
                        continue
                    seen.add(uid)
                    name, parsed = parse_summary(todo.get("summary", ""))
                    item = self._by_name(name)
                    if item is None:
                        continue
                    amount = parsed or float(item.get("restock_quantity") or 1)
                    restocked.append((item, deepcopy(item), amount))
                    self._restock(item, amount)
                    changed = True
                    if self.remove_completed:
                        to_remove.append(uid)

            pruned = sorted(seen & completed_uids)
            if pruned != sync.get("seen"):
                sync["seen"] = pruned
                changed = True
            if changed:
                self.inventory.async_changed()

        if to_remove:
            try:
                await self.shopping.async_remove(to_remove)
            except HomeAssistantError as err:
                _LOGGER.warning("Could not clear bought items from %s: %s", self.shopping.entity_id, err)
        for item, before, amount in restocked:
            self.hass.bus.async_fire(
                EVENT_RESTOCKED, {**self._event_data(item), "amount": amount, "previous_quantity": before[ATTR_QUANTITY]}
            )
            # Still low after buying (a big threshold, a small pack)? Then it goes back on the list.
            await self._after_change(item, before)

    @staticmethod
    def _adopt_uid(link: dict[str, Any], todos: list[dict[str, Any]], taken: set[str]) -> str | None:
        """An entry added before its uid could be read: find it by its text."""
        for todo in reversed(todos):
            if todo.get("summary") == link.get("summary") and todo.get("uid") not in taken:
                return todo.get("uid")
        return None

    def _by_name(self, name: str) -> dict[str, Any] | None:
        wanted = norm_name(name)
        for item in self.inventory.items.values():
            if norm_name(item["name"]) == wanted:
                return item
        return None

    @staticmethod
    def _restock(item: dict[str, Any], amount: float) -> None:
        if float(item[ATTR_QUANTITY]) <= 0:
            # The old batch is gone, so its best-before date is too.
            item["expiry"] = None
        item[ATTR_QUANTITY] = round(float(item[ATTR_QUANTITY]) + amount, 3)
        item["shopping_dismissed"] = False
        item["updated"] = dt_util.utcnow().isoformat()

    def _event_data(self, item: dict[str, Any]) -> dict[str, Any]:
        return {
            "inventory": self.entry.entry_id,
            "inventory_name": self.title,
            "item_id": item["id"],
            "name": item["name"],
            "quantity": item[ATTR_QUANTITY],
            "unit": item.get("unit"),
            "min_quantity": item.get("min_quantity"),
            "location": item.get("location"),
            "category": item.get("category"),
        }
