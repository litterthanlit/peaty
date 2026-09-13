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
    pattern: /\b(broth|oxtail|shank|skin|gelatin|collagen\s+from\s+food)\b/i,
    detail: "Gelatinous cuts balance muscle meat better than a dry steak-only plate.",
  },
];

function constraintHit(food: string, constraints: string[]): string[] {
  const haystack = food.toLowerCase();
  return constraints.filter((constraint) => {
    const needle = constraint.trim().toLowerCase();
    if (needle.length < 3) {
      return false;
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

  if (/\b(fast|omad|keto|carnivore|calorie\s*deficit|crash)\b/i.test(trimmed)) {
    flags.push({
      code: "underfuel",
      detail: "Peaty does not coach crash diets. Raise the burn; do not starve it.",
    });
  }

  const hasPufa = flags.some((flag) =>
    ["seed-oil", "nut-staple", "fish-oil"].includes(flag.code),
  );
  const hasSupport = flags.some((flag) =>
    ["ripe-fruit", "dairy", "cooked-starch", "gelatinous"].includes(flag.code),
  );

  let verdict: FoodCheckResult["verdict"] = "mixed";
  if (hasPufa && !hasSupport) {
    verdict = "poor-fit";
  } else if (hasSupport && !hasPufa) {
    verdict = "supportive";
  }

  const summary =
    verdict === "supportive"
      ? "Fits the pro-metabolic plate: sugar from fruit/dairy, cooked food, low PUFA. Keep portions that actually get eaten."
      : verdict === "poor-fit"
        ? "Poor metabolic fit as a staple. Swap the PUFA/lean-raw pattern for fruit, dairy if allowed, salt, and cooked starch."
        : "Mixed. Keep the supportive pieces, drop seed oils, and do not treat dairy or fruit as forbidden unless you listed them as constraints.";

  return {
    food: trimmed,
    verdict,
    summary,
    flags,
    constraintHits: [],
  };
}
