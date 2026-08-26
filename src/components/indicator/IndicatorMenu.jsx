import { X } from "lucide-react";
import { useState } from "react";
import { updateIndicatorConfig } from "../../services/indicatorService";
import useIndicatorStore from "../../store/indicatorStore";

const IndicatorMenu = ({ indicator, currentMarket, onClose }) => {
  const [settings, setSettings] = useState(indicator.settings || {});
  const [lineColor, setLineColor] = useState(
    indicator.style?.color || indicator.settings?.color || "#22d3ee"
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = (key, value) => {
    setSettings((prev) => ({
      ...prev,
      [key]: typeof value === "string" && !Number.isNaN(Number(value)) && value !== "" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");

    const allCurrentIndicators = useIndicatorStore.getState().indicators;
    const mathSettings = { ...settings };
    delete mathSettings.color;
    const formattedIndicatorsList = allCurrentIndicators.map((ind) => ({
      id: ind.id,
      type: ind.type,
      settings: ind.id === indicator.id ? mathSettings : ind.settings || {},
    }));

    try {
      const responseData = await updateIndicatorConfig({
        exchange: currentMarket.exchange,
        symbol: currentMarket.symbol,
        timeframe: currentMarket.timeframe,
        indicators: formattedIndicatorsList,
      });

      const serverMatch = Array.isArray(responseData)
        ? responseData.find((item) => item.id === indicator.id) || {}
        : responseData || {};

      useIndicatorStore.getState().updateIndicator(indicator.id, {
        ...serverMatch,
        id: indicator.id,
        settings: { ...mathSettings, color: lineColor },
        style: { ...indicator.style, color: lineColor },
      });
      onClose();
    } catch (err) {
      console.error("Indicator settings update failed:", err);
      setError("Settings could not be applied. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4">
      {/* UI CHANGE: Improved indicator settings modal spacing, focus states, and action hierarchy. */}
      <div className="w-full max-w-[420px] rounded-lg border border-[#263142] bg-[#0b1017] shadow-2xl shadow-black/50">
        <div className="flex items-center justify-between border-b border-[#202938] px-4 py-3">
          <div>
            <h3 className="font-semibold text-white">{indicator.type} Settings</h3>
            <p className="text-xs text-slate-500">Dynamic configuration</p>
          </div>
          <button type="button" onClick={onClose} title="Close settings" aria-label="Close indicator settings" className="grid h-8 w-8 place-items-center rounded-md text-slate-500 hover:bg-[#151d29] hover:text-white">
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 p-4">
          {error && (
            <div className="rounded-md border border-red-400/20 bg-red-400/10 px-3 py-2 text-sm text-red-200">
              {error}
            </div>
          )}

          {Object.keys(settings).filter((key) => key !== "color").map((key) => (
            <label key={key} className="flex items-center justify-between gap-4 text-sm text-slate-300">
              <span className="capitalize">{key.replace("_", " ")}</span>
              <input
                type={typeof settings[key] === "number" ? "number" : "text"}
                value={settings[key]}
                onChange={(event) => handleInputChange(key, event.target.value)}
                className="terminal-input h-9 w-32 px-2 text-right num"
              />
            </label>
          ))}

          <label className="flex items-center justify-between gap-4 text-sm text-slate-300">
            <span>Line color</span>
            <span className="flex items-center gap-2">
              <input
                type="color"
                value={lineColor}
                onChange={(event) => setLineColor(event.target.value)}
                className="h-8 w-10 rounded border border-[#263142] bg-transparent"
              />
              <span className="num w-20 text-xs text-slate-500">{lineColor.toUpperCase()}</span>
            </span>
          </label>

          <div className="flex justify-end gap-2 border-t border-[#202938] pt-4">
            <button type="button" onClick={onClose} className="h-9 rounded-md px-3 text-sm text-slate-400 hover:bg-[#151d29] hover:text-white">
              Cancel
            </button>
            <button type="submit" disabled={saving} className="h-9 rounded-md bg-cyan-400 px-4 text-sm font-semibold text-[#041014] hover:bg-cyan-300 disabled:opacity-60">
              {saving ? "Applying..." : "Apply"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default IndicatorMenu;
