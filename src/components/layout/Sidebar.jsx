import {
  BarChart3,
  CandlestickChart,
  LineChart,
  PanelLeftClose,
  PanelLeftOpen,
  Settings,
  TestTubeDiagonal,
  WalletCards,
  Clock,
  Zap,
} from "lucide-react";
import { NavLink } from "react-router-dom";

const navItems = [
  { name: "Markets", path: "/markets", icon: BarChart3 },
  { name: "Charts", path: "/dashboard", icon: CandlestickChart },
  { name: "Strategies", path: "/strategy", icon: LineChart },
  { name: "Backtesting", path: "/backtesting", icon: TestTubeDiagonal },
  { name: "Order History", path: "/orderhistory", icon: Clock },
  { name: "Settings", path: "/settings", icon: Settings },
];

function Sidebar({ collapsed = false, onToggle }) {
  return (
    <aside
      className={`relative z-20 flex h-full shrink-0 flex-col border-r border-white/[0.08] bg-[#070b13]/95 text-slate-300 shadow-[4px_0_24px_rgba(0,0,0,0.5)] backdrop-blur-md transition-all duration-300 ease-in-out ${
        collapsed ? "w-[72px]" : "w-[240px]"
      }`}
    >
      {/* Brand Header */}
      <div className="flex h-[62px] items-center justify-between border-b border-white/[0.08] px-3.5">
        <div className="flex min-w-0 items-center gap-3">
          <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-cyan-400/30 bg-gradient-to-br from-cyan-500/20 to-blue-600/20 text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.25)]">
            <CandlestickChart size={20} />
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="truncate text-sm font-bold tracking-tight text-white">AlgoTrade</span>
                <span className="rounded bg-cyan-400/20 px-1 py-0.2 text-[9px] font-bold text-cyan-300">PRO</span>
              </div>
              <p className="text-[10px] font-medium uppercase tracking-[0.25em] text-slate-500">Terminal 3D</p>
            </div>
          )}
        </div>
        <button
          type="button"
          onClick={onToggle}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="grid h-8 w-8 place-items-center rounded-lg text-slate-500 transition hover:bg-white/[0.06] hover:text-white"
        >
          {collapsed ? <PanelLeftClose size={16} /> : <PanelLeftOpen size={16} />}
        </button>
      </div>

      {/* Nav items */}
      <nav className="flex-1 space-y-1.5 px-2.5 py-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.name}
              to={item.path}
              title={collapsed ? item.name : undefined}
              className={({ isActive }) =>
                `group relative flex h-10 items-center gap-3 rounded-lg px-3 text-xs font-semibold tracking-wide transition-all duration-150 ${
                  isActive
                    ? "bg-gradient-to-r from-cyan-500/15 to-transparent text-cyan-300 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] ring-1 ring-cyan-400/30"
                    : "text-slate-400 hover:bg-white/[0.04] hover:text-slate-100"
                } ${collapsed ? "justify-center px-0" : ""}`
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <span className="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-r bg-cyan-400 shadow-[0_0_8px_#22d3ee]" />
                  )}
                  <Icon
                    size={17}
                    className={`shrink-0 transition-transform duration-200 group-hover:scale-110 ${
                      isActive ? "text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]" : "text-slate-400"
                    }`}
                  />
                  {!collapsed && <span className="truncate">{item.name}</span>}
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* System Status Footer */}
      <div className="border-t border-white/[0.08] p-3">
        <div className="rounded-lg border border-white/[0.06] bg-black/40 p-2.5 shadow-inner">
          {!collapsed ? (
            <div className="space-y-1.5 text-[11px]">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 font-medium text-emerald-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_#34d399]" />
                  WebSocket Stream
                </span>
                <span className="num font-semibold text-slate-400">28ms</span>
              </div>
              <div className="flex items-center justify-between text-slate-500">
                <span>Account Mode</span>
                <span className="font-semibold text-cyan-400">Paper $50K</span>
              </div>
            </div>
          ) : (
            <div className="flex justify-center" title="System Connected">
              <Zap size={16} className="text-emerald-400" />
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
