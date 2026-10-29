import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export const AuthInput = ({
  id,
  name,
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  error,
  icon: Icon,
  autoComplete,
  required = false,
  disabled = false,
  extraRight,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  const inputType = isPassword ? (showPassword ? "text" : "password") : type;

  return (
    <div className="w-full space-y-1">
      <div className="flex items-center justify-between">
        <label
          htmlFor={id || name}
          className="block text-xs font-medium text-slate-300 tracking-wide select-none"
        >
          {label}
          {required && <span className="text-rose-400 ml-1">*</span>}
        </label>
        {extraRight}
      </div>

      <div className="relative group">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-purple-400 transition-colors duration-200">
            <Icon size={16} />
          </div>
        )}

        <input
          id={id || name}
          name={name}
          type={inputType}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          autoComplete={autoComplete}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${name}-error` : undefined}
          className={`w-full bg-[#0A0D1B]/85 text-white placeholder-slate-500 text-sm rounded-xl border transition-all duration-200 outline-none
            ${Icon ? "pl-9" : "pl-3.5"}
            ${isPassword ? "pr-10" : "pr-3.5"}
            py-2.5
            ${
              error
                ? "border-rose-500 focus:border-rose-500 focus:ring-1 focus:ring-rose-500/40"
                : "border-white/10 hover:border-white/20 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/25 focus:bg-[#0E1228]"
            }
            disabled:opacity-50 disabled:cursor-not-allowed`}
        />

        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            tabIndex={-1}
            aria-label={showPassword ? "Hide password" : "Show password"}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-white transition-colors focus:outline-none cursor-pointer"
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        )}
      </div>

      {error && (
        <p
          id={`${name}-error`}
          className="text-xs text-rose-400 font-medium mt-1 flex items-center gap-1 animate-fadeIn"
        >
          <span>●</span> {error}
        </p>
      )}
    </div>
  );
};

export default AuthInput;
