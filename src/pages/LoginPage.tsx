// ==============================================================================
// MPLAD SENTINEL — INSTITUTIONAL GOOGLE AUTHENTICATION PORTAL
// ==============================================================================

import React from 'react';
import {
  Shield,
  Lock,
  ArrowRight,
  ShieldCheck,
  Fingerprint,
  Globe,
  FileCheck,
} from 'lucide-react';
import { GoogleSignInButton } from '../components/ui/GoogleSignInButton';
import { ArchiveLabel } from '../components/ui/ArchiveLabel';

export const LoginPage: React.FC = () => {
  return (
    <div className="min-h-[calc(100vh-140px)] py-12 px-4 flex items-center justify-center font-['Inter']">
      <div className="max-w-xl w-full">
        {/* Main Institutional Google Login Card */}
        <div className="bg-[#121212]/95 backdrop-blur-2xl border border-white/15 rounded-[32px] p-8 sm:p-12 shadow-[0_30px_70px_rgba(0,0,0,0.95),0_0_50px_rgba(167,139,113,0.18)] relative overflow-hidden text-center space-y-8">
          {/* Subtle Ambient Radial Glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-80 bg-[#a78b71]/15 rounded-full blur-3xl pointer-events-none" />

          {/* National Emblem & Institutional Branding */}
          <div className="space-y-4">
            <div className="w-16 h-16 mx-auto rounded-3xl bg-white/[0.04] border border-[#a78b71]/50 flex items-center justify-center text-[#e8d5b7] shadow-[0_0_25px_rgba(167,139,113,0.3)]">
              <Shield className="w-8 h-8" strokeWidth={1.75} />
            </div>

            <div>
              <div className="inline-block mb-2">
                <span className="text-[10px] font-mono font-bold px-3 py-1 bg-amber-500/10 text-[#e8d5b7] border border-[#a78b71]/30 rounded-full uppercase tracking-wider">
                  MINISTRY OF STATISTICS & PROGRAMME IMPLEMENTATION
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold font-['Playfair_Display'] italic text-white tracking-wide leading-tight">
                MPLAD Sentinel
              </h1>
              <p className="text-xs font-mono text-[#c9b8a0] tracking-widest uppercase mt-1">
                AI FORENSIC RISK INTELLIGENCE PLATFORM • SIH 2026
              </p>
            </div>
          </div>

          <div className="border-t border-b border-white/10 py-5 space-y-2">
            <h2 className="text-base font-semibold text-white">
              Institutional Single Sign-On Gateway
            </h2>
            <p className="text-xs text-gray-400 max-w-md mx-auto leading-relaxed">
              Mandatory identity verification required. Please authenticate using your authorized Google account to access scheme surveillance telemetry and audit dossiers.
            </p>
          </div>

          {/* Google Sign-In Primary Action */}
          <div className="space-y-4 pt-1">
            <div className="p-3 bg-white/[0.02] border border-[#a78b71]/30 rounded-2xl">
              <GoogleSignInButton
                className="w-full justify-center py-3.5 text-sm font-semibold shadow-[0_4px_25px_rgba(66,133,244,0.3)]"
                variant="primary"
              />
            </div>

            <p className="text-[11px] font-mono text-gray-400 flex items-center justify-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-emerald-400" />
              <span>OAuth 2.0 Encrypted • Cryptographic Role Clearance</span>
            </p>
          </div>

          {/* Security Protocols Footer */}
          <div className="pt-6 border-t border-white/10 grid grid-cols-3 gap-2 text-[10px] font-mono text-gray-400">
            <div className="flex flex-col items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-[#c9b8a0]" />
              <span>Zero-Trust RBAC</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <Fingerprint className="w-4 h-4 text-emerald-400" />
              <span>SSO Verified</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <FileCheck className="w-4 h-4 text-[#c9b8a0]" />
              <span>Audit Logged</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
