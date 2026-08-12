import { create } from 'zustand';

/**
 * Scroll position, hover target and layer isolation live here so the WebGL
 * scene can read them in useFrame without re-rendering React on every pixel.
 */
export const useStage = create((set) => ({
  progress: 0,          // 0..1 down the page
  hovered: null,        // node id under the cursor
  isolatedTier: -1,     // -1 = show all
  throughput: null,     // latest tick from the API
  setProgress: (progress) => set({ progress }),
  setHovered: (hovered) => set({ hovered }),
  setIsolatedTier: (isolatedTier) => set({ isolatedTier }),
  setThroughput: (throughput) => set({ throughput }),
}));
