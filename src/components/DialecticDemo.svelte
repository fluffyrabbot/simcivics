<script lang="ts">
  import type { Issue, Position, Crux, Simulation } from '../lib/domain';

  // Seeded toy data matching the domain model.
  const issue: Issue = {
    id: 'issue_midtown_zoning',
    title: 'How should Midtown zoning change to increase housing production while managing infrastructure strain?',
    description: 'Balancing supply response, infrastructure capacity, and neighborhood impacts in a high-demand inner-ring suburb.',
    scope: 'municipal',
    domainTags: ['housing', 'zoning'],
    valueConflicts: [
      'growth vs. neighborhood character',
      'housing access vs. existing resident protections',
      'short-term supply vs. long-term infrastructure capacity'
    ],
    status: 'active',
    createdAt: '2026-06-01T00:00:00Z',
    lastMajorUpdateAt: '2026-06-04T12:00:00Z',
  };

  let positions: Position[] = [
    {
      id: 'pos_pro_upzone',
      version: 2,
      issueId: issue.id,
      authorId: 'u_alex',
      coreClaims: [
        { id: 'c1', text: 'Upzoning the core 1/2 mile around the station by 2 stories will add 1,800–2,600 units over 7 years with <8% traffic impact if paired with modest transit improvements.', type: 'predictive', confidence: { kind: 'interval', low: 1800, high: 2600 } },
        { id: 'c2', text: 'Infrastructure strain is manageable because current underutilization of sewer/water and the new bus rapid transit line provide headroom.', type: 'causal_model' },
      ],
      assumptions: [
        'Price elasticity of housing supply in this submarket is in the -0.25 to -0.4 range (recent local studies).',
        'Most new residents will be net fiscal positive or neutral within 5 years.',
        'Current traffic counts have 12–18% spare capacity on key arterials during peak.'
      ],
      evidenceRefs: [
        { evidenceId: 'ev_local_study_2024', relevance: 'Elasticity estimate from parcel-level data 2018-2023' },
      ],
      anticipatedObjections: [
        {
          steelmanSummary: 'Even with new units, infrastructure (especially schools and water pressure at peak) will be strained beyond capacity before any mitigation is built; the traffic model underestimates induced demand from new households.',
          endorsedByOpponents: true,
          response: 'We accept the school capacity point as a crux. On traffic we are willing to run the city\'s new ABM with higher induced-demand parameters and publish the delta.'
        }
      ],
      cruxesIdentified: ['crux_school_capacity', 'crux_induced_traffic'],
      attachedModelRefs: ['sim_pro_upzone_traffic'],
      createdAt: '2026-06-02T10:00:00Z',
      updatedAt: '2026-06-03T14:30:00Z',
    },
    {
      id: 'pos_concerned',
      version: 3,
      issueId: issue.id,
      authorId: 'u_jordan',
      coreClaims: [
        { id: 'c3', text: 'The marginal infrastructure cost per new unit in the core exceeds the marginal revenue under current impact fee schedules; net fiscal impact turns negative above ~900 added units without fee reform.', type: 'predictive', confidence: { kind: 'interval', low: 700, high: 1200 } },
        { id: 'c4', text: 'Character and tree canopy losses from 2-story upzones are not fully mitigable by design standards and will be perceived as a quality-of-life decline by long-term residents.', type: 'value' },
      ],
      assumptions: [
        'School district capital plan has no new seats funded in this attendance area for 6+ years.',
        'Induced VMT per new household is 15–25% higher than the regional average due to limited east-west transit.',
      ],
      evidenceRefs: [
        { evidenceId: 'ev_fiscal_model_city_2025', relevance: 'City fiscal impact model for similar upzone' },
      ],
      anticipatedObjections: [
        {
          steelmanSummary: 'New housing will eventually pay for itself through increased property tax base and the BRT will absorb most new trips; design standards plus tree replacement requirements can protect character.',
          endorsedByOpponents: false,
          response: 'The tax base argument assumes commercial follow-on development that has not materialized in the last two upzones. We want to see the actual absorption numbers before accepting the claim.'
        }
      ],
      cruxesIdentified: ['crux_school_capacity', 'crux_fiscal_net'],
      attachedModelRefs: ['sim_concerned_fiscal'],
      createdAt: '2026-06-02T11:15:00Z',
      updatedAt: '2026-06-04T09:00:00Z',
    },
  ];

  let cruxes: Crux[] = [
    { id: 'crux_school_capacity', description: 'Whether the local elementary and middle schools can absorb 400–700 additional students without portable classrooms or boundary changes within 5 years.', type: 'factual', status: 'open', mattersTo: ['pos_pro_upzone', 'pos_concerned'] },
    { id: 'crux_induced_traffic', description: 'Magnitude of induced vehicle miles traveled from new households; specifically whether the city ABM with updated parameters shows >10% degradation on the two main north-south arterials.', type: 'model', status: 'open', mattersTo: ['pos_pro_upzone', 'pos_concerned'] },
    { id: 'crux_fiscal_net', description: 'Net present fiscal impact per new unit over 10 years once you include both direct impact fees and the full marginal cost of services (including schools).', type: 'model', status: 'partially_addressed', mattersTo: ['pos_concerned'] },
  ];

  let sims: Simulation[] = [
    {
      id: 'sim_pro_upzone_traffic',
      label: 'Pro-upzone traffic model v1.2',
      description: 'City ABM subset for Midtown core + 2 arterials. Params taken from pos_pro_upzone assumptions.',
      embodyingPositionIds: ['pos_pro_upzone'],
      params: { added_units: 2200, elasticity: -0.32, induced_vmt_factor: 1.12 },
      lastRun: { at: '2026-06-03T18:00:00Z', resultSummary: 'Peak arterial volume +6.4% (5-95%: +3.1% to +9.8%)' },
    },
    {
      id: 'sim_concerned_fiscal',
      label: 'Concerned fiscal impact model',
      description: '10-year NPV per unit using city fiscal model + school capital schedule.',
      embodyingPositionIds: ['pos_concerned'],
      params: { added_units: 1800, school_capital_per_pupil: 48000, impact_fee_per_unit: 18500 },
      lastRun: { at: '2026-06-04T08:30:00Z', resultSummary: 'Median net fiscal per unit: -$4,200 over 10y (range depends on commercial follow-on)' },
    },
  ];

  // Demo interaction: toggle the steelman endorsement on the first position's first objection.
  function toggleSteelmanEndorsement() {
    positions = positions.map((p, idx) => {
      if (idx === 0 && p.anticipatedObjections.length > 0) {
        const obs = [...p.anticipatedObjections];
        obs[0] = { ...obs[0], endorsedByOpponents: !obs[0].endorsedByOpponents };
        return { ...p, anticipatedObjections: obs, updatedAt: new Date().toISOString() };
      }
      return p;
    });
  }

  // Simple "run model" simulation for the demo.
  let runOutput = '';
  function runModel(simId: string) {
    const sim = sims.find(s => s.id === simId);
    if (!sim) return;
    runOutput = `${sim.label} re-run at ${new Date().toLocaleTimeString()}: using current params, result distribution would be recomputed here. In real system this would be a reproducible artifact attached to the Position and citable in the map.`;
  }
</script>

<div style="display:grid; gap:1rem;">
  {#each positions as pos, i}
    <div class="card" style="border-color: {i === 0 ? '#2a6' : '#a52'}">
      <div class="meta">
        POSITION v{pos.version} • by {pos.authorId} • updated {new Date(pos.updatedAt).toLocaleDateString()}
        {#if pos.synthesisOf} (synthesis of {pos.synthesisOf.join(', ')}){/if}
      </div>

      <div style="margin:0.5rem 0 0.25rem; font-weight:600">Core claims</div>
      {#each pos.coreClaims as claim}
        <div class="claim">
          <strong>[{claim.type}]</strong> {claim.text}
          {#if claim.confidence}
            <span class="meta">({claim.confidence.kind === 'interval' ? `${claim.confidence.low}–${claim.confidence.high}` : claim.confidence.label})</span>
          {/if}
        </div>
      {/each}

      <div style="margin:0.5rem 0 0.25rem; font-weight:600">Key assumptions (explicit)</div>
      <ul style="margin:0.25rem 0 0.5rem 1rem; padding:0">
        {#each pos.assumptions as a}
          <li style="margin:0.15rem 0">{a}</li>
        {/each}
      </ul>

      <div style="margin:0.5rem 0 0.25rem; font-weight:600">Anticipated strongest objection + response</div>
      {#each pos.anticipatedObjections as obj, j}
        <div class="objection">
          <div><strong>Steelman of opposing view:</strong> {obj.steelmanSummary || '(not yet written)'}</div>
          {#if obj.response}
            <div style="margin-top:0.35rem"><strong>Response:</strong> {obj.response}</div>
          {/if}
          <div style="margin-top:0.35rem">
            <button on:click={toggleSteelmanEndorsement} style="font-size:0.8rem; padding:0.2rem 0.5rem">
              {obj.endorsedByOpponents ? '✓ Opponent-endorsed (click to revoke demo)' : 'Not yet endorsed by the other side (click to simulate endorsement)'}
            </button>
          </div>
          {#if obj.endorsedByOpponents}
            <div class="meta" style="margin-top:0.25rem">This is high-value inside the system: opponent-endorsed charity directly feeds the author's charity dimension of reputation.</div>
          {/if}
        </div>
      {/each}

      <div style="margin-top:0.5rem">
        <span class="meta">Attached models:</span>
        {#each pos.attachedModelRefs as ref}
          <button on:click={() => runModel(ref)} style="margin-left:0.35rem; font-size:0.75rem">
            {sims.find(s => s.id === ref)?.label || ref}
          </button>
        {/each}
      </div>
    </div>
  {/each}

  <div class="card">
    <div class="meta">IDENTIFIED CRUXES (shared map state)</div>
    {#each cruxes as crux}
      <div style="margin:0.4rem 0; padding:0.4rem 0.6rem; background:#1a1a1f; border-radius:4px">
        <strong>[{crux.type}] {crux.status}</strong> — {crux.description}
        <div class="meta">matters to: {crux.mattersTo.join(', ')}</div>
      </div>
    {/each}
  </div>

  {#if runOutput}
    <div class="card" style="background:#0f1720; border-color:#3a8cff">
      <div class="meta">SIMULATION RUN OUTPUT (demo)</div>
      <pre style="white-space:pre-wrap; margin:0.25rem 0 0; font-size:0.85rem">{runOutput}</pre>
      <div class="meta" style="margin-top:0.5rem">In the real system: this run becomes a citable artifact. Later real-world data can score how well the Position's embodied model performed. Calibration applies to model authors too.</div>
    </div>
  {/if}

  <div class="meta" style="font-size:0.8rem">
    Try the endorsement toggle. Notice how the UI and model treat "opponent endorsed this representation of their view" as a distinct, valuable signal — unlike a simple upvote.
    The structure (explicit steelman section + endorsement flag + cruxes + attached runnable models) is what makes dialectic the rewarded path.
  </div>
</div>

<style>
  .card { background: #141416; border: 1px solid #252528; border-radius: 8px; padding: 0.9rem 1.1rem; }
  .claim { margin: 0.35rem 0; padding-left: 0.6rem; border-left: 3px solid #3a8cff; font-size: 0.95rem; }
  .objection { background: #1a1a1f; padding: 0.6rem; border-radius: 5px; margin: 0.35rem 0; font-size: 0.92rem; }
  button { cursor: pointer; border: 1px solid #333; background: #222; color: #ddd; border-radius: 4px; }
  button:hover { border-color: #3a8cff; }
</style>
