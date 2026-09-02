import Watchlist from "../components/watchlist/Watchlist";
import TradingChart from "../components/chart/TradingChart/TradingChart";
import OrderPanel from "../components/orders/OrderPanel";

function Dashboard() {
  return (
    <div className="grid h-full min-h-[calc(100vh-100px)] w-full gap-3 overflow-y-auto lg:h-[calc(100vh-84px)] lg:grid-cols-[260px_minmax(0,1fr)] lg:overflow-hidden xl:grid-cols-[270px_minmax(0,1fr)_320px] 2xl:grid-cols-[290px_minmax(0,1fr)_350px]">
      {/* Left: Watchlist & Market Mover Feed */}
      <div className="flex h-full min-h-[380px] flex-col overflow-hidden rounded-xl border border-white/[0.08] bg-[#080d16]/90 shadow-[0_8px_30px_rgb(0,0,0,0.4)] backdrop-blur-md">
        <Watchlist />
      </div>

      {/* Center: Interactive Candlestick Chart & Analysis */}
      <div className="flex h-full min-h-[480px] flex-col overflow-hidden rounded-xl border border-white/[0.08] bg-[#080d16]/90 shadow-[0_8px_30px_rgb(0,0,0,0.4)] backdrop-blur-md">
        <TradingChart />
      </div>

      {/* Right: Tactile Order Execution Cockpit */}
      <div className="flex h-full min-h-[480px] flex-col overflow-hidden rounded-xl border border-white/[0.08] bg-[#080d16]/90 shadow-[0_8px_30px_rgb(0,0,0,0.4)] backdrop-blur-md lg:col-span-2 xl:col-span-1">
        <OrderPanel />
      </div>
    </div>
  );
}

export default Dashboard;
