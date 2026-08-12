import { motion, useInView } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

function Counter({ to, unit }) {
  const ref = useRef(null);
  const seen = useInView(ref, { once: true, amount: 0.6 });
  const [n, setN] = useState(0);

  useEffect(() => {
    if (!seen) return;
    const start = performance.now();
    let raf;
    const tick = (now) => {
      const k = Math.min(1, (now - start) / 1100);
      setN(Math.round(to * (1 - Math.pow(1 - k, 3))));
      if (k < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [seen, to]);

  return <div className="n" ref={ref}>{n}{unit}</div>;
}

function Role({ role }) {
  const ref = useRef(null);
  const seen = useInView(ref, { once: true, amount: 0.18 });
  return (
    <motion.div
      ref={ref}
      className="role"
      initial={{ opacity: 0, y: 24 }}
      animate={seen ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease: [0.2, 0.7, 0.2, 1] }}
    >
      <div className="when"><u>{role.start}</u>→ {role.end}</div>
      <div>
        <h3>{role.title}</h3>
        <div className="org">{role.org}</div>
        <ul>{role.highlights.map((h, i) => <li key={i}>{h}</li>)}</ul>
      </div>
    </motion.div>
  );
}

export default function Work({ roles, metrics }) {
  return (
    <section id="work" className="band">
      <div className="eyebrow">01 — Trace</div>
      <h2>Four years, one direction.</h2>
      <p className="sub">
        Each role added a layer to the same system: transactions, then the cloud under them,
        then the pipelines feeding both. Scroll — the graph above sorts itself into this timeline.
      </p>

      <div className="metrics">
        {metrics.map((m) => (
          <div key={m.label}>
            <Counter to={m.value} unit={m.unit} />
            <div className="k">{m.label}</div>
          </div>
        ))}
      </div>

      {roles.map((r) => <Role key={r.id} role={r} />)}
    </section>
  );
}
