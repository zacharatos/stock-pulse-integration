"""End-to-end: inventory <-> shopping list, services, websocket, sensors, config flow."""

from __future__ import annotations

from datetime import timedelta

import aiohttp
import voluptuous as vol

from pytest_homeassistant_custom_component.common import MockConfigEntry, async_fire_time_changed
import pytest

from homeassistant import config_entries
from homeassistant.core import HomeAssistant
from homeassistant.data_entry_flow import FlowResultType
from homeassistant.util import dt as dt_util

from custom_components.stock_pulse.const import DOMAIN

from .conftest import SHOPPING


async def todo_items(hass: HomeAssistant) -> list[dict]:
    resp = await hass.services.async_call(
        "todo", "get_items", {"status": ["needs_action", "completed"]},
        target={"entity_id": SHOPPING}, blocking=True, return_response=True,
    )
    return resp[SHOPPING]["items"]


async def tick(hass: HomeAssistant, summary: str) -> None:
    await hass.services.async_call(
        "todo", "update_item", {"item": summary, "status": "completed"},
        target={"entity_id": SHOPPING}, blocking=True,
    )
    await settle(hass)


async def settle(hass: HomeAssistant) -> None:
    await hass.async_block_till_done()
    async_fire_time_changed(hass, dt_util.utcnow() + timedelta(seconds=5))
    await hass.async_block_till_done()


def manager(entry: MockConfigEntry):
    return entry.runtime_data


async def add(hass, **data):
    resp = await hass.services.async_call(DOMAIN, "add_item", data, blocking=True, return_response=True)
    await hass.async_block_till_done()
    return resp["item"]


async def adjust(hass, item, amount):
    await hass.services.async_call(DOMAIN, "adjust_quantity", {"item": item, "amount": amount}, blocking=True)
    await settle(hass)


async def test_low_item_goes_on_list_and_comes_back_when_bought(hass, inventory):
    item = await add(hass, name="Toilet paper", quantity=4, unit="roll", min_quantity=2, restock_quantity=6)
    assert await todo_items(hass) == []

    await adjust(hass, "toilet paper", -1)
    assert await todo_items(hass) == []  # 3 > 2

    await adjust(hass, "Toilet paper", -1)  # 2 <= 2: low
    todos = await todo_items(hass)
    assert [t["summary"] for t in todos] == ["Toilet paper (6 rolls)"]
    stored = manager(inventory).inventory.items[item["id"]]
    assert stored["shopping"]["uid"] == todos[0]["uid"]

    # Using more does not add a second entry.
    await adjust(hass, "Toilet paper", -1)
    assert len(await todo_items(hass)) == 1

    await tick(hass, "Toilet paper (6 rolls)")
    assert stored["quantity"] == 7  # 1 + 6
    assert stored["shopping"] is None
    todos = await todo_items(hass)
    assert [t["status"] for t in todos] == ["completed"]  # left ticked off by default

    # A second sync must not restock again.
    await manager(inventory).async_reconcile()
    assert stored["quantity"] == 7


async def test_buy_amount_defaults_to_just_above_threshold(hass, inventory):
    await add(hass, name="Eggs", quantity=5, min_quantity=2)
    await adjust(hass, "Eggs", -5)  # 0 left -> buy 3
    assert [t["summary"] for t in await todo_items(hass)] == ["Eggs (3 pieces)"]
    await adjust(hass, "Eggs", 0)
    await tick(hass, "Eggs (3 pieces)")
    assert manager(inventory).inventory.find("eggs")["quantity"] == 3


async def test_entry_text_follows_stock_and_user_edit_wins(hass, inventory):
    await add(hass, name="Milk", quantity=2, unit="bottle", min_quantity=1)
    await adjust(hass, "Milk", -1)  # 1 left: buy 1
    assert [t["summary"] for t in await todo_items(hass)] == ["Milk (1 bottle)"]
    await adjust(hass, "Milk", -1)  # 0 left: buy 2
    todos = await todo_items(hass)
    assert [t["summary"] for t in todos] == ["Milk (2 bottles)"]
    # The user changes the amount in the list itself; that is what gets restocked.
    await hass.services.async_call(
        "todo", "update_item", {"item": todos[0]["uid"], "rename": "Milk (4 bottles)"},
        target={"entity_id": SHOPPING}, blocking=True,
    )
    await tick(hass, "Milk (4 bottles)")
    assert manager(inventory).inventory.find("milk")["quantity"] == 4


async def test_restocked_without_list_removes_entry(hass, inventory):
    await add(hass, name="Coffee", quantity=1, unit="pack", min_quantity=1)
    await settle(hass)
    assert len(await todo_items(hass)) == 1
    await adjust(hass, "Coffee", 2)
    assert await todo_items(hass) == []


async def test_removed_entry_is_not_added_again_until_restocked(hass, inventory):
    await add(hass, name="Rice", quantity=1, unit="kg", min_quantity=1)
    await settle(hass)
    uid = (await todo_items(hass))[0]["uid"]
    await hass.services.async_call("todo", "remove_item", {"item": [uid]}, target={"entity_id": SHOPPING}, blocking=True)
    await settle(hass)
    item = manager(inventory).inventory.find("rice")
    assert item["shopping"] is None and item["shopping_dismissed"] is True
    await adjust(hass, "Rice", -0.5)
    assert await todo_items(hass) == []
    await adjust(hass, "Rice", 2)  # above threshold: the dismissal is forgotten
    await adjust(hass, "Rice", -2)
    assert len(await todo_items(hass)) == 1


async def test_hand_typed_entry_restocks_by_name(hass, inventory):
    await add(hass, name="Dish soap", quantity=0, unit="bottle")
    await hass.services.async_call("todo", "add_item", {"item": "dish soap (2)"}, target={"entity_id": SHOPPING}, blocking=True)
    await hass.services.async_call("todo", "add_item", {"item": "Bananas"}, target={"entity_id": SHOPPING}, blocking=True)
    await settle(hass)
    await tick(hass, "dish soap (2)")
    await tick(hass, "Bananas")
    assert manager(inventory).inventory.find("Dish soap")["quantity"] == 2
    assert manager(inventory).inventory.find("Bananas") is None


async def test_items_already_ticked_at_setup_are_history(hass, shopping_list):
    await hass.services.async_call("todo", "add_item", {"item": "Flour"}, target={"entity_id": SHOPPING}, blocking=True)
    await hass.services.async_call("todo", "update_item", {"item": "Flour", "status": "completed"}, target={"entity_id": SHOPPING}, blocking=True)
    entry = MockConfigEntry(domain=DOMAIN, title="Home", data={"shopping_list": SHOPPING})
    entry.add_to_hass(hass)
    assert await hass.config_entries.async_setup(entry.entry_id)
    await hass.async_block_till_done()
    await add(hass, name="Flour", quantity=0)
    await manager(entry).async_reconcile()
    assert manager(entry).inventory.find("Flour")["quantity"] == 0


@pytest.mark.parametrize("options", [{"remove_completed": True}])
async def test_remove_completed(hass, inventory):
    await add(hass, name="Salt", quantity=0, min_quantity=0)
    await settle(hass)
    await tick(hass, "Salt")
    assert manager(inventory).inventory.find("Salt")["quantity"] == 1
    assert await todo_items(hass) == []


@pytest.mark.parametrize("options", [{"auto_add": False}])
async def test_auto_add_off_but_manual_add_works(hass, inventory):
    await add(hass, name="Tea", quantity=0, min_quantity=1)
    await settle(hass)
    assert await todo_items(hass) == []
    await hass.services.async_call(DOMAIN, "add_to_shopping_list", {"item": "Tea"}, blocking=True)
    assert [t["summary"] for t in await todo_items(hass)] == ["Tea (2 pieces)"]


async def test_out_of_stock_restock_clears_old_date(hass, inventory):
    await add(hass, name="Yoghurt", quantity=1, min_quantity=0, expiry="2026-01-01", restock_quantity=4)
    await adjust(hass, "Yoghurt", -1)
    await tick(hass, "Yoghurt (4 pieces)")
    item = manager(inventory).inventory.find("Yoghurt")
    assert item["quantity"] == 4 and item["expiry"] is None


async def test_add_item_service_merges_and_get_items(hass, inventory):
    await add(hass, name="Batteries", quantity=4, location="other")
    await add(hass, name="batteries", quantity=2)
    resp = await hass.services.async_call(DOMAIN, "get_items", {}, blocking=True, return_response=True)
    assert [(i["name"], i["quantity"]) for i in resp["items"]] == [("Batteries", 6)]
    resp = await hass.services.async_call(DOMAIN, "get_items", {"location": "freezer"}, blocking=True, return_response=True)
    assert resp["items"] == []


async def test_events(hass, inventory):
    seen = []
    hass.bus.async_listen(f"{DOMAIN}_low_stock", lambda e: seen.append(("low", e.data["name"])))
    hass.bus.async_listen(f"{DOMAIN}_restocked", lambda e: seen.append(("restocked", e.data["amount"])))
    await add(hass, name="Bread", quantity=1, min_quantity=0)
    await adjust(hass, "Bread", -1)
    await tick(hass, "Bread")
    assert seen == [("low", "Bread"), ("restocked", 1.0)]


async def test_sensors(hass, inventory):
    today = dt_util.now().date()
    await add(hass, name="Peas", quantity=1, location="freezer", expiry=(today + timedelta(days=2)).isoformat())
    await add(hass, name="Ham", quantity=1, expiry=(today - timedelta(days=1)).isoformat())
    await add(hass, name="Pasta", quantity=0)
    await settle(hass)
    assert hass.states.get("sensor.home_in_stock").state == "2"
    assert hass.states.get("sensor.home_low_stock").state == "1"
    assert hass.states.get("sensor.home_expiring_soon").attributes["items"][0]["name"] == "Peas"
    assert hass.states.get("sensor.home_expired").state == "1"


async def test_websocket(hass, inventory, hass_ws_client):
    client = await hass_ws_client(hass)
    await client.send_json_auto_id({"type": f"{DOMAIN}/subscribe"})
    assert (await client.receive_json())["success"]
    snapshot = (await client.receive_json())["event"]
    assert snapshot["title"] == "Home" and snapshot["items"] == []

    await client.send_json_auto_id({"type": f"{DOMAIN}/item/add", "item": {"name": "Beans", "quantity": "3", "expiry": ""}})
    msg = await client.receive_json()
    while msg["type"] == "event":
        msg = await client.receive_json()
    assert msg["success"], msg
    item = msg["result"]
    assert item["quantity"] == 3 and item["expiry"] is None

    await client.send_json_auto_id({"type": f"{DOMAIN}/item/adjust", "item_id": item["id"], "amount": -1})
    msg = await client.receive_json()
    while msg["type"] == "event":
        msg = await client.receive_json()
    assert msg["result"]["quantity"] == 2

    await client.send_json_auto_id({"type": f"{DOMAIN}/item/update", "item_id": item["id"], "changes": {"quantity": -4}})
    msg = await client.receive_json()
    while msg["type"] == "event":
        msg = await client.receive_json()
    assert not msg["success"] and msg["error"]["code"] == "invalid_format"

    await client.send_json_auto_id({"type": f"{DOMAIN}/item/remove", "item_id": item["id"]})
    msg = await client.receive_json()
    while msg["type"] == "event":
        msg = await client.receive_json()
    assert msg["success"]
    assert manager(inventory).inventory.items == {}


async def test_items_survive_reload(hass, inventory):
    await add(hass, name="Oil", quantity=1, unit="bottle")
    assert await hass.config_entries.async_reload(inventory.entry_id)
    await hass.async_block_till_done()
    assert manager(inventory).inventory.find("Oil")["unit"] == "bottle"


async def test_config_flow(hass, shopping_list):
    result = await hass.config_entries.flow.async_init(DOMAIN, context={"source": config_entries.SOURCE_USER})
    assert result["type"] is FlowResultType.FORM
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        {"name": "Cabin", "shopping_list": SHOPPING, "auto_add": True, "auto_restock": True,
         "match_by_name": False, "remove_completed": False, "expiring_days": 5},
    )
    assert result["type"] is FlowResultType.CREATE_ENTRY
    assert result["title"] == "Cabin"
    assert result["data"]["expiring_days"] == 5
    await hass.async_block_till_done()

    entry = hass.config_entries.async_entries(DOMAIN)[0]
    result = await hass.config_entries.options.async_init(entry.entry_id)
    result = await hass.config_entries.options.async_configure(
        result["flow_id"], {"auto_add": False, "auto_restock": True, "match_by_name": True,
                            "remove_completed": False, "expiring_days": 2},
    )
    assert result["type"] is FlowResultType.CREATE_ENTRY
    await hass.async_block_till_done()
    assert entry.runtime_data.shopping is None
    assert entry.runtime_data.expiring_days == 2


async def test_card_is_served_and_loaded(hass, inventory, hass_client):
    from homeassistant.components.frontend import DATA_EXTRA_MODULE_URL

    urls = list(hass.data[DATA_EXTRA_MODULE_URL].urls)
    assert any(u.startswith("/stock_pulse_frontend/stock-pulse-card.js?v=") for u in urls)
    client = await hass_client()
    resp = await client.get("/stock_pulse_frontend/stock-pulse-card.js")
    assert resp.status == 200



async def test_actions_are_registered_and_translated(hass, inventory):
    import json
    from pathlib import Path

    from homeassistant.util.yaml import load_yaml_dict

    folder = Path(__file__).parent.parent / "custom_components" / DOMAIN
    services = load_yaml_dict(str(folder / "services.yaml"))
    assert set(services) == set(hass.services.async_services_for_domain(DOMAIN))
    for lang in ("en", "el"):
        strings = json.loads((folder / "translations" / f"{lang}.json").read_text())["services"]
        for name, spec in services.items():
            assert set(spec["fields"]) == set(strings[name]["fields"]), (lang, name)


OFF = "https://world.openfoodfacts.org/api/v2/product/{}"
OBF = "https://world.openbeautyfacts.org/api/v2/product/{}"
OPF = "https://world.openproductsfacts.org/api/v2/product/{}"


async def ws_call(client, msg):
    await client.send_json_auto_id(msg)
    reply = await client.receive_json()
    while reply["type"] == "event":
        reply = await client.receive_json()
    return reply


async def test_barcodes_on_items_and_actions(hass, inventory):
    gouda = await add(hass, name="Gouda", quantity=1, barcode="5202576461208")
    assert gouda["barcodes"] == ["5202576461208"]

    # The same pack again, under another name: tops up the item that has the barcode.
    again = await add(hass, name="Τυρί gouda φέτες", quantity=1, barcode="5202576461208")
    assert again["id"] == gouda["id"] and again["quantity"] == 2 and again["name"] == "Gouda"

    # A barcode works wherever an item is named, e.g. from a handheld scanner automation.
    await adjust(hass, "5202576461208", -1)
    assert manager(inventory).inventory.items[gouda["id"]]["quantity"] == 1

    # `barcode` adds to the list; a UPC-A is stored as its EAN form.
    resp = await hass.services.async_call(
        DOMAIN, "update_item", {"item": "Gouda", "barcode": "036000291452"}, blocking=True, return_response=True
    )
    assert resp["item"]["barcodes"] == ["5202576461208", "0036000291452"]

    # A barcode belongs to one item: giving it to another takes it away from the first.
    milk = await add(hass, name="Milk", barcodes=["0036000291452"])
    assert milk["barcodes"] == ["0036000291452"]
    assert manager(inventory).inventory.items[gouda["id"]]["barcodes"] == ["5202576461208"]

    # Items stored before barcodes existed load without the field and still work.
    del manager(inventory).inventory.items[milk["id"]]["barcodes"]
    assert manager(inventory).inventory.find_barcode("0036000291452") is None

    with pytest.raises(vol.Invalid):
        await add(hass, name="Bread", barcode="not a code")


async def test_lookup_known_item_needs_no_internet(hass, inventory, hass_ws_client, aioclient_mock):
    item = await add(hass, name="Gouda", barcodes=["5202576461208"])
    client = await hass_ws_client(hass)
    reply = await ws_call(client, {"type": f"{DOMAIN}/item/lookup", "barcode": "520 2576 461208"})
    assert reply["success"], reply
    assert reply["result"] == {"barcode": "5202576461208", "item_id": item["id"], "product": None, "source": None, "error": None}
    assert aioclient_mock.call_count == 0


async def test_lookup_product_found_and_cached(hass, inventory, hass_ws_client, aioclient_mock):
    code = "5208069003184"
    aioclient_mock.get(
        OFF.format(code),
        json={"status": 1, "product": {"product_name": "Soft light", "brands": "Βιτάμ", "quantity": "225 g"}},
    )
    client = await hass_ws_client(hass)
    reply = await ws_call(client, {"type": f"{DOMAIN}/item/lookup", "barcode": code})
    assert reply["result"]["product"] == {"name": "Soft light", "category": "food", "notes": "Βιτάμ · 225 g", "image": None}
    assert reply["result"]["source"] == "openfoodfacts" and reply["result"]["item_id"] is None
    # The request says who is asking, as Open Food Facts asks.
    assert "StockPulse/" in aioclient_mock.mock_calls[0][3]["User-Agent"]
    await ws_call(client, {"type": f"{DOMAIN}/item/lookup", "barcode": code})
    assert aioclient_mock.call_count == 1


async def test_lookup_falls_through_the_databases(hass, inventory, hass_ws_client, aioclient_mock):
    code = "5201234567890"
    aioclient_mock.get(OFF.format(code), status=404, json={"status": 0})
    aioclient_mock.get(OBF.format(code), json={"status": 1, "product": {"product_name": "Shampoo"}})
    client = await hass_ws_client(hass)
    reply = await ws_call(client, {"type": f"{DOMAIN}/item/lookup", "barcode": code})
    assert reply["result"]["source"] == "openbeautyfacts"
    assert reply["result"]["product"]["category"] == "toiletries"


async def test_lookup_not_found_and_offline(hass, inventory, hass_ws_client, aioclient_mock):
    missing, offline = "5200000000001", "5200000000002"
    for url in (OFF, OBF, OPF):
        aioclient_mock.get(url.format(missing), status=404, json={"status": 0})
        aioclient_mock.get(url.format(offline), exc=aiohttp.ClientError("down"))
    client = await hass_ws_client(hass)
    reply = await ws_call(client, {"type": f"{DOMAIN}/item/lookup", "barcode": missing})
    assert reply["result"]["product"] is None and reply["result"]["error"] is None
    reply = await ws_call(client, {"type": f"{DOMAIN}/item/lookup", "barcode": offline})
    assert reply["success"] and reply["result"]["product"] is None and reply["result"]["error"]
    reply = await ws_call(client, {"type": f"{DOMAIN}/item/lookup", "barcode": "Milk"})
    assert not reply["success"]


async def test_opened_pack(hass, inventory):
    today = dt_util.now().date()
    opened = (today - timedelta(days=8)).isoformat()
    turkey = await add(hass, name="Smoked turkey", quantity=1, expiry=(today + timedelta(days=77)).isoformat(),
                       opened_on=opened, days_after_opening=10)
    assert turkey["opened_on"] == opened and turkey["days_after_opening"] == 10
    await settle(hass)
    soon = hass.states.get("sensor.home_expiring_soon")
    assert soon.state == "1"
    assert soon.attributes["items"][0]["use_by"] == (today + timedelta(days=2)).isoformat()

    # Buying more while it's open keeps the open pack's date.
    await adjust(hass, "Smoked turkey", 1)
    assert manager(inventory).inventory.items[turkey["id"]]["opened_on"] == opened
    # Ran out and restocked: the new packs are sealed.
    await adjust(hass, "Smoked turkey", -2)
    await adjust(hass, "Smoked turkey", 1)
    assert manager(inventory).inventory.items[turkey["id"]]["opened_on"] is None

    with pytest.raises(vol.Invalid):
        await add(hass, name="Milk", days_after_opening=2.5)


async def test_using_up_the_open_pack_clears_its_date(hass, inventory):
    today = dt_util.now().date()
    opened = (today - timedelta(days=8)).isoformat()
    turkey = await add(hass, name="Smoked turkey", quantity=2, expiry=(today + timedelta(days=77)).isoformat(),
                       opened_on=opened, days_after_opening=10)
    await settle(hass)
    stored = manager(inventory).inventory.items[turkey["id"]]
    assert hass.states.get("sensor.home_expiring_soon").state == "1"

    # One pack left, and it is sealed: nothing expires any more.
    await adjust(hass, "Smoked turkey", -1)
    assert stored["quantity"] == 1 and stored["opened_on"] is None
    assert hass.states.get("sensor.home_expiring_soon").state == "0"

    # Buying more while one is open keeps the open pack's date.
    await hass.services.async_call(DOMAIN, "update_item", {"item": "Smoked turkey", "opened_on": opened}, blocking=True)
    await adjust(hass, "Smoked turkey", 1)
    assert stored["quantity"] == 2 and stored["opened_on"] == opened
    # Half of the open one eaten is still the open one.
    await adjust(hass, "Smoked turkey", -0.5)
    assert stored["opened_on"] == opened


async def test_sheet_save_lowering_quantity(hass, inventory, hass_ws_client):
    today = dt_util.now().date()
    opened = (today - timedelta(days=2)).isoformat()
    item = await add(hass, name="Smoked turkey", quantity=3, opened_on=opened, days_after_opening=10)
    stored = manager(inventory).inventory.items[item["id"]]
    client = await hass_ws_client(hass)

    async def update(changes):
        await client.send_json_auto_id({"type": f"{DOMAIN}/item/update", "item_id": item["id"], "changes": changes})
        msg = await client.receive_json()
        assert msg["success"], msg

    await update({"quantity": 2})
    assert stored["opened_on"] is None
    # Lowering the quantity and dating the next pack in one save keeps the date given.
    await update({"quantity": 1, "opened_on": opened})
    assert stored["quantity"] == 1 and stored["opened_on"] == opened
