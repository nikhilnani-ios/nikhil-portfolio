import * as THREE from 'three';

/**
 * Four arrangements of the same nodes. Scrolling interpolates between them,
 * so the graph never resets — it reorganises.
 *
 *   mesh      the system as it runs
 *   timeline  sorted into the four roles
 *   stack     sorted into architecture tiers
 *   converge  everything folding into one point
 */
export const STAGES = ['mesh', 'timeline', 'stack', 'converge'];
export const CAMERA_Z = { mesh: 42, timeline: 48, stack: 46, converge: 40 };

const rand = (i, k) => {
  const x = Math.sin(i * 127.1 + k * 311.7) * 43758.5453;
  return x - Math.floor(x);
};

export function buildLayouts(nodes) {
  const mesh = nodes.map((n, i) => {
    const a = rand(i, 1) * Math.PI * 2;
    const b = Math.acos(2 * rand(i, 2) - 1);
    const r = 17 + n.tier * 3.4 + rand(i, 3) * 7;
    return new THREE.Vector3(
      r * Math.sin(b) * Math.cos(a),
      r * Math.sin(b) * Math.sin(a) * 0.72,
      r * Math.cos(b),
    );
  });

  const perRole = [0, 0, 0, 0];
  const timeline = nodes.map((n, i) => {
    const k = perRole[n.roleIndex]++;
    return new THREE.Vector3((n.roleIndex - 1.5) * 22, (k - 2.4) * 6.4, -k * 3 + rand(i, 4) * 4);
  });

  const counts = nodes.reduce((acc, n) => ((acc[n.tier] = (acc[n.tier] ?? 0) + 1), acc), {});
  const seen = {};
  const stack = nodes.map((n) => {
    const k = seen[n.tier] = (seen[n.tier] ?? -1) + 1;
    const width = counts[n.tier];
    return new THREE.Vector3((k - (width - 1) / 2) * 11, (2.5 - n.tier) * 8.6, Math.sin(k * 1.7) * 7);
  });

  const converge = nodes.map((_, i) => {
    const a = (i / nodes.length) * Math.PI * 6;
    const r = 3 + i * 0.42;
    return new THREE.Vector3(Math.cos(a) * r, Math.sin(a) * r * 0.6, Math.sin(a * 0.5) * r * 0.4);
  });

  return { mesh, timeline, stack, converge };
}

/** Tier colours: amber for the hot path, mint for services, violet for batch, slate for data. */
export const TIER_COLOR = ['#F5A65B', '#6EE7C8', '#9A8CF5', '#4C6C93', '#6EE7C8', '#F5A65B'];
export const ROLE_COLOR = ['#F5A65B', '#6EE7C8', '#9A8CF5', '#4C6C93'];
