# Validation · Build 031 Page Geometry Regression Fix

## Required visual regression

Compare `Licht` directly with a Destination page such as `Bergen`.

PASS requires:

- Light uses the same physical A5 content area as the Destination page.
- No second all-around inner frame is visible.
- Three curated light cards use the available row width.
- The fourth card uses the following row without crowding Companion or Footer.
- Companion and Footer remain inside their protected zones.
- No clipping or overflow occurs.
- The page remains white and follows the active World Expression.

## Static gate

`Travel Companion · Licht Consistency Gate: PASS`
