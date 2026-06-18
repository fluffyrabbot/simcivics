import type { Crux, Position, Simulation } from './domain';
import type {
  AttachedModelSummary,
  BriefingMap,
  BriefingMapNode,
  CruxStatus,
  PolicyOption,
  ReaderArtifactProps,
  ReaderCase,
  ReaderDisagreement,
  ReaderEvidence,
  Uncertainty,
} from './reader-types';
import type { SeededIssueWorkspace } from './seeded-issue-workspace';

const cruxReaderLabels: Record<string, string> = {
  crux_school_capacity: 'School capacity',
  crux_induced_traffic: 'Induced VMT',
  crux_fiscal_net: 'Net fiscal impact',
  crux_character_canopy: 'Character and tree canopy',
};

const sideLabels: Record<string, string> = {
  pos_pro_upzone: 'Pro-upzone',
  pos_concerned: 'Concerned',
};

const modelCruxRefs: Record<string, string[]> = {
  crux_induced_traffic: ['sim_pro_upzone_traffic'],
  crux_fiscal_net: ['sim_concerned_fiscal'],
};

function assertFound<T>(value: T | undefined, label: string): T {
  if (!value) {
    throw new Error(`Seeded workspace projection is missing ${label}.`);
  }

  return value;
}

function toDateOnly(isoDate: string): string {
  return isoDate.slice(0, 10);
}

function positionById(workspace: SeededIssueWorkspace, positionId: string): Position {
  return assertFound(
    workspace.positions.find((position) => position.id === positionId),
    `position ${positionId}`,
  );
}

function cruxById(workspace: SeededIssueWorkspace, cruxId: string): Crux {
  return assertFound(
    workspace.cruxes.find((crux) => crux.id === cruxId),
    `crux ${cruxId}`,
  );
}

function readableSide(position: Position): string {
  return sideLabels[position.id] ?? position.authorId;
}

function readableCrux(crux: Crux): string {
  return cruxReaderLabels[crux.id] ?? crux.description;
}

function readerCruxStatus(status: Crux['status']): CruxStatus {
  return status === 'moot' ? 'resolved_by_agreement_to_disagree' : status;
}

function steelmanProvenance(workspace: SeededIssueWorkspace, steelmanId: string | undefined): string {
  if (!steelmanId) {
    return `projection:${workspace.liveMap.id}/steelman-missing`;
  }

  return `event:steelman_verdict/${workspace.dialecticSession.id}#${steelmanId}`;
}

function cruxLoadBearingProvenance(workspace: SeededIssueWorkspace, cruxId: string): string {
  return `event:crux_is_load_bearing/${workspace.dialecticSession.id}#${cruxId}`;
}

function positionNode(workspace: SeededIssueWorkspace, position: Position): BriefingMapNode {
  const note = workspace.dialecticSession.phaseArtifacts.presentationNotes.find(
    (candidate) => candidate.positionId === position.id,
  );

  return {
    id: position.id,
    kind: 'position',
    label: `${readableSide(position)} position`,
    status: `v${position.version}`,
    summary: note?.strongestClaim ?? position.coreClaims[0]?.text ?? workspace.issue.description,
  };
}

function cruxNode(workspace: SeededIssueWorkspace, cruxId: string): BriefingMapNode {
  const crux = cruxById(workspace, cruxId);
  const priority = workspace.dialecticSession.phaseArtifacts.cruxPriorities.find(
    (candidate) => candidate.cruxId === crux.id,
  );

  return {
    id: crux.id,
    kind: 'crux',
    label: readableCrux(crux),
    status: `${crux.status.replaceAll('_', ' ')} ${crux.type} crux`,
    summary: priority?.whyLoadBearing ?? crux.description,
  };
}

function modelNode(simulation: Simulation): BriefingMapNode {
  return {
    id: simulation.id,
    kind: 'model',
    label: simulation.label,
    status: simulation.lastRun ? 'attached run' : 'attached model',
    summary: simulation.lastRun?.resultSummary ?? simulation.description,
  };
}

function projectBriefingMap(workspace: SeededIssueWorkspace): BriefingMap {
  const synthesis = assertFound(
    workspace.dialecticSession.phaseArtifacts.synthesisAttempt,
    'synthesis attempt',
  );
  const synthesisNodeId = workspace.liveMap.keyPositionIds[0] ?? synthesis.id;
  const positionIds = workspace.liveMap.keyPositionIds.filter((id) =>
    workspace.positions.some((position) => position.id === id),
  );

  return {
    title: `${workspace.shortTitle} live map, exported for outside readers`,
    lastUpdatedAt: workspace.liveMap.lastUpdatedAt,
    synthesis: `${workspace.liveMap.evidenceSummary} The strongest near-term synthesis is ${synthesis.title.toLowerCase()}: ${synthesis.policyMove}`,
    nodes: [
      {
        id: synthesisNodeId,
        kind: 'synthesis',
        label: 'Current synthesis candidate',
        status: 'not adopted',
        summary: synthesis.policyMove,
      },
      ...positionIds.map((positionId) => positionNode(workspace, positionById(workspace, positionId))),
      ...workspace.liveMap.prominentCruxIds.map((cruxId) => cruxNode(workspace, cruxId)),
      ...workspace.simulations.map((simulation) => modelNode(simulation)),
    ],
    edges: [
      ...workspace.dialecticSession.phaseArtifacts.cruxPriorities.flatMap((priority) =>
        priority.selectedByPositionIds.map((positionId) => ({
          from: positionId,
          to: priority.cruxId,
          label: 'treats as load-bearing',
        })),
      ),
      ...workspace.simulations.flatMap((simulation) =>
        simulation.embodyingPositionIds.map((positionId) => ({
          from: simulation.id,
          to: positionId,
          label: 'models assumptions for',
        })),
      ),
      ...workspace.liveMap.prominentCruxIds.map((cruxId) => ({
        from: cruxId,
        to: synthesisNodeId,
        label: 'constrains synthesis',
      })),
    ],
  };
}

function projectCases(workspace: SeededIssueWorkspace, crux: Crux): ReaderCase[] {
  return workspace.dialecticSession.participantPositionIds.map((positionId) => {
    const position = positionById(workspace, positionId);
    const note = workspace.dialecticSession.phaseArtifacts.presentationNotes.find(
      (candidate) => candidate.positionId === position.id,
    );
    const opposingSteelman = workspace.dialecticSession.phaseArtifacts.crossSteelmans.find(
      (steelman) => steelman.targetPositionId === position.id,
    );

    return {
      id: opposingSteelman?.id ?? `pending_steelman_${position.id}_${crux.id}`,
      side: readableSide(position),
      coreArgument: [
        note?.strongestClaim ?? position.coreClaims[0]?.text,
        position.cruxesIdentified.includes(crux.id)
          ? `This side names ${readableCrux(crux).toLowerCase()} as load-bearing.`
          : `This side is affected by the ${crux.type} tradeoff even where it is not their decisive crux.`,
      ]
        .filter(Boolean)
        .join(' '),
      steelmanWrittenBy: opposingSteelman
        ? readableSide(positionById(workspace, opposingSteelman.fromPositionId))
        : 'No opposing steelman yet',
      steelmanText: opposingSteelman?.summary ?? 'No endorsed opposing steelman has been recorded for this side yet.',
      steelmanEndorsed: opposingSteelman?.targetResponse === 'accepted',
      steelmanProvenance: steelmanProvenance(workspace, opposingSteelman?.id),
    };
  });
}

function projectModelResults(workspace: SeededIssueWorkspace, crux: Crux) {
  return (modelCruxRefs[crux.id] ?? [])
    .map((modelId) => workspace.simulations.find((simulation) => simulation.id === modelId))
    .filter((simulation): simulation is Simulation => Boolean(simulation))
    .map((simulation) => ({
      side: simulation.embodyingPositionIds.map((positionId) => readableSide(positionById(workspace, positionId))).join(' + '),
      keyAssumption: Object.entries(simulation.params)
        .map(([key, value]) => `${key.replaceAll('_', ' ')}: ${value}`)
        .join('; '),
      result: simulation.lastRun?.resultSummary ?? 'Run pending',
      range: simulation.description,
    }));
}

function projectDisagreements(workspace: SeededIssueWorkspace): ReaderDisagreement[] {
  return workspace.liveMap.prominentCruxIds.map((cruxId) => {
    const crux = cruxById(workspace, cruxId);
    const priority = workspace.dialecticSession.phaseArtifacts.cruxPriorities.find(
      (candidate) => candidate.cruxId === crux.id,
    );
    const focusedWork = workspace.dialecticSession.phaseArtifacts.focusedWork.find(
      (work) => work.cruxId === crux.id,
    );
    const modelResults = projectModelResults(workspace, crux);

    return {
      cruxId: crux.id,
      name: readableCrux(crux),
      type: crux.type,
      status: readerCruxStatus(crux.status),
      description: crux.description,
      cases: projectCases(workspace, crux),
      modelResults: modelResults.length > 0 ? modelResults : undefined,
      valueTension:
        crux.type === 'value'
          ? 'Both sides are defending legitimate goods, so the reader artifact marks this as a policy choice rather than a missing-data problem.'
          : undefined,
      cruxResolutionPath:
        priority?.wouldMoveIf ??
        focusedWork?.notes ??
        'The workspace has not yet recorded a resolution path for this crux.',
      loadBearingProvenance: cruxLoadBearingProvenance(workspace, crux.id),
    };
  });
}

function projectModelSummaries(workspace: SeededIssueWorkspace): AttachedModelSummary[] {
  return workspace.simulations.map((simulation) => ({
    id: simulation.id,
    label: simulation.label,
    attachedTo: simulation.embodyingPositionIds
      .map((positionId) => {
        const position = positionById(workspace, positionId);
        return `${readableSide(position)} position v${position.version}`;
      })
      .join(', '),
    keyAssumptions: Object.entries(simulation.params).map(
      ([key, value]) => `${key.replaceAll('_', ' ')}: ${value}`,
    ),
    resultSummary: simulation.lastRun?.resultSummary ?? 'No run has been published yet.',
    limitation: simulation.description,
  }));
}

function projectEvidence(workspace: SeededIssueWorkspace): ReaderEvidence[] {
  const evidenceRows = workspace.evidence.map((evidence) => {
    const bearsOn = workspace.positions.flatMap((position) =>
      position.evidenceRefs
        .filter((ref) => ref.evidenceId === evidence.id)
        .map((ref) => `${readableSide(position)} position: ${ref.relevance}`),
    );

    return {
      citation: evidence.citation,
      quality: evidence.quality,
      bearsOn: bearsOn.length > 0 ? bearsOn : ['Workspace evidence ledger'],
      excerpt: evidence.excerpt,
      limitation: evidence.relevanceNotes ?? 'No projection limitation has been recorded yet.',
    };
  });

  const modelRows = workspace.simulations.map((simulation) => ({
    citation: `${simulation.label} (${simulation.lastRun ? `run ${toDateOnly(simulation.lastRun.at)}` : 'run pending'})`,
    quality: 'other' as const,
    bearsOn: simulation.embodyingPositionIds.map(
      (positionId) => `${readableSide(positionById(workspace, positionId))} model assumptions`,
    ),
    excerpt: simulation.lastRun?.resultSummary,
    limitation: simulation.description,
  }));

  return [...evidenceRows, ...modelRows];
}

function projectPolicyOptions(workspace: SeededIssueWorkspace): PolicyOption[] {
  const synthesis = assertFound(
    workspace.dialecticSession.phaseArtifacts.synthesisAttempt,
    'synthesis attempt',
  );

  return [
    {
      name: synthesis.title,
      assumes: synthesis.sharedCommitments,
      helps: ['Households currently priced out of Midtown.', 'Residents who need infrastructure commitments to be explicit.'],
      costs: synthesis.unresolvedTradeoffs,
      risks: workspace.liveMap.openQuestions,
      monitor: workspace.dialecticSession.phaseArtifacts.focusedWork.map((work) => work.title),
    },
    {
      name: 'Resolve promoted cruxes before full upzone',
      assumes: workspace.liveMap.openQuestions,
      helps: ['Decision-makers who need a lower-risk factual record before final entitlement.'],
      costs: ['Housing delivery slows while obtainable evidence is requested and published.'],
      risks: ['Administrative delay can become a de facto denial if no default deadline is set.'],
      monitor: workspace.liveMap.prominentCruxIds.map((cruxId) => readableCrux(cruxById(workspace, cruxId))),
    },
  ];
}

function projectUncertainties(workspace: SeededIssueWorkspace): Uncertainty[] {
  return workspace.liveMap.prominentCruxIds.map((cruxId) => {
    const crux = cruxById(workspace, cruxId);
    const priority = workspace.dialecticSession.phaseArtifacts.cruxPriorities.find(
      (candidate) => candidate.cruxId === crux.id,
    );

    return {
      text: crux.description,
      wouldChangeIf:
        priority?.wouldMoveIf ??
        'The workspace records this as a live value tradeoff rather than a missing factual input.',
    };
  });
}

function projectChanges(workspace: SeededIssueWorkspace): ReaderArtifactProps['changesSince'] {
  const acceptedSteelmans = workspace.dialecticSession.phaseArtifacts.crossSteelmans
    .filter((steelman) => steelman.targetResponse === 'accepted')
    .map((steelman) => {
      const from = readableSide(positionById(workspace, steelman.fromPositionId));
      const target = readableSide(positionById(workspace, steelman.targetPositionId));
      return `${from}'s steelman of the ${target} position was endorsed as fair.`;
    });

  return {
    sinceDate: toDateOnly(workspace.issue.createdAt),
    entries: [
      ...workspace.dialecticSession.phaseArtifacts.presentationNotes.map((note) => {
        const position = positionById(workspace, note.positionId);
        return `${readableSide(position)} position (v${position.version}) declared what would change its mind: ${note.whatWouldChangeMind}`;
      }),
      ...acceptedSteelmans,
      ...workspace.dialecticSession.outputs.newCruxIds.map((cruxId) => {
        const crux = cruxById(workspace, cruxId);
        return `${readableCrux(crux)} is now promoted as a ${crux.type} crux.`;
      }),
    ].map((text) => ({ text })),
  };
}

export function projectReaderArtifact(workspace: SeededIssueWorkspace): ReaderArtifactProps {
  const synthesis = assertFound(
    workspace.dialecticSession.phaseArtifacts.synthesisAttempt,
    'synthesis attempt',
  );
  const unresolvedDataCruxes = workspace.liveMap.prominentCruxIds
    .map((cruxId) => cruxById(workspace, cruxId))
    .filter((crux) => crux.type !== 'value');

  return {
    issueTitle: workspace.issue.title,
    issueScope: workspace.issue.scope,
    issueDomain: workspace.issue.domainTags.join(' · '),
    valueConflicts: workspace.issue.valueConflicts,
    status: workspace.issue.status === 'archived' ? 'stable' : workspace.issue.status,
    artifactVersion: workspace.liveMap.version,
    artifactDate: toDateOnly(workspace.liveMap.lastUpdatedAt),
    exportSlug: `${workspace.slug}-v${workspace.liveMap.version}`,
    briefingMap: projectBriefingMap(workspace),
    commonGroundClaims: synthesis.sharedCommitments.map((text) => ({
      text,
      breadth: 'across all participant positions',
    })),
    disputedSummary: workspace.liveMap.prominentCruxIds.map((cruxId) => {
      const crux = cruxById(workspace, cruxId);
      return { label: crux.description, type: crux.type };
    }),
    bottomLine: `${workspace.liveMap.evidenceSummary} The data-dependent cruxes are ${unresolvedDataCruxes.map(readableCrux).join(', ')}; the value crux must be resolved as a policy choice. If a decision must be made now, the workspace's current synthesis is: ${synthesis.policyMove}`,
    disagreements: projectDisagreements(workspace),
    modelSummaries: projectModelSummaries(workspace),
    evidenceItems: projectEvidence(workspace),
    policyOptions: projectPolicyOptions(workspace),
    uncertainties: projectUncertainties(workspace),
    changesSince: projectChanges(workspace),
    aiDisclosure:
      'AI assistance may draft connective prose and flag projection gaps, but the reader artifact is derived from the seeded issue workspace: issue, positions, cruxes, evidence, simulations, dialectic session, and promoted live map.',
    gardenersNote:
      'This artifact is maintained as a projection of the promoted LiveMap. Gardeners should ratify fairness ratings in the workspace before promotion to the public artifact.',
  };
}
