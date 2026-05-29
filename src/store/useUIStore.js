import { create } from 'zustand';

export const useUIStore = create((set) => ({
  status: 'idle', // 'idle' | 'loading' | 'streaming' | 'error'
  error: null,
  estimatedCost: 0,
  estimatedTokens: 0,
  
  setStatus: (status) => set({ status }),
  setError: (error) => set({ error, status: error ? 'error' : 'idle' }),
  
  updateMetrics: (tokens, cost) => set((state) => ({
    estimatedTokens: state.estimatedTokens + tokens,
    estimatedCost: state.estimatedCost + cost
  })),
  
  resetMetrics: () => set({ estimatedCost: 0, estimatedTokens: 0 }),
}));
