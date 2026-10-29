import React from "react";

export const PasswordStrengthMeter = ({ strength }) => {
  const { score = 0, label = "Weak", text = "text-slate-400" } = strength || {};

  return (
    <div className="w-full space-y-1.5 pt-1">
      <div className="flex items-center justify-between text-[11px]">
        <span className="text-slate-400">Password strength:</span>
        <span className={`font-semibold tracking-wide ${text}`}>{label}</span>
      </div>

      <div className="grid grid-cols-4 gap-1.5 h-1.5 w-full">
        {[1, 2, 3, 4].map((step) => {
          const isActive = score >= step;
          let segmentColor = "bg-white/10";

          if (isActive) {
            if (score === 1) segmentColor = "bg-dev-rose shadow-sm shadow-dev-rose/50";
            else if (score === 2) segmentColor = "bg-amber-400 shadow-sm shadow-amber-400/50";
            else if (score === 3) segmentColor = "bg-dev-cyan shadow-sm shadow-dev-cyan/50";
            else segmentColor = "bg-dev-emerald shadow-sm shadow-dev-emerald/50";
          }

          return (
            <div
              key={step}
              className={`h-full rounded-full transition-all duration-300 ${segmentColor}`}
            />
          );
        })}
      </div>
    </div>
  );
};

export default PasswordStrengthMeter;
