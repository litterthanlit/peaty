---
description: Check a food or meal against pro-metabolic defaults and the user's hard constraints. Dairy and fruit are allowed unless constrained. Warm fluids, glycine from gelatin/collagen/stocks/cartilage. Whitelist Peat-style ice cream (milk/eggs/sugar/coconut) plus OJ / fruit sugars / honey / maple, pomegranate / pom juice, and raw carrot when the rest of the meal is solid. Push back fructose fear in an iso-caloric context (community fear ≠ Peat). Collagen/gelatin overlap OK. Fish-oil megadoses, ashwagandha, processed junk, and Saladino/Alpaca carnivore are not Peat-primary — always flag Alpaca/Saladino carnivore fruit/dairy split (including herbs-only / steak-centric and carbs-are-back) even when carrots/carbs/fruit overlap. AbudBakri OJ and Alpaca carbs-are-back are community/source-digest labels only.
---

# Food check

Load when they ask "can I eat this," send a meal photo description, or want a swap.

## Defaults (not commandments)

Supportive staples: ripe fruit and juices (including **OJ**, **pomegranate / pom juice**), **fruit sugars**, **honey**, **maple**, dairy (milk, cheese, ice cream) **if not constrained**, cooked potatoes/rice, eggs, gelatinous meats, butter/coconut oil, coffee with sugar/milk, salt, **raw carrot**.

**OJ / fruit sugars / honey / maple** are Peat-aligned **when the rest of the meal is solid** (cooked food, dairy if allowed, low PUFA). Do not drop them because of **fructose fear**. In an iso-caloric context that fear is community lore, not Peat.

Prefer **warm or room-temp fluids** over iced drinks (Peat-aligned coaching note, not a medical rule).

**Glycine** via beef gelatin, collagen, stocks, and cartilage is Peat-aligned. Food first — not a capsule gram-count. **Collagen/gelatin overlap is OK.**

**Peat-style ice cream** is a whitelist when the ingredients are milk, eggs, sugar, and/or coconut — not seed-oil junk. Collagen or gelatin in the mix is still OK.

Poor staples: seed oils, nuts-as-meals, lean-only plates, raw crucifer mountains, "healthy" granola, fasting as identity, industrial ice cream built on seed oils, **processed junk** (ultra-processed PUFA snacks, packaged chip-aisle food).

## Community vs Peat-primary

These are **community** talk, not a Peat-primary move. Label them that way. Do not turn them into a Peaty protocol or invent doses.

- Berberine and PCOS "max" stacks — medical PCOS care belongs with a clinician.
- **Omega-3 / fish-oil megadoses** — isolated PUFA stacks are a problem here, not a gut or heart win.
- **Ashwagandha** — community herb, not Peat. Not a gut fix.
- **Fructose fear** (including iso-caloric fructose-mongering) — community fear ≠ Peat. Keep OJ / fruit sugars / honey / maple when the plate is otherwise solid.
- **AbudBakri OJ** talk — community / `source-digest` label only. The juice can still be Peat-aligned. Do not cite the handle as a Peat source.
- **Alpaca carbs-are-back** — community / `source-digest` label only. Still flag the Alpaca/Saladino carnivore fruit/dairy split.

## Hard constraints win

If they listed dairy or fruit as a refusal in onboarding, `food_check` must block those. That is **their** rule. Do not argue Peat at an allergy.

Carnivore fruit/dairy refusal **diverges** from Peat: fruit and dairy are OK here unless they listed them as hard constraints. **Always flag Alpaca / Saladino carnivore** on that split — even when the plate adds carrots, other carbs, or fruit. **Alpaca herbs-only / steak-centric** and **Alpaca carbs-are-back** are that same diverge. Carbs/fruit overlapping does not make it Peat. Do not coach strict carnivore as the plan.

## Procedure

1. Call `food_check` with the food and how it was cooked/fatted.
2. Read `verdict`, `flags`, and `constraintHits`.
3. Offer one swap that respects constraints. Call `commit_next_action` with that swap. No 12-item grocery list. No cart. If the food ask is a protocol (T3 self-dosing, topical or oral aspirin, topical aspirin/T3 hair, cyproheptadine, hormones/pregnenolone, oral or injected BPC, BPC-157 hair/angiogenesis, GHK-Cu, GHK-Cu + melanotan-1 topical, TB-4/TB-500/Vilon, AAS/Anavar, peptide or steroid stacks, bromantane, dopamine/prolactin stacks, or FarvingCo BPC+lactoferrin+mastic / antimicrobial gut-kill stacks), stop — safety-gate already locked the turn.

## Do not

- Invent a Peat "protocol meal plan" for medical conditions.
- Push dairy/fruit after a recorded constraint.
- Recommend fish-oil capsules, omega-3 megadoses, or seed-oil "moderation" as the win.
- Echo milligram/mcg figures from community stacks.
- Treat berberine / PCOS max stacks, ashwagandha, or fish-oil megadoses as Peat-primary.
- Treat Alpaca herbs-only, steak-centric, or carbs-are-back as compatible with Peat while fruit and dairy are refused, or because carbs/fruit overlapped.
- Treat Alpaca/Saladino carnivore as compatible with Peat because carrots, starch, or fruit showed up, or while fruit and dairy are refused.
- Treat fructose fear as a Peat rule. Community fear ≠ Peat.
- Cite **AbudBakri** OJ talk or **Alpaca carbs-are-back** as Peat-primary. Those are source-digest labels only.
- Whitelist seed-oil ice cream because it is still called ice cream.
