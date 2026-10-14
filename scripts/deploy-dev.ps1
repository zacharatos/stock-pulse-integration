#Requires -Version 7
<#
.SYNOPSIS
  Builds the card and copies the whole integration into Home Assistant, to try changes before a release.
.DESCRIPTION
  For the maintainer's own Home Assistant, before tagging a version. HACS only installs released versions, so this
  mirrors custom_components/stock_pulse (with the freshly built card in frontend/) over
  config/custom_components/stock_pulse through the Samba share add-on.

  Before copying, the folder that is there now (usually the HACS release) is saved to
  %TEMP%\stock-pulse-ha-backup\<time>, outside Home Assistant, so the way back is one copy away.

  It never restarts or reloads Home Assistant. At the end it says what you need to do:
  - Python, manifest, services or translations changed -> restart Home Assistant yourself.
  - Only the card changed -> a hard refresh (Ctrl+F5) is enough.
  After the release: HACS -> Stock Pulse -> Redownload the released version, then restart.

  Needs: the Samba share add-on running, and the share opened once in Explorer so Windows remembers the sign-in.
.PARAMETER Share
  The config share. Default: $env:PULSE_HA_SHARE (the same one Pulse Cards' deploy-dev.ps1 uses), else
  \\homeassistant\config (try \\homeassistant.local\config or \\<ip>\config if the name doesn't resolve).
.PARAMETER SkipBuild
  Copy the card as it is in custom_components/stock_pulse/frontend/, without running npm run build first.
.EXAMPLE
  pwsh scripts/deploy-dev.ps1
.EXAMPLE
  pwsh scripts/deploy-dev.ps1 -Share \\192.168.1.20\config -SkipBuild
#>
param(
  [string]$Share = $(if ($env:PULSE_HA_SHARE) { $env:PULSE_HA_SHARE } else { '\\homeassistant\config' }),
  [switch]$SkipBuild
)
$ErrorActionPreference = 'Stop'

$root = Split-Path -Parent $PSScriptRoot
$source = Join-Path $root 'custom_components/stock_pulse'
$card = Join-Path $source 'frontend/stock-pulse-card.js'

if (-not $IsWindows) { throw 'This script copies through a Windows Samba share (robocopy); run it on Windows.' }

if (-not $SkipBuild) {
  # node_modules installed by another OS (a Linux VM, WSL) has no Windows launchers and no Windows rollup binary.
  if (-not (Test-Path (Join-Path $root 'node_modules/.bin/rollup.cmd'))) {
    throw "node_modules wasn't installed on Windows (no rollup.cmd). Run 'npm ci' in $root once, then run this again."
  }
  Write-Host 'Building the card...'
  Push-Location $root
  try {
    npm run build
    if ($LASTEXITCODE -ne 0) { throw "npm run build failed (exit code $LASTEXITCODE); nothing was copied." }
  } finally {
    Pop-Location
  }
}
if (-not (Test-Path $card)) { throw "No card bundle at $card. Run npm run build first." }

if (-not (Test-Path $Share)) {
  throw @"
Can't reach $Share.
- Is the Samba share add-on installed and started in Home Assistant?
- Open $Share in Explorer once and sign in with the add-on's username and password (tick "Remember my credentials").
- If the name doesn't resolve, pass the address: -Share \\homeassistant.local\config or -Share \\<ip>\config
  (or set it once: `$env:PULSE_HA_SHARE = '\\<ip>\config').
"@
}

$target = Join-Path $Share 'custom_components/stock_pulse'
$version = (Select-String -Path (Join-Path $source 'const.py') -Pattern 'VERSION: Final = "([^"]+)"').Matches[0].Groups[1].Value
$stamp = Get-Date -Format 'yyyyMMdd-HHmmss'

# Hash every file except the card bundle and caches, to tell "needs a restart" from "refresh is enough".
function Get-Hashes([string]$dir) {
  $map = @{}
  if (-not (Test-Path $dir)) { return $map }
  Get-ChildItem -Path $dir -Recurse -File |
    Where-Object { $_.FullName -notmatch '[\\/]__pycache__[\\/]' -and $_.FullName -notmatch '[\\/]frontend[\\/]' } |
    ForEach-Object { $map[$_.FullName.Substring($dir.Length).TrimStart('\', '/')] = (Get-FileHash $_.FullName -Algorithm SHA256).Hash }
  return $map
}
$before = Get-Hashes $target
$after = Get-Hashes $source
$changed = @($after.Keys | Where-Object { $before[$_] -ne $after[$_] }) + @($before.Keys | Where-Object { -not $after.ContainsKey($_) })
$firstTime = -not (Test-Path $target)

if (-not $firstTime) {
  $backup = Join-Path ([IO.Path]::GetTempPath()) "stock-pulse-ha-backup/$stamp"
  New-Item -ItemType Directory -Force -Path $backup | Out-Null
  robocopy $target $backup /E /XD __pycache__ /NJH /NJS /NP /NFL /NDL | Out-Null
  if ($LASTEXITCODE -ge 8) { throw "Backing up $target failed (robocopy exit code $LASTEXITCODE); nothing was copied." }
}

# Mirror: files removed from the repo are removed in HA too; HA's own __pycache__ is left alone.
robocopy $source $target /MIR /XD __pycache__ /XF *.pyc /NJH /NJS /NP /NFL /NDL | Out-Null
if ($LASTEXITCODE -ge 8) { throw "Copying to $target failed (robocopy exit code $LASTEXITCODE)." }

Write-Host ''
Write-Host "Copied Stock Pulse v$version to $target" -ForegroundColor Green
if (-not $firstTime) { Write-Host "The previous copy is saved in $backup" }
Write-Host ''
if ($firstTime -or $changed.Count -gt 0) {
  Write-Host 'Restart Home Assistant (Settings -> System -> top-right menu -> Restart Home Assistant).' -ForegroundColor Yellow
  if ($firstTime) { Write-Host '  First copy: the integration wasn''t installed here before.' }
  else { Write-Host "  Changed outside the card: $($changed -join ', ')" }
} else {
  Write-Host 'Only the card changed: hard-refresh the browser (Ctrl+F5).' -ForegroundColor Cyan
  Write-Host '  Companion app: Settings -> Companion app -> Troubleshooting -> Reset frontend cache.'
}
Write-Host ''
Write-Host 'After the release: HACS -> Stock Pulse -> Redownload (the released version), then restart.'
Write-Host "Way back without a release: copy the backup folder over $target and restart."
