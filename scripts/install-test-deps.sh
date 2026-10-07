#!/usr/bin/env bash
# Installs what the integration tests need.
#
# pytest-homeassistant-custom-component pins Home Assistant but not its frontend package
# (`hass_frontend`). Stock Pulse depends on `frontend` because it serves the card, so the tests
# need it too. Install exactly the version that this Home Assistant release asks for.
set -euo pipefail

python -m pip install -r requirements_test.txt

frontend=$(python - <<'PY'
import importlib.util, json, pathlib
root = pathlib.Path(importlib.util.find_spec("homeassistant").submodule_search_locations[0])
manifest = json.loads((root / "components" / "frontend" / "manifest.json").read_text())
print(next(r for r in manifest["requirements"] if r.startswith("home-assistant-frontend")))
PY
)
echo "Installing $frontend"
python -m pip install "$frontend"
