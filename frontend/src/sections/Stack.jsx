import { useStage } from '../store';

export default function Stack({ skills }) {
  const setIsolatedTier = useStage((s) => s.setIsolatedTier);

  return (
    <section id="stack" className="band">
      <div className="eyebrow">02 — Layers</div>
      <h2>What I reach for.</h2>
      <p className="sub">The same nodes from the graph, sorted by the tier they live in. Hover a layer to isolate it above.</p>

      <div className="tiers">
        {skills.map((t) => (
          <div
            key={t.tier}
            className="tier"
            onMouseEnter={() => setIsolatedTier(t.tier)}
            onMouseLeave={() => setIsolatedTier(-1)}
            onFocus={() => setIsolatedTier(t.tier)}
            onBlur={() => setIsolatedTier(-1)}
            tabIndex={0}
          >
            <div className="name">{t.name}<span>{t.caption}</span></div>
            <div className="items">{t.items.map((i) => <i key={i}>{i}</i>)}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
