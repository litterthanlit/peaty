# Peaty

Ray Peat / pro-metabolic coaching agent on [eve](https://eve.dev). Raise the burn — warmth, lymph/minerals, dairy+fruit sugars, low PUFA, optional temp/pulse. Not a crash diet. Not a clinic. Not a supplement store.

## Six skills (locked)

| Skill | Job |
| --- | --- |
| `onboarding` | Four beats (goal, optional markers, hard constraints, do-not-do) → one-screen brief. Safety-gate ON. No off switch. |
| `metabolism-function` | Metabolic function, not a cut. Don't skip breakfast; morning digestible carbs. Dairy/fruit sugar oxidation. Cold exposure lowering thyroid output is a counter-signal on the morning temp/pulse scoreboard (drop after cold habits → stop). Abud ALAN/leptin–POMC is light color only. Natural Mg is food/mineral with mineralized fluids, not a dose. Not low-carb+ashwagandha as a gut fix. Niacinamide is an optional community food note, not a protocol. |
| `fluid-lymph` | Salt, minerals, warmth, walks, sauna-adjacent comfort. Mineralized salted water + eat-your-hydration. Beef gelatin/glycine mucus-barrier + mineralized fluids. BioavailableNd-style seasonal hydration map (summer fruit/fresh milk/mineral water; fall broths/stews/steamed/stewed fruit/cultured-brined dairy). AlenaNazarova_-style warmth map (warm meals, soups, bone broth, sauna, baths, morning sun, layers) as energy/puffiness support — not water restriction, not spa-lymph/drainage. BioavailableNd brine/salt-air is minerals+energy, not spa-lymph. Cold stresses thyroid. Not water restriction, spa detox, cold plunge, or ice biohacks. SolBrah/BioavailableNd/AlenaNazarova_ are source-digest labels only; cite Alpaca only with the carnivore flag. |
| `food-check` | Score meals. Dairy/fruit refusals are **hard constraints**, not Peat defaults. Prefer warm/room-temp fluids; glycine via gelatin/collagen/stocks/cartilage. Collagen/gelatin is Peat-aligned protein (Alpaca-cited ~15 g/day and personal 20-40 g ranges are community signal, not a prescription); dairy + fruit stay the preferred base. Milk+sugar drinks (molasses latte) are Peat-aligned. Heavy coffee (5 cups/day) is community signal, not Peat-primary — coffee with food/milk/sugar, not empty-stomach. Raw/fermented dairy gets a food-safety note (raw milk pathogen risk), not an endorsement. Whitelist Peat-style ice cream (milk/eggs/sugar/coconut, not seed-oil junk) plus pomegranate/pom juice and raw carrot. BioavailableNd-style fall stack (pom juice/tea, meat stock, warm milk+honey+glycine) when ingredients fit. Collagen/gelatin overlap OK. OJ intolerance is person/context, not "juice is poison" (not a diagnosis). SolBrah salted egg-white sugar meringue and natural/liquid Mg are optional community food notes. Fish-oil megadoses, ashwagandha, berberine/PCOS max, and processed junk are community/poor-fit, not Peat-primary. Always flag Alpaca/Saladino carnivore vs same-day dairy+fruit (including herbs-only / steak-centric and Alpaca collagen promo/affiliate/sponsor framing) even when carrots/carbs overlap. |
| `source-digest` | Week recap from logs, or a pasted Peat source → practical move. Community handles are labels, not medical claims. bromantane/FarvingCo, borax, AbudBakri Shenzhen, Julian Dorey GLP-1, yoursimmo11, AlenaNazarova_ warmth map, Alpaca collagen. Always flag Alpaca carnivore split vs same-day dairy+fruit. |
| `safety-gate` | Refuse DIY T3 self-dosing, topical or oral aspirin, topical aspirin/T3 hair, GHK-Cu, melanotan, BPC all routes (including oral BPC pill/shop CTAs, AbudBakri pharma-isn't-hiding-it / bad R&D framing, and Croatia research-trip stories), TB-4/TB-500/Vilon, GLP-1s, thymus peptides, bioregulators, phenibut, AAS/Anavar and similar oral steroids, hormones/progesterone/pregnenolone, oral TRT/DHT, DIY HGH / TRT curiosity from HGH-trial talk (Tatem), bromantane / Soviet-adaptogen dosing (FarvingCo morning empty-stomach, research-use-only sourcing), DIY borax/boron dosing for free testosterone, gray-market / research-use-only / compounded GLP-1 or peptide sourcing (AbudBakri Shenzhen cheap-peptide thread, Julian Dorey GLP-1 retweets), cypro, dopamine/prolactin stacks, peptide stacks, and FarvingCo-style H. pylori mastic+lactoferrin kill stacks; send that to a clinician. Never echo community doses, schedules, prices, or vendors (oxidativestate, AbudBakri/Julian Dorey, Tatem, FarvingCo). yoursimmo11 anti-TRT-first is community TRT-first skepticism, not a protocol. Low T, hypothyroid, and adrenal complaints are symptom patterns for a clinician, not causes to self-treat. |

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
