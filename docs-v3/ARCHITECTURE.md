# Architecture (v3)

> Downstream of `docs-v3/THESIS.md`; read against it. Provenance for every fork
> decision is in `SYNTHESIS-NOTES.md`. Where this set differs from the two source
> sets, it is on purpose, and the reason is recorded.

## Design principles (reconciled, non-negotiable)

1. **The shared claim graph is the substrate; everything else is a projection.**
   The only durable, collectively-owned object is the graph of typed nodes and
   edges for an issue. A "Position" is a *named lens* over that graph, not a
   rival-owned document. (Resolves Fork #1: keeps Set A's useful Position concept
   while structurally preventing Set A's own stated failure mode — accumulated
   parallel monologues.)

2. **Status comes only from the other side of the table or from resolution.**
   Cross-partisan endorsement, calibration against real outcomes, cross-cluster
   synthesis adoption, and documented mind-changes are the *only* status-bearing
   signals. Same-cluster popularity routes attention but never confers standing.
   (Resolves Fork #4.)

3. **Understanding is gated before rebuttal (ITT gate).** No node may `challenge`
   another until its author has produced an accepted restatement of the target.

4. **Crux-finding is the core ritual, via double-crux.** The system's central
   interaction is mutual location of the belief whose flip flips the conclusion.

5. **Structure is enforced at contribution time.** Required fields do the work that
   heavy moderation does elsewhere.

6. **Anti-herding by default.** Surface what bridges or usefully distinguishes
   clusters (Polis spirit); hide raw vote totals during active deliberation.

7. **Simulation is the resolution mechanism for model-type cruxes.** Where a
   disagreement is about a model of the world, make the model runnable, inspectable,
   and comparable across positions — and later scoreable against real data.
   (Resolves Fork #3: keep Set A's best bet, but scoped, not ambient.)

8. **Forkable but accumulative.** Anyone can fork a map; "live" status is *earned*
   via cross-cluster support, never granted by fiat. History is preserved.

9. **Speed is the enemy; outputs must escape the system.**

## Core domain model

A directed graph of typed nodes and edges, event-sourced (a commit graph with rich
metadata), so history, forking, and "what changed between map v3 and v7" are
tractable. Naming unifies the two source sets: the root object is **`Question`**
(Set B) carrying **`scope` and `valueConflicts`** (Set A).

### Nodes

- **`Question`** — the root civic object. Fields: `title`, `jurisdiction`, `scope`
  (municipal / county / state / federal / cross), `policyArea`, `decisionContext`,
  `affectedParties`, `constraints`, `valueConflicts` (explicit competing goods),
  `glossary`, `status` (framing / active / synthesizing / stable / archived).
  Narrow enough to deliberate, broad enough to matter. **Framing is contestable**:
  the question text is itself a versioned node that cohorts can propose amendments
  to (addresses the "framing is power" fragility).

- **`Claim`** — atomic, typed proposition. Types: `descriptive`, `causal`,
  `predictive`, `normative`, `policy`. Carries structured `confidence` (intervals
  preferred for anything quantitative). Compound claims are detected and the author
  is prompted to split them.

- **`Reason`** — connects a claim to evidence, an assumption, a value, or a policy
  effect (from Set B; richer than folding everything into a Position).

- **`Evidence`** — source material with `source`, `date`, `jurisdictionalRelevance`,
  `methodology`, `evidentiaryType`, `qualityTier`, `limitations`, `claimRelation`.
  A bare link is **not** evidence until its relevance and limitations are explicit.

- **`Assumption`** — an unstated premise required by a claim, reason, or policy
  proposal. High-value: most disagreements hide here.

- **`Counterclaim` / `Challenge`** — contests a target, tagged with a challenge
  type: `factual`, `causal`, `scope`, `value`, `implementation`, `tradeoff`,
  `unintended_consequence` (Set B's taxonomy). **Gated by the ITT restatement.**

- **`Crux`** — a point that, if resolved differently, would materially move a
  participant. Type: `factual` (data settles it), `model` (parameters/form settle
  it → routes to simulation), `value` (weighting settles it → the irreducible-crux
  success path). Status: `open` / `partially_addressed` / `resolved_by_evidence` /
  `resolved_by_double_crux` / `agree_to_disagree` / `moot`.

- **`ValueTradeoff`** — competing civic goods made explicit (liberty vs. safety,
  speed vs. due process, fiscal restraint vs. service quality). A first-class node
  (Set B), *not* treated as a factual error.

- **`Revision`** — a meaningful update to a claim, confidence, evidence reading, or
  synthesis, with its reason. Framed as progress; feeds the mind-change status
  signal.

- **`Synthesis`** — a structured artifact summarizing the best current state.
  *Does not require consensus.* Produces: consensus points, strongest argument per
  position, unresolved empirical disputes, unresolved value tradeoffs, live cruxes,
  policy options, implementation risks, decision-relevant uncertainties.

- **`Position` (projection, not a stored rival)** — a saved lens: a named bundle of
  stances over claims plus their cross-links and endorsed steelmans. Computed from
  the graph and the user's `agree/disagree/crux` markers; useful for "compare A and
  B side by side," but it owns nothing the graph does not.

- **`Simulation`** — executable or parameterizable model attached to a `model`-type
  crux. Documents which assumptions come from which position. A run is a
  **reproducible, citable artifact** ("under these assumptions, 5-year units: median
  12k, 5–95% 8k–19k"). Later real data scores past runs — calibration applies to
  modelers too. Start as client-side parameter calculators with documented formulas;
  escalate to Pyodide / sandboxed execution only when needed.

- **`User` / Identity** — pseudonymous by default, **but unique** (proof-of-
  personhood / sybil resistance), because the cross-partisan currency is only sound
  if it cannot be self-dealt. Optional verified layer for high-stakes,
  testimony-linked work.

### Edges

`Claim` `supported_by`/`challenged_by` `Evidence`; `Reason` `connects` `Claim` to
`Evidence`/`Assumption`/`Value`; `Challenge` `targets` `Claim` (ITT-gated);
`Position` `identifies` `Crux`; `Crux` `matters_to` positions; `Simulation`
`instantiates` assumptions and `supports_or_contradicts` a `Claim`; `User`
`authors` nodes and `receives_endorsement`; `Synthesis` `integrates` claims.

## Incentive architecture (the load-bearing part)

This is where platforms die. The mechanisms below all enforce **design law #2**:
the only things that move standing are cross-partisan or outcome-resolved.

- **The ITT gate.** Before submitting a `Challenge`, the author writes a restatement
  of the target. The target's author (or an opposing-cluster reviewer, or
  provisionally a classifier) marks it *fair / edit / misses the point*. Only a fair
  restatement unlocks the rebuttal. An endorsed restatement is itself a high-value,
  cross-partisan charity signal on the author's record.

- **Double-crux sessions.** When two cohorts deadlock on a claim, the system opens a
  guided session: each side states the belief whose flip would flip their
  conclusion; overlap is surfaced; work concentrates there. Output is a resolved
  crux, a `model`-crux routed to simulation, or a clean `value` crux (a success).

- **Calibration dashboard.** Every empirical/predictive claim can later receive a
  *resolution event* (data release, agreed outcome, model scoring). Authors and
  attachers are scored (Brier / interval coverage). This is the closest thing to
  skin in the game for facts.

- **Cross-cluster adoption attribution.** When a later synthesis or LiveMap merges a
  prior contribution, provenance is recorded. Standing accrues to contributions
  adopted *across* initial clusters, not within one.

- **Mind-change ledger.** Documented revisions are surfaced on the profile as the
  primary positive marker. "Updates given / received" is the headline stat; follower
  count does not exist.

- **Effort gate to publish on a hot question.** A top-level contribution requires
  either completing one double-crux session with an opposing view, *or* having an
  opposing-cluster-endorsed steelman of the top opposing positions. A toll that
  raises the floor without requiring agreement.

- **Attention budget.** A small number of serious-contribution slots per period;
  extra contributions are deprioritized in review queues. Fights volume gaming.

- **No early virality.** New contributions enter review/sampling queues for relevant
  clusters (Polis-style random-then-algorithmic), never an instant global megaphone.

**Anti-gaming note.** Every signal above is chosen because it is *expensive to
manufacture*: opponent endorsement can't be self-awarded, calibration can't be faked
against real data, cross-cluster adoption can't be farmed within a tribe. This
defense holds *only* with unique identities — hence sybil resistance is load-bearing,
not optional.

## Workspace flow (macro structure) with sessions nested (micro)

The `Workspace` for a question progresses through stages (Set B); the double-crux
`Session` (Set A, sharpened) is invoked *within* a stage whenever two cohorts hit a
live crux.

1. **Question framing** → bounded question, glossary, scope, constraints. *Framing
   itself is contestable here.*
2. **Claim mapping** → claim graph, preliminary clusters, duplicate merges.
3. **Evidence mapping** → evidence ledger, unsupported-claim list, contested
   evidence.
4. **Crux discovery** → live crux list, split into factual / model / value.
   *Double-crux sessions open here.*
5. **Tradeoff analysis** → value-tradeoff matrix, affected-party impact table.
6. **Option generation** → policy packages (not slogans) with requirements,
   benefits, risks, monitoring metrics.
7. **Stress test** → failure modes, second-order effects, mitigations under adverse
   assumptions.
8. **Public artifact** → the exportable map: disagreement map, best arguments,
   evidence ledger, unresolved cruxes, value tradeoffs, policy options, synthesis.

## Cohorts, clustering, and the two-population reach model

- **Cohorts** — small, mixed-prior groups do the structured work *without a live
  gallery and without visible vote totals* (design law #6). Cohorts produce draft
  maps.
- **Clustering** — Polis-style algorithms run across cohorts to label opinion
  groups and surface bridging vs. distinguishing contributions, and to promote draft
  maps toward LiveMap status by *cross-cluster* support.
- **Reader layer** — the published LiveMap, syntheses, crux lists, and tradeoff
  matrices are the high-reach, low-effort surface most people consume. Few produce;
  many read. This is the scale story.

## Visibility model

Default surfaces route attention to **unresolved work**, never to engagement:
unsupported claims, contested evidence, live cruxes, high-downstream-impact
assumptions, draft syntheses needing fairness review, policy options needing stress
tests. Public visibility favors structured artifacts over raw argument streams.

## AI facilitation (facilitator, never sovereign)

**Appropriate:** suggest contribution type; detect duplicate claims; flag
unsupported claims; ask clarifying questions; summarize positions; *propose* (never
impose) steelmen and cruxes; flag likely ad hominem or topic drift; separate factual
from value disputes; draft synthesis candidates; provisionally adjudicate ITT-gate
restatements when no human reviewer is available.

**Inappropriate:** final truth adjudication; policy-legitimacy judgment; opaque
reputation scoring; partisan persuasion optimization; engagement-maximizing ranking.

All AI interventions are **logged, inspectable, and contestable**. Generative text is
never the default contribution.

## Moderation (three axes) and governance

Moderation separates three things that are usually conflated (Set B):

- **Conduct** — harassment, threats, doxxing, spam, impersonation.
- **Epistemic quality** — unsupported claims, misleading evidence, bad-faith
  repetition, refusal to engage the target node, synthetic source laundering.
- **Civic relevance** — jurisdiction mismatch, duplicate questions, scope drift.

A contribution can be civil-but-low-quality, rude-but-relevant, or relevant-but-out-
of-scope; the axes are handled independently.

**Governance layer (Set A's gardeners, on top):** for LiveMap status, a small set of
high-standing, *cross-cluster* maintainers (gardeners) hold elevated propose/merge
rights. They are visible, replaceable, and never gods — any captured map can be
forked against. For high-stakes disputes about map status, convene a sortition or
standing-weighted panel drawn from multiple clusters.

## Auditability

Civic artifacts are public-interest records. Preserve: contribution history,
revision history, synthesis and evidence provenance, moderation actions, AI
intervention logs, and merge decisions. Where privacy allows, public artifacts are
exportable and inspectable (briefing pages, PDF maps, structured JSON).

## Technical architecture

Aligned with what the repo already is (Astro + Svelte 5 + TypeScript):

- **Frontend** — TypeScript + Svelte for a workbench feel. Start with a structured
  card/tree map UI before any full-graph canvas.
- **State / collaboration** — local state + eventual sync for single-user/small
  cohorts; CRDTs (Yjs/Automerge) or a central authority with good conflict UX for
  multi-user editing. Fork is always an escape hatch.
- **Backend** — start simple (TS server + Postgres + event log, or Convex). Strongly
  normalized graph + blobs for large evidence. Immutable node versions and map
  snapshots are first-class.
- **Simulation** — client-side parameter calculators first; Pyodide / sandboxed
  execution later. All runs reproducible and attachable with exact params.
- **Identity** — pseudonymous + unique (passkey / proof-of-personhood) from the
  start, because the incentive system depends on sybil resistance.
- **Scale expectation** — orders of magnitude less concurrent activity than social
  media. Optimize for depth and data integrity, not throughput. Not real-time chat.

## Risks and counters

- **Goodhart / gaming.** Keep signals multi-dimensional and favor hard-to-fake ones
  (opponent endorsement, resolution accuracy, cross-cluster adoption); make forking
  cheap so captured maps are abandoned; require unique identity.
- **Cold start / quality cliff.** Seed deliberately with high-integrity participants
  and strong pre-written examples on *both* sides; invite-only early questions;
  explicit norms in onboarding.
- **Complexity tax.** Structured input is harder than tweeting. Counter with
  excellent defaults, progressive disclosure, clearly-labeled AI drafting, and
  templates per civic-issue type.
- **Faction capture.** Clustering + cross-endorsement makes one-sided maps visibly
  one-sided; standing requires cross-cluster work; gardeners are drawn from multiple
  clusters.
- **Time cost vs. real life.** Scope tightly; make outputs valuable enough to be
  worth the hours; support partial and asynchronous participation; lean on the
  reader layer so most people never pay the contributor cost.
- **Epistemic overclaim.** The system improves the *process and artifacts* of
  reasoning; it does not produce "the truth." Surface remaining uncertainty, value
  pluralism, and model limits. Success is *better disagreement*, not false
  consensus.

## Open questions (to resolve in design and use)

- How public should individual calibration be? (Full public creates new status
  games; fully private weakens accountability.)
- Exact tuning of attention budgets and gates (too strict kills participation; too
  loose reintroduces volume).
- How reliable can a classifier-provisional ITT gate be before a human confirms?
- When, if ever, should a LiveMap or synthesis carry any *formal* institutional
  weight, or is its power always informal and epistemic?
- How is question-framing contestation kept from becoming its own meta-rhetoric
  battlefield?
