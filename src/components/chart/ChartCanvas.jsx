//ChartCanvas.jsx
import { useCallback, useEffect, useRef } from "react";

import { ChartEngine } from "./ChartEngine";

import { useChart } from "../../hooks/useChart";

import { loadIndicator } from "../../hooks/useIndicator";

import useChartStore from "../../store/chartStore";

import useIndicatorStore from "../../store/indicatorStore";

function ChartCanvas() {

  const containerRef = useRef(null);

  const engineRef = useRef(null);

  const exchange = useChartStore((s) => s.exchange);

  const symbol = useChartStore((s) => s.symbol);

  const timeframe = useChartStore((s) => s.timeframe);

  // ===== Change Start =====
  // Ye change isliye kiya kyuki active ChartCanvas me indicatorStore ka data use nahi ho raha tha.
  // Agar ye nahi karenge to EMA/SMA/RSI add hone ke baad bhi same main chart engine me render nahi honge.
  // Iska effect ye hoga ki existing Zustand indicator list se chart par indicators load ho payenge.
  const indicators = useIndicatorStore((s) => s.indicators);
  // ===== Change End =====

  const { data } = useChart(
    exchange,
    symbol,
    timeframe
  );

  // ===== Change Start =====
  // Ye change isliye kiya kyuki backend indicator response indicator.id ke andar data return karta hai.
  // Agar ye helper nahi hoga to EMA/RSI API successful hone ke baad bhi frontend data nahi dhoond payega.
  // useCallback isliye use kiya kyuki ye helpers indicator loading effect ke dependency chain me use hote hain.
  // Iska effect ye hoga ki single aur multi-output dono indicators correct data payload se render honge.
  const getIndicatorPayload = useCallback((result, indicator) => {

    if (!result) return null;

    return result[indicator.id] ||
      result[indicator.type] ||
      result[indicator.type.toLowerCase()] ||
      result.data ||
      result.values ||
      result;

  }, []);

  const getSeriesStyle = useCallback((indicator, outputKey = "") => {

    const style = indicator.style || {};

    const key = outputKey.toUpperCase();

    const color =
      (key === "SIGNAL" && style.signalColor) ||
      (key === "MACD" && style.macdColor) ||
      (key.includes("K") && style.kColor) ||
      (key.includes("D") && style.dColor) ||
      style.color ||
      "#2962FF";

    return {
      color,
      lineWidth: style.lineWidth || 2,
      priceLineVisible: false,
      pane: indicator.pane || "main",
    };

  }, []);

  const getHistogramData = useCallback((dataList, indicator) => {

    const style = indicator.style || {};

    return dataList.map((item) => ({
      ...item,
      color: item.value >= 0
        ? style.histogramUp || "#22C55E"
        : style.histogramDown || "#EF4444",
    }));

  }, []);

  const renderIndicatorPayload = useCallback((indicator, payload) => {

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
        `Skipping ${indicator.type}: API response ka format supported nahi hai.`,
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

  }, [getHistogramData, getSeriesStyle]);
  // ===== Change End =====

  useEffect(() => {

    if (!containerRef.current) return;

    engineRef.current =
      new ChartEngine(containerRef.current,{
        type:"price"
      });
      

    return () => {

      engineRef.current.destroy();

    };

  }, []);

  useEffect(() => {

    if (!engineRef.current) return;

    engineRef.current.setData(data);   // setcandles to setdata

    // Volume Data
    const volumeData = data.map((candle) => ({
        time: candle.time,
        value: candle.volume,
        color:
            candle.close >= candle.open
                ? "#22C55E"
                : "#EF4444",
    }));

    engineRef.current.setVolume(volumeData);  // addvolume to setvolume

    engineRef.current.fit();

  }, [data]);

  // ===== Change Start =====
  // Ye change isliye kiya kyuki indicators ko active one-chart architecture me render karna hai.
  // Existing loadIndicator API aur indicatorStore ko reuse kiya hai, taaki project ka current flow same rahe.
  // Agar ye nahi karenge to ChartHeader se add kiya hua indicator store me rahega par chart par nahi dikhega.
  // Iska effect ye hoga ki main-pane indicators ab same chart me add honge, aur pane info manager ko pass hogi.
  useEffect(() => {

    if (!engineRef.current) return;

    let isMounted = true;

    async function loadIndicators() {

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

          // ===== Change Start =====
          // Ye change isliye kiya kyuki backend result direct ema/rsi key me nahi, indicator.id key me bhejta hai.
          // Multi-output indicators jaise MACD object return karte hain, isliye unke har output ko alag series banana hai.
          // Iska effect ye hoga ki EMA/RSI single line aur MACD line+signal+histogram same chart architecture me render honge.
          const payload = getIndicatorPayload(result, indicator);

          renderIndicatorPayload(indicator, payload);
          // ===== Change End =====

        } catch (error) {

          console.error(
            `Failed to render indicator ${indicator.type}`,
            error
          );

        }

      }

    }

    loadIndicators();

    return () => {
      isMounted = false;
    };

  }, [indicators, exchange, symbol, timeframe, getIndicatorPayload, renderIndicatorPayload]);
  // ===== Change End =====

  return (

    <div
      ref={containerRef}
      className="flex-1"
    />

  );

}

export default ChartCanvas;


// import { useCallback, useEffect, useRef } from "react";
// import {
//   createChart,
//   CandlestickSeries,
// } from "lightweight-charts";

// import { useChart } from "../../hooks/useChart";
// import useChartStore from "../../store/chartStore";

// function ChartCanvas() {

//   const chartContainerRef = useRef(null);
//   const chartRef = useRef(null);
//   const candleSeriesRef = useRef(null);

//   const exchange = useChartStore((state) => state.exchange);
//   const symbol = useChartStore((state) => state.symbol);
//   const timeframe = useChartStore((state) => state.timeframe);

//   const { data } = useChart(
//     exchange,
//     symbol,
//     timeframe
//   );

//   /* ---------------- CREATE CHART ---------------- */

//   useEffect(() => {

//     if (!chartContainerRef.current) return;

//     chartRef.current = createChart(chartContainerRef.current, {

//       layout: {

//         background: {
//           color: "#0D1117",
//         },

//         textColor: "#9CA3AF",

//       },

//       grid: {

//         vertLines: {
//           color: "#1F2937",
//         },

//         horzLines: {
//           color: "#1F2937",
//         },

//       },

//       crosshair: {

//         mode: 1,

//       },

//       rightPriceScale: {

//         borderColor: "#2A2E39",

//       },

//       timeScale: {

//         borderColor: "#2A2E39",

//       },

//       autoSize: true,

//     });

//     candleSeriesRef.current =
//       chartRef.current.addSeries(
//         CandlestickSeries
//       );

//     return () => {

//       chartRef.current.remove();

//     };

//   }, []);

//   /* ---------------- UPDATE DATA ---------------- */

//   useEffect(() => {

//     if (!candleSeriesRef.current) return;

//     candleSeriesRef.current.setData(data);

//   }, [data]);

//   return (

//     <div
//       ref={chartContainerRef}
//       className="flex-1"
//     />

//   );

// }

// export default ChartCanvas;



