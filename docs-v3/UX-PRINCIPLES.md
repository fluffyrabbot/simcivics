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
