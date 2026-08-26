const sections = ["General", "Chart", "Indicators", "Trading", "Appearance", "Account/Security"];

const settings = [
  ["Default exchange", "binance"],
  ["Default symbol", "BTC/USDT"],
  ["Chart theme", "Professional dark"],
  ["Candle style", "High contrast"],
  ["Order mode", "Paper trading"],
  ["Risk confirmation", "Enabled"],
];

function Settings() {
  return (
    <div className="grid gap-4 lg:grid-cols-[240px_minmax(0,1fr)]">
      <aside className="terminal-panel rounded-lg p-2">
        {sections.map((section, index) => (
          <button
            key={section}
            type="button"
            className={`mb-1 block h-10 w-full rounded-md px-3 text-left text-sm transition ${
              index === 0 ? "bg-cyan-400/10 text-cyan-200" : "text-slate-400 hover:bg-[#151d29] hover:text-white"
            }`}
          >
            {section}
          </button>
        ))}
      </aside>

      <section className="terminal-panel rounded-lg">
        <div className="border-b border-[#202938] px-4 py-4">
          <p className="text-xs uppercase tracking-[0.24em] text-cyan-300">Preferences</p>
          <h1 className="mt-1 text-2xl font-semibold text-white">Terminal Settings</h1>
          <p className="mt-1 text-sm text-slate-500">Configure defaults, chart behavior, and account controls.</p>
        </div>

        <div className="divide-y divide-[#141c28]">
          {settings.map(([label, value]) => (
            <div key={label} className="grid gap-3 px-4 py-4 md:grid-cols-[220px_minmax(0,1fr)_96px] md:items-center">
              <div>
                <p className="text-sm font-medium text-slate-200">{label}</p>
                <p className="text-xs text-slate-600">Applies to new workspaces</p>
              </div>
              <input defaultValue={value} className="terminal-input px-3 text-sm" />
              <button type="button" className="h-9 rounded-md border border-[#263142] text-sm text-slate-300 hover:border-cyan-400/50 hover:text-cyan-200">
                Save
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Settings;
