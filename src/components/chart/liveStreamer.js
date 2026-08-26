// liveStreamer.js

export class LiveStreamer {
  constructor(symbol = "btcusdt", interval = "1m", onTick) {
    this.symbol = symbol.toLowerCase();
    this.interval = interval;
    this.onTick = onTick; // Callback when a new tick or candle update arrives
    this.ws = null;
  }

  connect() {
    // Binance public WebSocket endpoint for klines/candlesticks
    const streamUrl = `wss://stream.binance.com:9443/ws/${this.symbol}@kline_${this.interval}`;
    this.ws = new WebSocket(streamUrl);

    this.ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      const kline = data.k;

      // Extract and convert data format
      const candle = {
        time: Math.floor(kline.t / 1000), // Time of bar start in seconds
        open: parseFloat(kline.o),
        high: parseFloat(kline.h),
        low: parseFloat(kline.l),
        close: parseFloat(kline.c),
      };

      const volume = {
        time: Math.floor(kline.t / 1000),
        value: parseFloat(kline.v),
        color: parseFloat(kline.c) >= parseFloat(kline.o) ? "#26a69a" : "#ef5350",
      };

      // Pass update to component
      if (this.onTick) {
        this.onTick({ candle, volume, isFinal: kline.x });
      }
    };

    this.ws.onerror = (err) => console.error("WebSocket Error:", err);
    this.ws.onclose = () => console.log("WebSocket Disconnected");
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
}