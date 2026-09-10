// ==============================================================================
// MPLAD SENTINEL — GOOGLE AUTHENTICATION REQUIRED GATEWAY
// ==============================================================================

import React from 'react';
import { Shield, Lock, Fingerprint, ShieldCheck, FileCheck } from 'lucide-react';
import { DossierCard } from './DossierCard';
import { ArchiveLabel } from './ArchiveLabel';
import { GoogleSignInButton } from './GoogleSignInButton';

interface GoogleAuthRequiredDossierProps {
  title?: string;
  description?: string;
  redirectTo?: string;
}

export const GoogleAuthRequiredDossier: React.FC<GoogleAuthRequiredDossierProps> = ({
  title = 'Institutional Google Authentication Required',
  description = 'Access to MPLAD Sentinel telemetry, forensic dossiers, and AI analysis modules requires a verified Google account.',
  redirectTo,
}) => {
  return (
    <div className="max-w-xl mx-auto py-12 px-4 animate-in fade-in zoom-in-95 duration-200 font-['Inter']">
      <DossierCard
        variant="default"
        className="p-8 md:p-10 space-y-6 relative overflow-hidden bg-[#121212]/95 border border-white/15 shadow-[0_25px_60px_rgba(0,0,0,0.95),0_0_40px_rgba(167,139,113,0.15)] text-center"
      >
        {/* Header Ribbon */}
        <div className="space-y-4">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-white/[0.04] border border-[#a78b71]/50 flex items-center justify-center text-[#e8d5b7] shadow-[0_0_20px_rgba(167,139,113,0.25)]">
            <Shield className="w-7 h-7" strokeWidth={1.75} />
          </div>

          <div>
            <ArchiveLabel text="SECURITY CLEARANCE GATEWAY" />
            <h2 className="text-2xl font-bold font-['Playfair_Display'] italic text-white mt-1">
              {title}
            </h2>
          </div>
        </div>

        {/* Informative Body */}
        <div className="space-y-2 text-sm text-gray-300 leading-relaxed border-t border-b border-white/10 py-4">
          <p>{description}</p>
          <p className="text-xs text-gray-400 font-mono">
            Identity verification is mandatory to ensure tamper-proof audit trails.
          </p>
        </div>

        {/* Primary Action: Google Sign In */}
        <div className="space-y-3 pt-1">
          <div className="p-3 bg-white/[0.02] border border-[#a78b71]/30 rounded-2xl">
            <GoogleSignInButton
              className="w-full justify-center py-3.5 text-sm font-semibold shadow-[0_4px_25px_rgba(66,133,244,0.3)]"
              variant="primary"
              redirectTo={redirectTo}
            />
          </div>

          <p className="text-[11px] font-mono text-gray-400 flex items-center justify-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-emerald-400" />
            <span>OAuth 2.0 Encrypted • Single Sign-On</span>
          </p>
        </div>

        {/* Footer Security Badges */}
        <div className="pt-4 border-t border-white/10 grid grid-cols-3 gap-2 text-[10px] font-mono text-gray-400">
          <div className="flex flex-col items-center gap-1">
            <ShieldCheck className="w-4 h-4 text-[#c9b8a0]" />
            <span>RBAC Verified</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <Fingerprint className="w-4 h-4 text-emerald-400" />
            <span>Google Auth</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <FileCheck className="w-4 h-4 text-[#c9b8a0]" />
            <span>Cryptographic Log</span>
          </div>
        </div>
      </DossierCard>
    </div>
  );
};
