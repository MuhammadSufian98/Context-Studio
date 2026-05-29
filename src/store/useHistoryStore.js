import { create } from 'zustand';

export const useHistoryStore = create((set) => ({
  history: [],

  addTurn: (role, content) => set((state) => ({
    history: [...state.history, { role, content }]
  })),

  clearHistory: () => set({ history: [] })
}));
