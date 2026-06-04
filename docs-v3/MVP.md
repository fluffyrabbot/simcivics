# MVP (v3)

> Downstream of `docs-v3/THESIS.md` and `docs-v3/ARCHITECTURE.md`. This MVP is
> deliberately narrower and more falsifiable than either source MVP, because the
> thesis stands or falls on **one** question.

## The one question the MVP must answer

> *Can a reward signal for dialectic be made cheaper to earn honestly than to fake?*

Everything else in the architecture is downstream of the answer. The MVP exists to
test it on a single real local issue, with the gallery removed — not to launch a
platform.

Concretely, the MVP must demonstrate that a small mixed-prior group, working through
structure, produces a **public artifact that opponents on the issue both rate as
fair**, and that the highest-status moves in the system were cross-partisan (an
endorsed steelman, a documented mind-change, a jointly-located crux) rather than
applause from one's own side.

## The kernel (build this first, before anything else)

The smallest thing that tests the thesis is **not** the full 8-stage workspace. It
is the load-bearing trio from the architecture:

1. **ITT-gated rebuttal** — you cannot challenge a claim until your restatement of
   it is marked *fair* by someone who holds it.
2. **Double-crux** — a guided flow for two participants to find the belief whose
   flip flips their conclusion.
3. **Cross-partisan delta** — a typed signal recording "the other side endorsed
   this / I changed my mind here," surfaced as the primary status marker.

If this kernel does not change behavior on one issue, no amount of additional
structure will. Build it, run it, then expand.

## MVP goal (full slice, after the kernel proves out)

One complete civic-question workspace where participants can: enter a bounded
question → add typed claims → attach evidence → challenge (ITT-gated) → identify
assumptions and cruxes → run a double-crux on a live crux → revise → generate a
public synthesis artifact. The MVP succeeds if the final artifact is more useful
than reading a raw comment thread on the same question — *as judged by opponents from
different initial clusters.*

## First question (selection criteria)

Local or state level; policy-specific; evidence-accessible; emotionally meaningful
but not maximally inflammatory; bounded enough to synthesize. Good categories:
housing permitting, transit frequency, school phone policy, street-safety redesign,
parking minimums, library hours, local budget allocation. **Avoid** presidential
politics, national identity, foreign policy, and culture-war abstractions for the
first run — they come later, after the substrate is proven. (The repo's seeded
Midtown-zoning Issue is a fine starting shape.)

## Core objects (minimum viable graph)

`Question`, `Claim`, `Evidence`, `Assumption`, `Challenge` (ITT-gated), `Crux`,
`Revision`, `Synthesis`, plus the two signal objects the kernel needs:
`SteelmanRestatement` (with a fair/edit/misses verdict) and `CruxResolution`. Every
object carries provenance and revision history from day one.

## User roles

`participant`, `facilitator`, `reviewer`. Participants contribute nodes;
facilitators structure the workspace and frame the question; reviewers (drawn from
*opposing* clusters) rate synthesis fairness and ITT restatements. No deeper
hierarchy until the loop works.

## Required flows

- **Create question** — title, jurisdiction, decision context, affected parties,
  constraints, glossary. (Framing is editable/contestable.)
- **Add claim** — typed (descriptive / causal / predictive / normative / policy);
  compound claims prompt a split.
- **Add evidence** — source, summary, relevance, limitation, confidence. The UI
  makes dropping a naked link *harder* than explaining why the source matters.
- **Challenge claim (ITT-gated)** — author writes a restatement of the target;
  someone who holds it marks it fair/edit/misses; only *fair* unlocks the challenge,
  tagged with a challenge type.
- **Identify assumption** — mark an unstated premise.
- **Propose crux** — disputed point, whose view could change, what would matter,
  expected direction of update; tagged factual / model / value.
- **Run double-crux** — two participants each name their flip-belief; overlap is
  surfaced; resolution recorded as `resolved_by_evidence`, `agree_to_disagree`
  (a *success*), or routed onward.
- **Revise claim** — framed as progress; appended to the mind-change ledger.
- **Generate synthesis** — facilitator/AI drafts: question summary, strongest claims
  by position, best evidence, unresolved factual disputes, unresolved value
  tradeoffs, live cruxes, policy options, agreements, principled disagreements.
- **Rate synthesis fairness** — opposing-cluster reviewers rate whether each major
  position is fairly represented. This is the headline success metric.

## Contribution scoring (routing only, not status)

Lightweight per-contribution axes: clarity, charity, relevance, evidence quality,
crux value, revision value, synthesis value. **Used to route attention and improve
artifacts — never collapsed into a public karma score.** The *only* personally-
attributed, status-bearing signals in the MVP are the kernel's three (endorsed
steelman, documented mind-change, jointly-resolved crux), because those are the ones
that are cross-partisan and hard to fake.

## AI assistance (MVP scope)

Only where it strengthens structure: classify a contribution's type; detect duplicate
claims; ask clarifying questions for vague claims; *propose* a steelman of an opposing
view; provisionally judge an ITT restatement when no human reviewer is available;
draft a synthesis from accepted nodes. **No automated truth scoring.** Every
intervention is logged and contestable.

## Interface

First screen is the **workspace**, not a landing page. Required views: question
overview, structured map (card/tree, not a graph canvas yet), unresolved-work queue,
evidence ledger, crux list, synthesis draft. Navigation: Overview · Claims ·
Evidence · Cruxes · Tradeoffs · Synthesis. No feed, no likes, no followers, and **no
visible vote totals during active deliberation** (the gallery stays out).

## Evaluation plan (with a control)

Run one question through **two or three mixed-prior cohorts**. Measure:

- Did participants understand opposing views better afterward (pre/post test)?
- Did the artifact capture the strongest arguments on each side?
- Are the unresolved disagreements *clearer* than before?
- Did anyone revise a claim or confidence level?
- Did participants surface cruxes invisible at the start?
- **Did opposing-cluster reviewers rate the synthesis as fair?** (primary)
- **Were the highest-status moves cross-partisan, not in-group applause?** (the
  thesis test)

**Control:** produce a parallel artifact from an ordinary open comment thread on the
same question, and compare blind.

## Build order

1. Static question workspace with seeded data (the Midtown shape works).
2. Editable claim + evidence nodes with provenance.
3. **ITT-gated challenge** + assumption nodes. *(kernel)*
4. **Double-crux flow** + crux resolution states. *(kernel)*
5. **Cross-partisan delta / mind-change ledger.** *(kernel)*
6. Revision history surfaced as progress.
7. Synthesis generator from accepted nodes.
8. Opposing-cluster synthesis-fairness review.
9. Routing-only contribution scoring.
10. AI facilitation for classification, clarification, and provisional ITT judging.

## First technical slice

A local, end-to-end workspace: one seeded question, typed nodes, ITT-gated challenge,
a single double-crux session, evidence ledger, crux list, synthesis draft view, local
persistence. **No feed, no likes, no followers, no visible vote totals.** Prove the
product *shape* before accounts, permissions, deployment, or multi-workspace scale.

## What the MVP is explicitly NOT

Infinite feed; follower graph; public like/karma; subreddit-style communities;
quote-post mechanics; trending; DMs; debate-tournament features; moderation
bureaucracy. Posting and replying are not the thesis — and a system where the in-
group can applaud you has already failed the test before it starts.

## Readiness bar

Ready for a first cohort when: every contribution has a typed relationship to the
question; a challenge cannot be made without a passing ITT restatement; at least one
double-crux can run end to end; revisions append to the mind-change ledger; a
synthesis can be generated from graph nodes and rated for fairness by opposing
reviewers; unsupported claims and live cruxes are both visible; and there is no
engagement-ranked feed and no visible vote totals.

The MVP is **not** ready merely because users can post and reply.
