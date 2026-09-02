import {
  BarChart3,
  Bell,
  Search,
  Star,
  ArrowUpDown,
  X,
  TrendingUp,
  TrendingDown,
  Flame,
  Sparkles,
  Zap,
} from "lucide-react";

import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import useChartStore from "../store/chartStore";

const WS_URL = "wss://stream.binance.com:9443/ws/!miniTicker@arr";

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

const COIN_METADATA = {
  BTCUSDT: { name: "Bitcoin", category: "Layer 1 / Layer 2", type: "Crypto" },
  ETHUSDT: { name: "Ethereum", category: "Layer 1 / Layer 2", type: "Crypto" },
  USDTUSDT: { name: "Tether", category: "Payments", type: "Crypto" },
  BNBUSDT: { name: "BNB", category: "BSC", type: "Crypto" },
  SOLUSDT: { name: "Solana", category: "Solana", type: "Crypto" },
  XRPUSDT: { name: "XRP", category: "Payments", type: "Crypto" },
  DOGEUSDT: { name: "Dogecoin", category: "MEME", type: "Crypto" },
  ADAUSDT: { name: "Cardano", category: "Layer 1 / Layer 2", type: "Crypto" },
  TRXUSDT: { name: "TRON", category: "Layer 1 / Layer 2", type: "Crypto" },
  AVAXUSDT: { name: "Avalanche", category: "Layer 1 / Layer 2", type: "Crypto" },
  LINKUSDT: { name: "Chainlink", category: "AI", type: "Crypto" },
  DOTUSDT: { name: "Polkadot", category: "Layer 1 / Layer 2", type: "Crypto" },
  MATICUSDT: { name: "Polygon", category: "Layer 1 / Layer 2", type: "Crypto" },
  LTCUSDT: { name: "Litecoin", category: "Layer 1 / Layer 2", type: "Crypto" },
  BCHUSDT: { name: "Bitcoin Cash", category: "Layer 1 / Layer 2", type: "Crypto" },
};

function getSymbolName(symbol) {
  if (!symbol) return "";
  return symbol.endsWith("USDT") ? symbol.slice(0, -4) : symbol;
}

function formatPrice(value) {
  const price = Number(value);
  if (!Number.isFinite(price)) return "--";
  if (price >= 1000) {
    return price.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }
  if (price >= 1) {
    return price.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 4 });
  }
  if (price >= 0.01) {
    return price.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 6 });
  }
  return price.toLocaleString("en-US", { minimumFractionDigits: 4, maximumFractionDigits: 8 });
}

function formatCompact(value) {
  const number = Number(value);
  if (!Number.isFinite(number)) return "--";
  return new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 2 }).format(number);
}

function formatPercent(value) {
  const number = Number(value);
  if (!Number.isFinite(number)) return "0.00";
  return number.toFixed(2);
}

function Market() {
  const setSymbol = useChartStore((state) => state.setSymbol);
  const navigate = useNavigate();

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

  const symbolOrderRef = useRef([]);

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

          if (symbolOrderRef.current.length === 0) {
            const incomingSymbols = data.map((ticker) => ticker.s).filter(Boolean);
            const preferred = DEFAULT_ORDER.filter((symbol) => incomingSymbols.includes(symbol));
            const remaining = incomingSymbols.filter((symbol) => !preferred.includes(symbol));
            symbolOrderRef.current = [...preferred, ...remaining];
          }

          data.forEach((ticker) => {
            if (!ticker?.s) return;
            const currentPrice = Number(ticker.c);
            const openPrice = Number(ticker.o);
            const highPrice = Number(ticker.h);
            const lowPrice = Number(ticker.l);
            const volume = Number(ticker.v);
            const quoteVolume = Number(ticker.q);

            const percentChange = openPrice > 0 ? ((currentPrice - openPrice) / openPrice) * 100 : 0;

            next[ticker.s] = {
              symbol: ticker.s,
              price: Number.isFinite(currentPrice) ? currentPrice : 0,
              open: Number.isFinite(openPrice) ? openPrice : 0,
              change: Number.isFinite(percentChange) ? percentChange : 0,
              high: Number.isFinite(highPrice) ? highPrice : 0,
              low: Number.isFinite(lowPrice) ? lowPrice : 0,
              volume: Number.isFinite(volume) ? volume : 0,
              quoteVolume: Number.isFinite(quoteVolume) ? quoteVolume : 0,
              name: COIN_METADATA[ticker.s]?.name || getSymbolName(ticker.s),
              category: COIN_METADATA[ticker.s]?.category || "Crypto",
              type: COIN_METADATA[ticker.s]?.type || "Crypto",
            };
          });

          return next;
        });
      } catch (error) {
        console.error("Error processing Binance WebSocket data:", error);
      }
    };

    ws.onerror = (error) => {
      console.error("Binance WebSocket Error:", error);
    };

    ws.onclose = () => {
      console.log("Binance market WebSocket disconnected");
    };

    return () => {
      ws.close();
    };
  }, []);

  useEffect(() => {
    localStorage.setItem("marketFavorites", JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (symbol) => {
    setFavorites((previous) => {
      if (previous.includes(symbol)) {
        return previous.filter((item) => item !== symbol);
      }
      return [...previous, symbol];
    });
  };

  const openChart = (symbol) => {
    setSymbol(symbol);
    navigate("/dashboard");
  };

  const orderedMarkets = useMemo(() => {
    const list = [];
    const used = new Set();

    symbolOrderRef.current.forEach((symbol) => {
      if (marketData[symbol]) {
        list.push(marketData[symbol]);
        used.add(symbol);
      }
    });

    Object.keys(marketData).forEach((symbol) => {
      if (!used.has(symbol)) {
        list.push(marketData[symbol]);
      }
    });

    return list;
  }, [marketData]);

  const filteredMarkets = useMemo(() => {
    let result = [...orderedMarkets];

    if (activeMainTab === "Favorites") {
      result = result.filter((coin) => favorites.includes(coin.symbol));
    }

    if (activeCategory !== "All") {
      result = result.filter((coin) => coin.category === activeCategory);
    }

    const searchValue = search.trim().toLowerCase();
    if (searchValue) {
      result = result.filter(
        (coin) =>
          coin.symbol.toLowerCase().includes(searchValue) ||
          coin.name.toLowerCase().includes(searchValue)
      );
    }

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

        if (first < second) return sortConfig.direction === "asc" ? -1 : 1;
        if (first > second) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [orderedMarkets, activeMainTab, activeCategory, search, sortConfig, favorites]);

  const handleSort = (key) => {
    setSortConfig((previous) => {
      if (previous.key !== key) {
        return { key, direction: "desc" };
      }
      return { key, direction: previous.direction === "desc" ? "asc" : "desc" };
    });
  };

  const hotMarkets = useMemo(() => {
    return [...orderedMarkets]
      .filter((coin) => coin.quoteVolume > 0)
      .sort((a, b) => b.quoteVolume - a.quoteVolume)
      .slice(0, 3);
  }, [orderedMarkets]);

  const topGainers = useMemo(() => {
    return [...orderedMarkets].sort((a, b) => b.change - a.change).slice(0, 3);
  }, [orderedMarkets]);

  const topVolume = useMemo(() => {
    return [...orderedMarkets].sort((a, b) => b.quoteVolume - a.quoteVolume).slice(0, 3);
  }, [orderedMarkets]);

  const newMarkets = useMemo(() => {
    return orderedMarkets.slice(-3);
  }, [orderedMarkets]);

  const categories = [
    "All",
    "Layer 1 / Layer 2",
    "Solana",
    "BSC",
    "MEME",
    "AI",
    "Payments",
  ];

  return (
    <div className="space-y-5">
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-cyan-400" />
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-cyan-300">
              Institutional Market Board
            </p>
          </div>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-white lg:text-3xl">
            Live Markets & Intelligence
          </h1>
          <p className="mt-1 text-xs text-slate-400">
            Real-time Binance WebSocket price feeds, volume metrics, and market structure.
          </p>
        </div>

        <div className="flex w-full items-center gap-2.5 lg:w-[360px]">
          <div className="relative flex h-10 flex-1 items-center rounded-xl border border-white/[0.08] bg-[#0c121e] px-3 shadow-inner transition focus-within:border-cyan-400/50">
            <Search size={15} className="text-slate-500" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search coin name or symbol..."
              className="min-w-0 flex-1 bg-transparent px-2 text-xs text-white outline-none placeholder:text-slate-600"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="text-slate-500 hover:text-white"
              >
                <X size={14} />
              </button>
            )}
          </div>

          <button
            type="button"
            title="Notifications"
            className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-white/[0.08] bg-[#0c121e] text-slate-400 shadow-sm hover:text-white"
          >
            <Bell size={16} />
          </button>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <MarketCard
          title="Most Active"
          icon={<Flame size={15} className="text-amber-400" />}
          data={hotMarkets}
          badge="High Liquidity"
          badgeColor="text-amber-300 bg-amber-400/10 border-amber-400/20"
        />

        <MarketCard
          title="Recent Additions"
          icon={<Sparkles size={15} className="text-cyan-400" />}
          data={newMarkets}
          badge="Newly Tracked"
          badgeColor="text-cyan-300 bg-cyan-400/10 border-cyan-400/20"
        />

        <MarketCard
          title="Top 24h Gainers"
          icon={<TrendingUp size={15} className="text-emerald-400" />}
          data={topGainers}
          badge="Strong Momentum"
          badgeColor="text-emerald-300 bg-emerald-400/10 border-emerald-400/20"
        />

        <MarketCard
          title="Volume Leaders"
          icon={<Zap size={15} className="text-blue-400" />}
          data={topVolume}
          badge="Highest Turn"
          badgeColor="text-blue-300 bg-blue-400/10 border-blue-400/20"
        />
      </div>

      <div className="rounded-2xl border border-white/[0.08] bg-[#080d16]/90 p-4 shadow-[0_8px_30px_rgb(0,0,0,0.4)] backdrop-blur-md">
        <div className="mb-4 flex flex-col gap-3 border-b border-white/[0.06] pb-3 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-2">
            {["Cryptos", "Favorites"].map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveMainTab(tab)}
                className={`flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-bold transition-all ${
                  activeMainTab === tab
                    ? "bg-cyan-500/15 text-cyan-300 shadow-sm ring-1 ring-cyan-400/30"
                    : "text-slate-400 hover:bg-white/[0.04] hover:text-white"
                }`}
              >
                {tab === "Favorites" && <Star size={13} className={favorites.length ? "fill-amber-400 text-amber-400" : ""} />}
                <span>{tab}</span>
                {tab === "Favorites" && (
                  <span className="rounded bg-black/40 px-1.5 py-0.2 text-[10px] text-slate-400">
                    {favorites.length}
                  </span>
                )}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setActiveCategory(category)}
                className={`whitespace-nowrap rounded-md px-2.5 py-1 text-[11px] font-semibold transition ${
                  activeCategory === category
                    ? "bg-white/[0.12] text-white shadow-sm"
                    : "text-slate-500 hover:bg-white/[0.04] hover:text-slate-300"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <div className="min-w-[960px]">
            <div className="grid grid-cols-[2.5fr_1.3fr_1.2fr_1.3fr_1.5fr_110px] items-center border-b border-white/[0.08] px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-slate-500">
              <SortHeader
                label="Asset Name"
                active={sortConfig.key === "name"}
                direction={sortConfig.direction}
                onClick={() => handleSort("name")}
              />

              <SortHeader
                label="Live Price"
                active={sortConfig.key === "price"}
                direction={sortConfig.direction}
                onClick={() => handleSort("price")}
              />

              <SortHeader
                label="24h Change"
                active={sortConfig.key === "change"}
                direction={sortConfig.direction}
                onClick={() => handleSort("change")}
              />

              <SortHeader
                label="24h Volume"
                active={sortConfig.key === "quoteVolume"}
                direction={sortConfig.direction}
                onClick={() => handleSort("quoteVolume")}
              />

              <div>24h Price Range (Low / High)</div>

              <div className="text-right">Action</div>
            </div>

            <div className="divide-y divide-white/[0.03]">
              {filteredMarkets.length === 0 && (
                <div className="py-16 text-center text-xs text-slate-500">
                  No markets found matching criteria.
                </div>
              )}

              {filteredMarkets.map((row) => {
                const symbol = getSymbolName(row.symbol);
                const isFavorite = favorites.includes(row.symbol);
                const isPositive = row.change >= 0;

                const rangePct =
                  row.high > row.low && row.price >= row.low
                    ? Math.min(100, Math.max(0, ((row.price - row.low) / (row.high - row.low)) * 100))
                    : 50;

                return (
                  <div
                    key={row.symbol}
                    className="grid grid-cols-[2.5fr_1.3fr_1.2fr_1.3fr_1.5fr_110px] items-center px-3 py-3 text-xs transition-colors hover:bg-white/[0.03]"
                  >
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => toggleFavorite(row.symbol)}
                        className="text-slate-600 transition hover:scale-110 hover:text-amber-400"
                      >
                        <Star
                          size={15}
                          fill={isFavorite ? "#fbbf24" : "none"}
                          className={isFavorite ? "text-amber-400" : ""}
                        />
                      </button>

                      <CoinIcon symbol={symbol} />

                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-white tracking-tight">{symbol}</span>
                          <span className="truncate text-[11px] text-slate-400">{row.name}</span>
                        </div>
                        <span className="rounded bg-white/[0.04] px-1 py-0.2 text-[9px] font-semibold text-slate-500">
                          {row.category}
                        </span>
                      </div>
                    </div>

                    <div>
                      <div className="num font-bold text-white">${formatPrice(row.price)}</div>
                      <div className="num text-[10px] text-slate-500">Open: ${formatPrice(row.open)}</div>
                    </div>

                    <div>
                      <span
                        className={`num inline-flex items-center gap-0.5 rounded px-2 py-0.5 text-xs font-bold ${
                          isPositive
                            ? "bg-emerald-500/10 text-emerald-400"
                            : "bg-rose-500/10 text-rose-400"
                        }`}
                      >
                        {isPositive ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
                        {isPositive ? "+" : ""}
                        {formatPercent(row.change)}%
                      </span>
                    </div>

                    <div>
                      <div className="num font-semibold text-slate-200">${formatCompact(row.quoteVolume)}</div>
                      <div className="num text-[10px] text-slate-500">{formatCompact(row.volume)} {symbol}</div>
                    </div>

                    <div className="pr-4">
                      <div className="flex justify-between text-[10px] text-slate-500 num mb-1">
                        <span>L: ${formatPrice(row.low)}</span>
                        <span>H: ${formatPrice(row.high)}</span>
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-black/50 overflow-hidden border border-white/[0.06]">
                        <div
                          className={`h-full rounded-full ${isPositive ? "bg-gradient-to-r from-emerald-500 to-cyan-400" : "bg-gradient-to-r from-rose-500 to-amber-500"}`}
                          style={{ width: `${rangePct}%` }}
                        />
                      </div>
                    </div>

                    <div className="flex justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => openChart(row.symbol)}
                        title="Trade & Open Chart"
                        className="btn-3d-primary flex h-7 items-center gap-1 rounded-md px-2.5 text-[11px] font-bold text-slate-950 shadow-sm"
                      >
                        <BarChart3 size={13} />
                        <span>Trade</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MarketCard({ title, icon, data, badge, badgeColor }) {
  const setSymbol = useChartStore((state) => state.setSymbol);
  const navigate = useNavigate();

  return (
    <div className="rounded-2xl border border-white/[0.08] bg-gradient-to-br from-[#0c121e]/95 to-[#080d16]/95 p-4 shadow-[0_8px_20px_rgba(0,0,0,0.3)] backdrop-blur-md transition-transform duration-200 hover:-translate-y-0.5">
      <div className="mb-3.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {icon}
          <h3 className="text-xs font-bold uppercase tracking-wider text-white">{title}</h3>
        </div>
        <span className={`rounded-md border px-1.5 py-0.5 text-[9px] font-bold ${badgeColor}`}>
          {badge}
        </span>
      </div>

      <div className="space-y-2.5">
        {data.length === 0 ? (
          <div className="text-xs text-slate-600">Syncing live stream...</div>
        ) : (
          data.map((coin) => {
            const symbol = getSymbolName(coin.symbol);
            const isPositive = coin.change >= 0;

            return (
              <button
                key={coin.symbol}
                type="button"
                onClick={() => {
                  setSymbol(coin.symbol);
                  navigate("/dashboard");
                }}
                className="flex w-full items-center justify-between rounded-lg p-1.5 text-left transition hover:bg-white/[0.04]"
              >
                <div className="flex items-center gap-2">
                  <CoinIcon symbol={symbol} small />
                  <span className="text-xs font-bold text-white">{symbol}</span>
                </div>

                <div className="text-right">
                  <p className="num text-xs font-bold text-slate-200">${formatPrice(coin.price)}</p>
                  <p
                    className={`num text-[10px] font-bold ${
                      isPositive ? "text-emerald-400" : "text-rose-400"
                    }`}
                  >
                    {isPositive ? "+" : ""}
                    {formatPercent(coin.change)}%
                  </p>
                </div>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}

function SortHeader({ label, active, direction, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-1 text-left text-[11px] font-bold uppercase tracking-wider text-slate-400 hover:text-white"
    >
      <span>{label}</span>
      <ArrowUpDown size={12} className={active ? "text-cyan-400" : "text-slate-600"} />
      {active && (
        <span className="text-[9px] text-cyan-400">{direction === "asc" ? "▲" : "▼"}</span>
      )}
    </button>
  );
}

function CoinIcon({ symbol, small = false }) {
  const firstLetter = symbol?.charAt(0) || "?";
  return (
    <div
      className={`grid shrink-0 place-items-center rounded-xl bg-gradient-to-br from-[#1b253b] to-[#0f172a] font-bold text-cyan-300 border border-white/[0.08] shadow-inner ${
        small ? "h-6 w-6 text-[10px]" : "h-8 w-8 text-xs"
      }`}
    >
      {firstLetter}
    </div>
  );
}

export default Market;

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
