import { useStage } from '../store';

export default function StageDebug() {
  const progress = useStage((s) => s.progress);

  let stage = 'MESH';

  if (progress >= 1) {
    stage = 'CONVERGE';
  } else if (progress >= 2 / 3) {
    stage = 'STACK → CONVERGE';
  } else if (progress >= 1 / 3) {
    stage = 'TIMELINE → STACK';
  } else {
    stage = 'MESH → TIMELINE';
  }

  return (
    <div
      style={{
        position: 'fixed',
        right: 24,
        bottom: 24,
        zIndex: 9999,
        padding: '10px 14px',
        background: '#000',
        color: '#6EE7C8',
        fontFamily: 'monospace',
        fontSize: 12,
      }}
    >
      progress: {progress.toFixed(3)}
      <br />
      stage: {stage}
    </div>
  );
}