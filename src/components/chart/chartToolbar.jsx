import useChartStore from "../../store/chartStore";

const timeframes = ["1m", "5m", "15m", "1H", "4H", "1D"];

function ChartToolbar() {
  const symbol = useChartStore((state) => state.symbol);
  const timeframe = useChartStore((state) => state.timeframe);
  const setTimeframe = useChartStore((state) => state.setTimeframe);

  return (
    <div className="h-12 border-b border-[#2A2E39] bg-[#131722] flex items-center justify-between px-4">

      {/* Left */}

      <div className="flex items-center gap-6">

        <h2 className="text-white font-semibold">
          {symbol}
        </h2>

      </div>

      {/* Right */}

      <div className="flex items-center gap-2">

        {timeframes.map((tf) => (

          <button
            key={tf}
            onClick={() => setTimeframe(tf)}
            className={`rounded-md px-3 py-1 text-sm transition

            ${
              timeframe === tf
                ? "bg-blue-600 text-white"
                : "text-gray-400 hover:bg-[#1C2330]"
            }`}
          >
            {tf}
          </button>

        ))}

      </div>

    </div>
  );
}

export default ChartToolbar;