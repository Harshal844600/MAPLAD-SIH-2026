import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

export interface ClassicalModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  tag?: string | React.ReactNode;
  headerBadge?: React.ReactNode;
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '4xl';
  actions?: React.ReactNode;
}

export const ClassicalModal: React.FC<ClassicalModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  tag,
  headerBadge,
  children,
  maxWidth = 'lg',
  actions,
}) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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

  if (!isOpen || !mounted) return null;

  const maxWidthClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-3xl',
    '2xl': 'max-w-5xl',
    '4xl': 'max-w-6xl',
  }[maxWidth];

  const modalContent = (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-5 md:p-6 bg-black/70 light:bg-slate-900/40 backdrop-blur-md light:backdrop-blur-sm animate-in fade-in duration-200 overflow-hidden"
      onClick={onClose}
    >
      <div
        className={`relative w-full ${maxWidthClasses} max-h-[92vh] flex flex-col bg-[#121212] light:bg-white backdrop-blur-xl border border-white/10 light:border-slate-200 rounded-[24px] sm:rounded-[28px] shadow-[0_25px_60px_rgba(0,0,0,0.8),0_0_40px_rgba(167,139,113,0.15)] light:shadow-[0_20px_50px_rgba(15,23,42,0.12)] overflow-hidden transition-all scale-100 animate-in zoom-in-95 duration-200`}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        {/* Subtle Ambient Gold Corner Accents */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#a78b71]/15 light:from-amber-200/20 to-transparent rounded-tr-[28px] pointer-events-none" />

        {/* Modal Header (Pinned) */}
        <div className="shrink-0 p-5 sm:p-6 pb-4 sm:pb-5 border-b border-white/10 light:border-slate-200 flex items-start justify-between relative z-10">
          <div className="space-y-1.5 min-w-0 pr-4">
            <div className="flex flex-wrap items-center gap-2">
              {tag !== undefined ? (
                typeof tag === 'string' && tag ? (
                  <span className="text-[10px] font-mono font-bold tracking-widest text-[#c9b8a0] light:text-[#8C735D] uppercase px-2.5 py-0.5 rounded-full bg-[#a78b71]/10 light:bg-[#8C735D]/10 border border-[#a78b71]/20 light:border-[#8C735D]/30">
                    {tag}
                  </span>
                ) : (
                  tag
                )
              ) : (
                <span className="text-[10px] font-mono font-bold tracking-widest text-[#c9b8a0] light:text-[#8C735D] uppercase px-2.5 py-0.5 rounded-full bg-[#a78b71]/10 light:bg-[#8C735D]/10 border border-[#a78b71]/20 light:border-[#8C735D]/30">
                  INTELLIGENCE DOSSIER
                </span>
              )}
              {headerBadge}
            </div>
            <h3 id="modal-title" className="text-xl sm:text-2xl font-bold font-['Playfair_Display'] text-white light:text-slate-900 tracking-tight">
              {title}
            </h3>
            {subtitle && (
              <div className="text-xs sm:text-sm text-gray-400 light:text-slate-600 font-['Inter'] leading-relaxed">{subtitle}</div>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 light:text-slate-500 hover:text-white light:hover:text-slate-900 hover:bg-white/10 light:hover:bg-slate-100 border border-white/10 light:border-slate-200 rounded-full transition-all cursor-pointer shrink-0"
            title="Close dialog"
            aria-label="Close dialog"
          >
            <X className="w-4 h-4" strokeWidth={1.5} />
          </button>
        </div>

        {/* Modal Body (Scrollable with edge-to-edge padding) */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 text-gray-200 light:text-slate-800 font-['Inter'] leading-relaxed">
          {children}
        </div>

        {/* Modal Actions (Pinned Footer) */}
        {actions && (
          <div className="shrink-0 p-4 sm:p-6 pt-3 sm:pt-4 border-t border-white/10 light:border-slate-200 bg-black/20 light:bg-slate-50/60 flex items-center justify-end gap-3 relative z-10">
            {actions}
          </div>
        )}
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export const GlassModal = ClassicalModal;
export const SketchModal = ClassicalModal;
