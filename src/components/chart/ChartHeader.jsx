import {
  BarChart3,
  Crosshair,
  Expand,
  Eye,
  Minus,
  PenLine,
  Plus,
  Ruler,
  Search,
  Settings,
  SlidersHorizontal,
  Square,
  Type,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";
import IndicatorMenu from "../indicator/IndicatorMenu";
import { useIndicatorRegistry } from "../../hooks/useIndicator";
import { useMarkets } from "../../hooks/useMarkets";
import useChartStore from "../../store/chartStore";
import useIndicatorStore from "../../store/indicatorStore";
import { useFullscreen } from "../../hooks/useFullScreen";

const timeframes = ["1m", "3m", "5m", "15m", "1h", "4h", "1d","1w"];
const drawingTools = [
  { name: "Trend Line", icon: PenLine },
  { name: "Horizontal Line", icon: Minus },
  { name: "Vertical Line", icon: Plus }, 
  { name: "Ray", icon: Crosshair },
  { name: "Rectangle", icon: Square },
  { name: "Fibonacci", icon: BarChart3 },
  { name: "Text", icon: Type },
  { name: "Measure", icon: Ruler },
];

function ChartHeader() {
  useMarkets();

  const [indicatorOpen, setIndicatorOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeSettingsTarget, setActiveSettingsTarget] = useState(null);
  const [activeTool, setActiveTool] = useState("Trend Line");

  const { indicators, addIndicator, removeIndicator } = useIndicatorStore();
  const registry = useIndicatorRegistry();
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

  const { elementRef, isFullscreen, error, toggleFullscreen } = useFullscreen();

  const registryEntries = useMemo(() => {
    return Object.entries(registry).filter(([key, meta]) => {
      const label = `${key} ${meta?.short_name || ""}`.toLowerCase();
      return label.includes(query.toLowerCase());
    });
  }, [query, registry]);

  const addSelectedIndicator = (type) => {
    const meta = registry[type];
    if (!meta) return;

    addIndicator({
      id: crypto.randomUUID(),
      type,
      settings: meta.defaults || {},
      style: meta.style || { color: "#22d3ee", lineWidth: 2 },
      pane: meta.pane || "main",
      output: meta.output,
    });
    setIndicatorOpen(false);
    setQuery("");
  };

  const currentMarket = { exchange, symbol, timeframe };

  return (
    // UI CHANGE: Redesigned market controls and indicator tools for a compact TradingView-style header.
    <div className="relative z-20 border-b border-[#1b2533] bg-[#0a0f16]">
      <div className="flex min-h-[54px] flex-wrap items-center gap-2 px-3 py-2">
        {/* <select aria-label="Exchange" value={exchange} onChange={(event) => setExchange(event.target.value)} className="terminal-input h-9 min-w-[118px] px-2 text-sm font-semibold uppercase">
          {(exchanges.length ? exchanges : [exchange]).map((item) => (
            <option key={item} value={item}>{item}</option>
          ))}
        </select> */}

        <select aria-label="Symbol" value={symbol} onChange={(event) => setSymbol(event.target.value)} className="terminal-input h-9 min-w-[140px] px-2 text-sm font-semibold text-white">
          {(symbols.length ? symbols : [symbol]).map((item) => (
            <option key={item} value={item}>{item}</option>
          ))}
        </select>

        <div className="flex max-w-full items-center gap-1 overflow-x-auto rounded-md border border-[#263142] bg-[#070b11] p-1" role="group" aria-label="Timeframe">
          {timeframes.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setTimeframe(item)}
              className={`h-7 min-w-8 rounded px-2 text-xs font-semibold transition ${timeframe === item ? "bg-cyan-400 text-[#041014] shadow-[0_0_0_1px_rgba(34,211,238,0.25)]" : "text-slate-400 hover:bg-[#151d29] hover:text-white"
                }`}
            >
              {item}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={() => setIndicatorOpen((value) => !value)}
          className="flex h-9 items-center gap-2 rounded-md border border-[#263142] bg-[#0a0f16] px-3 text-sm font-medium text-slate-300 transition hover:border-cyan-400/50 hover:text-white"
        >
          <SlidersHorizontal size={16} />
          Indicators
        </button>

        {/* <button type="button" className="h-9 rounded-md border border-[#263142] bg-[#0a0f16] px-3 text-sm text-slate-300 transition hover:border-cyan-400/50 hover:text-white">
          Compare
        </button> */}
        <button type="button" title="Chart settings" aria-label="Chart settings" className="grid h-9 w-9 place-items-center rounded-md border border-[#263142] bg-[#0a0f16] text-slate-400 transition hover:border-cyan-400/50 hover:text-white">
          <Settings size={19} />
        </button>
        {/* <button type="button" title="Fullscreen" aria-label="Fullscreen" className="grid h-9 w-9 place-items-center rounded-md border border-[#263142] bg-[#0a0f16] text-slate-400 transition hover:border-cyan-400/50 hover:text-white">
          <Expand size={19} />
        </button> */}
        <button
          type="button"
          title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
          aria-label={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
          className="grid h-9 w-9 place-items-center rounded-md border border-[#263142] bg-[#0a0f16] text-slate-400 transition hover:border-cyan-400/50 hover:text-white"
          onClick={toggleFullscreen}
        >
          {isFullscreen ? <Shrink size={19} /> : <Expand size={19} />}
        </button>
      </div>

      <div className="flex items-center gap-1 overflow-x-auto border-t border-[#121a25] px-3 py-1.5">
        {drawingTools.map((tool) => {
          const Icon = tool.icon;
          return (
            <button
              key={tool.name}
              type="button"
              title={tool.name}
              onClick={() => setActiveTool(tool.name)}
              className={`grid h-8 w-8 shrink-0 place-items-center rounded-md transition ${activeTool === tool.name ? "bg-cyan-400/10 text-cyan-300" : "text-slate-500 hover:bg-[#151d29] hover:text-white"
                }`}
            >
              <Icon size={16} />
            </button>
          );
        })}
        <div className="ml-auto hidden items-center gap-3 text-xs md:flex">
          <span className="rounded border border-[#263142] bg-[#070b11] px-2 py-1 font-semibold text-white">{currentMarket.symbol}</span>
          <span className="rounded border border-emerald-400/20 bg-emerald-400/10 px-2 py-1 font-medium text-emerald-300">Live</span>
          <span className="num text-slate-500">{currentMarket.exchange} / {currentMarket.timeframe}</span>
        </div>
      </div>

      {indicators.length > 0 && (
        <div className="absolute left-3 top-[112px] z-30 flex max-w-[calc(100%-24px)] flex-wrap gap-2">
          {indicators.map((indicator) => (
            <div key={indicator.id} className="flex items-center gap-2 rounded-md border border-[#263142] bg-[#0b1017]/95 px-2 py-1 text-xs text-slate-300 shadow-lg shadow-black/30 backdrop-blur">
              <span className="font-medium">{indicator.type}</span>
              <button type="button" title="Toggle visibility" aria-label={`Toggle ${indicator.type} visibility`} className="text-slate-500 hover:text-white">
                <Eye size={13} />
              </button>
              <button type="button" title="Indicator settings" aria-label={`${indicator.type} settings`} onClick={() => setActiveSettingsTarget(indicator)} className="text-slate-500 hover:text-cyan-300">
                <Settings size={13} />
              </button>
              <button type="button" title="Remove indicator" aria-label={`Remove ${indicator.type}`} onClick={() => removeIndicator(indicator.id)} className="text-slate-500 hover:text-red-300">
                <X size={13} />
              </button>
            </div>
          ))}
        </div>
      )}

      {indicatorOpen && (
        <div className="absolute left-3 top-12 z-40 w-[min(320px,calc(100vw-32px))] rounded-md border border-[#263142] bg-[#0b1017] p-3 shadow-2xl shadow-black/40">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-sm font-semibold text-white">Indicators</p>
            <p className="text-xs text-slate-500">{registryEntries.length} available</p>
          </div>
          <div className="mb-3 flex items-center gap-2 terminal-input px-3">
            <Search size={15} className="text-slate-500" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search indicators"
              className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-slate-600"
            />
          </div>
          <div className="max-h-[320px] overflow-y-auto">
            {registryEntries.length ? registryEntries.map(([type, meta]) => (
              <button
                key={type}
                type="button"
                onClick={() => addSelectedIndicator(type)}
                className="flex w-full items-center justify-between rounded px-2 py-2 text-left text-sm text-slate-300 transition hover:bg-[#151d29] hover:text-white"
              >
                <span>{meta?.short_name || type}</span>
                <span className="text-[11px] uppercase text-slate-600">{meta?.pane || "main"}</span>
              </button>
            )) : (
              <p className="px-2 py-6 text-center text-sm text-slate-500">No indicators found.</p>
            )}
          </div>
        </div>
      )}

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
