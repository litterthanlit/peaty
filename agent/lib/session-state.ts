import { defineState } from "eve/context";
import type { SafetyCheck } from "./safety";

export type OnboardingBrief = {
  primaryGoal: string;
  markers: string[];
  hardConstraints: string[];
  doNotDo: string[];
  /** Always true. Stored for display; runtime ignores any attempt to set false. */
  safetyGate: true;
  screen: string;
};

export type MetricEntry = {
  recordedAt: number;
  wakingTempF?: number;
  pulseBpm?: number;
  notes?: string;
};

export type PeatySession = {
  brief: OnboardingBrief | null;
  metrics: MetricEntry[];
  lastNextAction: string | null;
  inboundSafety: SafetyCheck | null;
  /** True after this HTTP session loaded a brief from Blob. */
  continuityRestored: boolean;
  /** True after this session already injected MORNING RETURN LOOP. */
  morningReturnIssued: boolean;
};

export const peatySession = defineState(
  "peaty.session",
  (): PeatySession => ({
    brief: null,
    metrics: [],
    lastNextAction: null,
    inboundSafety: null,
    continuityRestored: false,
    morningReturnIssued: false,
  }),
);
