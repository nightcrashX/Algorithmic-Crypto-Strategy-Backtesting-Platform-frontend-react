import api from "./client";

export const getExchanges = () =>
  api.get("/exchange/exchange_list");
//   console.log("api get exchanges",api.get('/exchange/exchange_list'))


export const getSymbols = (exchange) =>
  api.get("/exchange/symbols", {
    params: { exchange },
  });

export const getOHLCV = (exchange, symbol, timeframe) =>
  api.get("/exchange/ohlcv", {
    params: {
      exchange,
      symbol,
      timeframe,
    },
  });