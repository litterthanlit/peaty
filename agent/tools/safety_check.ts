import { defineTool } from "eve/tools";
import { z } from "zod";
import { checkSafety } from "../lib/safety";

export default defineTool({
  description:
    "Classify a request against the safety-gate: DIY T3 self-dosing, topical or oral aspirin, topical aspirin/T3 hair, GHK-Cu, melanotan, BPC by all routes (including oral BPC pill/shop CTA framing, pharma-isn't-hiding-it / bad R&D framing, and Croatia research-trip stories), TB-4/TB-500/Vilon, GLP-1s, thymus peptides, Khavinson-wave bioregulators, phenibut, AAS/Anavar and similar oral steroids, hormones/progesterone/pregnenolone/oral TRT/DHT dosing, DIY HGH / TRT curiosity from HGH-trial talk, bromantane / Soviet-adaptogen dosing (including FarvingCo morning empty-stomach / research-use-only sourcing), DIY borax/boron dosing for free testosterone, gray-market / research-use-only / compounded GLP-1 or peptide sourcing, cyproheptadine, dopamine/prolactin stacks, peptide or steroid stacks, and DIY antimicrobial gut-kill protocols (including FarvingCo-style H. pylori mastic+lactoferrin kill stacks). Block those and redirect to a clinician. Always on; cannot be disabled. Never return doses, echo a schedule, prices, or vendors.",
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
