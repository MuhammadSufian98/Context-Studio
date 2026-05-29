import { create } from 'zustand';

export const useTextStore = create((set) => ({
  sourceText: '',
  refinedText: '',
  activeTransformation: null,
  
  setSourceText: (text) => set({ sourceText: text }),
  setRefinedText: (text) => set({ refinedText: text }),
  setActiveTransformation: (type) => set({ activeTransformation: type }),
  
  reset: () => set({ sourceText: '', refinedText: '', activeTransformation: null }),
}));
