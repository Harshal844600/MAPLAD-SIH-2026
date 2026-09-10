// ==============================================================================
// MPLAD SENTINEL — 403 ACCESS DENIED & CLEARANCE RESTRICTION DOSSIER
// ==============================================================================

import React from 'react';
import { ArrowLeft, ShieldAlert, KeyRound, UserCheck, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ClassicalButton } from './ClassicalButton';
import { DossierCard } from './DossierCard';
import { ArchiveLabel } from './ArchiveLabel';
import { useCurrentUser } from '../../services/store/useCurrentUser';

import { DEMO_USERS, ROLE_DEFINITIONS } from '../../services/store/rbac';
import { AppPermission, UserRole } from '../../types';


interface AccessDeniedDossierProps {
  requiredPermission?: AppPermission | AppPermission[];
  allowedRoles?: UserRole[];
  title?: string;
  description?: string;
}

export const AccessDeniedDossier: React.FC<AccessDeniedDossierProps> = ({
  requiredPermission,
  allowedRoles,
  title = '403 — Access Restricted',
  description,
}) => {
  const { role, roleMetadata, setRole } = useCurrentUser();

  const primaryAllowedRoles: UserRole[] = allowedRoles || ['SUPER_ADMIN', 'MINISTRY_ADMIN'];
  const formattedReqPerm = Array.isArray(requiredPermission)
    ? requiredPermission.join(' | ')
    : requiredPermission || 'admin.access';

  return (
    <div className="max-w-3xl mx-auto py-12 px-4 animate-in fade-in zoom-in-95 duration-200">
      <DossierCard
        variant="crimson"
        className="p-8 md:p-10 space-y-6 relative overflow-hidden border-beam-card border-rose-500/40 bg-black/90 shadow-[0_25px_60px_rgba(0,0,0,0.9),0_0_40px_rgba(244,63,94,0.15)]"
      >
        {/* Header Ribbon */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-rose-500/30 pb-5">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-rose-950/50 border border-rose-500/50 flex items-center justify-center text-rose-400 shadow-[0_0_20px_rgba(244,63,94,0.3)]">
              <ShieldAlert className="w-6 h-6" strokeWidth={1.75} />
            </div>
            <div>
              <ArchiveLabel text="SECURITY PROTOCOL — INSTITUTIONAL CLEARANCE GATE" />
              <h2 className="text-2xl font-bold font-['Playfair_Display'] italic text-white light:text-slate-900 mt-0.5">
                {title}
              </h2>
            </div>
          </div>

          <span className="px-3 py-1.5 bg-rose-950/60 light:bg-rose-50 border border-rose-500/40 text-rose-300 light:text-rose-700 font-mono font-bold text-xs rounded-xl flex items-center gap-1.5">
            <KeyRound className="w-3.5 h-3.5" />
            CLEARANCE: {roleMetadata.clearanceLevel}
          </span>
        </div>

        {/* Security Summary Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-white/[0.03] border border-white/10 rounded-2xl font-['Inter'] text-xs">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-gray-400 block mb-1">
              CURRENT ACTIVE ROLE
            </span>
            <div className="flex items-center gap-2">
              <span className="font-bold text-white font-mono px-2 py-0.5 bg-white/10 rounded-lg">
                {role}
              </span>
              <span className="text-gray-300 font-semibold">{roleMetadata.title}</span>
            </div>
            <p className="text-[11px] text-gray-400 mt-1">{roleMetadata.department}</p>
          </div>

          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-rose-400 block mb-1">
              REQUIRED PERMISSION KEY
            </span>
            <span className="font-mono font-bold text-rose-300 px-2 py-0.5 bg-rose-950/60 border border-rose-500/40 rounded-lg inline-block">
              {formattedReqPerm}
            </span>
            <p className="text-[11px] text-gray-400 mt-1">
              Restricted to authorized supervisory authorities.
            </p>
          </div>
        </div>

        {/* Contextual Narrative */}
        <div className="space-y-2 text-sm text-gray-300 leading-relaxed font-['Inter']">
          <p>
            {description ||
              `You do not have the required institutional authorization (${formattedReqPerm}) to access this forensic ledger or execute this command.`}
          </p>
          <p className="text-xs text-gray-400">
            This event has been recorded in the append-only cryptographic audit log with timestamp, role verification token, and clearance level.
          </p>
        </div>

        {/* Presentation Demo Role Elevate Switcher */}
        <div className="p-4 bg-black/60 border border-white/10 rounded-2xl space-y-3 font-['Inter']">
          <div className="text-xs font-mono font-bold text-[#c9b8a0] flex items-center justify-between">
            <span className="flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-[#a78b71]" /> ELEVATE PROFILE ROLE FOR EVALUATION:
            </span>
            <span className="text-[10px] text-gray-400">HACKATHON DEMO SWITCHER</span>
          </div>

          <div className="flex flex-wrap gap-2">
            {(['SUPER_ADMIN', 'MINISTRY_ADMIN', 'DISTRICT_OFFICER', 'AUDITOR'] as UserRole[]).map(
              (targetRole) => {
                const targetDef = ROLE_DEFINITIONS[targetRole];
                return (
                  <button
                    key={targetRole}
                    type="button"
                    onClick={() => setRole(targetRole)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                      role === targetRole
                        ? 'bg-[#a78b71] text-black font-bold'
                        : 'bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#a78b71] text-white'
                    }`}
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>{targetDef?.title || targetRole}</span>
                  </button>
                );
              }
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-white/10">
          <Link to="/dashboard">
            <ClassicalButton variant="secondary" size="md">
              <ArrowLeft className="w-4 h-4 mr-2" />
              RETURN TO DASHBOARD
            </ClassicalButton>
          </Link>

          <Link to="/permissions">
            <ClassicalButton variant="secondary" size="md">
              VIEW PERMISSIONS MATRIX →
            </ClassicalButton>
          </Link>

        </div>
      </DossierCard>
    </div>
  );
};
