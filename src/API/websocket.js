export class LiveStreamAPI {
  constructor({ exchange, symbol, timeframe, onTick, onError }) {
    this.exchange = exchange;
    this.symbol = symbol;
    this.timeframe = timeframe;
    this.onTick = onTick;
    this.onError = onError;
    this.socket = null;
  }

  connect() {
    // 1. Build the dynamic backend path matching  FastAPI router
    const wsUrl = `ws://localhost:8000/live/ws/candles/${this.exchange}/${this.symbol}/${this.timeframe}`;
    console.log(`🔌 Initializing Live Stream API: ${wsUrl}`);

    this.socket = new WebSocket(wsUrl);

    // 2. Capture live candle JSON ticks from FastAPI backend
    this.socket.onmessage = (event) => {
      try {
        const liveCandle = JSON.parse(event.data);
        if (this.onTick) {
          this.onTick(liveCandle);
        }
      } catch (err) {
        console.error("Failed to parse incoming streaming tick:", err);
      }
    };

    this.socket.onopen = () => {
      console.log(`✅ Live Stream API Connected: ${this.exchange.toUpperCase()} | ${this.symbol}`);
    };

    this.socket.onerror = (error) => {
      console.error("❌ Live Stream API Socket error:", error);
      if (this.onError) this.onError(error);
    };

    this.socket.onclose = () => {
      console.log("🔌 Live Stream API Socket closed cleanly.");
    };
  }

  // 3. Mandatory cleanup method to close streams when parameters shift
  disconnect() {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
  }
}
