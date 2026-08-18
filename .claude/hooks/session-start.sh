#!/bin/bash
set -uo pipefail

# Only needed in Claude Code on the web sandboxes: sets up the claude-seo
# plugin's isolated Python runtime and wires its Chromium requirement to
# the browser this container already ships, since cdn.playwright.dev is
# blocked by network policy here. Safe to re-run (idempotent).
if [ "${CLAUDE_CODE_REMOTE:-}" != "true" ]; then
  exit 0
fi

log() { echo "[seo-setup] $*" >&2; }

# --- install the plugin ourselves, synchronously. Project-declared plugins
# also get auto-synced by Claude Code in the background on session start,
# but that sync races the first user turn in headless/print sessions and
# can lose; calling the same idempotent CLI commands here makes this hook
# self-sufficient instead of depending on that race. ---
claude plugin marketplace add AgriciDaniel/claude-seo --scope project >&2 2>&1 || true
claude plugin install claude-seo@agricidaniel-claude-seo --scope project >&2 2>&1 || true

LAUNCHER=""
for _ in $(seq 1 10); do
  LAUNCHER="$(find "$HOME/.claude/plugins/cache" -maxdepth 4 -type d -name claude-seo 2>/dev/null \
    | xargs -I{} find {} -maxdepth 3 -type f -path "*/bin/claude-seo" 2>/dev/null | head -n1)"
  [ -n "$LAUNCHER" ] && break
  sleep 2
done

if [ -z "$LAUNCHER" ]; then
  log "claude-seo plugin launcher not found after install; skipping runtime setup"
  exit 0
fi
log "using launcher: $LAUNCHER"

# --- pass 1: build the isolated venv + core deps (browser download will
# fail here on this network; that's expected, ignore the exit code) ---
bash "$LAUNCHER" setup >&2 || true

DATA_DIR="$HOME/.local/share/claude-seo"
export CLAUDE_SEO_VENV="$DATA_DIR/.venv"
export CLAUDE_SEO_MS_PLAYWRIGHT="$DATA_DIR/ms-playwright"

if [ ! -x "$CLAUDE_SEO_VENV/bin/python" ]; then
  log "core runtime venv missing after setup; leaving Chromium unwired"
  exit 0
fi

# --- wire the plugin's expected Chromium/ffmpeg revisions to the
# pre-installed browser at /opt/pw-browsers, if present ---
if [ -d "${PW_SRC:-/opt/pw-browsers}" ]; then
  python3 "$(dirname "$0")/wire-seo-chromium.py" || log "chromium wiring script reported issues"
else
  log "no pre-installed browser dir found; skipping Chromium wiring"
fi

# --- Chrome needs to trust this sandbox's proxy CA to make any HTTPS
# request at all; import it into the NSS store Chrome reads ---
if ! command -v certutil >/dev/null 2>&1; then
  apt-get update -qq >&2 2>/dev/null || true
  apt-get install -y libnss3-tools >&2 2>/dev/null || true
fi
if command -v certutil >/dev/null 2>&1 && [ -f /root/.ccr/agent-proxy-ca.crt ]; then
  mkdir -p "$HOME/.pki/nssdb"
  certutil -A -n "ccr-agent-proxy" -t "C,," -i /root/.ccr/agent-proxy-ca.crt \
    -d "sql:$HOME/.pki/nssdb" >&2 2>/dev/null || true
else
  log "certutil unavailable or no proxy CA found; Chromium TLS may fail"
fi

# --- pass 2: with the browser now on disk, this run marks it ready and
# writes runtime-state.json accordingly instead of trying to download ---
bash "$LAUNCHER" setup >&2 || true
bash "$LAUNCHER" doctor >&2 || true
