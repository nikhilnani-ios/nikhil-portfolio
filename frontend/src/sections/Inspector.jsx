import { useEffect, useState } from 'react';
import { useStage } from '../store';

/** Follows the cursor and explains whichever service is under it. */
export default function Inspector({ nodes }) {
  const hovered = useStage((s) => s.hovered);
  const [pos, setPos] = useState({ x: -400, y: -400 });

  useEffect(() => {
    const move = (e) => setPos({ x: Math.min(e.clientX + 16, window.innerWidth - 280), y: e.clientY + 16 });
    window.addEventListener('pointermove', move, { passive: true });
    return () => window.removeEventListener('pointermove', move);
  }, []);

  const node = nodes.find((n) => n.id === hovered);
  const TIERS = ['edge', 'services', 'messaging', 'data', 'platform', 'signals'];

  return (
    <div id="chip" className={node ? 'on' : ''} style={{ left: pos.x, top: pos.y }}>
      <div className="t">{node?.id}</div>
      <div className="d">{node ? `${TIERS[node.tier].toUpperCase()} — ${node.description}` : ''}</div>
    </div>
  );
}
