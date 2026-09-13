import { peatySession } from "./session-state";
import type { SafetyCheck } from "./safety";

export type CoachingGuard =
  | { ok: true }
  | { ok: false; safety: SafetyCheck };

/** Tools refuse when this turn's inbound message was safety-blocked. */
export function coachingGuard(): CoachingGuard {
  const { inboundSafety } = peatySession.get();
  if (inboundSafety?.verdict === "block") {
    return { ok: false, safety: inboundSafety };
  }
  return { ok: true };
}
