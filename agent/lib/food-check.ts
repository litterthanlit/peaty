export type FoodFlag = {
  code: string;
  detail: string;
};

export type FoodCheckResult = {
  food: string;
  verdict: "supportive" | "mixed" | "poor-fit" | "blocked";
  flags: FoodFlag[];
  summary: string;
  constraintHits: string[];
};

const PUFA_PATTERNS: Array<{ code: string; pattern: RegExp; detail: string }> = [
  {
    code: "seed-oil",
    pattern:
      /\b(canola|rapeseed|soybean\s+oil|soy\s+oil|corn\s+oil|sunflower\s+oil|safflower|grapeseed|cottonseed|vegetable\s+oil|seed\s+oil)\b/i,
    detail: "Seed/vegetable oils are high-PUFA. Prefer butter, coconut oil, or none.",
  },
  {
    code: "nut-staple",
    pattern: /\b(almonds?|walnuts?|pecans?|peanut\s+butter|granola|chia|flax|hemp\s+seed)\b/i,
    detail: "Nuts/seeds as staples dump PUFA. Keep rare, not daily fuel.",
  },
  {
    code: "fish-oil",
    pattern:
      /\b(fish\s+oil|cod\s+liver\s+oil\s+capsules?|omega[-\s]?3s?\s+(?:capsules?|pills?|softgels?|mega[-\s]?doses?|stack)|mega[-\s]?dose[sd]?\s+omega[-\s]?3s?)\b/i,
    detail:
      "Omega-3 / fish-oil megadoses are community-not-Peat. Isolated PUFA stacks are a problem here, not a gut or heart win. Food first; clinician for labs. No doses.",
  },
];

const SUPPORTIVE_PATTERNS: Array<{ code: string; pattern: RegExp; detail: string }> = [
  {
    code: "ripe-fruit",
    pattern:
      /\b(orange|oj|orange\s+juice|ripe\s+fruit|mango|papaya|watermelon|grapes?|apple\s+juice|honey|pomegranate|pom(?:egranate)?\s*juice)\b/i,
    detail: "Fruit sugar is a default fuel here, unless you listed fruit as a hard constraint. Pomegranate / pom juice is Peat-aligned.",
  },
  {
    code: "dairy",
    pattern:
      /\b(milk|cheese|yogurt|ice\s+cream|cream|butter|cottage\s+cheese|kefir|latte)\b/i,
    detail: "Dairy is a default calcium/sugar vehicle, unless you listed dairy as a hard constraint.",
  },
  {
    code: "cooked-starch",
    pattern: /\b(potato|white\s+rice|sourdough|pasta|ripe\s+banana)\b/i,
    detail: "Cooked starch with a sugar/protein partner is easier to burn than a lean-and-raw plate.",
  },
  {
    code: "raw-carrot",
    pattern: /\b((?:raw\s+)?carrots?|carrot\s+salad)\b/i,
    detail:
      "Raw carrot is Peat-aligned (fiber/endotoxin angle, food first). It does not cancel a carnivore fruit/dairy split.",
  },
  {
    code: "gelatinous",
    pattern:
      /\b(broth|bone\s+broth|oxtail|shank|skin|gelatin|jello|collagen(?:\s+(?:from\s+food|peptides?))?|glycine|cartilage|tendon|(?:bone\s+)?stocks?)\b/i,
    detail:
      "Glycine via beef gelatin, collagen, stocks, and cartilage is Peat-aligned. Food first, not a capsule protocol. Collagen/gelatin overlap is OK.",
  },
];

const ICED_FLUID =
  /\b(iced|ice[-\s]?cold|ice\s+water|cold\s+brew|cold\s+(water|drinks?|fluids?))\b/i;
const WARM_FLUID =
  /\b((warm|room[-\s]?temp(?:erature)?|hot)\s+(milk|juice|water|coffee|tea|oj|fluids?|drinks?)|room[-\s]?temp(?:erature)?)\b/i;
const COMMUNITY_PCOS =
  /\b(berberine|pcos\s*max|pcos[-\s]?stack|inositol\s+stack)\b/i;
const ASHWAGANDHA = /\b(ashwagandha|withania(?:\s+somnifera)?)\b/i;
const LOW_CARB = /\b(low[-\s]?carb|keto)\b/i;
const PROCESSED_JUNK =
  /\b(ultra[-\s]?processed|processed\s+junk|junk\s+food|doritos|cheetos|potato\s+chips|corn\s+chips|fast\s+food|seed[-\s]?oil\s+snacks?|packaged\s+snacks?)\b/i;
const NIACINAMIDE = /\b(niacinamide|nicotinamide)\b/i;
const FRUIT_DAIRY_REFUSAL =
  /\b(?:(?:no|without|refuse[sd]?|avoid(?:ing)?)\s+(?:fruit|dairy)|(?:fruit|dairy)[^\n]{0,24}refus)/i;

const DAIRY_FOOD =
  /\b(milk|cheese|yogurt|ice\s+cream|cream|butter|cottage\s+cheese|kefir|dairy|lactose|latte)\b/i;
const FRUIT_FOOD =
  /\b(fruit|orange|oj|orange\s+juice|mango|papaya|watermelon|grapes?|apple|banana|melon|juice|pomegranate|pom(?:egranate)?\s*juice)\b/i;

const SALADINO =
  /\b(saladino|paul\s+saladino|carnivoremd)\b/i;
const ALPACA_STYLE =
  /\balpaca(?:'s)?\s*(?:herbs?[- ]only|steak[- ]centric|carnivore|diet|protocol|animal[- ]based)\b/i;
const POM_WAKE =
  /\b(pomegranate|pom(?:egranate)?\s*(?:juice|tea)|pom\s+juice)\b/i;
const MIDDAY_STOCK =
  /\b(meat\s+stock|gelatinous\s+broth|bone\s+broth|beef\s+stock|oxtail|(?:bone\s+)?stocks?)\b/i;
const BED_MILK =
  /\b(warm\s+milk|milk[^\n]{0,40}honey|honey[^\n]{0,40}glycine|milk[^\n]{0,40}glycine)\b/i;
const NAMED_FALL_STACK = /\bfall\s+stack\b/i;
const OJ_INTOLERANCE =
  /\b((?:oj|orange\s+juice|fruit\s+juice|juice)\b[^.!?\n]{0,80}\b(intoleran(?:ce|t)|poison|can'?t\s+tolerate|cannot\s+tolerate|doesn'?t\s+sit)|juice\s+is\s+poison|oj\s+intoleran(?:ce|t))\b/i;
const SOLBRAH_MERINGUE =
  /\b(salted\s+egg[-\s]?white(?:s)?(?:\s+sugar)?\s+meringue|egg[-\s]?white(?:s)?\s+sugar\s+meringue|sugar\s+meringue)\b/i;
const NATURAL_MG =
  /\b((?:natural|liquid)\s+(?:mg|magnesium)|mg[-\s]?in[-\s]?oj|magnesium\s+in\s+(?:oj|orange\s+juice))\b/i;
const MILK_SUGAR_DRINK =
  /\b(molasses\s+latte|(?:milk|latte|coffee)\s+(?:with|and|\+)\s+(?:molasses|sugar)|(?:molasses|sugar)\s+(?:milk|latte)|milk\s*\+\s*sugar)\b/i;
const RAW_FERMENTED_DAIRY =
  /\b(raw\s+milk|unpasteurized(?:\s+(?:milk|dairy|cheese|cream|yogurt|kefir))?|raw\s+(?:cheese|dairy|cream|yogurt|kefir)|(?:raw|unpasteurized)\s+fermented\s+dairy|fermented\s+dairy)\b/i;

function namedAlpacaSaladinoCarnivore(food: string): boolean {
  if (SALADINO.test(food)) {
    return true;
  }
  if (ALPACA_STYLE.test(food)) {
    return true;
  }
  return (
    /\balpaca\b/i.test(food) &&
    /\b(herbs?[- ]only|steak[- ]centric|carnivore|animal[- ]based)\b/i.test(food)
  );
}

function alpacaHerbsOrSteak(food: string): boolean {
  return (
    /\balpaca\b/i.test(food) &&
    /\b(herbs?[- ]only|steak[- ]centric)\b/i.test(food)
  );
}

function alpacaCollagenPromo(food: string): boolean {
  return (
    /\balpaca\b/i.test(food) &&
    /\b(collagen|promo(?:tion)?|affiliate|sponsor(?:ed|ship)?)\b/i.test(food)
  );
}

const ICE_CREAM = /\bice\s+cream\b/i;
const PEAT_ICE_CREAM_INGREDIENT =
  /\b(milk|eggs?|sugar|coconut(?:\s+(?:oil|milk|cream|butter))?)\b/i;
const PEAT_STYLE_NAMED = /\bpeat(?:y|[-\s]style)?\b/i;

function peatFallStack(food: string): boolean {
  const threeBeats =
    POM_WAKE.test(food) && MIDDAY_STOCK.test(food) && BED_MILK.test(food);
  if (threeBeats) {
    return true;
  }
  return (
    NAMED_FALL_STACK.test(food) &&
    (POM_WAKE.test(food) ||
      MIDDAY_STOCK.test(food) ||
      BED_MILK.test(food) ||
      /\b(bioavailablend|pomegranate|gelatin|glycine|stock)\b/i.test(food))
  );
}

function peatStyleIceCream(food: string, hasSeedOil: boolean): boolean {
  if (!ICE_CREAM.test(food) || hasSeedOil) {
    return false;
  }
  return PEAT_STYLE_NAMED.test(food) || PEAT_ICE_CREAM_INGREDIENT.test(food);
}

function carnivoreDiverges(food: string): boolean {
  // Named Alpaca/Saladino carnivore always flags the fruit/dairy split.
  // Herbs-only / steak-centric and carrots/carbs overlapping do not cancel it.
  if (alpacaHerbsOrSteak(food) || namedAlpacaSaladinoCarnivore(food) || alpacaCollagenPromo(food)) {
    return true;
  }
  if (!/\bcarnivore\b/i.test(food)) {
    return false;
  }
  if (FRUIT_DAIRY_REFUSAL.test(food)) {
    return true;
  }
  const fruitOk = FRUIT_FOOD.test(food) && !/\bno\s+fruit\b/i.test(food);
  const dairyOk = DAIRY_FOOD.test(food) && !/\bno\s+dairy\b/i.test(food);
  return !fruitOk && !dairyOk;
}

function constraintHit(food: string, constraints: string[]): string[] {
  const haystack = food.toLowerCase();
  return constraints.filter((constraint) => {
    const needle = constraint.trim().toLowerCase();
    if (needle.length < 3) {
      return false;
    }
    if (/\b(dairy|milk|cheese|yogurt|lactose)\b/i.test(needle) && DAIRY_FOOD.test(food)) {
      return true;
    }
    if (/\bfruit\b/i.test(needle) && FRUIT_FOOD.test(food)) {
      return true;
    }
    return haystack.includes(needle);
  });
}

export function checkFood(
  food: string,
  hardConstraints: string[],
): FoodCheckResult {
  const trimmed = food.trim();
  const flags: FoodFlag[] = [];

  if (trimmed.length === 0) {
    return {
      food: trimmed,
      verdict: "mixed",
      summary: "Name the food (and roughly how it is prepared) before scoring it.",
      flags: [],
      constraintHits: [],
    };
  }

  const hits = constraintHit(trimmed, hardConstraints);
  if (hits.length > 0) {
    return {
      food: trimmed,
      verdict: "blocked",
      summary: `Hard constraint hit: ${hits.join(", ")}. That is your rule, not a Peat default. Skip it and pick another fuel.`,
      flags: [
        {
          code: "hard-constraint",
          detail: "User-listed refusal / allergy / intolerance.",
        },
      ],
      constraintHits: hits,
    };
  }

  for (const item of PUFA_PATTERNS) {
    if (item.pattern.test(trimmed)) {
      flags.push({ code: item.code, detail: item.detail });
    }
  }
  for (const item of SUPPORTIVE_PATTERNS) {
    if (item.pattern.test(trimmed)) {
      flags.push({ code: item.code, detail: item.detail });
    }
  }

  if (/\b(fast|omad|keto|low[-\s]?carb|calorie\s*deficit|crash|skip(?:ping)?\s+breakfast)\b/i.test(trimmed)) {
    flags.push({
      code: "underfuel",
      detail:
        "Peaty does not coach crash diets or skipped breakfast. Raise the burn with morning digestible carbs (milk, OJ, fruit, honey if allowed); do not starve it.",
    });
  }

  if (ICED_FLUID.test(trimmed)) {
    flags.push({
      code: "iced-fluid",
      detail:
        "Prefer warm or room-temp fluids over iced drinks (Peat-aligned coaching note, not a medical protocol).",
    });
  }
  if (WARM_FLUID.test(trimmed)) {
    flags.push({
      code: "warm-fluid",
      detail: "Warm or room-temp fluids fit Peat-aligned coaching better than iced drinks.",
    });
  }
  if (COMMUNITY_PCOS.test(trimmed)) {
    flags.push({
      code: "community-pcos",
      detail:
        "Berberine / PCOS \"max\" stacks are community talk, not a Peat-primary move. Stay on food and rhythm; clinician for medical PCOS care. No doses.",
    });
  }
  if (ASHWAGANDHA.test(trimmed)) {
    flags.push({
      code: "community-ashwagandha",
      detail:
        "Ashwagandha is community talk, not Peat-primary, and not a gut fix. Stay on food and rhythm; clinician if they are already supplementing. No doses.",
    });
  }
  if (LOW_CARB.test(trimmed) && (ASHWAGANDHA.test(trimmed) || /\bgut\b/i.test(trimmed))) {
    flags.push({
      code: "low-carb-gut-fix",
      detail:
        "Low-carb plus ashwagandha (or low-carb framed as a gut fix) is not Peaty. Raise the burn with fruit/dairy sugars unless constrained. Do not starve the gut.",
    });
  }
  if (PROCESSED_JUNK.test(trimmed)) {
    flags.push({
      code: "processed-junk",
      detail:
        "Processed junk (ultra-processed PUFA snacks, chip-aisle food) is a poor metabolic staple. Swap toward fruit, dairy if allowed, salt, and cooked food.",
    });
  }
  if (NIACINAMIDE.test(trimmed)) {
    flags.push({
      code: "niacinamide-note",
      detail:
        "Niacinamide is sometimes discussed as a gut-adjacent food/B3 note, not a drug protocol. No dosing regimens. Clinician if supplementing.",
    });
  }
  if (peatFallStack(trimmed)) {
    flags.push({
      code: "fall-stack",
      detail:
        "BioavailableNd-style fall stack is Peat-aligned when ingredients fit: wake pomegranate juice/tea, midday meat stock / gelatinous broth, bed warm milk + honey + glycine. Food and rhythm, not a capsule protocol. Community origin — do not cite the handle as evidence.",
    });
  }
  if (OJ_INTOLERANCE.test(trimmed)) {
    flags.push({
      code: "oj-intolerance-context",
      detail:
        "Abud-style OJ-intolerance framing: often the person/context, not \"juice is poison.\" Label carefully. Not a medical diagnosis. Fruit constraint still wins if they listed it.",
    });
  }
  if (SOLBRAH_MERINGUE.test(trimmed)) {
    flags.push({
      code: "solbrah-meringue",
      detail:
        "SolBrah salted egg-white sugar meringue is an optional community food note: low-PUFA sugar+protein snack. Not a protocol. Do not cite the handle as evidence.",
    });
  }
  if (NATURAL_MG.test(trimmed)) {
    flags.push({
      code: "natural-mg",
      detail:
        "Natural/liquid Mg pairs with mineralized fluids / Mg-in-OJ: food and mineral, not a drug protocol. No doses. Clinician if they want a number.",
    });
  }
  if (MILK_SUGAR_DRINK.test(trimmed)) {
    flags.push({
      code: "milk-sugar-drink",
      detail:
        "Milk+sugar drinks (including molasses latte) are Peat-aligned unless you listed dairy as a hard constraint.",
    });
  }
  if (RAW_FERMENTED_DAIRY.test(trimmed)) {
    flags.push({
      code: "raw-fermented-dairy-safety",
      detail:
        "Raw/fermented dairy is a community signal, not a Peaty endorsement. Plain food-safety note: raw milk carries pathogen risk. Not medical advice.",
    });
  }
  if (alpacaCollagenPromo(trimmed)) {
    flags.push({
      code: "alpaca-collagen-promo",
      detail:
        "Alpaca collagen promo is a promotion (affiliate/sponsor framing), not Peat-primary. Still flag the usual Alpaca carnivore split vs same-day dairy+fruit.",
    });
  }

  const hasSeedOil = flags.some((flag) => flag.code === "seed-oil");
  if (peatStyleIceCream(trimmed, hasSeedOil)) {
    flags.push({
      code: "peat-ice-cream",
      detail:
        "Peat-style ice cream is a whitelist staple when the ingredients are milk, eggs, sugar, and/or coconut — not seed-oil junk. Collagen/gelatin in the mix is OK.",
    });
  }

  if (carnivoreDiverges(trimmed)) {
    flags.push({
      code: "carnivore-divergence",
      detail: alpacaCollagenPromo(trimmed)
        ? "Alpaca collagen promo is a promotion (affiliate/sponsor framing). Alpaca/Saladino carnivore fruit/dairy split still diverges from Peat even with same-day dairy+fruit."
        : namedAlpacaSaladinoCarnivore(trimmed) || alpacaHerbsOrSteak(trimmed)
        ? "Alpaca/Saladino (Saladino/Alpaca-style) carnivore fruit/dairy split (including Alpaca herbs-only / steak-centric) diverges from Peat even with same-day dairy+fruit. Fruit and dairy are OK here unless you listed them as hard constraints. Carrots or other carbs overlapping do not cancel that split."
        : "Carnivore fruit/dairy refusal (including Saladino/Alpaca-style animal-based) diverges from Peat: fruit and dairy are OK here unless you listed them as hard constraints. Carrots/starch do not stand in for fruit and dairy.",
    });
  }
  if (/\bglycine\s*(powder|capsules?|grams?)\b/i.test(trimmed)) {
    flags.push({
      code: "glycine-food-not-dose",
      detail:
        "Glycine is Peat-aligned via gelatin, stocks, and cartilage — not a capsule protocol. No gram counts.",
    });
  }

  const hasPufa = flags.some((flag) =>
    ["seed-oil", "nut-staple", "fish-oil"].includes(flag.code),
  );
  const hasJunk = flags.some((flag) => flag.code === "processed-junk");
  const hasSupport = flags.some((flag) =>
    [
      "ripe-fruit",
      "dairy",
      "cooked-starch",
      "raw-carrot",
      "gelatinous",
      "warm-fluid",
      "peat-ice-cream",
      "fall-stack",
      "solbrah-meringue",
      "milk-sugar-drink",
    ].includes(flag.code),
  );
  const communityNotPeat = flags.some((flag) =>
    ["community-pcos", "community-ashwagandha", "low-carb-gut-fix"].includes(
      flag.code,
    ),
  );
  const divergesFromPeat = flags.some((flag) => flag.code === "carnivore-divergence");
  const niacinamideNote = flags.some((flag) => flag.code === "niacinamide-note");
  const ojIntolerance = flags.some((flag) => flag.code === "oj-intolerance-context");
  const naturalMg = flags.some((flag) => flag.code === "natural-mg");
  const rawFermented = flags.some((flag) => flag.code === "raw-fermented-dairy-safety");
  const alpacaPromo = flags.some((flag) => flag.code === "alpaca-collagen-promo");
  const alpacaNamed =
    alpacaHerbsOrSteak(trimmed) ||
    namedAlpacaSaladinoCarnivore(trimmed) ||
    alpacaCollagenPromo(trimmed);

  let verdict: FoodCheckResult["verdict"] = "mixed";
  if ((hasPufa || hasJunk) && !hasSupport) {
    verdict = "poor-fit";
  } else if (
    hasSupport &&
    !hasPufa &&
    !hasJunk &&
    !communityNotPeat &&
    !divergesFromPeat &&
    !rawFermented
  ) {
    verdict = "supportive";
  }

  const ashwagandhaOrLowCarb = flags.some((flag) =>
    ["community-ashwagandha", "low-carb-gut-fix"].includes(flag.code),
  );

  const summary =
    verdict === "supportive"
      ? flags.some((flag) => flag.code === "peat-ice-cream")
        ? "Peat-style ice cream fits: milk, eggs, sugar, coconut — not seed-oil junk. Collagen/gelatin overlap is OK. Dairy sugar is a default fuel unless constrained."
        : flags.some((flag) => flag.code === "fall-stack")
          ? "BioavailableNd-style fall stack fits when ingredients do: wake pomegranate juice/tea, midday meat stock / gelatinous broth, bed warm milk + honey + glycine. Food first, not a capsule protocol."
        : flags.some((flag) => flag.code === "milk-sugar-drink")
          ? "Milk+sugar drinks (including molasses latte) are Peat-aligned. Gelatin/collagen overlap stays OK. Dairy sugar is a default fuel unless constrained."
          : flags.some((flag) => flag.code === "raw-carrot") &&
            !flags.some((flag) => flag.code === "ripe-fruit" || flag.code === "dairy")
          ? "Raw carrot is Peat-aligned. Keep fruit and dairy in the day unless you listed them as hard constraints."
          : ojIntolerance
            ? "Fits the pro-metabolic plate. OJ intolerance is often the person/context, not \"juice is poison\" — label only, not a medical diagnosis. Prefer warm or room-temp fluids."
            : "Fits the pro-metabolic plate: sugar from fruit/dairy (pomegranate/pom juice counts), cooked food, raw carrot if you want it, glycine from gelatinous cuts, low PUFA. Prefer warm or room-temp fluids."
      : verdict === "poor-fit"
        ? hasJunk && !hasPufa
          ? "Poor metabolic fit as a staple. Processed junk is not the fuel. Swap toward fruit, dairy if allowed, salt, and cooked starch."
          : "Poor metabolic fit as a staple. Swap the PUFA/lean-raw pattern for fruit, dairy if allowed, salt, and cooked starch."
        : communityNotPeat
          ? ashwagandhaOrLowCarb
            ? "Community, not Peat-primary. Ashwagandha and low-carb-as-gut-fix are not the move. Keep fruit/dairy sugars unless constrained; clinician if they are already supplementing. No doses."
            : "Community stack, not Peat-primary. Keep food and rhythm; do not turn berberine/PCOS max talk into a Peaty protocol or dose list."
          : divergesFromPeat
            ? alpacaPromo
              ? "Alpaca collagen promo is a promotion (affiliate/sponsor framing), not Peat-primary. Still flag the usual Alpaca carnivore split vs same-day dairy+fruit. Fruit and dairy are OK here unless you listed them as hard constraints."
              : alpacaNamed
              ? "Alpaca herbs-only / steak-centric (or Alpaca/Saladino (Saladino/Alpaca-style) carnivore) diverges from Peat even when carrots or carbs overlap, and even with same-day dairy+fruit. Fruit and dairy are OK here unless you listed them as hard constraints."
              : "Carnivore fruit/dairy refusal (including Saladino/Alpaca-style animal-based) diverges from Peat. Fruit and dairy are OK here unless you listed them as hard constraints. Carrots/starch do not replace that."
            : rawFermented
              ? "Raw/fermented dairy is a community signal, not an endorsement. Plain food-safety note: raw milk carries pathogen risk. Not medical advice. Pasteurized dairy and fruit stay defaults unless you listed them as hard constraints."
            : ojIntolerance
              ? "OJ intolerance is often the person/context, not \"juice is poison.\" Label carefully — not a medical diagnosis. Fruit and dairy stay defaults unless you listed them as hard constraints."
              : niacinamideNote
              ? "Niacinamide is sometimes discussed here as a food/B3 note, not a drug protocol. No dosing regimens. Clinician if supplementing. Keep the plate on fruit, dairy if allowed, and cooked food."
              : naturalMg
                ? "Natural/liquid Mg is food/mineral (Mg-in-OJ / mineralized fluids), not a dosing protocol. No doses. Keep the plate on fruit, dairy if allowed, salt, and cooked food."
                : "Mixed. Keep the supportive pieces, drop seed oils, prefer warm/room-temp fluids, and do not treat dairy or fruit as forbidden unless you listed them as constraints.";

  return {
    food: trimmed,
    verdict,
    summary,
    flags,
    constraintHits: [],
  };
}
