import React from 'react';

export interface ClassicalInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  icon?: React.ReactNode;
}

export const ClassicalInput = React.forwardRef<HTMLInputElement, ClassicalInputProps>(
  ({ label, error, helperText, icon, className = '', id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="font-['Inter'] font-semibold text-xs tracking-wider text-[#c9b8a0] uppercase flex items-center justify-between"
          >
            <span>{label}</span>
            {props.required && <span className="text-rose-400 text-[10px] font-normal tracking-normal">* Required</span>}
          </label>
        )}
        <div className="relative flex items-center">
          {icon && <span className="absolute left-3.5 text-gray-400 pointer-events-none">{icon}</span>}
          <input
            id={inputId}
            ref={ref}
            className={`w-full bg-white/[0.04] text-white font-['Inter'] text-sm border ${
              error ? 'border-rose-500/60 bg-rose-950/20' : 'border-white/10'
            } rounded-xl px-4 py-2.5 min-h-[44px] transition-all focus:border-[#a78b71] focus:ring-2 focus:ring-[#a78b71]/30 focus:outline-none placeholder:text-gray-500 ${
              icon ? 'pl-10' : ''
            } ${className}`}
            {...props}
          />
        </div>
        {error ? (
          <p className="text-xs text-rose-400 font-['Inter'] flex items-center gap-1">
            <span>⚠️</span> {error}
          </p>
        ) : helperText ? (
          <p className="text-xs text-gray-400 font-['Inter']">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

ClassicalInput.displayName = 'ClassicalInput';
export const SketchInput = ClassicalInput;
export const GlassInput = ClassicalInput;
