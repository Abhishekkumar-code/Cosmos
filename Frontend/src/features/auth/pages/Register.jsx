import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Mail,
  Lock,
  Bot,
  Sparkles,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
  MailCheck,
  Cpu,
  Layers,
  AlertCircle,
} from "lucide-react";
import useAuth from "../hooks/useAuth.js";
import AuthInput from "../components/AuthInput.jsx";
import AuthButton from "../components/AuthButton.jsx";
import PasswordStrengthMeter from "../components/PasswordStrengthMeter.jsx";

export const Register = () => {
  const { handleRegister, loading, error, success, clearError } = useAuth();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    isAdmin: false,
  });
  const [validationErrors, setValidationErrors] = useState({});
  const [submittedEmail, setSubmittedEmail] = useState("");

  const passwordStrength = useMemo(() => {
    const pwd = formData.password || "";
    if (!pwd) return { score: 0, label: "Empty", color: "bg-slate-700" };

    let score = 0;
    if (pwd.length >= 6) score += 1;
    if (pwd.length >= 10) score += 1;
    if (/[A-Z]/.test(pwd) && /[a-z]/.test(pwd)) score += 1;
    if (/[0-9]/.test(pwd) || /[^A-Za-z0-9]/.test(pwd)) score += 1;

    switch (score) {
      case 1:
        return { score: 1, label: "Weak", color: "bg-rose-500", text: "text-rose-400" };
      case 2:
        return { score: 2, label: "Fair", color: "bg-amber-500", text: "text-amber-400" };
      case 3:
        return { score: 3, label: "Good", color: "bg-cyan-500", text: "text-cyan-400" };
      case 4:
        return { score: 4, label: "Strong", color: "bg-emerald-500", text: "text-emerald-400" };
      default:
        return { score: 0, label: "Weak", color: "bg-rose-500", text: "text-rose-400" };
    }
  }, [formData.password]);

  const validate = () => {
    const errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const usernameRegex = /^[a-zA-Z0-9_]+$/;

    if (!formData.username.trim()) {
      errors.username = "Username is required";
    } else if (formData.username.trim().length < 3) {
      errors.username = "Username must be at least 3 characters";
    } else if (!usernameRegex.test(formData.username.trim())) {
      errors.username = "Letters, numbers, and underscores only";
    }

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
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

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

    setSubmittedEmail(formData.email.trim());
    await handleRegister({
      username: formData.username.trim(),
      email: formData.email.trim(),
      password: formData.password,
      isAdmin: Boolean(formData.isAdmin),
    });
  };

  const handleReset = () => {
    setFormData({
      username: "",
      email: "",
      password: "",
      isAdmin: false,
    });
    setValidationErrors({});
    clearError();
  };

  return (
    <div className="relative min-h-screen w-full bg-[#06080F] text-slate-100 flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-hidden select-none">
      {/* Ambient background glow orbs */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.15, 0.3, 0.15],
          x: [0, -30, 0],
          y: [0, 20, 0],
        }}
        transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-gradient-to-bl from-cyan-600/30 via-indigo-500/20 to-transparent blur-3xl pointer-events-none"
      />
      <motion.div
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.2, 0.35, 0.2],
          x: [0, 40, 0],
          y: [0, -30, 0],
        }}
        transition={{ duration: 13, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-gradient-to-tr from-indigo-600/30 via-purple-500/20 to-transparent blur-3xl pointer-events-none"
      />

      {/* Cyber Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:36px_36px] pointer-events-none" />

      {/* Main Split-Screen Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative z-10 w-full max-w-5xl bg-[#0D111C]/85 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl shadow-black/80 overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[640px]"
      >
        {/* Left Side: Cosmos Agent Showcase (Split Screen Layout) */}
        <div className="hidden lg:flex lg:col-span-5 relative bg-gradient-to-br from-[#0B0F19] to-[#121829] border-r border-white/10 p-7 flex-col justify-between overflow-hidden">
          {/* Tech Image with gradient fallback */}
          <div className="absolute inset-0 z-0">
            <img
              src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1200&q=80"
              alt="Cosmos AI Agent Infrastructure"
              loading="lazy"
              className="w-full h-full object-cover opacity-20 mix-blend-luminosity filter contrast-125"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[#0D111C]/80 via-[#0D111C]/90 to-[#0D111C]" />
          </div>

          <div className="relative z-10 space-y-6">
            {/* Brand Logo */}
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-400 to-indigo-500 p-[1px] shadow-md shadow-cyan-500/20">
                <div className="w-full h-full bg-[#0D111C] rounded-[7px] flex items-center justify-center">
                  <Bot className="w-4 h-4 text-cyan-400" />
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold tracking-tight text-white text-base">Cosmos</span>
                <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  Platform
                </span>
              </div>
            </Link>

            <div className="space-y-2">
              <h2 className="text-xl font-bold tracking-tight text-white leading-snug">
                Architect. Code. Review. Automatically.
              </h2>
              <p className="text-xs text-slate-400 leading-relaxed">
                Connect specialized LLM sub-agents that collaborate on your Git repositories in real-time.
              </p>
            </div>

            {/* Agent Stack Badges */}
            <div className="space-y-2 pt-2">
              <div className="p-3 rounded-lg bg-white/5 border border-white/10 backdrop-blur-sm flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-md bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                    <Cpu className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-white">Full-Stack Synthesis</p>
                    <p className="text-[10px] text-slate-400">Autonomous code gen & tests</p>
                  </div>
                </div>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">
                  v3.8
                </span>
              </div>

              <div className="p-3 rounded-lg bg-white/5 border border-white/10 backdrop-blur-sm flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-md bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                    <Layers className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-white">Multi-Agent Consensus</p>
                    <p className="text-[10px] text-slate-400">Pair programming swarm</p>
                  </div>
                </div>
                <span className="text-[10px] font-mono text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-2 py-0.5 rounded">
                  Active
                </span>
              </div>
            </div>
          </div>

          {/* Bottom Security Assurance */}
          <div className="relative z-10 pt-6">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>SOC2 Compliant & Sandboxed Execution</span>
            </div>
          </div>
        </div>

        {/* Right Side: Registration Form or Animated Success State */}
        <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between">
          <AnimatePresence mode="wait">
            {!success ? (
              <motion.div
                key="register-form"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                {/* Header */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                      <span>Create Account</span>
                      <Sparkles className="w-4 h-4 text-indigo-400" />
                    </h1>
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-white/5 text-slate-400 border border-white/10">
                      Step 1 of 2
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-400">
                    Join Cosmos and deploy autonomous AI developer fleets.
                  </p>
                </div>

                {/* API Error Banner */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 flex items-start gap-2.5 text-xs text-rose-300"
                  >
                    <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                    <div className="flex-1 font-medium leading-relaxed">{error}</div>
                  </motion.div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-3.5" noValidate>
                  <AuthInput
                    id="register-username"
                    name="username"
                    label="Username / Handle"
                    type="text"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="alex_dev"
                    icon={User}
                    error={validationErrors.username}
                    required
                    autoComplete="username"
                    disabled={loading}
                  />

                  <AuthInput
                    id="register-email"
                    name="email"
                    label="Work Email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="alex@company.com"
                    icon={Mail}
                    error={validationErrors.email}
                    required
                    autoComplete="email"
                    disabled={loading}
                  />

                  <div className="space-y-1">
                    <AuthInput
                      id="register-password"
                      name="password"
                      label="Password"
                      type="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Min 6 characters"
                      icon={Lock}
                      error={validationErrors.password}
                      required
                      autoComplete="new-password"
                      disabled={loading}
                    />

                    {formData.password && (
                      <PasswordStrengthMeter strength={passwordStrength} />
                    )}
                  </div>

                  {/* Role / Admin Toggle */}
                  <div className="p-3 rounded-lg bg-[#0B0F19]/60 border border-white/10 flex items-center justify-between text-xs">
                    <div>
                      <p className="font-medium text-slate-200">Account Privilege</p>
                      <p className="text-[11px] text-slate-400">
                        {formData.isAdmin ? "Admin (Organization management)" : "Developer (Agent terminal access)"}
                      </p>
                    </div>

                    <label className="relative inline-flex items-center cursor-pointer select-none">
                      <input
                        type="checkbox"
                        name="isAdmin"
                        checked={formData.isAdmin}
                        onChange={handleChange}
                        disabled={loading}
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
                      <span className="ml-2 text-xs font-mono text-slate-300">
                        {formData.isAdmin ? "Admin" : "Dev"}
                      </span>
                    </label>
                  </div>

                  <div className="pt-2">
                    <AuthButton type="submit" loading={loading} className="w-full">
                      <span>Deploy Cosmos Identity</span>
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </AuthButton>
                  </div>
                </form>

                {/* Footer link */}
                <div className="pt-4 border-t border-white/5 flex items-center justify-between text-xs text-slate-400">
                  <span>Already an operative?</span>
                  <Link
                    to="/login"
                    className="text-cyan-400 hover:text-cyan-300 font-medium flex items-center gap-1 group"
                  >
                    <span>Sign In</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </div>
              </motion.div>
            ) : (
              /* Animated Success State */
              <motion.div
                key="register-success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="py-8 px-4 flex flex-col items-center text-center space-y-5 my-auto"
              >
                {/* Glowing Success Badge */}
                <div className="relative">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-500/20 via-cyan-500/20 to-indigo-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-xl shadow-emerald-500/10">
                    <MailCheck className="w-8 h-8 animate-bounce" />
                  </div>
                  <span className="absolute -top-1 -right-1 flex h-4 w-4">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 text-[9px] text-black font-bold items-center justify-center">
                      ✓
                    </span>
                  </span>
                </div>

                <div className="space-y-1.5 max-w-sm">
                  <h2 className="text-xl font-bold tracking-tight text-white">
                    Verification Code Dispatched
                  </h2>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    We've sent an email verification link and code to{" "}
                    <span className="font-mono text-cyan-400 font-semibold">
                      {submittedEmail || formData.email}
                    </span>
                    .
                  </p>
                </div>

                {/* Info Card */}
                <div className="w-full max-w-md p-4 rounded-xl bg-[#070A12]/80 border border-white/10 text-left space-y-2 font-mono text-[11px] text-slate-300">
                  <div className="flex items-center justify-between text-slate-400 border-b border-white/10 pb-2">
                    <span className="flex items-center gap-1.5 text-emerald-400">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Identity Registered
                    </span>
                    <span>Role: {formData.isAdmin ? "Admin" : "Developer"}</span>
                  </div>
                  <p className="text-slate-400 text-[11px]">
                    1. Check your email inbox or spam folder.<br />
                    2. Click the verification link or enter your code.<br />
                    3. Return to log in with your verified credentials.
                  </p>
                </div>

                {/* Actions */}
                <div className="w-full max-w-md space-y-2.5 pt-2">
                  <Link to="/login" className="block w-full">
                    <AuthButton type="button" className="w-full">
                      <span>Proceed to Sign In Terminal</span>
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </AuthButton>
                  </Link>

                  <button
                    type="button"
                    onClick={handleReset}
                    className="text-xs text-slate-400 hover:text-white transition-colors"
                  >
                    Need to register another account?
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
