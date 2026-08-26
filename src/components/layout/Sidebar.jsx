import {
  Activity,
  BarChart3,
  CandlestickChart,
  Gauge,
  LineChart,
  PanelLeftClose,
  PanelLeftOpen,
  Settings,
  Star,
  TestTubeDiagonal,
  WalletCards,
} from "lucide-react";
import { NavLink } from "react-router-dom";

const navItems = [
  { name: "Markets", path: "/markets", icon: BarChart3 },
  // { name: "Dashboard", path: "/dashboard", icon: Gauge },
  
  { name: "Charts", path: "/dashboard", icon: CandlestickChart },
  { name: "Strategies", path: "/strategy", icon: LineChart },
  { name: "Backtesting", path: "/backtesting", icon: TestTubeDiagonal },
  { name: "Indicators", path: "/indicators", icon: Activity },
  { name: "Watchlist", path: "/watchlist", icon: Star },
  { name: "Settings", path: "/settings", icon: Settings },
];

function Sidebar({ collapsed = false, onToggle }) {
  return (
    <aside
      className={`flex h-full shrink-0 flex-col border-r border-[#202938] bg-[#0b1017] text-slate-300 transition-all duration-200 ${
        collapsed ? "w-[68px]" : "w-[236px]"
      }`}
    >
      <div className="flex h-[60px] items-center justify-between border-b border-[#202938] px-3">
        <div className="flex min-w-0 items-center gap-3">
          <div className="grid h-9 w-9 shrink-0 place-items-center rounded-md border border-cyan-400/30 bg-cyan-400/10 text-cyan-300">
            <CandlestickChart size={20} />
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-white">AlgoTrade</p>
              <p className="text-[11px] uppercase tracking-[0.22em] text-slate-500">Terminal</p>
            </div>
          )}
        </div>
        <button
          type="button"
          onClick={onToggle}
          title={collapsed ? "Collapse sidebar" : "Expand sidebar"}
          className="grid h-8 w-8 place-items-center rounded-md text-slate-500 transition hover:bg-[#151d29] hover:text-white"
        >
          {collapsed ?  <PanelLeftClose size={17}/> : <PanelLeftOpen size={17}/> }
        </button>
      </div>

      <nav className="flex-1 space-y-1 px-2 py-3">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.name}
              to={item.path}
              title={collapsed ? item.name : undefined}
              className={({ isActive }) =>
                `group flex h-10 items-center gap-3 rounded-md px-3 text-sm font-medium transition ${
                  isActive
                    ? "bg-cyan-400/10 text-cyan-200 ring-1 ring-cyan-400/20"
                    : "text-slate-400 hover:bg-[#151d29] hover:text-slate-100"
                } ${collapsed ? "justify-center" : ""}`
              }
            >
              <Icon size={18} className="shrink-0" />
              {!collapsed && <span>{item.name}</span>}
            </NavLink>
          );
        })}
      </nav>

      <div className="border-t border-[#202938] p-3">
        <div className={`${collapsed ? "px-0 text-center" : "px-2"} text-[11px] text-slate-500`}>
          {!collapsed ? (
            <>
              <p className="mb-1 flex items-center gap-2 text-emerald-300">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                Live data ready
              </p>
              <p className="num">Latency 28ms</p>
            </>
          ) : (
            <WalletCards size={18} className="mx-auto" />
          )}
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
