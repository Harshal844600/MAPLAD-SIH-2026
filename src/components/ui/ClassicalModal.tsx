import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { CornerFlourish } from './CornerFlourish';

export interface ClassicalModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '4xl';
  actions?: React.ReactNode;
}

export const ClassicalModal: React.FC<ClassicalModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  maxWidth = 'lg',
  actions,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const maxWidthClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-3xl',
    '2xl': 'max-w-5xl',
    '4xl': 'max-w-6xl',
  }[maxWidth];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1C1714]/85 backdrop-blur-sm animate-in fade-in duration-300 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className={`relative w-full ${maxWidthClasses} bg-[#251E19] border border-[#C9A962]/40 rounded-[4px] p-6 md:p-8 shadow-2xl my-8 transition-transform`}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <CornerFlourish size="lg" color="#C9A962" />

        {/* Modal Header */}
        <div className="flex items-start justify-between pb-4 mb-4 border-b border-[#4A3F35]">
          <div>
            <span className="text-[10px] font-['Cinzel'] font-bold tracking-[0.25em] text-[#C9A962] uppercase block mb-1">
              ARCHIVAL RECORD
            </span>
            <h3 id="modal-title" className="text-2xl sm:text-3xl font-bold font-['Cormorant_Garamond'] text-[#E8DFD4]">
              {title}
            </h3>
            {subtitle && (
              <p className="text-sm text-[#9C8B7A] font-['Crimson_Pro'] italic mt-0.5">{subtitle}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#9C8B7A] hover:text-[#E8DFD4] hover:border-[#C9A962] border border-[#4A3F35] rounded-[4px] transition-colors"
            title="Close dialog"
            aria-label="Close dialog"
          >
            <X className="w-4 h-4" strokeWidth={1.5} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="max-h-[70vh] overflow-y-auto pr-2 text-[#E8DFD4] font-['Crimson_Pro']">
          {children}
        </div>

        {/* Modal Actions */}
        {actions && (
          <div className="mt-6 pt-4 border-t border-[#4A3F35] flex items-center justify-end gap-3">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
};

export const SketchModal = ClassicalModal;
