import {
  BarChart3,
  Bell,
  ChevronDown,
  Search,
  Star,
  ArrowUpDown,
  X,
} from "lucide-react";

import { useEffect, useMemo, useRef, useState } from "react";
import useChartStore from "../store/chartStore";

const WS_URL =
  "wss://stream.binance.com:9443/ws/!miniTicker@arr";

/*
|--------------------------------------------------------------------------
| Fixed initial order
|--------------------------------------------------------------------------
| WebSocket updates NEVER change this order.
| You can add/remove symbols here if you want a custom default order.
*/

const DEFAULT_ORDER = [
  "BTCUSDT",
  "ETHUSDT",
  "USDTUSDT",
  "BNBUSDT",
  "SOLUSDT",
  "XRPUSDT",
  "DOGEUSDT",
  "ADAUSDT",
  "TRXUSDT",
  "AVAXUSDT",
  "LINKUSDT",
  "DOTUSDT",
  "MATICUSDT",
  "LTCUSDT",
  "BCHUSDT",
];

/*
|--------------------------------------------------------------------------
| Coin metadata
|--------------------------------------------------------------------------
| WebSocket provides prices/volume/high/low.
| Static metadata provides display name/logo/category.
|
| Add more coins here whenever required.
*/

const COIN_METADATA = {
  BTCUSDT: {
    name: "Bitcoin",
    category: "Layer 1 / Layer 2",
    type: "Crypto",
  },
  ETHUSDT: {
    name: "Ethereum",
    category: "Layer 1 / Layer 2",
    type: "Crypto",
  },
  USDTUSDT: {
    name: "Tether",
    category: "Payments",
    type: "Crypto",
  },
  BNBUSDT: {
    name: "BNB",
    category: "BSC",
    type: "Crypto",
  },
  SOLUSDT: {
    name: "Solana",
    category: "Solana",
    type: "Crypto",
  },
  XRPUSDT: {
    name: "XRP",
    category: "Payments",
    type: "Crypto",
  },
  DOGEUSDT: {
    name: "Dogecoin",
    category: "MEME",
    type: "Crypto",
  },
  ADAUSDT: {
    name: "Cardano",
    category: "Layer 1 / Layer 2",
    type: "Crypto",
  },
  TRXUSDT: {
    name: "TRON",
    category: "Layer 1 / Layer 2",
    type: "Crypto",
  },
  AVAXUSDT: {
    name: "Avalanche",
    category: "Layer 1 / Layer 2",
    type: "Crypto",
  },
  LINKUSDT: {
    name: "Chainlink",
    category: "AI",
    type: "Crypto",
  },
  DOTUSDT: {
    name: "Polkadot",
    category: "Layer 1 / Layer 2",
    type: "Crypto",
  },
  MATICUSDT: {
    name: "Polygon",
    category: "Layer 1 / Layer 2",
    type: "Crypto",
  },
  LTCUSDT: {
    name: "Litecoin",
    category: "Layer 1 / Layer 2",
    type: "Crypto",
  },
  BCHUSDT: {
    name: "Bitcoin Cash",
    category: "Layer 1 / Layer 2",
    type: "Crypto",
  },
};

/*
|--------------------------------------------------------------------------
| Helpers
|--------------------------------------------------------------------------
*/

function getSymbolName(symbol) {
  if (!symbol) return "";

    return symbol.endsWith("USDT")
      ? symbol.slice(0, -4)
      : symbol;
  }

  function formatPrice(value) {
    const price = Number(value);

    if (!Number.isFinite(price)) return "--";

    if (price >= 1000) {
      return price.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
    }

    if (price >= 1) {
      return price.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 4,
      });
    }

    if (price >= 0.01) {
      return price.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 6,
      });
    }

    return price.toLocaleString("en-US", {
      minimumFractionDigits: 4,
      maximumFractionDigits: 8,
    });
  }

  function formatCompact(value) {
    const number = Number(value);

    if (!Number.isFinite(number)) return "--";

    return new Intl.NumberFormat("en-US", {
      notation: "compact",
      maximumFractionDigits: 2,
    }).format(number);
  }

  function formatPercent(value) {
    const number = Number(value);

    if (!Number.isFinite(number)) return "0.00";

    return number.toFixed(2);
  }

  /*
  |--------------------------------------------------------------------------
  | Main component
  |--------------------------------------------------------------------------
  */

  function Market() {
    const setSymbol = useChartStore((state) => state.setSymbol);

    /*
    |--------------------------------------------------------------------------
    | State
    |--------------------------------------------------------------------------
    */

    const [marketData, setMarketData] = useState({});
    const [search, setSearch] = useState("");
    const [activeMainTab, setActiveMainTab] = useState("Cryptos");
    const [activeCategory, setActiveCategory] = useState("All");

    const [sortConfig, setSortConfig] = useState({
      key: null,
      direction: "desc",
    });

    const [favorites, setFavorites] = useState(() => {
      try {
        return JSON.parse(localStorage.getItem("marketFavorites")) || [];
      } catch {
        return [];
      }
    });

    /*
    |--------------------------------------------------------------------------
    | Stable symbol order
    |--------------------------------------------------------------------------
    */

    const symbolOrderRef = useRef([]);

    /*
    |--------------------------------------------------------------------------
    | Binance WebSocket
    |--------------------------------------------------------------------------
    */

    useEffect(() => {
      const ws = new window.WebSocket(WS_URL);

      ws.onopen = () => {
        console.log("Binance market WebSocket connected");
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);

          if (!Array.isArray(data)) return;

          setMarketData((previous) => {
            const next = { ...previous };

            /*
            |--------------------------------------------------------------------------
            | IMPORTANT:
            | Establish order only once.
            | Future WebSocket messages NEVER change row order.
            |--------------------------------------------------------------------------
            */

            if (symbolOrderRef.current.length === 0) {
              const incomingSymbols = data
                .map((ticker) => ticker.s)
                .filter(Boolean);

              /*
              |--------------------------------------------------------------------------
              | Put our preferred symbols first.
              | Then append all remaining Binance symbols.
              |--------------------------------------------------------------------------
              */

              const preferred = DEFAULT_ORDER.filter((symbol) =>
                incomingSymbols.includes(symbol)
              );

              const remaining = incomingSymbols.filter(
                (symbol) => !preferred.includes(symbol)
              );

              symbolOrderRef.current = [
                ...preferred,
                ...remaining,
              ];
            }

            /*
            |--------------------------------------------------------------------------
            | Update each symbol individually
            |--------------------------------------------------------------------------
            */

            data.forEach((ticker) => {
              if (!ticker?.s) return;

              const currentPrice = Number(ticker.c);
              const openPrice = Number(ticker.o);
              const highPrice = Number(ticker.h);
              const lowPrice = Number(ticker.l);
              const volume = Number(ticker.v);
              const quoteVolume = Number(ticker.q);

              /*
              |--------------------------------------------------------------------------
              | Binance miniTicker does NOT give P.
              |
              | Therefore:
              |
              | ((current - open) / open) * 100
              |--------------------------------------------------------------------------
              */

              const percentChange =
                openPrice > 0
                  ? ((currentPrice - openPrice) / openPrice) * 100
                  : 0;

              next[ticker.s] = {
                symbol: ticker.s,
                price: Number.isFinite(currentPrice)
                  ? currentPrice
                  : 0,

                open: Number.isFinite(openPrice)
                  ? openPrice
                  : 0,

                change: Number.isFinite(percentChange)
                  ? percentChange
                  : 0,

                high: Number.isFinite(highPrice)
                  ? highPrice
                  : 0,

                low: Number.isFinite(lowPrice)
                  ? lowPrice
                  : 0,

                volume: Number.isFinite(volume)
                  ? volume
                  : 0,

                quoteVolume: Number.isFinite(quoteVolume)
                  ? quoteVolume
                  : 0,

                name:
                  COIN_METADATA[ticker.s]?.name ||
                  getSymbolName(ticker.s),

                category:
                  COIN_METADATA[ticker.s]?.category ||
                  "Crypto",

                type:
                  COIN_METADATA[ticker.s]?.type ||
                  "Crypto",
              };
            });

            return next;
          });
        } catch (error) {
          console.error(
            "Error processing Binance WebSocket data:",
            error
          );
        }
      };

      ws.onerror = (error) => {
        console.error(
          "Binance WebSocket Error:",
          error
        );
      };

      ws.onclose = () => {
        console.log(
          "Binance market WebSocket disconnected"
        );
      };

      return () => {
        ws.close();
      };
    }, []);

    /*
    |--------------------------------------------------------------------------
    | Save favorites
    |--------------------------------------------------------------------------
    */

    useEffect(() => {
      localStorage.setItem(
        "marketFavorites",
        JSON.stringify(favorites)
      );
    }, [favorites]);

    /*
    |--------------------------------------------------------------------------
    | Toggle favorite
    |--------------------------------------------------------------------------
    */

    const toggleFavorite = (symbol) => {
      setFavorites((previous) => {
        if (previous.includes(symbol)) {
          return previous.filter(
            (item) => item !== symbol
          );
        } 

        return [...previous, symbol];
      });
    };

    /*
    |--------------------------------------------------------------------------
    | Open chart
    |--------------------------------------------------------------------------
    */

    const openChart = (symbol) => {
      /*
      |--------------------------------------------------------------------------
      | Convert BTCUSDT → BTC/USDT if your chart store expects that.
      | If your store expects BTCUSDT, change this line to:
      |
      | setSymbol(symbol);
      |--------------------------------------------------------------------------
      */

      setSymbol(symbol);

      console.log("Chart for:", symbol);
    };

    /*
    |--------------------------------------------------------------------------
    | Convert object to array while preserving stable order
    |--------------------------------------------------------------------------
    */

    const orderedMarkets = useMemo(() => {
      return symbolOrderRef.current
        .map((symbol) => marketData[symbol])
        .filter(Boolean);
    }, [marketData]);

    /*
    |--------------------------------------------------------------------------
    | Filter + Sort
    |--------------------------------------------------------------------------
    */

    const filteredMarkets = useMemo(() => {
      let result = [...orderedMarkets];

      /*
      |--------------------------------------------------------------------------
      | Main tabs
      |--------------------------------------------------------------------------
      */

      if (activeMainTab === "Favorites") {
        result = result.filter((coin) =>
          favorites.includes(coin.symbol)
        );
      }

      if (
        activeMainTab === "Spot" ||
        activeMainTab === "Futures"
      ) {
        /*
        |--------------------------------------------------------------------------
        | Current Binance WebSocket is spot ticker data.
        | Keep all crypto data for now.
        |--------------------------------------------------------------------------
        */
        result = result.filter(
          (coin) => coin.type === "Crypto"
        );
      }

      /*
      |--------------------------------------------------------------------------
      | Category
      |--------------------------------------------------------------------------
      */

      if (activeCategory !== "All") {
        result = result.filter(
          (coin) => coin.category === activeCategory
        );
      }

      /*
      |--------------------------------------------------------------------------
      | Search
      |--------------------------------------------------------------------------
      */

      const searchValue = search.trim().toLowerCase();

      if (searchValue) {
        result = result.filter((coin) => {
          return (
            coin.symbol
              .toLowerCase()
              .includes(searchValue) ||
            coin.name
              .toLowerCase()
              .includes(searchValue)
          );
        });
      }

      /*
      |--------------------------------------------------------------------------
      | Sorting
      |--------------------------------------------------------------------------
      |
      | Sorting ONLY happens when the user clicks a column.
      | WebSocket updates never trigger random sorting.
      |--------------------------------------------------------------------------
      */

      if (sortConfig.key) {
        result.sort((a, b) => {
          let first;
          let second;

          if (sortConfig.key === "name") {
            first = a.name.toLowerCase();
            second = b.name.toLowerCase();
          } else {
            first = Number(a[sortConfig.key]) || 0;
            second = Number(b[sortConfig.key]) || 0;
          }

          if (first < second) {
            return sortConfig.direction === "asc"
              ? -1
              : 1;
          }

          if (first > second) {
            return sortConfig.direction === "asc"
              ? 1
              : -1;
          }

          return 0;
        });
      }

      return result;
    }, [
      orderedMarkets,
      activeMainTab,
      activeCategory,
      search,
      sortConfig,
      favorites,
    ]);

    /*
    |--------------------------------------------------------------------------
    | Sorting
    |--------------------------------------------------------------------------
    */

    const handleSort = (key) => {
      setSortConfig((previous) => {
        if (previous.key !== key) {
          return {
            key,
            direction: "desc",
          };
        }

        return {
          key,
          direction:
            previous.direction === "desc"
              ? "asc"
              : "desc",
        };
      });
    };

    /*
    |--------------------------------------------------------------------------
    | Market cards
    |--------------------------------------------------------------------------
    */

    const hotMarkets = useMemo(() => {
      return [...orderedMarkets]
        .filter((coin) => coin.quoteVolume > 0)
        .sort(
          (a, b) =>
            b.quoteVolume - a.quoteVolume
        )
        .slice(0, 3);
    }, [orderedMarkets]);

    const topGainers = useMemo(() => {
      return [...orderedMarkets]
        .sort(
          (a, b) =>
            b.change - a.change
        )
        .slice(0, 3);
    }, [orderedMarkets]);

    const topVolume = useMemo(() => {
      return [...orderedMarkets]
        .sort(
          (a, b) =>
            b.quoteVolume - a.quoteVolume
        )
        .slice(0, 3);
    }, [orderedMarkets]);

    /*
    |--------------------------------------------------------------------------
    | New
    |--------------------------------------------------------------------------
    |
    | WebSocket doesn't tell us listing date.
    | For now use the last symbols from the stable list.
    | Replace this with your listing API later.
    |--------------------------------------------------------------------------
    */

    const newMarkets = useMemo(() => {
      return orderedMarkets.slice(-3);
    }, [orderedMarkets]);

    /*
    |--------------------------------------------------------------------------
    | Render
    |--------------------------------------------------------------------------
    */

    return (
      <div className="min-h-screen bg-[#17191f] text-white">
        <div className="space-y-8 px-5 py-5">

          {/* ============================================================
              HEADER
          ============================================================ */}

          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-300">
                Market Board
              </p>

              <h1 className="mt-1 text-3xl font-semibold tracking-tight">
                Markets and Watchlist
              </h1>

              <p className="mt-2 text-sm text-slate-500">
                Live crypto prices, volume, 24h ranges,
                and market movements.
              </p>
            </div>

            {/* Search */}

            <div className="flex w-full items-center gap-3 lg:w-[360px]">
              <div className="flex h-12 flex-1 items-center gap-3 rounded-lg border border-[#303642] bg-[#101217] px-4">
                <Search
                  size={18}
                  className="text-slate-500"
                />

                <input
                  value={search}
                  onChange={(event) =>
                    setSearch(event.target.value)
                  }
                  placeholder="Search symbol"
                  className="min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-slate-600"
                />

                {search && (
                  <button
                    type="button"
                    onClick={() => setSearch("")}
                    className="text-slate-500 hover:text-white"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>

              <button
                type="button"
                className="flex h-12 w-12 items-center justify-center rounded-lg border border-[#303642] bg-[#101217] text-slate-300 hover:text-white"
              >
                <Bell size={18} />
              </button>
            </div>
          </div>

          {/* ============================================================
              MARKET CARDS
          ============================================================ */}

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">

            <MarketCard
              title="Hot"
              data={hotMarkets}
            />

            <MarketCard
              title="New"
              data={newMarkets}
            />

            <MarketCard
              title="Top Gainer"
              data={topGainers}
              showPositive
            />

            <MarketCard
              title="Top Volume"
              data={topVolume}
            />

          </div>

          {/* ============================================================
              MAIN TABS
          ============================================================ */}

          {/* <div className="flex items-center gap-7 overflow-x-auto border-b border-[#252a33]">

            {[
              "Favorites",
              "Cryptos",
              "Spot",
              "Futures",
              "TradFi",
              "Alpha",
              "New",
              "Zones",
            ].map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() =>
                  setActiveMainTab(tab)
                }
                className={`relative whitespace-nowrap pb-3 text-[16px] transition ${
                  activeMainTab === tab
                    ? "font-semibold text-white"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                {tab}

                {tab === "New" && (
                  <span className="absolute -right-5 -top-2 rounded bg-yellow-400 px-1.5 text-[9px] font-bold text-black">
                    New
                  </span>
                )}

                {activeMainTab === tab && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-yellow-400" />
                )}
              </button>
            ))}

            <div className="ml-auto hidden items-center gap-5 md:flex">
              <Search
                size={22}
                className="text-slate-300"
              />

              <Bell
                size={22}
                className="text-slate-300"
              />
            </div>
          </div> */}

          {/* ============================================================
              CATEGORY TABS
          ============================================================ */}
{/* 
          <div className="flex items-center gap-7 overflow-x-auto">

            {[
              "All",
              "bStocks",
              "Commodities",
              "BSC",
              "Solana",
              "RWA",
              "MEME",
              "Payments",
              "AI",
              "Layer 1 / Layer 2",
              "Seed",
              "Launchpool",
              "Megadrop",
              "Gaming",
              "DeFi",
            ].map((category) => (
              <button
                key={category}
                type="button"
                onClick={() =>
                  setActiveCategory(
                    category === "bStocks"
                      ? "bStocks"
                      : category
                  )
                }
                className={`whitespace-nowrap rounded-md px-2 py-2 text-sm transition ${
                  activeCategory === category
                    ? "bg-[#2b3442] text-white"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                {category}

                {category === "bStocks" && (
                  <span className="ml-1 rounded bg-yellow-500/20 px-1 text-[10px] text-yellow-300">
                    New
                  </span>
                )}
              </button>
            ))}

          </div> */}

          {/* ============================================================
              TABLE HEADER / DESCRIPTION
          ============================================================ */}

          {/* <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">

            <div>
              <h2 className="text-xl font-semibold">
                Top Tokens by Market Capitalization
              </h2>

              <p className="mt-2 max-w-5xl text-sm leading-6 text-slate-500">
                Get a comprehensive snapshot of
                cryptocurrencies available on the market.
                Live prices and 24-hour market statistics
                are updated through Binance WebSocket.
              </p>
            </div>

            <button
              type="button"
              className="flex items-center gap-1 text-sm font-medium text-white hover:text-cyan-300"
            >
              More
              <ChevronDown size={15} />
            </button>

          </div> */}

          {/* ============================================================
              TABLE
          ============================================================ */}

          <div className="overflow-hidden">

            {/* Table header */}

            <div className="grid min-w-[1050px] grid-cols-[2.3fr_1.2fr_1.2fr_1.4fr_1.4fr_100px] items-center border-b border-[#252a33] px-0 py-4 text-xs text-slate-500">

              <SortHeader
                label="Name"
                active={
                  sortConfig.key === "name"
                }
                direction={
                  sortConfig.direction
                }
                onClick={() =>
                  handleSort("name")
                }
              />

              <SortHeader
                label="Price"
                active={
                  sortConfig.key === "price"
                }
                direction={
                  sortConfig.direction
                }
                onClick={() =>
                  handleSort("price")
                }
              />

              <SortHeader
                label="24h Change"
                active={
                  sortConfig.key === "change"
                }
                direction={
                  sortConfig.direction
                }
                onClick={() =>
                  handleSort("change")
                }
              />

              <SortHeader
                label="24h Volume"
                active={
                  sortConfig.key === "quoteVolume"
                }
                direction={
                  sortConfig.direction
                }
                onClick={() =>
                  handleSort("quoteVolume")
                }
              />

              <div>
                Market Cap
              </div>

              <div className="text-right">
                Actions
              </div>

            </div>

            {/* ============================================================
                TABLE ROWS
            ============================================================ */}

            <div>

              {filteredMarkets.length === 0 && (
                <div className="py-16 text-center text-sm text-slate-500">
                  No market found.
                </div>
              )}

              {filteredMarkets.map((row) => {

                const symbol =
                  getSymbolName(row.symbol);

                const isFavorite =
                  favorites.includes(
                    row.symbol
                  );

                return (
                  <div
                    key={row.symbol}
                    className="grid min-w-[1050px] grid-cols-[2.3fr_1.2fr_1.2fr_1.4fr_1.4fr_100px] items-center border-b border-[#20242c] py-5 transition hover:bg-[#1b1e25]"
                  >

                    {/* Name */}

                    <div className="flex items-center gap-4">

                      <button
                        type="button"
                        onClick={() =>
                          toggleFavorite(
                            row.symbol
                          )
                        }
                        className="text-slate-500 hover:text-yellow-300"
                      >
                        <Star
                          size={18}
                          fill={
                            isFavorite
                              ? "currentColor"
                              : "none"
                          }
                          className={
                            isFavorite
                              ? "text-yellow-300"
                              : ""
                          }
                        />
                      </button>

                      <CoinIcon
                        symbol={symbol}
                      />

                      <div>
                        <div className="flex items-center gap-2">

                          <span className="font-semibold text-white">
                            {symbol}
                          </span>

                          <span className="text-sm text-slate-500">
                            {row.name}
                          </span>

                        </div>

                        <span className="text-xs text-slate-600">
                          {row.symbol}
                        </span>
                      </div>

                    </div>

                    {/* Price */}

                    <div>
                      <div className="font-medium text-white">
                        {formatPrice(
                          row.price
                        )}
                      </div>

                      <div className="mt-1 text-xs text-slate-600">
                        ${formatPrice(row.price)}
                      </div>
                    </div>

                    {/* Change */}

                    <div
                      className={`font-medium ${
                        row.change >= 0
                          ? "text-emerald-400"
                          : "text-red-400"
                      }`}
                    >
                      {row.change >= 0
                        ? "+"
                        : ""}
                      {formatPercent(
                        row.change
                      )}
                      %
                    </div>

                    {/* Volume */}

                    <div className="font-medium text-white">
                      $
                      {formatCompact(
                        row.quoteVolume
                      )}
                    </div>

                    {/* Market Cap */}

                    <div className="text-slate-300">
                      --
                    </div>

                    {/* Actions */}

                    <div className="flex justify-end gap-3">

                      <button
                        type="button"
                        onClick={() =>
                          openChart(
                            row.symbol
                          )
                        }
                        title="Open chart"
                        className="rounded-md p-2 text-slate-300 hover:bg-[#252b35] hover:text-white"
                      >
                        <BarChart3 size={18} />
                      </button>

                    </div>

                  </div>
                );
              })}

            </div>

          </div>

        </div>
      </div>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Market Card
  |--------------------------------------------------------------------------
  */

  function MarketCard({
    title,
    data,
  }) {
    return (
      <div className="rounded-2xl border border-[#30353f] bg-[#17191f] p-5">

        <div className="mb-5 flex items-center justify-between">

          <h3 className="text-sm font-semibold text-white">
            {title}
          </h3>

          <button
            type="button"
            className="text-sm text-white hover:text-cyan-300"
          >
            More
            <span className="ml-1">
              ›
            </span>
          </button>

        </div>

        <div className="space-y-5">

          {data.length === 0 ? (
            <div className="text-sm text-slate-600">
              Loading...
            </div>
          ) : (
            data.map((coin) => {

              const symbol =
                getSymbolName(
                  coin.symbol
                );

              return (
                <div
                  key={coin.symbol}
                  className="grid grid-cols-[1fr_auto_auto] items-center gap-4"
                >

                  <div className="flex items-center gap-3">

                    <CoinIcon
                      symbol={symbol}
                      small
                    />

                    <span className="font-medium text-white">
                      {symbol}
                    </span>

                  </div>

                  <span className="text-sm text-slate-200">
                    $
                    {formatPrice(
                      coin.price
                    )}
                  </span>

                  <span
                    className={`text-sm font-medium ${
                      coin.change >= 0
                        ? "text-emerald-400"
                        : "text-red-400"
                    }`}
                  >
                    {coin.change >= 0
                      ? "+"
                      : ""}
                    {formatPercent(
                      coin.change
                    )}
                    %
                  </span>

                </div>
              );
            })
          )}

        </div>

      </div>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Sort Header
  |--------------------------------------------------------------------------
  */

  function SortHeader({
    label,
    active,
    direction,
    onClick,
  }) {
    return (
      <button
        type="button"
        onClick={onClick}
        className="flex items-center gap-1 text-left text-xs text-slate-500 hover:text-white"
      >
        {label}

        <ArrowUpDown
          size={13}
          className={
            active
              ? "text-yellow-400"
              : "text-slate-600"
          }
        />

        {active && (
          <span className="text-[9px] text-yellow-400">
            {direction === "asc"
              ? "▲"
              : "▼"}
          </span>
        )}
      </button>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Coin Icon
  |--------------------------------------------------------------------------
  */

  function CoinIcon({
    symbol,
    small = false,
  }) {
    const firstLetter =
      symbol?.charAt(0) || "?";

    return (
      <div
        className={`flex shrink-0 items-center justify-center rounded-full bg-[#29303b] font-bold text-white ${
          small
            ? "h-7 w-7 text-xs"
            : "h-9 w-9 text-sm"
        }`}
      >
        {firstLetter}
      </div>
    );
  }

  export default Market;
// // import { BarChart3, Search, Star } from "lucide-react";
// // import useChartStore from "../store/chartStore";
// // import { useEffect, useState, useRef, useMemo } from "react";
// // import { List } from "react-window";


// // function Market() {
// //   const setSymbol = useChartStore((state) => state.setSymbol);
// //   const [liveData, setLiveData] = useState([]);
  
// //   // Use a ref to store the latest data to avoid stale closures in WebSocket
// //   const dataRef = useRef([]);

// //   useEffect(() => {
// //     const ws = new window.WebSocket('wss://stream.binance.com:9443/ws/!miniTicker@arr');

// //     ws.onmessage = (event) => {
// //       const data = JSON.parse(event.data);

// //       // Process data: Map Binance keys to UI keys
// //       const formattedData = data.map(ticker => ({
// //         s: ticker.s, // Symbol
// //         c: parseFloat(ticker.c).toFixed(2), // Current Price
// //         p: parseFloat(ticker.P).toFixed(2), // Percent Change
// //         positive: parseFloat(ticker.P) >= 0, // Boolean for color
// //         h: parseFloat(ticker.h).toFixed(2), // High
// //         l: parseFloat(ticker.l).toFixed(2), // Low
// //         v: parseFloat(ticker.v).toFixed(0)  // Volume
// //       }));

// //       // Update ref and state
// //       dataRef.current = formattedData;
// //       setLiveData(formattedData);
// //     };

// //     ws.onerror = (error) => {
// //       console.error('WebSocket Error:', error);
// //     };

// //     return () => ws.close();
// //   }, []);

// //   // Memoize the Row component to prevent re-creation on every render
// //   const Row = useMemo(() => {
// //     return ({ index, style }) => {
// //       const row = liveData[index];
// //       if (!row) return null;

// //       return (
// //         <div 
// //           style={style} 
// //           className="grid grid-cols-[44px_1.1fr_1fr_1fr_1fr_1fr_92px] items-center border-b border-[#141c28] px-4 py-3 text-sm hover:bg-[#101722] absolute w-full"
// //         >
// //           <Star size={16} className="text-yellow-300" />
// //           <div>
// //             <p className="font-semibold text-white">{row.s}</p>
// //             <p className="text-xs text-slate-600">Perpetual / Spot</p>
// //           </div>

// //           <span className="num text-right text-slate-100">{row.c}</span>

// //           <span className={`num text-right ${row.positive ? "text-emerald-300" : "text-red-300"}`}>
// //             {row.positive ? '+' : ''}{row.p}%
// //           </span>

// //           <span className="num text-right text-slate-300">{row.h}</span>
// //           <span className="text-right">
// //             <span className="num block text-slate-300">{row.l}</span>
// //             <span className="num text-xs text-slate-600">{row.v}</span>
// //           </span>

// //           <button
// //             type="button"
// //             onClick={() => setSymbol(row.s)}
// //             className="ml-auto flex h-8 items-center gap-1 rounded-md border border-[#263142] px-2 text-xs text-slate-300 hover:border-cyan-400/50 hover:text-cyan-200"
// //           >
// //             <BarChart3 size={14} />
// //             Chart
// //           </button>
// //         </div>
// //       );
// //     };
// //   }, [liveData, setSymbol]);

// //   return (
// //     <div className="space-y-4">
// //       <div className="flex flex-col justify-between gap-3 md:flex-row md:items-end">
// //         <div>
// //           <p className="text-xs uppercase tracking-[0.24em] text-cyan-300">Market board</p>
// //           <h1 className="mt-1 text-2xl font-semibold text-white">Markets and Watchlist</h1>
// //           <p className="mt-1 text-sm text-slate-500">Scan prices, volume, 24h ranges, and jump straight into charting.</p>
// //         </div>
// //         <label className="flex w-full items-center gap-2 terminal-input px-3 md:w-[320px]">
// //           <Search size={16} className="text-slate-500" />
// //           <input placeholder="Search symbol" className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-slate-600" />
// //         </label>
// //       </div>
      
// //       <div className="terminal-panel overflow-hidden rounded-lg">
// //         {/* Header */}
// //         <div className="grid min-w-[760px] grid-cols-[44px_1.1fr_1fr_1fr_1fr_1fr_92px] border-b border-[#202938] px-4 py-3 text-xs uppercase tracking-wide text-slate-600">
// //           <span />
// //           <span>Symbol</span>
// //           <span className="text-right">Price</span>
// //           <span className="text-right">24h %</span>
// //           <span className="text-right">High</span>
// //           <span className="text-right">Low / Volume</span>
// //           <span className="text-right">Action</span>
// //         </div>

// //         {/* Virtualized List Container */}
// //         <div className="w-full relative" style={{ height: '600px' }}>
// //           <List
// //             rowHeight={600}
// //             rowComponent={liveData}
// //             rowCount={liveData.length}
// //             rowSize={64} // Adjust this value to match the exact height of your row (py-3 + font size + borders)
// //             // width="100%"
// //             // itemData={liveData}
// //           >
// //             {Row}
// //           </List>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }

// // export default Market;   
// import { BarChart3, Search, Server, Star } from "lucide-react";
// import useChartStore from "../store/chartStore";
// import { marketRows } from "../utils/marketData";
// import { WebSocket } from "ws";
// import { useEffect, useState } from "react";

// // const url = "wss://stream.binance.com:9443/ws/!miniTicker@arr"
// // const ws = new WebSocket('wss://stream.binance.com:9443/ws/!miniTicker@arr')

// function Market() {
//   const setSymbol = useChartStore((state) => state.setSymbol);

//   const [livedata, setlivedata] = useState([])

//   // useEffect(() => {
//   //   // Use window.WebSocket explicitly if you suspect shadowing
//   //   const ws = new window.WebSocket('wss://stream.binance.com:9443/ws/!miniTicker@arr');

//   //   ws.onmessage = (event) => {
//   //     const data = JSON.parse(event.data);

//   //     // 3. Process data: Map Binance keys to your UI keys (price, change, etc.)
//   //     const formattedData = data.map(ticker => ({
//   //       s: ticker.s, // Symbol
//   //       c: parseFloat(ticker.c).toFixed(2), // Current Price
//   //       p: parseFloat(ticker.P).toFixed(2), // Percent Change
//   //       positive: parseFloat(ticker.P) >= 0, // Boolean for color
//   //       h: parseFloat(ticker.h).toFixed(2), // High
//   //       l: parseFloat(ticker.l).toFixed(2), // Low
//   //       v: parseFloat(ticker.v).toFixed(0)  // Volume
//   //     }));

//   //     // 4. Update state (this triggers the re-render)
//   //     setlivedata(formattedData);
//   //   };

//   //   ws.onerror = (error) => {
//   //     console.error('WebSocket Error:', error);
//   //   };

//   //   return () => ws.close(); // Clean up connection on unmount
//   // }, []);
//   useEffect(() => {
//     const ws = new window.WebSocket(
//       "wss://stream.binance.com:9443/ws/!miniTicker@arr"
//     );

//     ws.onmessage = (event) => {
//       const data = JSON.parse(event.data);

//       setlivedata((prev) => {
//         // First message: establish the initial order
//         if (prev.length === 0) {
//           return data.map((ticker) => ({
//             s: ticker.s,
//             c: parseFloat(ticker.c).toFixed(2),
//             p: parseFloat(ticker.P).toFixed(2),
//             positive: parseFloat(ticker.P) >= 0,
//             h: parseFloat(ticker.h).toFixed(2),
//             l: parseFloat(ticker.l).toFixed(2),
//             v: parseFloat(ticker.v).toFixed(0),
//           }));
//         }

//         // Keep existing order and update only matching symbols
//         const updates = new Map(
//           data.map((ticker) => [
//             ticker.s,
//             {
//               c: parseFloat(ticker.c).toFixed(2),
//               p: parseFloat(ticker.P).toFixed(2),
//               positive: parseFloat(ticker.P) >= 0,
//               h: parseFloat(ticker.h).toFixed(2),
//               l: parseFloat(ticker.l).toFixed(2),
//               v: parseFloat(ticker.v).toFixed(0),
//             },
//           ])
//         );

//         return prev.map((row) => {
//           const update = updates.get(row.s);

//           if (!update) {
//             return row;
//           }

//           return {
//             ...row,
//             ...update,
//           };
//         });
//       });
//     };

//     ws.onerror = (error) => {
//       console.error("WebSocket Error:", error);
//     };

//     return () => ws.close();
//   }, []);


//   return (
//     <div className="space-y-4">
//       <div className="flex flex-col justify-between gap-3 md:flex-row md:items-end">
//         <div>
//           <p className="text-xs uppercase tracking-[0.24em] text-cyan-300">Market board</p>
//           <h1 className="mt-1 text-2xl font-semibold text-white">Markets and Watchlist</h1>
//           <p className="mt-1 text-sm text-slate-500">Scan prices, volume, 24h ranges, and jump straight into charting.</p>
//         </div>
//         <label className="flex w-full items-center gap-2 terminal-input px-3 md:w-[320px]">
//           <Search size={16} className="text-slate-500" />
//           <input placeholder="Search symbol" className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-slate-600" />
//         </label>
//       </div>
//       <div className="terminal-panel overflow-hidden rounded-lg">
//         <div className="grid min-w-[760px] grid-cols-[44px_1.1fr_1fr_1fr_1fr_1fr_92px] border-b border-[#202938] px-4 py-3 text-xs uppercase tracking-wide text-slate-600">
//           <span />
//           <span>Symbol</span>
//           <span className="text-right">Price</span>
//           <span className="text-right">24h %</span>
//           <span className="text-right">High</span>
//           <span className="text-right">Low / Volume</span>
//           <span className="text-right">Action</span>
//         </div>
//         <div className="w-full">
//           {/* 5. Use the state variable 'liveData' here */}
//           {livedata.map((row) => (
//             <div key={row.s} className="grid min-w-[760px] grid-cols-[44px_1.1fr_1fr_1fr_1fr_1fr_92px] items-center border-b border-[#141c28] px-4 py-3 text-sm hover:bg-[#101722]">
//               <Star size={16} className="text-yellow-300" />
//               <div>
//                 <p className="font-semibold text-white">{row.s}</p>
//                 <p className="text-xs text-slate-600">Perpetual / Spot</p>
//               </div>

//               {/* Use row.c for price */}
//               <span className="num text-right text-slate-100">{row.c}</span>

//               {/* Use row.p for change and row.positive for color */}
//               <span className={`num text-right ${row.positive ? "text-emerald-300" : "text-red-300"}`}>
//                 {row.positive ? '+' : ''}{row.p}%
//               </span>

//               <span className="num text-right text-slate-300">{row.h}</span>
//               <span className="text-right">
//                 <span className="num block text-slate-300">{row.l}</span>
//                 <span className="num text-xs text-slate-600">{row.v}</span>
//               </span>

//               <button
//                 type="button"
//                 onClick={() => console.log("Chart for", row.s)}
//                 className="ml-auto flex h-8 items-center gap-1 rounded-md border border-[#263142] px-2 text-xs text-slate-300 hover:border-cyan-400/50 hover:text-cyan-200"
//               >
//                 <BarChart3 size={14} />
//                 Chart
//               </button>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>

//       );
// }

//       export default Market;
