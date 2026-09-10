import React from 'react';
import { SearchX, RotateCcw } from 'lucide-react';
import { ClassicalCard } from './ClassicalCard';
import { ClassicalButton } from './ClassicalButton';

export interface EmptyStateProps {
  title?: string;
  description?: string;
  actionLabel?: string;
  actionText?: string;
  onAction?: () => void | Promise<void>;
  icon?: React.ReactNode;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'NO RECORDS FOUND',
  description = 'The archive contains no matching records for the selected criteria.',
  actionLabel,
  actionText,
  onAction,
  icon,
  className = '',
}) => {
  const resolvedActionLabel = actionText || actionLabel || 'REVIEW FILTERS';

  return (
    <ClassicalCard
      variant="default"
      className={`text-center py-12 px-6 flex flex-col items-center justify-center max-w-xl mx-auto relative border-beam-card ${className}`}
    >
      <div className="w-14 h-14 mb-4 flex items-center justify-center border border-[#c9b8a0]/30 rounded-2xl bg-white/[0.03] light:bg-slate-100 text-[#c9b8a0]">
        {icon || <SearchX className="w-6 h-6" strokeWidth={1.5} />}
      </div>
      <h3 className="text-xl sm:text-2xl font-bold font-serif text-white light:text-slate-900 mb-1.5 tracking-tight">
        {title}
      </h3>
      <p className="text-xs text-zinc-400 light:text-slate-600 max-w-md mb-6 leading-relaxed font-sans">
        {description}
      </p>
      {onAction && (
        <ClassicalButton
          variant="secondary"
          size="sm"
          icon={<RotateCcw className="w-3.5 h-3.5" />}
          onClick={onAction}
        >
          {resolvedActionLabel}
        </ClassicalButton>
      )}
    </ClassicalCard>
  );
};
