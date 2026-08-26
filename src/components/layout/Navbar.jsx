import { Bell, Menu, Search, ShieldCheck, Wifi,LogOut } from "lucide-react";
import useChartStore from "../../store/chartStore";
import { logoutUser } from "../../services/authService";
import { useNavigate } from "react-router-dom";

function Navbar({ onMobileMenu }) {
  const symbol = useChartStore((state) => state.symbol);
  const timeframe = useChartStore((state) => state.timeframe);
  
  const navigate = useNavigate();
  const handleLogout = async () => {
    try{
      await logoutUser();
      navigate("/login", {replace:true});
    }
    catch (error) {
      console.error("logout failed : ",error)
    }
  }
  
  return (
    // UI CHANGE: Refined compact terminal header with clearer market and status hierarchy.
    <header className="flex h-[60px] shrink-0 items-center justify-between border-b border-[#1b2533] bg-[#090e15]/95 px-3 shadow-[0_1px_0_rgba(255,255,255,0.03)] backdrop-blur md:px-5">
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          onClick={onMobileMenu}
          className="grid h-9 w-9 place-items-center rounded-md text-slate-400 transition hover:bg-[#151d29] hover:text-white lg:hidden"
          title="Open navigation"
        >
          <Menu size={20} />
        </button>
        <div className="hidden items-center gap-2 rounded-md border border-[#263142] bg-[#0a0f16] px-3 py-2 text-sm text-slate-400 shadow-inner sm:flex">
          <Search size={16} />
          <span className="min-w-[180px] text-slate-500">Search markets, indicators...</span>
        </div>
        <div className="min-w-0 rounded-md border border-[#202938] bg-[#0a0f16] px-3 py-1.5 sm:hidden">
          <p className="truncate text-sm font-semibold text-white">{symbol}</p>
          <p className="text-xs text-slate-500">{timeframe}</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="hidden items-center gap-2 rounded-md border border-emerald-400/20 bg-emerald-400/10 px-3 py-1.5 text-xs font-medium text-emerald-300 md:flex">
          <Wifi size={14} aria-hidden="true" />
          Connected
        </div>
        <div className="hidden items-center gap-2 rounded-md border border-[#263142] bg-[#0a0f16] px-3 py-1.5 text-xs text-slate-400 md:flex">
          <ShieldCheck size={14} className="text-cyan-300" />
          Paper mode
        </div>
        <button
          type="button"
          title="Notifications"
          className="relative grid h-9 w-9 place-items-center rounded-md text-slate-400 transition hover:bg-[#151d29] hover:text-white"
        >
          <Bell size={18} />
          <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-cyan-300" />
        </button>

        <button
          type="button"
          className="grid h-9 w-9 place-items-center rounded-md bg-cyan-400 text-sm font-bold text-[#041014]"
          title="Profile"
        >
          P
        </button>
        <button
          type="button"
          title="Logout"
          onClick={handleLogout}
          className="relative grid h-9 w-9 place-items-center rounded-md text-slate-400 transition hover:bg-[#151d29] hover:text-white"
        >
          <LogOut size={18} />
          {/* <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-cyan-300" /> */}
        </button>
      </div>
    </header>
  );
}

export default Navbar;
