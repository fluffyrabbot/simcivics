import { readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const artifactPath = join(process.cwd(), 'dist', 'reader', 'index.html');
const html = readFileSync(artifactPath, 'utf8');
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

console.log(`Verified exportable Midtown briefing at ${artifactPath} (${artifactSize} bytes).`);
