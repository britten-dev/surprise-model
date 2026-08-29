#!/usr/bin/env bash
# Deploy the viewer to Netlify.
#
# The Netlify MCP deploy zips the working directory and builds it in Netlify's build
# system. node_modules and renders/ are large, are not needed there — Netlify installs
# its own dependencies, and the verification renders are not part of the site — and
# together they push the upload past what the deploy endpoint will take. So they are
# moved aside for the duration and put back afterwards, whether the deploy works or not.
set -euo pipefail
cd "$(dirname "$0")/.."
SITE_ID="1fd3a503-5ce3-4ef3-b141-57283936fc4a"
PROXY="${NETLIFY_PROXY_PATH:-}"
if [ -z "$PROXY" ]; then
  echo "Set NETLIFY_PROXY_PATH first. Get a fresh one from the Netlify MCP deploy tool;" >&2
  echo "the tokens are short-lived and a stale one fails with 401." >&2
  exit 1
fi
STASH="$(mktemp -d)"
restore() { for d in node_modules renders; do [ -d "$STASH/$d" ] && mv "$STASH/$d" .; done; rmdir "$STASH" 2>/dev/null || true; }
trap restore EXIT
for d in node_modules renders; do [ -d "$d" ] && mv "$d" "$STASH/"; done
npx -y @netlify/mcp@latest --site-id "$SITE_ID" --proxy-path "$PROXY"
