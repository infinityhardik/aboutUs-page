#!/usr/bin/env bash
# Verify the consolidation against the LIVE site, after deploying to Render.
#
# Checks two things:
#   1. every retired URL in render.yaml returns 301 to its intended destination
#   2. every surviving URL in sitemap.xml returns 200, not a further redirect
#
# Usage, from the repo root:
#     bash seo/verify-redirects.sh
#     BASE=https://staging.example.com bash seo/verify-redirects.sh   # test elsewhere
#
# Needs only bash and curl. Exits 0 if everything passes, 1 otherwise.
set -uo pipefail
BASE="${BASE:-https://mahadev-traders.com}"
cd "$(dirname "$0")/.." || exit 1
pass=0; fail=0; failed=()

hr() { printf '%s\n' "------------------------------------------------------------------"; }

echo "Verifying against $BASE"
hr
echo "1. Retired URLs -> 301"
hr

# Pull "source -> destination" pairs out of render.yaml without needing a YAML parser.
awk '
  /^[[:space:]]*-[[:space:]]*type:[[:space:]]*redirect/ { src=""; dst=""; next }
  /^[[:space:]]*source:/      { sub(/^[[:space:]]*source:[[:space:]]*/,"");      src=$0 }
  /^[[:space:]]*destination:/ { sub(/^[[:space:]]*destination:[[:space:]]*/,""); dst=$0; if (src!="") print src" "dst }
' render.yaml | while read -r src dst; do
    read -r code loc < <(curl -sI -o /dev/null \
        -w '%{http_code} %{redirect_url}\n' --max-time 20 "$BASE$src")
    if [ "$code" = "301" ] && [[ "$loc" == *"$dst" ]]; then
        printf 'OK    301  %-58s -> %s\n' "$src" "$dst"
    else
        printf 'FAIL  %-4s %-58s -> %s\n' "$code" "$src" "${loc:-<none>}"
        printf '           expected 301 -> %s\n' "$dst"
        case "$code" in
          200) echo "           the .html file is still being served; confirm it was deleted in the deployed commit" ;;
          404) echo "           no rule matched; confirm this source is in render.yaml on the deployed commit" ;;
        esac
        echo "$src" >> /tmp/mt_verify_fail.$$
    fi
done

hr
echo "2. Surviving URLs -> 200"
hr
# sitemap URLs are absolute; swap the canonical host for $BASE so this also works
# against a staging deploy or a local server.
grep -o '<loc>[^<]*</loc>' sitemap.xml | sed 's/<[^>]*>//g' \
  | sed "s#^https://mahadev-traders.com#$BASE#" | while read -r u; do
    code=$(curl -sI -o /dev/null -w '%{http_code}' --max-time 20 "$u")
    if [ "$code" = "200" ]; then
        printf 'OK    200  %s\n' "$u"
    else
        printf 'FAIL  %-4s %s\n' "$code" "$u"
        [ "$code" = "301" ] && echo "           a survivor should not itself redirect - this would be a chain"
        echo "$u" >> /tmp/mt_verify_fail.$$
    fi
done

hr
if [ -s /tmp/mt_verify_fail.$$ ]; then
    n=$(wc -l < /tmp/mt_verify_fail.$$)
    echo "RESULT: $n check(s) FAILED"
    rm -f /tmp/mt_verify_fail.$$
    exit 1
fi
rm -f /tmp/mt_verify_fail.$$
echo "RESULT: all checks passed"
