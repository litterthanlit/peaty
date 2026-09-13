import { defineTool } from "eve/tools";
import { z } from "zod";
import { emptyBrief, peatySession } from "../lib/session-state";

export default defineTool({
  description:
    "Save the one-screen onboarding brief: primary goal, optional markers, hard constraints, do-not-do. Safety-gate defaults ON.",
  inputSchema: z.object({
    primaryGoal: z.string().min(1),
    markers: z.array(z.string()),
    hardConstraints: z.array(z.string()),
    doNotDo: z.array(z.string()),
    safetyGate: z.optional(z.boolean()),
    screen: z.string().min(1).describe("The one-screen brief shown to the user."),
  }),
  label: {
    start: () => "Save onboarding brief",
  },
  async execute({ primaryGoal, markers, hardConstraints, doNotDo, safetyGate, screen }) {
    const brief = {
      ...emptyBrief(),
      primaryGoal: primaryGoal.trim(),
      markers: markers.map((item) => item.trim()).filter((item) => item.length > 0),
      hardConstraints: hardConstraints
        .map((item) => item.trim())
        .filter((item) => item.length > 0),
      doNotDo: doNotDo.map((item) => item.trim()).filter((item) => item.length > 0),
      safetyGate: safetyGate ?? true,
      screen: screen.trim(),
    };

    peatySession.update((current) => ({
      ...current,
      brief,
    }));

    return {
      saved: true,
      safetyGate: brief.safetyGate,
      constraintCount: brief.hardConstraints.length,
      reminder:
        "Dairy or fruit refusals are hard constraints, not Peat defaults. Safety-gate stays on unless the user explicitly turns it off — and even then, no DIY T3/aspirin/hormones/BPC.",
    };
  },
});
