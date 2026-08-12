import { Canvas } from '@react-three/fiber';
import { Suspense } from 'react';
import * as THREE from 'three';
import System from './System';

export default function Backdrop({ topology, reducedMotion }) {
  return (
    <div id="scene">
      <Canvas
        eventSource={document.getElementById('root')}
        eventPrefix="client"
        dpr={[1, 2]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
        }}
        camera={{
          position: [0, 0, 42],
          fov: 52,
          near: 0.1,
          far: 600,
        }}
        style={{
          width: '100%',
          height: '100%',
          display: 'block',
        }}
        onCreated={({ scene }) => {
          scene.fog = new THREE.FogExp2('#0B1420', 0.0125);
        }}
      >
        <Suspense fallback={null}>
          <System
            topology={topology}
            reducedMotion={reducedMotion}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}