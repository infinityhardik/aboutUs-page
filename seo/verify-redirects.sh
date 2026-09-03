#!/usr/bin/env bash
# Verify the consolidation against the LIVE site, after deploying to Render.
#
# Checks three things:
#   1. every retired URL in render.yaml returns 301 to its intended destination
#   2. every surviving URL in sitemap.xml returns 200, not a further redirect
#   3. every page ever deleted from git is covered by a redirect rule
#
# Usage, from the repo root:
#     bash seo/verify-redirects.sh
#     BASE=https://staging.example.com bash seo/verify-redirects.sh   # test elsewhere
#     CB=1 bash seo/verify-redirects.sh    # append a cache-buster to bypass the CDN edge
#
# Needs bash and curl. Section 3 additionally uses git, and is skipped without it.
# Exits 0 if everything passes, 1 otherwise.
set -uo pipefail
BASE="${BASE:-https://mahadev-traders.com}"
CB="${CB:-0}"
cd "$(dirname "$0")/.." || exit 1

failfile=$(mktemp "${TMPDIR:-/tmp}/mt_verify.XXXXXX") || exit 1
trap 'rm -f "$failfile"' EXIT

hr() { printf '%s\n' "------------------------------------------------------------------"; }

# probe URL -> sets $code, $loc, $lm, $cf
probe() {
    local url="$1" hdrs
    [ "$CB" = "1" ] && url="${url}$([[ "$url" == *\?* ]] && echo '&' || echo '?')cb=$RANDOM$RANDOM"
    hdrs=$(curl -sI --max-time 20 -H 'Cache-Control: no-cache' \
           -w '\nX-CODE:%{http_code}\nX-REDIR:%{redirect_url}\n' "$url" 2>/dev/null | tr -d '\r')
    code=$(printf '%s\n' "$hdrs" | sed -n 's/^X-CODE://p'  | tail -1)
    loc=$( printf '%s\n' "$hdrs" | sed -n 's/^X-REDIR://p' | tail -1)
    lm=$(  printf '%s\n' "$hdrs" | sed -n 's/^[Ll]ast-[Mm]odified: *//p' | tail -1)
    cf=$(  printf '%s\n' "$hdrs" | sed -n 's/^[Cc][Ff]-[Cc]ache-[Ss]tatus: *//p' | tail -1)
}

echo "Verifying against $BASE"
hr
echo "1. Retired URLs -> 301"
hr

# Pull "source -> destination" pairs out of render.yaml without needing a YAML parser.
# Only lines inside a "- type: redirect" item are considered, so a rewrite rule or a
# stray source: key elsewhere in the file cannot be mistaken for a redirect.
awk '
  /^[[:space:]]*-[[:space:]]*type:[[:space:]]*redirect/ { inrule=1; src=""; dst=""; next }
  /^[[:space:]]*-[[:space:]]*type:/                     { inrule=0 }
  inrule && /^[[:space:]]*source:/      { sub(/^[[:space:]]*source:[[:space:]]*/,"");      src=$0 }
  inrule && /^[[:space:]]*destination:/ { sub(/^[[:space:]]*destination:[[:space:]]*/,""); dst=$0
                                          if (src!="") { print src" "dst; src=""; dst="" } }
' render.yaml | while read -r src dst; do
    probe "$BASE$src"
    if [ "$code" = "301" ] && [[ "$loc" == *"$dst" ]]; then
        printf 'OK    301  %-58s -> %s\n' "$src" "$dst"
        continue
    fi
    printf 'FAIL  %-4s %-58s -> %s\n' "$code" "$src" "${loc:-<none>}"
    printf '           expected 301 -> %s\n' "$dst"
    case "$code" in
      200)
        # Distinguish the two very different causes of a 200 on a retired URL.
        if [ -e "${src#/}" ]; then
            echo "           the .html file is still in this working tree - delete it, since"
            echo "           Render serves an existing file in preference to a redirect rule"
        else
            echo "           NOT in the repo, yet the host still serves it"
            [ -n "$lm" ] && echo "           last-modified: $lm  (a copy left over from an earlier deploy)"
            [ -n "$cf" ] && echo "           cf-cache-status: $cf"
            echo "           the origin is serving a stale file that shadows this rule."
            echo "           Fix at the host, not in the repo: clear the build cache and"
            echo "           redeploy so the published tree matches the deployed commit."
        fi
        ;;
      404)
        echo "           no rule matched and no file exists; if the stale copy was just purged"
        echo "           this means the blueprint is not applied - confirm the Render service"
        echo "           is Blueprint-managed (render.yaml is ignored by a dashboard-made service)"
        ;;
      301) echo "           redirects, but not to the intended destination - check for a conflicting"
           echo "           rule configured in the Render dashboard, which the blueprint does not remove" ;;
      000) echo "           no response - network or DNS failure reaching $BASE" ;;
    esac
    echo "$src" >> "$failfile"
done

hr
echo "2. Surviving URLs -> 200"
hr
# sitemap URLs are absolute; swap the canonical host for $BASE so this also works
# against a staging deploy or a local server.
grep -o '<loc>[^<]*</loc>' sitemap.xml | sed 's/<[^>]*>//g' \
  | sed "s#^https://mahadev-traders.com#$BASE#" | while read -r u; do
    probe "$u"
    if [ "$code" = "200" ]; then
        printf 'OK    200  %s\n' "$u"
    else
        printf 'FAIL  %-4s %s\n' "$code" "$u"
        [ "$code" = "301" ] && echo "           a survivor should not itself redirect - this would be a chain"
        [ "$code" = "404" ] && echo "           a URL in the sitemap does not exist - remove it or restore the page"
        echo "$u" >> "$failfile"
    fi
done

hr
echo "3. Rule coverage for every deleted page"
hr
# A page deleted from git with no redirect rule keeps whatever the host still serves and
# silently loses its accumulated signals. This is a repo-only check; it needs no network.
if command -v git >/dev/null 2>&1 && git rev-parse --git-dir >/dev/null 2>&1; then
    ruled=$(mktemp "${TMPDIR:-/tmp}/mt_ruled.XXXXXX")
    deleted=$(mktemp "${TMPDIR:-/tmp}/mt_deleted.XXXXXX")
    awk '
      /^[[:space:]]*-[[:space:]]*type:[[:space:]]*redirect/ { inrule=1; next }
      /^[[:space:]]*-[[:space:]]*type:/                     { inrule=0 }
      inrule && /^[[:space:]]*source:/ { sub(/^[[:space:]]*source:[[:space:]]*\//,""); print }
    ' render.yaml | sort -u > "$ruled"
    comm -23 \
      <(git log --all --diff-filter=AD --name-only --format='' -- '*.html' \
          | sed '/^$/d' | sort -u) \
      <(git ls-files '*.html' | sort -u) \
      | sort -u > "$deleted"
    uncovered=$(comm -23 "$deleted" "$ruled")
    if [ -n "$uncovered" ]; then
        printf '%s\n' "$uncovered" | while read -r p; do
            printf 'FAIL       /%s\n' "$p"
            echo "           deleted from git but no redirect rule in render.yaml"
            echo "/$p" >> "$failfile"
        done
    else
        printf 'OK         all %s deleted page(s) have a redirect rule\n' "$(wc -l < "$deleted" | tr -d ' ')"
    fi
    rm -f "$ruled" "$deleted"
else
    echo "SKIP       not a git checkout, or git unavailable"
fi

hr
if [ -s "$failfile" ]; then
    echo "RESULT: $(wc -l < "$failfile" | tr -d ' ') check(s) FAILED"
    exit 1
fi
echo "RESULT: all checks passed"
