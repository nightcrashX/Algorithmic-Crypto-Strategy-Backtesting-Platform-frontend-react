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
  timeframe
) => {
  const res = await getOHLCV(
    exchange,
    symbol,
    timeframe
  );

  return res.data;
};