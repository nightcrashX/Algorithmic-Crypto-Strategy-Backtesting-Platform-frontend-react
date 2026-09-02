import { CandlestickChart, LockKeyhole, Mail, Phone, User, ArrowRight, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../services/authService";

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    contact: "",
    email: "",
    password: "",
  });
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
      await registerUser(formData);
      navigate("/login", { replace: true });
    } catch (err) {
      console.error(err);
      setError("Unable to create account. Please verify details and try again.");
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { label: "Full Name", name: "name", type: "text", icon: User, placeholder: "Alex Vance" },
    { label: "Trader Handle / Username", name: "username", type: "text", icon: User, placeholder: "alex_quant" },
    { label: "Contact Phone", name: "contact", type: "tel", icon: Phone, placeholder: "+1 (555) 019-2834" },
    { label: "Email Address", name: "email", type: "email", icon: Mail, placeholder: "alex@hedgequant.io" },
    { label: "Account Password", name: "password", type: "password", icon: LockKeyhole, placeholder: "••••••••••••" },
  ];

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#040811] p-6 text-slate-200 relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-blue-600/10 blur-3xl pointer-events-none" />

      <div className="w-full max-w-[540px] relative z-10">
        {/* Brand Header */}
        <div className="mb-6 flex items-center justify-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 text-slate-950 shadow-[0_0_20px_rgba(6,182,212,0.4)]">
            <CandlestickChart size={22} className="stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-extrabold text-white tracking-wider">AlgoTrade</h1>
              <span className="rounded bg-cyan-400/20 px-1.5 py-0.2 text-[10px] font-bold text-cyan-300 border border-cyan-400/30">
                PRO 3D
              </span>
            </div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">Create Strategy Account</p>
          </div>
        </div>

        {/* 3D Glass Form Card */}
        <div className="rounded-2xl border border-white/[0.08] bg-gradient-to-br from-[#0c121e]/95 to-[#080d16]/95 p-6 sm:p-8 shadow-[0_16px_50px_rgba(0,0,0,0.6)] backdrop-blur-md">
          <div className="mb-6">
            <h2 className="text-lg font-extrabold text-white">Trader Registration</h2>
            <p className="mt-1 text-xs text-slate-400">Initialize your simulated trading ledger and backtesting environment.</p>
          </div>

          {error && (
            <div className="mb-4 rounded-xl border border-rose-500/20 bg-rose-500/10 px-3.5 py-2.5 text-xs font-semibold text-rose-300">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
            {fields.map((field) => {
              const Icon = field.icon;
              const isFull = field.name === "password" || field.name === "email";

              return (
                <div key={field.name} className={isFull ? "sm:col-span-2" : ""}>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5">{field.label}</label>
                  <div className="flex h-10 items-center gap-2.5 rounded-xl border border-white/[0.08] bg-black/40 px-3 shadow-inner transition focus-within:border-cyan-400/50">
                    <Icon size={15} className="text-slate-500" />
                    <input
                      type={field.type}
                      name={field.name}
                      value={formData[field.name]}
                      onChange={handleChange}
                      required
                      placeholder={field.placeholder}
                      className="min-w-0 flex-1 bg-transparent text-xs text-white outline-none placeholder:text-slate-600"
                    />
                  </div>
                </div>
              );
            })}

            <div className="sm:col-span-2 mt-2">
              <button
                type="submit"
                disabled={loading}
                className="btn-3d-primary flex h-11 w-full items-center justify-center gap-2 rounded-xl text-xs font-bold uppercase tracking-wider text-slate-950 shadow-lg disabled:opacity-60"
              >
                <span>{loading ? "Generating Account..." : "Create Strategy Account"}</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </form>

          <p className="mt-5 text-center text-xs text-slate-400">
            Already have an active account?{" "}
            <Link to="/login" className="font-bold text-cyan-300 hover:text-cyan-200 underline underline-offset-4">
              Sign in to Terminal
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;
