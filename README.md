# Peaty

Ray Peat / pro-metabolic coaching agent on [eve](https://eve.dev). Raise the burn — warmth, lymph/minerals, dairy+fruit sugars, low PUFA, optional temp/pulse. Not a crash diet. Not a clinic. Not a supplement store.

## Six skills (locked)

| Skill | Job |
| --- | --- |
| `onboarding` | Four beats (goal, optional markers, hard constraints, do-not-do) → one-screen brief. Safety-gate ON. No off switch. |
| `metabolism-function` | Metabolic function, not a cut. Dairy/fruit sugar oxidation. Not low-carb+ashwagandha as a gut fix. Niacinamide is an optional community food note, not a protocol. |
| `fluid-lymph` | Salt, minerals, lymph/fluid movement. Beef gelatin/glycine mucus-barrier + mineralized fluids. Not water restriction or spa detox. |
| `food-check` | Score meals. Dairy/fruit refusals are **hard constraints**, not Peat defaults. Prefer warm/room-temp fluids; glycine via gelatin/stocks/cartilage. Fish-oil megadoses, ashwagandha, berberine/PCOS max, and processed junk are community/poor-fit, not Peat-primary. Saladino/Alpaca carnivore fruit/dairy refusal diverges from Peat. |
| `source-digest` | Week recap from logs, or a pasted Peat source → practical move. |
| `safety-gate` | Refuse DIY T3/T4/NDT, aspirin protocols, cyproheptadine, hormones/pregnenolone, BPC-157, bromantane, and dopamine/prolactin stacks; send that to a clinician. Never echo community doses. |

No seventh skill lane. No payments. No store.

## Launch bar (how it is enforced)

1. **First session locks a one-screen brief** — no brief → `agent/instructions/turn.ts` injects ONBOARDING LOCK; `save_brief` writes the canonical screen via `lockBrief()` (`Safety-gate: ON`) and persists it to Blob.
2. **Safety-gate is non-skippable** — `buildTurnLock()` runs `checkSafety` on every inbound user message *before* skills load. Coaching tools refuse when this turn was blocked. `save_brief` has no `safetyGate` argument.
3. **One next action** — standing rule plus every skill; `commit_next_action` stores the single action for the next return (session + Blob).
4. **Morning return** — a brand-new HTTP session loads the locked brief + last next action from Blob and injects MORNING RETURN LOOP. The same 30-day HTTP session still works without a Blob roundtrip. Say "good morning" / "I'm back" / waking temp, or just open a new session when a brief already exists.
5. **Exactly six skills** — `npm exec -- eve info` must list only those six.
6. **typecheck / build / deploy** — `npm run typecheck`, `npm exec -- eve build`, git-connected Vercel project `peaty`.

### Blob identity (cross-session)

Continuity is keyed by Eve **`byPrincipal`** from `ctx.session.auth.current` — not the HTTP `sessionId`.

| Caller | Key | Blob? |
| --- | --- | --- |
| `localDev()` | `"local-dev"` (shared by all local TUI sessions) | Process-local store in `eve dev` |
| Vercel OIDC **user** (`external_sub`) | `JSON.stringify([principalType, authenticator, issuer, principalId])` | Private Blob object `peaty/continuity/<sha256>/MEMORY.md` |
| `anonymous` / `runtime` | `null` (Eve disables these) | No — 30-day HTTP session only |
| Production browser (`placeholderAuth`) | Request never reaches the agent | Add a real user `AuthFn` later |

Blob env (first match; OIDC store id needs no extra secret): `EVE_MEMORY_BLOB_STORE_ID`, `EVE_MEMORY_BLOB_READ_WRITE_TOKEN`, `BLOB_STORE_ID`, `BLOB_READ_WRITE_TOKEN`. Provision with `eve integration setup file-memory`, then redeploy.

## Run

Requires **Node.js 24**.

```bash
npm install
npm exec -- eve dev
```

`eve dev` opens the TUI. HTTP is the built-in eve channel (`/eve/v1`). Open a **new** session the next morning: Blob restores the brief and last next action (local-dev shares one identity). The same HTTP session still works for 30 days.

```bash
npm exec -- eve info    # must list the six skills
npm exec -- eve build
npm run typecheck
npm test
```

Set `AI_GATEWAY_API_KEY`, or link a Vercel project so `VERCEL_OIDC_TOKEN` can reach the gateway.

## Layout

```
agent/
  agent.ts
  instructions.md
  instructions/turn.ts   # always-on lock (not a seventh skill)
  channels/eve.ts
  skills/                # the six above
  tools/                 # food_check, log_metrics, summarize_week, save_brief, safety_check, commit_next_action
  lib/
```

## Deploy

Git-connected Vercel project `peaty` (team `nicks-projects-14b58bdc`). Production URL: https://peaty-eight.vercel.app

```bash
npm exec -- eve deploy
```

Production-only. Use `eve dev` while building. Gateway auth on Vercel is OIDC (`vercelOidc()` in `agent/channels/eve.ts`); no `AI_GATEWAY_API_KEY` is required on the project if OIDC is enabled.
