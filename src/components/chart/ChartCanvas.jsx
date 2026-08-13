//ChartCanvas.jsx
import { useCallback, useEffect, useRef } from "react";

import { ChartEngine } from "./ChartEngine";

import { useChart } from "../../hooks/useChart";

import { loadIndicator } from "../../hooks/useIndicator";

import useChartStore from "../../store/chartStore";

import useIndicatorStore from "../../store/indicatorStore";
import { setFeatureDefinitions } from "framer-motion";

// import addsingle from "../../components/chart/IndicatorManager" ;
// import addSupertrend from "../../components/chart/IndicatorManager"

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

  const {
    data,
    isLoading
    } = useChart(
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

    //  Grab both style and settings safely
    const style = indicator.style || {};
    const settings = indicator.settings || {};

    const key = outputKey.toUpperCase();

    //  UPDATED COLOR RESOLUTION CHAIN
    const color =
      (key === "SIGNAL" && style.signalColor) ||
      (key === "MACD" && style.macdColor) ||
      (key.includes("K") && style.kColor) ||
      (key.includes("D") && style.dColor) ||
      settings.color || // Check user setting overrides from the picker first!
      style.color ||   //  Fall back to registry asset configurations
      "#e9ebf1";        // Default fallback theme color

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

      // if (
      //     indicator.type.toLowerCase() === "SUPERTREND" ||
      //     outputKey.toLowerCase() === "supertrend"
      // ) {
      //     print("enter in supertrend")
      //     console.log("supertrend enter")
      //     engineRef.current.indicatorManager.addSupertrend(
      //         seriesName,
      //         outputData,
      //         getSeriesStyle(indicator, outputKey)
      //     );

      //     return;
      // }
      // const indicatorType = String(indicator.type || "").toLowerCase();
      // const outputType = String(outputKey || "").toLowerCase();

      // const isSupertrend =
      //     indicatorType.includes("supertrend") ||
      //     outputType.includes("supertrend");

      // if (isSupertrend) {

      //     console.log("🔥 USING SUPERTREND RENDERER");

      //     engineRef.current.indicatorManager.addSupertrend(
      //         seriesName,
      //         outputData,
      //         getSeriesStyle(indicator, outputKey)
      //     );
        
      //     return;
      // }

      engineRef.current.indicatorManager.addSingle(
        seriesName,
        outputData,
        getSeriesStyle(indicator, outputKey)
      );

    });

  }, [getHistogramData, getSeriesStyle]);
  // ===== Change End =====
console.log("hello")
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

  // new useffect for live chart using websockets

  // ADD THIS HOOK TO STREAMS LIVE TICKER CANDLE TRANSFERS
  // useEffect(() => {
  //   if (!engineRef.current || !exchange || !symbol || !timeframe) return;

  //   // Build matching WS protocol URI pointing directly to your local FastAPI service routing
  //   const socketUrl = `ws://localhost:8000/indicator/ws/candles/${exchange}/${symbol}/${timeframe}`;
  //   const ws = new WebSocket(socketUrl);

  //   ws.onopen = () => {
  //     console.log(`📡 WebSocket Connected live to ticker stream: ${symbol}`);
  //   };

  //   ws.onmessage = (event) => {
  //     try {
  //       const liveCandle = JSON.parse(event.data);
        
  //       if (!engineRef.current || !liveCandle) return;

  //       // 1. Feed the live tick candle directly into your ChartEngine structure loop
  //       // Lightweight Charts/TradingView engines natively expect single records inside update()
  //       if (engineRef.current.updateData) {
  //         engineRef.current.updateData(liveCandle);
  //       } else if (engineRef.current.candleSeries) {
  //         engineRef.current.candleSeries.update(liveCandle);
  //       } else {
  //         // If you have a custom canvas hook inside your engine:
  //         engineRef.current.setData((prev) => {
  //           const copy = [...prev];
  //           const lastIdx = copy.length - 1;
            
  //           if (lastIdx >= 0 && copy[lastIdx].time === liveCandle.time) {
  //             copy[lastIdx] = liveCandle; // Replace/update final forming active candle
  //           } else {
  //             copy.push(liveCandle); // Spawns a brand new candlestick node structural frame
  //           }
  //           return copy;
  //         });
  //       }

  //       // 2. Format and pipe matching volumes alongside it
  //       const volumeTick = {
  //         time: liveCandle.time,
  //         value: liveCandle.volume,
  //         color: liveCandle.close >= liveCandle.open ? "#22C55E" : "#EF4444"
  //       };
        
  //       if (engineRef.current.volumeSeries) {
  //         engineRef.current.volumeSeries.update(volumeTick);
  //       }

  //     } catch (err) {
  //       console.error("Error reading incoming stream data framework socket packet:", err);
  //     }
  //   };

  //   ws.onerror = (error) => {
  //     console.error("WebSocket network error occurred:", error);
  //   };

  //   ws.onclose = () => {
  //     console.log("📡 WebSocket disconnected safely from server.");
  //   };

  //   // Clean up current running connection streams when market selectors swap indices
  //   return () => {
  //     ws.close();
  //   };
  // }, [exchange, symbol, timeframe]);

  return (

    <div className="relative flex-1">

        <div
            ref={containerRef}
            className="h-full"
        />

        {isLoading && (

            <div className="absolute inset-0 bg-[#0D1117]/60 backdrop-blur-sm flex items-center justify-center z-50">

                <div className="flex flex-col items-center gap-3">

                    <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"/>

                    <p className="text-gray-300 text-sm">

                        Loading Chart...

                    </p>

                </div>

            </div>

        )}

    </div>

  );

}

export default ChartCanvas;
