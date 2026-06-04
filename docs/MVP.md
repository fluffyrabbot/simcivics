# MVP: Single-Issue Dialectic Loop

This MVP implements Phase 1 from [ARCHITECTURE.md](../ARCHITECTURE.md): a
single-issue dialectic loop that can be used seriously on one civic topic.

The MVP should prove that a structured dialectic substrate can produce a better
public reasoning artifact than a feed, thread, or debate room. It should not
attempt to become a general social platform.

## Goal

Build one complete Issue workspace where participants can:

- inspect a live issue map
- create or fork structured Positions
- steelman opposing Positions and receive opponent endorsement
- identify load-bearing Cruxes
- attach Evidence to Claims
- revise Positions with public reasons
- run a bounded DialecticSession
- export a readable Synthesis or briefing artifact

The MVP succeeds if a non-participant can read the exported artifact and gain a
clearer model of the issue than they would get from a conventional comment
thread.

## Non-Goals

Do not build:

- infinite feed
- follower graph
- global karma
- quote-post mechanics
- subreddit-style community hierarchy
- trending topics
- public like counts as primary visibility
- real-time chat as the core interaction model
- generalized debate tournament features
- heavyweight clustering
- full simulation attachment
- broad multi-issue governance

These may become future concerns, but they are not needed to prove the core
thesis.

## First Issue

Start with one bounded, concrete civic issue.

Preferred issue qualities:

- local or state-level
- policy-specific
- evidence-accessible
- emotionally meaningful but not maximally inflammatory
- capable of producing several serious Positions
- small enough to synthesize in one readable artifact

Good early domains:

- housing permitting
- public transit frequency
- school phone policy
- library hours
- street safety redesign
- parking minimums
- local budget allocation

Avoid presidential politics, national identity disputes, foreign policy, and
high-abstraction culture war topics in the first MVP.

## Core Objects

The MVP should use the architecture's canonical concepts.

### Issue

Root container for the civic question.

Minimum fields:

- title
- scope
- domain tags
- decision context
- affected parties
- value conflicts
- status

### Position

Structured stance on the Issue.

Minimum sections:

- core claims
- assumptions
- evidence
- strongest objection or steelman
- response
- cruxes
- uncertainties
- what would change my mind
- revision history

Positions should be forkable and versioned from the beginning.

### Claim

Atomic proposition inside a Position.

Initial claim types:

- empirical
- predictive
- value
- definitional
- causal model

### Evidence

Source material attached to a Claim or Position.

Minimum fields:

- citation or URI
- summary
- relevance note
- limitation note
- source date
- quality note

### Crux

A load-bearing disagreement.

Minimum fields:

- statement
- type: factual, model, or value
- linked Positions
- why it would move at least one participant
- status

### DialecticSession

Structured interaction between two or more Positions.

Required phases:

1. Mutual presentation.
2. Cross-steelman.
3. Steelman endorsement or correction.
4. Crux identification.
5. Focused response with evidence, clarification, or revision.
6. Synthesis attempt or explicit disagreement map update.

### Synthesis

Exportable artifact produced from the Issue map.

Minimum sections:

- issue summary
- major Positions
- strongest arguments by Position
- steelmans and endorsement state
- live Cruxes
- best Evidence
- unresolved factual disputes
- unresolved value conflicts
- possible policy packages
- known implementation risks
- areas of agreement
- areas of principled disagreement

## Required Flows

### Seed Issue

Create one Issue with 3-4 serious seeded Positions. Each Position should have
enough structure to demonstrate the model without needing a large early user
base.

### Create Or Fork Position

A participant can create a new Position or fork an existing one.

Forking should preserve provenance and make the diff meaningful:

- claim added
- claim removed
- assumption changed
- evidence added
- confidence revised
- crux added
- synthesis relation added

### Cross-Steelman

A participant writes a strongest-objection or opposing-position summary.

The represented participant can:

- endorse it as fair
- propose edits
- reject it with a reason

Opponent-endorsed charity is a core status signal and should be visible on the
Position.

### Identify Crux

Participants can mark a Crux as load-bearing by saying what would move them.

The MVP only needs lightweight support:

- "this would move me"
- "this would not move me"
- "this is value-based, not evidence-settleable"

### Attach Evidence

Evidence attachment should require a relevance note and limitation note. The UI
should make dropping a naked link feel incomplete.

### Revise Position

Participants can revise their own Positions. Revisions should preserve history
and require a short reason.

Revision should be framed as civic progress, not loss.

### Run DialecticSession

The core ritual should be usable end to end for at least two Positions:

1. Select Positions.
2. Present current claims.
3. Exchange steelmans.
4. Endorse or correct steelmans.
5. Mark 1-3 Cruxes.
6. Add evidence, assumptions, or revisions.
7. Produce a session artifact.
8. Feed updates back into the Issue map.

### Export Synthesis

Generate a readable artifact from accepted graph nodes and session outputs.

The export can be Markdown or static HTML for the MVP. It must be legible
outside the app.

## Interface

The first screen should be the Issue workspace, not a marketing page.

Required views:

- LiveMap
- Positions
- Claims and Evidence
- Cruxes
- DialecticSessions
- Synthesis

Recommended default landing:

1. Issue summary.
2. Current LiveMap.
3. Unresolved Cruxes.
4. Next useful actions.

Do not prioritize chronological posting.

## AI Assistance

AI can help with structure, but must not become the author or sovereign judge.

Initial AI assistance:

- suggest whether a contribution is a Claim, Evidence item, Crux, Position
  revision, or Synthesis edit
- detect possible duplicate Claims
- ask clarifying questions for vague Claims
- draft a possible steelman for human editing
- draft Synthesis text from accepted graph nodes

Avoid:

- automated truth scoring
- hidden reputation scoring
- engagement optimization
- fully automated synthesis publication
- partisan persuasion suggestions

All AI outputs should be inspectable, editable, and attributable as assistance.

## Quality Signals

The MVP should implement lightweight quality review without collapsing it into
karma.

Initial dimensions:

- charity
- rigor
- relevance
- evidence fit
- crux value
- update quality
- synthesis usefulness

Use these signals for local routing and artifact quality, not public status
games.

## Data Model Sketch

Initial tables or collections:

- issues
- issue_versions
- positions
- position_versions
- claims
- evidence_items
- cruxes
- dialectic_sessions
- steelman_reviews
- endorsements
- revisions
- syntheses
- synthesis_exports
- ai_interventions

All contribution-like records should include:

- id
- issue_id
- author_id
- body or structured payload
- status
- created_at
- updated_at
- version_id where applicable
- superseded_by_id where applicable
- provenance links where applicable

## Build Order

1. Static Issue workspace with seeded Positions.
2. Core TypeScript domain types.
3. LiveMap tree or card hierarchy.
4. Position create/fork flow.
5. Claim and Evidence editing.
6. Cross-steelman and endorsement flow.
7. Crux identification.
8. Position revision history.
9. DialecticSession ritual.
10. Synthesis generation and export.
11. Lightweight quality review.
12. AI-assisted classification, clarification, and draft steelmans.

## Readiness Bar

The MVP is ready for a first serious cohort when:

- the seeded Issue has 3-4 serious Positions
- participants can fork and revise Positions
- steelmans can be endorsed or corrected
- Cruxes are visible and linked to Positions
- Evidence has relevance and limitation notes
- a DialecticSession can produce an artifact
- a Synthesis can be exported outside the app
- no global feed, karma, likes, or follower graph drive visibility

The MVP is not ready merely because users can post and reply. Posting and
replying are not the thesis.
