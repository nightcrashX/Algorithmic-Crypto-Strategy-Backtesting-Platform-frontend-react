import {
  ChevronLeft,
  ChevronRight,
  RefreshCcw,
  Clock,
  Calendar,
  Filter,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

import { useEffect, useState } from "react";
import { getTradeHistory } from "../API/orderApi";

function OrderHistory() {
  const [trades, setTrades] = useState([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalTrades, setTotalTrades] = useState(0);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchTrades = async (selectedPage = page) => {
    try {
      setLoading(true);
      setError("");

      const response = await getTradeHistory({
        page: selectedPage,
        limit,
        fromDate,
        toDate,
      });

      const result = response.data;
      if (!result.success) {
        throw new Error(result.message || "Unable to load trades");
      }

      setTrades(result.data || []);
      setTotalTrades(result.pagination?.total || 0);
      setTotalPages(result.pagination?.total_pages || 0);
    } catch (err) {
      console.error("Trade history error:", err);
      setError(
        err?.response?.data?.detail || err.message || "Unable to load trade history"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrades(page);
  }, [page]);

  const handleFilter = () => {
    setPage(1);
    fetchTrades(1);
  };

  const handleReset = () => {
    setFromDate("");
    setToDate("");
    setPage(1);
    setTimeout(() => {
      fetchTrades(1);
    }, 0);
  };

  const formatDate = (date) => {
    if (!date) return "--";
    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatTime = (date) => {
    if (!date) return "--";
    return new Date(date).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col justify-between gap-3 md:flex-row md:items-end">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-cyan-400" />
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-cyan-300">
              Execution Ledger
            </p>
          </div>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-white lg:text-3xl">
            Order & Trade History
          </h1>
          <p className="mt-1 text-xs text-slate-400">
            Audit trial of all executed paper BUY / SELL orders and fee structures.
          </p>
        </div>

        <button
          type="button"
          onClick={() => fetchTrades(page)}
          disabled={loading}
          className="btn-3d-secondary flex h-9 items-center justify-center gap-2 rounded-xl px-4 text-xs font-bold text-slate-200 shadow-sm transition disabled:opacity-50"
        >
          <RefreshCcw size={13} className={loading ? "animate-spin text-cyan-400" : ""} />
          <span>Refresh Ledger</span>
        </button>
      </div>

      {/* Date Filter Card */}
      <div className="rounded-2xl border border-white/[0.08] bg-[#080d16]/90 p-4 shadow-[0_8px_30px_rgb(0,0,0,0.4)] backdrop-blur-md">
        <div className="grid gap-3 md:grid-cols-[1fr_1fr_auto_auto] md:items-end">
          {/* FROM */}
          <label className="block">
            <span className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-400">
              <Calendar size={13} className="text-cyan-400" />
              From Date
            </span>
            <input
              type="date"
              value={fromDate}
              onChange={(event) => setFromDate(event.target.value)}
              className="mt-1.5 h-10 w-full terminal-input px-3 text-xs font-medium text-white shadow-inner"
            />
          </label>

          {/* TO */}
          <label className="block">
            <span className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-400">
              <Calendar size={13} className="text-cyan-400" />
              To Date
            </span>
            <input
              type="date"
              value={toDate}
              onChange={(event) => setToDate(event.target.value)}
              className="mt-1.5 h-10 w-full terminal-input px-3 text-xs font-medium text-white shadow-inner"
            />
          </label>

          <button
            type="button"
            onClick={handleFilter}
            className="btn-3d-primary flex h-10 items-center justify-center gap-1.5 rounded-xl px-6 text-xs font-bold uppercase tracking-wider text-slate-950 shadow-md"
          >
            <Filter size={13} />
            <span>Filter</span>
          </button>

          <button
            type="button"
            onClick={handleReset}
            className="btn-3d-secondary h-10 rounded-xl px-5 text-xs font-semibold text-slate-300 transition"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="flex items-center gap-2 rounded-xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-xs text-rose-300 shadow-sm">
          <AlertCircle size={15} className="shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Institutional Trade Table Panel */}
      <div className="rounded-2xl border border-white/[0.08] bg-[#080d16]/90 p-4 shadow-[0_8px_30px_rgb(0,0,0,0.4)] backdrop-blur-md">
        <div className="mb-3 flex items-center justify-between border-b border-white/[0.06] pb-3">
          <div className="flex items-center gap-2">
            <Clock size={16} className="text-cyan-400" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-white">Trade Log</h2>
          </div>
          <span className="num rounded bg-black/40 px-2 py-0.5 text-[11px] font-semibold text-slate-400">
            {totalTrades} Total Trades
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[850px] text-xs">
            <thead>
              <tr className="border-b border-white/[0.08] text-[10px] uppercase font-bold tracking-wider text-slate-500">
                <th className="px-4 py-2.5 text-left">Type</th>
                <th className="px-4 py-2.5 text-left">Symbol</th>
                <th className="px-4 py-2.5 text-left">Exchange</th>
                <th className="px-4 py-2.5 text-right">Execution Price</th>
                <th className="px-4 py-2.5 text-right">Quantity</th>
                <th className="px-4 py-2.5 text-right">Fee ($)</th>
                <th className="px-4 py-2.5 text-right">Date</th>
                <th className="px-4 py-2.5 text-right">Time</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-white/[0.03]">
              {loading ? (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center text-xs text-slate-500">
                    <div className="flex flex-col items-center gap-2">
                      <div className="h-6 w-6 animate-spin rounded-full border-2 border-cyan-400 border-t-transparent" />
                      <span>Loading trade executions...</span>
                    </div>
                  </td>
                </tr>
              ) : trades.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center text-xs text-slate-500">
                    No trade executions found matching date criteria.
                  </td>
                </tr>
              ) : (
                trades.map((trade, index) => {
                  const isBuy = trade.trade_type === "BUY";
                  return (
                    <tr
                      key={trade._id || `${trade.trade_time}-${index}`}
                      className="transition hover:bg-white/[0.03]"
                    >
                      {/* TYPE */}
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-bold ${
                            isBuy
                              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                              : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                          }`}
                        >
                          {trade.trade_type}
                        </span>
                      </td>

                      {/* SYMBOL */}
                      <td className="px-4 py-3 font-bold text-white tracking-tight">
                        {trade.symbol}
                      </td>

                      {/* EXCHANGE */}
                      <td className="px-4 py-3 text-slate-400">
                        <span className="rounded bg-white/[0.04] px-1.5 py-0.5 text-[10px] font-semibold text-slate-400">
                          {trade.exchange}
                        </span>
                      </td>

                      {/* PRICE */}
                      <td className="num px-4 py-3 text-right font-semibold text-slate-200">
                        ${Number(trade.price || 0).toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 4,
                        })}
                      </td>

                      {/* QUANTITY */}
                      <td className="num px-4 py-3 text-right font-medium text-slate-300">
                        {Number(trade.quantity || 0).toLocaleString("en-US", {
                          maximumFractionDigits: 8,
                        })}
                      </td>

                      {/* FEE */}
                      <td className="num px-4 py-3 text-right text-slate-400">
                        ${Number(trade.fee || 0).toFixed(2)}
                      </td>

                      {/* DATE */}
                      <td className="px-4 py-3 text-right text-slate-400">
                        {formatDate(trade.trade_time)}
                      </td>

                      {/* TIME */}
                      <td className="num px-4 py-3 text-right text-slate-500">
                        {formatTime(trade.trade_time)}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        {totalPages > 0 && (
          <div className="flex flex-col gap-3 border-t border-white/[0.06] pt-3.5 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-slate-500">
              Showing page <span className="font-semibold text-white">{page}</span> of{" "}
              <span className="font-semibold text-white">{totalPages}</span>
            </p>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                disabled={page <= 1 || loading}
                onClick={() => setPage((current) => current - 1)}
                className="grid h-8 w-8 place-items-center rounded-lg border border-white/[0.08] bg-[#0c121e] text-slate-400 transition hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
              >
                <ChevronLeft size={15} />
              </button>

              {Array.from({ length: totalPages }, (_, index) => index + 1)
                .slice(Math.max(0, page - 3), page + 2)
                .map((pageNumber) => (
                  <button
                    key={pageNumber}
                    type="button"
                    onClick={() => setPage(pageNumber)}
                    className={`h-8 min-w-8 rounded-lg px-2 text-xs font-bold transition ${
                      pageNumber === page
                        ? "bg-cyan-400 text-slate-950 shadow-md"
                        : "border border-white/[0.08] bg-[#0c121e] text-slate-400 hover:text-white"
                    }`}
                  >
                    {pageNumber}
                  </button>
                ))}

              <button
                type="button"
                disabled={page >= totalPages || loading}
                onClick={() => setPage((current) => current + 1)}
                className="grid h-8 w-8 place-items-center rounded-lg border border-white/[0.08] bg-[#0c121e] text-slate-400 transition hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
              >
                <ChevronRight size={15} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default OrderHistory;