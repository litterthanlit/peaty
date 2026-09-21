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
      /\b(orange|oj|orange\s+juice|ripe\s+fruit|fruit\s+sugars?|mango|papaya|watermelon|grapes?|apple\s+juice|honey|maple(?:\s+syrup)?|pomegranate|pom(?:egranate)?\s*juice)\b/i,
    detail:
      "OJ / fruit sugars / honey / maple are Peat-aligned when the rest of the meal is solid, unless you listed fruit as a hard constraint. Pomegranate / pom juice counts. Fructose fear in an iso-caloric context is community fear, not Peat.",
  },
  {
    code: "dairy",
    pattern:
      /\b(milk|cheese|yogurt|ice\s+cream|cream|butter|cottage\s+cheese|kefir)\b/i,
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
  /\b(milk|cheese|yogurt|ice\s+cream|cream|butter|cottage\s+cheese|kefir|dairy|lactose)\b/i;
const FRUIT_FOOD =
  /\b(fruit|orange|oj|orange\s+juice|mango|papaya|watermelon|grapes?|apple|banana|melon|juice|pomegranate|pom(?:egranate)?\s*juice)\b/i;

const SALADINO =
  /\b(saladino|paul\s+saladino|carnivoremd)\b/i;
const ALPACA_SPLIT =
  /\b(herbs?[- ]only|steak[- ]centric|carnivore|animal[- ]based|carbs?[-\s]are[-\s]back)\b/i;
const ALPACA_STYLE =
  /\balpaca(?:'s)?\s*(?:herbs?[- ]only|steak[- ]centric|carnivore|diet|protocol|animal[- ]based|carbs?[-\s]are[-\s]back)\b/i;
const ABUD_BAKRI = /\babudbakri\b/i;
const PEAT_SUGARS =
  /\b(oj|orange\s+juice|honey|maple(?:\s+syrup)?|fruit\s+sugars?|ripe\s+fruit)\b/i;
const FRUCTOSE_FEAR =
  /\b(fructose\s+fear(?:\s*monger(?:ing)?)?|fear(?:[-\s]of|[-\s]monger(?:ing)?)?\s+fructose|fructose\s+(?:is\s+)?(?:toxic|poison(?:ous)?|dangerous)|anti[-\s]?fructose|avoid(?:ing)?\s+fructose|fructose\s+monger(?:ing)?)\b/i;

function namedAlpacaSaladinoCarnivore(food: string): boolean {
  if (SALADINO.test(food)) {
    return true;
  }
  if (ALPACA_STYLE.test(food)) {
    return true;
  }
  return /\balpaca\b/i.test(food) && ALPACA_SPLIT.test(food);
}

function abudBakriOjTalk(food: string): boolean {
  return ABUD_BAKRI.test(food) && (PEAT_SUGARS.test(food) || FRUIT_FOOD.test(food) || /\bfructose\b/i.test(food));
}

function alpacaCarbsAreBack(food: string): boolean {
  return /\balpaca\b/i.test(food) && /\bcarbs?[-\s]are[-\s]back\b/i.test(food);
}

function fructoseFearTalk(food: string): boolean {
  if (FRUCTOSE_FEAR.test(food)) {
    return true;
  }
  return /\biso[-\s]?caloric\b/i.test(food) && /\bfructose\b/i.test(food);
}

function alpacaHerbsOrSteak(food: string): boolean {
  return (
    /\balpaca\b/i.test(food) &&
    /\b(herbs?[- ]only|steak[- ]centric)\b/i.test(food)
  );
}

const ICE_CREAM = /\bice\s+cream\b/i;
const PEAT_ICE_CREAM_INGREDIENT =
  /\b(milk|eggs?|sugar|coconut(?:\s+(?:oil|milk|cream|butter))?)\b/i;
const PEAT_STYLE_NAMED = /\bpeat(?:y|[-\s]style)?\b/i;

function peatStyleIceCream(food: string, hasSeedOil: boolean): boolean {
  if (!ICE_CREAM.test(food) || hasSeedOil) {
    return false;
  }
  return PEAT_STYLE_NAMED.test(food) || PEAT_ICE_CREAM_INGREDIENT.test(food);
}

function carnivoreDiverges(food: string): boolean {
  // Named Alpaca/Saladino carnivore always flags the fruit/dairy split,
  // even when carbs/fruit overlap or the plate is "carbs-are-back."
  // Herbs-only / steak-centric does not cancel it.
  if (alpacaHerbsOrSteak(food) || namedAlpacaSaladinoCarnivore(food) || alpacaCarbsAreBack(food)) {
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

  const hasSeedOil = flags.some((flag) => flag.code === "seed-oil");
  if (peatStyleIceCream(trimmed, hasSeedOil)) {
    flags.push({
      code: "peat-ice-cream",
      detail:
        "Peat-style ice cream is a whitelist staple when the ingredients are milk, eggs, sugar, and/or coconut — not seed-oil junk. Collagen/gelatin in the mix is OK.",
    });
  }

  if (fructoseFearTalk(trimmed)) {
    flags.push({
      code: "fructose-fear",
      detail:
        "Fructose fear in an iso-caloric context is community fear, not Peat. OJ / fruit sugars / honey / maple stay Peat-aligned when the rest of the meal is solid. Do not drop fruit sugars over that lore.",
    });
  }
  if (abudBakriOjTalk(trimmed) || alpacaCarbsAreBack(trimmed)) {
    flags.push({
      code: "community-source-label",
      detail:
        "AbudBakri OJ talk and Alpaca carbs-are-back are community/source-digest labels only — not Peat-primary citations. The food (OJ / fruit sugars) can still be Peat-aligned. Do not cite the handle as evidence.",
    });
  }

  if (carnivoreDiverges(trimmed)) {
    flags.push({
      code: "carnivore-divergence",
      detail: namedAlpacaSaladinoCarnivore(trimmed) || alpacaHerbsOrSteak(trimmed) || alpacaCarbsAreBack(trimmed)
        ? "Alpaca/Saladino (Saladino/Alpaca-style) carnivore fruit/dairy split (including Alpaca herbs-only / steak-centric and carbs-are-back) diverges from Peat. Fruit and dairy are OK here unless you listed them as hard constraints. Carrots, other carbs, or fruit overlapping do not cancel that split. Label Alpaca carbs-are-back as community/source-digest only."
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
    ].includes(flag.code),
  );
  const peatSugars = PEAT_SUGARS.test(trimmed) && flags.some((flag) => flag.code === "ripe-fruit");
  const fructoseFear = flags.some((flag) => flag.code === "fructose-fear");
  const communityNotPeat = flags.some((flag) =>
    ["community-pcos", "community-ashwagandha", "low-carb-gut-fix"].includes(
      flag.code,
    ),
  );
  const divergesFromPeat = flags.some((flag) => flag.code === "carnivore-divergence");
  const niacinamideNote = flags.some((flag) => flag.code === "niacinamide-note");
  const alpacaNamed =
    alpacaHerbsOrSteak(trimmed) ||
    namedAlpacaSaladinoCarnivore(trimmed) ||
    alpacaCarbsAreBack(trimmed);

  let verdict: FoodCheckResult["verdict"] = "mixed";
  if ((hasPufa || hasJunk) && !hasSupport) {
    verdict = "poor-fit";
  } else if (
    hasSupport &&
    !hasPufa &&
    !hasJunk &&
    !communityNotPeat &&
    !divergesFromPeat
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
        : flags.some((flag) => flag.code === "raw-carrot") &&
            !flags.some((flag) => flag.code === "ripe-fruit" || flag.code === "dairy")
          ? "Raw carrot is Peat-aligned. Keep fruit and dairy in the day unless you listed them as hard constraints."
          : peatSugars || fructoseFear
            ? "OJ / fruit sugars / honey / maple are Peat-aligned when the rest of the meal is solid. Fructose fear in an iso-caloric context is community fear, not Peat. Pomegranate/pom juice counts."
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
            ? alpacaNamed
              ? "Alpaca herbs-only / steak-centric (or Alpaca/Saladino (Saladino/Alpaca-style) carnivore, including carbs-are-back) diverges from Peat even when carrots or carbs overlap, including fruit. Fruit and dairy are OK here unless you listed them as hard constraints. Alpaca carbs-are-back is a community/source-digest label only."
              : "Carnivore fruit/dairy refusal (including Saladino/Alpaca-style animal-based) diverges from Peat. Fruit and dairy are OK here unless you listed them as hard constraints. Carrots/starch do not replace that."
            : fructoseFear
              ? "Fructose fear in an iso-caloric context is community fear, not Peat. OJ / fruit sugars / honey / maple stay Peat-aligned when the rest of the meal is solid."
              : niacinamideNote
              ? "Niacinamide is sometimes discussed here as a food/B3 note, not a drug protocol. No dosing regimens. Clinician if supplementing. Keep the plate on fruit, dairy if allowed, and cooked food."
              : "Mixed. Keep the supportive pieces, drop seed oils, prefer warm/room-temp fluids, and do not treat dairy or fruit as forbidden unless you listed them as constraints.";

  return {
    food: trimmed,
    verdict,
    summary,
    flags,
    constraintHits: [],
  };
}
