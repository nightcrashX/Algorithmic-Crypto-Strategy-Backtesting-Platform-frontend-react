import { CandlestickChart, LockKeyhole, Mail } from "lucide-react";
import { useEffect, useState } from "react";
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
      setError("Unable to sign in. Check  credentials and try again.");
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(()=>{
    console.log("check hghghg") 
  },[])
   
  return (
    <div className="grid min-h-screen bg-[#070a0f] text-slate-200 lg:grid-cols-[1fr_460px]">
      <section className="hidden border-r border-[#202938] bg-[#0b1017] p-10 lg:flex lg:flex-col lg:justify-between">
        <div className="flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-md border border-cyan-400/30 bg-cyan-400/10 text-cyan-300">
            <CandlestickChart size={24} />
          </div>
          <div>
            <p className="font-semibold text-white">AlgoTrade Terminal</p>
            <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Crypto strategy lab</p>
          </div>
        </div>

        <div className="max-w-xl">
          <p className="mb-5 text-sm uppercase tracking-[0.28em] text-cyan-300">Professional workspace</p>
          <h1 className="text-4xl font-semibold leading-tight text-white">
            Monitor markets, build strategies, and validate ideas in one focused cockpit.
          </h1>
          <div className="mt-8 grid grid-cols-3 gap-3">
            {["BTC +2.48%", "ETH +1.16%", "SOL -3.24%"].map((item) => (
              <div key={item} className="terminal-panel rounded-md p-4">
                <p className="num text-sm font-semibold text-white">{item}</p>
                <p className="mt-1 text-xs text-slate-500">24h change</p>
              </div>
            ))}
          </div>
        </div>

        <p className="text-xs text-slate-500">Secure paper trading environment</p>
      </section>

      <section className="flex items-center justify-center p-5">
        <div className="w-full max-w-[400px]">
          <div className="mb-8 lg:hidden">
            <CandlestickChart className="mb-3 text-cyan-300" size={32} />
            <h1 className="text-2xl font-semibold text-white">AlgoTrade Terminal</h1>
          </div>

          <div className="terminal-panel rounded-lg p-6 shadow-2xl shadow-black/30">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-white">Sign in</h2>
              <p className="mt-1 text-sm text-slate-500">Access  charts, watchlists, and backtests.</p>
            </div>

            {error && (
              <div className="mb-4 rounded-md border border-red-400/20 bg-red-400/10 px-3 py-2 text-sm text-red-200">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <label className="block text-sm text-slate-300">
                Email
                <span className="mt-2 flex items-center gap-2 terminal-input px-3">
                  <Mail size={16} className="text-slate-500" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="you@example.com"
                    className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-slate-600"
                  />
                </span>
              </label>

              <label className="block text-sm text-slate-300">
                Password
                <span className="mt-2 flex items-center gap-2 terminal-input px-3">
                  <LockKeyhole size={16} className="text-slate-500" />
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    placeholder="••••••••"
                    className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-slate-600"
                  />
                </span>
              </label>

              <button
                type="submit"
                disabled={loading}
                className="h-10 w-full rounded-md bg-cyan-400 text-sm font-semibold text-[#041014] transition hover:bg-cyan-300 disabled:opacity-60"
              >
                {loading ? "Signing in..." : "Sign in"}
              </button>
            </form>

            <p className="mt-5 text-center text-sm text-slate-500">
              New here?{" "}
              <Link to="/register" className="font-medium text-cyan-300 hover:text-cyan-200">
                Create account
              </Link>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Login;
