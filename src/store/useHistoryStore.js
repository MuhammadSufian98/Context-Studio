import { create } from 'zustand';

export const useHistoryStore = create((set) => ({
  history: [], // Array of { role: 'user' | 'assistant', content: string }
  
  addTurn: (role, content) => set((state) => ({
    history: [...state.history, { role, content }]
  })),
  
  clearHistory: () => set({ history: [] }),
  
  // Gets history formatted for LLM context
  getFormattedHistory: () => {
    // Implement logic to format history if needed, or just return the array
  }
}));
