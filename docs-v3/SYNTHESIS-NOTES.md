# Synthesis Notes (v3 provenance)

This directory (`docs-v3/`) is an **independent third set** of design documents,
produced by reading the two existing sets in full and reconciling them with an
outside design view. The two source sets are left unedited on purpose; this file
records exactly what was taken from where and which forks were decided, so the
snapshot stays auditable.

## The two source sets

**Set A — repository root.** `/THESIS.md`, `/ARCHITECTURE.md`, `src/lib/domain.ts`,
`src/pages/index.astro`, `src/components/DialecticSessionWorkbench.astro`.
The *Positions & Simulation* lineage.

- Primary unit: **`Position`** — a versioned, author-owned structured stance
  (core claims, explicit assumptions, an `anticipatedObjections` steelman field
  with an `endorsedByOpponents` flag, attached models).
- Distinctive bets: **opponent-endorsed steelman as currency**; **simulation /
  runnable models as first-class**; a rich multi-dimensional **`Reputation`**
  object; **Map Gardeners**; calibration leaderboards; **`DialecticSession`** as a
  phased ritual (presentation → cross-steelman → crux → focused work → synthesis).
- Thesis stance: incentive-first — *make dialectic the locally rational strategy
  for anyone seeking durable status or influence inside the system.*
- Has working code and a live toy Issue (Midtown zoning).
- Frames simcivics as downstream of a sibling project, `votepolitics`.

**Set B — `docs/`.** `docs/THESIS.md`, `docs/ARCHITECTURE.md`, `docs/MVP.md`.
The *Workspace & Process* lineage.

- Primary unit: a **typed contribution to a shared claim graph**. There is no
  `Position` object; positions are emergent clusters.
- Distinctive bets: the **`Workspace`** as a bounded deliberation environment with
  an **8-stage flow** (framing → claim mapping → evidence → crux discovery →
  tradeoff → option generation → stress test → public artifact); a richer
  contribution taxonomy (`Reason`, `Counterclaim` with seven challenge types,
  `ValueTradeoff` and `Assumption` as their own objects); **cohorts** of mixed
  priors; a clean **three-axis moderation** split (conduct / epistemic / civic
  relevance); explicit **AI facilitation** boundaries.
- Thesis stance: status games are the enemy — scores are **contribution-scoped**
  and used only for routing and artifact quality, *never* for public status.
- Has a concrete MVP build order.

## What both sets already agree on (the robust core — carried forward verbatim in spirit)

1. The persistent product is a **map / artifact**, not a feed or thread.
2. **No** global karma, follower counts, public like totals, or engagement ranking.
3. Contributions are **typed and structured at input time**, not free text.
4. **Steelman / charity**: represent opponents so they recognize themselves.
5. **Crux** is a central object (both definitions are nearly identical).
6. Separate **empirical / value / assumption**; value tradeoffs get explicit
   representation and are not treated as factual errors.
7. **Revision is productive labor**, to be rewarded, not reputational defeat.
8. **Synthesis ≠ consensus**; outputs include principled disagreement.
9. **AI facilitates, never adjudicates** truth or legitimacy.
10. **Start small / local / specific**; prove the substrate before scale.
11. Route attention to **unresolved work**, not to what provokes reaction.
12. Artifacts are **public-interest records** with provenance and history.

## The forks, and the decision taken in v3

| # | Fork | Set A | Set B | v3 decision |
|---|------|-------|-------|-------------|
| 1 | Primary unit | `Position` (rival, author-owned) | shared claim graph (commons) | **The claim graph is the substrate (B). `Position` survives as a *projection / lens* over the graph, not as a rival-owned object.** This directly answers A's own stated failure condition ("higher-quality parallel monologues = failure"): you cannot accumulate dueling monologues if the only durable object is the shared graph. |
| 2 | Interaction structure | `DialecticSession` ritual | 8-stage `Workspace` flow | **Compose at different scopes.** The Workspace progresses through stages (B) as the macro structure; the Session (A, sharpened into double-crux) is the *micro ritual* invoked when two cohorts hit a live crux. |
| 3 | Simulation | first-class | absent | **Keep, but scope it.** A's best distinctive bet; B is poorer without it. In v3, simulation is the **resolution mechanism for `model`-type cruxes specifically**, not a general feature. |
| 4 | Status / reputation | engineer rich status | scores must never be status | **Reconciled by the cross-partisan law (the core of this synthesis).** Scores exist and route attention (B). A *small* set of signals is status-bearing — but **only** signals that are cross-partisan or outcome-resolved and therefore hard to fake: calibration on resolved claims, opponent-endorsed steelmans, cross-cluster synthesis adoption, documented mind-changes. **No popularity is ever status.** This satisfies A's "status must be engineered" and B's "popularity is poison" simultaneously. |
| 5 | Contribution taxonomy | folded into `Position` | rich verb set + `ValueTradeoff` | **Take B's richer taxonomy and `ValueTradeoff` object.** |
| 6 | Group model | Polis-style clustering at open scale | small mixed-prior cohorts | **Compose.** Cohorts build structure semi-privately (no gallery); clustering bridges across cohorts and promotes to the LiveMap. |
| 7 | Moderation | structure + gardeners + jury | three-axis split | **Take B's three-axis split, add A's gardeners as a governance layer on top.** |
| 8 | AI | optional assistance + cautions | explicit appropriate/inappropriate lists | **Take B's explicit boundaries.** |

## What the outside view adds (not fully present in either set)

- **Name the adversary precisely: the spectating co-partisan audience ("the
  gallery").** Both sets fight "engagement"; neither names the *mechanism*. Almost
  every rule below derives from removing the gallery during reasoning and
  publishing only the artifact.
- **ITT gate before rebuttal.** A has opponent-endorsed steelmans; B has a steelman
  contribution type. Neither makes passing an Ideological Turing Test a *gate on the
  right to rebut*. v3 does.
- **Double-crux as the explicit generative mechanic** — not merely "identify
  cruxes" but the guided mutual procedure to find the belief whose flip flips the
  conclusion. Sharpens A's `DialecticSession`.
- **Mind-change as the highest-status act**, displayed as an achievement. Both
  value revision; neither makes it status. Reconciled with B via fork #4 (it is a
  hard-to-fake, personally-attributed signal).
- **The irreducible value crux is a *success state*, not a failure.** Both gesture
  at "agree to disagree"; v3 elevates "we located exactly why we disagree, and it
  is a value, not a fact" to a first-class output.
- **The two-population reach model**: a small rigorous *contributor* layer
  producing artifacts consumed by a large *reader* layer. This is how a
  rigor-demanding tool reaches civic scale.
- **Honest fragility section** in the thesis: the binding constraint may be
  adoption / political economy rather than substrate; dialectic surfaces but cannot
  dissolve value/interest conflicts; rigor self-selects the already-good-faith; and
  framing power is itself contestable.

## Deliberately deferred / rejected for v3

- **Prediction-market mechanics** beyond scoped calibration — kept as a non-goal
  (both sets agree).
- **Global graph UI** — start hierarchical/card-based (A's own Phase 0 instinct).
- **Real-name identity as default** — pseudonymous with uniqueness (sybil
  resistance) is enough until cross-partisan currency needs hardening.
- **`votepolitics` coupling** — acknowledged in the thesis but v3 does not depend on
  it; simcivics must stand alone.
