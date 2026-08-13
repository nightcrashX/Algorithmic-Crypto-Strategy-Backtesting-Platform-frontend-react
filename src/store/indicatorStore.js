// src/store/indicatorStore.js

import { create } from "zustand";

const useIndicatorStore = create((set) => ({

  indicators: [],

  setIndicators: (indicators) =>
    set({ indicators }),

  addIndicator: (indicator) =>
    set((state) => ({
      indicators: [...state.indicators, indicator],
    })),

  updateIndicator: (id, updatedIndicator) =>
    set((state) => ({
      indicators: state.indicators.map((ind) =>
        ind.id === id ? { ...ind, ...updatedIndicator } : ind
      ),
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