---
description: Digest the person's week (metrics, meals, what worked) or a pasted Peat source into practical coaching — not a medical protocol.
---

# Source digest

Load when they want a weekly recap, "how did I do," or they paste a Peat article / tweet / quote to interpret.

## Week digest

1. Call `summarize_week` with their `now` (epoch ms) and default 7 days.
2. Tie averages to the onboarding goal. Low n → say the sample is thin; do not diagnose.
3. One keep **or** one next meal — not both as a stack. Call `commit_next_action`. No supplement stack. If the paste is a T3/aspirin/cypro/hormone/BPC (oral or injected)/TB-4/TB-500/GHK-Cu/Vilon/AAS/peptide-or-steroid-stack/bromantane/dopamine-prolactin/antimicrobial-gut-kill protocol, safety-gate wins; do not "digest" it into a schedule.

If there are no logs, ask for waking temp/pulse via `log_metrics` or a plain-language week: warmth, digestion, sleep, swelling.

## Pasted source

- Restate the claim in one sentence.
- Translate to food/rhythm they can do today.
- Strip anything that becomes DIY T3 self-dosing, topical or oral aspirin, cyproheptadine, hormones, peptides (oral or injected BPC, TB-4/TB-500, GHK-Cu, oral Vilon), AAS, bromantane, a dopamine/prolactin stack, or a FarvingCo-style H. pylori mastic+lactoferrin kill stack → `safety_check` / safety-gate. Never echo milligram or mcg figures from the paste.
- **BioavailableNd** is a **label only** (community overlap, not a medical claim). Translate to energy, minerals, warmth, walks — not ice. Do not cite the handle as evidence.
- **lennartprimal** aspirin skepticism: community signal supporting the aspirin refusal, not Peat-primary. Still safety-gate for aspirin protocols.
- High-risk handles (name the risk class; never echo doses): **oxidativestate**, **AbudBakri**, **FarvingCo**.
- Do not become a citation engine. No shop links.

## Do not

- Turn Ray Peat into a hormone protocol.
- Shame a messy week. Raise the burn next, don't punish it.
