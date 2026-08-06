import { create } from "zustand";

const useIndicatorStore = create((set) => ({

  indicators: [],

  setIndicators: (indicators) =>
    set({ indicators }),

  addIndicator: (indicator) =>
    set((state) => ({
      indicators: [...state.indicators, indicator],
    })),

  removeIndicator: (id) =>
    set((state) => ({
      indicators: state.indicators.filter((i) => i.id !== id),
    })),

  clearIndicators: () =>
    set({
      indicators: [],
    }),

}));

export default useIndicatorStore;