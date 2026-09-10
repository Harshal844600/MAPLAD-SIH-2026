// ==============================================================================
// MPLAD SENTINEL — ROLE & PERMISSION CLEARANCE MATRIX PAGE
// ==============================================================================

import React, { useState } from 'react';
import {
  Shield,
  KeyRound,
  Check,
  X,
  Minus,
  Layers,
  Search,
  UserCheck,
  CheckCircle2,
  Lock,
  ArrowLeft,
  Sparkles,
  ChevronRight,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  hasPermission,
  PERMISSION_TAXONOMY,
  ROLE_DEFINITIONS,
  DEMO_USERS,
} from '../services/store/rbac';
import { useCurrentUser } from '../services/store/useCurrentUser';
import { AppPermission, UserRole } from '../types';
import { ClassicalButton, DossierCard, ArchiveLabel } from '../components/ui';

export const PermissionsPage: React.FC = () => {
  const { role: activeUserRole, roleMetadata, setRole } = useCurrentUser();
  const [selectedViewRole, setSelectedViewRole] = useState<UserRole>(activeUserRole);
  const [searchFilter, setSearchFilter] = useState('');
  const [viewMode, setViewMode] = useState<'focused' | 'matrix'>('focused');

  const allRoles: UserRole[] = [
    'SUPER_ADMIN',
    'MINISTRY_ADMIN',
    'MP_OFFICER',
    'DISTRICT_OFFICER',
    'AUDITOR',
    'DATA_ANALYST',
    'FIELD_OFFICER',
  ];

  const targetRoleMeta = ROLE_DEFINITIONS[selectedViewRole];

  return (
    <div className="max-w-7xl mx-auto space-y-8 font-['Inter'] pb-12">
      {/* Page Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-[#a78b71]/15 border border-[#a78b71]/40 flex items-center justify-center text-[#e8d5b7] shadow-[0_0_20px_rgba(167,139,113,0.3)]">
            <KeyRound className="w-6 h-6" strokeWidth={1.75} />
          </div>
          <div>
            <ArchiveLabel text="GOVERNANCE & ACCESS CONTROL ARCHITECTURE" />
            <h1 className="text-2xl sm:text-3xl font-bold font-['Playfair_Display'] italic text-white tracking-wide mt-0.5">
              Role & Clearance Matrix
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="inline-flex p-1 bg-white/[0.04] border border-white/10 rounded-2xl">
            <button
              onClick={() => setViewMode('focused')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                viewMode === 'focused'
                  ? 'bg-[#a78b71] text-black font-bold'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              Role Clearance Detail
            </button>
            <button
              onClick={() => setViewMode('matrix')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                viewMode === 'matrix'
                  ? 'bg-[#a78b71] text-black font-bold'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              Full Comparative Matrix
            </button>
          </div>

          <Link to="/dashboard">
            <ClassicalButton variant="secondary" size="md">
              <ArrowLeft className="w-4 h-4 mr-1.5" /> Dashboard
            </ClassicalButton>
          </Link>
        </div>
      </div>

      {/* Role Switcher Toolbar */}
      <div className="p-4 bg-[#121212] border border-white/10 rounded-3xl space-y-3">
        <div className="flex items-center justify-between text-xs font-mono text-gray-400 pb-2 border-b border-white/10">
          <span className="flex items-center gap-2 text-[#c9b8a0] font-bold">
            <UserCheck className="w-4 h-4" /> SELECT ROLE PROFILE TO INSPECT / SIMULATE:
          </span>
          <span className="text-[10px]">
            ACTIVE CLEARANCE: <strong className="text-emerald-400">{activeUserRole}</strong>
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
          {allRoles.map((r) => {
            const isSelected = selectedViewRole === r;
            const isActive = activeUserRole === r;
            const def = ROLE_DEFINITIONS[r];

            return (
              <button
                key={r}
                onClick={() => setSelectedViewRole(r)}
                className={`p-2.5 rounded-2xl text-left border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#a78b71]/20 border-[#a78b71] text-white shadow-[0_0_15px_rgba(167,139,113,0.2)]'
                    : 'bg-white/[0.02] hover:bg-white/[0.06] border-white/5 text-gray-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold truncate">{def.title.split(' ')[0]}</span>
                  {isActive && (
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" title="Your current profile" />
                  )}
                </div>
                <span className="text-[9px] font-mono text-gray-400 block truncate mt-0.5">
                  {def.clearanceLevel}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Focused View: Active Selected Role Dossier */}
      {viewMode === 'focused' ? (
        <div className="space-y-6">
          {/* Selected Role Hero Banner */}
          <div className="p-6 bg-gradient-to-r from-white/[0.04] to-white/[0.01] border border-white/15 rounded-3xl relative overflow-hidden">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-3">
                  <h2 className="text-xl sm:text-2xl font-bold font-['Playfair_Display'] italic text-white">
                    {targetRoleMeta.title}
                  </h2>
                  <span className="text-xs font-mono font-bold px-3 py-1 bg-[#a78b71]/20 border border-[#a78b71]/40 text-[#e8d5b7] rounded-full">
                    {targetRoleMeta.clearanceLevel} CLEARANCE
                  </span>
                </div>
                <p className="text-xs text-[#c9b8a0] font-medium mt-1">
                  {targetRoleMeta.department}
                </p>
                <p className="text-xs text-gray-300 max-w-3xl mt-2 leading-relaxed">
                  {targetRoleMeta.description}
                </p>
              </div>

              {activeUserRole !== selectedViewRole && (
                <button
                  onClick={() => setRole(selectedViewRole)}
                  className="px-4 py-2 bg-[#a78b71] hover:bg-[#c9b8a0] text-black font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer flex items-center gap-2"
                >
                  <UserCheck className="w-4 h-4" />
                  <span>Assume This Role</span>
                </button>
              )}
            </div>
          </div>

          {/* Grouped Permissions Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {PERMISSION_TAXONOMY.map((group) => {
              return (
                <div
                  key={group.id}
                  className="p-5 bg-[#121212] border border-white/10 rounded-3xl space-y-3"
                >
                  <div className="flex items-center justify-between pb-2 border-b border-white/10">
                    <div>
                      <h3 className="text-sm font-bold text-white flex items-center gap-2">
                        <Layers className="w-4 h-4 text-[#c9b8a0]" />
                        {group.name}
                      </h3>
                      <p className="text-[11px] text-gray-400 mt-0.5">{group.description}</p>
                    </div>
                  </div>

                  <div className="space-y-1.5 pt-1">
                    {group.permissions.map((perm) => {
                      const isAllowed = hasPermission(selectedViewRole, perm.code);

                      return (
                        <div
                          key={perm.code}
                          className={`p-2.5 rounded-xl border flex items-start justify-between gap-3 text-xs transition-colors ${
                            isAllowed
                              ? 'bg-emerald-950/20 border-emerald-500/30 text-white'
                              : 'bg-white/[0.01] border-white/5 text-gray-400'
                          }`}
                        >
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-white">{perm.label}</span>
                              <code className="text-[10px] text-gray-400 font-mono">
                                ({perm.code})
                              </code>
                            </div>
                            <p className="text-[11px] text-gray-400 mt-0.5 leading-snug">
                              {perm.description}
                            </p>
                          </div>

                          {isAllowed ? (
                            <span className="px-2 py-0.5 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-mono font-bold text-[10px] rounded-full flex items-center gap-1 shrink-0">
                              <Check className="w-3 h-3" /> ALLOWED
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 bg-rose-950/40 border border-rose-500/30 text-rose-400 font-mono font-bold text-[10px] rounded-full flex items-center gap-1 shrink-0">
                              <X className="w-3 h-3" /> RESTRICTED
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* Full Comparative Matrix View */
        <div className="bg-[#121212] border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
          <div className="p-4 border-b border-white/10 flex items-center justify-between">
            <h3 className="text-sm font-bold text-white font-['Playfair_Display'] italic">
              Comparative Multi-Role Access Matrix
            </h3>
            <span className="text-[11px] font-mono text-gray-400">
              Legend: <strong className="text-emerald-400">✓ Allowed</strong> |{' '}
              <strong className="text-rose-400">✕ Restricted</strong>
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-white/[0.03] border-b border-white/10 font-mono text-[11px] text-gray-300">
                  <th className="p-3.5 sticky left-0 bg-[#121212] z-10">Permission / Scope</th>
                  {allRoles.map((r) => (
                    <th key={r} className="p-3.5 text-center min-w-[120px]">
                      <span className="font-bold block text-white">{r.replace('_', ' ')}</span>
                      <span className="text-[9px] text-[#c9b8a0]">
                        {ROLE_DEFINITIONS[r].clearanceLevel}
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {PERMISSION_TAXONOMY.flatMap((group) =>
                  group.permissions.map((perm) => (
                    <tr key={perm.code} className="hover:bg-white/[0.02] transition-colors">
                      <td className="p-3.5 sticky left-0 bg-[#121212] z-10">
                        <span className="font-semibold text-white block">{perm.label}</span>
                        <code className="text-[10px] text-gray-400 font-mono">{perm.code}</code>
                      </td>

                      {allRoles.map((r) => {
                        const allowed = hasPermission(r, perm.code);
                        return (
                          <td key={r} className="p-3.5 text-center">
                            {allowed ? (
                              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                                <Check className="w-3.5 h-3.5" />
                              </span>
                            ) : (
                              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-rose-950/40 text-rose-500 border border-rose-500/30">
                                <X className="w-3.5 h-3.5" />
                              </span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
