import { defineTool } from "eve/tools";
import { z } from "zod";
import { coachingGuard } from "../lib/guard";
import { checkSafety } from "../lib/safety";
import { peatySession } from "../lib/session-state";

export default defineTool({
  description:
    "Commit this session's single next action so a morning return can continue from it. Overwrites any previous next action.",
  inputSchema: z.object({
    nextAction: z
      .string()
      .min(1)
      .describe("The one highest-leverage next action named this turn."),
  }),
  label: {
    start: () => "Commit next action",
  },
  async execute({ nextAction }) {
    const inbound = coachingGuard();
    if (!inbound.ok) {
      return {
        committed: false as const,
        ...inbound.safety,
      };
    }

    const protocolHit = checkSafety(nextAction);
    if (protocolHit.verdict === "block") {
      return {
        committed: false as const,
        ...protocolHit,
      };
    }

    const trimmed = nextAction.trim();
    peatySession.update((current) => ({
      ...current,
      lastNextAction: trimmed,
    }));

    return {
      committed: true as const,
      nextAction: trimmed,
      safetyGate: true as const,
    };
  },
});
