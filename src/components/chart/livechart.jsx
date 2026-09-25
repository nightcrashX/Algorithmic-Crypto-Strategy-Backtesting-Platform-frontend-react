import React, { useState, useEffect, useRef } from 'react';
import { createChart , CandlestickSeries} from 'lightweight-charts';

export default function DynamicLiveChart() {
  // 1. Reactive State Variables for Stream Parameters
  const [exchange, setExchange] = useState('binance');
  const [symbol, setSymbol] = useState('BTCUSDT');
  const [timeframe, setTimeframe] = useState('1m');

  const chartContainerRef = useRef(null);
  const candleSeriesRef = useRef(null);
  const wsRef = useRef(null);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    // 2. Initialize TradingView Chart Canvas
    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: 400,
      layout: { backgroundColor: '#131722', textColor: '#d1d4dc' },
      grid: { vertLines: { color: '#2b2b3a' }, horzLines: { color: '#2b2b3a' } },
      timeScale: { timeVisible: true, secondsVisible: false },
    });

    // 3. Add fresh series configuration
    const candleSeries = chart.addSeries(CandlestickSeries,{
      upColor: '#26a69a', downColor: '#ef5350',
      borderUpColor: '#26a69a', borderDownColor: '#ef5350',
      wickUpColor: '#26a69a', wickDownColor: '#ef5350',
    });
    candleSeriesRef.current = candleSeries;

    // 4. Construct the Dynamic FastAPI Router Endpoint Path
    const wsUrl = `ws://localhost:8000/live/ws/candles/${exchange}/${symbol}/${timeframe}`;
    console.log(`📡 Connecting to new stream: ${wsUrl}`);
    
    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    // 5. Update the chart stream with new JSON ticks
    ws.onmessage = (event) => {
      try {
        const liveCandle = JSON.parse(event.data);
        if (candleSeriesRef.current) {
          candleSeriesRef.current.update(liveCandle);
        }
      } catch (err) {
        console.error("Parsing error:", err);
      }
    };

    ws.onopen = () => console.log(`✅ Connected to ${exchange.toUpperCase()}`);
    ws.onerror = (error) => console.error("❌ WebSocket Error:", error);
    ws.onclose = () => console.log("🔌 Previous WebSocket closed.");

    const handleResize = () => {
      chart.applyOptions({ width: chartContainerRef.current.clientWidth });
    };
    window.addEventListener('resize', handleResize);

    // 6. CRITICAL CLEANUP: Runs every time a user changes a dropdown!
    // Closes the old connection & destroys the old chart before building the new one
    return () => {
      window.removeEventListener('resize', handleResize);
      if (wsRef.current) {
        wsRef.current.close();
      }
      chart.remove();
    };
    
    // 7. Hook Dependancy Array recalculates the whole effect when these values change
  }, [exchange, symbol, timeframe]); 

  return (
    <div style={{ backgroundColor: '#131722', padding: '20px', borderRadius: '8px', fontFamily: 'sans-serif' }}>
      
      {/* --- STREAM FILTER CONTROLS PANEL --- */}
      <div style={{ display: 'flex', gap: '15px', marginBottom: '20px', alignItems: 'center' }}>
        
        {/* Exchange Selector */}
        <label style={{ color: '#fff' }}> Exchange:
          <select value={exchange} onChange={(e) => setExchange(e.target.value)} style={selectStyle}>
            <option value="binance">Binance</option>
            <option value="kucoin">Kucoin</option>
            <option value="kraken">Kraken</option>
          </select>
        </label>

        {/* Symbol Input */}
        <label style={{ color: '#fff' }}> Symbol:
          <input 
            type="text" 
            value={symbol} 
            onChange={(e) => setSymbol(e.target.value.toUpperCase())} 
            placeholder="e.g. BTCUSDT"
            style={inputStyle}
          />
        </label>

        {/* Timeframe Selector */}
        <label style={{ color: '#fff' }}> Timeframe:
          <select value={timeframe} onChange={(e) => setTimeframe(e.target.value)} style={selectStyle}>
            <option value="1m">1 Minute</option>
            <option value="5m">5 Minutes</option>
            <option value="15m">15 Minutes</option>
            <option value="1h">1 Hour</option>
            <option value="1d">1 Day</option>
          </select>
        </label>
      </div>

      {/* --- CHART CANVAS CONTAINER --- */}
      <div ref={chartContainerRef} style={{ width: '100%' }} />
    </div>
  );
}

// Minimal CSS-in-JS UI styling props
const selectStyle = { padding: '6px 10px', marginLeft: '5px', borderRadius: '4px', backgroundColor: '#2b2b3a', color: '#fff', border: 'none' };
const inputStyle = { padding: '6px 10px', marginLeft: '5px', borderRadius: '4px', backgroundColor: '#2b2b3a', color: '#fff', border: 'none', width: '100px' };
