// export const BASE_URL = "http://127.0.0.1:8000";
// export const BASE_URL = "http://localhost:8000";
// export const BASE_URL = "https://algorithmic-crypto-strategy-backtesting.onrender.com";
// constants.js
export const BASE_URL = import.meta.env.DEV ? "" : "https://algorithmic-crypto-strategy-backtesting-ylnh.onrender.com";

// export const API_URL = import.meta.env.VITE_API_URL ? "" : "https://algorithmic-crypto-strategy-backtesting.onrender.com";

const wsUrl = BASE_URL
  .replace(/^http:/, "ws:")
  .replace(/^https:/, "wss:");

// const ws = new WebSocket(
//   `${wsUrl}/live/ws/candles/${exchange}/${symbol}/${timeframe}`
// );

