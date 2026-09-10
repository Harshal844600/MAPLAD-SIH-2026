// ==============================================================================
// MPLAD SENTINEL — AUTHENTICATION & ACCESS CLEARANCE MODAL
// ==============================================================================

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Shield, X, CheckCircle2, Lock, AlertCircle } from 'lucide-react';
import { GoogleSignInButton } from './GoogleSignInButton';
import { useCurrentUser } from '../../services/store/useCurrentUser';
import { ROLE_DEFINITIONS } from '../../services/store/rbac';
import { UserRole } from '../../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { user, isOAuth, role, setRole, logout } = useCurrentUser();
  const [authError, setAuthError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!isOpen || !mounted) return null;

  const rolesList = Object.values(ROLE_DEFINITIONS);

  const handleSelectRole = (newRole: UserRole) => {
    setRole(newRole);
    onClose();
  };

  const handleLogout = async () => {
    await logout();
    onClose();
  };

  const modalMarkup = (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 light:bg-slate-900/30 backdrop-blur-md light:backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="fixed inset-0"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="relative w-full max-w-lg bg-[#121212] light:bg-white border border-white/15 light:border-slate-200 rounded-3xl shadow-[0_25px_60px_rgba(0,0,0,0.9),0_0_40px_rgba(167,139,113,0.25)] light:shadow-[0_20px_50px_rgba(0,0,0,0.1)] p-6 sm:p-8 text-white light:text-slate-900 z-10 overflow-hidden font-['Inter'] animate-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-white/5 light:bg-slate-100 border border-white/10 light:border-slate-200 hover:bg-white/10 light:hover:bg-slate-200 text-gray-400 light:text-slate-600 hover:text-white light:hover:text-slate-900 transition-all cursor-pointer"
          aria-label="Close authentication modal"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3.5 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-[#a78b71]/15 light:bg-[#8C735D]/10 border border-[#a78b71]/40 light:border-[#8C735D]/30 flex items-center justify-center text-[#e8d5b7] light:text-[#78350F] shadow-[0_0_20px_rgba(167,139,113,0.3)] light:shadow-none">
            <Shield className="w-6 h-6" strokeWidth={1.75} />
          </div>
          <div>
            <h3 className="text-xl font-bold font-['Playfair_Display'] italic text-white light:text-slate-900 tracking-wide">
              Official Access Clearance
            </h3>
            <p className="text-xs text-gray-400 mt-0.5">
              Government Officer & Auditor Single Sign-On (SSO)
            </p>
          </div>
        </div>

        {/* Current Auth Status Banner */}
        {isOAuth ? (
          <div className="p-4 bg-emerald-950/30 border border-emerald-500/30 rounded-2xl mb-6 flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              {user.avatar_url ? (
                <img
                  src={user.avatar_url}
                  alt={user.full_name}
                  className="w-10 h-10 rounded-full border border-emerald-500/40"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-emerald-900/50 border border-emerald-500/40 flex items-center justify-center text-emerald-300 font-bold text-sm">
                  {user.full_name.charAt(0)}
                </div>
              )}
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-sm text-white">{user.full_name}</p>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded-full flex items-center gap-1">
                    <CheckCircle2 className="w-2.5 h-2.5" /> Google Verified
                  </span>
                </div>
                <p className="text-xs text-gray-400">{user.email}</p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="px-3 py-1.5 bg-rose-950/40 border border-rose-500/40 text-rose-300 hover:bg-rose-900/50 text-xs font-semibold rounded-full transition-all cursor-pointer"
            >
              Sign Out
            </button>
          </div>
        ) : (
          <div className="mb-6">
            <div className="p-4 bg-white/[0.03] border border-white/10 rounded-2xl">
              <p className="text-xs text-gray-300 mb-3 leading-relaxed">
                Sign in with your authorized Google Workspace / Nodal account for verified audit logs and official dossier clearance.
              </p>
              <GoogleSignInButton
                className="w-full"
                onError={(err) => setAuthError(err.message)}
                onSuccess={onClose}
              />
              {authError && (
                <div className="mt-3 p-2.5 bg-rose-950/40 border border-rose-500/40 rounded-xl text-rose-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{authError}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Divider */}
        <div className="relative my-5">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/10" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-[#121212] px-3 text-gray-400 font-mono tracking-widest text-[10px] uppercase">
              Or Switch Simulation Role
            </span>
          </div>
        </div>

        {/* 6-Tier Role Clearance Switcher for Demonstration */}
        <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
          {rolesList.map((r) => {
            const isSelected = role === r.role;
            return (
              <button
                key={r.role}
                onClick={() => handleSelectRole(r.role)}
                className={`w-full text-left p-3 rounded-2xl transition-all cursor-pointer flex items-center justify-between gap-3 ${
                  isSelected
                    ? 'bg-[#a78b71]/20 border border-[#a78b71]/50 text-white shadow-[0_0_15px_rgba(167,139,113,0.15)]'
                    : 'bg-white/[0.02] hover:bg-white/[0.06] border border-white/5 text-gray-300 hover:text-white'
                }`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-white">{r.title}</span>
                    <span className="text-[10px] font-mono font-bold text-[#c9b8a0] px-2 py-0.5 bg-black/40 border border-white/10 rounded-full">
                      {r.clearanceLevel}
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-400 line-clamp-1 mt-0.5">
                    {r.description}
                  </p>
                </div>

                {isSelected && (
                  <CheckCircle2 className="w-4 h-4 text-[#e8d5b7] flex-shrink-0" />
                )}
              </button>
            );
          })}
        </div>

        {/* Footer Note */}
        <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-[10px] text-gray-400 font-mono">
          <span className="flex items-center gap-1.5">
            <Lock className="w-3 h-3 text-[#c9b8a0]" /> End-to-End Cryptographic Audit Log
          </span>
          <span>MoSPI • SIH 2026</span>
        </div>
      </div>
    </div>
  );

  return createPortal(modalMarkup, document.body);
};
