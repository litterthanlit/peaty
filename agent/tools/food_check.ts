import { defineTool } from "eve/tools";
import { z } from "zod";
import { checkFood } from "../lib/food-check";
import { coachingGuard } from "../lib/guard";
import { checkSafety } from "../lib/safety";
import { peatySession } from "../lib/session-state";

export default defineTool({
  description:
    "Score a food or meal against Peaty defaults (raise burn, dairy+fruit sugars including daily OJ / OJ+collagen / honey / maple / A2-milk cocoa, fruit sugars, and pomegranate/pom juice, raw carrot, milk+sugar drinks including molasses latte, BioavailableNd-style fall stack when ingredients fit, low PUFA, warm/room-temp fluids, glycine from gelatin/collagen/beef gelatin/stocks/cartilage) and the user's hard constraints. Dairy and fruit are allowed unless the user listed them as constraints. Raw/fermented dairy gets a food-safety note (raw milk pathogen risk), not an endorsement. Whitelist Peat-style ice cream (milk/eggs/sugar/coconut, not seed-oil junk). Push back fructose fear including Sinclair (community fear ≠ Peat). Label berberine/PCOS max stacks, ashwagandha, omega-3/fish-oil megadoses, SolBrah meringue/Mg, and Abud OJ-intolerance framing as community, not Peat-primary (OJ intolerance is person/context, not juice-is-poison; not a diagnosis). AbudBakri OJ and Alpaca carbs-are-back are source-digest labels only. Processed junk is a poor staple. Always flag Alpaca/Saladino carnivore fruit/dairy split vs same-day dairy+fruit and Alpaca herbs-only / steak-centric / carbs-are-back / collagen promo (affiliate/sponsor framing) even when carrots/carbs/fruit overlap, and when OJ/honey mixes with beef-rice kibble.",
  inputSchema: z.object({
    food: z.string().min(1).describe("Food or meal to check, including fats used."),
    context: z
      .optional(z.string())
      .describe("Optional timing, amount, or why they are asking."),
  }),
  label: {
    start: ({ food }) => `Check food: ${food}`,
  },
  async execute({ food, context }) {
    const inbound = coachingGuard();
    if (!inbound.ok) {
      return {
        food,
        verdict: "blocked" as const,
        summary: inbound.safety.redirect,
        flags: [],
        constraintHits: [],
        context: context ?? null,
        safetyGate: true as const,
        safety: inbound.safety,
      };
    }

    const protocolHit = checkSafety([food, context ?? ""].join("\n"));
    if (protocolHit.verdict === "block") {
      return {
        food,
        verdict: "blocked" as const,
        summary: protocolHit.redirect,
        flags: [],
        constraintHits: [],
        context: context ?? null,
        safetyGate: true as const,
        safety: protocolHit,
      };
    }

    const { brief } = peatySession.get();
    const constraints = brief?.hardConstraints ?? [];
    const result = checkFood(food, constraints);
    return {
      ...result,
      context: context ?? null,
      safetyGate: true as const,
      constraintSource:
        "Hard constraints come from onboarding. Dairy/fruit refusals live there; they are not Peat defaults.",
    };
  },
});
