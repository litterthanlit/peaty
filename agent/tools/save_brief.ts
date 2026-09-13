import { defineTool } from "eve/tools";
import { z } from "zod";
import { lockBrief } from "../lib/brief";
import { coachingGuard } from "../lib/guard";
import { checkSafety } from "../lib/safety";
import { peatySession } from "../lib/session-state";

export default defineTool({
  description:
    "Save the one-screen onboarding brief: primary goal, optional markers, hard constraints, do-not-do. Safety-gate is always ON; this tool cannot turn it off.",
  inputSchema: z.object({
    primaryGoal: z.string().min(1),
    markers: z.array(z.string()),
    hardConstraints: z.array(z.string()),
    doNotDo: z.array(z.string()),
  }),
  label: {
    start: () => "Save onboarding brief",
  },
  async execute({ primaryGoal, markers, hardConstraints, doNotDo }) {
    const inbound = coachingGuard();
    if (!inbound.ok) {
      return {
        saved: false as const,
        safetyGate: true as const,
        ...inbound.safety,
      };
    }

    const protocolHit = checkSafety(
      [primaryGoal, ...markers, ...hardConstraints, ...doNotDo].join("\n"),
    );
    if (protocolHit.verdict === "block") {
      return {
        saved: false as const,
        safetyGate: true as const,
        ...protocolHit,
      };
    }

    const brief = lockBrief({
      primaryGoal,
      markers,
      hardConstraints,
      doNotDo,
    });

    peatySession.update((current) => ({
      ...current,
      brief,
    }));

    return {
      saved: true as const,
      safetyGate: true as const,
      screen: brief.screen,
      constraintCount: brief.hardConstraints.length,
      reminder:
        "Safety-gate is ON and cannot be turned off. Dairy or fruit refusals are hard constraints, not Peat defaults. No DIY T3, aspirin protocols, hormones, or BPC.",
    };
  },
});
