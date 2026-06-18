import { readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const artifactPath = join(process.cwd(), 'dist', 'reader', 'index.html');
const seedPath = join(process.cwd(), 'src', 'lib', 'seeded-issue-workspace.ts');
const html = readFileSync(artifactPath, 'utf8');
const seedSource = readFileSync(seedPath, 'utf8');
const artifactSize = statSync(artifactPath).size;

const requiredSnippets = [
  'Midtown zoning live map, exported for outside readers',
  'Current synthesis candidate',
  'Pro-upzone position',
  'Concerned position',
  'School capacity',
  'Induced VMT',
  'Net fiscal impact',
  'Character and tree canopy',
  'Attached model summaries',
  'Pro-upzone traffic model v1.2',
  'Concerned fiscal impact model',
  'Print / PDF',
  'Built as a standalone briefing',
  'How this artifact was produced',
  'data-action-kind="fair_steelman_of_my_side"',
  'data-action-kind="crux_is_load_bearing"',
  'Endorse as fair',
  'Mark load-bearing',
  'aria-live="polite"',
  'No signal from you yet.',
  'Current artifact state:',
  'Current crux provenance:',
  'pending local signals',
  'not counted in this artifact until it is appended to the event log',
];

const missing = requiredSnippets.filter((snippet) => !html.includes(snippet));

if (missing.length > 0) {
  console.error('Briefing artifact is missing required outside-reader content:');
  for (const snippet of missing) {
    console.error(`- ${snippet}`);
  }
  process.exit(1);
}

const openDetailCount = (html.match(/<details class="depth-layer/g) ?? []).length;
if (openDetailCount < 2 || !html.includes('id="depth-5min" open') || !html.includes('id="depth-40min" open')) {
  console.error('Briefing artifact must render detail layers open in static HTML.');
  process.exit(1);
}

const seedIds = [
  ...new Set([...seedSource.matchAll(/id: '(crux_[^']+|sim_[^']+)'/g)].map((match) => match[1])),
];
const missingSeedIds = seedIds.filter((id) => !html.includes(`id="map-node-${id}"`));

if (missingSeedIds.length > 0) {
  console.error('Briefing artifact is missing map nodes projected from Midtown seed IDs:');
  for (const id of missingSeedIds) {
    console.error(`- ${id}`);
  }
  process.exit(1);
}

console.log(`Verified exportable Midtown briefing at ${artifactPath} (${artifactSize} bytes).`);
