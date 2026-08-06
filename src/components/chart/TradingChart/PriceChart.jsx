import { useEffect, useRef } from "react";

import { ChartEngine } from "../ChartEngine";

import { useChart } from "../../../hooks/useChart";

import useChartStore from "../../../store/chartStore";

import { loadIndicator } from "../../../hooks/useIndicator";

import useIndicatorStore from "../../../store/indicatorStore";

function PriceChart() {

    const indicators = useIndicatorStore((s) => s.indicators);
    const ref = useRef(null);
    const engine = useRef(null);
    const exchange = useChartStore(s => s.exchange);
    const symbol = useChartStore(s => s.symbol);
    const timeframe = useChartStore(s => s.timeframe);
    const { data } = useChart(exchange, symbol, timeframe);
    useEffect(() => {
        engine.current = new ChartEngine(
            ref.current,
            {
                type: "price"
            }
        );
        // engineRef.current = engine.current;
        return () => engine.current.destroy();
    }, []);
    useEffect(() => {
        if (!engine.current) return;
        engine.current.setData(data);
        engine.current.fit();
    }, [data]);
    // useEffect(() => {
    //     if (!engine.current) return;
    //     async function loadIndicators() {
    //         for (const indicator of indicators) {
    //             const result = await loadIndicator(
    //                 exchange,
    //                 symbol,
    //                 timeframe,
    //                 indicator
    //             );
    //             console.log("indicatro",indicator)
    //             console.log("Result",result)
    //             // if (indicator.type === "EMA") {
    //             //     engine.current.indicatorManager.addSingle(
    //             //         indicator.id,
    //             //         result.ema,
    //             //         {
    //             //             color: "#2962FF",
    //             //             lineWidth: 2,
    //             //         }
    //             //     );
    //             // }
    //             if (result && Array.isArray(result.ema) && result.ema.length > 0) {
    //                 engine.current.indicatorManager.addSingle(
    //                     indicator.id,
    //                     result.ema,
    //                     {
    //                         color: "#2962FF",
    //                         lineWidth: 2,
    //                     }
    //                 );
    //             } else {
    //                 console.warn(
    //                     `Skipping EMA calculation: API returned no array data for ${symbol}.`, 
    //                     result
    //                 );
    //             }
    //         }
    //     }
    //     loadIndicators();
    // }, [indicators, exchange, symbol, timeframe]);

    useEffect(() => {
    if (!engine.current) return;
    
    async function loadIndicators() {
        for (const indicator of indicators) {
            try {
                const result = await loadIndicator(
                    exchange,
                    symbol,
                    timeframe,
                    indicator
                );
                
                console.log(`📡 API Response for ${indicator.type}:`, result);

                // 1. Generate the standard lowercase data key (e.g., "ema", "sma", "rsi")
                const key = indicator.type.toLowerCase();
                
                // 2. Fallback strategy: find the data array dynamically if the key doesn't match
                const indicatorData = 
                    (result && Array.isArray(result[key])) ? result[key] :
                    (result && Array.isArray(result.data)) ? result.data : 
                    (result && Array.isArray(result.values)) ? result.values : null;

                // 3. Safety Check: Only load into engine if a valid array with data is found
                if (indicatorData && indicatorData.length > 0) {
                    engine.current.indicatorManager.addSingle(
                        indicator.id,
                        indicatorData,
                        indicator.style || { color: "#2962FF", lineWidth: 2 }
                    );
                    console.log(`✅ Successfully rendered indicator: ${indicator.id}`);
                } else {
                    console.error(
                        `🛑 Cannot render ${indicator.type}! Data is missing or not an array.`,
                        `Looked for keys: "${key}", "data", or "values".`,
                        "Backend response was:", result
                    );
                }

            } catch (err) {
                console.error(`❌ Failed processing indicator ${indicator.id}:`, err);
            }
        }
    }
    
    loadIndicators();
    }, [indicators, exchange, symbol, timeframe]);

    

return (

    <div
        ref={ref}
        className="h-full w-full"
    />

);
};



export default PriceChart;