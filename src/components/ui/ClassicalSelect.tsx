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
            className="font-['Cinzel'] font-bold text-xs tracking-[0.15em] text-[#C9A962] uppercase"
          >
            {label}
          </label>
        )}
        <select
          id={selectId}
          ref={ref}
          className={`w-full bg-[#251E19] text-[#E8DFD4] font-['Crimson_Pro'] text-base border ${
            error ? 'border-[#8B2635]' : 'border-[#4A3F35]'
          } rounded-[4px] px-3.5 py-2.5 min-h-[46px] transition-colors focus:border-[#C9A962] focus:ring-2 focus:ring-[#C9A962]/30 focus:outline-none cursor-pointer ${className}`}
          {...props}
        >
          {options.map((opt) => {
            const val = typeof opt === 'string' ? opt : opt.value;
            const lbl = typeof opt === 'string' ? opt : opt.label;
            return (
              <option key={val} value={val} className="bg-[#251E19] text-[#E8DFD4]">
                {lbl}
              </option>
            );
          })}
        </select>
        {error ? (
          <p className="text-xs text-[#fca5a5] font-['Crimson_Pro'] italic">⚠️ {error}</p>
        ) : helperText ? (
          <p className="text-xs text-[#9C8B7A] font-['Crimson_Pro'] italic">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

ClassicalSelect.displayName = 'ClassicalSelect';
export const SketchSelect = ClassicalSelect;
