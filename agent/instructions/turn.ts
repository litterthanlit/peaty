import { defineDynamic, defineInstructions } from "eve/instructions";
import { hydrateSessionContinuity } from "../lib/continuity";
import { buildTurnLock } from "../lib/turn-lock";
import { extractLastUserText } from "../lib/user-text";
import { peatySession } from "../lib/session-state";

export default defineDynamic({
  events: {
    "turn.started": async (_event, ctx) => {
      await hydrateSessionContinuity(ctx);

      const inboundText = extractLastUserText(ctx.messages);
      const session = peatySession.get();
      const lock = buildTurnLock({
        inboundText,
        brief: session.brief,
        lastNextAction: session.lastNextAction,
        metricCount: session.metrics.length,
        continuityRestored: session.continuityRestored,
        morningReturnIssued: session.morningReturnIssued,
      });

      peatySession.update((current) => ({
        ...current,
        inboundSafety: lock.safety,
        morningReturnIssued:
          lock.kind === "morning-return" ? true : current.morningReturnIssued,
      }));

      return defineInstructions({
        role: "system",
        content: lock.content,
      });
    },
  },
});
