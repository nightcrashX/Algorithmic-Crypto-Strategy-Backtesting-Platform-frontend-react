import TradingChart from "../components/chart/TradingChart/TradingChart";
import { Play, Sliders, BarChart2, TrendingUp, ShieldAlert, Award, ArrowUpRight } from "lucide-react";

const metrics = [
  { label: "Total Return", value: "+18.42%", color: "text-emerald-400", change: "+4.2%", isPositive: true },
  { label: "Net Profit", value: "$9,210.00", color: "text-emerald-400", change: "+$1,420", isPositive: true },
  { label: "Win Rate", value: "61.8%", color: "text-white", change: "91/148", isPositive: true },
  { label: "Profit Factor", value: "1.74", color: "text-cyan-300", change: "Gross 2.1", isPositive: true },
  { label: "Max Drawdown", value: "-6.12%", color: "text-rose-400", change: "Low risk", isPositive: false },
  { label: "Sharpe Ratio", value: "1.42", color: "text-white", change: "Annualized", isPositive: true },
  { label: "Total Trades", value: "148", color: "text-slate-200", change: "Avg 2.4/day", isPositive: true },
];

function Backtesting() {
  return (
    <div className="grid h-full min-h-[760px] gap-4 xl:grid-cols-[330px_minmax(0,1fr)]">
      {/* Left: Simulation Config Drawer */}
      <aside className="rounded-2xl border border-white/[0.08] bg-[#080d16]/90 shadow-[0_8px_30px_rgb(0,0,0,0.4)] backdrop-blur-md flex flex-col">
        <div className="border-b border-white/[0.08] p-4">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-cyan-400" />
            <h1 className="text-sm font-bold uppercase tracking-wider text-white">Backtest Engine</h1>
          </div>
          <p className="text-[10px] text-slate-500">Historical Strategy Simulation</p>
        </div>

        <div className="flex-1 space-y-3.5 overflow-y-auto p-4">
          <div className="space-y-3">
            {[
              ["Strategy", "EMA Pullback Strategy"],
              ["Exchange", "Binance Spot"],
              ["Symbol", "BTCUSDT"],
              ["Timeframe", "15m"],
              ["Initial Capital ($)", "50,000"],
              ["Position Sizing", "10% per trade"],
              ["Stop Loss (%)", "2.0%"],
              ["Take Profit (%)", "4.5%"],
              ["Commission Fee", "0.04%"],
              ["Slippage Model", "0.02%"],
              ["Simulation Range", "2025-01-01 to 2026-08-30"],
            ].map(([label, value]) => (
              <label key={label} className="block">
                <span className="text-[11px] font-semibold text-slate-400">{label}</span>
                <input
                  defaultValue={value}
                  className="mt-1 w-full terminal-input px-3 text-xs font-bold text-white num shadow-inner"
                />
              </label>
            ))}
          </div>

          <button
            type="button"
            className="btn-3d-primary mt-2 flex h-11 w-full items-center justify-center gap-2 rounded-xl text-xs font-bold uppercase tracking-wider text-slate-950 shadow-lg"
          >
            <Play size={14} className="fill-current" />
            <span>Run Backtest Simulation</span>
          </button>
        </div>
      </aside>

      {/* Right: Analytics & Interactive Visuals */}
      <section className="grid min-h-0 gap-4 grid-rows-[auto_minmax(420px,1fr)_220px]">
        {/* KPI Ribbon */}
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7">
          {metrics.map((item) => (
            <div
              key={item.label}
              className="rounded-xl border border-white/[0.08] bg-gradient-to-br from-[#0c121e]/95 to-[#080d16]/95 p-3 shadow-md backdrop-blur-md transition hover:-translate-y-0.5"
            >
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{item.label}</p>
              <p className={`num mt-1 text-base font-extrabold ${item.color}`}>{item.value}</p>
              <p className="mt-1 text-[9px] font-semibold text-slate-500">{item.change}</p>
            </div>
          ))}
        </div>

        {/* Center: Strategy Chart */}
        <div className="rounded-2xl border border-white/[0.08] bg-[#080d16]/90 shadow-md backdrop-blur-md overflow-hidden flex flex-col">
          <TradingChart />
        </div>

        {/* Bottom Performance Visualizations */}
        <div className="grid gap-4 lg:grid-cols-3">
          {[
            { title: "Equity Curve", stat: "+18.42%", color: "from-cyan-400 to-blue-600", barColor: "bg-cyan-400/50" },
            { title: "Maximum Drawdown", stat: "-6.12%", color: "from-rose-500 to-amber-500", barColor: "bg-rose-500/50" },
            { title: "Monthly P&L Returns", stat: "+$9,210", color: "from-emerald-400 to-teal-600", barColor: "bg-emerald-400/50" },
          ].map((card, index) => (
            <div
              key={card.title}
              className="rounded-2xl border border-white/[0.08] bg-gradient-to-br from-[#0c121e]/95 to-[#080d16]/95 p-4 shadow-md backdrop-blur-md flex flex-col justify-between"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xs font-bold uppercase tracking-wider text-white">{card.title}</h2>
                  <p className="text-[10px] text-slate-500">Backtest Timeline</p>
                </div>
                <span className="num rounded-lg border border-white/[0.08] bg-black/40 px-2 py-0.5 text-xs font-bold text-cyan-300">
                  {card.stat}
                </span>
              </div>

              {/* Visualization Bars */}
              <div className="mt-3 flex h-24 items-end gap-1.5 rounded-lg bg-black/30 p-2 border border-white/[0.04]">
                {Array.from({ length: 20 }).map((_, bar) => {
                  const height = 20 + ((bar * 17 + index * 23) % 75);
                  return (
                    <div
                      key={bar}
                      className="group relative flex-1 flex flex-col justify-end h-full"
                    >
                      <div
                        className={`w-full rounded-t transition-all group-hover:brightness-125 ${card.barColor}`}
                        style={{ height: `${height}%` }}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Backtesting;
