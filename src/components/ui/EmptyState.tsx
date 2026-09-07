import React from 'react';
import { SearchX, RotateCcw } from 'lucide-react';
import { ClassicalCard } from './ClassicalCard';
import { ClassicalButton } from './ClassicalButton';
import { CornerFlourish } from './CornerFlourish';

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
      className={`text-center py-12 px-6 flex flex-col items-center justify-center max-w-xl mx-auto relative ${className}`}
    >
      <CornerFlourish size="sm" color="#C9A962" />
      <div className="w-14 h-14 mb-4 flex items-center justify-center border border-[#C9A962]/40 rounded-full bg-[#1C1714] text-[#C9A962]">
        {icon || <SearchX className="w-6 h-6" strokeWidth={1.5} />}
      </div>
      <h3 className="text-xl sm:text-2xl font-bold font-['Cormorant_Garamond'] text-[#E8DFD4] mb-1.5 tracking-tight">
        {title}
      </h3>
      <p className="text-sm text-[#9C8B7A] font-['Crimson_Pro'] italic max-w-md mb-6 leading-relaxed">
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

