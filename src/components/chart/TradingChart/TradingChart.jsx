import ChartHeader from "../ChartHeader";
import ChartCanvas from "../ChartCanvas";

function TradingChart() {
  return (
    <div className="flex h-full min-h-[360px] flex-1 flex-col overflow-hidden bg-transparent">
      <ChartHeader />
      <div className="relative min-h-0 flex-1 flex flex-col">
        <ChartCanvas />
      </div>
    </div>
  );
}

export default TradingChart;
