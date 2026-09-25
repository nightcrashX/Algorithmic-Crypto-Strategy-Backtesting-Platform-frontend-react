//chartcanvs.jsx
import { useCallback, useEffect, useRef, useState } from "react";
import { ChartEngine } from "./ChartEngine";
import { fetchOHLCV } from "../../services/chartService";
import { loadIndicator } from "../../hooks/useIndicator";
import useChartStore from "../../store/chartStore";
import useIndicatorStore from "../../store/indicatorStore";
import { time } from "framer-motion";
// import WebSocket  from "vite";

function ChartCanvas() {
  const containerRef = useRef(null);
  const engineRef = useRef(null);
  const wsRef = useRef(null);

  const exchange = useChartStore((s) => s.exchange);
  console.log("exchange",exchange)
  const symbol = useChartStore((s) => s.symbol);
  console.log("symbol", symbol)
  const timeframe = useChartStore((s) => s.timeframe);
  console.log("timeframe", timeframe)

  const setLivePrice = useChartStore(
    (state) => state.setLivePrice
  );

  const indicators = useIndicatorStore((s) => s.indicators);
  const indicatorsRef = useRef(indicators);

  const [isLoading, setIsLoading] = useState(true);
  const paginationRef = useRef({
    currentPage: 1,
    nextPage: null,
    hasMore: true,
    isLoading: false,
    oldestTime: null,
    requestedPages: new Set([1]),
  });
  const activeRequestIdRef = useRef(0);

  useEffect(() => {
    indicatorsRef.current = indicators;
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(
        JSON.stringify({
          type: "subscribe_indicators",
          indicators: indicators,
        })
      );
    }
  }, [indicators]);

  // Helper to extract indicator payload
  const getIndicatorPayload = useCallback((result, indicator) => {
    if (!result) return null;
    return (
      result[indicator.id] ||
      result[indicator.type] ||
      result[indicator.type.toLowerCase()] ||
      result.data ||
      result.values ||
      result
    );
  }, []);

  // Helper for styling indicator lines
  const getSeriesStyle = useCallback((indicator, outputKey = "") => {
    const style = indicator.style || {};
    const settings = indicator.settings || {};
    const key = outputKey.toUpperCase();

    const color =
      (key === "SIGNAL" && style.signalColor) ||
      (key === "MACD" && style.macdColor) ||
      (key.includes("K") && style.kColor) ||
      (key.includes("D") && style.dColor) ||
      settings.color ||
      style.color ||
      "#e9ebf1";

    return {
      color,
      lineWidth: style.lineWidth || 2,
      priceLineVisible: false,
      pane: indicator.pane || "main",
    };
  }, []);

  // Helper for histogram data
  const getHistogramData = useCallback((dataList, indicator) => {
    const style = indicator.style || {};
    return dataList.map((item) => ({
      ...item,
      color:
        item.value >= 0
          ? style.histogramUp || "#22C55E"
          : style.histogramDown || "#EF4444",
    }));
  }, []);

  // Helper to render indicators
  const renderIndicatorPayload = useCallback(
    (indicator, payload) => {
      if (!engineRef.current || !engineRef.current.indicatorManager) return;

      if (Array.isArray(payload)) {
        engineRef.current.indicatorManager.addSingle(
          indicator.id,
          payload,
          getSeriesStyle(indicator)
        );
        return;
      }

      if (!payload || typeof payload !== "object") {
        console.warn(
          `Skipping ${indicator.type}: API response format not supported.`,
          payload
        );
        return;
      }

      Object.entries(payload).forEach(([outputKey, outputData]) => {
        if (!Array.isArray(outputData) || outputData.length === 0) return;

        const seriesName = `${indicator.id}-${outputKey}`;

        if (outputKey.toUpperCase().includes("HIST")) {
          engineRef.current.indicatorManager.addHistogram(
            seriesName,
            getHistogramData(outputData, indicator),
            {
              priceFormat: { type: "volume" },
              priceLineVisible: false,
              pane: indicator.pane || "main",
            }
          );
          return;
        }

        engineRef.current.indicatorManager.addSingle(
          seriesName,
          outputData,
          getSeriesStyle(indicator, outputKey)
        );
      });
    },
    [getHistogramData, getSeriesStyle]
  );

  // Helper to load paginated historical data from backend
  const loadHistoricalPage = useCallback(
    async (page, toTime, isPrepend = false) => {
      const currentRequestId = ++activeRequestIdRef.current;
      const p = paginationRef.current;
      p.isLoading = true;

      try {
        const res = await fetchOHLCV(
          exchange,
          symbol,
          timeframe,
          page,
          300,
          toTime,
          indicatorsRef.current
        );

        // STEP 15: Discard if symbol/timeframe changed while request was in-flight
        if (currentRequestId !== activeRequestIdRef.current) return;
        if (!engineRef.current) return;

        const candlesData = res?.candles || res?.data || [];
        const pagination = res?.pagination || {};
        const indicatorsData = res?.indicators || {};

        if (!candlesData || candlesData.length === 0) {
          p.hasMore = false;
          p.isLoading = false;
          return;
        }

        const candles = candlesData.map((c) => ({
          time: Number(c.time),
          open: Number(c.open),
          high: Number(c.high),
          low: Number(c.low),
          close: Number(c.close),
        }));

        const volumes = candlesData.map((c) => ({
          time: Number(c.time),
          value: Number(c.volume ?? 0),
          color:
            Number(c.close) >= Number(c.open)
              ? "rgba(34, 197, 94, 0.7)"
              : "rgba(239, 68, 68, 0.7)",
        }));

        if (isPrepend) {
          // STEP 8 & 11: Prepend older candles and preserve viewport
          engineRef.current.prependCandles(candles, volumes);

          // STEP 9 & 10: Prepend backend-calculated indicators
          if (indicatorsData && engineRef.current.indicatorManager) {
            const im = engineRef.current.indicatorManager;
            const currentIndicators = indicatorsRef.current || [];

            currentIndicators.forEach((ind) => {
              const indPayload = indicatorsData[ind.id];
              if (!indPayload) return;

              if (Array.isArray(indPayload)) {
                im.prependSingle(ind.id, indPayload);
              } else if (typeof indPayload === "object") {
                Object.entries(indPayload).forEach(([key, subData]) => {
                  if (!Array.isArray(subData)) return;
                  const seriesName = `${ind.id}-${key}`;
                  if (key.toUpperCase().includes("HIST")) {
                    im.prependHistogram(
                      seriesName,
                      getHistogramData(subData, ind)
                    );
                  } else {
                    im.prependSingle(seriesName, subData);
                  }
                });
              }
            });
          }
        } else {
          // STEP 4: Initial chart load
          engineRef.current.setData(candles);
          engineRef.current.setVolume(volumes);
          engineRef.current.fit();

          // Render initial backend indicators if available
          if (indicatorsData && engineRef.current.indicatorManager) {
            const currentIndicators = indicatorsRef.current || [];
            currentIndicators.forEach((ind) => {
              const payload = indicatorsData[ind.id];
              if (payload) {
                renderIndicatorPayload(ind, payload);
              }
            });
          }
        }

        // STEP 6: Update backend pagination tracking
        p.currentPage = pagination.page || page;
        p.nextPage =
          pagination.next_page || (pagination.has_more ? page + 1 : null);
        p.hasMore = Boolean(pagination.has_more);
        p.oldestTime = pagination.oldest_timestamp || candles[0].time;
      } catch (err) {
        console.error("Failed to load historical page:", err);
      } finally {
        p.isLoading = false;
        setIsLoading(false);
      }
    },
    [exchange, symbol, timeframe, getHistogramData, renderIndicatorPayload]
  );

  // STEP 14: On mount or symbol/timeframe change, reset page tracking and load Page 1
  useEffect(() => {
    setIsLoading(true);
    paginationRef.current = {
      currentPage: 1,
      nextPage: null,
      hasMore: true,
      isLoading: false,
      oldestTime: null,
      requestedPages: new Set([1]),
    };

    loadHistoricalPage(1, null, false);
  }, [exchange, symbol, timeframe, loadHistoricalPage]);

  // STEP 5 & 7: Trigger next historical page on left scroll without duplicate requests
  useEffect(() => {
    if (!engineRef.current) return;

    const handleRangeChange = (logicalRange) => {
      if (!logicalRange) return;

      // When visible logical range approaches the left boundary (< 50 bars)
      if (logicalRange.from < 50) {
        const p = paginationRef.current;
        if (p.isLoading || !p.hasMore || !p.nextPage) return;
        if (p.requestedPages.has(p.nextPage)) return;

        p.requestedPages.add(p.nextPage);
        loadHistoricalPage(p.nextPage, p.oldestTime, true);
      }
    };

    engineRef.current.subscribeVisibleLogicalRangeChange(handleRangeChange);

    return () => {
      if (engineRef.current) {
        engineRef.current.unsubscribeVisibleLogicalRangeChange(handleRangeChange);
      }
    };
  }, [loadHistoricalPage]);

  // 1. Initialize Chart Engine
  useEffect(() => {
    if (!containerRef.current) return;

    engineRef.current = new ChartEngine(containerRef.current, {
      type: "price",
    });
      // console.log("in chart engine hello")
    return () => {
      if (engineRef.current) {
        engineRef.current.destroy();
        engineRef.current = null;
      }
    };
  }, []);

  
  // useEffect(() => {
  //   if (!engineRef.current) return;

  //   // Close previous WebSocket
  //   if (wsRef.current) {
  //     wsRef.current.close();
  //     wsRef.current = null;
  //   }

  //   // Convert HTTP protocol to WS protocol
  //   const wsProtocol =
  //     window.location.protocol === "https:" ? "wss:" : "ws:";

  //   // Local FastAPI backend
  //   // const wsHost =
  //   //   import.meta.env.VITE_WS_HOST || "127.0.0.1:8000" ;

  //   const wsHost = import.meta.env.VITE_WS_HOST || "algorithmic-crypto-strategy-backtesting.onrender.com";

  //   // Encode symbol because symbols can contain "/"
  //   // const encodedSymbol = encodeURIComponent(symbol);

  //   // const socketUrl =
  //   //   `${wsProtocol}//${wsHost}/live/ws/candles/` +
  //   //   `binance/BTCUSDT/1m`;
  //   const formatSymbol = symbol.replace("/","")
  //   // const socketUrl =
  //   //   `wss://socket.delta.exchange/websocket`;
  //   const indParam =
  //     indicatorsRef.current && indicatorsRef.current.length > 0
  //       ? `?indicators=${encodeURIComponent(JSON.stringify(indicatorsRef.current))}`
  //       : "";
  //   const socketUrl =
  //     `${wsProtocol}//${wsHost}/live/ws/candles/` +
  //     `${exchange}/${formatSymbol}/${timeframe}${indParam}`;

  useEffect(() => {
  if (!engineRef.current) return;

  if (wsRef.current) {
    wsRef.current.close();
    wsRef.current = null;
  }

  // ✅ FIX: Use wss:// for any non-localhost host
  const wsHost =
    import.meta.env.VITE_WS_HOST ||
    "algorithmic-crypto-strategy-backtesting.onrender.com";
  const isLocalHost =
    wsHost.includes("localhost") || wsHost.includes("127.0.0.1");
  const wsProtocol = isLocalHost ? "ws:" : "wss:";

  const formatSymbol = symbol.replace("/", "");

  // ✅ FIX: Pass auth token as query param
  const authToken =
    localStorage.getItem("authToken") ||
    localStorage.getItem("token") ||
    "";
  const params = new URLSearchParams();

  if (authToken) params.set("token", authToken);
  if (indicatorsRef.current && indicatorsRef.current.length > 0) {
    params.set("indicators", JSON.stringify(indicatorsRef.current));
  }

  const query = params.toString();
  const socketUrl =
    `${wsProtocol}//${wsHost}/live/ws/candles/` +
    `${exchange}/${formatSymbol}/${timeframe}` +
    (query ? `?${query}` : "");

    console.log("📡 Connecting WebSocket:", socketUrl);

    const ws = new WebSocket(socketUrl);

    wsRef.current = ws;

    ws.onopen = () => {
      console.log(
        `✅ WebSocket connected: ${exchange}/${symbol}/${timeframe}`
      );
      if (indicatorsRef.current && indicatorsRef.current.length > 0) {
        ws.send(
          JSON.stringify({
            type: "subscribe_indicators",
            indicators: indicatorsRef.current,
          })
        );
      }
    };

    ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);

        console.log("📡 WebSocket message:", message);

        if (!engineRef.current) return;

        // =========================
        // HISTORY
        // =========================
        if (message.type === "history") {
          // If chart not yet populated, set initial data; otherwise preserve existing paginated history
          if (!engineRef.current.klines || engineRef.current.klines.length === 0) {
            const candles = message.data.map((candle) => ({
              // Backend history timestamp is milliseconds
              time: Math.floor(candle[0] / 1000),

              open: Number(candle[1]),
              high: Number(candle[2]),
              low: Number(candle[3]),
              close: Number(candle[4]),
            }));

            const volumes = message.data.map((candle) => ({
              // Backend history timestamp is milliseconds
              time: Math.floor(candle[0] / 1000),

              value: Number(candle[5] ?? 0),

              color:
                Number(candle[4]) >= Number(candle[1])
                  ? "rgba(34, 197, 94, 0.7)"
                  : "rgba(239, 68, 68, 0.7)",
            }));

            // Set candles through ChartEngine
            engineRef.current.setData(candles);

            // Set volume through ChartEngine
            engineRef.current.setVolume(volumes);

            // Fit chart to data
            engineRef.current.fit();

            console.log(
              `✅ Loaded ${candles.length} historical candles from WS`
            );
          }

          return;
        }

        // =========================
        // LIVE UPDATE
        // =========================
        if (message.type === "update") {
          const candle = message.data;

          const liveCandle = {
            // Backend update timestamp is already seconds
            time: Number(candle.time),

            open: Number(candle.open),
            high: Number(candle.high),
            low: Number(candle.low),
            close: Number(candle.close),
          };

          const liveVolume = {
            time: Number(candle.time),

            value: Number(candle.volume ?? 0),

            color:
              Number(candle.close) >= Number(candle.open)
                ? "rgba(34, 197, 94, 0.7)"
                : "rgba(239, 68, 68, 0.7)",
          };

          // Update candle
          engineRef.current.updateCandle(liveCandle);

          // Update volume
          engineRef.current.updateVolume(liveVolume);

          setLivePrice(Number(candle.close));
          // engineRef.current.setLivePrice(close)

          // Live indicators calculated by backend
          if (message.indicators && engineRef.current.indicatorManager) {
            const im = engineRef.current.indicatorManager;

            Object.entries(message.indicators).forEach(([indId, indVal]) => {
              if (indVal === null || indVal === undefined) return;

              // 1. Single-line indicator (EMA, SMA, RSI, ATR, VWAP, OBV, ROC, CCI, Williams %R, ADX, CMF, MFI, A/D, PSAR)
              if (typeof indVal === "number") {
                im.updateSingle(indId, {
                  time: liveCandle.time,
                  value: indVal,
                });
                return;
              }

              // 2. Indicator with direct .value property (e.g. Supertrend { value, trend })
              if (
                typeof indVal === "object" &&
                indVal.value !== undefined &&
                im.hasSeries(indId)
              ) {
                im.updateSingle(indId, {
                  time: liveCandle.time,
                  value: Number(indVal.value),
                });
                return;
              }

              // 3. Multi-output indicators (MACD, Bollinger Bands, Stochastic, Stoch RSI, Aroon, Donchian, Keltner, Ichimoku)
              if (typeof indVal === "object") {
                const currentIndicators = indicatorsRef.current || [];
                const indConfig = currentIndicators.find((i) => i.id === indId);
                const style = indConfig?.style || {};

                Object.entries(indVal).forEach(([subKey, subVal]) => {
                  if (subVal === null || subVal === undefined || isNaN(subVal)) return;

                  const seriesName = `${indId}-${subKey}`;

                  if (subKey.toUpperCase().includes("HIST")) {
                    const numVal = Number(subVal);
                    const histColor =
                      numVal >= 0
                        ? style.histogramUp || "#22C55E"
                        : style.histogramDown || "#EF4444";

                    im.updateHistogram(seriesName, {
                      time: liveCandle.time,
                      value: numVal,
                      color: histColor,
                    });
                  } else {
                    im.updateSingle(seriesName, {
                      time: liveCandle.time,
                      value: Number(subVal),
                    });
                  }
                });
              }
            });
          }

          console.log("📈 Live candle:", liveCandle);
          console.log("📊 Live volume:", liveVolume);
        }
      } catch (error) {
        console.error(
          "❌ WebSocket message parsing error:",
          error,
          event.data
        );
      }
    };

    ws.onerror = (error) => {
      console.error(
        "❌ WebSocket Error:",
        error
      );
    };

    ws.onclose = (event) => {
      console.log(
        "🔌 WebSocket disconnected",
        event.code,
        event.reason
      );
    };

    const handleResize = () => {
  if (!engineRef.current || !containerRef.current) return;

  // Safe execution: Only runs if applyOptions exists as a function
  if (typeof engineRef.current.applyOptions === 'function') {
    engineRef.current.applyOptions({
      width: containerRef.current.clientWidth,
    });
  } else if (engineRef.current.chart && typeof engineRef.current.chart.applyOptions === 'function') {
    // Fallback if your chartengine.js wraps the chart inside an object property
    engineRef.current.chart.applyOptions({
      width: containerRef.current.clientWidth,
    });
  }
};

    window.addEventListener("resize", handleResize);

    // Cleanup ONLY WebSocket
    return () => {
      window.removeEventListener("resize", handleResize);

      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
    };
  }, [exchange, symbol, timeframe]);
  // 3. Load & Render Indicators from Store
  useEffect(() => {
    if (!engineRef.current) return;
    // console.log("heelo")
    let isMounted = true;

    async function loadIndicators() {
      if (!engineRef.current.indicatorManager) return;

      engineRef.current.indicatorManager.removeAll();

      for (const indicator of indicators) {
        try {
          const result = await loadIndicator(
            exchange,
            symbol,
            timeframe,
            indicator
          );

          if (!isMounted || !engineRef.current) return;

          const payload = getIndicatorPayload(result, indicator);
          renderIndicatorPayload(indicator, payload);
        } catch (error) {
          console.error(`Failed to render indicator ${indicator.type}`, error);
        }
      }
    }

    loadIndicators();

    return () => {
      isMounted = false;
    };
  }, [
    indicators,
    exchange,
    symbol,
    timeframe,
    getIndicatorPayload,
    renderIndicatorPayload,
  ]);

  return (
    <div className="relative min-h-[460px] flex-1 w-full bg-[#05080e]">
      <div ref={containerRef} className="h-full w-full min-h-[420px]" />

      {isLoading && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-[#05080e]/75 backdrop-blur-md">
          <div className="flex flex-col items-center gap-3.5 rounded-xl border border-white/[0.1] bg-[#0c121e]/95 px-7 py-6 shadow-2xl">
            <div className="relative flex h-10 w-10 items-center justify-center">
              <div className="absolute h-10 w-10 animate-ping rounded-full bg-cyan-400/20" />
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-cyan-400 border-t-transparent shadow-[0_0_12px_rgba(34,211,238,0.5)]" />
            </div>
            <div className="text-center">
              <p className="text-xs font-bold uppercase tracking-wider text-white">Streaming Candles</p>
              <p className="text-[10px] text-slate-500">Syncing orderbook & price history...</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ChartCanvas;

// 2. Load Historical Data & Volume from REST API
  // useEffect(() => {
  //   if (!engineRef.current || !data || data.length === 0) return;

  //   // Set Candlestick Historical Data
  //   engineRef.current.setData(data);

  //   // Map & Set Volume Data
  //   const volumeData = data.map((candle) => ({
  //     time: candle.time,
  //     value: candle.volume ?? candle.value ?? 0,
  //     color: candle.close >= candle.open ? "#22C55E" : "#EF4444",
  //   }));

  //   engineRef.current.setVolume(volumeData);
  //   engineRef.current.fit();
  // }, [data]);
  
  // useEffect(() => {
  //     // if (!chartContainerRef.current) return;
  //     if (!engineRef.current || !data || data.length === 0) return; /// add
      
  //     // 2. Initialize TradingView Chart Canvas
  //     // const chart = createChart(chartContainerRef.current, {
  //     //   width: chartContainerRef.current.clientWidth,
  //     //   height: 400,
  //     //   layout: { backgroundColor: '#131722', textColor: '#d1d4dc' },
  //     //   grid: { vertLines: { color: '#2b2b3a' }, horzLines: { color: '#2b2b3a' } },
  //     //   timeScale: { timeVisible: true, secondsVisible: false },
  //     // });
  
  //     // // 3. Add fresh series configuration
  //     // const candleSeries = chart.addSeries(CandlestickSeries,{
  //     //   upColor: '#26a69a', downColor: '#ef5350',
  //     //   borderUpColor: '#26a69a', borderDownColor: '#ef5350',
  //     //   wickUpColor: '#26a69a', wickDownColor: '#ef5350',
  //     // });
  //     // candleSeriesRef.current = candleSeries;
  
  //     // 4. Construct the Dynamic FastAPI Router Endpoint Path
  //     // const wsUrl = `ws://localhost:8000/live/ws/candles/${exchange}/${symbol}/${timeframe}`;
  //     // console.log(`📡 Connecting to new stream: ${wsUrl}`);
      
  //     // const ws = new WebSocket(wsUrl);
  //     // wsRef.current = ws;
  
  //     // ws.onopen = () => console.log(`✅ Connected to ${exchange.toUpperCase()}`);
  //     // // 5. Update the chart stream with new JSON ticks
  //     // ws.onmessage = (event) => {
  //     //   try {
  //     //     const liveCandle = JSON.parse(event.data);
  //     //     if (candleSeriesRef.current) {
  //     //       candleSeriesRef.current.update(liveCandle);
  //     //     }
  //     //   } catch (err) {
  //     //     console.error("Parsing error:", err);
  //     //   }
  //     // };
  
      
  //     // ws.onerror = (error) => console.error("❌ WebSocket Error:", error);
  //     // ws.onclose = () => console.log("🔌 Previous WebSocket closed.");
  
  //     // const ws = new WebSocket(
  //     //   "ws://localhost:8000/live/ws/candles/binance/BTCUSDT/15m"
  //     // );
  //     // const ws = new WebSocket(
  //     //   `ws://ws://localhost:8000/live/ws/candles/${exchange}/${symbol}/${timeframe}``
  //     //   // ws://localhost:8000/live/ws/candles/coinbase/BTC-USD/15m
  //     // );
  //     const socketUrl = window.location.protocol === 'https:' ? `wss://ws://localhost:8000/live/ws/candles/${exchange}/${symbol}/${timeframe}` : `ws://localhost:8000/live/ws/candles/${exchange}/${symbol}/${timeframe}`;

  //     const ws = new WebSocket(socketUrl)
  
  //     ws.onopen = () => {
  //       console.log("✅ WebSocket connected");
  //     };
  
  //     // ws.onmessage = (event) => {
  //     //   const message = JSON.parse(event.data);
      
  //     //   console.log("📡 WebSocket:", message);
  //     //   engineRef.current.setdata(data);
      
  //     //   // if (message.type === "history") {
  //     //   //   const candles = message.data.map((candle) => ({
  //     //   //     time: Math.floor(candle[0] / 1000),
  //     //   //     // time: candle[0],
  //     //   //     open: candle[1],
  //     //   //     high: candle[2],
  //     //   //     low: candle[3],
  //     //   //     close: candle[4],
  //     //   //   }));
  //     //   //   engineRef.current.setData(candles); // addd
  //     //     // candleSeries.setData(candles);
  //     //   // }
      
  //     //   if (message.type === "update") {
  //     //     const candle = message.data;
        
  //     //     // candleSeries.update({
  //     //     //   time: candle.time,
  //     //     //   open: candle.open,
  //     //     //   high: candle.high,
  //     //     //   low: candle.low,
  //     //     //   close: candle.close,
  //     //     // });

  //     //     engineRef.current.update({
  //     //       time: candle.time,
  //     //       open: candle.open,
  //     //       high: candle.high,
  //     //       low: candle.low,
  //     //       close: candle.close,
  //     //     });
  //     //   }
  //     // };
  //     ws.onmessage = (event) => {
  //       const message = JSON.parse(event.data);

  //       if (message.type === "history") {
  //         const candles = message.data.map((candle) => ({
  //           // time: Math.floor(candle[0] / 1000),
  //           time: candle[0],
  //           open: candle[1],
  //           high: candle[2],
  //           low: candle[3],
  //           close: candle[4],
  //         }));
        
  //         const volumes = message.data.map((candle) => ({
  //           // time: Math.floor(candle[0] / 1000),
  //           time: candle[0],
  //           value: candle[5],
  //           color:
  //             candle[4] >= candle[1]
  //               ? "rgba(0, 200, 150, 0.7)"
  //               : "rgba(255, 80, 80, 0.7)",
  //         }));
        
  //         candleSeries.setData(candles);
  //         volumeSeries.setData(volumes);
  //       }
      
  //       if (message.type === "update") {
  //         const candle = message.data;
        
  //         candleSeries.update({
  //           time: candle.time,
  //           open: candle.open,
  //           high: candle.high,
  //           low: candle.low,
  //           close: candle.close,
  //         });
        
  //         volumeSeries.update({
  //           time: candle.time,
  //           value: candle.volume,
  //           color:
  //             candle.close >= candle.open
  //               ? "rgba(0, 200, 150, 0.7)"
  //               : "rgba(255, 80, 80, 0.7)",
  //         });
  //       }
  //     };
  //     ws.onerror = (error) => {
  //       console.error("❌ WebSocket Error:", error ,"ws error " , ws.onerror);
        
  //     };
  
  //     ws.onclose = () => {
  //       console.log("🔌 WebSocket disconnected");
  //     };
  
  //     const handleResize = () => {
  //       engineRef.current.applyOptions({ width: containerRef.current.clientWidth });
  //     };
  //     window.addEventListener('resize', handleResize);
  
  //     // 6. CRITICAL CLEANUP: Runs every time a user changes a dropdown!
  //     // Closes the old connection & destroys the old chart before building the new one
  //     return () => {
  //       window.removeEventListener('resize', handleResize);
  //       if (wsRef.current) {
  //         wsRef.current.close();
  //       }
  //       // engineRef.current.remove();
  //     };
      
  //     // 7. Hook Dependancy Array recalculates the whole effect when these values change
  //   }, [exchange, symbol, timeframe]);
