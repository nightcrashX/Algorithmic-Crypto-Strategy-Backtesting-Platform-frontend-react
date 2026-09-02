import { CandlestickChart, LockKeyhole, Mail, ArrowRight, ShieldCheck, Zap, TrendingUp } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../services/authService";
import useAuthStore from "../store/authStore";

function Login() {
  const navigate = useNavigate();
  const checkAuth = useAuthStore((state) => state.checkAuth);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (event) => {
    setFormData((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      await loginUser(formData);
      await checkAuth();
      navigate("/market", { replace: true });
    } catch (err) {
      console.error(err);
      setError("Unable to sign in. Please verify your email and password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid min-h-screen bg-[#040811] text-slate-200 lg:grid-cols-[1.2fr_480px]">
      {/* Left Showcase Side */}
      <section className="hidden relative overflow-hidden border-r border-white/[0.08] bg-gradient-to-br from-[#0a101d] via-[#060a14] to-[#03060c] p-12 lg:flex lg:flex-col lg:justify-between">
        {/* Ambient Glows */}
        <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-blue-600/10 blur-3xl pointer-events-none" />

        {/* Brand Header */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 text-slate-950 shadow-[0_0_20px_rgba(6,182,212,0.4)]">
            <CandlestickChart size={22} className="stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <p className="font-extrabold text-white tracking-wider text-base">AlgoTrade</p>
              <span className="rounded bg-cyan-400/20 px-1.5 py-0.2 text-[10px] font-bold text-cyan-300 border border-cyan-400/30">
                PRO 3D
              </span>
            </div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">Quantitative Strategy Platform</p>
          </div>
        </div>

        {/* Center Hero Copy */}
        <div className="relative z-10 max-w-xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs font-bold text-cyan-300 backdrop-blur-md mb-4">
            <Zap size={13} className="text-cyan-400" />
            <span>Sub-Millisecond Execution & Simulation</span>
          </div>

          <h1 className="text-4xl font-extrabold leading-tight text-white tracking-tight">
            Institutional-Grade Crypto Strategy & Terminal Backtesting
          </h1>

          <p className="mt-4 text-sm text-slate-400 leading-relaxed">
            High-frequency Binance WebSocket streams, custom visual rule builders, and historical simulation engines designed for serious quantitative traders.
          </p>

          {/* Mini Live Ticker Cards */}
          <div className="mt-8 grid grid-cols-3 gap-3">
            {[
              { pair: "BTCUSDT", price: "$64,280.50", change: "+2.48%", positive: true },
              { pair: "ETHUSDT", price: "$3,450.20", change: "+1.16%", positive: true },
              { pair: "SOLUSDT", price: "$148.90", change: "-3.24%", positive: false },
            ].map((item) => (
              <div
                key={item.pair}
                className="rounded-xl border border-white/[0.08] bg-black/40 p-3.5 backdrop-blur-md shadow-inner"
              >
                <div className="flex items-center justify-between text-[11px] font-bold text-slate-400">
                  <span>{item.pair}</span>
                  <span className={`num text-[10px] ${item.positive ? "text-emerald-400" : "text-rose-400"}`}>
                    {item.change}
                  </span>
                </div>
                <p className="num mt-1 text-sm font-bold text-white">{item.price}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Meta */}
        <div className="relative z-10 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <ShieldCheck size={15} className="text-cyan-400" />
            <span>Isolated Paper Trading Environment</span>
          </div>
          <span>v2.4.0 High-Performance Engine</span>
        </div>
      </section>

      {/* Right Form Side */}
      <section className="flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-[400px]">
          {/* Mobile Brand */}
          <div className="mb-8 lg:hidden flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-cyan-400 text-slate-950 font-bold">
              <CandlestickChart size={20} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">AlgoTrade PRO</h1>
              <p className="text-xs text-slate-500">Quantitative Strategy Terminal</p>
            </div>
          </div>

          <div className="rounded-2xl border border-white/[0.08] bg-gradient-to-br from-[#0c121e]/95 to-[#080d16]/95 p-6 shadow-[0_12px_40px_rgba(0,0,0,0.6)] backdrop-blur-md">
            <div className="mb-6">
              <h2 className="text-xl font-extrabold tracking-tight text-white">Terminal Access</h2>
              <p className="mt-1 text-xs text-slate-400">Sign in to your algorithmic trading cockpit.</p>
            </div>

            {error && (
              <div className="mb-4 rounded-xl border border-rose-500/20 bg-rose-500/10 px-3.5 py-2.5 text-xs font-semibold text-rose-300">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5">Email Address</label>
                <div className="flex h-10 items-center gap-2.5 rounded-xl border border-white/[0.08] bg-black/40 px-3 shadow-inner transition focus-within:border-cyan-400/50">
                  <Mail size={15} className="text-slate-500" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="trader@algopro.io"
                    className="min-w-0 flex-1 bg-transparent text-xs text-white outline-none placeholder:text-slate-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5">Password</label>
                <div className="flex h-10 items-center gap-2.5 rounded-xl border border-white/[0.08] bg-black/40 px-3 shadow-inner transition focus-within:border-cyan-400/50">
                  <LockKeyhole size={15} className="text-slate-500" />
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    placeholder="••••••••••••"
                    className="min-w-0 flex-1 bg-transparent text-xs text-white outline-none placeholder:text-slate-600"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-3d-primary mt-2 flex h-11 w-full items-center justify-center gap-2 rounded-xl text-xs font-bold uppercase tracking-wider text-slate-950 shadow-lg disabled:opacity-60"
              >
                <span>{loading ? "Authenticating..." : "Sign In to Terminal"}</span>
                <ArrowRight size={14} />
              </button>
            </form>

            <p className="mt-5 text-center text-xs text-slate-400">
              Need a strategy account?{" "}
              <Link to="/register" className="font-bold text-cyan-300 hover:text-cyan-200 underline underline-offset-4">
                Register here
              </Link>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Login;
