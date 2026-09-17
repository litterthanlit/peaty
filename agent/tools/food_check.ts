import { defineTool } from "eve/tools";
import { z } from "zod";
import { checkFood } from "../lib/food-check";
import { coachingGuard } from "../lib/guard";
import { checkSafety } from "../lib/safety";
import { peatySession } from "../lib/session-state";

export default defineTool({
  description:
    "Score a food or meal against Peaty defaults (raise burn, dairy+fruit sugars including pomegranate/pom juice, raw carrot, low PUFA, warm/room-temp fluids, glycine from gelatin/stocks/cartilage) and the user's hard constraints. Dairy and fruit are allowed unless the user listed them as constraints. Label berberine/PCOS max stacks as community, not Peat-primary. Alpaca/Saladino carnivore fruit/dairy split diverges from Peat even when carrots/carbs overlap.",
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
