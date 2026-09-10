import React from 'react';

export interface ClassicalButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'ghost' | 'stamp' | 'white' | 'glass';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  icon?: React.ReactNode;
  isLoading?: boolean;
}

export const ClassicalButton = React.forwardRef<HTMLButtonElement, ClassicalButtonProps>(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      icon,
      isLoading = false,
      className = '',
      disabled,
      ...props
    },
    ref
  ) => {
    const baseClasses =
      'inline-flex items-center justify-center font-["Inter"] font-semibold tracking-wide transition-all duration-200 ease-in-out select-none rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-[#a78b71] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0a0a] light:focus-visible:ring-offset-white disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer';

    const variantClasses = {
      primary:
        'bg-gradient-to-r from-[#c9b8a0] via-[#a78b71] to-[#8c735d] text-[#0a0a0a] font-bold hover:brightness-110 shadow-[0_0_25px_rgba(167,139,113,0.3)] light:shadow-[0_2px_12px_rgba(140,115,93,0.35)] active:scale-[0.98]',
      white:
        'bg-white text-black font-bold hover:bg-gray-100 shadow-[0_0_20px_rgba(255,255,255,0.25)] active:scale-[0.98]',
      secondary:
        'bg-white/[0.04] light:bg-white backdrop-blur-md border border-white/15 light:border-slate-300 text-white light:text-slate-800 hover:border-[#a78b71]/60 light:hover:border-[#8C735D] hover:text-[#e8d5b7] light:hover:text-slate-950 hover:bg-white/[0.08] light:hover:bg-slate-50 light:shadow-xs active:scale-[0.98]',
      glass:
        'bg-white/[0.04] light:bg-white/80 backdrop-blur-md border border-white/10 light:border-slate-200 text-gray-200 light:text-slate-700 hover:border-[#a78b71]/50 light:hover:border-[#8C735D] hover:text-white light:hover:text-slate-900 hover:bg-white/[0.08] light:hover:bg-white active:scale-[0.98]',
      danger:
        'bg-rose-600 border border-rose-500/50 text-white hover:bg-rose-500 shadow-[0_0_20px_rgba(239,68,68,0.3)] active:scale-[0.98]',
      success:
        'bg-emerald-600 border border-emerald-500/50 text-white hover:bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.3)] active:scale-[0.98]',
      ghost:
        'bg-transparent text-gray-300 light:text-slate-600 hover:text-[#e8d5b7] light:hover:text-slate-950 hover:bg-white/5 light:hover:bg-slate-100 active:scale-[0.98]',
      stamp:
        'bg-white/[0.03] light:bg-amber-50/70 border border-[#a78b71]/30 light:border-amber-300 text-[#e8d5b7] light:text-amber-900 hover:border-[#a78b71] rounded-full',
    }[variant];

    const sizeClasses = {
      sm: 'text-xs px-4 py-1.5 min-h-[36px] gap-2',
      md: 'text-xs px-6 py-2.5 min-h-[42px] gap-2.5',
      lg: 'text-sm px-8 py-3.5 min-h-[48px] gap-3 tracking-wide',
      icon: 'p-2.5 min-h-[40px] min-w-[40px]',
    }[size];

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={`${baseClasses} ${variantClasses} ${sizeClasses} ${className}`}
        {...props}
      >
        {isLoading ? (
          <span className="inline-block animate-spin mr-2">⏳</span>
        ) : icon ? (
          <span className="inline-flex shrink-0">{icon}</span>
        ) : null}
        <span>{children}</span>
      </button>
    );
  }
);

ClassicalButton.displayName = 'ClassicalButton';

export const SketchButton = ClassicalButton;
export const GlassButton = ClassicalButton;
