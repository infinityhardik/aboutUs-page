# Draft expansion — services/index.html

- **URL:** https://mahadev-traders.com/services/index.html
- **Title:** Trade Supply Services, Rajkot | Mahadev Traders
- **Current length:** 806 words
- **Trade fields present:** grade, core material, typical applications, price policy, MOQ, delivery policy
- **Trade fields missing:** thickness options, standard sheet sizes, IS certification
- **Status:** needs depth

## Blocked on facts

Answer these and the section above can be extended. **Do not publish these TODO lines to the site.**

- `TODO(seo)`: Whether 'Monday to Saturday' and the 09:00-19:30 hours in the schema are correct for the supply desk.
- `TODO(seo)`: Any documentation you can actually issue for tenders (moisture-content certificates, IS grade declarations, dealership letters) - I described these generically and want to be accurate.

## Answered 2026-09-03, now published sitewide

- **Minimum order quantity: 1.** No minimum on any product.
- **Pricing: not published**, quoted per enquiry. In structured data this is expressed by
  omitting `price` rather than setting it to `0`, because 0 means *free* in schema.org.
- **Delivery: across Gujarat**, freight charged per order and varying by region, service
  availability and timing, with free delivery on select orders. `shippingRate` is left out
  of the markup rather than set to 0, because a conditional benefit cannot be published as
  a definite zero rate.
