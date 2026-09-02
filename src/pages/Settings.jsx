import { useState } from "react";
import { Sliders, Shield, Palette, LineChart, Database, UserCheck, Save, Check } from "lucide-react";

const sections = [
  { name: "General", icon: Sliders, desc: "Global workspace & exchange defaults" },
  { name: "Chart Engine", icon: LineChart, desc: "Render quality, timescales & grid" },
  { name: "Appearance", icon: Palette, desc: "Fintech 3D theme & contrast" },
  { name: "Order Routing", icon: Database, desc: "Slippage, demo capital & latency" },
  { name: "Account & Security", icon: Shield, desc: "Session tokens & API keys" },
];

const generalSettings = [
  { label: "Default Exchange", value: "Binance Spot Feed", hint: "Primary quote provider for chart & depth stream" },
  { label: "Default Symbol Pair", value: "BTCUSDT", hint: "Initial market loaded upon startup" },
  { label: "Chart Atmosphere Theme", value: "Obsidian 3D Cyber Terminal", hint: "High-contrast GPU accelerated theme" },
  { label: "Candle Render Profile", value: "High Contrast (Emerald / Ruby)", hint: "Color blindness & high-DPI optimized" },
  { label: "Default Account Mode", value: "Institutional Paper Trading ($50,000)", hint: "Zero risk simulated ledger" },
  { label: "Pre-Trade Risk Confirmation", value: "Enabled (Warning over 15% capital)", hint: "Safety checks on market executions" },
];

function Settings() {
  const [activeSection, setActiveSection] = useState("General");
  const [savedIndex, setSavedIndex] = useState(null);

  const handleSave = (index) => {
    setSavedIndex(index);
    setTimeout(() => setSavedIndex(null), 1800);
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 rounded-full bg-cyan-400" />
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-cyan-300">Terminal Preferences</p>
        </div>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-white lg:text-3xl">
          System & Workspace Configuration
        </h1>
        <p className="mt-1 text-xs text-slate-400">
          Customize charting parameters, execution defaults, and UI environment appearance.
        </p>
      </div>

      <div className="grid gap-5 lg:grid-cols-[280px_minmax(0,1fr)]">
        {/* Left Section Navigation */}
        <aside className="rounded-2xl border border-white/[0.08] bg-[#080d16]/90 p-3 shadow-[0_8px_30px_rgb(0,0,0,0.4)] backdrop-blur-md space-y-1.5 h-fit">
          {sections.map((section) => {
            const Icon = section.icon;
            const isActive = activeSection === section.name;

            return (
              <button
                key={section.name}
                type="button"
                onClick={() => setActiveSection(section.name)}
                className={`flex w-full items-center gap-3 rounded-xl p-3 text-left transition-all ${
                  isActive
                    ? "bg-cyan-500/15 text-cyan-300 shadow-sm ring-1 ring-cyan-400/30 font-bold"
                    : "text-slate-400 hover:bg-white/[0.04] hover:text-slate-200"
                }`}
              >
                <div className={`grid h-8 w-8 place-items-center rounded-lg border ${
                  isActive ? "border-cyan-400/40 bg-cyan-400/10 text-cyan-300" : "border-white/[0.06] bg-black/40 text-slate-400"
                }`}>
                  <Icon size={16} />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold">{section.name}</p>
                  <p className="truncate text-[10px] text-slate-500">{section.desc}</p>
                </div>
              </button>
            );
          })}
        </aside>

        {/* Right Settings Form */}
        <section className="rounded-2xl border border-white/[0.08] bg-[#080d16]/90 p-5 shadow-[0_8px_30px_rgb(0,0,0,0.4)] backdrop-blur-md">
          <div className="mb-4 border-b border-white/[0.06] pb-3.5">
            <h2 className="text-sm font-bold uppercase tracking-wider text-white">{activeSection} Preferences</h2>
            <p className="text-xs text-slate-500">Settings are applied in real-time to your local workspace.</p>
          </div>

          <div className="divide-y divide-white/[0.04]">
            {generalSettings.map((item, index) => (
              <div key={item.label} className="grid gap-3 py-4 md:grid-cols-[240px_minmax(0,1fr)_90px] md:items-center">
                <div>
                  <p className="text-xs font-bold text-slate-200">{item.label}</p>
                  <p className="text-[11px] text-slate-500">{item.hint}</p>
                </div>
                <input
                  defaultValue={item.value}
                  className="terminal-input px-3 text-xs font-semibold text-white shadow-inner"
                />
                <button
                  type="button"
                  onClick={() => handleSave(index)}
                  className={`flex h-9 items-center justify-center gap-1 rounded-xl text-xs font-bold transition ${
                    savedIndex === index
                      ? "bg-emerald-500 text-slate-950 font-bold"
                      : "btn-3d-secondary hover:border-cyan-400/40 hover:text-cyan-300"
                  }`}
                >
                  {savedIndex === index ? (
                    <>
                      <Check size={13} />
                      <span>Saved</span>
                    </>
                  ) : (
                    <span>Save</span>
                  )}
                </button>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

export default Settings;
