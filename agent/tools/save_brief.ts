import { defineTool } from "eve/tools";
import { z } from "zod";
import { lockBrief } from "../lib/brief";
import { persistSessionContinuity } from "../lib/continuity";
import { coachingGuard } from "../lib/guard";
import { checkSafety } from "../lib/safety";
import { peatySession } from "../lib/session-state";

export default defineTool({
  description:
    "Save the one-screen onboarding brief: primary goal, optional markers, hard constraints, do-not-do. Safety-gate is always ON; this tool cannot turn it off.",
  inputSchema: z.object({
    primaryGoal: z.string().min(1),
    markers: z.array(z.string()),
    hardConstraints: z.array(z.string()),
    doNotDo: z.array(z.string()),
  }),
  label: {
    start: () => "Save onboarding brief",
  },
  async execute({ primaryGoal, markers, hardConstraints, doNotDo }, ctx) {
    const inbound = coachingGuard();
    if (!inbound.ok) {
      return {
        saved: false as const,
        safetyGate: true as const,
        ...inbound.safety,
      };
    }

    const protocolHit = checkSafety(
      [primaryGoal, ...markers, ...hardConstraints, ...doNotDo].join("\n"),
    );
    if (protocolHit.verdict === "block") {
      return {
        saved: false as const,
        safetyGate: true as const,
        ...protocolHit,
      };
    }

    const brief = lockBrief({
      primaryGoal,
      markers,
      hardConstraints,
      doNotDo,
    });

    peatySession.update((current) => ({
      ...current,
      brief,
    }));

    const blob = await persistSessionContinuity(ctx);

    return {
      saved: true as const,
      safetyGate: true as const,
      screen: brief.screen,
      constraintCount: brief.hardConstraints.length,
      blobPersisted: blob.persisted,
      blobIdentity: blob.persisted ? "eve-byPrincipal" : blob.reason,
      reminder:
        "Safety-gate is ON and cannot be turned off. Dairy or fruit refusals are hard constraints, not Peat defaults. No DIY T3, topical or oral aspirin, topical aspirin/T3 hair, cyproheptadine, progesterone/pregnenolone/hormones, oral TRT/DHT, GHK-Cu, melanotan, BPC by any route (including oral pill/shop CTAs), TB-4/TB-500/Vilon, GLP-1s, thymus peptides, bioregulators, phenibut, peptide stacks, AAS/Anavar, bromantane, or antimicrobial gut-kill stacks.",
    };
  },
});
