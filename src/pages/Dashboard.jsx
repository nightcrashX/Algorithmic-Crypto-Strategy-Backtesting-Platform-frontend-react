import Watchlist from "../components/watchlist/Watchlist";
import TradingChart from "../components/chart/TradingChart/TradingChart";

import OrderPanel from "../components/orders/OrderPanel";
import LiveChart from "../components/chart/livechart";
import LiveChartCanvas from "../components/chart/liveChartCanvas";
import DynamicLiveChart from "../components/chart/livechart";

function Dashboard() {
  // console.log("hello tinu")
  return (
    // UI CHANGE: Tightened responsive trading-terminal dashboard layout.
    <div className="flex-wrap grid h-[88vh] gap-3 overflow-y-auto lg:grid-cols-[260px_minmax(0,1fr)] xl:grid-cols-[260px_minmax(0,1fr)_300px] xl:gap-0 xl:overflow-hidden xl:rounded-lg">
    {/* // <div className="flex-wrap grid h-[88vh] gap-3 xl:grid-cols-[280px_minmax(0,1fr)_320px] xl:gap-0 overflow-y-auto xl:rounded-lg "> */}

      <Watchlist />
      <TradingChart />

      {/* <DynamicLiveChart /> */}
      
      {/* <LiveChartCanvas/> */}

      <OrderPanel />

    </div>

  );
}

export default Dashboard;
