import { defineTool } from "eve/tools";
import { z } from "zod";
import { coachingGuard } from "../lib/guard";
import { peatySession } from "../lib/session-state";

const DAY_MS = 24 * 60 * 60 * 1000;

export default defineTool({
  description:
    "Summarize logged waking temp/pulse for a window of days so source-digest can write the week.",
  inputSchema: z.object({
    now: z
      .number()
      .int()
      .positive()
      .describe("Unix epoch milliseconds for the end of the window."),
    days: z.optional(z.number().int().min(1).max(31)).describe("Window length. Default 7."),
  }),
  label: {
    start: () => "Summarize week",
  },
  async execute({ now, days }) {
    const inbound = coachingGuard();
    if (!inbound.ok) {
      return {
        days: days ?? 7,
        entries: 0,
        avgWakingTempF: null,
        avgPulseBpm: null,
        last: null,
        primaryGoal: null,
        safetyGate: true as const,
        note: inbound.safety.redirect,
        ...inbound.safety,
      };
    }

    const windowDays = days ?? 7;
    const start = now - windowDays * DAY_MS;
    const { brief, metrics } = peatySession.get();
    const window = metrics.filter((entry) => entry.recordedAt >= start && entry.recordedAt <= now);
    const temps = window
      .map((entry) => entry.wakingTempF)
      .filter((value): value is number => value !== undefined);
    const pulses = window
      .map((entry) => entry.pulseBpm)
      .filter((value): value is number => value !== undefined);

    const avg = (values: number[]): number | null => {
      if (values.length === 0) {
        return null;
      }
      return Math.round((values.reduce((sum, value) => sum + value, 0) / values.length) * 10) / 10;
    };

    return {
      days: windowDays,
      entries: window.length,
      avgWakingTempF: avg(temps),
      avgPulseBpm: avg(pulses),
      last: window[window.length - 1] ?? null,
      primaryGoal: brief?.primaryGoal ?? null,
      safetyGate: true as const,
      note:
        window.length === 0
          ? "No metrics in this window. Log waking temp/pulse before asking for a week digest."
          : "Trend only. Do not turn averages into a diagnosis or a hormone protocol.",
    };
  },
});
