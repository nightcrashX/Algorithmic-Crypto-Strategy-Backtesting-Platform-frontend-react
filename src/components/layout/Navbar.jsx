import { Bell, Menu, Search, ShieldCheck, Wifi, LogOut, Activity } from "lucide-react";
import useChartStore from "../../store/chartStore";
import { logoutUser } from "../../services/authService";
import { useNavigate } from "react-router-dom";

function Navbar({ onMobileMenu }) {
  const symbol = useChartStore((state) => state.symbol);
  const timeframe = useChartStore((state) => state.timeframe);
  const livePrice = useChartStore((state) => state.livePrice);
  
  const navigate = useNavigate();
  const handleLogout = async () => {
    try {
      await logoutUser();
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("logout failed : ", error);
    }
  };
  
  return (
    <header className="relative z-30 flex h-[62px] shrink-0 items-center justify-between border-b border-white/[0.08] bg-[#080d16]/95 px-4 shadow-[0_4px_20px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-md md:px-6">
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          onClick={onMobileMenu}
          className="grid h-9 w-9 place-items-center rounded-lg border border-white/10 bg-white/[0.03] text-slate-400 shadow-sm transition hover:border-cyan-400/40 hover:bg-white/[0.08] hover:text-white lg:hidden"
          title="Open navigation"
        >
          <Menu size={18} />
        </button>

        {/* Global Search Bar */}
        <div className="hidden items-center gap-2.5 rounded-lg border border-white/[0.08] bg-[#04070d]/80 px-3.5 py-1.5 text-sm text-slate-400 shadow-inner transition focus-within:border-cyan-400/50 focus-within:ring-1 focus-within:ring-cyan-400/20 sm:flex">
          <Search size={15} className="text-slate-500" />
          <input
            type="text"
            placeholder="Search markets, strategies, indicators..."
            className="w-56 bg-transparent text-xs text-slate-200 outline-none placeholder:text-slate-600 lg:w-72"
          />
          <kbd className="hidden rounded bg-white/[0.06] px-1.5 py-0.5 text-[10px] font-medium text-slate-500 md:inline-block">⌘K</kbd>
        </div>

        {/* Active Symbol Pill */}
        <div className="flex items-center gap-2 rounded-lg border border-white/[0.08] bg-[#0c121e] px-3 py-1.5 shadow-sm">
          <span className="flex h-2 w-2 rounded-full bg-cyan-400 ring-2 ring-cyan-400/30" />
          <span className="text-xs font-bold tracking-wide text-white">{symbol || "BTCUSDT"}</span>
          <span className="rounded bg-cyan-500/10 px-1.5 py-0.2 text-[10px] font-semibold text-cyan-300">{timeframe || "1m"}</span>
          {livePrice && (
            <span className="num hidden text-xs font-semibold text-emerald-400 md:inline-block">
              ${Number(livePrice).toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </span>
          )}
        </div>
      </div>

      {/* Right Toolbar Controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Live WebSocket Node */}
        <div className="hidden items-center gap-2 rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 text-xs font-medium text-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.15)] md:flex">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
          </span>
          <span>Live WS</span>
          <span className="num text-[11px] text-emerald-400/80">• 24ms</span>
        </div>

        {/* Paper Trading Mode Badge */}
        <div className="hidden items-center gap-1.5 rounded-lg border border-cyan-500/20 bg-cyan-500/10 px-3 py-1.5 text-xs font-medium text-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.1)] sm:flex">
          <ShieldCheck size={14} className="text-cyan-400" />
          <span>Paper Mode</span>
        </div>

        {/* Notification Bell */}
        <button
          type="button"
          title="Notifications"
          className="relative grid h-9 w-9 place-items-center rounded-lg border border-white/[0.08] bg-[#0c121e] text-slate-400 shadow-sm transition hover:border-white/20 hover:bg-[#131b2c] hover:text-white"
        >
          <Bell size={16} />
          <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-cyan-400 ring-2 ring-[#0c121e]" />
        </button>

        {/* Profile Avatar */}
        <div className="flex items-center gap-2 rounded-lg border border-white/[0.08] bg-[#0c121e] p-1 pr-2 shadow-sm">
          <div className="grid h-7 w-7 place-items-center rounded-md bg-gradient-to-br from-cyan-400 to-blue-600 text-xs font-bold text-slate-950 shadow-inner">
            P
          </div>
          <span className="hidden text-xs font-medium text-slate-300 sm:inline-block">Trader</span>
        </div>

        {/* Logout Button */}
        <button
          type="button"
          title="Logout"
          onClick={handleLogout}
          className="grid h-9 w-9 place-items-center rounded-lg border border-white/[0.08] bg-[#0c121e] text-slate-400 shadow-sm transition hover:border-rose-500/40 hover:bg-rose-500/10 hover:text-rose-300"
        >
          <LogOut size={16} />
        </button>
      </div>
    </header>
  );
}

export default Navbar;
