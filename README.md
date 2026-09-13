# Peaty

Ray Peat / pro-metabolic coaching agent on [eve](https://eve.dev). Raise the burn — warmth, lymph/minerals, dairy+fruit sugars, low PUFA, optional temp/pulse. Not a crash diet. Not a clinic. Not a supplement store.

## Six skills (locked)

| Skill | Job |
| --- | --- |
| `onboarding` | Four beats (goal, optional markers, hard constraints, do-not-do) → one-screen brief. Safety-gate ON by default. |
| `metabolism-function` | Metabolic function, not a cut. |
| `fluid-lymph` | Salt, minerals, lymph/fluid movement. |
| `food-check` | Score meals. Dairy/fruit refusals are **hard constraints**, not Peat defaults. |
| `source-digest` | Week recap from logs, or a pasted Peat source → practical move. |
| `safety-gate` | Refuse DIY T3 / aspirin protocols / hormones / BPC; send that to a clinician. |

No seventh skill lane. No payments.

## Run

Requires **Node.js 24**.

```bash
npm install
npm exec -- eve dev
```

`eve dev` opens the TUI. HTTP is the built-in eve channel (`/eve/v1`).

```bash
npm exec -- eve info    # must list the six skills
npm exec -- eve build
npm run typecheck
```

Set `AI_GATEWAY_API_KEY`, or link a Vercel project so `VERCEL_OIDC_TOKEN` can reach the gateway.

## Layout

```
agent/
  agent.ts
  instructions.md
  channels/eve.ts
  skills/           # the six above
  tools/            # food_check, log_metrics, summarize_week, save_brief, safety_check
  lib/
```

## Deploy

```bash
npm exec -- eve deploy
```

Production-only. Use `eve dev` while building.
