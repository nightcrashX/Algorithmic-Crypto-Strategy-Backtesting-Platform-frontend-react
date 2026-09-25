import { useCallback, useEffect, useRef, useState } from "react";
import { ChartEngine } from "./ChartEngine";
import { useChart } from "../../hooks/useChart";
import { loadIndicator } from "../../hooks/useIndicator";
import useChartStore from "../../store/chartStore";
import useIndicatorStore from "../../store/indicatorStore";
// Import  new custom WebSocket API service layer
// import { LiveStreamAPI } from "../../services/liveStreamApi"; 
import { LiveStreamAPI } from "../../API/websocket";


function LiveChartCanvas() {

  const ws = useRef(null);
  const [candles,setcandles] = useState([])
  const containerRef = useRef(null);
  const engineRef = useRef(null);

  const exchange = useChartStore((s) => s.exchange);
  const symbol = useChartStore((s) => s.symbol);
  const timeframe = useChartStore((s) => s.timeframe);

  const indicators = useIndicatorStore((s) => s.indicators);

  const { data, isLoading } = useChart(exchange, symbol, timeframe);
  console.log("heelo")
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

    return () => {
      if (engineRef.current) {
        engineRef.current.destroy();
        engineRef.current = null;
      }
    };
  }, []);

  // 2. Load Historical Data & Volume from REST API
  useEffect(() => {
    if (!engineRef.current || !data || data.length === 0) return;

    // Set Candlestick Historical Data
    engineRef.current.setData(data);

    // Map & Set Volume Data
    const volumeData = data.map((candle) => ({
      time: candle.time,
      value: candle.volume ?? candle.value ?? 0,
      color: candle.close >= candle.open ? "#22C55E" : "#EF4444",
    }));

    engineRef.current.setVolume(volumeData);
    engineRef.current.fit();
  }, [data]);

  // 3. Load & Render Indicators from Store
  useEffect(() => {
    if (!engineRef.current) return;

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

export default LiveChartCanvas;
