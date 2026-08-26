import TradingChart from "../components/chart/TradingChart/TradingChart";

const metrics = [
  ["Total return", "+18.42%", "text-emerald-300"],
  ["Net profit", "$9,210", "text-emerald-300"],
  ["Win rate", "61.8%", "text-slate-100"],
  ["Profit factor", "1.74", "text-slate-100"],
  ["Max drawdown", "-6.12%", "text-red-300"],
  ["Sharpe ratio", "1.42", "text-slate-100"],
  ["Total trades", "148", "text-slate-100"],
];

function Backtesting() {
  return (
    <div className="grid h-full min-h-[760px] gap-4 xl:grid-cols-[320px_minmax(0,1fr)]">
      <aside className="terminal-panel rounded-lg">
        <div className="border-b border-[#202938] px-4 py-3">
          <h1 className="text-lg font-semibold text-white">Backtest Config</h1>
          <p className="text-xs text-slate-500">Run strategy simulations</p>
        </div>
        <div className="space-y-3 p-4">
          {[
            ["Strategy", "EMA Pullback"],
            ["Exchange", "binance"],
            ["Symbol", "BTC/USDT"],
            ["Timeframe", "15m"],
            ["Capital", "50000"],
            ["Position size", "10%"],
            ["Stop loss", "2%"],
            ["Take profit", "4.5%"],
            ["Commission", "0.04%"],
            ["Slippage", "0.02%"],
            ["Date range", "2025-01-01 to 2026-08-14"],
          ].map(([label, value]) => (
            <label key={label} className="block text-xs text-slate-500">
              {label}
              <input defaultValue={value} className="mt-1 w-full terminal-input px-3 text-sm" />
            </label>
          ))}
          <button type="button" className="h-10 w-full rounded-md bg-cyan-400 text-sm font-semibold text-[#041014] hover:bg-cyan-300">
            Run backtest
          </button>
        </div>
      </aside>

      <section className="grid min-h-0 gap-4 grid-rows-[auto_minmax(420px,1fr)_220px]">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7">
          {metrics.map(([label, value, color]) => (
            <div key={label} className="terminal-panel rounded-lg p-3">
              <p className="text-xs text-slate-500">{label}</p>
              <p className={`num mt-1 text-lg font-semibold ${color}`}>{value}</p>
            </div>
          ))}
        </div>

        <TradingChart />

        <div className="grid gap-4 lg:grid-cols-3">
          {["Equity Curve", "Drawdown", "Monthly Returns"].map((title, index) => (
            <div key={title} className="terminal-panel rounded-lg p-4">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-sm font-semibold text-white">{title}</h2>
                <span className="num text-xs text-slate-500">{index === 1 ? "-6.12%" : "+18.42%"}</span>
              </div>
              <div className="flex h-28 items-end gap-1">
                {Array.from({ length: 18 }).map((_, bar) => (
                  <span
                    key={bar}
                    className={`flex-1 rounded-t ${index === 1 ? "bg-red-300/40" : "bg-cyan-300/40"}`}
                    style={{ height: `${24 + ((bar * 17 + index * 11) % 76)}%` }}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Backtesting;
