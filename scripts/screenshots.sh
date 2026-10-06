#!/usr/bin/env bash
# Full-page screenshots of the built site at phone (390 px) and desktop (1280 px) widths, for review.
# macOS, headless Chrome. Serve the export first in another terminal: npm run build && npm run preview
# Usage: bash scripts/screenshots.sh [outdir] [path ...]
#   BASE=http://127.0.0.1:4173 bash scripts/screenshots.sh scratch/screenshots / /projects/slide-rebuild-log/
set -euo pipefail

BASE="${BASE:-http://127.0.0.1:4173}"
OUT="${1:-scratch/screenshots}"
shift || true
PATHS=("$@")
if [ ${#PATHS[@]} -eq 0 ]; then
  PATHS=(/ /projects/slide-rebuild-log/ /one-pager/)
fi
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
PROFILE="/tmp/claude-501/chrome-profile-hub"
WORK="$(mktemp -d "${TMPDIR:-/tmp}/hub-shots.XXXXXX")"
mkdir -p "$OUT"

# shoot <url> <width> <height> <file>
shoot() {
  local url="$1" width="$2" height="$3" file="$4"
  # Chrome keeps its window at least about 500 px wide, so the page is framed at the exact width
  # inside a wider window and the frame is cropped out afterwards.
  local frame="$WORK/frame.html"
  printf '<!doctype html><meta charset="utf-8"><style>html,body{margin:0;background:#fbfbf8}iframe{display:block;border:0;width:%spx;height:%spx}</style><iframe src="%s"></iframe>\n' \
    "$width" "$height" "$url" > "$frame"
  local window=$((width < 600 ? 600 : width))
  rm -f "$file"
  "$CHROME" --headless=new --use-mock-keychain --password-store=basic --user-data-dir="$PROFILE" \
    --hide-scrollbars --force-device-scale-factor=1 --no-first-run --disable-background-networking \
    --disable-component-update --disable-sync --disable-extensions --virtual-time-budget=5000 \
    --window-size="$window,$height" --screenshot="$file" "file://$frame" > "$WORK/chrome.log" 2>&1 &
  local pid=$!
  # On this Mac, Chrome writes the screenshot and then does not always exit, so wait for the file and stop it.
  local tries=0
  until grep -q 'bytes written to file' "$WORK/chrome.log" 2>/dev/null; do
    tries=$((tries + 1))
    if [ "$tries" -gt 120 ]; then
      echo "timed out waiting for $file" >&2
      break
    fi
    sleep 0.5
  done
  kill "$pid" 2>/dev/null || true
  wait "$pid" 2>/dev/null || true
  # Keep the framed page only, cut the empty canvas below the footer, and leave a 40 px margin.
  magick "$file" -crop "${width}x${height}+0+0" +repage -define trim:edges=south -trim +repage \
    -background '#FBFBF8' -gravity south -splice 0x40 "$file"
  local h
  h="$(magick identify -format '%h' "$file")"
  if [ "$h" -ge "$height" ]; then echo "warning: $file may be cut off at $height px" >&2; fi
  echo "$file ${width}x$h"
}

for path in "${PATHS[@]}"; do
  name="$(echo "$path" | sed -e 's#^/##' -e 's#/$##' -e 's#/#-#g')"
  name="${name:-home}"
  shoot "$BASE$path" 390 15000 "$OUT/$name-390.png"
  shoot "$BASE$path" 1280 10000 "$OUT/$name-1280.png"
done
