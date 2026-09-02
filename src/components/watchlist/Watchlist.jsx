import { Search, Star, TrendingUp, TrendingDown, X } from "lucide-react";
import { useState, useMemo } from "react";
import useChartStore from "../../store/chartStore";
import { marketRows } from "../../utils/marketData";

function Watchlist({ compact = false }) {
  const selectedSymbol = useChartStore((state) => state.symbol);
  const setSymbol = useChartStore((state) => state.setSymbol);
  const [search, setSearch] = useState("");
  const [starred, setStarred] = useState(new Set(["BTCUSDT", "ETHUSDT", "SOLUSDT"]));

  const filteredRows = useMemo(() => {
    if (!search.trim()) return marketRows;
    return marketRows.filter((item) =>
      item.symbol.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  const toggleStar = (symbol, e) => {
    e.stopPropagation();
    setStarred((prev) => {
      const next = new Set(prev);
      if (next.has(symbol)) {
        next.delete(symbol);
      } else {
        next.add(symbol);
      }
      return next;
    });
  };

  return (
    <aside className="flex h-full min-h-0 flex-col bg-transparent">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/[0.08] px-3.5 py-3">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 rounded-full bg-cyan-400" />
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-white">Watchlist</h2>
            <p className="text-[10px] text-slate-500">{filteredRows.length} active markets</p>
          </div>
        </div>
        <span className="rounded bg-white/[0.06] px-2 py-0.5 text-[10px] font-semibold text-slate-400">
          SPOT
        </span>
      </div>

      {/* Search Bar */}
      {!compact && (
        <div className="p-2.5">
          <div className="relative flex items-center">
            <Search size={14} className="absolute left-2.5 text-slate-500 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Filter symbols..."
              className="w-full rounded-lg border border-white/[0.08] bg-[#05080e]/90 py-1.5 pl-8 pr-7 text-xs text-slate-200 shadow-inner outline-none transition focus:border-cyan-400/50 focus:ring-1 focus:ring-cyan-400/20 placeholder:text-slate-600"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="absolute right-2 text-slate-500 hover:text-slate-300"
              >
                <X size={13} />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Rows List */}
      <div className="min-h-0 flex-1 overflow-y-auto divide-y divide-white/[0.04]">
        {filteredRows.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-500">
            No symbols match "{search}"
          </div>
        ) : (
          filteredRows.map((item) => {
            const isSelected = selectedSymbol === item.symbol;
            const isStarred = starred.has(item.symbol);

            return (
              <button
                key={item.symbol}
                type="button"
                onClick={() => setSymbol(item.symbol)}
                className={`group relative flex w-full items-center justify-between px-3.5 py-2.5 text-left transition-all duration-150 ${
                  isSelected
                    ? "bg-cyan-500/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] ring-1 ring-inset ring-cyan-400/25"
                    : "hover:bg-white/[0.03]"
                }`}
              >
                {isSelected && (
                  <span className="absolute left-0 top-1 bottom-1 w-0.5 rounded-r bg-cyan-400 shadow-[0_0_8px_#22d3ee]" />
                )}

                <div className="flex min-w-0 items-center gap-2">
                  <button
                    type="button"
                    onClick={(e) => toggleStar(item.symbol, e)}
                    className="text-slate-600 transition hover:scale-110 hover:text-amber-400"
                  >
                    <Star
                      size={13}
                      className={isStarred ? "fill-amber-400 text-amber-400" : ""}
                    />
                  </button>
                  <div className="min-w-0">
                    <p className={`truncate text-xs font-bold tracking-tight ${isSelected ? "text-cyan-200" : "text-white"}`}>
                      {item.symbol}
                    </p>
                    <p className="text-[10px] text-slate-500">Binance Spot</p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="num text-xs font-semibold text-slate-200">{item.price}</p>
                  <div
                    className={`num mt-0.5 inline-flex items-center gap-0.5 rounded px-1.5 py-0.2 text-[10px] font-bold ${
                      item.positive
                        ? "bg-emerald-500/10 text-emerald-400"
                        : "bg-rose-500/10 text-rose-400"
                    }`}
                  >
                    {item.positive ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                    {item.change}
                  </div>
                </div>
              </button>
            );
          })
        )}
      </div>
    </aside>
  );
}

export default Watchlist;
