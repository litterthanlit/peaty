---
description: Run first-session onboarding — four beats then a one-screen brief with safety-gate ON. No off switch.
---

# Onboarding

Use this when there is no saved brief (this HTTP session *and* Blob). If a brief already exists — including one restored from Blob on a brand-new session — do **not** re-run these four beats. That is morning return.

## Four beats (one at a time)

Ask, wait, then move. Do not dump a form.

1. **Primary goal** — What they want the burn to do (warmth, energy, digestion, cycle comfort, dropping the crash-diet loop). Not a target weight unless they insist, and even then reframe as function.
2. **Optional markers** — Waking temp, pulse, sleep, swelling, appetite. They may skip. Do not invent a lab panel.
3. **Hard constraints** — Allergies, religions, foods they will not eat. If they refuse **dairy** or **fruit**, record that here. Those refusals are **food-check hard constraints**, not Peat defaults.
4. **Do-not-do** — Approaches they already know fail (fasting, seed-oil "heart healthy," stimulant stacks, etc.).

## One-screen brief

After beat 4, call `save_brief` with those four fields. The tool writes the canonical screen:

- Goal
- Markers (or "none chosen")
- Hard constraints (explicitly flags dairy/fruit if present)
- Do-not-do
- **Safety-gate: ON**

There is no parameter to turn the gate off. If they ask to disable it, say it stays on, finish the brief, and keep coaching food and rhythm.

Then name **one** first next action, call `commit_next_action`, and stop. Do not load a meal plan.
