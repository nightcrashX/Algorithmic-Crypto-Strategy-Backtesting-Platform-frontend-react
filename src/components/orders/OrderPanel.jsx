import { ArrowDownUp, ShieldCheck, Wallet, RefreshCw, CheckCircle2, AlertCircle } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { orders, getDemoAccount } from "../../API/orderApi";
import useChartStore from "../../store/chartStore";

const bookRows = [
  ["118,255.20", "0.842", "99.52K", false, 45],
  ["118,249.10", "1.203", "142.24K", false, 70],
  ["118,245.10", "0.527", "62.31K", true, 30],
  ["118,238.80", "1.804", "213.36K", true, 85],
  ["118,231.40", "0.774", "91.52K", true, 50],
];

function OrderPanel({ currentPrice, onTradeSuccess }) {
  const [side, setSide] = useState("BUY");
  const [orderType, setOrderType] = useState("MARKET");
  const [quantity, setQuantity] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [balance, setBalance] = useState(0);
  const [loadingBalance, setLoadingBalance] = useState(true);

  const symbol = useChartStore((state) => state.symbol);
  const livePrice = useChartStore((state) => state.livePrice);

  const [limitPrice, setLimitPrice] = useState("");

  const MAKER_FEE = 0.001; // 0.10%
  const TAKER_FEE = 0.001; // 0.10%

  const entryPrice = 100000;
  const Sellquantity = 0.01;

  const tradeSide = "BUY";

  const pnl =
  tradeSide === "BUY"
    ? (livePrice - entryPrice) * quantity
    : (entryPrice - livePrice) * quantity;

  useEffect(() => {
    setLimitPrice("");
    setQuantity("");
    setMessage("");
    setError("");
  }, [symbol]);

  const fetchBalance = async () => {
    try {
      setLoadingBalance(true);
      const response = await getDemoAccount();
      setBalance(Number(response.data.balance) || 0);
    } catch (err) {
      console.error("Failed to fetch balance:", err);
    } finally {
      setLoadingBalance(false);
    }
  };

  useEffect(() => {
    fetchBalance();
  }, []);

  const executionPrice = useMemo(() => {
    if (orderType === "MARKET") {
      return Number(livePrice) || Number(currentPrice) || 0;
    }
    return Number(limitPrice) || 0;
  }, [orderType, livePrice, currentPrice, limitPrice]);

  const calculations = useMemo(() => {
    const qty = Number(quantity) || 0;
    const tradeValue = executionPrice * qty;
    const feeRate = orderType === "MARKET" ? TAKER_FEE : MAKER_FEE;
    const fee = tradeValue * feeRate;
    const total = side === "BUY" ? tradeValue + fee : tradeValue - fee;

    return {
      tradeValue,
      fee,
      total,
      feeRate,
    };
  }, [quantity, executionPrice, orderType, side]);

  const handlePercentageClick = (pct) => {
    if (!executionPrice || executionPrice <= 0) return;
    if (side === "BUY") {
      const budget = (balance * pct) / (1 + (orderType === "MARKET" ? TAKER_FEE : MAKER_FEE));
      const calcQty = budget / executionPrice;
      setQuantity(calcQty > 0 ? calcQty.toFixed(4) : "");
    } else {
      // Approximate quantity for sell based on $5000 demo lot
      const estimatedHoldings = (balance * pct) / executionPrice;
      setQuantity(estimatedHoldings > 0 ? estimatedHoldings.toFixed(4) : "");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");

    if (!symbol) {
      setError("No trading symbol selected.");
      return;
    }

    const qty = Number(quantity);
    if (!qty || qty <= 0) {
      setError("Please enter a valid quantity.");
      return;
    }

    if (!executionPrice || executionPrice <= 0) {
      setError("Live market price is not available yet.");
      return;
    }

    if (loading) return;
    setLoading(true);

    try {
      const body = {
        trade_type: side,
        exchange: "BINANCE",
        symbol: symbol,
        price: executionPrice,
        quantity: qty,
        order_type: orderType,
        fee_type: orderType === "MARKET" ? "TAKER" : "MAKER",
      };

      const response = await orders(body);

      if (response.data.balance !== undefined) {
        setBalance(Number(response.data.balance));
      }

      setMessage(`${side} order of ${qty} ${symbol} executed successfully!`);
      setQuantity("");

      if (onTradeSuccess) {
        onTradeSuccess(response.data);
      }
    } catch (err) {
      console.error("Trade failed:", err);
      const detail = err?.response?.data?.detail;
      if (typeof detail === "string") {
        setError(detail);
      } else if (detail?.message) {
        setError(detail.message);
      } else {
        setError("Unable to place order.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <aside className="flex h-full min-h-0 flex-col overflow-y-auto bg-transparent">
      {/* Header & Balance HUD */}
      <div className="border-b border-white/[0.08] p-3.5 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 rounded-full bg-cyan-400" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-white">Order Execution</h2>
            </div>
            <p className="text-[10px] text-slate-500">Instant Paper Simulation</p>
          </div>

          <div className="text-right">
            <p className="text-[10px] uppercase font-bold tracking-wider text-cyan-400">{symbol || "--"}</p>
            <p className="num text-base font-bold text-white">
              {executionPrice > 0
                ? `$${executionPrice.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 4 })}`
                : "--"}
            </p>
          </div>
        </div>

        {/* Demo Account Balance Tile */}
        <div className="flex items-center justify-between rounded-lg border border-white/[0.08] bg-gradient-to-r from-[#0d1524] to-[#0a101c] p-2.5 shadow-sm">
          <div className="flex items-center gap-2">
            <Wallet size={14} className="text-cyan-400" />
            <span className="text-xs text-slate-400">Available Paper Balance</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="num text-xs font-bold text-emerald-400">
              {loadingBalance
                ? "..."
                : `$${balance.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
            </span>
            <button
              type="button"
              onClick={fetchBalance}
              title="Refresh Balance"
              className="text-slate-500 hover:text-slate-300"
            >
              <RefreshCw size={11} className={loadingBalance ? "animate-spin" : ""} />
            </button>
          </div>
        </div>
      </div>

      {/* Tactile BUY / SELL Dual Tabs */}
      <div className="p-3.5 pb-0">
        <div className="grid grid-cols-2 gap-2 rounded-xl bg-black/40 p-1 border border-white/[0.06]">
          <button
            type="button"
            onClick={() => {
              setSide("BUY");
              setError("");
              setMessage("");
            }}
            className={`h-10 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-150 ${
              side === "BUY"
                ? "btn-3d-buy shadow-lg"
                : "text-slate-400 hover:text-slate-200 hover:bg-white/[0.03]"
            }`}
          >
            Buy / Long
          </button>

          <button
            type="button"
            onClick={() => {
              setSide("SELL");
              setError("");
              setMessage("");
            }}
            className={`h-10 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-150 ${
              side === "SELL"
                ? "btn-3d-sell shadow-lg"
                : "text-slate-400 hover:text-slate-200 hover:bg-white/[0.03]"
            }`}
          >
            Sell / Short
          </button>
        </div>
      </div>

      {/* Order Form */}
      <form onSubmit={handleSubmit} className="space-y-3 p-3.5">
        {/* Order Type Toggle */}
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-400 font-medium">Order Type</span>
          <div className="flex rounded-md border border-white/[0.08] bg-black/40 p-0.5">
            {["MARKET", "LIMIT"].map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => {
                  setOrderType(type);
                  if (type === "MARKET") setLimitPrice("");
                }}
                className={`rounded px-2.5 py-1 text-[11px] font-semibold transition ${
                  orderType === type
                    ? "bg-cyan-500/20 text-cyan-300 shadow-sm"
                    : "text-slate-500 hover:text-slate-300"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Execution Price Input */}
        <div>
          <label className="mb-1 block text-[11px] font-medium text-slate-400">
            {orderType === "MARKET" ? "Market Price (Live Stream)" : "Limit Order Price ($)"}
          </label>
          <input
            type="text"
            value={orderType === "MARKET" ? (executionPrice > 0 ? `$${executionPrice.toFixed(2)}` : "Live Price...") : limitPrice}
            onChange={(e) => orderType === "LIMIT" && setLimitPrice(e.target.value)}
            readOnly={orderType === "MARKET"}
            placeholder={orderType === "MARKET" ? "Waiting for live feed..." : "e.g. 95000"}
            className="w-full terminal-input px-3 text-xs font-semibold text-white num disabled:opacity-60"
          />
        </div>

        {/* Quantity Input */}
        <div>
          <div className="mb-1 flex items-center justify-between">
            <label className="text-[11px] font-medium text-slate-400">Order Quantity</label>
            <span className="text-[10px] text-slate-500">{symbol || "COIN"}</span>
          </div>
          <input
            type="number"
            min="0"
            step="any"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            placeholder="0.00"
            className="w-full terminal-input px-3 text-xs font-semibold text-white num"
          />
        </div>

        {/* Quick Percent Allocation Buttons */}
        <div className="grid grid-cols-4 gap-1.5">
          {[
            { label: "25%", val: 0.25 },
            { label: "50%", val: 0.5 },
            { label: "75%", val: 0.75 },
            { label: "100%", val: 1.0 },
          ].map((btn) => (
            <button
              key={btn.label}
              type="button"
              onClick={() => handlePercentageClick(btn.val)}
              className="h-7 rounded border border-white/[0.08] bg-[#0c121e] text-[10px] font-semibold text-slate-400 shadow-sm transition hover:border-cyan-400/40 hover:bg-cyan-500/10 hover:text-cyan-300"
            >
              {btn.label}
            </button>
          ))}
        </div>

        {/* Order Breakdown / Summary */}
        <div className="space-y-1.5 rounded-lg border border-white/[0.08] bg-[#070b13] p-3 text-xs shadow-inner">
          <div className="flex justify-between text-slate-400 text-[11px]">
            <span>Trade Value</span>
            <span className="num font-semibold text-slate-200">${calculations.tradeValue.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-slate-400 text-[11px]">
            <span>Est. Fee (0.10%)</span>
            <span className="num font-semibold text-slate-300">${calculations.fee.toFixed(2)}</span>
          </div>
          <div className="flex justify-between border-t border-white/[0.08] pt-1.5 text-xs font-bold">
            <span className="text-slate-300">{side === "BUY" ? "Total Estimated Cost" : "Total Estimated Value"}</span>
            <span className="num text-cyan-300">${Math.abs(calculations.total).toFixed(2)}</span>
          </div>
        </div>

        {/* Feedback Messages */}
        {error && (
          <div className="flex items-center gap-1.5 rounded-lg border border-rose-500/20 bg-rose-500/10 p-2.5 text-xs text-rose-300 shadow-sm">
            <AlertCircle size={14} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {message && (
          <div className="flex items-center gap-1.5 rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-2.5 text-xs text-emerald-300 shadow-sm">
            <CheckCircle2 size={14} className="shrink-0" />
            <span>{message}</span>
          </div>
        )}

        {/* Submit Execution CTA */}
        <button
          type="submit"
          disabled={loading || !executionPrice}
          className={`h-11 w-full rounded-xl text-xs font-bold uppercase tracking-wider shadow-lg transition-all ${
            side === "BUY" ? "btn-3d-buy" : "btn-3d-sell"
          } disabled:cursor-not-allowed disabled:opacity-50`}
        >
          {loading ? "Transacting..." : `Execute ${side} Order`}
        </button>
      </form>

      <div className="rounded-md border border-[#202938] bg-[#0d1219] p-3">

        <div className="flex items-center justify-between">
              
          <span className="text-xs text-slate-500">
            Unrealized P&L
          </span>
              
          <span
            className={`num text-sm font-semibold ${
              pnl >= 0
                ? "text-emerald-300"
                : "text-red-300"
            }`}
          >
            {pnl >= 0 ? "+" : ""}
            ${pnl.toFixed(2)}
          </span>
          
        </div>
          
      </div>

      {/* Visual Depth Order Book */}
      <div className="min-h-0 flex-1 border-t border-white/[0.08] p-3.5">
        <div className="mb-2 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <ArrowDownUp size={13} className="text-cyan-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-white">Live Depth Feed</h3>
          </div>
          <span className="text-[10px] text-slate-500">Real-time Level 2</span>
        </div>

        <div className="grid grid-cols-3 pb-1 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
          <span>Price</span>
          <span className="text-right">Size</span>
          <span className="text-right">Total</span>
        </div>

        <div className="space-y-1">
          {bookRows.map(([price, size, total, bid, depthPct]) => (
            <div key={`${price}-${size}`} className="relative grid grid-cols-3 py-1 text-xs">
              {/* Depth bar indicator */}
              <div
                className={`absolute inset-y-0 right-0 rounded opacity-15 pointer-events-none ${
                  bid ? "bg-emerald-500" : "bg-rose-500"
                }`}
                style={{ width: `${depthPct}%` }}
              />
              <span className={`num font-semibold z-10 ${bid ? "text-emerald-400" : "text-rose-400"}`}>{price}</span>
              <span className="num text-right font-medium text-slate-300 z-10">{size}</span>
              <span className="num text-right font-medium text-slate-500 z-10">{total}</span>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}

export default OrderPanel;
