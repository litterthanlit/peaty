import { defineDynamic, defineInstructions } from "eve/instructions";
import { buildTurnLock } from "../lib/turn-lock";
import { extractLastUserText } from "../lib/user-text";
import { peatySession } from "../lib/session-state";

export default defineDynamic({
  events: {
    "turn.started": (_event, ctx) => {
      const inboundText = extractLastUserText(ctx.messages);
      const session = peatySession.get();
      const lock = buildTurnLock({
        inboundText,
        brief: session.brief,
        lastNextAction: session.lastNextAction,
        metricCount: session.metrics.length,
      });

      peatySession.update((current) => ({
        ...current,
        inboundSafety: lock.safety,
      }));

      return defineInstructions({
        role: "system",
        content: lock.content,
      });
    },
  },
});
