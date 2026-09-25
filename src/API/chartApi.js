//chartAPI.js
import api from "./client";

export const getExchanges = () =>
  api.get("/exchange/exchange_list");


export const getSymbols = (exchange) =>
  api.get("/exchange/symbols", {
    params: { exchange },
  });

export const getOHLCV = (
  exchange,
  symbol,
  timeframe,
  page = 1,
  limit = 300,
  toTime = null,
  indicators = null
) =>
  api.get("/exchange/ohlcv", {
    params: {
      exchange,
      symbol,
      timeframe,
      page,
      limit,
      ...(toTime !== null && toTime !== undefined ? { to_time: toTime } : {}),
      ...(indicators
        ? {
            indicators:
              typeof indicators === "string"
                ? indicators
                : JSON.stringify(indicators),
          }
        : {}),
    },
  });