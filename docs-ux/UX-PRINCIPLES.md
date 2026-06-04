# UX Principles (draft)

> Working draft. This document translates the v3 thesis into interface principles
> for keeping simcivics focused, low-friction, and specific without flattening the
> real complexity of civic reasoning. It should be iterated against prototypes and
> user sessions, not treated as final doctrine.

## Purpose

simcivics should feel less like a debate platform and more like a focused
claim-workbench. At any moment, the user should know which dialectical unit they
are improving: a `Claim`, `Evidence` relation, `Assumption`, `Challenge`,
`Crux`, `ValueTradeoff`, `Revision`, `Simulation`, or `Synthesis`.

The default experience should reduce cognitive overhead by keeping one unit in
hand. The deeper graph must still be traversable, because interconnections are
often the point. Clean UX here means **focus by default, graph access on demand**,
not hiding complexity permanently.

## Load-Bearing Principles

### 1. One Dialectical Unit In Hand

The primary interaction should usually ask the user to work on one thing:

- state one claim;
- attach one piece of evidence to one claim;
- identify one assumption;
- restate one opposing view;
- propose one crux;
- revise one confidence;
- compare one model parameter;
- endorse or reject one steelman as fair.

This follows the spirit of public-service question-page patterns: each step
should make clear what is being asked, why it matters, and what happens next.
For simcivics, "one thing" means one dialectical object, not necessarily one text
field.

### 2. Graph Complexity Is A Layer, Not The Default Surface

The claim graph is the substrate, so the interface cannot pretend civic reasoning
is linear. However, the graph should not be the first burden placed on the user.

Default surface:

- a single active unit;
- its immediate parent and child context;
- the next valid actions for that unit;
- the current workspace stage.

Toggleable graph layer:

- reveal upstream assumptions, downstream claims, sibling challenges, linked
  evidence, crux dependencies, and affected syntheses;
- support traversal by relationship type, not only by visual proximity;
- make the user's current unit remain visually anchored while the surrounding
  graph appears;
- let users collapse back to the focused unit without losing state.

The graph layer should answer: "Why does this unit matter, and what else changes
if it moves?"

### 3. Show Structure, Hide Ceremony

The system needs typed contributions, but users should not be asked to memorize
the taxonomy before making a useful move. Start with natural tasks, then infer or
ask for type.

Better first prompts:

- "What claim should the map include?"
- "What would change your mind about this?"
- "What evidence bears on this?"
- "What is the strongest version of the opposing concern?"

Only then ask for structure:

- factual, model, value, definitional, or policy?
- support, challenge, limitation, or uncertainty?
- confidence as interval, point estimate, or qualitative label?
- crux for you, for another cluster, or both?

The taxonomy should feel like a scaffold appearing at the moment it helps.

### 4. Specificity Nudges Should Repair, Not Scold

The interface should nudge toward specificity without making users feel managed.
Avoid generic admonitions like "be more specific." Offer small concrete repairs.

Good nudges:

- "Add a jurisdiction or place."
- "Add a time horizon."
- "Name the population affected."
- "Add a measurable threshold."
- "Split the prediction from the value judgment."
- "Turn this into an if-then claim."
- "What observation would make this weaker?"
- "Is this about facts, model behavior, or value weighting?"

When possible, offer inline transformations:

- "This looks like two claims. Split?"
- "This says 'harmful.' Harmful to whom?"
- "This prediction needs a time range."
- "This value conflict may be `housing access vs. neighborhood character`."

The tone should be quiet and collaborative: the product is helping the user make
the map sharper.

### 5. Context Should Travel With The Unit

Users should not have to remember what a claim means while reading evidence or
responding to a challenge. Keep compact context attached to the active object:

- claim text;
- type;
- current confidence;
- linked evidence count;
- strongest live challenge;
- known crux status;
- last meaningful revision;
- current workspace stage.

This avoids split attention. If the user opens evidence, the claim remains
visible. If the user opens a crux, the claims it matters to remain visible. If the
user edits a steelman, the opposing claim remains visible.

### 6. Worked Examples First, Guidance Fades Later

Novices need examples more than abstractions. Each workspace should include a few
seeded examples that model the expected granularity.

Example pattern:

- vague: "Upzoning will help housing."
- better: "Upzoning the station half-mile by two stories will add 1,800-2,600
  units over seven years if permitting timelines stay below nine months."

As users become more experienced, examples can collapse into small hints or be
hidden by default. The goal is not to keep people in a wizard forever; the goal is
to build fluency until the graph itself becomes readable.

### 7. Uncertainty Is A Normal Input

simcivics should make uncertainty feel ordinary. Users should be able to say:

- "I do not know";
- "I am not sure";
- "this depends on a model";
- "this is a value tradeoff";
- "this evidence is relevant but limited";
- "this would move me only somewhat";
- "this crux is irreducible for now."

The interface should treat honest uncertainty as map progress. A clean
irreducible value crux is not a failed debate; it is a useful public artifact.

### 8. No Gallery During Cognition

The user should not feel watched while doing hard reasoning. During drafting,
rebuttal, steelmanning, double-crux, or revision:

- no public applause mechanics;
- no raw vote totals;
- no follower-like status cues;
- no engagement ranking;
- no live dunking surface;
- no same-cluster popularity as standing.

The public thing is the improved artifact: the `LiveMap`, `Synthesis`, crux list,
evidence ledger, tradeoff matrix, or exportable briefing.

### 9. Reader And Contributor UX Must Be Different

Most people will not do structured dialectic. The reader layer should not expose
the full contributor interface by default.

Reader layer should foreground:

- what is agreed;
- what remains contested;
- what would change minds;
- which disagreements are factual, model-based, or value-based;
- the strongest argument for each major position;
- live cruxes;
- decision-relevant uncertainties;
- policy options and tradeoffs.

Contributor layer should foreground:

- the active unit;
- required structure;
- fairness gates;
- evidence relation quality;
- revision history;
- graph dependencies;
- synthesis impact.

The reader layer is the civic public good. The contributor layer is the workshop
that produces it.

### 10. Traversal Should Be Deliberate, Not Ambient

When users need complexity, give them purposeful paths through it:

- "show assumptions behind this claim";
- "show challenges that target this evidence";
- "show claims affected by this crux";
- "show where this value tradeoff appears";
- "show model parameters that decide this disagreement";
- "show syntheses that adopted this contribution";
- "show unresolved work downstream."

Do not rely on a hairball graph as the main discovery mechanism. The graph view
should be a navigable instrument with typed edges, filters, and stable anchoring.

## Candidate Interface Pattern: Focus + Traverse

The core contributor screen can be modeled as:

1. **Focus pane**: the one active unit and its edit/review controls.
2. **Local context rail**: immediate parent, children, status, and next action.
3. **Graph toggle**: expands a typed dependency layer around the active unit.
4. **Stage marker**: framing, claim mapping, evidence mapping, crux discovery,
   tradeoff analysis, option generation, stress test, or public artifact.
5. **Artifact preview**: how this unit currently affects the reader-facing map.

This pattern keeps attention narrow while preserving the substrate's
interconnections.

## Anti-Patterns

- Starting users on a full graph view before they know what job they are doing.
- Treating "simple" as "low information."
- Asking users to classify every object before they can write anything useful.
- Hiding important dependencies so the map becomes falsely linear.
- Making specificity nudges sound like moderation warnings.
- Showing popularity while people are still reasoning.
- Presenting unresolved value conflict as a defect to be smoothed away.
- Making readers use contributor tools just to understand the current map.

## Design Questions To Resolve In Prototype

- What is the smallest active unit that still feels meaningful: claim, claim plus
  reason, or claim plus immediate evidence relation?
- Does the graph toggle work better as a side panel, overlay, canvas, or inline
  expansion?
- Which specificity nudges feel helpful versus overbearing?
- When should the system ask for claim type explicitly, and when should it infer
  and offer a correction?
- How much local context can stay visible before focus breaks?
- What reader-facing summary makes a non-participant smarter in 20-40 minutes?

## Source Threads

- GOV.UK Design System, "Question pages":
  https://design-system.service.gov.uk/patterns/question-pages/
- Nielsen Norman Group, "Progressive Disclosure":
  https://www.nngroup.com/articles/progressive-disclosure/
- Nielsen Norman Group, "10 Usability Heuristics for User Interface Design":
  https://www.nngroup.com/articles/ten-usability-heuristics/
- W3C WAI, "Help Users Focus":
  https://www.w3.org/WAI/WCAG2/supplemental/objectives/o5-user-focus/
- Polis documentation, "Overview":
  https://pol-is.github.io/polis-documentation/welcome/Overview.html
- Polis documentation, "How to read the visualization":
  https://pol-is.github.io/polis-documentation/visualization/HowToRead.html
- LessWrong / CFAR, "Double Crux":
  https://www.lesswrong.com/posts/WLQspe83ZkiwBc2SR/double-crux
- Paas and van Merrienboer, "Cognitive-Load Theory: Methods to Manage Working
  Memory Load in the Learning of Complex Tasks":
  https://journals.sagepub.com/doi/10.1177/0963721420922183
- Chang, Lin, and Hwang, "Charting the field: a review of argument visualization
  research for writing, learning, and reasoning":
  https://www.frontiersin.org/journals/education/articles/10.3389/feduc.2025.1672105/full

---

# Amendments — Round 2 (independent pass)

> This section is a second, independently-authored pass over the draft above. The
> original ten principles are left intact; this layer records where I agree, where
> I think the draft is load-bearing-incomplete, and the additions I'd make. Same
> status as the rest: iterate against prototypes, not doctrine.

**Overall assessment.** The draft is a strong design of the *solo contributor
workbench* — focus-by-default, deferred typing, repair-not-scold nudges, no gallery
during cognition. That half is in good shape. Its gaps are concentrated in four
places the thesis says matter most: (1) the **reader layer**, which is where civic
reach actually happens and is barely designed; (2) the **dialogic moves** (ITT gate,
double-crux, steelman), which are relational and don't fit "one unit in hand"; (3)
the **emotional UX of the ITT gate**, the single hardest moment in the system; and
(4) **where legitimate status lives**, which principle 8 removes without designing
its replacement. The amendments below target those.

### A. The reader layer is the under-designed half — and it is the product

The thesis is explicit that reach comes from a *large reader layer consuming
artifacts* produced by a small contributor layer, and the headline success criterion
("a stranger is materially better-modeled in 20–40 minutes") is a **reader** problem.
The draft enumerates what the reader layer *foregrounds* (principle 9) but designs no
reader *experience*. This is the biggest gap.

- The reader artifact is a **readable document, not a graph.** A non-participant
  should never be handed a node-link diagram. The default is prose-plus-structure: a
  narrative of the question, the agreed core, the live disagreements *named and
  attributed to their type* (factual / model / value), the strongest case for each
  position in its own best words, the cruxes, and the decision-relevant uncertainty.
- It must be **legible without any contributor tooling, fully keyboard- and
  screen-reader navigable, and good on a phone.** Civic comprehension cannot require
  a mouse, a large screen, or a graph view (see I).
- Design **"what changed since you last looked"** for returning readers — the map is
  versioned, so a reader-facing changelog ("the fiscal crux was resolved by new data;
  two positions converged on X") is high-value and cheap from the event log.
- **Make cross-partisan agreement the visual spine.** The most trustworthy thing a
  reader can see is "people who disagree on everything else agree on this." This is
  the Community-Notes/Polis insight and it belongs at the *top* of the reader
  artifact, not buried. (Added source threads below.)

### B. The ITT gate is the hardest UX moment in the system — design it explicitly

The API makes an opposing-cluster-accepted restatement a **precondition to rebut.**
That is the most friction-heavy, most ego-threatening, most rage-quit-prone moment in
the entire product, and the draft does not touch it. It needs first-class design:

- Frame it as **craft and respect, not a toll.** "Show them you understand before you
  push back" must read as the high-status, skilled move — not as gatekeeping by the
  other side.
- A `misses` verdict must never feel like a dunk. Pair it with **what specifically was
  missed**, structurally (the gate produces a repair, like principle 4's nudges), and
  keep the exchange **out of any public/gallery surface** while it happens.
- Make it **reciprocal and visible-as-mutual**: both sides steelman; the UI shows it
  as a two-way craft exchange, not a one-way exam the other side grades.
- Provide the **AI-provisional verdict path** (from the API) as a *non-blocking*
  fallback so a contributor is never stuck waiting on a hostile human to unlock their
  ability to disagree — clearly labeled provisional, overridable by a real holder.

### C. Where legitimate status lives (resolve the principle-8 tension)

Principle 8 correctly removes *all* status cues during cognition — but the thesis also
says **mind-change is the highest-status act** and that endorsed steelmans /
calibration / cross-cluster adoption *are* the real currency. The draft removes the
bad status surface without designing the good one. Resolution:

- The **only** status surface is the **retrospective personal track record** — a
  profile, not a live counter. It is *asynchronous, never in the reasoning flow, and
  never comparative-leaderboard by default.*
- It celebrates exactly the hard-to-fake signals: updates given/received, steelmans
  the other side endorsed, calibration on resolved claims, contributions adopted
  across clusters. **Never** followers, never same-cluster popularity, never volume.
- Refinement to focus+traverse #5 ("artifact preview"): show **epistemic** impact
  ("this makes the fiscal claim contested / clarifies the value crux"), *not*
  attention impact. A live "who's looking / how popular" preview would quietly
  reintroduce the gallery.

### D. Async re-engagement without a gallery

The system is deliberately slow ("speed is the enemy"), which creates a real risk:
people contribute once and never return, and a deliberation that never reconvenes
produces nothing. The draft has no re-engagement loop. Notifications are the lever —
but they must **pull toward work that needs the person, never toward applause:**

- "Your steelman received a verdict." "A crux you marked load-bearing has new
  evidence." "A prediction you scored resolved." "A double-crux you're in advanced."
- Explicitly *not*: "N people viewed/liked your contribution." The notification
  taxonomy is itself a thesis commitment.

### E. Paired dialectic is a distinct mode — "one unit in hand" is insufficient

Principle 1 is right for solo work (claim, evidence, assumption) but the *heart* of
the thesis is relational: steelman, ITT gate, double-crux are **two-party** searches.
These need their own mode — a shared, side-by-side surface where both parties' state
is co-visible (each side's flip-belief in double-crux; both steelmans), with the
target view anchored. Treating these as "one unit" flattens the dialogue that is the
actual point. Add a **Paired Session** pattern alongside Focus+Traverse.

### F. Psychological safety is the cross-cutting emotional law

Almost every core move asks something ego-threatening: admit uncertainty, restate an
opponent generously, concede a point, change your mind in public. Principle 4 applies
the right tone to *nudges*; generalize it. **The entire emotional design must be
face-saving and low-stakes:** reasoning happens in semi-private cohorts, updates are
framed as progress not defeat, concessions are never broadcast as "you lost," and the
public artifact surfaces *resolutions*, not who-caved. This is one principle
underneath uncertainty, ITT, and revision at once — name it so it isn't re-decided
ad hoc per screen.

### G. System legibility: AI transparency + honest pending states

A civic tool dies the moment it feels manipulable, partisan, or broken. Two concrete
UX obligations the draft omits:

- **AI is always labeled, reasoned, and contestable in-line.** Every suggestion shows
  it is AI, *why* it was offered, and a one-click "this is wrong" that is recorded.
  AI never appears as authority or as an unmarked default contribution. (The API
  already logs every intervention; the UI must expose that provenance, not hide it.)
- **Honest pending states.** Persistence is CQRS with lagging projections — a
  contribution may not be instantly reflected. Design optimistic UI with clear
  "recording…/recorded" states so async never reads as data loss. Never show a
  confident final state the backend hasn't durably accepted.

### H. Accessibility, mobile, and lightweight moves are a civic obligation, not polish

Civic participation must not require perfect vision, motor control, a desktop, or high
verbal-structuring skill. Concretely:

- The **reader artifact and all light contributor actions** (endorse a steelman as
  fair, mark a crux load-bearing, rate evidence relevance, register confidence) must
  be **fully usable on a phone and without the graph view at all.** Heavy authoring
  and model-running can remain desktop.
- This is also the **on-ramp**: lightweight, mobile, low-skill moves are how the
  reader layer converts a few readers into first-time contributors.

### I. Engineer the first-session "aha"

Nothing here designs *why a newcomer does the hard thing instead of tweeting.* The
first session must deliver a felt, novel payoff that no other platform gives:
**getting the other side to endorse your summary of their own view**, or **locating
the exact point your disagreement actually turns on.** Design that moment
deliberately as the activation event; fluency-building (principle 6) is necessary but
not sufficient without a payoff.

### Tensions / open questions I'd add for prototype

- How does the ITT gate fail *gracefully* when the other side is absent, slow, or
  acting in bad faith, without either blocking honest disagreement or letting the gate
  be bypassed into strawmanning?
- What is the reader artifact's canonical *form* — briefing doc, "explorable
  explanation," or layered summary→detail? (A/B this against the 20–40-min criterion.)
- Where exactly is the boundary between "semi-private cohort" and "public artifact,"
  and how is the transition communicated so people know when they're on record?
- Does the track-record profile create a *new* status game even when async and
  non-comparative? What is the minimum visible to keep accountability without
  reintroducing performance?

### Added source threads

- X / Community Notes (formerly Birdwatch) — bridging-based ranking; the largest
  real-world deployment of "only surface what earns agreement across people who
  usually disagree." Directly relevant to the reader artifact's spine (A) and to
  making cross-partisan endorsement legible: https://communitynotes.x.com/
- Wikipedia, "Help:Page history" — the canonical reader-trust-through-transparent-
  provenance pattern ("view history"): https://en.wikipedia.org/wiki/Help:Page_history
- Bret Victor, "Explorable Explanations" — a candidate form for the reader artifact
  (active reading over passive prose): https://worrydream.com/ExplorableExplanations/
- Nielsen Norman Group, "Can't-Unsee / recognition over recall" and gamification
  cautions — for the track-record surface (C) avoiding new status games:
  https://www.nngroup.com/articles/gamification/
