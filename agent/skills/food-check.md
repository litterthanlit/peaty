---
description: Check a food or meal against pro-metabolic defaults and the user's hard constraints. Dairy and fruit are allowed unless constrained. Warm fluids, glycine from gelatin/collagen/stocks/cartilage. Whitelist Peat-style ice cream (milk/eggs/sugar/coconut) plus pomegranate / pom juice and raw carrot. BioavailableNd-style fall stack (wake pom juice/tea, midday meat stock, bed warm milk+honey+glycine) is Peat-aligned when ingredients fit. Collagen/gelatin overlap OK. Fish-oil megadoses, ashwagandha, processed junk, and Saladino/Alpaca carnivore are not Peat-primary — always flag Alpaca/Saladino carnivore fruit/dairy split (including herbs-only / steak-centric and same-day dairy+fruit) even when carrots/carbs overlap.
---

# Food check

Load when they ask "can I eat this," send a meal photo description, or want a swap.

## Defaults (not commandments)

Supportive staples: ripe fruit and juices (including **pomegranate / pom juice**), dairy (milk, cheese, ice cream) **if not constrained**, cooked potatoes/rice, eggs, gelatinous meats, butter/coconut oil, coffee with sugar/milk, salt, **raw carrot**.

Prefer **warm or room-temp fluids** over iced drinks (Peat-aligned coaching note, not a medical rule).

**Glycine** via beef gelatin, collagen, stocks, and cartilage is Peat-aligned. Food first — not a capsule gram-count. **Collagen/gelatin overlap is OK.**

**Peat-style ice cream** is a whitelist when the ingredients are milk, eggs, sugar, and/or coconut — not seed-oil junk. Collagen or gelatin in the mix is still OK.

**BioavailableNd-style fall stack** is a Peat-aligned pattern **when the ingredients fit** (community origin; translate, do not cite as evidence):

- Wake: pomegranate juice / tea
- Midday: meat stock / gelatinous broth
- Bed: warm milk + honey + glycine

That is food and rhythm — not a capsule protocol.

Poor staples: seed oils, nuts-as-meals, lean-only plates, raw crucifer mountains, "healthy" granola, fasting as identity, industrial ice cream built on seed oils, **processed junk** (ultra-processed PUFA snacks, packaged chip-aisle food).

## Community vs Peat-primary

These are **community** talk, not a Peat-primary move. Label them that way. Do not turn them into a Peaty protocol or invent doses.

- Berberine and PCOS "max" stacks — medical PCOS care belongs with a clinician.
- **Omega-3 / fish-oil megadoses** — isolated PUFA stacks are a problem here, not a gut or heart win.
- **Ashwagandha** — community herb, not Peat. Not a gut fix.
- **Abud OJ-intolerance framing** — intolerance is often the person/context, not "juice is poison." Label carefully. **Not a medical diagnosis.** If they listed fruit as a hard constraint, that still wins. Do not cite the handle as evidence.
- **SolBrah salted egg-white sugar meringue** — optional community food note: low-PUFA sugar+protein snack. Not a protocol. Do not cite the handle as evidence.
- **SolBrah natural / liquid Mg** — optional community food/mineral note. Pair with mineralized fluids / Mg-in-OJ. Not a drug protocol. No doses.

## Hard constraints win

If they listed dairy or fruit as a refusal in onboarding, `food_check` must block those. That is **their** rule. Do not argue Peat at an allergy.

Carnivore fruit/dairy refusal **diverges** from Peat: fruit and dairy are OK here unless they listed them as hard constraints. **Always flag Alpaca / Saladino carnivore** on that split — even when the plate adds carrots or other carbs, and **even with same-day dairy+fruit**. **Alpaca herbs-only / steak-centric** is that same diverge. Same-day milk and orange juice do not make Alpaca carnivore Peat-primary. Do not coach strict carnivore as the plan.

## Procedure

1. Call `food_check` with the food and how it was cooked/fatted.
2. Read `verdict`, `flags`, and `constraintHits`.
3. Offer one swap that respects constraints. Call `commit_next_action` with that swap. No 12-item grocery list. No cart. If the food ask is a protocol (T3 self-dosing, topical or oral aspirin, topical aspirin/T3 hair, cyproheptadine, hormones/pregnenolone, oral TRT/DHT DIY, oral or injected BPC, GHK-Cu, melanotan, TB-4/TB-500/Vilon, GLP-1s, thymus peptides, Khavinson-wave bioregulators, phenibut, AAS/Anavar, peptide or steroid stacks, bromantane, dopamine/prolactin stacks, or antimicrobial gut-kill stacks), stop — safety-gate already locked the turn.

## Do not

- Invent a Peat "protocol meal plan" for medical conditions.
- Push dairy/fruit after a recorded constraint.
- Recommend fish-oil capsules, omega-3 megadoses, or seed-oil "moderation" as the win.
- Echo milligram/mcg figures from community stacks.
- Treat berberine / PCOS max stacks, ashwagandha, or fish-oil megadoses as Peat-primary.
- Diagnose OJ intolerance. Do not treat juice as poison.
- Treat Alpaca herbs-only or steak-centric as compatible with Peat while fruit and dairy are refused.
- Treat Alpaca/Saladino carnivore as compatible with Peat because carrots or starch showed up, because dairy+fruit showed up the same day, or while fruit and dairy are refused.
- Whitelist seed-oil ice cream because it is still called ice cream.
- Turn natural/liquid Mg into a milligram protocol.
