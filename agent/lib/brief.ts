import type { OnboardingBrief } from "./session-state";

export type BriefInput = {
  primaryGoal: string;
  markers: string[];
  hardConstraints: string[];
  doNotDo: string[];
};

function cleanList(items: string[]): string[] {
  return items.map((item) => item.trim()).filter((item) => item.length > 0);
}

function listLine(items: string[], empty: string): string {
  return items.length > 0 ? items.join("; ") : empty;
}

function dairyFruitFlags(constraints: string[]): string[] {
  return constraints.filter((constraint) =>
    /\b(dairy|milk|cheese|yogurt|lactose|fruit)\b/i.test(constraint),
  );
}

/** Canonical one-screen brief. Safety-gate is always ON in the stored screen. */
export function formatOneScreenBrief(input: BriefInput): string {
  const markers = cleanList(input.markers);
  const hardConstraints = cleanList(input.hardConstraints);
  const doNotDo = cleanList(input.doNotDo);
  const flagged = dairyFruitFlags(hardConstraints);
  const constraintNote =
    flagged.length > 0
      ? ` (dairy/fruit refusals are food-check hard constraints, not Peat defaults: ${flagged.join("; ")})`
      : "";

  return [
    "Peaty brief",
    `Goal: ${input.primaryGoal.trim()}`,
    `Markers: ${listLine(markers, "none chosen")}`,
    `Hard constraints: ${listLine(hardConstraints, "none listed")}${constraintNote}`,
    `Do-not-do: ${listLine(doNotDo, "none listed")}`,
    "Safety-gate: ON",
  ].join("\n");
}

/**
 * Lock the first-session brief. `safetyGate` is always true — callers cannot
 * pass false, and this function does not accept an off switch.
 */
export function lockBrief(input: BriefInput): OnboardingBrief {
  const markers = cleanList(input.markers);
  const hardConstraints = cleanList(input.hardConstraints);
  const doNotDo = cleanList(input.doNotDo);
  const primaryGoal = input.primaryGoal.trim();

  return {
    primaryGoal,
    markers,
    hardConstraints,
    doNotDo,
    safetyGate: true,
    screen: formatOneScreenBrief({
      primaryGoal,
      markers,
      hardConstraints,
      doNotDo,
    }),
  };
}
