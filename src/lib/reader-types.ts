export type CruxType = 'factual' | 'model' | 'value';

export type CruxStatus =
  | 'open'
  | 'partially_addressed'
  | 'resolved_by_evidence'
  | 'resolved_by_agreement_to_disagree';

export type EvidenceQuality =
  | 'primary_admin_data'
  | 'peer_reviewed'
  | 'high_quality_gov_report'
  | 'high_quality_think_tank'
  | 'journalism'
  | 'other';

export interface ReaderCase {
  side: string;
  coreArgument: string;
  steelmanWrittenBy: string;
  steelmanText: string;
  steelmanEndorsed: boolean;
}

export interface ModelResult {
  side: string;
  keyAssumption: string;
  result: string;
  range?: string;
}

export type BriefingMapNodeKind = 'position' | 'crux' | 'model' | 'synthesis';

export interface BriefingMapNode {
  id: string;
  kind: BriefingMapNodeKind;
  label: string;
  summary: string;
  status?: string;
}

export interface BriefingMapEdge {
  from: string;
  to: string;
  label: string;
}

export interface BriefingMap {
  title: string;
  lastUpdatedAt: string;
  synthesis: string;
  nodes: BriefingMapNode[];
  edges: BriefingMapEdge[];
}

export interface AttachedModelSummary {
  id: string;
  label: string;
  attachedTo: string;
  keyAssumptions: string[];
  resultSummary: string;
  limitation: string;
}

export interface ReaderDisagreement {
  name: string;
  type: CruxType;
  status: CruxStatus;
  description: string;
  cases: ReaderCase[];
  modelResults?: ModelResult[];
  valueTension?: string;
  cruxResolutionPath: string;
}

export interface ReaderEvidence {
  citation: string;
  quality: EvidenceQuality;
  bearsOn: string[];
  excerpt?: string;
  limitation: string;
}

export interface CommonGroundClaim {
  text: string;
  breadth: string;
}

export interface PolicyOption {
  name: string;
  assumes: string[];
  helps: string[];
  costs: string[];
  risks: string[];
  monitor: string[];
}

export interface Uncertainty {
  text: string;
  wouldChangeIf: string;
}

export interface ChangelogEntry {
  text: string;
}

export interface ReaderArtifactProps {
  issueTitle: string;
  issueScope: string;
  issueDomain: string;
  valueConflicts: string[];
  status: 'active' | 'synthesizing' | 'stable';
  artifactVersion: number;
  artifactDate: string;
  exportSlug: string;
  briefingMap: BriefingMap;
  commonGroundClaims: CommonGroundClaim[];
  disputedSummary: Array<{ label: string; type: CruxType }>;
  bottomLine: string;
  disagreements: ReaderDisagreement[];
  modelSummaries: AttachedModelSummary[];
  evidenceItems: ReaderEvidence[];
  policyOptions?: PolicyOption[];
  uncertainties: Uncertainty[];
  changesSince?: { sinceDate: string; entries: ChangelogEntry[] };
  aiDisclosure: string;
  gardenersNote: string;
}
