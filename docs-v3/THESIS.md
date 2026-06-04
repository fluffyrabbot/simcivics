# Thesis (v3)

> This is the third, independent thesis. It reconciles the root-level set (the
> *Positions & Simulation* lineage) and the `docs/` set (the *Workspace & Process*
> lineage) and sharpens both. See `SYNTHESIS-NOTES.md` for the provenance of every
> decision. The other two sets are left unedited.

## Operating claim

American civics is bottlenecked less by information scarcity or voting mechanics
than by the **low quality of its shared reasoning substrate**. The dominant public
squares optimize for *rhetoric* — zero-sum persuasion, status through performance,
emotional mobilization — rather than *dialectic*: the structured, charitable,
evidence-grounded opposition of models of the world that produces better
understanding and occasionally synthesis.

simcivics asserts that **a well-designed substrate can make dialectic the locally
rational thing to do**, at civic scale, and that the durable product of such a
substrate is not a conversation but an **artifact**: a shared, versioned map of a
civic question that a stranger can read in half an hour and come away with a more
accurate, more nuanced model than ten hours of conventional media would give them.

## What "dialectic" means here

- Explicit thesis / antithesis / attempted synthesis — or, at minimum, an explicit
  map of *where the disagreement actually lives*.
- **Steelmanning as a gated, first-class act**: your representation of the other
  side can be endorsed *by them*, and — see below — you may not rebut a position
  until you have demonstrably understood it.
- Separation of **empirical subquestions, model assumptions, and value tradeoffs**.
- **Public, versioned belief revision**: "I changed my mind on X because Y."
- Convergence on **cruxes**: the specific points where resolution (or an explicit
  value conflict) would move someone.
- Grounding in **inspectable models** where a disagreement is really a disagreement
  about a model of the world.
- The persistent artifact is the **map**, never the thread or the winner.

Rhetoric is not banned. It is simply not the path to status, visibility, or
influence inside the system. Good rhetoric without underlying dialectic earns
little; strong dialectic earns standing *even when — especially when — it updates
you or produces a synthesis your own side dislikes.*

## Name the adversary: the gallery

The failure of Twitter and Reddit is not cultural, it is mechanical, and it has a
precise shape. **The corrupting agent is the spectating co-partisan audience — the
gallery.** On those platforms you are never really talking *to* your interlocutor;
you are performing *about* them, to your own side. Every primary signal (likes,
reposts, upvotes, follower counts) measures *applause from people who already agree
with you*, and applause from co-partisans is the definitional reward of rhetoric,
not dialectic.

Two structural consequences follow, and both are design targets:

- **The unit of value is a broadcast, not a resolution.** Nothing accumulates;
  every thread re-litigates from zero; status accrues to the most recent zinger.
- **The reward signal comes from the wrong side of the table.** What is cheap and
  rewarded (a dunk your side loves) is anti-correlated with what is valuable and
  hard (a concession your opponent recognizes as fair).

Reddit adds its own mechanical sin: the vote conflates *"I agree"* with *"this is
good,"* so the downvote **hides dissent** — the exact opposite of dialectic — and
karma rewards being early and agreeable to the subreddit's existing consensus,
manufacturing hivemind.

**Everything in the architecture is, at root, an attack on the gallery and a
relocation of the reward signal to the other side of the table.**

## Why current substrates fail systematically (and structurally, not accidentally)

1. **Incentive misalignment at the root.** Primary signals optimize for arousal,
   novelty, in-group validation, and out-group attack — all anti-correlated with
   the slow, humbling work of steelmanning, model comparison, and updating.
2. **No convergence pressure or artifact.** Threads have no end state, no canonical
   synthesis, no versioned map that improves over time.
3. **Zero cost for low-quality moves.** Drive-bys, motte-and-bailey, goalpost
   moving, selective evidence, and performative outrage have near-zero marginal
   cost and positive expected status return.
4. **Bandwagon and herding.** Visible vote totals and algorithmic amplification
   create cascades; early or coordinated movers set frames others merely react to.
5. **Person over position, performance over model.** The unit of attention is the
   speaker's latest utterance. Updating looks like weakness.
6. **No skin in the game on subclaims.** Most claims are costless to make and
   costless to be wrong about.
7. **Speed and scale as enemies of thought.** The interface rewards rapid
   production; dialectic needs dwell time.
8. **Cheap pseudonyms with no epistemic accountability.** No persistent,
   multi-dimensional reputation for epistemic virtue removes the long-term cost of
   being consistently sloppy or dishonest.

Kialo and Polis are the best prior attempts and inform this design — Kialo gives
structure, Polis removes direct replies and surfaces bridging statements. Neither
solves the incentive problem at the level a durable civic substrate requires, nor
integrates modeling, nor treats synthesis and public updating as primary success
conditions.

## The design laws that follow (load-bearing)

These are the non-negotiables. Architecture decisions that violate them are wrong
by definition.

1. **The map is the product.** The shared, versioned claim graph is the only
   durable object. Threads, posts, and even individual "positions" are projections
   or implementation details over it. *You cannot win; you can only improve the
   map.* This is the structural answer to "parallel monologues": there is nothing
   to accumulate but the commons.

2. **The reward signal lives on the other side of the table.** The only
   status-bearing signals are ones that are **cross-partisan or outcome-resolved,
   and therefore hard to fake**:
   - a steelman the *other side* endorses as fair (you passed their Turing test);
   - **calibration** on subclaims that later *resolve* against real data;
   - a **synthesis adopted across initial clusters**;
   - a **documented mind-change**.
   Popularity within your own cluster is, at most, an input to routing — *never*
   status. This single law is what reconciles "you must engineer status" with
   "status games are poison": status is allowed, but only the kinds that cannot be
   farmed by your own tribe.

3. **You must understand before you may rebut (the ITT gate).** To attack a
   position you must first restate it to the satisfaction of someone who holds it
   (or, provisionally, a classifier). This kills strawmanning at the protocol level
   and forces the comprehension that precedes real disagreement.

4. **Find the crux, by double-crux.** The generative move is not "argue" but
   "locate the belief such that, if it flipped, your conclusion would flip" — and do
   it mutually. The system makes crux-finding the core ritual, not a side feature.

5. **Changing your mind is the highest-status act on the platform.** Every existing
   platform makes updating humiliating. We invert it: the visible markers of a good
   participant are *updates given and received, steelmans the other side endorsed,
   and calibration* — never follower count.

6. **Remove the gallery during reasoning; publish only the artifact.** Hard work
   happens in small, mixed-prior cohorts without a live audience and without visible
   vote totals. What goes public is the synthesized map, so people can update
   without public humiliation and so the public square consumes *resolutions*, not
   performances.

7. **Structure is enforced at contribution time.** Claims, evidence, assumptions,
   objections, and uncertainty are required fields, not encouraged habits.

8. **Speed is the enemy.** Maturation periods and deliberate pacing are features.

9. **Outputs must escape the system.** A good map is exportable as a briefing,
   citable in testimony, usable by an organizer who never logged in. The system
   succeeds when its artifacts leave it.

## The honest terminal state is often the irreducible value crux

A great deal of civic disagreement is not factual or even model-based; it is a
conflict of values or interests. Dialectic cannot *dissolve* such a conflict. What
it can do — and what we count as a **first-class success, not a failure** — is
drive the disagreement down to its irreducible core: *"We disagree because you
weight liberty over equality at this specific margin, and that is a value, not a
fact."* Locating that crux cleanly is enormously valuable to a community even when
no synthesis is possible. The system must be designed to celebrate this output, not
to paper over it with false consensus.

## Success criterion

After sustained use on a real contested local issue (housing production, street
safety, school policy, budgeting):

- A live, versioned map exists that a non-participant can read in 20–40 minutes and
  come away materially better-modeled than conventional media would leave them.
- Participants from *different initial clusters* can each point to a specific update
  they made, a crux they now agree is the real disagreement, or a synthesis they
  helped produce that they could not have reached alone.
- The map or its syntheses are **cited or forked in a real civic process**
  (testimony, a candidate platform, an organizer's strategy doc).
- In-system standing for charity, calibration, and synthesis is *observably
  different* from standing for rhetorical skill or volume.

If the system merely produces higher-quality parallel monologues, or becomes
another venue for existing factions to perform for their galleries, it has failed
its thesis **even if engagement is high and users report feeling "heard."**

## Where this thesis is fragile (stated up front, because the source theses do not)

- **Adoption, not design, may be the binding constraint.** A perfect substrate
  nobody uses changes nothing, and the broader media/political economy has
  incentives a niche tool cannot touch. The reach model (below) is a hypothesis,
  not a solved problem.
- **Dialectic cannot resolve value/interest conflicts** — only locate them. The
  common terminal state is the irreducible crux, and the design must expect that as
  the rule, not the exception.
- **Rigor self-selects the already-reasonable.** The people willing to do
  double-crux are disproportionately the ones who already argue in good faith.
  Reaching the disengaged or bad-faith majority is unsolved.
- **Framing is power.** Whoever sets the question controls the debate. The framing
  itself must therefore be contestable inside the system, not fixed by whoever
  arrives first.
- **Every metric will be gamed (Goodhart).** The cross-partisan / outcome-resolved
  reward law is chosen precisely because those signals are *expensive to
  manufacture* — but that defense holds only with real sybil resistance.

## How reach actually happens: two populations

Rigor is expensive; most people will never do double-crux. So the substrate is two
layers:

- a **small contributor layer** that does the structured work and produces the
  artifacts; and
- a **large reader layer** that consumes maps, syntheses, crux lists, and tradeoff
  matrices — high reach, low effort.

The maps are the public good. Few produce them; many use them. This is how a
rigor-demanding tool reaches civic scale without diluting the rigor.

## What simcivics is not

- Not a general social network. No "following" people as primary navigation.
- Not a prediction market (though it contains scoped calibration on subclaims).
- Not a replacement for elections, legislatures, courts, citizen assemblies, or
  face-to-face deliberation. It is **substrate**: better raw material for all of
  them.
- Not a direct-democracy or voting system. Outputs are maps, syntheses, and
  better-informed participants — never binding decisions.
- Not optimized for speed or scale at the expense of depth. A few high-quality maps
  on recurring high-stakes issues beat broad, shallow coverage.

## Relation to the broader stack

simcivics acknowledges a sibling thesis (`votepolitics` in the root set) that
attacks the *misallocation* of civic attention toward federal spectatorship. The
two share a premise — ordinary people have more leverage than the attention economy
admits — but simcivics does not depend on it. Reallocated attention is only as good
as the reasoning applied to it; a citizen who trades doomscrolling for a zoning
meeting is still limited if the discourse there is motivated reasoning. simcivics
is the **method** layer; it must stand on its own.
