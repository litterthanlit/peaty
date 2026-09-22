---
description: Check a food or meal against pro-metabolic defaults and the user's hard constraints. Dairy and fruit are allowed unless constrained. Warm fluids, glycine from gelatin/collagen/stocks/cartilage. Whitelist Peat-style ice cream (milk/eggs/sugar/coconut) plus daily OJ / OJ+collagen / honey / maple / A2-milk cocoa, pomegranate / pom juice, and raw carrot when the rest of the meal is solid. Sinclair fructose-fear is community conflict, not Peat. Collagen/gelatin overlap OK. Fish-oil megadoses, ashwagandha, processed junk, and Saladino/Alpaca carnivore are not Peat-primary — flag Alpaca/Saladino carnivore fruit/dairy split (including herbs-only / steak-centric) even when carrots/carbs overlap, and always when OJ/honey mixes with beef-rice kibble.
---

# Food check

Load when they ask "can I eat this," send a meal photo description, or want a swap.

## Defaults (not commandments)

Supportive staples: ripe fruit and juices (including **OJ**, **pomegranate / pom juice**), **honey**, **maple**, dairy (milk, cheese, ice cream, **A2-milk cocoa**) **if not constrained**, cooked potatoes/rice, eggs, gelatinous meats, butter/coconut oil, coffee with sugar/milk, salt, **raw carrot**.

**Daily OJ / OJ+collagen / honey / maple / A2-milk cocoa** are Peat-aligned fruit–dairy sugars **when the rest of the meal is solid** (cooked food, dairy if allowed, low PUFA). Do not drop them because of **Sinclair fructose-fear**. That fear is community lore, not Peat.

Prefer **warm or room-temp fluids** over iced drinks (Peat-aligned coaching note, not a medical rule).

**Glycine** via beef gelatin, collagen, stocks, and cartilage is Peat-aligned. Food first — not a capsule gram-count. **Collagen/gelatin overlap is OK.** OJ+collagen is still food.

**Peat-style ice cream** is a whitelist when the ingredients are milk, eggs, sugar, and/or coconut — not seed-oil junk. Collagen or gelatin in the mix is still OK.

Poor staples: seed oils, nuts-as-meals, lean-only plates, raw crucifer mountains, "healthy" granola, fasting as identity, industrial ice cream built on seed oils, **processed junk** (ultra-processed PUFA snacks, packaged chip-aisle food).

## Community vs Peat-primary

These are **community** talk, not a Peat-primary move. Label them that way. Do not turn them into a Peaty protocol or invent doses.

- Berberine and PCOS "max" stacks — medical PCOS care belongs with a clinician.
- **Omega-3 / fish-oil megadoses** — isolated PUFA stacks are a problem here, not a gut or heart win.
- **Ashwagandha** — community herb, not Peat. Not a gut fix.
- **Sinclair fructose-fear** — community conflict, not Peat. Keep daily OJ / OJ+collagen / honey / maple / A2-milk cocoa when the plate is otherwise solid.

## Hard constraints win

If they listed dairy or fruit as a refusal in onboarding, `food_check` must block those. That is **their** rule. Do not argue Peat at an allergy.

Carnivore fruit/dairy refusal **diverges** from Peat: fruit and dairy are OK here unless they listed them as hard constraints. **Always flag Alpaca / Saladino carnivore** on that split — even when the plate adds carrots or other carbs. **Alpaca herbs-only / steak-centric** is that same diverge. **Always flag Alpaca carnivore split** when **OJ/honey mixes with beef-rice "kibble"** patterns. Juice on kibble does not make it Peat. Do not coach strict carnivore as the plan.

## Procedure

1. Call `food_check` with the food and how it was cooked/fatted.
2. Read `verdict`, `flags`, and `constraintHits`.
3. Offer one swap that respects constraints. Call `commit_next_action` with that swap. No 12-item grocery list. No cart. If the food ask is a protocol (T3 self-dosing, topical or oral aspirin, topical aspirin/T3 hair, cyproheptadine, hormones/pregnenolone, oral TRT/DHT DIY, oral or injected BPC, GHK-Cu, melanotan, TB-4/TB-500/Vilon, Khavinson-wave bioregulators, phenibut, AAS/Anavar, peptide or steroid stacks, bromantane, dopamine/prolactin stacks, or antimicrobial gut-kill stacks), stop — safety-gate already locked the turn.

## Do not

- Invent a Peat "protocol meal plan" for medical conditions.
- Push dairy/fruit after a recorded constraint.
- Recommend fish-oil capsules, omega-3 megadoses, or seed-oil "moderation" as the win.
- Echo milligram/mcg figures from community stacks.
- Treat berberine / PCOS max stacks, ashwagandha, or fish-oil megadoses as Peat-primary.
- Treat Alpaca herbs-only or steak-centric as compatible with Peat while fruit and dairy are refused.
- Treat Alpaca/Saladino carnivore as compatible with Peat because carrots or starch showed up, or while fruit and dairy are refused.
- Treat OJ/honey on beef-rice kibble as a Peat plate. Flag the Alpaca split.
- Treat Sinclair fructose-fear as a Peat rule. Community conflict ≠ Peat.
- Whitelist seed-oil ice cream because it is still called ice cream.
