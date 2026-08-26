import { useCallback, useEffect, useRef } from "react";
import { ChartEngine } from "./ChartEngine";
import { useChart } from "../../hooks/useChart";
import { loadIndicator } from "../../hooks/useIndicator";
import useChartStore from "../../store/chartStore";
import useIndicatorStore from "../../store/indicatorStore";
// import WebSocket  from "vite";

function ChartCanvas() {
  const containerRef = useRef(null);
  const engineRef = useRef(null);
  const wsRef = useRef(null);

  const exchange = useChartStore((s) => s.exchange);
  const symbol = useChartStore((s) => s.symbol);
  const timeframe = useChartStore((s) => s.timeframe);

  const indicators = useIndicatorStore((s) => s.indicators);

  const { data, isLoading } = useChart(exchange, symbol, timeframe);

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
  
  useEffect(() => {
      // if (!chartContainerRef.current) return;
      if (!engineRef.current || !data || data.length === 0) return; /// add
      
      // 2. Initialize TradingView Chart Canvas
      // const chart = createChart(chartContainerRef.current, {
      //   width: chartContainerRef.current.clientWidth,
      //   height: 400,
      //   layout: { backgroundColor: '#131722', textColor: '#d1d4dc' },
      //   grid: { vertLines: { color: '#2b2b3a' }, horzLines: { color: '#2b2b3a' } },
      //   timeScale: { timeVisible: true, secondsVisible: false },
      // });
  
      // // 3. Add fresh series configuration
      // const candleSeries = chart.addSeries(CandlestickSeries,{
      //   upColor: '#26a69a', downColor: '#ef5350',
      //   borderUpColor: '#26a69a', borderDownColor: '#ef5350',
      //   wickUpColor: '#26a69a', wickDownColor: '#ef5350',
      // });
      // candleSeriesRef.current = candleSeries;
  
      // 4. Construct the Dynamic FastAPI Router Endpoint Path
      // const wsUrl = `ws://localhost:8000/live/ws/candles/${exchange}/${symbol}/${timeframe}`;
      // console.log(`📡 Connecting to new stream: ${wsUrl}`);
      
      // const ws = new WebSocket(wsUrl);
      // wsRef.current = ws;
  
      // ws.onopen = () => console.log(`✅ Connected to ${exchange.toUpperCase()}`);
      // // 5. Update the chart stream with new JSON ticks
      // ws.onmessage = (event) => {
      //   try {
      //     const liveCandle = JSON.parse(event.data);
      //     if (candleSeriesRef.current) {
      //       candleSeriesRef.current.update(liveCandle);
      //     }
      //   } catch (err) {
      //     console.error("Parsing error:", err);
      //   }
      // };
  
      
      // ws.onerror = (error) => console.error("❌ WebSocket Error:", error);
      // ws.onclose = () => console.log("🔌 Previous WebSocket closed.");
  
      // const ws = new WebSocket(
      //   "ws://localhost:8000/live/ws/candles/binance/BTCUSDT/15m"
      // );
      // const ws = new WebSocket(
      //   `ws://ws://localhost:8000/live/ws/candles/${exchange}/${symbol}/${timeframe}``
      //   // ws://localhost:8000/live/ws/candles/coinbase/BTC-USD/15m
      // );
      const socketUrl = window.location.protocol === 'https:' ? `wss://ws://localhost:8000/live/ws/candles/${exchange}/${symbol}/${timeframe}` : `ws://localhost:8000/live/ws/candles/${exchange}/${symbol}/${timeframe}`;

      const ws = new WebSocket(socketUrl)
  
      ws.onopen = () => {
        console.log("✅ WebSocket connected");
      };
  
      // ws.onmessage = (event) => {
      //   const message = JSON.parse(event.data);
      
      //   console.log("📡 WebSocket:", message);
      //   engineRef.current.setdata(data);
      
      //   // if (message.type === "history") {
      //   //   const candles = message.data.map((candle) => ({
      //   //     time: Math.floor(candle[0] / 1000),
      //   //     // time: candle[0],
      //   //     open: candle[1],
      //   //     high: candle[2],
      //   //     low: candle[3],
      //   //     close: candle[4],
      //   //   }));
      //   //   engineRef.current.setData(candles); // addd
      //     // candleSeries.setData(candles);
      //   // }
      
      //   if (message.type === "update") {
      //     const candle = message.data;
        
      //     // candleSeries.update({
      //     //   time: candle.time,
      //     //   open: candle.open,
      //     //   high: candle.high,
      //     //   low: candle.low,
      //     //   close: candle.close,
      //     // });

      //     engineRef.current.update({
      //       time: candle.time,
      //       open: candle.open,
      //       high: candle.high,
      //       low: candle.low,
      //       close: candle.close,
      //     });
      //   }
      // };
      ws.onmessage = (event) => {
        const message = JSON.parse(event.data);

        if (message.type === "history") {
          const candles = message.data.map((candle) => ({
            // time: Math.floor(candle[0] / 1000),
            time: candle[0],
            open: candle[1],
            high: candle[2],
            low: candle[3],
            close: candle[4],
          }));
        
          const volumes = message.data.map((candle) => ({
            // time: Math.floor(candle[0] / 1000),
            time: candle[0],
            value: candle[5],
            color:
              candle[4] >= candle[1]
                ? "rgba(0, 200, 150, 0.7)"
                : "rgba(255, 80, 80, 0.7)",
          }));
        
          candleSeries.setData(candles);
          volumeSeries.setData(volumes);
        }
      
        if (message.type === "update") {
          const candle = message.data;
        
          candleSeries.update({
            time: candle.time,
            open: candle.open,
            high: candle.high,
            low: candle.low,
            close: candle.close,
          });
        
          volumeSeries.update({
            time: candle.time,
            value: candle.volume,
            color:
              candle.close >= candle.open
                ? "rgba(0, 200, 150, 0.7)"
                : "rgba(255, 80, 80, 0.7)",
          });
        }
      };
      ws.onerror = (error) => {
        console.error("❌ WebSocket Error:", error ,"ws error " , ws.onerror);
        
      };
  
      ws.onclose = () => {
        console.log("🔌 WebSocket disconnected");
      };
  
      const handleResize = () => {
        engineRef.current.applyOptions({ width: containerRef.current.clientWidth });
      };
      window.addEventListener('resize', handleResize);
  
      // 6. CRITICAL CLEANUP: Runs every time a user changes a dropdown!
      // Closes the old connection & destroys the old chart before building the new one
      return () => {
        window.removeEventListener('resize', handleResize);
        if (wsRef.current) {
          wsRef.current.close();
        }
        // engineRef.current.remove();
      };
      
      // 7. Hook Dependancy Array recalculates the whole effect when these values change
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
    <div className="relative min-h-[420px] flex-1 bg-[#080c12]">
      <div ref={containerRef} className="h-full min-h-[420px]" />

      {isLoading && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-[#080c12]/75 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-3 rounded-md border border-[#263142] bg-[#0b1017] px-6 py-5">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-cyan-400 border-t-transparent" />
            <p className="text-sm text-slate-300">Loading chart data...</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default ChartCanvas;
