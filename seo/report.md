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
| Product blocks with placeholder prices | 12 | **0** |
| Pages stating minimum order quantity | 3 | **37** |
| Pages explaining how pricing works | 6 | **37** |
| Pages stating the freight/delivery policy | 0 | **37** |
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

41 routes in `render.yaml`, all `type: redirect` (301), all one hop. The last five were
added on 2026-09-03 after live verification found them missing — see *Rule coverage gap*
below.

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

`_redirects` used Netlify/Cloudflare syntax. **Render does not read that file**, so none of
these URLs has been redirecting. This was originally written up as "returning 404";
live verification on 2026-09-03 showed otherwise, and the truth is worse — every one of
them returns **200 with the full old page**, self-canonical and `index, follow`. See
*Live HTTP status* below. Their rules are ported here pointing straight at the final
survivor, not at the `-service.html` page they originally targeted, so none of them chains.

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

Run in this environment against the working tree. **These are repo-level checks only.**
Every one of them passed while the live site was serving 41 stale duplicates — a clean
working tree says nothing about what the host is actually publishing. See
*Live HTTP status* below, which is the check that matters.

| Check | Result |
|---|---|
| Internal links resolving | 1352 |
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

## Live HTTP status — verified 2026-09-03

The earlier version of this section said these checks could not be run, because the
sandbox that produced the consolidation could not reach `mahadev-traders.com`. They have
now been run against the live site.

**The consolidation is deployed but completely inert.**

| Check | Expected | Actual |
|---|---|---|
| Retired URLs returning 301 | 41 | **0** |
| Retired URLs returning 200 with the full old page | 0 | **41** |
| Surviving URLs returning 200 | 37 | 37 ✓ |

Every one of the 41 retired pages is live, serves its original pre-consolidation content,
carries a **self-referencing canonical** to its own retired URL, and is marked
`robots: index, follow`. Not one of them points at its survivor. This is precisely the
duplicate-content situation the consolidation was meant to remove, still fully intact.

### Root cause: the origin never dropped the deleted files

The deployed commit is current — `/seo/verify-redirects.sh`, added in the most recent
commit, is served, and the homepage carries the corrected "since 1995" copy. But:

- every file **present** in the deployed commit is served with `last-modified:
  Thu, 03 Sep 2026 17:27:37 UTC`, the deploy timestamp — all of them, without exception
- every **retired** file is served with an *older* timestamp: `Mon, 24 Aug 2026 11:09:02
  UTC` or `Sat, 21 Feb 2026 16:15:26 UTC`
- `/services/poplar-block-board.html` was deleted from git on **2026-05-20** and is still
  served today, from a **February** copy — three and a half months and many deploys later
- these responses carry Render's `rndr-id` header with `cf-cache-status: MISS` or
  `EXPIRED`, so they were served by the Render origin on that request — this is not a
  stale copy sitting in the Cloudflare edge cache
- a URL that never existed correctly returns 404, so the origin is not blanket-serving
  a fallback

So the origin is publishing the union of every deploy rather than the current commit's
tree. `render.yaml`'s own header comment states the consequence: Render serves an
existing file in preference to a redirect rule for the same path. While those files
remain, **all 41 rules are shadowed and can never fire**, no matter how correct they are.

### The fix, in order

1. **Clear the build cache and redeploy.** Render dashboard → the `mahadev-traders`
   static site → *Manual Deploy* → **Clear build cache & deploy**. An ordinary deploy has
   demonstrably not purged these files; this is the step that republishes the tree from
   scratch. Then re-run `bash seo/verify-redirects.sh`.
2. **If the retired URLs then return 404 instead of 301**, the files are gone but the
   blueprint is not being applied — which happens when the service was created by hand in
   the dashboard rather than from `render.yaml`. Either attach the repo as a Blueprint, or
   enter the 41 rules under the service's *Redirects/Rewrites* settings.
3. **If any retired URL 301s somewhere unexpected**, a dashboard-configured rule is
   winning. Render preserves dashboard rules that are not in the blueprint, and this repo
   had no `render.yaml` before the consolidation, so any pre-existing rule there is
   invisible to this repo.
4. Only once section 1 reports 41 × `OK 301` should the Search Console work below start.

### Rule coverage gap, fixed 2026-09-03

Verification also turned up **five deleted pages with no redirect rule at all**, all five
live and self-canonical like the other 36:

| From | To | Why it was missed |
|---|---|---|
| `/products/marlex-block-board-premium.html` | `/products/marllex-block-board-premium.html` | renamed in `49725ed`, old spelling left unruled |
| `/products/marlex-flush-doors-premium.html` | `/products/marllex-flush-doors-premium.html` | same rename |
| `/products/marlex-premium-plywood.html` | `/products/marllex-premium-plywood.html` | same rename |
| `/services/pine-wood-block-board.html` | `/products/pine-wood-block-board.html` | missed when the legacy `_redirects` URLs were ported |
| `/services/pine-wood-flush-doors.html` | `/products/pine-wood-flush-doors.html` | missed when the legacy `_redirects` URLs were ported |

These are now in `render.yaml`, taking it from 36 routes to **41**. `seo/verify-redirects.sh`
has gained a third section that derives this list from git history, so a page deleted in
future without a rule fails the run instead of going unnoticed.

## Verifying

Run the committed script from any machine with normal network access. It needs bash and
curl; the coverage section additionally uses git.

```bash
bash seo/verify-redirects.sh
```

It reads the 41 routes straight out of `render.yaml` and the 37 URLs out of `sitemap.xml`,
so it cannot drift from the config. Exit code is 0 only if everything passes. To point it
elsewhere, or to bypass the CDN edge cache:

```bash
BASE=https://staging.example.com bash seo/verify-redirects.sh
CB=1 bash seo/verify-redirects.sh
```

Each failure prints what to check. The `FAIL 200` diagnostic now distinguishes the two
causes, which need opposite fixes:

| Result | Meaning |
|---|---|
| `FAIL 200`, file present in the working tree | the page was not actually retired — delete it from the repo |
| `FAIL 200`, file absent from the working tree | the host is serving a leftover from an earlier deploy — fix at the host, clear cache and redeploy |
| `FAIL 404` on a retired URL | no file and no rule matched — the blueprint is probably not applied |
| `FAIL 301` to the wrong place | a conflicting dashboard rule is winning |
| `FAIL 301` on a survivor | a survivor is itself redirecting, which is a chain |
| Section 3 `FAIL` | a page was deleted from git without a redirect rule |

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

**36 questions across 24 pages**, down from 136. All three systemic questions are
answered; what remains is per-product specification.

### Answered 2026-09-03, and now published on all 37 pages

**Founding year is 1995.** The schema was right and the visible copy was wrong: 28
occurrences of "since 1996" across 14 files have been corrected to 1995, and
`business.json` carries `foundingDate: 1995` as the single source. The "30+ years" and
"over 30 years" claims on 51 lines remain accurate — 1995 to 2026 is 31 years.


- **Minimum order quantity is 1.** No minimum on any product — a single sheet or door is a
  normal order, so a buyer can test a grade against their own work before committing to bulk.
  This was stated on 3 pages before; it is a real differentiator for a wholesaler.
- **Prices are not published**; rates are quoted per enquiry by call or WhatsApp because they
  move with brand, thickness, grade, batch, quantity and destination. Stated on 6 pages before.
- **Delivery is across Gujarat**, freight charged per order and varying by region, service
  availability and timing, with free delivery on select orders. Stated on 0 pages before.

Two of these needed care in the markup, not just the copy:

- On "set price to 0 or undefined" I used **undefined**. `price: 0` in schema.org means the
  product is *free*, and Google would be entitled to render "₹0" in a rich result. Omitting
  the field is the correct way to express "contact for rates".
- Free delivery is **conditional** ("select orders"), so `shippingRate` stays out of the
  markup rather than being set to 0. A conditional benefit cannot honestly be published as a
  definite zero rate. `shippingDestination` (Gujarat) and `deliveryTime` are kept, because
  those are accurate — though see the confirmation list below regarding delivery times.

### Still open

#### `index.html`

- Confirm the geo coordinates 22.3039, 70.7839 point at the Gondal Road premises - they were already published but I could not verify them from this environment.
- Confirm opening hours. The published schema carries Mon-Sat 09:00-19:30 plus a second block; the page text also shows '9am - 11:45pm' somewhere, which looks wrong.

#### `productChart.html`

- This page is a specification chart with no prices, but it is titled 'Price Chart'. Either add indicative price bands or retitle it - the mismatch is a bounce risk for anyone searching for prices.

#### `products/decorative-laminates-sheets.html`

- Standard laminate sheet size(s) stocked - the page gives thicknesses from 0.8mm to 1.5mm but no sheet dimensions.
- Which laminate brands are stocked, and are digital catalogues available to link?

#### `products/flexible-plywood-supplier.html`

- Standard sheet size for flexible plywood, and the minimum bend radius per thickness. The page claims a 5cm-10cm bend radius 'depending on thickness' without saying which thickness gives which.

#### `products/greytone-plywood-dealers.html`

- Which bonding grades is Greytone stocked in - MR, BWR, BWP? The page names no grade, the only product page in the plywood range with that gap.
- Any IS certification for the Greytone line.

#### `products/gurjan-block-board-dealer.html`

- Is the Gurjan a full Gurjan face, a Gurjan core, or both? Buyers ask this specifically and the page does not answer it.
- IS certification for the Gurjan block board line.

#### `products/gurjan-plywood-dealer.html`

- Same question for Gurjan plywood: full Gurjan face and core, or Gurjan face on another core?

#### `products/hdhmr-board-supplier-rajkot.html`

- Confirm the >850 kg/m3 density claim already on this page, and whether HDHMR stock carries IS 12406 or another standard.

#### `products/limelite-plywood-supplier.html`

- Limelite thickness range and sheet sizes stocked in Rajkot. The page currently lists none.
- Which IS specification does the Limelite BWP line carry - IS 710, or BWR to IS 303?

#### `products/liner-laminates-inner.html`

- Core/backing material for the liner sheets, and whether an IS specification applies.

#### `products/marllex-block-board-premium.html`

- Core species for Marllex block board - poplar, pine, hardwood or Gurjan face?
- Does the BWP block board carry IS 1659 certification?

#### `products/marllex-flush-doors-premium.html`

- Standard door sizes stocked (heights and widths), not just thicknesses.
- Is the core solid or hollow, and which timber?

#### `products/marllex-premium-plywood.html`

- Confirm the Marllex IS 710 licence number, if the brand publishes one.

#### `products/mdf-interior-exterior-grade-rajkot.html`

- Standard sheet sizes and the thickness range for each of the interior and exterior grades.

#### `products/motherwood-mdf-exterior-grade.html`

- Does Motherwood Exterior Grade carry IS 12406 certification like the rest of the range, and is there a separate exterior-grade standard it meets?

#### `products/motherwood-mdf-super-hd-wr.html`

- Confirm the Super HD+WR density figure. The HDHMR page states >850 kg/m3; is that the right number for this grade?

#### `products/motherwood-mdf-turbo-plus.html`

- Confirm the TurBo+ density figure. The Motherwood brand page states >1050 kg/m3 for TurBo+; safe to publish on this page too?

#### `products/pine-wood-flush-doors.html`

- Standard door sizes stocked, and whether the pine core is solid or a batten frame.
- Confirm whether these doors are made to IS 2202 like the other flush door lines.

#### `products/shuttering-plywood-construction.html`

- Which bonding grade and IS specification the shuttering plywood carries (IS 4990 is the usual formwork standard) - the page names no grade.
- Typical repeat-cycle count the stocked film-faced boards achieve, if the manufacturer states one.

#### `products/simson-plywood-supplier.html`

- Standard sheet sizes for Simson plywood (the page lists thicknesses but no sheet dimensions).

#### `products/sunmica-dealers-rajkot.html`

- Which grades or IS specification apply to the laminate range (the page names none).

#### `products/waterproof-bathroom-doors.html`

- The page mentions a 10mm thickness alongside 30-35mm - is the 10mm a PVC or WPC door rather than a BWP flush door? If both types are stocked they should be distinguished on the page.

#### `products/zevik-plywood-supplier.html`

- Zevik thickness range and sheet sizes stocked in Rajkot. The page names MR, BWP and IS 710 grades but lists no thicknesses at all, which is the main reason it stays thin.
- Is Zevik's IS 710 line third-party certified, and can the IS licence number be quoted?

#### `services/index.html`

- Whether 'Monday to Saturday' and the 09:00-19:30 hours in the schema are correct for the supply desk.
- Any documentation you can actually issue for tenders (moisture-content certificates, IS grade declarations, dealership letters) - I described these generically and want to be accurate.
## What I must do myself

None of the following can be done from the repository. In rough priority order:

1. **Purge the stale files at the Render origin.** This is now the single blocking item:
   the consolidation is deployed but inert, because Render is still serving 41 deleted
   pages that shadow every redirect rule. See *Live HTTP status* below for the evidence
   and the fix. Nothing else in this list matters until this is done — re-submitting the
   sitemap or requesting indexing while 41 self-canonical duplicates are live just feeds
   Google the duplicates again.
2. **Resubmit the sitemap in Search Console.** `https://mahadev-traders.com/sitemap.xml`,
   now 37 URLs instead of 56. Removing 19 dead entries is itself a crawl-budget win.
3. **URL Inspection → Request Indexing** on each surviving page, prioritising the ones
   that absorbed a mirror: the plywood, block board, laminate, flush door and MDF range
   pages, then the individual boards. Google caps requests per day, so spread it out.
4. **Re-run the paused validations** for all three issue types: "Crawled – currently not
   indexed" (13 URLs), "Discovered – currently not indexed" (10), and "Duplicate, Google
   chose different canonical than user" (1). The last should clear immediately, since
   the URL Google rejected no longer exists and 301s to the canonical it already chose.
5. **Answer the remaining `TODO(seo)` questions above.** MOQ and pricing are done. What is
   left is mostly per-product specification (sheet sizes, IS certification, core species on
   the brand pages) plus delivery terms. The brand stub pages stay thin until someone
   supplies the thicknesses and grades they are stocked in.
6. **Create or optimise the Google Business Profile** for the Gondal Road location. Use
   the NAP in `seo/schema/business.json` verbatim so it matches the `LocalBusiness`
   markup: name, `+91 6355 360702`, `Nr. S.T. Workshop, Gondal Road, Rajkot 360004`,
   `mahadevtraders@hotmail.com`. This is also where real reviews belong — see the note
   below.
7. **Keep NAP consistent across IndiaMART, JustDial and Sulekha** (all three are already
   linked from the site footer) plus the Google Business Profile. Any variation in the
   name, phone or address across those listings weakens the local signal that the
   `LocalBusiness` markup is trying to establish.

### Two things you should know about

The homepage was publishing `"ratingValue": "4.8"` with `"reviewCount": "120"`, plus
review bodies attributed to a *"Satisfied Customer"* reading *"Excellent quality
material, highly recommended."* There is no review data behind any of it. Fabricated
review markup is a manual-action risk, so it has been removed, and `seo/build-schema.py`
now strips those properties on every run so they cannot return through a hand edit. If
you want star ratings in search results, collect real reviews on the Google Business
Profile.

The same page also carried **placeholder prices presented as real ones**: four different
products all priced at exactly `"1500"` with `priceValidUntil: 2099-12-31`, an aggregate
range of `1200`–`3500`, and elsewhere `lowPrice: "1"` with `highPrice: "999999"` and
`price: "1"`. Google can surface these as actual prices, and a buyer quoted something
different has been misled. The markup also claimed **free delivery** (`shippingRate` of
`0` INR) while the site copy says transport is arranged "at competitive freight rates".
All of it has been removed and added to the generator's banned list.

Eight of these blocks carried a `data-seo-fix` attribute and were being skipped by an
earlier version of my own generator, which matched only bare `<script type=...>` tags.
That is fixed; the generator now scans every JSON-LD block regardless of attributes, and
a full re-scan of all 129 blocks confirms none of the banned properties remain.

### Two things to confirm

- **Published delivery times.** The `shippingDetails` markup claims 0–1 day handling and 1–3
  day transit within Gujarat. That was already published and looks plausible against the
  "24–48 hour delivery" claim on the Motherwood page, but you said timing varies by region and
  service availability, so confirm the range holds or give me a better one.
- **Motherwood "Boilo" grade.** The brand page lists a fourth variant, Boilo, that has
  no page. If you stock it, it should have one under the Motherwood hub.

