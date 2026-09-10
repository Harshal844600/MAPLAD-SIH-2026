import React from 'react';

export interface ClassicalSelectOption {
  value: string;
  label: string;
}

export interface ClassicalSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: (ClassicalSelectOption | string)[];
  error?: string;
  helperText?: string;
}

export const ClassicalSelect = React.forwardRef<HTMLSelectElement, ClassicalSelectProps>(
  ({ label, options, error, helperText, className = '', id, ...props }, ref) => {
    const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={selectId}
            className="font-['Inter'] font-semibold text-xs tracking-wider text-[#c9b8a0] light:text-[#8C735D] uppercase"
          >
            {label}
          </label>
        )}
        <select
          id={selectId}
          ref={ref}
          className={`w-full bg-white/[0.04] light:bg-white text-white light:text-slate-900 font-['Inter'] text-sm border ${
            error ? 'border-rose-500/60 bg-rose-950/20 light:bg-rose-50 light:border-rose-300' : 'border-white/10 light:border-slate-300'
          } rounded-xl px-3.5 py-2.5 min-h-[44px] transition-all focus:border-[#a78b71] light:focus:border-[#8C735D] focus:ring-2 focus:ring-[#a78b71]/30 light:focus:ring-[#8C735D]/20 focus:outline-none cursor-pointer shadow-xs ${className}`}
          {...props}
        >
          {options.map((opt) => {
            const val = typeof opt === 'string' ? opt : opt.value;
            const lbl = typeof opt === 'string' ? opt : opt.label;
            return (
              <option key={val} value={val} className="bg-[#121212] light:bg-white text-white light:text-slate-900">
                {lbl}
              </option>
            );
          })}
        </select>
        {error ? (
          <p className="text-xs text-rose-400 light:text-rose-600 font-['Inter']">⚠️ {error}</p>
        ) : helperText ? (
          <p className="text-xs text-gray-400 light:text-slate-500 font-['Inter']">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

ClassicalSelect.displayName = 'ClassicalSelect';
export const SketchSelect = ClassicalSelect;
export const GlassSelect = ClassicalSelect;
