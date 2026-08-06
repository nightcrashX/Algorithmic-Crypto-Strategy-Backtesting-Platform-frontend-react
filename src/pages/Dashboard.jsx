import Watchlist from "../components/watchlist/Watchlist";
import TradingChart from "../components/chart/TradingChart/TradingChart";

import OrderPanel from "../components/orders/OrderPanel";

function Dashboard() {
  return (
    <div className="grid h-full grid-cols-[280px_1fr_340px]">

      <Watchlist />

      <TradingChart />

      <OrderPanel />

    </div>
  );
}

export default Dashboard;