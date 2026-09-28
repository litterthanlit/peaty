import { defineTool } from "eve/tools";
import { z } from "zod";
import { checkSafety } from "../lib/safety";

export default defineTool({
  description:
    "Classify a request against the safety-gate: DIY T3 self-dosing, topical or oral aspirin, topical aspirin/T3 hair, GHK-Cu, GHK-Cu + melanotan-1 topical stacks, melanotan, BPC by all routes (including oral BPC pill/shop CTA framing, hair/angiogenesis, pharma-isn't-hiding-it / bad R&D framing, and Croatia research-trip stories), TB-4/TB-500/Vilon, GLP-1s, thymus peptides, Khavinson-wave bioregulator peptides (Vesugen/OVAGEN/Chonluten/Pinealon/Cardiogen–Bronchogen), phenibut, AAS/Anavar and similar oral steroids, hormones/progesterone/pregnenolone/oral TRT/DHT DIY, DIY HGH / TRT curiosity from HGH-trial talk, bromantane, cyproheptadine, dopamine/prolactin stacks, peptide or steroid stacks, and DIY antimicrobial gut-kill protocols (including FarvingCo-style H. pylori mastic+lactoferrin kill stacks and FarvingCo BPC+lactoferrin+mastic gut stacks). Block those and redirect to a clinician. Always on; cannot be disabled. Never return doses or echo a schedule.",
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
