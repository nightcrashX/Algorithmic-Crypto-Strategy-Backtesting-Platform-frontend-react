import { div } from "framer-motion/client";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../services/authService";
import useAuthStore from "../store/authStore";

function Register() {
  const navigate = useNavigate();

  const checkAuth = useAuthStore((state) => state.checkAuth);

  const [formData, setFormData] = useState({
    name:"",
    username:"",
    contact:"",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      await registerUser(formData);

      await checkAuth();

      navigate("/login", { replace: true });

    } catch (error) {
      alert("Invalid Email or Password");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="relative flex min-h-screen items-center justify-center bg-zinc-950 overflow-hidden">
      
      {/* Background Glowing Orbs for Aesthetic Vibe */}
      <div className="absolute top-1/4 left-1/4 h-72 w-72 /rounded-full bg-blue-600/20 /blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 h-72 w-72 /rounded-full bg-indigo-600/20 /blur-[100px] pointer-events-none"></div>

      {/* Glassmorphism Login Card */}
      <div className="relative z-10 w-full max-w-md rounded-2xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-xl sm:p-10">
        
        <div className="text-center">
          <h2 className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-3xl font-bold tracking-tight text-transparent sm:text-4xl">
            Welcome Back
          </h2>
          <p className="mt-2 text-sm text-gray-400">
            Please enter your details to Register Yourself.
          </p>
        </div>

        <form onSubmit={handleSubmit} method="POST" className="mt-8 space-y-6">
          {/* name */}
          <div className="">
            <div className="grid grid-cols-2 gap-4">
            <div className="mt-2 ">
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 ">
              Name
            </label>
              <input
                id="name"
                type="name"
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
                required
                className=" mt-2 block w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-gray-500 transition-all duration-300 focus:border-indigo-500 focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              />
            </div>
            <div className="mt-2 ">
              <label htmlFor="email" className="block text-sm font-medium text-gray-300">
              UserName
              </label>
              <input
                id="username"
                type="username"
                name="username"
                placeholder="UserName"
                value={formData.username}
                onChange={handleChange}
                required
                className=" mt-2 block w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-gray-500 transition-all duration-300 focus:border-indigo-500 focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              />
            </div>
            </div>

            <div>
            <label htmlFor="email" className="mt-4 block text-sm font-medium text-gray-300">
              Contact
            </label>
            <div className="mt-2">
              <input
                id="contact"
                type="contact"
                name="contact"
                placeholder="99********"
                value={formData.contact}
                onChange={handleChange}
                required
                className="block w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-gray-500 transition-all duration-300 focus:border-indigo-500 focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              />
            </div>
          </div>
          </div>

          {/* Email Input */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300">
              Email
            </label>
            <div className="mt-2">
              <input
                id="email"
                type="email"
                name="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                required
                className="block w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-gray-500 transition-all duration-300 focus:border-indigo-500 focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              />
            </div>
          </div>

          {/* Password Input */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300">
              Password
            </label>
            <div className="mt-2">
              <input
                id="password"
                type="password"
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
                className="block w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-gray-500 transition-all duration-300 focus:border-indigo-500 focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="mt-6 flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-3.5 text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-indigo-500/30 active:scale-95 disabled:pointer-events-none disabled:opacity-70"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                {/* Simple loading spinner */}
                <svg className="h-4 w-4 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Logging In...
              </span>
            ) : (
              "Register"
            )}
          </button>
          </form>
      </div>
    </div>
  );
}

export default Register;