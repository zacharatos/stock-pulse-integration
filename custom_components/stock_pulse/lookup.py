"""Product lookup by barcode in Open Food Facts and its sister databases.

Free, no account or key. Only used when a scanned barcode isn't on any item yet; answers are kept
in memory for a while, so scanning the same pack twice doesn't ask again.
"""

from __future__ import annotations

import asyncio
import logging
import time
from typing import Any

import aiohttp

from homeassistant.core import HomeAssistant
from homeassistant.exceptions import HomeAssistantError
from homeassistant.helpers.aiohttp_client import async_get_clientsession

from .const import DOMAIN, LOOKUP_TIMEOUT, LOOKUP_USER_AGENT

_LOGGER = logging.getLogger(__name__)

# Asked in this order; food first because that's most of a household inventory.
SOURCES: tuple[tuple[str, str], ...] = (
    ("openfoodfacts", "https://world.openfoodfacts.org"),
    ("openbeautyfacts", "https://world.openbeautyfacts.org"),
    ("openproductsfacts", "https://world.openproductsfacts.org"),
)
FIELDS = ",".join(
    (
        "code",
        "product_name",
        "product_name_en",
        "product_name_el",
        "generic_name",
        "brands",
        "quantity",
        "categories_tags",
        "image_front_small_url",
        "image_small_url",
    )
)
FOUND_TTL = 7 * 24 * 3600
NOT_FOUND_TTL = 6 * 3600
_CACHE_KEY = f"{DOMAIN}_lookup_cache"

type Found = tuple[str, dict[str, Any]] | None


def _cache(hass: HomeAssistant) -> dict[str, tuple[float, Found]]:
    return hass.data.setdefault(_CACHE_KEY, {})


async def _ask(session: aiohttp.ClientSession, base: str, code: str) -> dict[str, Any] | None:
    url = f"{base}/api/v2/product/{code}"
    async with asyncio.timeout(LOOKUP_TIMEOUT):
        async with session.get(
            url, params={"fields": FIELDS}, headers={"User-Agent": LOOKUP_USER_AGENT}
        ) as resp:
            if resp.status == 404:
                return None
            resp.raise_for_status()
            data = await resp.json(content_type=None)
    if not isinstance(data, dict) or data.get("status") != 1 or not isinstance(data.get("product"), dict):
        return None
    return data["product"]


async def async_lookup_product(hass: HomeAssistant, code: str) -> Found:
    """(source, product) for a normalised barcode, or None when no database knows it.

    Raises HomeAssistantError when nothing was found and at least one database couldn't be reached,
    so "not found" is only said when it is true.
    """
    cache = _cache(hass)
    now = time.monotonic()
    if (hit := cache.get(code)) is not None and hit[0] > now:
        return hit[1]
    session = async_get_clientsession(hass)
    failed: list[str] = []
    for source, base in SOURCES:
        try:
            product = await _ask(session, base, code)
        except (TimeoutError, aiohttp.ClientError, ValueError) as err:
            _LOGGER.debug("Looking up %s in %s failed: %s", code, source, err)
            failed.append(source)
            continue
        if product is not None:
            cache[code] = (now + FOUND_TTL, (source, product))
            return source, product
    if failed:
        raise HomeAssistantError(f"Could not reach {', '.join(failed)}")
    cache[code] = (now + NOT_FOUND_TTL, None)
    return None
