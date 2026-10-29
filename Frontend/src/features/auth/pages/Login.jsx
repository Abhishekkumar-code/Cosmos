import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock, Bot, Sparkles, Terminal, ShieldCheck, ArrowRight, AlertCircle } from "lucide-react";
import useAuth from "../hooks/useAuth.js";
import AuthInput from "../components/AuthInput.jsx";
import AuthButton from "../components/AuthButton.jsx";
import { getUserHomePath } from "../auth.utils.js";

export const Login = () => {
  const navigate = useNavigate();
  const { handleLogin, loading, error, clearError } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [validationErrors, setValidationErrors] = useState({});

  const validate = () => {
    const errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.email.trim()) {
      errors.email = "Email address is required";
    } else if (!emailRegex.test(formData.email.trim())) {
      errors.email = "Please enter a valid email address";
    }

    if (!formData.password) {
      errors.password = "Password is required";
    } else if (formData.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (validationErrors[name]) {
      setValidationErrors((prev) => {
        const updated = { ...prev };
        delete updated[name];
        return updated;
      });
    }
    if (error) clearError();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const res = await handleLogin({
      email: formData.email.trim(),
      password: formData.password,
    });

    if (res?.success) {
      navigate(getUserHomePath(res.user), { replace: true });
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-[#05060F] text-slate-100 flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-hidden select-none">
      {/* Animated ambient cosmic glow orbs */}
      <motion.div
        animate={{
          scale: [1, 1.18, 1],
          opacity: [0.25, 0.4, 0.25],
          x: [0, 25, 0],
          y: [0, -25, 0],
        }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-24 -left-24 w-[420px] h-[420px] rounded-full bg-gradient-to-tr from-violet-600/35 via-fuchsia-600/25 to-transparent blur-3xl pointer-events-none"
      />
      <motion.div
        animate={{
          scale: [1.15, 1, 1.15],
          opacity: [0.2, 0.35, 0.2],
          x: [0, -35, 0],
          y: [0, 30, 0],
        }}
        transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -bottom-28 -right-28 w-[420px] h-[420px] rounded-full bg-gradient-to-bl from-purple-700/30 via-pink-600/20 to-transparent blur-3xl pointer-events-none"
      />
      <div className="absolute top-1/2 left-1/3 -translate-y-1/2 w-80 h-80 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />

      {/* Cyber Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:36px_36px] pointer-events-none" />

      {/* Main Glass Card Container */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative z-10 w-full max-w-4xl bg-[#0B0D1B]/85 backdrop-blur-2xl border border-purple-500/20 rounded-2xl shadow-2xl shadow-purple-950/40 overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[580px]"
      >
        {/* Left Form Section */}
        <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between">
          <div>
            {/* Header / Brand */}
            <div className="flex items-center justify-between pb-6">
              <Link to="/" className="flex items-center gap-2.5 group">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-violet-600 via-purple-500 to-fuchsia-500 p-[1.5px] shadow-lg shadow-purple-500/25">
                  <div className="w-full h-full bg-[#0A0D1B] rounded-[10px] flex items-center justify-center group-hover:bg-transparent transition-colors duration-200">
                    <Bot className="w-4 h-4 text-fuchsia-400 group-hover:text-white" />
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold tracking-tight text-white text-lg bg-gradient-to-r from-white via-slate-100 to-purple-200 bg-clip-text text-transparent">
                    Cosmos
                  </span>
                  <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-purple-500/15 text-purple-300 border border-purple-500/30">
                    Platform
                  </span>
                </div>
              </Link>

              <div className="flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-mono text-[11px]">System Online</span>
              </div>
            </div>

            <div className="space-y-1 mb-6">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                <span>Welcome to Cosmos</span>
                <Sparkles className="w-4 h-4 text-fuchsia-400" />
              </h1>
              <p className="text-xs sm:text-sm text-slate-400">
                Authenticate to access your autonomous AI developer agents.
              </p>
            </div>

            {/* Error Banner */}
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="mb-5 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-2.5 text-xs text-rose-300"
              >
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <div className="flex-1 font-medium leading-relaxed">{error}</div>
              </motion.div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              <AuthInput
                id="login-email"
                name="email"
                label="Work Email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="developer@company.com"
                icon={Mail}
                error={validationErrors.email}
                required
                autoComplete="email"
                disabled={loading}
              />

              <AuthInput
                id="login-password"
                name="password"
                label="Password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••••••"
                icon={Lock}
                error={validationErrors.password}
                required
                autoComplete="current-password"
                disabled={loading}
                extraRight={
                  <span className="text-[11px] text-slate-400 hover:text-purple-400 transition-colors cursor-pointer">
                    Forgot key?
                  </span>
                }
              />

              <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    className="w-3.5 h-3.5 rounded bg-slate-900 border-white/20 text-purple-600 focus:ring-0 focus:ring-offset-0 cursor-pointer"
                  />
                  <span>Keep session alive</span>
                </label>
                <span className="font-mono text-[11px] text-slate-500 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-purple-400" /> End-to-end Encrypted
                </span>
              </div>

              <div className="pt-2">
                <AuthButton type="submit" loading={loading} className="w-full">
                  <span>Sign In to Cosmos</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </AuthButton>
              </div>
            </form>
          </div>

          {/* Footer */}
          <div className="pt-6 mt-4 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-2">
            <span>Don't have a Cosmos account?</span>
            <Link
              to="/register"
              className="text-purple-400 hover:text-fuchsia-300 font-medium flex items-center gap-1 group transition-colors"
            >
              <span>Create Account</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Right Side Panel: Tech Visual & Animated Code Snippet (Google Stitch Inspired) */}
        <div className="hidden lg:flex lg:col-span-5 relative bg-gradient-to-br from-[#090C1A] to-[#12162E] border-l border-purple-500/15 p-6 flex-col justify-between overflow-hidden">
          {/* Tech Image with fallback & overlay */}
          <div className="absolute inset-0 z-0">
            <img
              src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80"
              alt="Cosmos Neural Agent Visual"
              loading="lazy"
              className="w-full h-full object-cover opacity-25 mix-blend-luminosity filter contrast-125"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0B0D1B] via-[#0B0D1B]/80 to-transparent" />
          </div>

          {/* Decorative Floating Badges */}
          <div className="relative z-10 space-y-4">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-md text-[11px] font-mono bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center gap-1.5">
                <Terminal className="w-3 h-3 text-fuchsia-400" /> cosmos.dispatch()
              </span>
              <span className="px-2 py-0.5 rounded-md text-[11px] font-mono bg-white/5 text-slate-400 border border-white/10">
                latency: 14ms
              </span>
            </div>

            {/* Glass Code Snippet Box */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="rounded-xl bg-[#060814]/90 border border-purple-500/20 p-4 shadow-xl backdrop-blur-md font-mono text-[11px] leading-relaxed text-slate-300"
            >
              <div className="flex items-center justify-between pb-3 mb-2 border-b border-white/10 text-slate-400">
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-rose-500/70" />
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500/70" />
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/70" />
                </div>
                <span className="text-[10px] text-purple-300">cosmos.agents.ts</span>
              </div>
              <div className="space-y-1 text-[11px]">
                <p className="text-slate-500">// Initialize autonomous developer squad</p>
                <p>
                  <span className="text-purple-400">const</span>{" "}
                  <span className="text-cyan-300">squad</span> ={" "}
                  <span className="text-purple-400">await</span>{" "}
                  <span className="text-fuchsia-400">Cosmos</span>.
                  <span className="text-emerald-400">deploy</span>({`{`}
                </p>
                <p className="pl-3">
                  <span className="text-slate-400">architect:</span>{" "}
                  <span className="text-emerald-300">"Gemini-2.5-Pro"</span>,
                </p>
                <p className="pl-3">
                  <span className="text-slate-400">coder:</span>{" "}
                  <span className="text-emerald-300">"Claude-3.7-Sonnet"</span>,
                </p>
                <p className="pl-3">
                  <span className="text-slate-400">verifier:</span>{" "}
                  <span className="text-emerald-300">"DeepSeek-R1"</span>
                </p>
                <p>{`}`});</p>
                <p className="text-fuchsia-400 pt-1">
                  &gt; Autonomous fleet ready (100% test pass)
                </p>
              </div>
            </motion.div>
          </div>

          {/* Bottom Card feature callout */}
          <div className="relative z-10 pt-4">
            <div className="p-3.5 rounded-xl bg-purple-500/10 border border-purple-500/20 backdrop-blur-sm">
              <p className="text-xs font-semibold text-white mb-0.5">
                Self-Healing Code Pipelines
              </p>
              <p className="text-[11px] text-slate-400 leading-normal">
                Multi-agent reviews, automated regression checks, and instant PR reviews.
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
