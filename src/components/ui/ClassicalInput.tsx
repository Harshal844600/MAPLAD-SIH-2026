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
            className="font-['Cinzel'] font-bold text-xs tracking-[0.15em] text-[#C9A962] uppercase flex items-center justify-between"
          >
            <span>{label}</span>
            {props.required && <span className="text-[#fca5a5] text-[10px] font-normal">* Required</span>}
          </label>
        )}
        <div className="relative flex items-center">
          {icon && <span className="absolute left-3.5 text-[#9C8B7A] pointer-events-none">{icon}</span>}
          <input
            id={inputId}
            ref={ref}
            className={`w-full bg-[#251E19] text-[#E8DFD4] font-['Crimson_Pro'] text-base border ${
              error ? 'border-[#8B2635] bg-[#8B2635]/10' : 'border-[#4A3F35]'
            } rounded-[4px] px-4 py-2.5 min-h-[46px] transition-colors focus:border-[#C9A962] focus:ring-2 focus:ring-[#C9A962]/30 focus:ring-offset-2 focus:ring-offset-[#1C1714] focus:outline-none placeholder:text-[#9C8B7A] placeholder:italic ${
              icon ? 'pl-10' : ''
            } ${className}`}
            {...props}
          />
        </div>
        {error ? (
          <p className="text-xs text-[#fca5a5] font-['Crimson_Pro'] italic flex items-center gap-1">
            <span>⚠️</span> {error}
          </p>
        ) : helperText ? (
          <p className="text-xs text-[#9C8B7A] font-['Crimson_Pro'] italic">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

ClassicalInput.displayName = 'ClassicalInput';
export const SketchInput = ClassicalInput;
