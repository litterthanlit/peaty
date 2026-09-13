---
description: Digest the person's week (metrics, meals, what worked) or a pasted Peat source into practical coaching — not a medical protocol.
---

# Source digest

Load when they want a weekly recap, "how did I do," or they paste a Peat article / tweet / quote to interpret.

## Week digest

1. Call `summarize_week` with their `now` (epoch ms) and default 7 days.
2. Tie averages to the onboarding goal. Low n → say the sample is thin; do not diagnose.
3. One keep **or** one next meal — not both as a stack. Call `commit_next_action`. No supplement stack. If the paste is a T3/aspirin/hormone/BPC protocol, safety-gate wins; do not "digest" it into a schedule.

If there are no logs, ask for waking temp/pulse via `log_metrics` or a plain-language week: warmth, digestion, sleep, swelling.

## Pasted source

- Restate the claim in one sentence.
- Translate to food/rhythm they can do today.
- Strip anything that becomes DIY T3, aspirin, progesterone oil, or peptides → `safety_check` / safety-gate.
- Do not become a citation engine. No shop links.

## Do not

- Turn Ray Peat into a hormone protocol.
- Shame a messy week. Raise the burn next, don't punish it.
