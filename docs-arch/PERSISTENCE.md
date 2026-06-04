# Persistence Substrate (architecture decision)

> **Status:** load-bearing design, intended to be settled *before* the backend
> language is committed to. The normative content here is **language-agnostic** —
> it constrains the data model, not the implementation. A short implementation
> mapping at the end notes the chosen stack (Rust + Postgres) without coupling the
> design to it.
>
> Downstream of `docs-v3/THESIS.md` and `docs-v3/ARCHITECTURE.md`. Where those say
> "event-sourced or commit-graph structure," "immutable Position versions," "full
> history / versions as first-class," and "civic artifacts as public-interest
> records" — this document makes that concrete.

## Why persistence is the decision that matters most

simcivics is, underneath the UI and the incentives, a **data-integrity system**.
Its entire product promise is that the civic record — claims, evidence, who
conceded what to whom, which prediction resolved which way — is *trustworthy,
attributable, and tamper-evident over years*. If the persistence substrate is
wrong, no frontend or incentive design can recover it. So this is settled first,
and the language is chosen to serve it (not the reverse).

## Principles (non-negotiable)

1. **The event log is the source of truth.** Every meaningful action is recorded as
   an immutable, append-only event. All current state — the present text of a
   claim, a user's reputation, opinion clusters, the LiveMap — is a **projection**
   derived from the log and rebuildable from it. Nothing authoritative is stored
   only as mutable current state.

2. **Append-only; history is never mutated.** There is no `UPDATE` or `DELETE` of
   facts. A correction is a *new compensating event*, not an edit. "What did this
   claim say on 2026-03-01, and who had endorsed it then?" must always be
   answerable. This directly serves the architecture's "preserve contribution
   history, revision history, provenance, moderation actions, AI logs, merge
   decisions."

3. **Tamper-evident.** Events are content-addressed and hash-chained per stream, so
   the record is verifiable and silent corruption is detectable. A civic record
   that cannot be quietly rewritten is a feature, not a nicety.

4. **Bitemporal.** Every fact tracks two times: **valid time** (when the thing was
   true / asserted / resolved in the world) and **transaction time** (when we
   recorded it). Calibration depends on this — a predictive claim is asserted now
   and *resolves* months later — and so does "show me the map as it stood at time
   T."

5. **Provenance is first-class, on every event.** Actor, timestamp(s), the cohort
   context, and any AI-intervention reference are recorded inline. There is no
   anonymous state change.

6. **The Question is the aggregate / consistency boundary.** All nodes, edges,
   sessions, and endorsements for one civic Question form **one ordered event
   stream** with a monotonic sequence number. This gives per-Question ordering and
   optimistic concurrency without global locking. Cross-Question concerns (a user's
   identity, global reputation) are separate streams, reconciled eventually. (This
   is the Helland "autonomous entity / bounded context" stance: each Question owns
   its own consistency.)

7. **Derived signals are never authoritative.** Reputation, clusters, calibration,
   and the LiveMap are projections. In particular, **raw popularity is never stored
   as a ranking signal** — votes are recorded as events for clustering input, but no
   projection turns same-cluster popularity into status (enforcing thesis law #2).

## The core shape

```
                 ┌─────────────────────────────┐
   commands ───▶ │  write side (validation)    │  enforces invariants:
   (intents)     │  - ITT gate before challenge │  ITT gate, optimistic seq,
                 │  - optimistic concurrency    │  sybil-unique endorsers
                 └──────────────┬──────────────┘
                                │ append (immutable, hash-chained)
                                ▼
                 ┌─────────────────────────────┐
                 │  EVENT LOG  (source of truth)│  per-Question streams,
                 │  append-only, bitemporal     │  content-addressed
                 └──────────────┬──────────────┘
                                │ project (rebuildable)
                 ┌──────────────┴───────────────────────────────┐
                 ▼              ▼              ▼                  ▼
           node_current    reputation     clusters          live_map
           edges_current   calibration    work_queue        positions (lens)
```

## Event log (logical schema)

One logical table; portable to any relational store. Field names are illustrative.

| field | meaning |
|---|---|
| `event_id` | globally unique, **monotonic, sortable** (ULID/UUIDv7) |
| `stream_id` | the aggregate, almost always `question_id` |
| `seq` | per-stream sequence; `(stream_id, seq)` is unique (ordering + optimistic concurrency) |
| `type` | event type (catalog below) |
| `actor_id` | the user who caused it (or `system` / `ai:<intervention_id>`) |
| `payload` | structured, self-describing, **schema-versioned** event body |
| `payload_schema_version` | integer; old versions must remain readable forever |
| `occurred_at` | **valid time** |
| `recorded_at` | **transaction time** |
| `cohort_id` | deliberation context, if any |
| `ai_intervention_id` | FK to the AI-intervention log, if AI was involved |
| `prev_hash` | hash of the previous event in this stream |
| `content_hash` | hash of this event's canonical bytes (tamper-evidence) |
| `signature` | optional actor/server signature over `content_hash` |

Invariant: events are **immutable and append-only**. The only "deletion" is a
`*_redacted` event whose projection hides content while the hash chain stays intact
(see *Integrity & redaction*).

## Node & edge versioning (the commit graph)

Nodes (Claim, Evidence, Assumption, Crux, ValueTradeoff, Synthesis, Simulation,
Question itself) are **identity-stable, version-immutable**:

- `node_id` — stable identity across the node's whole life.
- each change emits a `*_revised` event creating a new logical **version** that
  references `parent_version_id`. Current state of a node on a given branch = its
  latest version reachable from that branch's ref.

**Branching / forking / merging** follows a git-like model, because the
architecture explicitly wants "fork is always an option" and soft, earned "live"
status:

- a **ref** is a named pointer to a version-set (e.g. `live`, `cohort-7-draft`,
  `fork:alice`).
- a **fork** is a new ref sharing history up to the fork point — cheap, so captured
  maps can be abandoned.
- a **merge** is a recorded `map_merged` event citing the two parents and the
  resolution of any conflicts; provenance of which contribution came from which fork
  is preserved (this is what feeds *cross-cluster adoption attribution*).
- `live` / LiveMap status is just a ref that the promotion projection moves based on
  cross-cluster support — never platform fiat.

## Event catalog (by concern)

**Question lifecycle:** `question_framed`, `question_reframed` (framing is
contestable), `constraint_added`, `glossary_updated`, `status_changed`.

**Graph construction:** `claim_added` / `claim_revised` / `claim_split`,
`reason_added`, `evidence_attached` (with relevance + limitations), `evidence_rated`,
`assumption_identified`, `valuetradeoff_named`, `edge_added` / `edge_retracted`.

**Dialectic core (the load-bearing signals):**
- `steelman_restatement_submitted` → `steelman_verdict` (`fair` / `edit` /
  `misses`). A **`fair` verdict is the precondition** for the next one.
- `challenge_raised` — *write-side rejects this unless a `fair` restatement by the
  same actor against the same target exists.* (ITT gate, enforced as an invariant.)
- `crux_proposed`, `doublecrux_session_opened`, `crux_flipbelief_declared`,
  `crux_resolved` (`by_evidence` / `by_double_crux` / `agree_to_disagree` /`moot`).
  `agree_to_disagree` on a `value` crux is a **success** terminal state, recorded as
  such.
- `revision_committed` — a documented mind-change; feeds the mind-change ledger.

**Outcome / skin-in-the-game:** `resolution_event` — a later, valid-time-stamped
record that an empirical/predictive claim resolved a particular way (data release,
agreed outcome, model score). Drives calibration for both claim authors and
endorsers.

**Signals (typed, never generic likes):** `endorsement` with a typed kind
(`fair_steelman_of_my_side`, `evidence_supports_claim`, `crux_is_load_bearing`,
`would_adopt_synthesis`, `prediction_resolved_as_expected`). Plain `vote` events may
exist *only* as clustering input.

**Synthesis & promotion:** `synthesis_drafted`, `synthesis_fairness_rated` (by
opposing-cluster reviewers), `map_forked`, `map_merged`, `livemap_promoted`.

**Governance / safety:** `moderation_action` (tagged `conduct` / `epistemic` /
`civic_relevance` — the three independent axes), `gardener_assigned` /
`gardener_revoked`, `redaction_applied`.

**AI:** `ai_intervention` (every suggestion/classification/provisional-ITT-judgment
the system makes — logged, inspectable, contestable; referenced by `ai_intervention_id`
on any event it influenced).

## Derived read models (projections — all rebuildable)

- **`node_current` / `edges_current`** — current version of each node/edge per ref.
- **`reputation`** — per user, multi-dimensional (`calibration`, `charity`,
  `update_quality`, `synthesis_influence`, `rigor`), **derived purely from
  endorsement + resolution + revision events**. Stored as a projection so it can be
  recomputed if the scoring rules change; per-domain to avoid halo effects.
- **`calibration`** — Brier / interval-coverage scores from `claim` × `resolution_event`.
- **`clusters`** — Polis-style opinion groups recomputed periodically from `vote` /
  `endorsement` events; also tags each endorsement with whether it was
  **cross-cluster at the time it was made** (the basis of "hard-to-fake" status).
- **`work_queue`** — unresolved claims needing evidence, live cruxes, contested
  evidence, draft syntheses needing fairness review. The attention-routing surface.
- **`live_map` snapshots** — materialized exportable artifacts (briefing/JSON/PDF).
- **`positions`** — the **projection** that reconstructs a "Position" lens for a user
  over the graph. Position is *computed here*, owning nothing the graph does not.

## Cross-cutting enforcement

- **Sybil resistance is load-bearing.** The cross-partisan currency is only sound if
  endorsements come from distinct persons. Store a **proof-of-personhood
  attestation** (not PII) per identity; `endorsement` and calibration projections
  count at most one per unique person. Handles stay pseudonymous.
- **ITT gate** is a *write-side invariant*, not a UI nicety: `challenge_raised` is
  rejected at command validation without a prior `fair` restatement.
- **Cross-partisan computation** uses cluster membership *as of the endorsement's
  `occurred_at`*, not current membership — so it can't be retroactively gamed by
  cluster drift.
- **Optimistic concurrency:** commands carry an `expected_seq` for the stream;
  conflicting concurrent writes are rejected and retried (or forked).

## Integrity, redaction, and the right-to-be-forgotten tension

Public-interest preservation collides with privacy/redaction. Resolution:

- The hash chain and append-only log are never broken.
- A `redaction_applied` event marks specific content for omission; **projections
  exclude the redacted payload** while the event (and its hash) remain, so chain
  integrity and "something was here, redacted on date D by actor A for reason R"
  survive.
- PII is minimized at the source (pseudonymity + attestations, not identities), so
  most redaction is content moderation, not identity erasure.

## Schema evolution (this data outlives every code version)

Old events must be readable **forever**. Therefore:

- event payloads are **self-describing and `payload_schema_version`-tagged**;
- fields are **never repurposed**; new meaning = new field or new event type;
- reading old versions goes through **upcasters** (pure functions old→current) at
  projection time, never by rewriting stored events.

This is the wire-protocol-evolution discipline applied to our own history: new code
must read old data, and old data is permanent.

## Concurrency & consistency summary

- Strong consistency *within* a Question stream (single ordered log, optimistic seq).
- Eventual consistency *across* streams and into projections (rebuildable, lagging
  read models are acceptable; the log is the truth).
- This matches the thesis's deliberately low write-concurrency, "speed is the enemy"
  workload — no need for distributed consensus machinery.

## Implementation mapping (chosen stack — informative, not normative)

The design above is portable. As decided, the implementation target is **Rust +
PostgreSQL**:

- **Postgres is the event store**: an append-only `events` table (JSONB or typed
  payloads), `(stream_id, seq)` unique, projections as ordinary tables / materialized
  views, `LISTEN`/`NOTIFY` or logical decoding to drive projection updates. Boring,
  durable, self-hostable for ~free, decades-stable — the right "serious persistence
  substrate."
- **Avoid** dedicated event-store databases (EventStoreDB et al.): they add an ops
  burden that fights the low-maintenance, donated-infra goal. Postgres-as-event-store
  is the low-ops choice.
- **Early-phase option:** SQLite + Litestream (single file + continuous backup) is a
  legitimate ultra-low-ops start; migrate to Postgres when multi-writer concurrency
  actually arrives. The logical model is identical.
- **Why this domain rewards Rust here specifically:** the event types, verdict and
  crux-resolution state machines, and typed endorsements map cleanly onto Rust sum
  types + exhaustive `match`; compile-time-checked queries (e.g. `sqlx`) catch
  schema/code drift in the agent's edit loop rather than at runtime — exactly the
  data-integrity surface where silent errors are most costly.
- **Reader layer stays static/cacheable** (LiveMap snapshots are materialized
  artifacts), so the high-reach surface costs ~nothing regardless of backend.

## Open questions (persistence-specific)

- **Hashing/anchoring strength:** is a per-stream hash chain enough, or do we
  periodically anchor a stream digest somewhere external for stronger non-repudiation?
- **Projection rebuild cost** at scale: full replay vs. snapshotting cadence for
  large Questions.
- **Proof-of-personhood mechanism** (which attestation, what privacy cost) — chosen
  later, but the schema reserves the seam now.
- **Cross-Question identity/reputation reconciliation:** how eventual is acceptable
  before a user's calibration is "trustworthy enough" to gate high-visibility actions?
- **Redaction vs. calibration:** if a resolved prediction is later redacted, how is
  the already-scored calibration handled without rewriting history?
