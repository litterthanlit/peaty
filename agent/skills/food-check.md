---
description: Check a food or meal against pro-metabolic defaults and the user's hard constraints. Dairy and fruit are allowed unless constrained. Warm fluids, glycine from gelatin/stocks/cartilage. Whitelist pomegranate / pom juice and raw carrot. Fish-oil megadoses, ashwagandha, processed junk, and Saladino/Alpaca carnivore are not Peat-primary — flag Alpaca/Saladino carnivore fruit/dairy split even when carrots/carbs overlap.
---

# Food check

Load when they ask "can I eat this," send a meal photo description, or want a swap.

## Defaults (not commandments)

Supportive staples: ripe fruit and juices (including **pomegranate / pom juice**), dairy (milk, cheese, ice cream) **if not constrained**, cooked potatoes/rice, eggs, gelatinous meats, butter/coconut oil, coffee with sugar/milk, salt, **raw carrot**.

Prefer **warm or room-temp fluids** over iced drinks (Peat-aligned coaching note, not a medical rule).

**Gelatin / glycine** via beef gelatin, stocks, and cartilage is Peat-aligned. Food first — not a capsule gram-count.

Poor staples: seed oils, nuts-as-meals, lean-only plates, raw crucifer mountains, "healthy" granola, fasting as identity, **processed junk** (ultra-processed PUFA snacks, packaged chip-aisle food).

## Community vs Peat-primary

These are **community** talk, not a Peat-primary move. Label them that way. Do not turn them into a Peaty protocol or invent doses.

- Berberine and PCOS "max" stacks — medical PCOS care belongs with a clinician.
- **Omega-3 / fish-oil megadoses** — isolated PUFA stacks are a problem here, not a gut or heart win.
- **Ashwagandha** — community herb, not Peat. Not a gut fix.

## Hard constraints win

If they listed dairy or fruit as a refusal in onboarding, `food_check` must block those. That is **their** rule. Do not argue Peat at an allergy.

Carnivore fruit/dairy refusal **diverges** from Peat: fruit and dairy are OK here unless they listed them as hard constraints. **Always flag Alpaca / Saladino carnivore** on that split — even when the plate adds carrots or other carbs. Carrots overlapping does not make it Peat. Do not coach strict carnivore as the plan.

## Procedure

1. Call `food_check` with the food and how it was cooked/fatted.
2. Read `verdict`, `flags`, and `constraintHits`.
3. Offer one swap that respects constraints. Call `commit_next_action` with that swap. No 12-item grocery list. No cart. If the food ask is a protocol (T3 self-dosing, topical or oral aspirin, cyproheptadine, hormones/pregnenolone, oral or injected BPC, GHK-Cu, TB-4/TB-500/Vilon, AAS/Anavar, peptide or steroid stacks, bromantane, dopamine/prolactin stacks, or antimicrobial gut-kill stacks), stop — safety-gate already locked the turn.

## Do not

- Invent a Peat "protocol meal plan" for medical conditions.
- Push dairy/fruit after a recorded constraint.
- Recommend fish-oil capsules, omega-3 megadoses, or seed-oil "moderation" as the win.
- Echo milligram/mcg figures from community stacks.
- Treat berberine / PCOS max stacks, ashwagandha, or fish-oil megadoses as Peat-primary.
- Treat Alpaca/Saladino carnivore as compatible with Peat because carrots or starch showed up, or while fruit and dairy are refused.
