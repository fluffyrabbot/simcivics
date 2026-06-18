# Architecture

This document describes the intended system architecture for simcivics: a dialectic substrate for American civic reasoning. It is downstream of the THESIS.md and must be read against it. Design decisions that undermine the thesis (especially incentive alignment for dialectic over rhetoric) are incorrect by definition.

## Design Principles (non-negotiable)

1. **Maps and syntheses are the primary persistent artifacts.** Threads, posts, and profiles are secondary or implementation details. The value accrues to contributions that improve the shared representation of an issue.

2. **Opponent-endorsed charity is a core currency.** A steelman that the other side refuses to endorse is weak or incomplete. The system must make it easy and rewarding to produce representations that survive the other side's review.

3. **Multi-dimensional, context-sensitive reputation replaces single-score gamification.** Calibration on empirical subclaims, rate of useful updates, charity endorsements received, synthesis adoption, and source rigor are tracked separately. No global "karma" number drives visibility.

4. **Structure is enforced at contribution time, not just encouraged.** The UI and data model require explicit handling of objections/steelmans, evidence, assumptions, and uncertainty. Free-text rhetoric is possible in limited spaces but earns little inside the main system.

5. **Visibility and status are anti-herding by default.** Use Polis-like clustering to surface statements that bridge or usefully distinguish opinion groups. Hide or de-emphasize raw vote totals on individual contributions during active deliberation. Surface "this challenges a view like yours" over "this is popular."

6. **Skin in the game and effort gates exist.** Cheap talk is structurally limited. High-quality participation requires either demonstrated effort (structured input, source work), time commitment, or willingness to be scored on predictions/resolutions.

7. **Simulation and modeling are first-class where applicable.** Many civic disagreements are disagreements about models of the world (elasticities, behavioral responses, second-order effects). The system should make it natural to attach, inspect, fork, and run simple quantitative models against positions.

8. **Forkable but accumulative.** Anyone can fork a map or synthesis. "Main" or "live" status is earned via cross-cluster support and demonstrated rigor over time, not platform fiat. History is preserved.

9. **Speed is the enemy.** Interfaces should not reward rapid fire. Maturation periods, required dwell or review steps, and deliberate pacing for important issues are features.

10. **Outputs must be legible outside the system.** A good map or synthesis should be exportable as a briefing document, citable in testimony, usable by a local organizer who never logged in. The system succeeds when its artifacts escape it.

## Core Domain Model

The model is a directed graph of typed nodes and edges with strong versioning and provenance. Everything important is an event-sourced or commit-graph structure.

### Primary Entities

- **Issue**
  - Root container for a recurring or time-bound civic question.
  - Fields: canonical title, scope (municipal / county / state / federal / cross), domain tags, value_conflicts (explicit list of competing values at stake), seed_questions, status (active, synthesizing, stable, archived), created, last_major_update.
  - Examples: "How should Midtown zoning change to increase housing production while managing infrastructure strain?", "What mix of enforcement, treatment, and housing policy minimizes visible street disorder in the downtown core?"

- **Position**
  - A structured, versioned stance on an Issue (or sub-issue).
  - Contains:
    - author (User or pseudonymous identity with history)
    - core_claims: array of atomic Claim
    - assumptions: array of explicit premises (some empirical, some value)
    - evidence: references to Evidence nodes, each with relevance and quality notes
    - anticipated_objections: array of {steelman_summary, response?, endorsed_by_opponents?}
    - cruxes_identified: references to Crux nodes
    - attached_models: references to Simulation nodes or parameter sets
    - confidence: structured (e.g., intervals on key predictions, qualitative)
    - synthesis_of: array of other Position ids (if this is integrative)
    - parent_versions: for forking/history
  - Positions are the main unit that can be "adopted," "forked," or "synthesized from."

- **Claim**
  - Atomic, typed proposition.
  - Types: empirical (in principle resolvable with data), predictive (will resolve in future), value (normative, requires weighting), definitional, causal_model_claim.
  - Has confidence, sources, and resolution events over time.

- **Evidence**
  - Primary or high-quality secondary source material.
  - Fields: uri or citation, excerpt, methodology_notes, quality_tier (community-rated or tier list: primary_admin_data, peer_reviewed, high_quality_report, etc.), date, domain_relevance.
  - Can be attached to multiple Claims/Positions. Rateable on "does this actually support the use it's being put to?"

- **Crux**
  - A disagreement that, if resolved (or if the parties agreed on the weight), would move at least one side's position.
  - Types: factual (data would settle), model (different parameters or functional forms), value (different weightings or lexical priorities).
  - Status: open, partially_addressed, resolved_by_new_evidence, resolved_by_agreement_to_disagree, moot.
  - Linked to the Positions that treat it as load-bearing.

- **DialecticSession**
  - A structured, time- or milestone-bounded collaboration between two or more Positions (typically initially opposed).
  - Phases (enforced or strongly guided by UI): mutual presentation → cross-steelman (each party writes the other's position; the other can accept/edit/reject) → crux identification and prioritization → response / new evidence / model runs → synthesis attempt or explicit map update.
  - Output: updated Positions, new Synthesis candidate, new/resolved Cruxes, attached evidence or sim runs.
  - Can be 1:1 (adversarial collaboration), small group, or (later) larger facilitated.

- **Synthesis**
  - A special Position that explicitly attempts integration: "best elements of A and B plus trade-off handling."
  - Success metric: subsequent endorsement or adoption rate from participants who started in different clusters.
  - Can become a candidate for "live synthesis" on the Issue.

- **Simulation / Model**
  - Executable or parameterizable model attached to Claims or Positions.
  - Simple end: spreadsheet-like param sets with documented formulas (e.g., housing unit projections under different zoning).
  - Richer: small agent-based or system dynamics models runnable in-browser (Pyodide or equivalent) or via sandboxed backend.
  - Key property: a Simulation run can be cited as "under Position A's assumptions, outcome distribution is X; under B's, it is Y."
  - Over time, real-world data can "score" past model runs (calibration for modelers too).

- **User / Identity**
  - Persistent (pseudonymous by default, with option for verified layers on high-stakes work).
  - Reputation dimensions (stored as time series, queryable):
    - calibration: historical accuracy on resolved empirical/predictive claims (Brier or interval scores).
    - charity: number and quality of steelman endorsements received from people who initially disagreed.
    - update_quality: logged revisions with reasons; peers can rate "this was a high-integrity update."
    - synthesis_influence: how often this user's contributions appear in later adopted syntheses or live maps.
    - rigor: source quality and explicitness of assumptions in their Positions.
  - Attention budget (soft or hard): limited high-effort slots per period to prevent volume gaming.

- **Endorsement / Structured Vote**
  - Not generic "agree/disagree."
  - Types that matter for status and visibility:
    - "This is a fair steelman of my initial position" (cross-side, high value).
    - "This evidence actually supports the claim it's attached to" (or "does not").
    - "This crux is load-bearing for me."
    - "I would adopt this synthesis (with these caveats)."
    - "This prediction/claim resolved in the direction this Position expected."
  - Raw popularity votes can exist for secondary signals but must not drive primary visibility or reputation.

- **IssueMap (or LiveMap)**
  - The canonical or community-promoted view of the current best structure for an Issue: key Positions (including syntheses), prominent Cruxes, evidence clusters, model comparisons, open questions.
  - Versioned. Forkable. "Main" status is soft — earned by breadth of informed support + maintenance quality.

### Relationships (edges)

- Position `opposes` / `builds_on` / `synthesizes` other Positions.
- Claim `supported_by` / `challenged_by` Evidence.
- Position `identifies` Crux; Crux `matters_to` multiple Positions.
- DialecticSession `produces` updated Positions / new Synthesis / resolved Cruxes.
- User `authors` Position; User `receives_endorsement` (charity, etc.).
- Simulation `instantiates` assumptions from a Position; SimulationRun `contradicts_or_supports` Claim.

Event sourcing or a commit graph (similar to git + rich metadata) makes history, forking, and "what changed between map v3 and v7" tractable.

## Incentive Architecture (the load-bearing part)

This is where most platforms fail. We must make the following locally attractive:

**Positive rewards (visibility, status, influence inside system, possible external legibility):**
- Producing a steelman that the other side endorses.
- Identifying a high-value crux that multiple parties later agree was central.
- Updating publicly with good documentation when evidence or argument warrants.
- Contributing a model or simulation that subsequent Positions adopt or improve.
- A synthesis that gains adoption across initial clusters.
- High calibration on claims that later resolve (or on model predictions).
- Maintaining a LiveMap section over time (gardening credit).

**Negative or low returns:**
- Clever one-liners or frame shifts that do not engage the structure.
- Positions that ignore or caricatures the strongest opposing arguments.
- High volume of low-structure contributions.
- Consistent overconfidence that fails calibration.
- Refusal to engage in cross-steelman when invited (soft penalty via lower charity opportunities).

**Concrete mechanisms:**

- **Charity Endorsement Flow**: When authoring or revising a Position, the system can prompt or require a "strongest objection from the other cluster" section. The relevant other-side participants are notified and can (a) endorse the steelman as fair, (b) edit it, or (c) flag it as still missing the point. Endorsed steelmans are a visible, high-status signal on the Position and on the author's record.

- **Crux Market (light)**: Limited "crux tokens" or simply tracked counts. Users can mark "this would move me." High mutual "would move me" cruxes rise in the map. This is cheap to fake individually but patterns across clusters are informative (Polis spirit).

- **Calibration Dashboard**: Every empirical/predictive Claim can later receive a resolution event (data release, model scoring, agreed outcome). Authors and attachers get scored. Public or semi-public leaderboards per domain. This is the closest thing to "skin in the game" for facts.

- **Adoption Attribution**: When a new Position or LiveMap cites or merges elements from prior ones, the system records provenance. Authors of heavily adopted sub-parts accumulate "synthesis influence."

- **Effort / Gate**: To publish a top-level Position on a high-traffic Issue, the author must have either (a) completed a DialecticSession with at least one opposing view, or (b) accurately summarized (and had endorsed) the top N current opposing Positions. This is a toll that raises the floor without requiring consensus.

- **Attention Budget**: Each user has a small number of "serious contribution" slots per week/month on major Issues. Additional contributions are possible but deprioritized in review queues and map visibility. This fights both volume spam and performative posting.

- **No Early Virality**: New contributions enter review/consideration queues or are sampled for people in relevant clusters (similar to Polis random-then-algorithmic presentation). Hot-button rhetoric does not get an immediate global megaphone.

- **Reputation Portability (careful)**: Domain-specific (e.g., "strong on land-use empirics in mid-sized cities"). High charity in one domain does not automatically transfer to unrelated value-laden fights.

## Interaction Patterns and UI Metaphors

The interface should feel more like a collaborative mapping + modeling workbench than a social feed.

**Primary Navigation:**
- Browse by Issue (curated "Live Civics Issues" + search + local filters).
- For a given Issue: the current LiveMap (visual or well-structured card hierarchy) is the default landing.
- Secondary: active DialecticSessions, recent high-quality updates/syntheses, personal calibration + contribution history.

**The Map View:**
- Hierarchical or graph view of the issue structure: root question → major Positions (with cluster labels if Polis-style clustering is applied) → their key Claims → attached Evidence and Models → identified Cruxes.
- Color/weighting by cluster support or cross-cluster endorsement.
- Ability to "expand crux" or "compare two Positions side-by-side on this dimension."
- "Garden" mode for maintainers: propose merges, flag stale evidence, request model updates.

**DialecticSession Interface (core ritual):**
- Phase 1: Each side presents or links their current Position (structured).
- Phase 2: Cross-steelman — Party A must write (or accept/edit) a summary of Party B's position *as B would recognize it*. B does the same. Mutual acceptance or documented remaining gaps.
- Phase 3: Each marks the 1-3 cruxes they believe are load-bearing. Overlap is highlighted.
- Phase 4: Focused work on cruxes (new evidence, model runs, value clarification). Can spawn sub-sessions or attach artifacts.
- Phase 5: Attempted synthesis or explicit "we agree the disagreement is X and here is why we weight differently."
- The session itself produces a traceable artifact that feeds the map.
- Implementation note from the Midtown zoning workbench: these are persisted phase artifacts, not UI-only prompts. A `DialecticSession` carries presentation notes, cross-steelmans with target response, prioritized cruxes with "would move if" criteria, focused work items, and a synthesis attempt with adoption/caveat signals. This keeps cross-steelman, crux identification, and synthesis attempt first-class enough to feed reputation, LiveMap projection, and exportable briefings.

**Position Editor:**
- Not a blank textarea. Sections are prompted or required: Core claim(s), Assumptions (empirical vs value), Evidence (with quality notes), Strongest objection from the other side (with endorsement status), My response, Uncertainties and what would change my mind, Attached model params/runs.
- Preview as it will appear in the map.

**Simulation Attachment:**
- From a Position or Claim, "Attach or run model."
- Param editor that documents which assumptions come from which Position.
- Run button produces a citable artifact: "Under Position 47 assumptions + this elasticity range, housing units in 5 years: median 12k (5-95%: 8k-19k)."
- Later data releases can be compared to past runs.

**Personal / Calibration View:**
- "My track record": resolved claims I contributed to or bet on, with scores.
- "My updates": chronological list of public revisions with reasons and impact.
- "My charity": list of steelmans I endorsed or that were endorsed for me.
- Suggested next actions: "There is an open crux on topic Y where your past positions are in different clusters."

**Anti-performative defaults:**
- Reply threads are not the main model. Structured feedback (endorse this section, propose alternative claim, add counter-evidence, rate rigor) replaces most commenting.
- Notifications are for things that require your input (your position was steelmanned by someone; a crux you care about has new evidence; a DialecticSession you are in advanced).
- Public profiles emphasize track record over follower count or recent zingers.

## Moderation, Quality, and Governance

- **Norm enforcement via structure and incentives first.** The data model and required fields do a lot of the work that heavy-handed mods do elsewhere.
- **Map Gardeners**: For Live Issues, a small set of high-reputation (cross-cluster calibration + charity + maintenance history) users have elevated propose/merge rights. They are visible and replaceable. Not gods; their changes can be forked against.
- **Jury / Review for high-stakes**: For certain Issues or when conflict arises about map status, a sortition or reputation-weighted panel of participants from multiple clusters can be convened to ratify or adjust.
- **Bad faith handling**: Persistent patterns of refused steelman, repeated low-rigor contributions after feedback, or gaming (e.g., fake updates) can lead to temporary restrictions on high-visibility actions or reputation multipliers. Appeals exist.
- **Transparency**: All reputation dimensions, gardener actions, and major map changes are auditable.

## Technical Architecture (initial)

**Stack direction (to be validated in implementation):**
- Frontend: TypeScript + Svelte (or React) for the workbench feel. Rich interactive maps may use React Flow / custom canvas or a structured card + tree UI first (maps can start hierarchical before going full graph).
- State / collab: For single-user or small sessions, local state + eventual sync is fine. For multi-user map editing, consider CRDTs (Automerge, Yjs) or a central authority with good conflict UX (fork is always an option).
- Backend: Convex (real-time, TypeScript everywhere, good for event-ish data), Supabase, or a custom Node/TS server with Postgres + event log. Start simple.
- Persistence: Strongly normalized graph + blobs for large evidence. Full history / versions as first-class (immutable Position versions, map snapshots).
- Simulation: Start with client-side parameter calculators + documented formulas (easy to cite). Escalate to Pyodide (Python in browser) for user-supplied small models, or sandboxed backend execution for heavier work. All runs must be reproducible and attachable with exact params.
- AI assistance (optional but powerful): LLMs can help draft steelmans, surface missed objections from the current map, cluster new contributions (Polis-style), check citation quality signals, or propose param ranges. Everything must be human-reviewable and human-owned. Do not let generative text become the default contribution.
- Auth: Pseudonymous first (email + magic link or passkey is enough). Later layers for real-name verification on specific high-trust work (e.g., testimony-linked maps).

**Data flow sketch:**
- Issue creation → seed with initial Positions or open call.
- Participants create/fork Positions (with gates).
- DialecticSessions or solo structured contributions update the graph.
- Clustering / bridging algorithms (inspired by Polis) run periodically or on demand to label contributions and surface candidates for LiveMap.
- Resolution events (external data or agreed outcomes) flow back and update calibration + map status.
- Exports: static briefing pages, PDF maps, structured JSON for other tools.

**Non-goals technically:**
- Not a high-scale social media backend. Expect orders of magnitude less concurrent activity than Twitter. Optimize for depth and data integrity.
- Not real-time chat. Asynchronous, deliberate.

## Phased Roadmap (illustrative)

**Phase 0: Foundations (this repo setup)**
- THESIS + ARCHITECTURE docs.
- Core TypeScript types for the domain model.
- Basic Issue + Position editor + simple tree visualization.
- One seeded example Issue with 3-4 Positions to make the model concrete.

**Phase 1: Single-Issue Dialectic Loop (MVP that can be used seriously on one topic)**
- Full Position structure with steelman + crux sections.
- DialecticSession flow (at least 1:1, self-serve or invited).
- Basic endorsement types (charity, rigor).
- Simple calibration via seeded or manually resolved subclaims.
- Export of a map/synthesis as readable document.
- No heavy clustering or simulations yet.

**Phase 2: Multi-Issue + Visibility Mechanics**
- Polis-style clustering on votes/endorsements to label groups and surface bridging or distinguishing contributions.
- LiveMap promotion logic (cross-cluster support + gardener input).
- Attention budgets and contribution gates.
- Personal reputation surfaces.

**Phase 3: Simulation Grounding**
- Model attachment and simple runnable artifacts.
- Param comparison across Positions.
- Historical scoring of model runs vs. later data.

**Phase 4: Scale, Integration, Real Use**
- Multiple concurrent Live Issues (prioritize high-recurring civic topics).
- Integration points: exports for local orgs, testimony, candidate briefings.
- Optional: light prediction market hooks or better calibration tooling.
- Gardener governance and jury mechanisms.
- Mobile-friendly or lower-friction participation paths (without sacrificing structure).

**Phase 5 (aspirational)**: Network of maps, cross-Issue synthesis (e.g., housing + transit + fiscal), agent-based "what if the city ran these syntheses" scenario tools.

## Risks and Counters

- **Goodhart and gaming**: Any visible metric will be optimized. Counter: keep reputation multi-dimensional and partially opaque in how it affects visibility; favor hard-to-fake signals (opponent endorsement, actual resolution accuracy, adoption over time); make forking cheap so captured maps can be abandoned.
- **Cold start / quality cliff**: First users and content determine tone. Counter: seed deliberately with high-integrity participants and pre-written strong examples on both sides; invite-only or application for early major Issues; strong copy and onboarding that states the norms explicitly.
- **Complexity tax**: Structured input is harder than tweeting. Counter: excellent defaults, progressive disclosure, AI drafting assistance that is clearly labeled as draft, templates for common civic issue types.
- **Capture by motivated factions**: The usual problem. Counter: clustering + cross-endorsement mechanics make pure factional maps visibly one-sided; reputation requires cross-cluster work; gardeners drawn from multiple clusters.
- **Time cost vs. real life**: Serious dialectic takes hours. Counter: scope tightly (one map per major Issue, not everything); make outputs high-value so the time is worth it to the right people; support asynchronous and partial participation.
- **Epistemic overclaim**: The system can improve the *process* and *artifacts* of reasoning; it does not produce "the truth." Counter: maps should prominently surface remaining uncertainty, value pluralism, and model limitations. Success is better *disagreement* and better-informed participants, not false consensus.

## Open Questions (to be resolved in design and use)

- How public should individual calibration scores be? (Full public creates new status games; fully private weakens accountability.)
- Exact form of attention budgets and gates — too strict kills participation, too loose reintroduces volume.
- Role and limits of LLM assistance — drafting help vs. "the map suggests you missed this objection" vs. full auto-synthesis (the last is dangerous).
- How to handle pure value disagreements where evidence and models are not decisive — the system should make the value conflict *clearer*, not pretend to resolve it.
- Integration with real institutions: when (if ever) should a LiveMap or synthesis carry any formal weight, or is its power always informal and epistemic?

## Relationship to Implementation

This document is the reference. When in doubt, return to THESIS.md and these principles. Prefer designs that make dialectic the path of least resistance for anyone seeking durable status or influence inside the system. Prefer artifacts that remain useful even if the user never returns to the platform.

The implementation will necessarily discover new constraints and opportunities. Update this document (and the thesis if needed) as the model is stress-tested against real issues and real participants. The goal is not a perfect static spec; it is a living architecture that actually moves the civic reasoning substrate in the intended direction.

Current implementation note: the Midtown contributor workbench is Astro-rendered with a small DOM controller rather than a Svelte island. That is an implementation choice, not a product principle; the architectural requirement is that the interactive surface manipulates structured DialecticSession artifacts and leaves an exportable reader artifact intact.
