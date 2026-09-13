import { defineTool } from "eve/tools";
import { z } from "zod";
import { persistSessionContinuity } from "../lib/continuity";
import { coachingGuard } from "../lib/guard";
import { checkSafety } from "../lib/safety";
import { peatySession } from "../lib/session-state";

export default defineTool({
  description:
    "Commit the single next action so a later session (Blob) or this session's morning return can continue from it. Overwrites any previous next action.",
  inputSchema: z.object({
    nextAction: z
      .string()
      .min(1)
      .describe("The one highest-leverage next action named this turn."),
  }),
  label: {
    start: () => "Commit next action",
  },
  async execute({ nextAction }, ctx) {
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

    const blob = await persistSessionContinuity(ctx);

    return {
      committed: true as const,
      nextAction: trimmed,
      safetyGate: true as const,
      blobPersisted: blob.persisted,
      blobIdentity: blob.persisted ? "eve-byPrincipal" : blob.reason,
    };
  },
});
