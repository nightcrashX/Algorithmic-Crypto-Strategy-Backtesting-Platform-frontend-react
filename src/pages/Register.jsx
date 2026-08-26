import { CandlestickChart, LockKeyhole, Mail, Phone, User } from "lucide-react";
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
      setError("Unable to create account. Review  details and try again.");
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { label: "Full name", name: "name", type: "text", icon: User, placeholder: "Priya Sharma" },
    { label: "Username", name: "username", type: "text", icon: User, placeholder: "priya_trades" },
    { label: "Contact", name: "contact", type: "tel", icon: Phone, placeholder: "99********" },
    { label: "Email", name: "email", type: "email", icon: Mail, placeholder: "you@example.com" },
    { label: "Password", name: "password", type: "password", icon: LockKeyhole, placeholder: "••••••••" },
  ];

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#070a0f] p-5 text-slate-200">
      <div className="w-full max-w-[500px]">
        <div className="mb-6 flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-md border border-cyan-400/30 bg-cyan-400/10 text-cyan-300">
            <CandlestickChart size={22} />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-white">Create trading account</h1>
            <p className="text-sm text-slate-500">Set up  strategy workspace.</p>
          </div>
        </div>

        <div className="terminal-panel rounded-lg p-6 shadow-2xl shadow-black/30">
          {error && (
            <div className="mb-4 rounded-md border border-red-400/20 bg-red-400/10 px-3 py-2 text-sm text-red-200">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
            {fields.map((field) => {
              const Icon = field.icon;
              return (
                <label
                  key={field.name}
                  className={`block text-sm text-slate-300 ${field.name === "password" ? "sm:col-span-2" : ""}`}
                >
                  {field.label}
                  <span className="mt-2 flex items-center gap-2 terminal-input px-3">
                    <Icon size={16} className="text-slate-500" />
                    <input
                      type={field.type}
                      name={field.name}
                      value={formData[field.name]}
                      onChange={handleChange}
                      required
                      placeholder={field.placeholder}
                      className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-slate-600"
                    />
                  </span>
                </label>
              );
            })}

            <button
              type="submit"
              disabled={loading}
              className="h-10 rounded-md bg-cyan-400 text-sm font-semibold text-[#041014] transition hover:bg-cyan-300 disabled:opacity-60 sm:col-span-2"
            >
              {loading ? "Creating account..." : "Create account"}
            </button>
          </form>

          <p className="mt-5 text-center text-sm text-slate-500">
            Already have access?{" "}
            <Link to="/login" className="font-medium text-cyan-300 hover:text-cyan-200">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;
