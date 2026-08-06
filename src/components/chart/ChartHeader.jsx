import useChartStore from "../../store/chartStore";
import { useMarkets } from "../../hooks/useMarkets";
import useIndicatorStore from "../../store/indicatorStore";
import { useIndicatorRegistry } from "../../hooks/useIndicator";


function ChartHeader() {

  useMarkets();

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

  return (

    <div className="h-12 bg-[#131722] border-b border-[#2A2E39] flex items-center gap-3 px-4">

      <select
        value={exchange}
        onChange={(e)=>setExchange(e.target.value)}
        className="bg-[#1C2330] rounded px-2 py-1 text-white"
      >
        {console.log("exchanges",exchange)}
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
        <option>5m</option>
        <option>15m</option>
        <option>1h</option>
        <option>4h</option>
        <option>1d</option>

      </select>

      {/* <select
        defaultValue=""
        className="bg-[#1C2330] rounded px-2 py-1 text-white"
        onChange={(e) => {
        
          if (!e.target.value) return;
        
          const meta = registry[e.target.value];
        
          addIndicator({
          
            id: crypto.randomUUID(),
          
            type: e.target.value,
          
            settings: meta.defaults,
          
            style: meta.style,
          
            pane: meta.pane,
          
            output: meta.output,
          
          });
        
          e.target.value = "";
        
        }}
      >     

  <option value="">
    Indicators
  </option>

  {Object.keys(registry).map((item) => (

    <option
      key={item}
      value={item}
    >
      {registry[item].short_name}
    </option>

  ))}

</select> */}

    <select
      // 1. Force the dropdown value to always reset back to the blank option
      value="" 
      className="bg-[#1C2330] rounded px-2 py-1 text-white"
      onChange={(e) => {
        const selectedType = e.target.value;
        if (!selectedType) return;
      
        const meta = registry[selectedType];
        if (!meta) return; // Prevent crashes if metadata is missing
      
        // 2. Safely add the selected dynamic indicator
        addIndicator({
          id: crypto.randomUUID(),
          type: selectedType,
          settings: meta.defaults || {},
          style: meta.style || { color: "#2962FF", lineWidth: 2 },
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

  );

}

export default ChartHeader;