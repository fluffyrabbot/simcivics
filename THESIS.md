# Thesis

American civics is bottlenecked less by information scarcity or voting mechanics than by the low quality of its shared reasoning substrate. The dominant public squares (Twitter/X, Reddit, cable, comment threads) optimize for rhetoric — zero-sum persuasion, status via performance, emotional mobilization, and rapid signaling — rather than dialectic: the structured, charitable, evidence-grounded opposition of models of the world that produces better individual and collective understanding, and occasionally synthesis.

The operating claim of simcivics is that **a well-designed substrate for dialectic can meaningfully raise the quality of civic reasoning at scale**, and that this improvement compounds into better policy attention, better local organizing, and better citizen judgment. This is complementary to (and downstream of) the votepolitics thesis: once attention is reallocated away from low-leverage federal spectatorship toward higher-leverage local and between-election work, the *quality* of reasoning applied in those venues becomes the next scarce resource to engineer.

## What "dialectic" means here

- Explicit thesis / antithesis / attempted synthesis (or at minimum, explicit mapping of the disagreement space).
- Steel-manning as a first-class, rewarded act (your description of the other side can be endorsed *by them*).
- Separation of empirical subquestions, model assumptions, and value tradeoffs.
- Public, versioned belief revision ("I changed my mind on X because Y evidence/argument").
- Convergence on cruxes: the specific points where disagreement lives and where resolution (or explicit value conflict) would matter.
- Grounding where possible in shared, inspectable models and simulations rather than verbal handwaving.
- The persistent artifact is the *map* (shared understanding of the issue structure), not the *thread* or the *winner*.

Rhetoric is not banned — it is simply not the rewarded path to status, visibility, or influence inside the system. The system is designed so that good rhetoric without underlying dialectic earns little, while strong dialectic earns reputation even if (especially if) it updates you or produces a synthesis that "your side" dislikes.

## Why current substrates fail systematically

Twitter/X and Reddit (and their cousins) share structural properties that are not accidental bugs:

1. **Incentive misalignment at the root**: Primary signals (likes, reposts, upvotes, replies, watch time) are cheap to produce and optimize for arousal, novelty, in-group validation, and out-group attack. These are anti-correlated with the slow, effortful, humbling work of steelmanning, model comparison, and updating.

2. **No convergence pressure or artifact**: Threads and comment sections are linear or tree-like but have no "end" state, no canonical synthesis, no versioned map that improves over time. The next cycle restarts at zero. Status accrues to the most recent zinger, not the person who improved the shared representation.

3. **Zero or negative cost for low-quality or bad-faith moves**: Drive-by comments, motte-and-bailey, moving goalposts, selective evidence, and performative outrage have near-zero marginal cost and positive expected status return in the current game.

4. **Bandwagon and herding mechanics**: Numeric vote totals and algorithmic amplification create information cascades. Early movers or coordinated minorities set frames that later participants mostly react to rather than re-examine. Polis-style clustering shows this can be partially mitigated by surfacing "group-informed consensus" and cross-cluster statements, but most platforms do the opposite.

5. **Person over position, performance over model**: The unit of attention is the individual speaker and their latest utterance. This rewards consistent personas, rhetorical skill, and audience capture over accurate modeling or intellectual honesty. Updating looks like weakness.

6. **No skin in the game on subclaims**: Most claims are costless to make and costless to be wrong about. Prediction markets and calibration tracking are rare and ghettoized.

7. **Speed and scale as enemies of thought**: The interface and norms favor rapid production and consumption. Dialectic requires dwell time, re-reading, comparison across sources, and sometimes sleeping on a crux.

8. **Anonymity without history or accountability**: Cheap pseudonyms + no persistent, multi-dimensional reputation for epistemic virtues (as opposed to entertainment value) removes the long-term cost of being consistently sloppy or dishonest.

Kialo and Polis are the best existing attempts to counter some of these. Kialo gives structure and visual mapping; Polis removes direct replies and uses ML to surface bridging statements. Both are valuable and inform this design. Neither fully solves the incentive problem at the level required for a durable civic substrate, nor integrates simulation/modeling deeply, nor treats synthesis and public updating as primary success conditions.

## The corrective architecture must therefore be load-bearing on incentives and artifacts

It is not enough to provide "better UI for debate." The system must make dialectic the *locally rational* strategy for participants who want reputation, influence inside the system, or (ideally) real-world civic impact. Everything else — data model, UI patterns, moderation, AI assistance, simulation attachment — is in service of making the right behaviors the ones that pay off.

Specific implications:

- Status and visibility must be tied to measurable contributions to shared maps, successful steelmans (opponent-endorsed), calibration on resolved subclaims, and adoption of syntheses.
- Rhetoric moves (clever framing, selective quotation, emotional loading) must either be structurally hard to perform inside the main artifacts or yield low returns.
- The default surface must be the *issue map*, not a feed of people or posts.
- Participation must carry non-trivial cost or commitment (effort, time, or skin via predictions) to deter low-quality volume.
- There must be persistent, forkable but mergeable artifacts (maps, syntheses) that accumulate value over time rather than resetting with every news cycle.
- The system must surface disagreement structure (clusters + cruxes) rather than just aggregate sentiment or majority will.

## Relation to votepolitics and broader stack

votepolitics attacks the misallocation of civic attention toward federal electoralism. simcivics assumes that some non-zero fraction of that attention (and new attention from people who never cared about federal horse races) can be redirected into higher-quality reasoning about the actual policy and value questions that local and state work actually turns on.

The two projects share a premise: ordinary people have more leverage than the dominant attention economy admits, but only if both the *target* (local, between-election, high surface-area work) and the *method* (dialectic rather than rhetoric) are improved. A citizen who stops doomscrolling presidential drama and starts showing up to zoning meetings is still limited if the discourse at those meetings (or the prep for them) is low-quality motivated reasoning.

simcivics is therefore not a general-purpose social network or debate club. It is a **civic epistemology engine** whose outputs should be legible and useful to:
- Local organizers and candidates who need better models of the tradeoffs in their actual jurisdiction.
- Citizens who want to think rather than perform.
- (Aspirational) policymakers and staff who need maps of the serious arguments rather than another pile of form letters.

It is also not a replacement for elections, legislatures, or courts. It is substrate: better raw material for those institutions and for the civil society that pressures them.

## Success criterion (high level)

After sustained use on a real contested civic issue (housing production, criminal justice reform, school policy, land use, budgeting priorities, etc.):

- There exists a live, versioned map that a non-participant can read in 20-40 minutes and come away with a materially more accurate and nuanced model than they would get from 10 hours of conventional media + social media on the same topic.
- Multiple participants from different initial clusters can point to specific updates they made, cruxes they now agree are the real disagreement, or syntheses they helped produce that they would not have reached alone.
- The map or its syntheses are cited or forked in real local civic processes (testimony, candidate platforms, organizer strategy docs, public reports).
- Reputation inside the system for high charity, calibration, and synthesis quality is observably different from reputation for rhetorical skill or volume.

If the system merely produces higher-quality parallel monologues or becomes another venue for existing factions to perform, it has failed its thesis even if engagement is high and users report feeling "heard."

Everything in the architecture that follows is judged by whether it makes the above more or less likely.

## Non-goals (for now)

- Not a general social network. No "following" people as the primary navigation.
- Not a prediction market platform (though it should integrate with or contain scoped prediction mechanisms for empirical subclaims).
- Not a replacement for face-to-face deliberation or citizen assemblies (though it can feed them and be fed by them).
- Not a direct democracy or voting system. Outputs are maps, syntheses, and better-informed participants — not binding decisions.
- Not optimized for speed or scale at the expense of depth. A smaller number of higher-quality maps on high-stakes recurring issues is preferable to broad but shallow coverage.

The thesis is ambitious but bounded. Improving the substrate of dialectic is one high-leverage intervention in a much larger civic stack. It is worth building carefully because the current substrates are not neutral; they are actively anti-dialectic by their incentive design. A different substrate is possible. The question is whether we can make one that actually works at civic scale and stays honest to the goal.