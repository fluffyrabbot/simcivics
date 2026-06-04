# The Reader Artifact

> **Status:** design draft for the single most under-specified surface in the
> project. Iterate against prototypes and real readers, not doctrine. Downstream of
> `docs-v3/THESIS.md` (the reader layer is the civic public good; the headline
> success test is a reader test), `docs-ux/UX-PRINCIPLES.md` §A and the round-2
> amendments, and `docs-arch/PERSISTENCE.md` / `API.md` (the artifact is a
> materialized, versioned, exportable projection).

## Why this document exists

simcivics' reach does not come from contributors. It comes from the **large reader
layer consuming artifacts** that a small contributor layer produces. The thesis'
headline success criterion is a reader claim:

> a non-participant can read it in **20–40 minutes** and come away with a materially
> more accurate, more nuanced model than 10 hours of conventional media would give.

The contributor workbench is well-specified elsewhere. **The artifact the reader
actually meets is not.** This document designs it. If this surface is mediocre, the
entire production machine behind it produces something nobody reads, and the project
fails its thesis even with a perfect contributor experience.

## Who the reader is (and what they need)

A non-participant arriving cold: a busy citizen, a local official or staffer, an
organizer, a journalist. Assume:

- **No context.** They have not followed the deliberation.
- **Limited time.** Most give 60 seconds; some give 5 minutes; a committed few give
  40. The artifact must serve all three from one document.
- **A prior lean, and low trust.** They may arrive partisan and skeptical that this
  isn't just another side's mouthpiece. **Earning trust is a first-class job of the
  artifact, not a side effect.**
- **No tooling, possibly a phone, possibly a screen reader.** Comprehension cannot
  require a mouse, a desktop, or a graph view.

What they need to leave with: *what is actually agreed, what is actually disputed and
of what kind, what would resolve each dispute, and what is known vs unknown if a
decision must be made* — and a justified belief that they were not manipulated.

## Design commitments (the laws of this surface)

1. **A document, not a graph.** Readers get prose-plus-structure they read top to
   bottom. The node-link graph is a contributor instrument; a reader never sees one
   unless they opt into it. Reading, not exploring, is the default.
2. **Lead with common ground; the cross-partisan spine is the trust anchor.** The
   most trustworthy and most comprehension-scaffolding thing a skeptical reader can
   see first is *"people who disagree on everything else still agree on this."* Start
   there, then branch into disagreement. (Conflict-first is the Twitter failure mode;
   we invert it.)
3. **Every position in its own best words.** Each side's case is a steelman —
   opponent-endorsed where available, and the artifact *shows* that endorsement. The
   reader sees the strongest version of each view, attributed as fair by the people
   who hold it.
4. **Name the *kind* of disagreement.** Every live dispute is labeled factual /
   model / value. Teaching the reader *what kind* of disagreement they're looking at
   is itself the civic-literacy payoff and the thing media never does.
5. **Honest uncertainty and irreducible value cruxes are shown as the real output,
   not smoothed.** "Here is exactly why these two camps disagree, and it is a value,
   not a fact" is a *result*, presented as one — never papered into false consensus.
6. **Never declare a winner.** The artifact has no editorial voice picking sides. It
   says what's agreed, what's disputed, what kind, and what would move it. Epistemic
   humility is structural.
7. **Layered: one document, three reading depths.** 60-second, 5-minute, 40-minute
   readers are served by progressive disclosure of the same artifact.
8. **Provenance is visible; trust is earned by transparency.** "View the full
   history," "how the agreement was measured," every claim links to its evidence and
   its endorsement state. (The Wikipedia "view history" lesson.)
9. **Versioned, with "what changed since you last looked."** The map evolves; a
   returning reader gets a changelog, cheaply, from the event log.
10. **No gallery.** No view counts, no popularity, no like/share metrics, no comment
    applause. The reader surface is for understanding, not performance.

## Canonical structure

The artifact renders top-to-bottom in this order. Earlier sections are the shallow-
read; later sections are progressive detail.

**0 · Orientation (masthead).** The bounded question with jurisdiction, decision
context, and active constraints; status (`active` / `synthesizing` / `stable`); last
updated; estimated read time; version. One glance tells the reader what's being
decided, by whom, and how settled it is.

**1 · The 60-second answer.** Three short blocks, no jargon:
- **What's agreed** — the one-paragraph cross-partisan core.
- **What's disputed** — the live disagreements named, each tagged factual / model /
  value.
- **The decision-relevant bottom line** — if you had to act now, what's known vs
  genuinely unknown.

**2 · Common ground (the spine).** The claims that earn agreement *across* opinion
clusters, each shown with its breadth ("supported across all major positions") — but
never raw vote counts. This is the trust anchor and the scaffold the rest builds on.

**3 · The live disagreements.** The core. Each disagreement is a structured unit:
- a plain-language **name** and its **type** (factual / model / value);
- **the strongest case for each side, in its own best words** (steelman; show
  opponent-endorsement status);
- **the crux** — what would actually move it: a piece of data, a model parameter, or
  a value weighting;
- **status** — open / partially addressed / resolved / agree-to-disagree;
- for **model** cruxes: the side-by-side outcome comparison under each side's
  assumptions (simulation results, with ranges);
- for **value** cruxes: the explicit tradeoff, framed as a legitimate clash of goods,
  not a factual error to correct.

**4 · Evidence ledger (reader form).** The key evidence, quality-tiered, *with its
limitations stated*, linked to the claims it bears on. Visibly distinguishes evidence
from citation. A reader can audit any load-bearing claim down to its source.

**5 · Policy options & tradeoffs** (when the question reached option-generation). Each
option: what it assumes, who it helps and who it costs, known risks, and what to
monitor. A tradeoff matrix maps options against the affected parties and the value
conflicts — so the reader sees the *shape* of the choice, not a recommendation.

**6 · What's uncertain / what would change the picture.** Decision-relevant
uncertainties and any live predictions with their resolution status — the honest
edge of what's known.

**7 · What changed since [date].** A reader-facing changelog derived from the event
log: cruxes resolved, positions converged, evidence added, predictions resolved.

**8 · Provenance & trust footer.** How the artifact was produced; how clusters and
agreement were computed (in plain language, linked to detail); a link to the full
append-only history / audit trail; AI-intervention disclosure; who maintains
(gardens) it and that they are drawn cross-cluster.

## The cross-partisan spine (designed specifically)

This is the most novel and most load-bearing element, so it gets its own treatment.
The insight, validated at scale by Polis and X Community Notes: **the trustworthy
signal is agreement that survives across people who otherwise disagree.**

- **Surface bridging claims first and most prominently.** From the clustering
  projection, the claims/statements that earn endorsement *across* clusters become
  §2 (Common ground) — the reader's starting point.
- **Show breadth, not counts.** "Holds across all four positions" builds trust; "812
  upvotes" reintroduces the gallery. Breadth across clusters is the unit, never raw
  popularity.
- **Distinguishing claims become the disagreement map.** Where clusters split is
  exactly §3. Clustering thus generates *both* the common-ground spine and the
  structured disagreement, from the same data.
- **This is simultaneously a trust mechanism and a comprehension scaffold.** A
  skeptical partisan sees the artifact isn't pushing one side (it leads with shared
  ground), and every reader learns the terrain from agreement outward to its edges —
  the natural order for building an accurate model.

## Reading layers

One artifact, three depths, via progressive disclosure:

- **60 seconds** → §0–1 (orientation + the answer). The mobile default view.
- **5 minutes** → + §2–3 headlines (common ground + the named disagreements and their
  types, collapsed).
- **20–40 minutes** → the full §3 disagreements expanded, §4 evidence, §5 options,
  §6 uncertainties. The depth the success criterion is measured against.

The same document; the reader chooses depth by scrolling/expanding, never by
navigating to a different place.

## Neutrality and manipulation-resistance as reader trust

Because readers arrive skeptical and possibly partisan, neutrality must be *visible*,
not merely intended:

- balanced, opponent-endorsed steelmans (the other side certified the framing of
  their own view);
- no editorial winner; the artifact reports structure, not verdicts;
- transparent, linked provenance for every load-bearing element;
- AI contributions disclosed, never presented as authority;
- cross-cluster gardening, stated.

The artifact's credibility comes from being *auditable and even-handed by
construction*, not from a claim of objectivity.

## How the artifact is generated

The reader artifact is **a materialized projection — a rendered, fairness-rated
Synthesis over a LiveMap snapshot** — not hand-authored prose:

- **Common ground / disagreements** come from the clustering projection (bridging vs
  distinguishing claims).
- **Steelmans** are the opponent-endorsed steelman fields already in the graph.
- **Evidence ledger, options, cruxes, uncertainties** are direct projections.
- **"What changed"** is an event-log diff between snapshots.
- **AI drafts the connective prose**; it never decides content or picks winners.
- **Opposing-cluster reviewers rate fairness** (`synthesis_fairness_rated`), and
  **gardeners ratify** before an artifact is promoted to the public `live` ref.
- The result is **exported as a static, cacheable file** (`ExportArtifact`) — the
  ~free high-reach surface — and addressable at past versions via `GetMapAtTime`.

So the artifact is mechanically faithful to the deliberation, drafted for
readability, and gated on opposing-side fairness — it cannot drift into one side's
editorial without failing the fairness ratings that gate its publication.

## Form factor: the explorable question

Default to a **layered document (summary → detail)** — it provably serves all three
reader depths and degrades gracefully to plain text. Treat richer "explorable
explanation" affordances (expand a crux inline, tweak a model parameter and watch the
outcome range move) as **optional progressive enhancements, never requirements** —
they must add to, not gate, comprehension. A/B these against the 20–40-minute
criterion before committing.

## Accessibility, mobile, no-graph

Non-negotiable for a civic tool:

- The entire artifact is a **semantic, linearly-readable document** — proper heading
  hierarchy, keyboard- and screen-reader-navigable, usable with zero graph rendering.
- **Model comparisons and tradeoff matrices have text-equivalent summaries**, not
  image-only charts.
- **Mobile-first:** the 60-second answer is the phone default; depth expands inline.
- The reader surface — and the light contributor on-ramps it offers (endorse a
  steelman as fair, mark a crux load-bearing) — work fully on a phone, which is also
  how a reader becomes a first-time contributor.

## Anti-patterns

- Handing a reader a node-link graph.
- Leading with conflict instead of common ground.
- "Both sides" mush that hides whether a dispute is factual or value.
- Any editorial voice declaring a winner.
- Requiring login or contributor tooling to read.
- Showing view counts, popularity, or engagement anywhere.
- A wall of prose (fails the 5-minute reader) *or* a tweet-thread oversimplification
  (fails the 40-minute reader) — the layering exists precisely to avoid this fork.
- Letting the artifact silently go stale (no "last updated," no "what changed").
- Smoothing an irreducible value crux into a fake consensus.

## Success measures

Evaluated as a **reader** artifact, against a control (a comment thread or news
article on the same question):

- **Comprehension:** pre/post test — is the reader's model materially more accurate
  and nuanced after 20–40 minutes?
- **Steelman recall:** can the reader now state the *other* side's strongest argument?
- **Disagreement literacy:** can the reader correctly say what *kind* (factual /
  model / value) each main disagreement is?
- **Perceived fairness across priors:** do readers from *different* initial leans both
  rate the artifact as fair? (The reader analog of synthesis fairness — the trust
  test.)
- **Decision usefulness:** could a reader who must act identify what's known vs
  unknown?

## Relationship to persistence / API

- The artifact is the **rendered output of a `live` LiveMap ref + its adopted
  Synthesis**, materialized by `ExportArtifact(ref, format)` and served static.
- Historical versions resolve via `GetMapAtTime(ref, t)`; the changelog is an
  event-log diff — both come free from the append-only, bitemporal store.
- Publication is gated by `synthesis_fairness_rated` (opposing-cluster) and
  `livemap_promoted` (gardener), so the reader artifact inherits the same
  cross-partisan fairness guarantees as everything else.

## Open questions

- **Canonical form:** layered briefing vs explorable explanation — decide by A/B
  against the comprehension and fairness tests, not by taste.
- **Granularity of the spine:** how much common ground is enough to anchor trust
  without burying the disputes that are the point?
- **Staleness policy:** when does a `stable` artifact get a visible "may be out of
  date" marker, and who decides?
- **Personalization risk:** should the artifact ever adapt to a reader's prior (e.g.
  lead with the steelman of *their* side)? Tempting for engagement, dangerous for
  trust and for the shared-reality goal — default **no**, but worth testing.
- **Length discipline:** what is the maximum length that still meets the 40-minute
  bound for a genuinely complex question, and what gets cut first?
