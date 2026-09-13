import { defineTool } from "eve/tools";
import { z } from "zod";
import { checkFood } from "../lib/food-check";
import { peatySession } from "../lib/session-state";

export default defineTool({
  description:
    "Score a food or meal against Peaty defaults (raise burn, dairy+fruit sugars, low PUFA) and the user's hard constraints. Dairy and fruit are allowed unless the user listed them as constraints.",
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
    const { brief } = peatySession.get();
    const constraints = brief?.hardConstraints ?? [];
    const result = checkFood(food, constraints);
    return {
      ...result,
      context: context ?? null,
      safetyGate: brief?.safetyGate ?? true,
      constraintSource:
        "Hard constraints come from onboarding. Dairy/fruit refusals live there; they are not Peat defaults.",
    };
  },
});
