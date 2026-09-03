# mahadev-traders.com — duplicate consolidation report

Work done 2026-09-03 on branch `claude/mahadev-traders-duplicates-rfbcoc`, against the
Google Search Console export of the same date reporting 24 pages not indexed.

## Summary

| | Before | After |
|---|---:|---:|
| Pages | 56 | 37 |
| Pages in `/services/` | 22 | 1 |
| Pages in `/products/` | 33 | 34 |
| Page pairs above 60% similarity | 2 | **0** |
| Internal links into a redirect | 13 (all 404ing) | **0** |
| Broken internal links | 0 | **0** |
| Orphan pages | 0 | **0** |
| Pages emitting fake review markup | 1 | **0** |
| Tag-unbalanced pages | 20 | **0** |

## What the diagnosis got wrong

The brief attributed the 24 unindexed pages to duplicate `/products/` and `/services/`
content, and to orphaned sitemap-only URLs. Measurement supported neither.

**Duplication.** Unigram cosine similarity puts every pair on this site at 76–87%,
because 56 pages about plywood in Rajkot share one vocabulary. That metric would have
confirmed the diagnosis and been wrong. Stripping the 22 sitewide boilerplate segments
and weighting by TF-IDF, then cross-checking against 5-gram shingle overlap, only two
pairs of 1,540 exceeded 60%, and only one was genuine duplicate text:

| TF-IDF | 5-gram | Pair |
|---:|---:|---|
| 93.4% | 82.9% | `/products.html` ↔ `/products/index.html` |
| 62.5% | 18.1% | `motherwood-mdf-super-hd-wr` ↔ `motherwood-mdf-turbo-plus` |

The suspected `/products/X` ↔ `/services/X-service` pairs measured 21–39% TF-IDF with
0.0–0.6% 5-gram overlap — near-zero shared phrasing. Commit `c569e74` had already
rewritten 12 of the 13 crawled-not-indexed pages to differentiate them; one still
carried the sentence *"this service page is not a copy of the product page."* The
differentiation worked and the pages still did not index.

**Orphans.** All 10 never-crawled URLs had 1–8 internal inbound links, all 56 pages were
in the sitemap, and nothing was deeper than 2 clicks from the homepage. Sitewide orphan
count was 0. All 56 canonicals were already absolute and self-referencing, and titles,
descriptions and H1s were already unique.

**What was actually wrong.** Keyword cannibalisation, not duplication: ~19 pairs targeted
the same query for the same business in the same city, and "Crawled – currently not
indexed" is a value judgement rather than a duplication signal. The decisive evidence
was Google's own canonical choice on `shuttering-plywood-construction-service.html`,
which it folded into its `/products/` twin at 39.0% TF-IDF / 0.6% shingle overlap —
clustering by intent, and preferring `/products/`. That validated the consolidation
direction while invalidating the stated reason for it.

## Similarity re-run — proof the duplicates are gone

**0 pairs of the 666 now exceed 60% TF-IDF.** Highest remaining pairs:

| TF-IDF | 5-gram | Pair |
|---:|---:|---|
| 51.6% | 15.1% | `/products/motherwood-mdf-super-hd-wr.html` ↔ `/products/motherwood-mdf-turbo-plus.html` |
| 44.6% | 0.4% | `/products/decorative-laminates-sheets.html` ↔ `/products/sunmica-dealers-rajkot.html` |
| 42.1% | 3.5% | `/products/mdf-wholesale-rajkot.html` ↔ `/products/motherwood-mdf-super-hd-wr.html` |
| 41.5% | 14.8% | `/products/motherwood-mdf-exterior-grade.html` ↔ `/products/motherwood-mdf-super-hd-wr.html` |
| 40.5% | 16.9% | `/products/motherwood-mdf-exterior-grade.html` ↔ `/products/motherwood-mdf-turbo-plus.html` |
| 36.3% | 2.5% | `/products/index.html` ↔ `/products/mdf-wholesale-rajkot.html` |
| 35.4% | 4.1% | `/products/mdf-wholesale-rajkot.html` ↔ `/products/motherwood-mdf-turbo-plus.html` |
| 34.3% | 0.4% | `/products/liner-laminates-inner.html` ↔ `/products/sunmica-dealers-rajkot.html` |
| 33.1% | 4.1% | `/products/mdf-wholesale-rajkot.html` ↔ `/products/motherwood-mdf-exterior-grade.html` |
| 31.4% | 0.6% | `/products/marine-plywood-710-rajkot.html` ↔ `/products/plywood-wholesaler-rajkot.html` |
| 31.1% | 0.7% | `/products/pine-wood-block-board.html` ↔ `/products/pine-wood-flush-doors.html` |
| 30.7% | 1.0% | `/index.html` ↔ `/products/index.html` |

The Motherwood Turbo+/Super-HD pair — the only non-catalogue pair that previously
breached the threshold at 62.5% — is now 51.6%, achieved by lifting the shared brand
prose up to the new brand hub and leaving grade-specific copy on each child.

## Redirect map

36 routes in `render.yaml`, all `type: redirect` (301), all one hop.

### Service mirrors retired into their product survivor (18)

| From | To |
|---|---|
| `/services/block-board-dealer-rajkot.html` | `/products/block-board-wholesale-supplier.html` |
| `/services/bwp-waterproof-block-board-service.html` | `/products/bwp-waterproof-block-board.html` |
| `/services/commercial-plywood-mr-grade-service.html` | `/products/commercial-plywood-mr-grade.html` |
| `/services/decorative-laminates-sheets-service.html` | `/products/decorative-laminates-sheets.html` |
| `/services/flexible-plywood-supplier-service.html` | `/products/flexible-plywood-supplier.html` |
| `/services/flush-doors-manufacturer-supplier-service.html` | `/products/flush-doors-manufacturer-supplier.html` |
| `/services/laminated-flush-doors-designs-service.html` | `/products/laminated-flush-doors-designs.html` |
| `/services/liner-laminates-inner-service.html` | `/products/liner-laminates-inner.html` |
| `/services/marine-plywood-710-grade-rajkot.html` | `/products/marine-plywood-710-rajkot.html` |
| `/services/mdf-wholesale-supplier-rajkot.html` | `/products/mdf-wholesale-rajkot.html` |
| `/services/pine-wood-block-board-service.html` | `/products/pine-wood-block-board.html` |
| `/services/pine-wood-flush-doors-service.html` | `/products/pine-wood-flush-doors.html` |
| `/services/plywood-wholesaler-rajkot-service.html` | `/products/plywood-wholesaler-rajkot.html` |
| `/services/poplar-block-board-service.html` | `/products/poplar-block-board.html` |
| `/services/shuttering-plywood-construction-service.html` | `/products/shuttering-plywood-construction.html` |
| `/services/sunmica-dealers-rajkot-service.html` | `/products/sunmica-dealers-rajkot.html` |
| `/services/waterproof-bathroom-doors-service.html` | `/products/waterproof-bathroom-doors.html` |
| `/services/waterproof-flush-doors-bwp-service.html` | `/products/waterproof-flush-doors-bwp.html` |

### Physical products moved out of /services/ (3)

| From | To |
|---|---|
| `/services/gurjan-plywood-dealer.html` | `/products/gurjan-plywood-dealer.html` |
| `/services/hdhmr-board-supplier-rajkot.html` | `/products/hdhmr-board-supplier-rajkot.html` |
| `/services/mdf-interior-exterior-grade-rajkot.html` | `/products/mdf-interior-exterior-grade-rajkot.html` |

### Motherwood brand consolidation (1)

| From | To |
|---|---|
| `/services/motherwood-mdf-dealer-gujarat.html` | `/products/motherwood-mdf-rajkot.html` |

### The one genuine duplicate (1)

| From | To |
|---|---|
| `/products.html` | `/products/` |

### Legacy URLs recovered from the dead `_redirects` file (13)

`_redirects` used Netlify/Cloudflare syntax. **Render does not read that file**, so all 13
of these URLs have been returning 404 rather than redirecting, discarding whatever
signals they held. Their rules are ported here pointing straight at the final survivor,
not at the `-service.html` page they originally targeted, so none of them chains.

| From | To |
|---|---|
| `/services/bwp-waterproof-block-board.html` | `/products/bwp-waterproof-block-board.html` |
| `/services/commercial-plywood-mr-grade.html` | `/products/commercial-plywood-mr-grade.html` |
| `/services/decorative-laminates-sheets.html` | `/products/decorative-laminates-sheets.html` |
| `/services/flexible-plywood-supplier.html` | `/products/flexible-plywood-supplier.html` |
| `/services/flush-doors-manufacturer-supplier.html` | `/products/flush-doors-manufacturer-supplier.html` |
| `/services/laminated-flush-doors-designs.html` | `/products/laminated-flush-doors-designs.html` |
| `/services/liner-laminates-inner.html` | `/products/liner-laminates-inner.html` |
| `/services/plywood-wholesaler-rajkot.html` | `/products/plywood-wholesaler-rajkot.html` |
| `/services/poplar-block-board.html` | `/products/poplar-block-board.html` |
| `/services/shuttering-plywood-construction.html` | `/products/shuttering-plywood-construction.html` |
| `/services/sunmica-dealers-rajkot.html` | `/products/sunmica-dealers-rajkot.html` |
| `/services/waterproof-bathroom-doors.html` | `/products/waterproof-bathroom-doors.html` |
| `/services/waterproof-flush-doors-bwp.html` | `/products/waterproof-flush-doors-bwp.html` |

## Verification

Run in this environment against the working tree:

| Check | Result |
|---|---|
| Internal links resolving | 1350 |
| Internal links into a redirect | **0** |
| Broken internal links | **0** |
| Redirect chains (a destination that is also a source) | **0** |
| Route sources still present on disk (would make the rule a no-op) | **0** |
| Orphan pages (zero inbound internal links) | **0** |
| Minimum inbound links on any page | 3 |
| Maximum click depth from the homepage | 2 |
| Pages unreachable from the homepage | **0** |
| JSON-LD blocks failing to parse | **0** |
| Pages with unbalanced HTML tags | **0** |
| Pages emitting `aggregateRating` / `review` | **0** |
| Published pages containing a `TODO(seo)` marker | **0** |

JSON-LD types across the 37 pages:

| Type | Count |
|---|---:|
| `Product` | 50 |
| `BreadcrumbList` | 37 |
| `FAQPage` | 29 |
| `CollectionPage` | 2 |
| `WebSite` | 1 |
| `Organization` | 1 |
| `LocalBusiness` | 1 |

`BreadcrumbList` is exactly one per page. `LocalBusiness`, `Organization` and `WebSite`
are on the homepage only, which also carries the contact section. Regenerate with
`python3 seo/build-schema.py`; `--check` exits non-zero if any page is stale.

## Not verified: live HTTP status

**The `curl -I` checks in the Render procedure were not run.** This environment's network
policy denies outbound access to `mahadev-traders.com` — the agent proxy answers 403 to
CONNECT — so I could not reach the live site at any point, before or after the change. I
am not reporting this step as done on the strength of the config file.

After the deploy completes, run this from an unrestricted machine. It checks every
retired URL returns 301 to the right place, and that each survivor answers 200 rather
than another redirect:

```bash
# every retired URL -> 301 with the right Location
python3 - <<'EOF' > /tmp/urls.txt
import yaml
for r in yaml.safe_load(open('render.yaml'))['services'][0]['routes']:
    print(r['source'], r['destination'])
EOF

while read -r src dst; do
  out=$(curl -sI -o /dev/null -w '%{http_code} %{redirect_url}' "https://mahadev-traders.com$src")
  code=${out%% *}; loc=${out#* }
  case "$code:$loc" in
    301:*"$dst") echo "OK    301 $src -> $dst" ;;
    *) echo "FAIL  $code $src -> $loc (expected 301 -> $dst)" ;;
  esac
done < /tmp/urls.txt

# every survivor -> 200, not a further redirect
python3 -c "import re;print('\n'.join(re.findall(r'<loc>([^<]+)',open('sitemap.xml').read())))" \
| while read -r u; do
    code=$(curl -sI -o /dev/null -w '%{http_code}' "$u")
    [ "$code" = 200 ] && echo "OK    200 $u" || echo "FAIL  $code $u"
  done
```

Paste the output here and I will fold it into this section. If any retired URL returns
200 instead of 301, its `.html` file is still being served — check it was actually
deleted in the deployed commit. If any returns 404, its route is missing from
`render.yaml`.

One thing to check in the Render dashboard before deploying: Render preserves
dashboard-added redirect rules that are not in the blueprint, and this repo never had a
`render.yaml`, so any rule currently configured there is invisible to this repo and could
conflict with the routes added here. I could not inspect the dashboard.

## Content depth

The five thinnest survivors roughly tripled by absorbing the trade material from their
retired mirror:

| Page | Before | After |
|---|---:|---:|
| `products/pine-wood-block-board.html` | 317 | 897 |
| `products/bwp-waterproof-block-board.html` | 326 | 820 |
| `products/waterproof-bathroom-doors.html` | 412 | 904 |
| `products/pine-wood-flush-doors.html` | 423 | 907 |
| `products/flexible-plywood-supplier.html` | 477 | 961 |
| `products/poplar-block-board.html` | 673 | 1232 |

Pages still under 900 words, in `seo/drafts/` with publishable draft prose ready:

| Page | Words |
|---|---:|
| `products/marllex-block-board-premium.html` | 253 |
| `products/zevik-plywood-supplier.html` | 323 |
| `products/simson-plywood-supplier.html` | 324 |
| `products/marllex-premium-plywood.html` | 332 |
| `products/limelite-plywood-supplier.html` | 339 |
| `products/greytone-plywood-dealers.html` | 355 |
| `products/marllex-flush-doors-premium.html` | 355 |
| `services/index.html` | 549 |
| `products/motherwood-mdf-turbo-plus.html` | 597 |
| `products/motherwood-mdf-super-hd-wr.html` | 614 |
| `productChart.html` | 631 |
| `products/motherwood-mdf-exterior-grade.html` | 636 |
| `products/bwp-waterproof-block-board.html` | 820 |
| `products/pine-wood-block-board.html` | 897 |

## Open questions — every `TODO(seo)`, grouped by page

136 questions across 37 pages. Nothing in this list was guessed at on the
live site; each is a fact I could not verify. Answer any subset and I will publish the
corresponding draft.

Two gaps are systemic rather than per-page, and worth answering once:

- **Price band is absent from 31 of 37 pages**, and `productChart.html` — titled "Price
  Chart" — deliberately carries no prices at all. A buyer searching for plywood prices in
  Rajkot lands on a specification table. Indicative bands would serve that intent.
- **MOQ is absent from 34 of 37 pages.** Two pages say only "for orders above a minimum
  quantity" without naming it.

### `index.html`

- Founding year: the schema said 1995 while ~20 pages say 'since 1996'. I set foundingDate to 1996 to match the visible text. Confirm which is correct.
- Confirm the geo coordinates 22.3039, 70.7839 point at the Gondal Road premises - they were already published but I could not verify them from this environment.
- Confirm opening hours. The published schema carries Mon-Sat 09:00-19:30 plus a second block; the page text also shows '9am - 11:45pm' somewhere, which looks wrong.
- Price band for this product in 2026 (a range per sheet or per door is enough, e.g. "Rs X-Y per 8x4 sheet at 19mm"). Every product page currently has no price information at all and productChart.html deliberately carries none.
- Minimum order quantity for a wholesale rate on this item - sheets, doors, or rupee value.

### `productChart.html`

- This page is a specification chart with no prices, but it is titled 'Price Chart'. Either add indicative price bands or retitle it - the mismatch is a bounce risk for anyone searching for prices.
- Price band for this product in 2026 (a range per sheet or per door is enough, e.g. "Rs X-Y per 8x4 sheet at 19mm"). Every product page currently has no price information at all and productChart.html deliberately carries none.
- Minimum order quantity for a wholesale rate on this item - sheets, doors, or rupee value.

### `products/block-board-wholesale-supplier.html`

- Price band for this product in 2026 (a range per sheet or per door is enough, e.g. "Rs X-Y per 8x4 sheet at 19mm"). Every product page currently has no price information at all and productChart.html deliberately carries none.
- Minimum order quantity for a wholesale rate on this item - sheets, doors, or rupee value.
- Delivery coverage and cost for this item: which cities are included, what counts as a full load, and whether freight is charged separately.

### `products/bwp-waterproof-block-board.html`

- Price band for this product in 2026 (a range per sheet or per door is enough, e.g. "Rs X-Y per 8x4 sheet at 19mm"). Every product page currently has no price information at all and productChart.html deliberately carries none.
- Minimum order quantity for a wholesale rate on this item - sheets, doors, or rupee value.
- Delivery coverage and cost for this item: which cities are included, what counts as a full load, and whether freight is charged separately.

### `products/commercial-plywood-mr-grade.html`

- Minimum order quantity for a wholesale rate on this item - sheets, doors, or rupee value.
- Delivery coverage and cost for this item: which cities are included, what counts as a full load, and whether freight is charged separately.

### `products/decorative-laminates-sheets.html`

- Standard laminate sheet size(s) stocked - the page gives thicknesses from 0.8mm to 1.5mm but no sheet dimensions.
- Which laminate brands are stocked, and are digital catalogues available to link?
- Minimum order quantity for a wholesale rate on this item - sheets, doors, or rupee value.
- Delivery coverage and cost for this item: which cities are included, what counts as a full load, and whether freight is charged separately.

### `products/flexible-plywood-supplier.html`

- Standard sheet size for flexible plywood, and the minimum bend radius per thickness. The page claims a 5cm-10cm bend radius 'depending on thickness' without saying which thickness gives which.
- Price band for this product in 2026 (a range per sheet or per door is enough, e.g. "Rs X-Y per 8x4 sheet at 19mm"). Every product page currently has no price information at all and productChart.html deliberately carries none.
- Minimum order quantity for a wholesale rate on this item - sheets, doors, or rupee value.
- Delivery coverage and cost for this item: which cities are included, what counts as a full load, and whether freight is charged separately.

### `products/flush-doors-manufacturer-supplier.html`

- Delivery coverage and cost for this item: which cities are included, what counts as a full load, and whether freight is charged separately.

### `products/greytone-plywood-dealers.html`

- Which bonding grades is Greytone stocked in - MR, BWR, BWP? The page names no grade, the only product page in the plywood range with that gap.
- Any IS certification for the Greytone line.
- Price band for this product in 2026 (a range per sheet or per door is enough, e.g. "Rs X-Y per 8x4 sheet at 19mm"). Every product page currently has no price information at all and productChart.html deliberately carries none.
- Minimum order quantity for a wholesale rate on this item - sheets, doors, or rupee value.
- Delivery coverage and cost for this item: which cities are included, what counts as a full load, and whether freight is charged separately.

### `products/gurjan-block-board-dealer.html`

- Is the Gurjan a full Gurjan face, a Gurjan core, or both? Buyers ask this specifically and the page does not answer it.
- IS certification for the Gurjan block board line.
- Price band for this product in 2026 (a range per sheet or per door is enough, e.g. "Rs X-Y per 8x4 sheet at 19mm"). Every product page currently has no price information at all and productChart.html deliberately carries none.
- Minimum order quantity for a wholesale rate on this item - sheets, doors, or rupee value.
- Delivery coverage and cost for this item: which cities are included, what counts as a full load, and whether freight is charged separately.

### `products/gurjan-plywood-dealer.html`

- Same question for Gurjan plywood: full Gurjan face and core, or Gurjan face on another core?
- Price band for this product in 2026 (a range per sheet or per door is enough, e.g. "Rs X-Y per 8x4 sheet at 19mm"). Every product page currently has no price information at all and productChart.html deliberately carries none.
- Minimum order quantity for a wholesale rate on this item - sheets, doors, or rupee value.
- Delivery coverage and cost for this item: which cities are included, what counts as a full load, and whether freight is charged separately.

### `products/hdhmr-board-supplier-rajkot.html`

- Confirm the >850 kg/m3 density claim already on this page, and whether HDHMR stock carries IS 12406 or another standard.
- Price band for this product in 2026 (a range per sheet or per door is enough, e.g. "Rs X-Y per 8x4 sheet at 19mm"). Every product page currently has no price information at all and productChart.html deliberately carries none.
- Minimum order quantity for a wholesale rate on this item - sheets, doors, or rupee value.
- Delivery coverage and cost for this item: which cities are included, what counts as a full load, and whether freight is charged separately.

### `products/index.html`

- Minimum order quantity for a wholesale rate on this item - sheets, doors, or rupee value.
- Delivery coverage and cost for this item: which cities are included, what counts as a full load, and whether freight is charged separately.

### `products/laminated-flush-doors-designs.html`

- Price band for this product in 2026 (a range per sheet or per door is enough, e.g. "Rs X-Y per 8x4 sheet at 19mm"). Every product page currently has no price information at all and productChart.html deliberately carries none.
- Minimum order quantity for a wholesale rate on this item - sheets, doors, or rupee value.
- Delivery coverage and cost for this item: which cities are included, what counts as a full load, and whether freight is charged separately.

### `products/limelite-plywood-supplier.html`

- Limelite thickness range and sheet sizes stocked in Rajkot. The page currently lists none.
- Which IS specification does the Limelite BWP line carry - IS 710, or BWR to IS 303?
- Price band for this product in 2026 (a range per sheet or per door is enough, e.g. "Rs X-Y per 8x4 sheet at 19mm"). Every product page currently has no price information at all and productChart.html deliberately carries none.
- Minimum order quantity for a wholesale rate on this item - sheets, doors, or rupee value.
- Delivery coverage and cost for this item: which cities are included, what counts as a full load, and whether freight is charged separately.

### `products/liner-laminates-inner.html`

- Core/backing material for the liner sheets, and whether an IS specification applies.
- Price band for this product in 2026 (a range per sheet or per door is enough, e.g. "Rs X-Y per 8x4 sheet at 19mm"). Every product page currently has no price information at all and productChart.html deliberately carries none.
- Minimum order quantity for a wholesale rate on this item - sheets, doors, or rupee value.
- Delivery coverage and cost for this item: which cities are included, what counts as a full load, and whether freight is charged separately.

### `products/marine-plywood-710-rajkot.html`

- Price band for this product in 2026 (a range per sheet or per door is enough, e.g. "Rs X-Y per 8x4 sheet at 19mm"). Every product page currently has no price information at all and productChart.html deliberately carries none.
- Delivery coverage and cost for this item: which cities are included, what counts as a full load, and whether freight is charged separately.

### `products/marllex-block-board-premium.html`

- Core species for Marllex block board - poplar, pine, hardwood or Gurjan face?
- Does the BWP block board carry IS 1659 certification?
- Price band for this product in 2026 (a range per sheet or per door is enough, e.g. "Rs X-Y per 8x4 sheet at 19mm"). Every product page currently has no price information at all and productChart.html deliberately carries none.
- Minimum order quantity for a wholesale rate on this item - sheets, doors, or rupee value.
- Delivery coverage and cost for this item: which cities are included, what counts as a full load, and whether freight is charged separately.

### `products/marllex-flush-doors-premium.html`

- Standard door sizes stocked (heights and widths), not just thicknesses.
- Is the core solid or hollow, and which timber?
- Price band for this product in 2026 (a range per sheet or per door is enough, e.g. "Rs X-Y per 8x4 sheet at 19mm"). Every product page currently has no price information at all and productChart.html deliberately carries none.
- Minimum order quantity for a wholesale rate on this item - sheets, doors, or rupee value.
- Delivery coverage and cost for this item: which cities are included, what counts as a full load, and whether freight is charged separately.

### `products/marllex-premium-plywood.html`

- Confirm the Marllex IS 710 licence number, if the brand publishes one.
- Price band for this product in 2026 (a range per sheet or per door is enough, e.g. "Rs X-Y per 8x4 sheet at 19mm"). Every product page currently has no price information at all and productChart.html deliberately carries none.
- Minimum order quantity for a wholesale rate on this item - sheets, doors, or rupee value.
- Delivery coverage and cost for this item: which cities are included, what counts as a full load, and whether freight is charged separately.

### `products/mdf-interior-exterior-grade-rajkot.html`

- Standard sheet sizes and the thickness range for each of the interior and exterior grades.
- Price band for this product in 2026 (a range per sheet or per door is enough, e.g. "Rs X-Y per 8x4 sheet at 19mm"). Every product page currently has no price information at all and productChart.html deliberately carries none.
- Minimum order quantity for a wholesale rate on this item - sheets, doors, or rupee value.
- Delivery coverage and cost for this item: which cities are included, what counts as a full load, and whether freight is charged separately.

### `products/mdf-wholesale-rajkot.html`

- Price band for this product in 2026 (a range per sheet or per door is enough, e.g. "Rs X-Y per 8x4 sheet at 19mm"). Every product page currently has no price information at all and productChart.html deliberately carries none.
- Minimum order quantity for a wholesale rate on this item - sheets, doors, or rupee value.
- Delivery coverage and cost for this item: which cities are included, what counts as a full load, and whether freight is charged separately.

### `products/motherwood-mdf-exterior-grade.html`

- Does Motherwood Exterior Grade carry IS 12406 certification like the rest of the range, and is there a separate exterior-grade standard it meets?
- Price band for this product in 2026 (a range per sheet or per door is enough, e.g. "Rs X-Y per 8x4 sheet at 19mm"). Every product page currently has no price information at all and productChart.html deliberately carries none.
- Minimum order quantity for a wholesale rate on this item - sheets, doors, or rupee value.
- Delivery coverage and cost for this item: which cities are included, what counts as a full load, and whether freight is charged separately.

### `products/motherwood-mdf-rajkot.html`

- Price band for this product in 2026 (a range per sheet or per door is enough, e.g. "Rs X-Y per 8x4 sheet at 19mm"). Every product page currently has no price information at all and productChart.html deliberately carries none.
- Minimum order quantity for a wholesale rate on this item - sheets, doors, or rupee value.
- Delivery coverage and cost for this item: which cities are included, what counts as a full load, and whether freight is charged separately.

### `products/motherwood-mdf-super-hd-wr.html`

- Confirm the Super HD+WR density figure. The HDHMR page states >850 kg/m3; is that the right number for this grade?
- Price band for this product in 2026 (a range per sheet or per door is enough, e.g. "Rs X-Y per 8x4 sheet at 19mm"). Every product page currently has no price information at all and productChart.html deliberately carries none.
- Minimum order quantity for a wholesale rate on this item - sheets, doors, or rupee value.
- Delivery coverage and cost for this item: which cities are included, what counts as a full load, and whether freight is charged separately.

### `products/motherwood-mdf-turbo-plus.html`

- Confirm the TurBo+ density figure. The Motherwood brand page states >1050 kg/m3 for TurBo+; safe to publish on this page too?
- Price band for this product in 2026 (a range per sheet or per door is enough, e.g. "Rs X-Y per 8x4 sheet at 19mm"). Every product page currently has no price information at all and productChart.html deliberately carries none.
- Minimum order quantity for a wholesale rate on this item - sheets, doors, or rupee value.
- Delivery coverage and cost for this item: which cities are included, what counts as a full load, and whether freight is charged separately.

### `products/pine-wood-block-board.html`

- Price band for this product in 2026 (a range per sheet or per door is enough, e.g. "Rs X-Y per 8x4 sheet at 19mm"). Every product page currently has no price information at all and productChart.html deliberately carries none.
- Minimum order quantity for a wholesale rate on this item - sheets, doors, or rupee value.
- Delivery coverage and cost for this item: which cities are included, what counts as a full load, and whether freight is charged separately.

### `products/pine-wood-flush-doors.html`

- Standard door sizes stocked, and whether the pine core is solid or a batten frame.
- Confirm whether these doors are made to IS 2202 like the other flush door lines.
- Price band for this product in 2026 (a range per sheet or per door is enough, e.g. "Rs X-Y per 8x4 sheet at 19mm"). Every product page currently has no price information at all and productChart.html deliberately carries none.
- Minimum order quantity for a wholesale rate on this item - sheets, doors, or rupee value.
- Delivery coverage and cost for this item: which cities are included, what counts as a full load, and whether freight is charged separately.

### `products/plywood-wholesaler-rajkot.html`

- Delivery coverage and cost for this item: which cities are included, what counts as a full load, and whether freight is charged separately.

### `products/poplar-block-board.html`

- Price band for this product in 2026 (a range per sheet or per door is enough, e.g. "Rs X-Y per 8x4 sheet at 19mm"). Every product page currently has no price information at all and productChart.html deliberately carries none.
- Minimum order quantity for a wholesale rate on this item - sheets, doors, or rupee value.
- Delivery coverage and cost for this item: which cities are included, what counts as a full load, and whether freight is charged separately.

### `products/shuttering-plywood-construction.html`

- Which bonding grade and IS specification the shuttering plywood carries (IS 4990 is the usual formwork standard) - the page names no grade.
- Typical repeat-cycle count the stocked film-faced boards achieve, if the manufacturer states one.
- Price band for this product in 2026 (a range per sheet or per door is enough, e.g. "Rs X-Y per 8x4 sheet at 19mm"). Every product page currently has no price information at all and productChart.html deliberately carries none.
- Minimum order quantity for a wholesale rate on this item - sheets, doors, or rupee value.
- Delivery coverage and cost for this item: which cities are included, what counts as a full load, and whether freight is charged separately.

### `products/simson-plywood-supplier.html`

- Standard sheet sizes for Simson plywood (the page lists thicknesses but no sheet dimensions).
- Price band for this product in 2026 (a range per sheet or per door is enough, e.g. "Rs X-Y per 8x4 sheet at 19mm"). Every product page currently has no price information at all and productChart.html deliberately carries none.
- Minimum order quantity for a wholesale rate on this item - sheets, doors, or rupee value.
- Delivery coverage and cost for this item: which cities are included, what counts as a full load, and whether freight is charged separately.

### `products/sunmica-dealers-rajkot.html`

- Which grades or IS specification apply to the laminate range (the page names none).
- Minimum order quantity for a wholesale rate on this item - sheets, doors, or rupee value.
- Delivery coverage and cost for this item: which cities are included, what counts as a full load, and whether freight is charged separately.

### `products/waterproof-bathroom-doors.html`

- The page mentions a 10mm thickness alongside 30-35mm - is the 10mm a PVC or WPC door rather than a BWP flush door? If both types are stocked they should be distinguished on the page.
- Price band for this product in 2026 (a range per sheet or per door is enough, e.g. "Rs X-Y per 8x4 sheet at 19mm"). Every product page currently has no price information at all and productChart.html deliberately carries none.
- Minimum order quantity for a wholesale rate on this item - sheets, doors, or rupee value.
- Delivery coverage and cost for this item: which cities are included, what counts as a full load, and whether freight is charged separately.

### `products/waterproof-flush-doors-bwp.html`

- Price band for this product in 2026 (a range per sheet or per door is enough, e.g. "Rs X-Y per 8x4 sheet at 19mm"). Every product page currently has no price information at all and productChart.html deliberately carries none.
- Minimum order quantity for a wholesale rate on this item - sheets, doors, or rupee value.
- Delivery coverage and cost for this item: which cities are included, what counts as a full load, and whether freight is charged separately.

### `products/zevik-plywood-supplier.html`

- Zevik thickness range and sheet sizes stocked in Rajkot. The page names MR, BWP and IS 710 grades but lists no thicknesses at all, which is the main reason it stays thin.
- Is Zevik's IS 710 line third-party certified, and can the IS licence number be quoted?
- Price band for this product in 2026 (a range per sheet or per door is enough, e.g. "Rs X-Y per 8x4 sheet at 19mm"). Every product page currently has no price information at all and productChart.html deliberately carries none.
- Minimum order quantity for a wholesale rate on this item - sheets, doors, or rupee value.
- Delivery coverage and cost for this item: which cities are included, what counts as a full load, and whether freight is charged separately.

### `services/index.html`

- Delivery radius and the cities where you deliver without a freight charge.
- Whether 'Monday to Saturday' and the 09:00-19:30 hours in the schema are correct for the supply desk.
- Any documentation you can actually issue for tenders (moisture-content certificates, IS grade declarations, dealership letters) - I described these generically and want to be accurate.
- Price band for this product in 2026 (a range per sheet or per door is enough, e.g. "Rs X-Y per 8x4 sheet at 19mm"). Every product page currently has no price information at all and productChart.html deliberately carries none.
- Minimum order quantity for a wholesale rate on this item - sheets, doors, or rupee value.

## What I must do myself

None of the following can be done from the repository. In rough priority order:

1. **Deploy and verify the redirects.** Run the `curl` block above and confirm 36 × 301
   and 37 × 200. Until this passes, treat the consolidation as unproven — and check the
   Render dashboard for pre-existing redirect rules first.
2. **Resubmit the sitemap in Search Console.** `https://mahadev-traders.com/sitemap.xml`,
   now 37 URLs instead of 56. Removing 19 dead entries is itself a crawl-budget win.
3. **URL Inspection → Request Indexing** on each surviving page, prioritising the ones
   that absorbed a mirror: the plywood, block board, laminate, flush door and MDF range
   pages, then the individual boards. Google caps requests per day, so spread it out.
4. **Re-run the paused validations** for all three issue types: "Crawled – currently not
   indexed" (13 URLs), "Discovered – currently not indexed" (10), and "Duplicate, Google
   chose different canonical than user" (1). The last should clear immediately, since
   the URL Google rejected no longer exists and 301s to the canonical it already chose.
5. **Answer the `TODO(seo)` questions above**, starting with price band and MOQ. This is
   the highest-value item for the pages that remain thin — the merge fixed length, but
   only real trade specifics fix value.
6. **Create or optimise the Google Business Profile** for the Gondal Road location. Use
   the NAP in `seo/schema/business.json` verbatim so it matches the `LocalBusiness`
   markup: name, `+91 6355 360702`, `Nr. S.T. Workshop, Gondal Road, Rajkot 360004`,
   `mahadevtraders@hotmail.com`. This is also where real reviews belong — see the note
   below.
7. **Keep NAP consistent across IndiaMART, JustDial and Sulekha** (all three are already
   linked from the site footer) plus the Google Business Profile. Any variation in the
   name, phone or address across those listings weakens the local signal that the
   `LocalBusiness` markup is trying to establish.

### One thing you should know about

The homepage was publishing `"ratingValue": "4.8"` with `"reviewCount": "120"`, plus
review bodies attributed to a *"Satisfied Customer"* reading *"Excellent quality
material, highly recommended."* There is no review data behind any of it. Fabricated
review markup is a manual-action risk, so it has been removed, and `seo/build-schema.py`
now strips those properties on every run so they cannot return through a hand edit. If
you want star ratings in search results, collect real reviews on the Google Business
Profile.

### Two things to confirm

- **Founding year.** The schema said `1995`; roughly 20 pages say "since 1996". I set
  `foundingDate` to 1996 to match the visible text. Tell me which is right.
- **Motherwood "Boilo" grade.** The brand page lists a fourth variant, Boilo, that has
  no page. If you stock it, it should have one under the Motherwood hub.

