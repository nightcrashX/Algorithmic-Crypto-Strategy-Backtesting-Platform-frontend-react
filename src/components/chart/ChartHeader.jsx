import {
  BarChart3,
  Crosshair,
  Expand,
  Shrink,
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

const timeframes = ["1m", "3m", "5m", "15m", "1h", "4h", "1d", "1w"];
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
    <div className="relative z-20 border-b border-white/[0.08] bg-[#070b13]/95">
      {/* Primary Toolbar */}
      <div className="flex min-h-[50px] flex-wrap items-center justify-between gap-2 px-3 py-1.5">
        <div className=" flex flex-wrap items-center gap-2">
          {/* Symbol Selector */}
          <select
            aria-label="Symbol"
            value={symbol}
            onChange={(event) => setSymbol(event.target.value)}
            className="terminal-input h-5 min-w-[150px] rounded-lg px-2 text-xs f text-red-500 shadow-sm transition hover:border-cyan-400/40"
          >
            {(symbols.length ? symbols : [symbol]).map((item) => (
              <option key={item} value={item} className="bg-[#0c121e] text-white-500">
                {item}
              </option>
            ))}
          </select>

          {/* Timeframe Button Group */}
          <div className="flex items-center gap-1 rounded-lg border border-white/[0.08] bg-black/40 p-0.5" role="group" aria-label="Timeframe">
            {timeframes.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setTimeframe(item)}
                className={`h-7 min-w-7 rounded-md px-2 text-[11px] font-bold transition-all ${
                  timeframe === item
                    ? "bg-cyan-400 text-slate-950 shadow-md font-extrabold"
                    : "text-slate-400 hover:bg-white/[0.06] hover:text-white"
                }`}
              >
                {item}
              </button>
            ))}
          </div>

          {/* Indicators Button */}
          <button
            type="button"
            onClick={() => setIndicatorOpen((value) => !value)}
            className="flex h-8 items-center gap-1.5 rounded-lg border border-white/[0.08] bg-[#0c121e] px-3 text-xs font-semibold text-slate-300 shadow-sm transition hover:border-cyan-400/50 hover:bg-cyan-500/10 hover:text-cyan-200"
          >
            <SlidersHorizontal size={14} className="text-cyan-400" />
            <span>Indicators</span>
            {indicators.length > 0 && (
              <span className="grid h-4 w-4 place-items-center rounded-full bg-cyan-400 text-[10px] font-bold text-slate-950">
                {indicators.length}
              </span>
            )}
          </button>
        </div>

        {/* Right Tools */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            title="Chart settings"
            aria-label="Chart settings"
            className="grid h-8 w-8 place-items-center rounded-lg border border-white/[0.08] bg-[#0c121e] text-slate-400 shadow-sm transition hover:border-white/20 hover:text-white"
          >
            <Settings size={15} />
          </button>

          <button
            type="button"
            title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
            aria-label={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
            className="grid h-8 w-8 place-items-center rounded-lg border border-white/[0.08] bg-[#0c121e] text-slate-400 shadow-sm transition hover:border-cyan-400/50 hover:text-cyan-300"
            onClick={toggleFullscreen}
          >
            {isFullscreen ? <Shrink size={15} /> : <Expand size={15} />}
          </button>
        </div>
      </div>

      {/* Drawing Toolbar Sub-row */}
      <div className="flex items-center justify-between border-t border-white/[0.04] px-3 py-1 bg-black/20">
        <div className="flex items-center gap-1 overflow-x-auto">
          {drawingTools.map((tool) => {
            const Icon = tool.icon;
            return (
              <button
                key={tool.name}
                type="button"
                title={tool.name}
                onClick={() => setActiveTool(tool.name)}
                className={`grid h-7 w-7 shrink-0 place-items-center rounded-md transition ${
                  activeTool === tool.name
                    ? "bg-cyan-400/20 text-cyan-300 ring-1 ring-cyan-400/30"
                    : "text-slate-500 hover:bg-white/[0.04] hover:text-white"
                }`}
              >
                <Icon size={14} />
              </button>
            );
          })}
        </div>

        <div className="hidden items-center gap-2 text-xs md:flex">
          <span className="rounded bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-400 border border-emerald-500/20">
            Realtime Candlesticks
          </span>
          <span className="num text-[11px] text-slate-500">{currentMarket.exchange} • {currentMarket.timeframe}</span>
        </div>
      </div>

      {/* Active Indicator Floating Chips */}
      {indicators.length > 0 && (
        <div className="absolute left-3 top-[86px] z-30 flex max-w-[calc(100%-24px)] flex-wrap gap-1.5">
          {indicators.map((indicator) => (
            <div
              key={indicator.id}
              className="flex items-center gap-1.5 rounded-md border border-white/[0.08] bg-[#0c121e]/95 px-2 py-0.5 text-[11px] text-slate-300 shadow-lg backdrop-blur-md"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
              <span className="font-semibold">{indicator.type}</span>
              <button
                type="button"
                title="Indicator settings"
                aria-label={`${indicator.type} settings`}
                onClick={() => setActiveSettingsTarget(indicator)}
                className="text-slate-500 hover:text-cyan-300"
              >
                <Settings size={11} />
              </button>
              <button
                type="button"
                title="Remove indicator"
                aria-label={`Remove ${indicator.type}`}
                onClick={() => removeIndicator(indicator.id)}
                className="text-slate-500 hover:text-rose-400"
              >
                <X size={11} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Indicator Selection Modal */}
      {indicatorOpen && (
        <div className="absolute left-3 top-12 z-50 w-[min(340px,calc(100vw-32px))] rounded-xl border border-white/[0.12] bg-[#090e17]/95 p-3.5 shadow-2xl backdrop-blur-xl animate-in fade-in zoom-in-95 duration-150">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-xs font-bold uppercase tracking-wider text-white">Select Indicator</p>
            <p className="text-[10px] text-slate-500">{registryEntries.length} available</p>
          </div>
          <div className="relative mb-3 flex items-center">
            <Search size={14} className="absolute left-2.5 text-slate-500 pointer-events-none" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search SMA, EMA, RSI, MACD..."
              className="w-full rounded-lg border border-white/[0.08] bg-black/50 py-1.5 pl-8 pr-3 text-xs text-white outline-none focus:border-cyan-400/50 placeholder:text-slate-600"
            />
          </div>
          <div className="max-h-[280px] overflow-y-auto divide-y divide-white/[0.04]">
            {registryEntries.length ? (
              registryEntries.map(([type, meta]) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => addSelectedIndicator(type)}
                  className="flex w-full items-center justify-between rounded-md px-2.5 py-2 text-left text-xs text-slate-300 transition hover:bg-cyan-500/10 hover:text-cyan-200"
                >
                  <span className="font-semibold">{meta?.short_name || type}</span>
                  <span className="rounded bg-white/[0.04] px-1.5 py-0.2 text-[9px] uppercase tracking-wider text-slate-500">
                    {meta?.pane || "main"}
                  </span>
                </button>
              ))
            ) : (
              <p className="px-2 py-6 text-center text-xs text-slate-500">No matching indicators found.</p>
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
