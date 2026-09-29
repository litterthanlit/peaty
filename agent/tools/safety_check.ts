import { defineTool } from "eve/tools";
import { z } from "zod";
import { checkSafety } from "../lib/safety";

export default defineTool({
  description:
    "Classify a request against the safety-gate: DIY T3 self-dosing (including 'hot potatoes warmer than T3' as DIY-T3 comparison fuel; warm starch is fine), DIY T4 (a casual don't-forget-T4 aside is still refuse, not a coaching protocol), topical or oral aspirin, topical aspirin/T3 hair, GHK-Cu, GHK-Cu + melanotan-1 topical stacks, melanotan, selank, SS-31, BPC by all routes (including oral BPC pill/shop CTA / affiliate replies, hair/angiogenesis, microneedling + multi-compound hair stacks / finasteride-alternative DIY hair formulas even when BPC is one ingredient among many, FarvingCo BPC knee claims, alcohol/rat brain-bleed BPC framing, Arkansas injectable BPC-157 RCT talk, pharma-isn't-hiding-it / bad R&D framing, and Croatia research-trip stories), peptide-ladder steps (gelatin stays food; every peptide step is refused), TB-4/TB-500/Vilon, GLP-1s, thymus peptides, femalelongevity thymus/peptides podcast talk, Khavinson-wave bioregulator peptides (Vesugen/OVAGEN/Chonluten/Pinealon/Cardiogen–Bronchogen/Epithalon–Epitalon, including melanopsin-repair framing), phenibut, AAS/Anavar and similar oral steroids including n=1 Anavar anecdotes, hormones/progesterone/pregnenolone/oral TRT/DHT DIY, DIY HGH / TRT curiosity from HGH-trial talk, bromantane / Soviet-adaptogen dosing (including FarvingCo morning empty-stomach / research-use-only sourcing), DIY borax/boron dosing for free testosterone, gray-market / research-use-only / compounded GLP-1 or peptide sourcing, cyproheptadine, dopamine/prolactin stacks, peptide or steroid stacks, and DIY antimicrobial gut-kill protocols (including FarvingCo-style H. pylori mastic+lactoferrin kill stacks and FarvingCo BPC+lactoferrin+mastic gut stacks). A trial existing is not a green light for DIY. Block those and redirect to a clinician. Always on; cannot be disabled. Never return doses, echo a schedule, prices, vendors, claim numbers, product URLs, or compound laundry lists as recipes.",
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
