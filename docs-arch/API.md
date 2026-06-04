# API Surface (command / query contract)

> **Status:** the contract layer between intents and the event log. Downstream of
> `docs-arch/PERSISTENCE.md` (the storage model) and `docs-v3/ARCHITECTURE.md` (the
> domain). Normative content is **transport- and language-agnostic** — it defines
> *what* the surface is, not *how* it is wired. An implementation mapping (Rust +
> HTTP + Postgres) is at the end, informative only.
>
> The job of this document: make the write-side invariants from `PERSISTENCE.md`
> (the ITT gate, sybil-unique cross-partisan signals, optimistic concurrency,
> append-only history) into an explicit, testable contract — so they live in one
> named place instead of being re-derived per feature.

## Shape: CQRS over an event log

The surface is split, because reads and writes have opposite shapes:

- **Commands** are *intents* ("raise this challenge"). A command is validated
  against the domain invariants; on success it **appends one or more events** to a
  Question stream; on failure it returns a **typed, actionable error** and writes
  nothing. Commands never return projection data beyond the events they produced.
- **Queries** read **projections** (`PERSISTENCE.md` read models). They are
  side-effect-free, may lag the log (eventual consistency), and never enforce
  invariants — invariants live only on the write side.

This separation is the point: **every state change is a validated command that emits
immutable events.** There is no other way to mutate anything. A reviewer of this
file can enumerate the complete set of things that can happen to the system by
reading the command catalog.

## Command envelope

Every command shares one envelope. Fields below are illustrative names.

| field | meaning |
|---|---|
| `command` | the command type (catalog below) |
| `actor` | authenticated identity issuing the intent |
| `authority` | the explicit capability being exercised (see *Authority*) — never ambient |
| `stream_id` | target aggregate, almost always `question_id` |
| `expected_seq` | the stream sequence the actor believes is current (optimistic concurrency) |
| `idempotency_key` | client-generated; a retry with the same key returns the original result, never a duplicate event |
| `cohort_id` | deliberation context, when applicable |
| `payload` | command-specific body |

**Response** is one of:

- `Accepted { events: [EventRef], new_seq }` — the events appended, in order.
- `Rejected { error: TypedError, ... }` — see *Error taxonomy*. Nothing was written.

Commands are the *only* writers. Projections are rebuilt from the resulting events
asynchronously; a command does not block on projection updates.

## Invariants enforced at the command boundary (the contract)

These are checked on **every** relevant command, before any event is appended.
They are the reason the API exists as a gate rather than a thin CRUD wrapper.

1. **ITT gate.** `RaiseChallenge` is rejected unless a prior
   `steelman_verdict{fair}` exists from the same `actor` against the same target.
2. **Sybil-unique signals.** `Endorse` and calibration-bearing actions count at most
   one per **unique person** (proof-of-personhood attestation); duplicates rejected.
3. **Cross-partisan-at-time.** When an endorsement's status value depends on crossing
   clusters, cluster membership is evaluated at the command's `occurred_at` and
   frozen into the event — it cannot be re-gamed by later cluster drift.
4. **Optimistic concurrency.** If `expected_seq` ≠ the stream's current seq, reject
   with `StreamSeqConflict` (client refetches or forks).
5. **Compound-claim split.** `AddClaim`/`ReviseClaim` carrying multiple propositions
   is rejected with `CompoundClaimMustSplit` and the suggested decomposition.
6. **Evidence is not citation.** `AttachEvidence` without explicit `relevance` and
   `limitations` is rejected.
7. **Effort gate.** A top-level contribution on a flagged high-traffic Question
   requires a satisfied effort precondition (a completed double-crux *or* an
   opposing-cluster-endorsed steelman); otherwise `EffortGateNotMet`.
8. **Authority is explicit.** The `authority` must actually grant the action for this
   `stream_id`/`cohort_id`; otherwise `NotAuthorized`. No command relies on ambient
   permission.
9. **Append-only.** No command edits or deletes a fact. "Undo" is a compensating
   command emitting a new event (e.g. `RetractEdge`, `ApplyRedaction`).

## Command catalog

Each entry: **Command** → events emitted · key preconditions/errors.

### Question lifecycle
- **FrameQuestion** → `question_framed` · facilitator authority.
- **ReframeQuestion** → `question_reframed` · framing is contestable; records prior
  text. Open question (below) on who may.
- **AddConstraint / UpdateGlossary / ChangeStatus** → respective events.

### Graph construction
- **AddClaim** → `claim_added` · typed; `CompoundClaimMustSplit` if multi-proposition.
- **ReviseClaim** → `claim_revised` (new immutable version, `parent_version_id`).
- **SplitClaim** → `claim_split` (+ child `claim_added` events).
- **AddReason** → `reason_added`.
- **AttachEvidence** → `evidence_attached` · requires `relevance` + `limitations`.
- **RateEvidence** → `evidence_rated` (does it actually support its use?).
- **IdentifyAssumption** → `assumption_identified`.
- **NameValueTradeoff** → `valuetradeoff_named` (a first-class node, not an error).
- **AddEdge / RetractEdge** → `edge_added` / `edge_retracted`.

### Dialectic core (load-bearing)
- **SubmitSteelmanRestatement** → `steelman_restatement_submitted` · the actor's
  restatement of a target position.
- **RenderSteelmanVerdict** → `steelman_verdict{fair|edit|misses}` · **only a holder
  of the target view may render it** (or a flagged AI-provisional verdict, overridable).
- **RaiseChallenge** → `challenge_raised` · **ITT-gated** (invariant #1); tagged with
  a challenge type (`factual`/`causal`/`scope`/`value`/`implementation`/`tradeoff`/
  `unintended_consequence`).
- **ProposeCrux** → `crux_proposed` · typed `factual`/`model`/`value`.
- **OpenDoubleCruxSession** → `doublecrux_session_opened`.
- **DeclareFlipBelief** → `crux_flipbelief_declared` · each side's "if this flipped,
  my conclusion flips."
- **ResolveCrux** → `crux_resolved{by_evidence|by_double_crux|agree_to_disagree|moot}`
  · `agree_to_disagree` on a `value` crux is a **success terminal state**.
- **CommitRevision** → `revision_committed` · a documented mind-change; feeds the
  mind-change ledger and `update_quality`.

### Outcome / skin-in-the-game
- **RecordResolution** → `resolution_event` · later, valid-time-stamped; only on
  `empirical`/`predictive` claims; drives calibration for authors *and* endorsers.

### Signals (typed; never generic likes)
- **Endorse** → `endorsement{kind}` · sybil-unique (#2), cross-partisan frozen (#3).
- **CastVote** → `vote` · **clustering input only**; no projection turns this into
  status.

### Synthesis & promotion
- **DraftSynthesis** → `synthesis_drafted` (from accepted graph nodes).
- **RateSynthesisFairness** → `synthesis_fairness_rated` · **reviewer must be from an
  opposing cluster** to the position being rated.
- **ForkMap** → `map_forked` (cheap; shares history to fork point).
- **MergeMap** → `map_merged` (records parents + conflict resolution + per-contribution
  provenance → feeds cross-cluster adoption attribution).
- **PromoteLiveMap** → `livemap_promoted` · driven by the cross-cluster-support
  projection, not fiat; gardener authority to ratify.

### Governance & safety
- **TakeModerationAction** → `moderation_action{axis: conduct|epistemic|civic_relevance}`
  · the three axes are independent.
- **AssignGardener / RevokeGardener** → respective events · gardeners are visible,
  replaceable, drawn cross-cluster.
- **ApplyRedaction** → `redaction_applied` · hides content in projections; the event
  and hash chain remain intact.

### AI (facilitator, never sovereign — see *AI path*)
- **RequestAiIntervention** → `ai_intervention` · returns suggestions; mutates nothing
  in the domain graph.

## Query catalog

All read projections; all side-effect-free.

- **GetQuestion / ListQuestions** — with scope/jurisdiction/status filters.
- **GetMap(ref)** — current `node_current` + `edges_current` for a ref (`live`,
  a cohort draft, a fork).
- **GetMapAtTime(ref, t)** — bitemporal: the map as it stood at valid-time `t`.
- **GetNode(node_id) / GetNodeHistory(node_id)** — current version / full version chain.
- **GetWorkQueue(question_id)** — unresolved claims, live cruxes, contested evidence,
  syntheses needing fairness review. The attention-routing surface.
- **GetCruxList / GetEvidenceLedger** — per Question.
- **GetSynthesis(id) / ListSyntheses** — with fairness ratings by cluster.
- **GetPosition(user_id, question_id)** — the **projected lens** (owns nothing the
  graph does not).
- **GetClusters(question_id)** — opinion groups + bridging/distinguishing nodes.
- **GetReputation(user_id) / GetCalibration(user_id)** — multi-dimensional; *publicness
  is an open policy question* (see below). Never a single karma number.
- **GetMindChangeLedger(user_id)** — documented revisions; the headline positive
  surface.
- **ListEndorsements(target)** — with cross-partisan tagging.
- **GetAuditTrail(stream_id)** — the append-only event stream with full provenance
  (actor, times, AI references, moderation/redaction markers).
- **ExportArtifact(ref, format)** — materialized LiveMap as briefing / JSON / PDF;
  static and cacheable (the ~free high-reach surface).

## Error taxonomy (typed, actionable)

Errors are first-class and tell the caller exactly what to do next — not strings.

- **Invariant** — `IttGateNotSatisfied`, `RestatementNotEndorsed`,
  `CompoundClaimMustSplit{suggested_split}`, `EvidenceMissingRelevanceOrLimitations`,
  `EffortGateNotMet{remaining_requirement}`, `CruxTypeMismatch`.
- **Concurrency** — `StreamSeqConflict{current_seq}` (refetch or fork).
- **Authority** — `NotAuthorized{required_capability}`, `CohortMembershipRequired`,
  `GardenerRightsRequired`, `OpposingClusterReviewerRequired`,
  `OnlyTargetHolderMayVerdict`.
- **Identity** — `PersonhoodUnverified`, `DuplicatePersonEndorsement`.
- **State** — `NodeNotFound`, `NodeVersionStale`, `CruxAlreadyResolved`,
  `RefNotFound`.
- **Idempotency** — a replayed `idempotency_key` returns the **original** `Accepted`
  result; never a second event.

## Authority model (least authority, explicit)

No ambient permission. A command carries the specific capability it exercises, scoped
to a Question and/or cohort. Roles grant capabilities:

- **participant** — contribute nodes, endorse, restate, challenge (gated), revise.
- **facilitator** — frame/reframe Question, structure cohorts, draft synthesis.
- **reviewer** — rate synthesis fairness (*must be opposing-cluster for the rated
  position*), render steelman verdicts (*must hold the target view*).
- **gardener** — propose/ratify LiveMap promotion and merges; visible, replaceable,
  cross-cluster.

Authority is passed, not assumed; a confused-deputy path (one component acting on
another's behalf with borrowed authority) must not exist — every command's authority
is the *issuing actor's own*.

## AI path (logged, inspectable, contestable)

AI **never mutates the domain graph directly.** `RequestAiIntervention` returns
suggestions and emits an `ai_intervention` event (the inspectable record). To act on
a suggestion, a human issues the corresponding domain command, which references the
`ai_intervention_id` for provenance. The one allowed AI write into a gated flow is a
**provisional** steelman verdict when no human holder is available — it is flagged as
provisional and any holder of the view can override it with a real
`RenderSteelmanVerdict`. Prohibited entirely: truth adjudication, reputation scoring,
engagement ranking.

## Versioning & evolution

The command/query surface is versioned independently of the event payloads. New
commands and new optional fields are additive; **existing command semantics are never
silently repurposed** (same discipline as event schema evolution in `PERSISTENCE.md`).
Removing or changing a command's meaning is a breaking version bump. Old clients must
keep working against a running server for the project's lifetime, or be explicitly
deprecated with notice.

## Implementation mapping (chosen stack — informative, not normative)

- **Transport:** HTTP/JSON is the default external transport; the command/query split
  is the real contract, so an in-process or message-bus transport is equally valid.
- **Rust fit:** commands and events model naturally as enums; the dispatcher is an
  exhaustive `match`, so a new command or event cannot be added without the compiler
  forcing every handler and projection to account for it — the write-side invariants
  become compile-time-total, not convention. Typed errors are a `Result<_, Error>`
  enum; `sqlx` compile-checks the append/projection queries against the schema.
- **Postgres fit:** a command handler validates, then appends within a single
  transaction asserting `(stream_id, expected_seq)`; the unique `(stream_id, seq)`
  constraint enforces optimistic concurrency at the database level (a losing
  concurrent writer fails the insert → `StreamSeqConflict`).
- **Idempotency:** `idempotency_key` unique per actor; a replay returns the stored
  result row.
- **Reads:** queries hit projection tables/materialized views only; `ExportArtifact`
  serves pre-materialized static files.

## Open questions (API-specific)

- **Publicness of reputation/calibration:** which `GetReputation`/`GetCalibration`
  fields are public, cohort-visible, or private? (Full public spawns new status
  games; fully private weakens accountability.)
- **Who may `ReframeQuestion`,** and how is framing-contestation kept from becoming
  its own meta-rhetoric battle? (Mirrors the architecture's framing-power fragility.)
- **Provisional-AI-verdict trust:** how long may a provisional ITT verdict stand
  before a human holder must confirm it for a challenge to keep its standing?
- **Batch/transactional commands:** do any flows need multiple events appended
  atomically as one command (e.g. `SplitClaim`), and where is that boundary drawn?
- **Read-your-writes:** do clients need a synchronous projection of their own just-
  appended event, or is "events returned in `Accepted`" enough UI feedback?
