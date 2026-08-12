import { useStage } from '../store';

const fmt = new Intl.NumberFormat('en-US');

/** Ops-console readout in the corner, fed by the SSE stream. */
export default function Hud({ nodeCount, live }) {
  const tick = useStage((s) => s.throughput);

  return (
    <aside id="hud" aria-live="off">
      <div className="hdr"><span className="dot" data-live={live} />TOPOLOGY / {live ? 'LIVE' : 'CACHED'}</div>
      <div className="row"><span>records</span><b>{tick ? fmt.format(tick.recordsProcessed) : '—'}</b></div>
      <div className="row"><span>throughput</span><b>{tick ? `${Math.round(tick.recordsPerSecond)} /s` : '—'}</b></div>
      <div className="row"><span>services</span><b>{nodeCount}</b></div>
      <div className="row"><span>p99 latency</span><b>{tick ? `${tick.p99LatencyMs.toFixed(1)} ms` : '—'}</b></div>
    </aside>
  );
}
