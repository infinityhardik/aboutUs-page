#!/usr/bin/env bash
# Push the redirect rules in render.yaml to a Render service via the REST API.
#
# Use this when the service is NOT Blueprint-managed, so Render never reads
# render.yaml. The rules still live in render.yaml as the single source of
# truth; this script just copies them into the service's Redirects/Rewrites.
#
# Setup, once:
#   export RENDER_API_KEY=rnd_xxxxxxxxxxxxxxxx      # Account Settings -> API Keys
#   export RENDER_SERVICE_ID=srv-xxxxxxxxxxxxxxxx   # in the service's dashboard URL
#
# Then, from the repo root:
#   DRY_RUN=1 bash seo/apply-render-routes.sh   # print what would be sent
#   bash seo/apply-render-routes.sh             # actually create the routes
#   bash seo/apply-render-routes.sh --list      # show routes already on the service
#
# Existing routes with the same source are skipped, so re-running is safe.
# Needs bash, curl and python3 (for JSON encoding only).
set -uo pipefail
cd "$(dirname "$0")/.." || exit 1
API="https://api.render.com/v1"
DRY_RUN="${DRY_RUN:-0}"

: "${RENDER_API_KEY:?set RENDER_API_KEY (Render Account Settings -> API Keys)}"
: "${RENDER_SERVICE_ID:?set RENDER_SERVICE_ID (the srv-... id in the dashboard URL)}"

auth=(-H "Authorization: Bearer $RENDER_API_KEY" -H "Accept: application/json")

list_routes() {
    curl -sS "${auth[@]}" "$API/services/$RENDER_SERVICE_ID/routes?limit=100"
}

if [ "${1:-}" = "--list" ]; then
    echo "Routes currently on $RENDER_SERVICE_ID:"
    list_routes | python3 -c '
import json,sys
d=json.load(sys.stdin)
rows=[r.get("route",r) for r in d] if isinstance(d,list) else []
if not rows: print("  (none)")
for r in sorted(rows,key=lambda x:x.get("priority",0)):
    print(f"  {r.get(\"priority\",\"?\"):>3}  {r.get(\"type\"):8} {r.get(\"source\")}  ->  {r.get(\"destination\")}")'
    exit 0
fi

# Sources already configured, so a re-run does not duplicate them.
existing=$(list_routes | python3 -c '
import json,sys
try: d=json.load(sys.stdin)
except Exception: d=[]
rows=[r.get("route",r) for r in d] if isinstance(d,list) else []
print("\n".join(r.get("source","") for r in rows))' 2>/dev/null)

# Same parser as seo/verify-redirects.sh: only lines inside a "- type: redirect" item.
rules=$(awk '
  /^[[:space:]]*-[[:space:]]*type:[[:space:]]*redirect/ { inrule=1; src=""; dst=""; next }
  /^[[:space:]]*-[[:space:]]*type:/                     { inrule=0 }
  inrule && /^[[:space:]]*source:/      { sub(/^[[:space:]]*source:[[:space:]]*/,"");      src=$0 }
  inrule && /^[[:space:]]*destination:/ { sub(/^[[:space:]]*destination:[[:space:]]*/,""); dst=$0
                                          if (src!="") { print src" "dst; src=""; dst="" } }
' render.yaml)

total=$(printf '%s\n' "$rules" | grep -c .)
echo "render.yaml defines $total redirect rule(s)"
[ "$DRY_RUN" = "1" ] && echo "DRY RUN - nothing will be sent"
echo "------------------------------------------------------------------"

created=0; skipped=0; failed=0; prio=0
while read -r src dst; do
    [ -z "$src" ] && continue
    if printf '%s\n' "$existing" | grep -qxF "$src"; then
        printf 'SKIP    %-58s (already configured)\n' "$src"; skipped=$((skipped+1)); prio=$((prio+1)); continue
    fi
    body=$(python3 -c '
import json,sys
print(json.dumps({"type":"redirect","source":sys.argv[1],"destination":sys.argv[2],"priority":int(sys.argv[3])}))' "$src" "$dst" "$prio")
    if [ "$DRY_RUN" = "1" ]; then
        printf 'WOULD   %-58s -> %s\n' "$src" "$dst"; created=$((created+1)); prio=$((prio+1)); continue
    fi
    code=$(curl -sS -o /tmp/rr.$$ -w '%{http_code}' -X POST "${auth[@]}" \
             -H 'Content-Type: application/json' -d "$body" \
             "$API/services/$RENDER_SERVICE_ID/routes")
    if [ "$code" = "201" ] || [ "$code" = "200" ]; then
        printf 'OK      %-58s -> %s\n' "$src" "$dst"; created=$((created+1))
    else
        printf 'FAIL %s %-58s -> %s\n' "$code" "$src" "$dst"
        sed 's/^/           /' /tmp/rr.$$; echo; failed=$((failed+1))
    fi
    rm -f /tmp/rr.$$
    prio=$((prio+1))
done <<< "$rules"

echo "------------------------------------------------------------------"
echo "created: $created   skipped: $skipped   failed: $failed"
[ "$failed" -gt 0 ] && exit 1
if [ "$DRY_RUN" != "1" ]; then
    echo
    echo "Now confirm from the outside:  bash seo/verify-redirects.sh"
fi
