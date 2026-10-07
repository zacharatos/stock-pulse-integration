"""Config and options flow: name the inventory and pick its shopping list."""

from __future__ import annotations

from typing import Any

import voluptuous as vol

from homeassistant.config_entries import ConfigEntry, ConfigFlow, ConfigFlowResult, OptionsFlow
from homeassistant.const import CONF_NAME
from homeassistant.core import callback
from homeassistant.helpers import selector

from .const import (
    CONF_AUTO_ADD,
    CONF_AUTO_RESTOCK,
    CONF_EXPIRING_DAYS,
    CONF_MATCH_BY_NAME,
    CONF_REMOVE_COMPLETED,
    CONF_SHOPPING_LIST,
    DEFAULT_AUTO_ADD,
    DEFAULT_AUTO_RESTOCK,
    DEFAULT_EXPIRING_DAYS,
    DEFAULT_MATCH_BY_NAME,
    DEFAULT_NAME,
    DEFAULT_REMOVE_COMPLETED,
    DOMAIN,
)

OPTION_KEYS = (
    CONF_SHOPPING_LIST,
    CONF_AUTO_ADD,
    CONF_AUTO_RESTOCK,
    CONF_MATCH_BY_NAME,
    CONF_REMOVE_COMPLETED,
    CONF_EXPIRING_DAYS,
)


def _options_schema(values: dict[str, Any]) -> dict[Any, Any]:
    shopping = values.get(CONF_SHOPPING_LIST)
    return {
        vol.Optional(
            CONF_SHOPPING_LIST, description={"suggested_value": shopping} if shopping else None
        ): selector.EntitySelector(selector.EntitySelectorConfig(domain="todo")),
        vol.Required(CONF_AUTO_ADD, default=values.get(CONF_AUTO_ADD, DEFAULT_AUTO_ADD)): bool,
        vol.Required(CONF_AUTO_RESTOCK, default=values.get(CONF_AUTO_RESTOCK, DEFAULT_AUTO_RESTOCK)): bool,
        vol.Required(CONF_MATCH_BY_NAME, default=values.get(CONF_MATCH_BY_NAME, DEFAULT_MATCH_BY_NAME)): bool,
        vol.Required(
            CONF_REMOVE_COMPLETED, default=values.get(CONF_REMOVE_COMPLETED, DEFAULT_REMOVE_COMPLETED)
        ): bool,
        vol.Required(
            CONF_EXPIRING_DAYS, default=values.get(CONF_EXPIRING_DAYS, DEFAULT_EXPIRING_DAYS)
        ): selector.NumberSelector(
            selector.NumberSelectorConfig(min=0, max=60, step=1, mode=selector.NumberSelectorMode.BOX)
        ),
    }


def _clean(user_input: dict[str, Any]) -> dict[str, Any]:
    data = {k: user_input[k] for k in OPTION_KEYS if k in user_input}
    data[CONF_EXPIRING_DAYS] = int(data.get(CONF_EXPIRING_DAYS, DEFAULT_EXPIRING_DAYS))
    if not data.get(CONF_SHOPPING_LIST):
        data[CONF_SHOPPING_LIST] = None
    return data


class StockPulseConfigFlow(ConfigFlow, domain=DOMAIN):
    VERSION = 1

    async def async_step_user(self, user_input: dict[str, Any] | None = None) -> ConfigFlowResult:
        errors: dict[str, str] = {}
        if user_input is not None:
            name = user_input[CONF_NAME].strip()
            if any(e.title.casefold() == name.casefold() for e in self._async_current_entries()):
                errors[CONF_NAME] = "name_exists"
            else:
                return self.async_create_entry(title=name, data=_clean(user_input))

        # Suggest the built-in shopping list when it exists.
        defaults: dict[str, Any] = dict(user_input or {})
        if CONF_SHOPPING_LIST not in defaults and self.hass.states.get("todo.shopping_list"):
            defaults[CONF_SHOPPING_LIST] = "todo.shopping_list"
        schema = vol.Schema(
            {
                vol.Required(CONF_NAME, default=defaults.get(CONF_NAME, DEFAULT_NAME)): str,
                **_options_schema(defaults),
            }
        )
        return self.async_show_form(step_id="user", data_schema=schema, errors=errors)

    @staticmethod
    @callback
    def async_get_options_flow(config_entry: ConfigEntry) -> OptionsFlow:
        return StockPulseOptionsFlow()


class StockPulseOptionsFlow(OptionsFlow):
    async def async_step_init(self, user_input: dict[str, Any] | None = None) -> ConfigFlowResult:
        if user_input is not None:
            return self.async_create_entry(data=_clean(user_input))
        current = {**self.config_entry.data, **self.config_entry.options}
        return self.async_show_form(step_id="init", data_schema=vol.Schema(_options_schema(current)))
