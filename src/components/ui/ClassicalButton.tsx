import React from 'react';

export interface ClassicalButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'ghost' | 'stamp';
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
      'inline-flex items-center justify-center font-["Cinzel"] font-bold uppercase tracking-[0.15em] transition-all duration-300 select-none rounded-[4px] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A962] focus-visible:ring-offset-2 focus-visible:ring-offset-[#1C1714] disabled:opacity-50 disabled:cursor-not-allowed';

    const variantClasses = {
      primary:
        'bg-brass-gradient text-[#1C1714] hover:brightness-110 shadow-sm hover:shadow-brass-glow active:brightness-95',
      secondary:
        'bg-transparent border border-[#C9A962] text-[#C9A962] hover:bg-[#8B2635] hover:border-[#8B2635] hover:text-[#E8DFD4] shadow-sm hover:shadow-crimson-glow',
      danger:
        'bg-[#8B2635] border border-[#8B2635] text-[#E8DFD4] hover:bg-[#A32D3F] hover:shadow-crimson-glow',
      success:
        'bg-[#2e7d32] border border-[#2e7d32] text-[#E8DFD4] hover:bg-[#388e3c]',
      ghost:
        'bg-transparent border border-transparent text-[#C9A962] hover:text-[#D4B872] hover:underline underline-offset-4',
      stamp:
        'bg-[#251E19] border border-[#C9A962]/40 text-[#C9A962] hover:border-[#C9A962]',
    }[variant];

    const sizeClasses = {
      sm: 'text-xs px-4 py-2 min-h-[38px] gap-2',
      md: 'text-xs px-6 py-2.5 min-h-[44px] gap-2.5',
      lg: 'text-sm px-8 py-3.5 min-h-[52px] gap-3',
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
