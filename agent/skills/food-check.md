---
description: Check a food or meal against pro-metabolic defaults and the user's hard constraints. Dairy and fruit are allowed unless constrained.
---

# Food check

Load when they ask "can I eat this," send a meal photo description, or want a swap.

## Defaults (not commandments)

Supportive staples: ripe fruit and juices, dairy (milk, cheese, ice cream) **if not constrained**, cooked potatoes/rice, eggs, gelatinous meats, butter/coconut oil, coffee with sugar/milk, salt.

Poor staples: seed oils, nuts-as-meals, lean-only plates, raw crucifer mountains, "healthy" granola, fasting as identity.

## Hard constraints win

If they listed dairy or fruit as a refusal in onboarding, `food_check` must block those. That is **their** rule. Do not argue Peat at an allergy.

## Procedure

1. Call `food_check` with the food and how it was cooked/fatted.
2. Read `verdict` and `constraintHits`.
3. Offer one swap that respects constraints. Call `commit_next_action` with that swap. No 12-item grocery list. No cart. If the food ask is a protocol (T3, aspirin, hormones, BPC), stop — safety-gate already locked the turn.

## Do not

- Invent a Peat "protocol meal plan" for medical conditions.
- Push dairy/fruit after a recorded constraint.
- Recommend fish-oil capsules or seed-oil "moderation" as the win.
