import { Search, Star } from "lucide-react";

const watchlist = [
  {
    symbol: "BTC/USDT",
    price: "118,245.10",
    change: "+2.48%",
    positive: true,
  },
  {
    symbol: "ETH/USDT",
    price: "4,385.90",
    change: "+1.16%",
    positive: true,
  },
  {
    symbol: "SOL/USDT",
    price: "205.81",
    change: "-3.24%",
    positive: false,
  },
  {
    symbol: "BNB/USDT",
    price: "812.12",
    change: "+0.84%",
    positive: true,
  },
  {
    symbol: "XRP/USDT",
    price: "2.81",
    change: "-1.52%",
    positive: false,
  },
];

function Watchlist() {
  return (
    <aside className="w-[280px] bg-[#131722] border-r border-[#2A2E39] flex flex-col">

      {/* Header */}

      <div className="px-4 py-4 border-b border-[#2A2E39]">

        <h2 className="text-white font-semibold text-lg">
          Watchlist
        </h2>

      </div>

      {/* Search */}

      <div className="p-4">

        <div className="flex items-center gap-2 rounded-lg bg-[#1C2330] px-3 py-2">

          <Search
            size={16}
            className="text-gray-400"
          />

          <input
            placeholder="Search Symbol..."
            className="
              w-full
              bg-transparent
              outline-none
              text-white
              placeholder:text-gray-500
              text-sm
            "
          />

        </div>

      </div>

      {/* Symbols */}

      <div className="flex-1 overflow-y-auto">

        {watchlist.map((item) => (

          <button
            key={item.symbol}
            className="
              w-full
              flex
              items-center
              justify-between
              px-4
              py-3
              border-b
              border-[#1f2632]
              hover:bg-[#1C2330]
              transition
            "
          >

            <div className="flex items-center gap-3">

              <Star
                size={15}
                className="text-gray-500 hover:text-yellow-400"
              />

              <div>

                <p className="text-white text-sm font-medium">
                  {item.symbol}
                </p>

                <p className="text-xs text-gray-500">
                  Crypto
                </p>

              </div>

            </div>

            <div className="text-right">

              <p className="text-white text-sm">
                {item.price}
              </p>

              <p
                className={`text-xs ${
                  item.positive
                    ? "text-green-500"
                    : "text-red-500"
                }`}
              >
                {item.change}
              </p>

            </div>

          </button>

        ))}

      </div>

    </aside>
  );
}

export default Watchlist;