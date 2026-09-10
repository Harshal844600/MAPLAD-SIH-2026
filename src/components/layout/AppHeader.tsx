import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Shield,
  Bell,
  UserCheck,
  AlertTriangle,
  Menu,
  ChevronDown,
  Search,
  LogIn,
  LogOut,
  CheckCircle2,
} from 'lucide-react';
import { UserRole } from '../../types';
import { ThemeToggle, QuickSearchModal, LiveStatusPill, AuthModal } from '../ui';
import { useCurrentUser } from '../../services/store/useCurrentUser';
import { ROLE_DEFINITIONS, DEMO_USERS } from '../../services/store/rbac';

interface AppHeaderProps {
  onToggleSidebar?: () => void;
}

export const AppHeader: React.FC<AppHeaderProps> = ({ onToggleSidebar }) => {
  const { user, role, roleMetadata, setRole, isOAuth, logout } = useCurrentUser();
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showNotificationToast, setShowNotificationToast] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const location = useLocation();
  const isLandingPage = location.pathname === '/' || location.pathname === '';

  const rolesList = Object.values(ROLE_DEFINITIONS);

  const handleRoleChange = (newRole: UserRole) => {
    setRole(newRole);
    setShowRoleMenu(false);
  };

  const handleLogout = async () => {
    await logout();
    setShowRoleMenu(false);
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-[#0a0a0a]/85 backdrop-blur-md border-b border-white/10 px-4 sm:px-6 lg:px-12 py-3.5 transition-colors">
        <div className="max-w-[1680px] mx-auto flex items-center justify-between gap-4">
          {/* Left: Mobile Menu + Institutional Branding */}
          <div className="flex items-center gap-3.5">
            {!isLandingPage && (
              <button
                onClick={onToggleSidebar}
                className="lg:hidden p-2 border border-white/10 rounded-full bg-white/[0.04] text-gray-400 hover:text-[#e8d5b7] hover:border-[#a78b71]/50 transition-all cursor-pointer"
                aria-label="Toggle navigation menu"
              >
                <Menu className="w-5 h-5" strokeWidth={1.5} />
              </button>
            )}

            <a href="#/dashboard" className="flex items-center gap-3 group select-none">
              <div className="w-10 h-10 border border-[#a78b71]/40 rounded-2xl bg-white/[0.04] group-hover:border-[#a78b71] group-hover:shadow-[0_0_20px_rgba(167,139,113,0.3)] transition-all flex items-center justify-center">
                <Shield className="w-5 h-5 text-[#c9b8a0] group-hover:text-[#e8d5b7]" strokeWidth={1.75} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-bold font-['Playfair_Display'] italic tracking-wide text-white leading-none">
                    MPLAD Sentinel
                  </h1>
                  <span className="hidden sm:inline-block text-[10px] font-mono font-bold tracking-widest text-[#c9b8a0] border border-[#a78b71]/30 px-2 py-0.5 rounded-full bg-[#a78b71]/10">
                    SIH 2026
                  </span>
                </div>
                <p className="text-xs text-gray-400 font-['Inter'] hidden sm:block">
                  Forensic Risk Intelligence & Governance Platform
                </p>
              </div>
            </a>
          </div>

          {/* Center / Search Trigger & Live Status */}
          <div className="hidden md:flex items-center gap-4">
            <button
              onClick={() => setShowSearchModal(true)}
              className="flex items-center gap-3 px-4 py-2 bg-white/[0.03] border border-white/10 hover:border-[#a78b71]/50 rounded-full text-xs font-['Inter'] text-gray-400 hover:text-white transition-all shadow-sm cursor-pointer min-w-[280px]"
              title="Search Forensic Dossiers (Ctrl+K)"
            >
              <Search className="w-3.5 h-3.5 text-[#c9b8a0]" strokeWidth={1.75} />
              <span className="truncate">Search dossiers, projects, anomaly codes...</span>
              <kbd className="text-[10px] font-mono font-bold px-2 py-0.5 bg-black/60 border border-white/10 rounded-full text-[#c9b8a0] ml-auto">
                Ctrl+K
              </kbd>
            </button>

            <LiveStatusPill statusText="Neural Scan Active" />
          </div>

          {/* Right: Theme Toggle, Role Switcher & Notifications */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Quick Theme Toggle */}
            <ThemeToggle />

            {/* Mobile Search Button */}
            <button
              onClick={() => setShowSearchModal(true)}
              className="md:hidden p-2 bg-white/[0.04] border border-white/10 hover:border-[#a78b71]/50 rounded-full text-gray-400 hover:text-white transition-all cursor-pointer"
              title="Quick Search"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Google Sign In / Clearance Trigger */}
            {!isOAuth ? (
              <button
                onClick={() => setShowAuthModal(true)}
                className="hidden sm:inline-flex items-center gap-2 px-3 py-1.5 bg-white/[0.06] hover:bg-white/[0.12] border border-white/15 hover:border-[#a78b71]/60 text-white rounded-full text-xs font-semibold font-['Inter'] transition-all shadow-xs cursor-pointer"
                title="Sign in with Google"
              >
                <svg className="w-3.5 h-3.5 flex-shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Google Sign In</span>
              </button>
            ) : null}

            {/* Prominent Super Admin / Role Badge (Internal app pages only) */}
            {!isLandingPage && role === 'SUPER_ADMIN' ? (
              <span className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-amber-500/20 to-amber-600/10 border border-amber-500/40 text-amber-300 font-mono font-bold text-[10px] tracking-wider rounded-full shadow-[0_0_15px_rgba(245,158,11,0.2)]">
                <Shield className="w-3 h-3 text-amber-400" /> SUPER ADMIN
              </span>
            ) : null}

            {/* Profile & Role Switcher (Internal app pages only) */}
            {!isLandingPage && (
              <div className="relative">
                <button
                  onClick={() => {
                    setShowRoleMenu(!showRoleMenu);
                    setShowNotificationToast(false);
                  }}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-['Inter'] font-semibold tracking-wider transition-all cursor-pointer border ${
                    isOAuth
                      ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200 hover:border-emerald-400'
                      : role === 'SUPER_ADMIN'
                      ? 'bg-amber-950/30 border-amber-500/40 text-amber-200 hover:border-amber-400'
                      : 'bg-white/[0.04] light:bg-slate-100 border-white/10 light:border-slate-300 hover:border-[#a78b71]/50 text-gray-200 light:text-slate-800 hover:text-white'
                  }`}
                  title={`Active Profile: ${user.full_name} (${role})`}
                >
                  {user.avatar_url ? (
                    <img
                      src={user.avatar_url}
                      alt={user.full_name}
                      className="w-4 h-4 rounded-full border border-emerald-400"
                    />
                  ) : (
                    <UserCheck className={`w-3.5 h-3.5 ${isOAuth ? 'text-emerald-400' : 'text-[#c9b8a0]'}`} strokeWidth={1.75} />
                  )}
                  <span className="hidden md:inline">{role.replace('_', ' ')}</span>
                  <span className="md:hidden font-mono">{role.slice(0, 5)}</span>
                  <ChevronDown className="w-3 h-3 text-gray-400" />
                </button>

                {showRoleMenu && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setShowRoleMenu(false)}
                    />
                    <div className="absolute right-0 mt-2 w-96 max-w-[90vw] bg-[#121212] light:bg-white backdrop-blur-xl border border-white/15 light:border-slate-200 rounded-2xl shadow-[0_25px_60px_rgba(0,0,0,0.85),0_0_35px_rgba(167,139,113,0.2)] light:shadow-[0_20px_50px_rgba(15,23,42,0.15)] p-4 z-50 animate-in fade-in zoom-in-95 font-['Inter']">
                      {/* Active User Account Header */}
                      <div className="p-3 mb-3 bg-white/[0.03] light:bg-slate-50 border border-white/10 light:border-slate-200 rounded-xl space-y-1">
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-bold text-white light:text-slate-900 truncate">
                            {user.full_name}
                          </p>
                          <span className="text-[9px] font-mono font-bold px-2 py-0.5 bg-[#a78b71]/20 light:bg-[#8C735D]/15 text-[#e8d5b7] light:text-[#78350F] border border-[#a78b71]/40 rounded-full">
                            {roleMetadata.clearanceLevel}
                          </span>
                        </div>
                        <p className="text-[11px] text-[#c9b8a0] light:text-[#8C735D] font-medium truncate">
                          {user.designation || roleMetadata.title}
                        </p>
                        <p className="text-[10px] text-gray-400 light:text-slate-500 truncate font-mono">
                          {user.email}
                        </p>
                      </div>

                      {/* Profile Switcher List */}
                      <div className="space-y-1">
                        <div className="flex items-center justify-between px-1 py-1 text-[10px] font-mono font-bold uppercase tracking-wider text-[#c9b8a0] light:text-slate-500">
                          <span>SWITCH INSTITUTIONAL PROFILE</span>
                          <span>{Object.keys(ROLE_DEFINITIONS).length} PROFILES</span>
                        </div>

                        <div className="max-h-64 overflow-y-auto pr-1 space-y-1.5 divide-y divide-white/5 light:divide-slate-100">
                          {(['SUPER_ADMIN', 'MINISTRY_ADMIN', 'DISTRICT_OFFICER', 'AUDITOR', 'MP_OFFICER', 'DATA_ANALYST', 'FIELD_OFFICER', 'VIEWER'] as UserRole[]).map((r) => {
                            const meta = ROLE_DEFINITIONS[r];
                            const demo = DEMO_USERS[r];
                            if (!meta || !demo) return null;
                            const isActive = role === r;

                            return (
                              <button
                                key={r}
                                onClick={() => handleRoleChange(r)}
                                className={`w-full text-left p-2.5 rounded-xl transition-all flex items-start justify-between gap-2.5 cursor-pointer pt-2 ${
                                  isActive
                                    ? 'bg-[#a78b71]/20 light:bg-amber-50 border border-[#a78b71]/50 light:border-amber-300 shadow-xs'
                                    : 'hover:bg-white/5 light:hover:bg-slate-100 border border-transparent'
                                }`}
                              >
                                <div className="space-y-0.5 min-w-0">
                                  <div className="flex items-center gap-1.5">
                                    <span className="text-xs font-bold text-white light:text-slate-900 truncate">
                                      {demo.full_name}
                                    </span>
                                    <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-white/10 light:bg-slate-200 text-zinc-300 light:text-slate-700">
                                      {meta.title.split(' ')[0]}
                                    </span>
                                  </div>
                                  <p className="text-[11px] text-[#c9b8a0] light:text-[#8C735D] truncate">
                                    {demo.designation}
                                  </p>
                                  <p className="text-[10px] text-zinc-400 light:text-slate-500 truncate">
                                    {demo.department}
                                  </p>
                                </div>

                                <div className="flex flex-col items-end gap-1 shrink-0">
                                  <span className={`text-[8px] font-mono font-bold px-1.5 py-0.5 rounded ${
                                    meta.clearanceLevel === 'TOP_SECRET'
                                      ? 'bg-rose-950/40 light:bg-rose-50 text-rose-300 light:text-rose-700 border border-rose-500/30'
                                      : meta.clearanceLevel === 'CONFIDENTIAL'
                                      ? 'bg-amber-950/40 light:bg-amber-50 text-amber-300 light:text-amber-800 border border-amber-500/30'
                                      : 'bg-slate-800/40 light:bg-slate-100 text-zinc-300 light:text-slate-600 border border-white/10'
                                  }`}>
                                    {meta.clearanceLevel}
                                  </span>
                                  {isActive && (
                                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 light:text-emerald-600 mt-1" />
                                  )}
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Sign In / Sign Out Actions */}
                      <div className="mt-3 pt-2.5 border-t border-white/10 light:border-slate-200 flex items-center justify-end">
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center justify-center gap-1.5 py-2 bg-rose-950/40 light:bg-rose-50 border border-rose-500/30 light:border-rose-200 text-rose-300 light:text-rose-700 hover:bg-rose-900/50 light:hover:bg-rose-100 font-semibold text-xs rounded-xl transition-all cursor-pointer"
                        >
                          <LogOut className="w-3.5 h-3.5" /> Sign Out
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Notifications Button */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowNotificationToast(!showNotificationToast);
                  setShowRoleMenu(false);
                }}
                className="relative p-2 bg-white/[0.04] light:bg-slate-100 border border-white/10 light:border-slate-300 hover:border-[#a78b71]/50 rounded-full text-gray-400 light:text-slate-600 hover:text-white light:hover:text-slate-950 transition-all cursor-pointer"
                title="Forensic alerts & audit records"
                aria-label="Recent alerts"
              >
                <Bell className="w-4 h-4" strokeWidth={1.75} />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white text-[10px] font-mono font-bold flex items-center justify-center rounded-full border border-black shadow-[0_0_8px_rgba(244,63,94,0.6)]">
                  3
                </span>
              </button>

              {showNotificationToast && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowNotificationToast(false)}
                  />
                  <div className="absolute right-0 mt-2 w-88 bg-[#121212] light:bg-white backdrop-blur-xl border border-white/15 light:border-slate-200 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_30px_rgba(167,139,113,0.2)] light:shadow-[0_15px_40px_rgba(15,23,42,0.12)] p-4 z-50 text-white light:text-slate-900 animate-in fade-in zoom-in-95">
                    <div className="flex items-center justify-between mb-3 pb-2 border-b border-white/10 light:border-slate-200">
                      <h4 className="font-['Inter'] font-semibold text-xs tracking-wider text-[#c9b8a0] light:text-[#8C735D] flex items-center gap-1.5 uppercase">
                        <AlertTriangle className="w-3.5 h-3.5 text-rose-400 light:text-rose-600" strokeWidth={1.75} />
                        SYSTEM ALERTS
                      </h4>
                      <span className="text-[10px] font-mono text-emerald-400 light:text-emerald-700 font-bold">REALTIME</span>
                    </div>
                    <div className="space-y-2 text-xs font-['Inter']">
                      <div className="p-3 bg-rose-950/20 light:bg-rose-50 border border-rose-500/30 light:border-rose-200 rounded-xl">
                        <p className="font-bold text-rose-300 light:text-rose-700 text-[11px] font-mono tracking-wide">
                          CRITICAL ANOMALY DETECTED
                        </p>
                        <p className="text-gray-200 light:text-slate-700 mt-1 leading-relaxed">
                          Project #MPLAD-10291 reached 91/100 risk score (Duplicate invoice #INV-APX-884).
                        </p>
                        <span className="text-[10px] text-gray-400 light:text-slate-500 mt-1 block">10 mins ago</span>
                      </div>
                      <div className="p-3 bg-[#a78b71]/10 light:bg-amber-50 border border-[#a78b71]/30 light:border-amber-200 rounded-xl">
                        <p className="font-bold text-[#e8d5b7] light:text-amber-800 text-[11px] font-mono tracking-wide">
                          GEOGRAPHIC OVERLAP FLAG
                        </p>
                        <p className="text-gray-200 light:text-slate-700 mt-1 leading-relaxed">
                          Site coordinates in Phulpur within 8m of completed asset.
                        </p>
                        <span className="text-[10px] text-gray-400 light:text-slate-500 mt-1 block">2 hours ago</span>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* LIVE CRITICAL INCIDENT TICKER RIBBON */}
        <div className="max-w-[1680px] mx-auto mt-2.5 pt-2 border-t border-white/5 flex items-center justify-between gap-4 text-xs font-['Inter'] text-gray-300">
          <div className="flex items-center gap-2.5 truncate">
            <span className="flex h-2 w-2 relative shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
            </span>
            <span className="font-mono font-bold text-[10px] text-rose-400 tracking-wider uppercase shrink-0">
              FORENSIC ALERT:
            </span>
            <span className="truncate text-gray-300 text-[11px]">
              High-Risk Conflict in <strong className="text-[#e8d5b7]">#MPLAD-10291 (Phulpur)</strong> — 120% SoR Cost Inflation & ₹18.2L Duplicate Payment
            </span>
          </div>

          <a
            href="#/projects/proj-10291"
            className="shrink-0 inline-flex items-center gap-1 text-[11px] font-mono font-bold text-[#c9b8a0] hover:text-white transition-colors"
          >
            INSPECT CASE DOSSIER →
          </a>
        </div>
      </header>

      {/* Quick Command Palette Modal */}
      <QuickSearchModal isOpen={showSearchModal} onClose={() => setShowSearchModal(false)} />

      {/* Google Auth & Clearance Modal */}
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </>
  );
};

