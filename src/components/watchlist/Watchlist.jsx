import { Search, Star } from "lucide-react";
import useChartStore from "../../store/chartStore";
import { marketRows } from "../../utils/marketData";

function Watchlist({ compact = false }) {
  const setSymbol = useChartStore((state) => state.setSymbol);

  return (
    <aside className=" terminal-panel flex min-h-0 flex-col rounded-lg lg:rounded-none lg:border-y-0 lg:border-l-0">
      <div className="flex items-center justify-between border-b border-[#202938] px-3 py-3">
        <div>
          <h2 className="text-sm font-semibold text-white">Watchlist</h2>
          <p className="text-xs text-slate-500">Favorites and movers</p>
        </div>
        <button type="button" title="Add symbol" className="grid h-8 w-8 place-items-center rounded-md text-slate-500 hover:bg-[#151d29] hover:text-yellow-300">
          <Star size={16} />
        </button>
      </div>

      {!compact && (
        <div className="p-3">
          <label className="flex items-center gap-2 terminal-input px-3">
            <Search size={15} className="text-slate-500" />
            <input placeholder="Search symbol" className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-slate-600" />
          </label>
        </div>
      )}

      <div className="min-h-0 flex-1 overflow-auto">
        {marketRows.map((item) => (
          <button
            key={item.symbol}
            type="button"
            onClick={() => setSymbol(item.symbol)}
            className="grid w-full grid-cols-[1fr_auto] gap-3 border-t border-[#141c28] px-3 py-2.5 text-left transition hover:bg-[#121a25]"
          >
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-slate-100">{item.symbol}</p>
              <p className="text-xs text-slate-600">Spot</p>
            </div>
            <div className="text-right">
              <p className="num text-sm text-slate-100">{item.price}</p>
              <p className={`num text-xs ${item.positive ? "text-emerald-300" : "text-red-300"}`}>{item.change}</p>
            </div>
          </button>
        ))}
      </div>
    </aside>
  );
}

export default Watchlist;
