import { X, Sliders, Check } from "lucide-react";
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-md">
      <div className="w-full max-w-[420px] rounded-2xl border border-white/[0.12] bg-[#0c121e]/98 shadow-2xl backdrop-blur-2xl">
        <div className="flex items-center justify-between border-b border-white/[0.08] px-5 py-4">
          <div className="flex items-center gap-2.5">
            <div className="grid h-8 w-8 place-items-center rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Sliders size={16} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">{indicator.type} Configuration</h3>
              <p className="text-[10px] text-slate-500">Fine-tune indicator parameters</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            title="Close settings"
            aria-label="Close indicator settings"
            className="grid h-8 w-8 place-items-center rounded-lg text-slate-400 transition hover:bg-white/[0.06] hover:text-white"
          >
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 p-5">
          {error && (
            <div className="rounded-lg border border-rose-500/20 bg-rose-500/10 px-3 py-2 text-xs text-rose-300">
              {error}
            </div>
          )}

          <div className="space-y-3">
            {Object.keys(settings).filter((key) => key !== "color").map((key) => (
              <div key={key} className="flex items-center justify-between gap-4">
                <label className="text-xs font-semibold capitalize text-slate-300">
                  {key.replace("_", " ")}
                </label>
                <input
                  type={typeof settings[key] === "number" ? "number" : "text"}
                  value={settings[key]}
                  onChange={(event) => handleInputChange(key, event.target.value)}
                  className="terminal-input h-9 w-28 rounded-lg px-2.5 text-right text-xs font-bold text-white num"
                />
              </div>
            ))}

            <div className="flex items-center justify-between gap-4 pt-1">
              <span className="text-xs font-semibold text-slate-300">Plot Color</span>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={lineColor}
                  onChange={(event) => setLineColor(event.target.value)}
                  className="h-8 w-9 cursor-pointer rounded-lg border border-white/[0.1] bg-transparent p-0.5"
                />
                <span className="num rounded bg-black/40 px-2 py-1 text-[11px] font-mono text-slate-400 border border-white/[0.06]">
                  {lineColor.toUpperCase()}
                </span>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 border-t border-white/[0.08] pt-4">
            <button
              type="button"
              onClick={onClose}
              className="h-9 rounded-lg border border-white/[0.08] px-4 text-xs font-semibold text-slate-400 transition hover:bg-white/[0.04] hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="btn-3d-primary flex h-9 items-center gap-1.5 rounded-lg px-5 text-xs font-bold text-slate-950 transition disabled:opacity-60"
            >
              <Check size={14} />
              <span>{saving ? "Applying..." : "Save Changes"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default IndicatorMenu;
