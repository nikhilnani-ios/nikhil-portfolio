import { useEffect, useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useStage } from '../store';
import { buildLayouts, STAGES, CAMERA_Z, ROLE_COLOR } from './layouts';

const PACKETS = 520;
const dummy = new THREE.Object3D();
const scratch = new THREE.Vector3();
const HOT = new THREE.Color('#F5A65B');
const COOL = new THREE.Color('#6EE7C8');
const mix = new THREE.Color();
const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

export default function System({ topology, reducedMotion }) {
  const { nodes, edges } = topology;
  const progress = useStage((s) => s.progress);
  const setHovered = useStage((s) => s.setHovered);
  useEffect(() => {
  if (progress >= 0.82) {
    setHovered(null);
  }
}, [progress, setHovered]);
  const layouts = useMemo(() => buildLayouts(nodes), [nodes]);
  const index = useMemo(() => new Map(nodes.map((n, i) => [n.id, i])), [nodes]);
  const links = useMemo(
    () => edges.map((e) => [index.get(e.from), index.get(e.to)]).filter(([a, b]) => a != null && b != null),
    [edges, index],
  );

  const live = useMemo(() => nodes.map(() => new THREE.Vector3()), [nodes]);
  const scales = useMemo(() => nodes.map((n) => (n.tier === 1 ? 1.5 : n.tier === 3 ? 1.35 : 1.1)), [nodes]);
  const opacity = useRef(new Float32Array(nodes.length).fill(0.85));

  const packets = useMemo(
    () =>
      Array.from({ length: reducedMotion ? 0 : PACKETS }, (_, i) => ({
        link: i % Math.max(links.length, 1),
        t: Math.random(),
        speed: 0.14 + Math.random() * 0.34,
      })),
    [links.length, reducedMotion],
  );

  const meshRef = useRef();
  const glowRef = useRef();
  const groupRef = useRef();
  const edgeRef = useRef();
  const packetRef = useRef();
  const pointer = useRef({ x: 0, y: 0 });
  const smoothProgress = useRef(0);

  const edgeGeom = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(new Float32Array(links.length * 6), 3));
    return g;
  }, [links.length]);

  const packetGeom = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(new Float32Array(packets.length * 3), 3));
    g.setAttribute('color', new THREE.BufferAttribute(new Float32Array(packets.length * 3), 3));
    return g;
  }, [packets.length]);

  const { camera } = useThree();

  useFrame((state, delta) => {
    const { progress: framePostgress, hovered, isolatedTier } = useStage.getState();
    const t = state.clock.elapsedTime;
    const step = Math.min(1, delta * 3.3);

    smoothProgress.current += (framePostgress - smoothProgress.current) * 0.14;
    const s = smoothProgress.current * (STAGES.length - 1);
    const i0 = Math.min(STAGES.length - 2, Math.floor(s));
    const blend = easeInOut(s - i0);
    const from = layouts[STAGES[i0]];
    const to = layouts[STAGES[i0 + 1]];

    // --- nodes ---
    for (let i = 0; i < nodes.length; i++) {
      scratch.copy(from[i]).lerp(to[i], blend);
      if (!reducedMotion) {
        scratch.y += Math.sin(t * 0.7 + i) * 0.5;
        scratch.x += Math.cos(t * 0.5 + i * 1.3) * 0.35;
      }
      live[i].copy(scratch);

      const dim = isolatedTier >= 0 && nodes[i].tier !== isolatedTier;
      const hot = hovered === nodes[i].id;
      const target = dim ? 0.12 : hot ? 1 : 0.85;
      opacity.current[i] += (target - opacity.current[i]) * step;

      dummy.position.copy(scratch);
      dummy.rotation.set(t * 0.18 + i, t * 0.24 + i, 0);
      dummy.scale.setScalar(scales[i] * (hot ? 1.5 : 1) * (dim ? 0.75 : 1));
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
      dummy.scale.setScalar(
        scales[i] *
        (hot ? 2.6 : 2.1) *
        (dim ? 0.75 : 1)
      );
      dummy.updateMatrix();
      glowRef.current.setMatrixAt(i, dummy.matrix);

      mix
        .set(ROLE_COLOR[nodes[i].roleIndex])
        .multiplyScalar(opacity.current[i] * 0.32);

      glowRef.current.setColorAt(i, mix);
      mix.set(ROLE_COLOR[nodes[i].roleIndex]).multiplyScalar(opacity.current[i] * 1.15);
      meshRef.current.setColorAt(i, mix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
    glowRef.current.instanceMatrix.needsUpdate = true;
    if (glowRef.current.instanceColor) {
      glowRef.current.instanceColor.needsUpdate = true;
    }
    if (meshRef.current.instanceColor) meshRef.current.instanceColor.needsUpdate = true;

    // --- edges ---
    const ep = edgeGeom.attributes.position.array;
    for (let k = 0; k < links.length; k++) {
      const a = live[links[k][0]];
      const b = live[links[k][1]];
      ep[k * 6] = a.x; ep[k * 6 + 1] = a.y; ep[k * 6 + 2] = a.z;
      ep[k * 6 + 3] = b.x; ep[k * 6 + 4] = b.y; ep[k * 6 + 5] = b.z;
    }
    edgeGeom.attributes.position.needsUpdate = true;

    // --- packets in flight ---
    if (packets.length) {
      const pp = packetGeom.attributes.position.array;
      const pc = packetGeom.attributes.color.array;
      for (let i = 0; i < packets.length; i++) {
        const p = packets[i];
        p.t += p.speed * delta;
        if (p.t > 1) { p.t = 0; p.link = (Math.random() * links.length) | 0; }
        const a = live[links[p.link][0]];
        const b = live[links[p.link][1]];
        pp[i * 3] = a.x + (b.x - a.x) * p.t;
        pp[i * 3 + 1] = a.y + (b.y - a.y) * p.t;
        pp[i * 3 + 2] = a.z + (b.z - a.z) * p.t;
        mix.copy(HOT).lerp(COOL, p.t);
        pc[i * 3] = mix.r; pc[i * 3 + 1] = mix.g; pc[i * 3 + 2] = mix.b;
      }
      packetGeom.attributes.position.needsUpdate = true;
      packetGeom.attributes.color.needsUpdate = true;
    }

    // --- camera + parallax ---
    pointer.current.x = state.pointer.x;
    pointer.current.y = state.pointer.y;
    groupRef.current.rotation.y += (pointer.current.x * 0.25 - groupRef.current.rotation.y) * 0.04;
    groupRef.current.rotation.x += (-pointer.current.y * 0.14 - groupRef.current.rotation.x) * 0.04;

    const z = CAMERA_Z[STAGES[i0]] + (CAMERA_Z[STAGES[i0 + 1]] - CAMERA_Z[STAGES[i0]]) * blend;
    camera.position.z += (z - camera.position.z) * 0.05;
    camera.lookAt(0, 0, 0);
  });

  return (
    <group ref={groupRef}>
      <instancedMesh
        ref={glowRef}
        args={[null, null, nodes.length]}
      >
        <sphereGeometry args={[1, 20, 20]} />

        <meshBasicMaterial
          transparent
          opacity={0.09}
          depthWrite={false}
          toneMapped={false}
          blending={THREE.AdditiveBlending}
        />
      </instancedMesh>
      <instancedMesh
        ref={meshRef}
        args={[null, null, nodes.length]}
        onPointerOver={(e) => {
          e.stopPropagation();
          if (progress >= 0.82) return;
          setHovered(nodes[e.instanceId]?.id ?? null);
        }}
        onPointerOut={() => setHovered(null)}
      >
        <icosahedronGeometry args={[1, 1]} />
        <meshBasicMaterial wireframe transparent opacity={0.9} toneMapped={false} />
      </instancedMesh>

      <lineSegments ref={edgeRef} geometry={edgeGeom}>
        <lineBasicMaterial color="#6EE7C8" transparent opacity={0.09} />
      </lineSegments>

      {packets.length > 0 && (
        <points ref={packetRef} geometry={packetGeom}>
          <pointsMaterial
            size={0.22}
            vertexColors
            transparent
            opacity={0.58}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </points>
      )}
    </group>
  );
}
