# Draft expansion — index.html

- **URL:** https://mahadev-traders.com/
- **Title:** Wholesale Plywood, MDF & Flush Doors | Mahadev Traders
- **Current length:** 1388 words
- **Trade fields present:** grade, thickness options, standard sheet sizes, core material, IS certification, typical applications, price policy, MOQ, delivery policy
- **Trade fields missing:** none
- **Status:** adequate length; gaps listed below

## Blocked on facts

Answer these and the section above can be extended. **Do not publish these TODO lines to the site.**

- `TODO(seo)`: Founding year: the schema said 1995 while ~20 pages say 'since 1996'. I set foundingDate to 1996 to match the visible text. Confirm which is correct.
- `TODO(seo)`: Confirm the geo coordinates 22.3039, 70.7839 point at the Gondal Road premises - they were already published but I could not verify them from this environment.
- `TODO(seo)`: Confirm opening hours. The published schema carries Mon-Sat 09:00-19:30 plus a second block; the page text also shows '9am - 11:45pm' somewhere, which looks wrong.

## Answered 2026-09-03, now published sitewide

- **Minimum order quantity: 1.** No minimum on any product.
- **Pricing: not published**, quoted per enquiry. In structured data this is expressed by
  omitting `price` rather than setting it to `0`, because 0 means *free* in schema.org.
- **Delivery: across Gujarat**, freight charged per order and varying by region, service
  availability and timing, with free delivery on select orders. `shippingRate` is left out
  of the markup rather than set to 0, because a conditional benefit cannot be published as
  a definite zero rate.
