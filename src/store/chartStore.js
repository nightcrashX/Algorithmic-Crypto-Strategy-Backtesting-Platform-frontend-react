import { create } from "zustand";

const useChartStore = create((set) => ({

  exchange: "binance",

  symbol: "BTC/USDT",

  timeframe: "15m",

  indicators: [],

  exchanges: [],
  symbols: [],

  livePrices: {},

  setLivePrice: (price) =>
    set({
      livePrice: Number(price),
    }),
  
  setExchange: (exchange) =>
    set({ exchange }),

  setSymbol: (symbol) =>
    set({ symbol }),

  setTimeframe: (timeframe) =>
    set({ timeframe }),

  setIndicators: (indicators) =>
    set({ indicators }),

  setExchanges: (exchanges) => set({ exchanges }),

  setSymbols: (symbols) => set({ symbols }),

  

}));

export default useChartStore;