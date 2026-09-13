import { defineTool } from "eve/tools";
import { z } from "zod";
import { peatySession } from "../lib/session-state";

export default defineTool({
  description:
    "Log waking temperature and/or pulse (and an optional note) into this session's metric log.",
  inputSchema: z.object({
    recordedAt: z
      .number()
      .int()
      .positive()
      .describe("Unix epoch milliseconds supplied by the caller."),
    wakingTempF: z.optional(z.number().min(90).max(110)),
    pulseBpm: z.optional(z.number().int().min(30).max(200)),
    notes: z.optional(z.string()),
  }),
  label: {
    start: () => "Log metrics",
  },
  async execute({ recordedAt, wakingTempF, pulseBpm, notes }) {
    if (wakingTempF === undefined && pulseBpm === undefined && notes === undefined) {
      throw new Error("Provide at least one of wakingTempF, pulseBpm, or notes.");
    }

    peatySession.update((current) => ({
      ...current,
      metrics: [
        ...current.metrics,
        {
          recordedAt,
          wakingTempF,
          pulseBpm,
          notes,
        },
      ],
    }));

    const { metrics } = peatySession.get();
    const last = metrics[metrics.length - 1];
    return {
      stored: last ?? null,
      count: metrics.length,
    };
  },
});
