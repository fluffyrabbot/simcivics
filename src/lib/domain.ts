/**
 * simcivics domain model
 *
 * This is the source of truth for the core entities described in ARCHITECTURE.md.
 * Keep it narrow and precise. Add new concepts only when they survive contact
 * with the thesis and the principles (maps > threads, opponent-endorsed charity,
 * multi-dimensional reputation, structure enforced, simulation grounding, etc.).
 */

export type ID = string;

/** A recurring or time-bound civic policy/value question. */
export interface Issue {
  id: ID;
  title: string;
  description: string;
  scope: 'municipal' | 'county' | 'state' | 'federal' | 'cross-jurisdictional';
  domainTags: string[]; // e.g. ['housing', 'zoning', 'fiscal']
  valueConflicts: string[]; // explicit competing values, e.g. ['growth vs. neighborhood character', 'liberty vs. order']
  status: 'active' | 'synthesizing' | 'stable' | 'archived';
  createdAt: string; // ISO
  lastMajorUpdateAt: string;
}

/** Atomic proposition. Typed so we can route evidence, models, and resolution appropriately. */
export type ClaimType = 'empirical' | 'predictive' | 'value' | 'causal_model' | 'definitional';

export interface Claim {
  id: ID;
  text: string;
  type: ClaimType;
  confidence?: Confidence; // interval or qualitative
  /** References to Evidence that are claimed to bear on this. */
  evidenceRefs: ID[];
}

/** Structured confidence — intervals preferred for anything quantitative. */
export interface Confidence {
  kind: 'interval' | 'qualitative';
  low?: number;
  high?: number;
  point?: number;
  label?: string; // e.g. "medium-high", "depends heavily on elasticity assumption"
}

/** Source material with quality and relevance metadata. */
export type EvidenceQuality =
  | 'primary_admin_data'
  | 'peer_reviewed'
  | 'high_quality_gov_report'
  | 'high_quality_think_tank'
  | 'journalism'
  | 'other';

export interface Evidence {
  id: ID;
  citation: string;
  uri?: string;
  excerpt?: string;
  date?: string;
  quality: EvidenceQuality;
  /** Community or gardener rating of whether this is being used appropriately. */
  relevanceNotes?: string;
}

/** A load-bearing point of disagreement that would move at least one side if resolved. */
export type CruxType = 'factual' | 'model' | 'value';

export interface Crux {
  id: ID;
  description: string;
  type: CruxType;
  status: 'open' | 'partially_addressed' | 'resolved_by_evidence' | 'resolved_by_agreement_to_disagree' | 'moot';
  /** Which Positions treat this as load-bearing. */
  mattersTo: ID[];
}

/** A structured, versioned stance on an Issue. */
export interface Position {
  id: ID;
  version: number;
  issueId: ID;
  authorId: ID;
  /** The main claims this position advances. */
  coreClaims: Claim[];
  /** Explicit premises — some testable, some value. */
  assumptions: string[];
  /** Evidence attachments with context. */
  evidenceRefs: Array<{ evidenceId: ID; relevance: string }>;
  /** The critical section for dialectic: how this position represents and answers the strongest opposing case. */
  anticipatedObjections: Array<{
    steelmanSummary: string;
    /** Has the party being steelmanned endorsed this representation as fair? */
    endorsedByOpponents?: boolean;
    response?: string;
  }>;
  /** Cruxes this position identifies as decisive. */
  cruxesIdentified: ID[];
  /** Links to runnable or parameterizable models that instantiate this position's assumptions. */
  attachedModelRefs: ID[];
  /** If this Position is an attempt to integrate others. */
  synthesisOf?: ID[];
  /** Parent for forking/version history. */
  parentVersionId?: ID;
  createdAt: string;
  updatedAt: string;
}

/** A time- or milestone-bounded structured collaboration between opposing Positions. */
export type DialecticPhase =
  | 'presentation'
  | 'cross_steelman'
  | 'crux_identification'
  | 'focused_work'
  | 'synthesis_attempt'
  | 'complete';

export interface DialecticSession {
  id: ID;
  issueId: ID;
  participantPositionIds: ID[];
  phase: DialecticPhase;
  /** Structured outputs that feed the map. */
  outputs: {
    updatedPositionIds: ID[];
    newCruxIds: ID[];
    synthesisCandidateId?: ID;
  };
  startedAt: string;
  completedAt?: string;
}

/** Executable or parameterizable model attached to claims/positions. */
export interface Simulation {
  id: ID;
  label: string;
  description: string;
  /** Which Position's assumptions this run embodies (or a merged set). */
  embodyingPositionIds: ID[];
  /** For simple cases: documented params + formula description. */
  params: Record<string, number | string>;
  /** Reproducible run result (distribution or point + metadata). */
  lastRun?: {
    at: string;
    resultSummary: string;
    raw?: unknown;
  };
  /** Link to code / notebook / Pyodide bundle if richer execution. */
  implementationRef?: string;
}

/** Multi-dimensional reputation. No single number. */
export interface Reputation {
  userId: ID;
  calibration: {
    brierScore?: number;
    intervalCoverage?: number;
    resolvedClaimCount: number;
  };
  charity: {
    steelmanEndorsementsReceived: number;
    fairSteelmansProvided: number;
  };
  updateQuality: {
    documentedRevisions: number;
    peerRatedHighIntegrity: number;
  };
  synthesisInfluence: {
    timesAdoptedInLaterSyntheses: number;
  };
  rigor: {
    avgSourceQuality: number;
    explicitAssumptionsRate: number;
  };
  /** Per-domain if we want to avoid halo effects. */
  domains?: Record<string, Partial<Reputation>>;
}

/** Structured signals that actually move status and visibility (not generic likes). */
export type EndorsementType =
  | 'fair_steelman_of_my_side'
  | 'evidence_actually_supports_claim'
  | 'evidence_does_not_support_claim'
  | 'this_crux_is_load_bearing_for_me'
  | 'would_adopt_this_synthesis'
  | 'prediction_resolved_as_expected';

export interface Endorsement {
  id: ID;
  type: EndorsementType;
  fromUserId: ID;
  targetPositionId?: ID;
  targetClaimId?: ID;
  targetCruxId?: ID;
  targetEvidenceId?: ID;
  note?: string;
  createdAt: string;
}

/** A user's public (or semi-public) contribution and calibration history. */
export interface User {
  id: ID;
  displayName: string; // pseudonymous by default
  createdAt: string;
  reputation: Reputation;
  /** For later: real-name verification layer on specific high-stakes work. */
  verification?: {
    level: 'none' | 'pseudonym_history' | 'verified_civic_participant';
    details?: string;
  };
}

/** The promoted current best structure for an Issue. */
export interface LiveMap {
  id: ID;
  issueId: ID;
  version: number;
  keyPositionIds: ID[]; // including leading syntheses
  prominentCruxIds: ID[];
  evidenceSummary: string;
  modelComparisons: string;
  openQuestions: string[];
  lastUpdatedAt: string;
  gardenerIds: ID[]; // high-rep cross-cluster maintainers
}

/**
 * Helper: minimal factory for a clean Position skeleton.
 * Enforces the structure that makes rhetoric harder than dialectic.
 */
export function createPositionSkeleton(issueId: ID, authorId: ID): Omit<Position, 'id' | 'createdAt' | 'updatedAt'> {
  return {
    version: 1,
    issueId,
    authorId,
    coreClaims: [],
    assumptions: [],
    evidenceRefs: [],
    anticipatedObjections: [{
      steelmanSummary: '',
      endorsedByOpponents: false,
    }],
    cruxesIdentified: [],
    attachedModelRefs: [],
  };
}

/**
 * Type guard / narrowing helpers can go here as the model grows.
 * Keep the surface small until we have real usage.
 */
