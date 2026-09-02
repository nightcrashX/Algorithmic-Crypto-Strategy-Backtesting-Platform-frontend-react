import { Plus, SlidersHorizontal, Trash2, Cpu, ShieldCheck, Zap, Layers, CheckCircle2 } from "lucide-react";
import { useState } from "react";

const initialConditions = [
  ["EMA 20", "crosses above", "EMA 50"],
  ["RSI 14", "is below", "35"],
  ["Volume", "is greater than", "20 period average"],
];

const indicatorGroups = [
  "Trend (EMA / SMA / SuperTrend)",
  "Momentum (RSI / MACD / Stoch)",
  "Volatility (Bollinger / ATR)",
  "Volume (OBV / VWAP / MFI)",
  "Market Structure & BOS",
  "Order Blocks & FVG",
];

function Strategy() {
  const [conditions, setConditions] = useState(initialConditions);

  const addCondition = () => {
    setConditions((prev) => [...prev, ["EMA 20", "crosses above", "EMA 50"]]);
  };

  const removeCondition = (index) => {
    setConditions((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 rounded-full bg-cyan-400" />
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-cyan-300">Strategy Architect</p>
        </div>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-white lg:text-3xl">
          Algorithmic Rules & Signal Engine
        </h1>
        <p className="mt-1 text-xs text-slate-400">
          Compose multi-timeframe entry signals, automated exit triggers, and dynamic position risk parameters.
        </p>
      </div>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_380px]">
        {/* Left: Signal Logic Builder */}
        <section className="space-y-5">
          {/* Entry Rules Card */}
          <div className="rounded-2xl border border-white/[0.08] bg-[#080d16]/90 p-5 shadow-[0_8px_30px_rgb(0,0,0,0.4)] backdrop-blur-md">
            <div className="mb-4 flex items-center justify-between border-b border-white/[0.06] pb-3">
              <div className="flex items-center gap-2">
                <Cpu size={16} className="text-cyan-400" />
                <h2 className="text-sm font-bold uppercase tracking-wider text-white">Entry Conditions (Long / Buy)</h2>
              </div>
              <button
                type="button"
                onClick={addCondition}
                className="btn-3d-primary flex h-8 items-center gap-1 rounded-lg px-3 text-xs font-bold text-slate-950 shadow-sm"
              >
                <Plus size={13} />
                <span>Add Condition</span>
              </button>
            </div>

            <div className="space-y-3">
              {conditions.map(([indicator, operator, value], index) => (
                <div
                  key={`${index}-${indicator}`}
                  className="flex flex-col gap-2 rounded-xl border border-white/[0.06] bg-[#0c121e] p-3 shadow-inner md:flex-row md:items-center"
                >
                  <span className="grid h-6 w-6 shrink-0 place-items-center rounded bg-cyan-500/10 text-[11px] font-bold text-cyan-300">
                    {index + 1}
                  </span>

                  <select
                    defaultValue={indicator}
                    className="terminal-input h-9 flex-1 rounded-lg px-3 text-xs font-semibold text-white"
                  >
                    <option>EMA 20</option>
                    <option>EMA 50</option>
                    <option>RSI 14</option>
                    <option>MACD Signal</option>
                    <option>Volume</option>
                    <option>Bollinger Lower Band</option>
                  </select>

                  <select
                    defaultValue={operator}
                    className="terminal-input h-9 flex-1 rounded-lg px-3 text-xs font-semibold text-cyan-300"
                  >
                    <option>crosses above</option>
                    <option>crosses below</option>
                    <option>is greater than</option>
                    <option>is below</option>
                    <option>equals</option>
                  </select>

                  <input
                    defaultValue={value}
                    className="terminal-input h-9 flex-1 rounded-lg px-3 text-xs font-semibold text-white"
                  />

                  <button
                    type="button"
                    title="Remove rule"
                    onClick={() => removeCondition(index)}
                    className="grid h-9 w-9 shrink-0 place-items-center rounded-lg text-slate-500 transition hover:bg-rose-500/10 hover:text-rose-400"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Exit Rules Card */}
          <div className="rounded-2xl border border-white/[0.08] bg-[#080d16]/90 p-5 shadow-[0_8px_30px_rgb(0,0,0,0.4)] backdrop-blur-md">
            <div className="mb-4 flex items-center gap-2 border-b border-white/[0.06] pb-3">
              <Zap size={16} className="text-amber-400" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-white">Exit & Take-Profit Triggers</h2>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {[
                "Take profit limit reached (+4.5%)",
                "Dynamic trailing stop triggered (1.2%)",
                "EMA 20 crosses below EMA 50",
                "RSI reaches overbought (75+)",
                "Session close timeout (End of day)",
                "Max holding time (48 Bars)",
              ].map((item, idx) => (
                <label
                  key={item}
                  className="flex items-start gap-2.5 rounded-xl border border-white/[0.06] bg-[#0c121e] p-3 text-xs text-slate-300 shadow-sm transition hover:border-cyan-400/30 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    defaultChecked={idx < 3}
                    className="mt-0.5 h-4 w-4 rounded border-white/10 bg-black/40 accent-cyan-400"
                  />
                  <span className="font-medium">{item}</span>
                </label>
              ))}
            </div>
          </div>
        </section>

        {/* Right: Risk & Model Profiles */}
        <aside className="space-y-5">
          {/* Risk Management Card */}
          <div className="rounded-2xl border border-white/[0.08] bg-gradient-to-br from-[#0c121e]/95 to-[#080d16]/95 p-5 shadow-[0_8px_30px_rgb(0,0,0,0.4)] backdrop-blur-md">
            <div className="mb-4 flex items-center gap-2 border-b border-white/[0.06] pb-3">
              <SlidersHorizontal size={16} className="text-cyan-400" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-white">Risk Parameters</h2>
            </div>

            <div className="space-y-3.5">
              {[
                ["Position Sizing (% Capital)", "10.0%"],
                ["Stop Loss Level", "2.0%"],
                ["Take Profit Target", "4.5%"],
                ["Trailing Stop Offset", "1.2%"],
                ["Max Open Positions", "3"],
                ["Max Daily Drawdown", "5.0%"],
              ].map(([label, val]) => (
                <div key={label}>
                  <label className="text-[11px] font-semibold text-slate-400">{label}</label>
                  <input
                    defaultValue={val}
                    className="mt-1 w-full terminal-input px-3 text-xs font-bold text-white num"
                  />
                </div>
              ))}

              <button
                type="button"
                className="btn-3d-primary mt-2 flex h-10 w-full items-center justify-center gap-2 rounded-xl text-xs font-bold uppercase tracking-wider text-slate-950 shadow-md"
              >
                <ShieldCheck size={14} />
                <span>Save Strategy Profile</span>
              </button>
            </div>
          </div>

          {/* Indicator Suite Registry */}
          <div className="rounded-2xl border border-white/[0.08] bg-gradient-to-br from-[#0c121e]/95 to-[#080d16]/95 p-5 shadow-[0_8px_30px_rgb(0,0,0,0.4)] backdrop-blur-md">
            <div className="mb-3 flex items-center gap-2">
              <Layers size={16} className="text-cyan-400" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-white">Supported Modules</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {indicatorGroups.map((group) => (
                <span
                  key={group}
                  className="rounded-lg border border-white/[0.08] bg-black/40 px-2.5 py-1 text-[11px] font-semibold text-slate-300 shadow-sm"
                >
                  {group}
                </span>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default Strategy;
