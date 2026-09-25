import {
  getExchanges,
  getSymbols,
  getOHLCV,
} from "../api/chartApi";

export const fetchExchanges = async () => {
  const res = await getExchanges();
  console.log("res.data", res.data)
  return res.data;
};

export const fetchSymbols = async (exchange) => {
  const res = await getSymbols(exchange);
  return res.data;
};

export const fetchOHLCV = async (
  exchange,
  symbol,
  timeframe,
  page = 1,
  limit = 300,
  toTime = null,
  indicators = null
) => {
  const res = await getOHLCV(
    exchange,
    symbol,
    timeframe,
    page,
    limit,
    toTime,
    indicators
  );

  return res.data;
};