"""Constants for Stock Pulse."""

from __future__ import annotations

from typing import Final

DOMAIN: Final = "stock_pulse"
VERSION: Final = "1.2.0"

STORAGE_VERSION: Final = 1

# Config entry keys
CONF_SHOPPING_LIST: Final = "shopping_list"
CONF_AUTO_ADD: Final = "auto_add"
CONF_AUTO_RESTOCK: Final = "auto_restock"
CONF_MATCH_BY_NAME: Final = "match_by_name"
CONF_REMOVE_COMPLETED: Final = "remove_completed"
CONF_EXPIRING_DAYS: Final = "expiring_days"

DEFAULT_NAME: Final = "Home"
DEFAULT_AUTO_ADD: Final = True
DEFAULT_AUTO_RESTOCK: Final = True
DEFAULT_MATCH_BY_NAME: Final = True
DEFAULT_REMOVE_COMPLETED: Final = False
DEFAULT_EXPIRING_DAYS: Final = 3

# Built-in keys. The card translates these; anything else is shown as typed.
DEFAULT_UNITS: Final = [
    "pcs", "pack", "roll", "bottle", "can", "box", "bag", "jar", "kg", "g", "l", "ml",
]
DEFAULT_LOCATIONS: Final = ["pantry", "fridge", "freezer", "bathroom", "cleaning", "other"]
DEFAULT_CATEGORIES: Final = [
    "food", "drinks", "frozen", "cleaning", "toiletries", "household", "baby", "pets",
    "medicine", "other",
]

# Item fields
ATTR_ID: Final = "id"
ATTR_NAME: Final = "name"
ATTR_QUANTITY: Final = "quantity"
ATTR_UNIT: Final = "unit"
ATTR_CATEGORY: Final = "category"
ATTR_LOCATION: Final = "location"
ATTR_EXPIRY: Final = "expiry"
ATTR_MIN_QUANTITY: Final = "min_quantity"
ATTR_RESTOCK_QUANTITY: Final = "restock_quantity"
ATTR_AUTO_SHOP: Final = "auto_shop"
ATTR_NOTES: Final = "notes"
ATTR_ICON: Final = "icon"
ATTR_AMOUNT: Final = "amount"
ATTR_ITEM: Final = "item"
ATTR_INVENTORY: Final = "inventory"

# Fields a client may set on an item. Everything else is managed by the integration.
EDITABLE_FIELDS: Final = (
    ATTR_NAME,
    ATTR_QUANTITY,
    ATTR_UNIT,
    ATTR_CATEGORY,
    ATTR_LOCATION,
    ATTR_EXPIRY,
    ATTR_MIN_QUANTITY,
    ATTR_RESTOCK_QUANTITY,
    ATTR_AUTO_SHOP,
    ATTR_NOTES,
    ATTR_ICON,
)

# Events fired on the bus, for automations.
EVENT_LOW_STOCK: Final = f"{DOMAIN}_low_stock"
EVENT_RESTOCKED: Final = f"{DOMAIN}_restocked"
EVENT_ADDED_TO_SHOPPING_LIST: Final = f"{DOMAIN}_added_to_shopping_list"

# Dispatcher signal (formatted with the entry id) sent whenever an inventory changes.
SIGNAL_UPDATED: Final = f"{DOMAIN}_updated_{{}}"

FRONTEND_URL_BASE: Final = f"/{DOMAIN}_frontend"
CARD_FILENAME: Final = "stock-pulse-card.js"
