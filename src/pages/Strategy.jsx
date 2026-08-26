import { Plus, SlidersHorizontal, Trash2 } from "lucide-react";

const conditions = [
  ["EMA 20", "crosses above", "EMA 50"],
  ["RSI 14", "is below", "35"],
  ["Volume", "is greater than", "20 period average"],
];

const indicatorGroups = ["Trend", "Momentum", "Volatility", "Volume", "Moving Averages", "Market Structure", "Smart Money Concepts"];

function Strategy() {
  return (
    <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
      <section className="space-y-4">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-cyan-300">Strategy builder</p>
          <h1 className="mt-1 text-2xl font-semibold text-white">Rules and Indicator System</h1>
          <p className="mt-1 text-sm text-slate-500">Compose entries, exits, and risk controls with reusable condition rows.</p>
        </div>

        <div className="terminal-panel rounded-lg">
          <div className="flex items-center justify-between border-b border-[#202938] px-4 py-3">
            <h2 className="text-sm font-semibold text-white">Entry Conditions</h2>
            <button type="button" className="flex h-8 items-center gap-1 rounded-md bg-cyan-400 px-3 text-xs font-semibold text-[#041014]">
              <Plus size={14} />
              Add
            </button>
          </div>
          <div className="divide-y divide-[#141c28]">
            {conditions.map(([indicator, operator, value]) => (
              <div key={`${indicator}-${operator}`} className="grid gap-2 p-3 md:grid-cols-[1fr_1fr_1fr_40px]">
                {[indicator, operator, value].map((item) => (
                  <select key={item} defaultValue={item} className="terminal-input px-3 text-sm">
                    <option>{item}</option>
                  </select>
                ))}
                <button type="button" title="Remove" className="grid h-9 w-9 place-items-center rounded-md text-slate-500 hover:bg-red-400/10 hover:text-red-300">
                  <Trash2 size={15} />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="terminal-panel rounded-lg">
          <div className="border-b border-[#202938] px-4 py-3">
            <h2 className="text-sm font-semibold text-white">Exit Conditions</h2>
          </div>
          <div className="grid gap-3 p-3 md:grid-cols-3">
            {["Take profit hit", "Trailing stop triggered", "EMA 20 crosses below EMA 50"].map((item) => (
              <label key={item} className="flex items-center gap-2 rounded-md border border-[#263142] bg-[#0a0f16] px-3 py-2 text-sm text-slate-300">
                <input type="checkbox" defaultChecked className="accent-cyan-400" />
                {item}
              </label>
            ))}
          </div>
        </div>
      </section>

      <aside className="space-y-4">
        <div className="terminal-panel rounded-lg p-4">
          <div className="mb-3 flex items-center gap-2">
            <SlidersHorizontal size={16} className="text-cyan-300" />
            <h2 className="text-sm font-semibold text-white">Risk Management</h2>
          </div>
          <div className="space-y-3">
            {["Position size 10%", "Stop loss 2.0%", "Take profit 4.5%", "Trailing stop 1.2%"].map((value) => (
              <input key={value} defaultValue={value} className="w-full terminal-input px-3 text-sm" />
            ))}
          </div>
        </div>

        <div className="terminal-panel rounded-lg p-4">
          <h2 className="mb-3 text-sm font-semibold text-white">Indicator Categories</h2>
          <div className="flex flex-wrap gap-2">
            {indicatorGroups.map((group) => (
              <span key={group} className="rounded border border-[#263142] bg-[#0a0f16] px-2 py-1 text-xs text-slate-400">
                {group}
              </span>
            ))}
          </div>
        </div>
      </aside>
    </div>
  );
}

export default Strategy;
