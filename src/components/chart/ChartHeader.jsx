import React,{useState} from "react";
import useChartStore from "../../store/chartStore";
import { useMarkets } from "../../hooks/useMarkets";
import useIndicatorStore from "../../store/indicatorStore";
import { useIndicatorRegistry } from "../../hooks/useIndicator";
import IndicatorMenu from '../indicator/IndicatorMenu'; 

function ChartHeader() {

  useMarkets();

  // Extract indicator store actions
  const { indicators, removeIndicator } = useIndicatorStore();
  
  // State definition for the active settings menu
  const [activeSettingsTarget, setActiveSettingsTarget] = useState(null);

  const registry = useIndicatorRegistry();
  
  const addIndicator = useIndicatorStore((s) => s.addIndicator);

  const {
    exchange,
    symbol,
    timeframe,
    exchanges,
    symbols,
    setExchange,
    setSymbol,
    setTimeframe,
  } = useChartStore();

  //  THE FIX: Group your store variables into the currentMarket object expected by IndicatorMenu
  const currentMarket = {
    exchange,
    symbol,
    timeframe
  };

  return (
    <div className="chart-header-container" style={{ position: 'relative' }}>
      
      {/* --- Existing Selectors Container (Binance, BTC/USDT, 15m, Indicators Dropdown) --- */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: '#1c2030', padding: '8px' }}>
        <select
          value={exchange}
          onChange={(e)=>setExchange(e.target.value)}
          className="bg-[#1C2330] rounded px-2 py-1 text-white"
        >
          {exchanges.map((item)=>(
            <option
              key={item}
              value={item}
            >
              {item}
            </option>
          ))}
        </select>

        <select
          value={symbol}
          onChange={(e)=>setSymbol(e.target.value)}
          className="bg-[#1C2330] rounded px-2 py-1 text-white"
        >
          {symbols?.map((item)=>(
            <option
              key={item}
              value={item}
            >
              {item}
            </option>
          ))}
        </select>

        <select
          value={timeframe}
          onChange={(e)=>setTimeframe(e.target.value)}
          className="bg-[#1C2330] rounded px-2 py-1 text-white"
        >
          <option>1m</option>
          <option>3m</option>
          <option>5m</option>
          <option>15m</option>
          <option>1h</option>
          <option>4h</option>
          <option>1d</option>
        </select>

        <select
          value="" 
          className="bg-[#1C2330] rounded px-2 py-1 text-white"
          onChange={(e) => {
            const selectedType = e.target.value;
            if (!selectedType) return;
          
            const meta = registry[selectedType];
            if (!meta) return; 
          
            addIndicator({
              id: crypto.randomUUID(),
              type: selectedType,
              settings: meta.defaults || {},
              style: meta.style || { color: "#ebedf1", lineWidth: 2 },
              pane: meta.pane || "main",
              output: meta.output,
            });
          }}
        >     
          <option value="" disabled hidden>
            Indicators
          </option>
        
          {Object.keys(registry).map((item) => (
            <option key={item} value={item}>
              {registry[item].short_name}
            </option>
          ))}
        </select>
      </div>

      {/* --- Dynamic Active Indicator Chips --- */}
      <div style={{ 
        position: 'absolute', 
        top: '50px', 
        left: '20px', 
        zIndex: 10, 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '6px' 
      }}>
        {indicators.map((ind) => (
          <div 
            key={ind.id} 
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '12px', 
              backgroundColor: 'rgba(30, 34, 45, 0.85)', 
              border: '1px solid #363c4e',
              padding: '4px 10px', 
              borderRadius: '4px',
              color: '#d1d4dc',
              fontSize: '13px'
            }}
          >
            <span>
              {ind.type} ({Object.values(ind.settings || {}).join(', ') || 'Default'})
            </span>

            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              {/* Settings Button */}
              <button 
                onClick={() => setActiveSettingsTarget(ind)} 
                style={{ background: 'none', border: 'none', color: '#848e9c', cursor: 'pointer', padding: 0 }}
                title="Settings"
              >
                ⚙️
              </button>

              {/* Delete Button */}
              <button 
                onClick={() => removeIndicator(ind.id)} 
                style={{ background: 'none', border: 'none', color: '#ff4a4a', cursor: 'pointer', padding: 0, fontWeight: 'bold' }}
                title="Remove"
              >
                ✕
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* --- Settings Modal Popup --- */}
      {activeSettingsTarget && (
        <IndicatorMenu 
          indicator={activeSettingsTarget}
          currentMarket={currentMarket} 
          onClose={() => setActiveSettingsTarget(null)}
        />
      )}
    </div>
  );
}

export default ChartHeader;
