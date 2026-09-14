export type FoodFlag = {
  code: string;
  detail: string;
};

export type FoodCheckResult = {
  food: string;
  verdict: "supportive" | "mixed" | "poor-fit" | "blocked";
  summary: string;
  flags: FoodFlag[];
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
    pattern: /\b(fish\s+oil|cod\s+liver\s+oil\s+capsules?|omega[-\s]?3\s+capsules?)\b/i,
    detail: "Isolated fish-oil stacks are not a Peaty default. Food first; clinician for labs.",
  },
];

const SUPPORTIVE_PATTERNS: Array<{ code: string; pattern: RegExp; detail: string }> = [
  {
    code: "ripe-fruit",
    pattern:
      /\b(orange|oj|orange\s+juice|ripe\s+fruit|mango|papaya|watermelon|grapes?|apple\s+juice|honey)\b/i,
    detail: "Fruit sugar is a default fuel here, unless you listed fruit as a hard constraint.",
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
    code: "gelatinous",
    pattern:
      /\b(broth|bone\s+broth|oxtail|shank|skin|gelatin|jello|collagen\s+from\s+food|glycine|cartilage|tendon|(?:bone\s+)?stocks?)\b/i,
    detail:
      "Glycine via gelatin, stocks, and cartilage is Peat-aligned. Food first, not a capsule protocol.",
  },
];

const ICED_FLUID =
  /\b(iced|ice[-\s]?cold|ice\s+water|cold\s+brew|cold\s+(water|drinks?|fluids?))\b/i;
const WARM_FLUID =
  /\b((warm|room[-\s]?temp(?:erature)?|hot)\s+(milk|juice|water|coffee|tea|oj|fluids?|drinks?)|room[-\s]?temp(?:erature)?)\b/i;
const COMMUNITY_PCOS =
  /\b(berberine|pcos\s*max|pcos[-\s]?stack|inositol\s+stack)\b/i;
const FRUIT_DAIRY_REFUSAL =
  /\b(?:(?:no|without|refuse[sd]?|avoid(?:ing)?)\s+(?:fruit|dairy)|(?:fruit|dairy)[^\n]{0,24}refus)/i;

const DAIRY_FOOD =
  /\b(milk|cheese|yogurt|ice\s+cream|cream|butter|cottage\s+cheese|kefir|dairy|lactose)\b/i;
const FRUIT_FOOD =
  /\b(fruit|orange|oj|orange\s+juice|mango|papaya|watermelon|grapes?|apple|banana|melon|juice)\b/i;

function carnivoreDiverges(food: string): boolean {
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

  if (/\b(fast|omad|keto|calorie\s*deficit|crash)\b/i.test(trimmed)) {
    flags.push({
      code: "underfuel",
      detail: "Peaty does not coach crash diets. Raise the burn; do not starve it.",
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
  if (carnivoreDiverges(trimmed)) {
    flags.push({
      code: "carnivore-divergence",
      detail:
        "Carnivore fruit/dairy refusal diverges from Peat: fruit and dairy are OK here unless you listed them as hard constraints.",
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
  const hasSupport = flags.some((flag) =>
    ["ripe-fruit", "dairy", "cooked-starch", "gelatinous", "warm-fluid"].includes(
      flag.code,
    ),
  );
  const communityNotPeat = flags.some((flag) => flag.code === "community-pcos");
  const divergesFromPeat = flags.some((flag) => flag.code === "carnivore-divergence");

  let verdict: FoodCheckResult["verdict"] = "mixed";
  if (hasPufa && !hasSupport) {
    verdict = "poor-fit";
  } else if (hasSupport && !hasPufa && !communityNotPeat && !divergesFromPeat) {
    verdict = "supportive";
  }

  const summary =
    verdict === "supportive"
      ? "Fits the pro-metabolic plate: sugar from fruit/dairy, cooked food, glycine from gelatinous cuts, low PUFA. Prefer warm or room-temp fluids."
      : verdict === "poor-fit"
        ? "Poor metabolic fit as a staple. Swap the PUFA/lean-raw pattern for fruit, dairy if allowed, salt, and cooked starch."
        : communityNotPeat
          ? "Community stack, not Peat-primary. Keep food and rhythm; do not turn berberine/PCOS max talk into a Peaty protocol or dose list."
          : divergesFromPeat
            ? "Carnivore fruit/dairy refusal diverges from Peat. Fruit and dairy are OK here unless you listed them as hard constraints."
            : "Mixed. Keep the supportive pieces, drop seed oils, prefer warm/room-temp fluids, and do not treat dairy or fruit as forbidden unless you listed them as constraints.";

  return {
    food: trimmed,
    verdict,
    summary,
    flags,
    constraintHits: [],
  };
}
