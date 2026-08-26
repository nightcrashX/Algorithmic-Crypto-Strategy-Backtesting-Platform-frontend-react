import { ArrowDownUp } from "lucide-react";

const bookRows = [
  ["118,255.20", "0.842", "99.52K", false],
  ["118,249.10", "1.203", "142.24K", false],
  ["118,245.10", "0.527", "62.31K", true],
  ["118,238.80", "1.804", "213.36K", true],
  ["118,231.40", "0.774", "91.52K", true],
];

function OrderPanel() {
  return (
    <aside className="overflow-y-auto terminal-panel flex min-h-0 flex-col rounded-lg lg:rounded-none lg:border-y-0 lg:border-r-0 overflow-y-auto">
      <div className="border-b border-[#202938] px-3 py-3">
        <h2 className="text-sm font-semibold text-white">Order Ticket</h2>
        <p className="text-xs text-slate-500">Paper execution</p>
      </div>

      <div className="grid grid-cols-2 gap-1 p-3">
        <button type="button" className="h-9 rounded-md bg-emerald-400/15 text-sm font-semibold text-emerald-300 ring-1 ring-emerald-400/20">Buy</button>
        <button type="button" className="h-9 rounded-md text-sm font-semibold text-slate-400 ring-1 ring-[#263142] hover:bg-red-400/10 hover:text-red-300">Sell</button>
      </div>

      <div className="space-y-3 px-3">
        {[
          ["Order type", "Limit"],
          ["Price", "118245.10"],
          ["Amount", "0.025"],
          ["Stop loss", "116800.00"],
          ["Take profit", "121500.00"],
        ].map(([label, value]) => (
          <label key={label} className="block text-xs text-slate-500">
            {label}
            <input defaultValue={value} className="mt-1 w-full terminal-input px-3 text-sm num" />
          </label>
        ))}
      </div>

      <div className="px-3 py-4">
        <button type="button" className="h-10 w-full rounded-md bg-cyan-400 text-sm font-semibold text-[#041014] transition hover:bg-cyan-300">
          Place paper order
        </button>
      </div>

      <div className="  min-h-0 flex-1 border-t border-[#202938] ">
        <div className="flex items-center justify-between px-3 py-3">
          <h3 className="text-sm font-semibold text-white">Order Book</h3>
          <ArrowDownUp size={15} className="text-slate-500" />
        </div>
        <div className="grid grid-cols-3 px-3 pb-2 text-[11px] uppercase text-slate-600">
          <span>Price</span>
          <span className="text-right">Size</span>
          <span className="text-right">Total</span>
        </div>
        {bookRows.map(([price, size, total, bid]) => (
          <div key={`${price}-${size}`} className="grid grid-cols-3 px-3 py-1 text-xs">
            <span className={`num ${bid ? "text-emerald-300" : "text-red-300"}`}>{price}</span>
            <span className="num text-right text-slate-300">{size}</span>
            <span className="num text-right text-slate-500">{total}</span>
          </div>
        ))}
      </div>
    </aside>
  );
}

export default OrderPanel;
