import React from "react";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

export const AuthButton = ({
  children,
  type = "submit",
  loading = false,
  disabled = false,
  onClick,
  className = "",
  variant = "primary",
}) => {
  const isPrimary = variant === "primary";

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      whileHover={disabled || loading ? {} : { scale: 1.015 }}
      whileTap={disabled || loading ? {} : { scale: 0.985 }}
      aria-busy={loading}
      className={`relative w-full py-2.5 px-4 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2 overflow-hidden select-none cursor-pointer
        ${
          isPrimary
            ? "bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 text-white shadow-lg shadow-purple-600/30 hover:shadow-purple-500/50 hover:from-violet-500 hover:via-purple-500 hover:to-fuchsia-500 border border-purple-400/30"
            : "bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 hover:border-white/20"
        }
        disabled:opacity-60 disabled:cursor-not-allowed disabled:pointer-events-none disabled:shadow-none
        ${className}`}
    >
      {/* Subtle shine highlight */}
      <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full hover:translate-x-full transition-transform duration-700 ease-in-out pointer-events-none" />

      {loading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin text-white" />
          <span>Processing...</span>
        </>
      ) : (
        children
      )}
    </motion.button>
  );
};

export default AuthButton;
