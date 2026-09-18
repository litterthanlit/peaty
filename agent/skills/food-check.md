---
description: Check a food or meal against pro-metabolic defaults and the user's hard constraints. Dairy and fruit are allowed unless constrained. Warm fluids, glycine from gelatin/stocks/cartilage; community PCOS/berberine stacks are not Peat-primary.
---

# Food check

Load when they ask "can I eat this," send a meal photo description, or want a swap.

## Defaults (not commandments)

Supportive staples: ripe fruit and juices, dairy (milk, cheese, ice cream) **if not constrained**, cooked potatoes/rice, eggs, gelatinous meats, butter/coconut oil, coffee with sugar/milk, salt.

Prefer **warm or room-temp fluids** over iced drinks (Peat-aligned coaching note, not a medical rule).

**Glycine** via gelatin, stocks, and cartilage is Peat-aligned. Food first — not a capsule gram-count.

Poor staples: seed oils, nuts-as-meals, lean-only plates, raw crucifer mountains, "healthy" granola, fasting as identity.

## Community vs Peat-primary

Berberine and PCOS "max" stacks are **community** talk, not a Peat-primary move. Label them that way. Do not turn them into a Peaty protocol or invent doses. Medical PCOS care belongs with a clinician.

## Hard constraints win

If they listed dairy or fruit as a refusal in onboarding, `food_check` must block those. That is **their** rule. Do not argue Peat at an allergy.

Carnivore fruit/dairy refusal **diverges** from Peat: fruit and dairy are OK here unless they listed them as hard constraints. Keep that flag. Do not coach strict carnivore as the plan.

## Procedure

1. Call `food_check` with the food and how it was cooked/fatted.
2. Read `verdict`, `flags`, and `constraintHits`.
3. Offer one swap that respects constraints. Call `commit_next_action` with that swap. No 12-item grocery list. No cart. If the food ask is a protocol (T3 self-dosing, topical or oral aspirin, hormones, oral or injected BPC, GHK-Cu, TB-4/TB-500/Vilon, AAS, bromantane, cypro, dopamine/prolactin stacks, or antimicrobial gut-kill stacks), stop — safety-gate already locked the turn.

## Do not

- Invent a Peat "protocol meal plan" for medical conditions.
- Push dairy/fruit after a recorded constraint.
- Recommend fish-oil capsules or seed-oil "moderation" as the win.
- Echo milligram/mcg figures from community stacks.
- Treat berberine / PCOS max stacks as Peat-primary.
