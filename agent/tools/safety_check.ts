import { defineTool } from "eve/tools";
import { z } from "zod";
import { checkSafety } from "../lib/safety";

export default defineTool({
  description:
    "Classify a request against the safety-gate: DIY T3/T4/NDT, aspirin, cyproheptadine, progesterone/hormones, BPC/TB-4/TB-500/GHK-Cu/Vilon, AAS/Anavar and similar oral steroids, peptide or steroid stacks, bromantane, and dopamine/prolactin stacks. Block those and redirect to a clinician. Always on; cannot be disabled. Never return doses.",
  inputSchema: z.object({
    request: z.string().min(1).describe("The user ask to classify."),
  }),
  label: {
    start: () => "Safety-gate check",
  },
  async execute({ request }) {
    return { ...checkSafety(request), safetyGate: true as const };
  },
});
