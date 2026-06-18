import type { Crux, DialecticSession, Evidence, Issue, LiveMap, Position, Simulation } from './domain';

export interface SeededIssueWorkspace {
  slug: string;
  shortTitle: string;
  issue: Issue;
  evidence: Evidence[];
  positions: Position[];
  cruxes: Crux[];
  simulations: Simulation[];
  dialecticSession: DialecticSession;
  liveMap: LiveMap;
}

export const midtownIssue: Issue = {
  id: 'issue_midtown_zoning',
  title: 'How should Midtown zoning change to increase housing production while managing infrastructure strain?',
  description: 'Balancing supply response, infrastructure capacity, and neighborhood impacts in a high-demand inner-ring suburb.',
  scope: 'municipal',
  domainTags: ['housing', 'zoning'],
  valueConflicts: [
    'growth vs. neighborhood character',
    'housing access vs. existing resident protections',
    'short-term supply vs. long-term infrastructure capacity',
  ],
  status: 'active',
  createdAt: '2026-06-01T00:00:00Z',
  lastMajorUpdateAt: '2026-06-04T12:00:00Z',
};

export const midtownEvidence: Evidence[] = [
  {
    id: 'ev_local_study_2024',
    citation: 'Local parcel-level housing supply study, 2024 (City Planning Dept.)',
    quality: 'primary_admin_data',
    excerpt: 'Price elasticity of housing supply in the submarket estimated at -0.25 to -0.40 using parcel-level data 2018-2023.',
    relevanceNotes: 'Supports the pro-upzone supply response assumption; does not settle infrastructure capacity.',
  },
  {
    id: 'ev_fiscal_model_city_2025',
    citation: 'City fiscal impact model, applied to comparable upzone, 2025 (City Finance Office)',
    quality: 'high_quality_gov_report',
    excerpt: 'Median net fiscal impact per unit: -$4,200 over 10 years under baseline assumptions including school capital at $48,000 per added pupil.',
    relevanceNotes: 'Supports the fiscal crux under no-commercial-follow-on assumptions.',
  },
  {
    id: 'ev_school_capital_plan_2024',
    citation: 'School district capital plan, 2024-2030 (School District Planning Office)',
    quality: 'primary_admin_data',
    relevanceNotes: 'Shows no funded seats in this attendance area through 2030; does not include upzone enrollment scenarios.',
  },
];

export const midtownPositions: Position[] = [
  {
    id: 'pos_pro_upzone',
    version: 2,
    issueId: midtownIssue.id,
    authorId: 'Alex / pro-upzone',
    coreClaims: [
      {
        id: 'c1',
        text: 'Upzoning the core 1/2 mile around the station by 2 stories will add 1,800-2,600 units over 7 years with less than 8% traffic impact if paired with modest transit improvements.',
        type: 'predictive',
        confidence: { kind: 'interval', low: 1800, high: 2600 },
        evidenceRefs: ['ev_local_study_2024'],
      },
      {
        id: 'c2',
        text: 'Infrastructure strain is manageable because current underutilization of sewer/water and the new bus rapid transit line provide headroom.',
        type: 'causal_model',
        evidenceRefs: ['ev_local_study_2024'],
      },
    ],
    assumptions: [
      'Price elasticity of housing supply in this submarket is in the -0.25 to -0.4 range.',
      'Most new residents will be net fiscal positive or neutral within 5 years if commercial follow-on materializes.',
      'Current traffic counts have 12-18% spare capacity on key arterials during peak.',
    ],
    evidenceRefs: [
      { evidenceId: 'ev_local_study_2024', relevance: 'Elasticity estimate from parcel-level data 2018-2023' },
    ],
    anticipatedObjections: [
      {
        steelmanSummary: 'Even with new units, infrastructure, especially schools and water pressure at peak, will be strained beyond capacity before any mitigation is built; the traffic model underestimates induced demand from new households.',
        endorsedByOpponents: true,
        response: "We accept the school capacity point as a crux. On traffic we are willing to run the city's ABM with higher induced-demand parameters and publish the delta.",
      },
    ],
    cruxesIdentified: ['crux_school_capacity', 'crux_induced_traffic'],
    attachedModelRefs: ['sim_pro_upzone_traffic'],
    createdAt: '2026-06-02T10:00:00Z',
    updatedAt: '2026-06-03T14:30:00Z',
  },
  {
    id: 'pos_concerned',
    version: 3,
    issueId: midtownIssue.id,
    authorId: 'Jordan / concerned-growth',
    coreClaims: [
      {
        id: 'c3',
        text: 'The marginal infrastructure cost per new unit in the core exceeds marginal revenue under current impact fee schedules; net fiscal impact turns negative above about 900 added units without fee reform.',
        type: 'predictive',
        confidence: { kind: 'interval', low: 700, high: 1200 },
        evidenceRefs: ['ev_fiscal_model_city_2025'],
      },
      {
        id: 'c4',
        text: 'Character and tree canopy losses from 2-story upzones are not fully mitigable by design standards and will be perceived as a quality-of-life decline by long-term residents.',
        type: 'value',
      },
    ],
    assumptions: [
      'School district capital plan has no new seats funded in this attendance area for 6+ years.',
      'Induced VMT per new household is 15-25% higher than the regional average due to limited east-west transit.',
      'Commercial follow-on development did not materialize in the last two comparable upzones.',
    ],
    evidenceRefs: [
      { evidenceId: 'ev_fiscal_model_city_2025', relevance: 'City fiscal impact model for similar upzone' },
      { evidenceId: 'ev_school_capital_plan_2024', relevance: 'School capacity constraint through 2030' },
    ],
    anticipatedObjections: [
      {
        steelmanSummary: 'New housing will eventually pay for itself through increased property tax base and the BRT will absorb most new trips; design standards plus tree replacement requirements can protect character.',
        endorsedByOpponents: false,
        response: 'The tax base argument assumes commercial follow-on development that has not materialized in the last two upzones. We want actual absorption numbers before accepting the claim.',
      },
    ],
    cruxesIdentified: ['crux_school_capacity', 'crux_fiscal_net'],
    attachedModelRefs: ['sim_concerned_fiscal'],
    createdAt: '2026-06-02T11:15:00Z',
    updatedAt: '2026-06-04T09:00:00Z',
  },
];

export const midtownCruxes: Crux[] = [
  {
    id: 'crux_school_capacity',
    description: 'Whether local elementary and middle schools can absorb 400-700 additional students without portable classrooms or boundary changes within 5 years.',
    type: 'factual',
    status: 'open',
    mattersTo: ['pos_pro_upzone', 'pos_concerned'],
  },
  {
    id: 'crux_induced_traffic',
    description: 'Whether the city ABM with updated induced-demand parameters shows more than 10% degradation on the two main north-south arterials.',
    type: 'model',
    status: 'open',
    mattersTo: ['pos_pro_upzone', 'pos_concerned'],
  },
  {
    id: 'crux_fiscal_net',
    description: 'Net present fiscal impact per new unit over 10 years once direct impact fees and full marginal service costs, including schools, are included.',
    type: 'model',
    status: 'partially_addressed',
    mattersTo: ['pos_concerned'],
  },
  {
    id: 'crux_character_canopy',
    description: 'Whether character and tree-canopy losses from a 2-story upzone deserve enough weight to constrain the housing target even after mitigation.',
    type: 'value',
    status: 'open',
    mattersTo: ['pos_concerned'],
  },
];

export const midtownSimulations: Simulation[] = [
  {
    id: 'sim_pro_upzone_traffic',
    label: 'Pro-upzone traffic model v1.2',
    description: 'City ABM subset for Midtown core and two arterials. Params taken from pos_pro_upzone assumptions.',
    embodyingPositionIds: ['pos_pro_upzone'],
    params: { added_units: 2200, elasticity: -0.32, induced_vmt_factor: 1.12 },
    lastRun: { at: '2026-06-03T18:00:00Z', resultSummary: 'Peak arterial volume +6.4% (5-95%: +3.1% to +9.8%)' },
  },
  {
    id: 'sim_concerned_fiscal',
    label: 'Concerned fiscal impact model',
    description: '10-year NPV per unit using city fiscal model and school capital schedule.',
    embodyingPositionIds: ['pos_concerned'],
    params: { added_units: 1800, school_capital_per_pupil: 48000, impact_fee_per_unit: 18500 },
    lastRun: { at: '2026-06-04T08:30:00Z', resultSummary: 'Median net fiscal per unit: -$4,200 over 10y (range depends on commercial follow-on)' },
  },
];

export const midtownDialecticSession: DialecticSession = {
  id: 'dialectic_midtown_zoning_001',
  issueId: midtownIssue.id,
  participantPositionIds: ['pos_pro_upzone', 'pos_concerned'],
  phase: 'synthesis_attempt',
  phaseArtifacts: {
    presentationNotes: [
      {
        positionId: 'pos_pro_upzone',
        strongestClaim: 'A station-area 2-story upzone can produce enough new homes to matter while staying under the city traffic significance threshold.',
        declaredUncertainty: 'School capacity is not yet proven under the 2,200-unit scenario.',
        whatWouldChangeMind: 'A district projection showing unavoidable boundary changes or portable classrooms without a funded mitigation path.',
      },
      {
        positionId: 'pos_concerned',
        strongestClaim: 'The proposal becomes fiscally and institutionally irresponsible above roughly 900 units unless impact fees and school capacity are settled first.',
        declaredUncertainty: 'Commercial follow-on development could change the fiscal model if actual absorption data supports it.',
        whatWouldChangeMind: 'Published absorption data from comparable upzones plus a funded school capacity commitment.',
      },
    ],
    crossSteelmans: [
      {
        id: 'steelman_pro_of_concerned',
        fromPositionId: 'pos_pro_upzone',
        targetPositionId: 'pos_concerned',
        summary: 'The concerned-growth position is not simply anti-housing. It argues that the public sector has not priced or funded the marginal infrastructure load, especially schools, and that pushing beyond about 900 units before those commitments exist transfers risk to families already in the attendance area.',
        targetResponse: 'accepted',
        targetNote: 'Accepted as fair because it names the school-capacity transfer, not just generic neighborhood discomfort.',
        acceptedAt: '2026-06-05T17:30:00Z',
      },
      {
        id: 'steelman_concerned_of_pro',
        fromPositionId: 'pos_concerned',
        targetPositionId: 'pos_pro_upzone',
        summary: 'The pro-upzone position treats housing exclusion as an immediate harm and argues that infrastructure risk can be handled through enforceable conditions rather than by preserving a zoning status quo that already fails new households.',
        targetResponse: 'needs_revision',
        targetNote: 'Close, but it should include the claim that BRT headroom and sewer/water spare capacity make the timing risk manageable.',
      },
    ],
    cruxPriorities: [
      {
        cruxId: 'crux_school_capacity',
        priority: 1,
        selectedByPositionIds: ['pos_pro_upzone', 'pos_concerned'],
        whyLoadBearing: 'Both positions name this as the fact that determines whether the upzone can proceed now or must be contingent.',
        wouldMoveIf: 'A district projection with and without the upzone through 2031, including funded mitigation commitments.',
      },
      {
        cruxId: 'crux_induced_traffic',
        priority: 2,
        selectedByPositionIds: ['pos_pro_upzone', 'pos_concerned'],
        whyLoadBearing: "Both sides accept the city ABM; the live disagreement is the induced-VMT multiplier.",
        wouldMoveIf: 'A joint ABM run at the concerned side 1.25 multiplier remains below or crosses the 10% significance threshold.',
      },
      {
        cruxId: 'crux_fiscal_net',
        priority: 3,
        selectedByPositionIds: ['pos_concerned'],
        whyLoadBearing: 'This determines whether fee reform is a prerequisite or a parallel improvement.',
        wouldMoveIf: 'Actual commercial follow-on absorption from the 2018 and 2021 upzones is published and incorporated into the fiscal model.',
      },
    ],
    focusedWork: [
      {
        id: 'work_school_projection',
        cruxId: 'crux_school_capacity',
        kind: 'evidence_request',
        title: 'Request district enrollment projection with upzone scenario',
        status: 'in_progress',
        ownerPositionId: 'pos_concerned',
        notes: 'The output must distinguish current capital plan capacity from funded mitigation capacity.',
      },
      {
        id: 'work_joint_abm',
        cruxId: 'crux_induced_traffic',
        kind: 'model_run',
        title: 'Run city ABM with induced-VMT multiplier at 1.25',
        status: 'not_started',
        ownerPositionId: 'pos_pro_upzone',
        simulationRef: 'sim_pro_upzone_traffic',
        notes: 'If the run stays under 10%, the traffic objection weakens. If it crosses 10%, phasing or mitigation must be part of any synthesis.',
      },
      {
        id: 'work_value_weighting',
        cruxId: 'crux_character_canopy',
        kind: 'value_clarification',
        title: 'Separate factual canopy loss from value weighting',
        status: 'complete',
        notes: 'Both sides agree loss occurs; the remaining disagreement is how much weight to give place-continuity relative to access for excluded households.',
      },
    ],
    synthesisAttempt: {
      id: 'synth_midtown_phased_upzone',
      title: 'Phased 2-story upzone with infrastructure triggers',
      synthesizedFromPositionIds: ['pos_pro_upzone', 'pos_concerned'],
      sharedCommitments: [
        'Housing demand is real and new supply is needed.',
        'School capacity is a real constraint, not a rhetorical shield.',
        'Impact fee reform should be attached to any high-unit scenario.',
      ],
      policyMove: 'Phase 1 allows up to about 900 units near the station while impact-fee reform starts immediately; Phase 2 unlocks the full 1,800-2,600 unit target only after a funded school-capacity commitment and joint ABM run are published.',
      unresolvedTradeoffs: [
        'Pro-upzone side worries the trigger lets institutions delay housing through inaction.',
        'Concerned side worries Phase 1 still creates irreversible character and canopy losses.',
      ],
      adoptionSignals: [
        {
          positionId: 'pos_pro_upzone',
          response: 'would_adopt_with_caveats',
          caveat: 'Needs a deadline or default approval if the district refuses to publish projections.',
        },
        {
          positionId: 'pos_concerned',
          response: 'would_adopt_with_caveats',
          caveat: 'Needs binding fee reform before Phase 1 entitlements, not just before Phase 2.',
        },
      ],
    },
  },
  outputs: {
    updatedPositionIds: ['pos_pro_upzone', 'pos_concerned'],
    newCruxIds: ['crux_character_canopy'],
    synthesisCandidateId: 'synth_midtown_phased_upzone',
  },
  startedAt: '2026-06-05T15:00:00Z',
};

export const midtownLiveMap: LiveMap = {
  id: 'livemap_midtown_zoning',
  issueId: midtownIssue.id,
  version: 3,
  keyPositionIds: ['synth_midtown_phased_upzone', 'pos_pro_upzone', 'pos_concerned'],
  prominentCruxIds: [
    'crux_school_capacity',
    'crux_induced_traffic',
    'crux_fiscal_net',
    'crux_character_canopy',
  ],
  evidenceSummary:
    'The live map has narrowed the dispute to three obtainable evidence/model gaps and one irreducible value tradeoff.',
  modelComparisons:
    'The pro-upzone traffic run stays below the city significance threshold at a 1.12 induced-VMT multiplier; the concerned fiscal run is negative under current fees and no commercial follow-on assumptions.',
  openQuestions: [
    'Whether the school district can publish a funded enrollment projection through 2031.',
    'Whether the joint ABM run crosses the city 10% peak-volume significance threshold at a 1.25 induced-VMT multiplier.',
    'Whether city-held commercial absorption data changes the sign of the fiscal model.',
  ],
  lastUpdatedAt: '2026-06-15T12:00:00Z',
  gardenerIds: ['gardener_cross_cluster_midtown'],
};

export const midtownZoningWorkspace: SeededIssueWorkspace = {
  slug: 'midtown-zoning',
  shortTitle: 'Midtown zoning',
  issue: midtownIssue,
  evidence: midtownEvidence,
  positions: midtownPositions,
  cruxes: midtownCruxes,
  simulations: midtownSimulations,
  dialecticSession: midtownDialecticSession,
  liveMap: midtownLiveMap,
};
