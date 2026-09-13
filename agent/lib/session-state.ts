import { defineState } from "eve/context";

export type OnboardingBrief = {
  primaryGoal: string;
  markers: string[];
  hardConstraints: string[];
  doNotDo: string[];
  safetyGate: boolean;
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
};

export const peatySession = defineState(
  "peaty.session",
  (): PeatySession => ({
    brief: null,
    metrics: [],
  }),
);

export function emptyBrief(): OnboardingBrief {
  return {
    primaryGoal: "",
    markers: [],
    hardConstraints: [],
    doNotDo: [],
    safetyGate: true,
    screen: "",
  };
}
