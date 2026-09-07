import React, { useState } from 'react';
import { Shield, Bell, UserCheck, AlertTriangle, Sparkles, Menu, ChevronDown, Search } from 'lucide-react';
import { UserRole } from '../../types';
import { ArchiveLabel, CornerFlourish, ThemeToggle, QuickSearchModal } from '../ui';
import { useCurrentUser } from '../../services/store/useCurrentUser';
import { ROLE_DEFINITIONS } from '../../services/store/rbac';

interface AppHeaderProps {
  onToggleSidebar?: () => void;
}

export const AppHeader: React.FC<AppHeaderProps> = ({ onToggleSidebar }) => {
  const { user, role, roleMetadata, setRole } = useCurrentUser();
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showNotificationToast, setShowNotificationToast] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);

  const rolesList = Object.values(ROLE_DEFINITIONS);

  const handleRoleChange = (newRole: UserRole) => {
    setRole(newRole);
    setShowRoleMenu(false);
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-[#1C1714]/95 backdrop-blur-md border-b border-[#4A3F35] px-4 lg:px-8 py-3.5">
        <div className="max-w-[1560px] mx-auto flex items-center justify-between gap-4">
          {/* Left: Mobile Menu + Institutional Branding */}
          <div className="flex items-center gap-3">
            <button
              onClick={onToggleSidebar}
              className="lg:hidden p-2 border border-[#4A3F35] rounded-[4px] bg-[#251E19] text-[#9C8B7A] hover:text-[#C9A962] hover:border-[#C9A962]"
              aria-label="Toggle navigation menu"
            >
              <Menu className="w-5 h-5" strokeWidth={1.5} />
            </button>

            <a href="#/dashboard" className="flex items-center gap-3 group">
              <div className="w-10 h-10 border border-[#C9A962]/50 rounded-[4px] bg-[#251E19] group-hover:border-[#C9A962] transition-colors flex items-center justify-center shadow-sm">
                <Shield className="w-5 h-5 text-[#C9A962]" strokeWidth={1.5} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl md:text-2xl font-bold font-['Cinzel'] tracking-[0.15em] text-[#E8DFD4] leading-none">
                    MPLAD SENTINEL
                  </h1>
                  <span className="hidden sm:inline-block text-[10px] font-['Cinzel'] font-bold tracking-widest text-[#C9A962] border border-[#C9A962]/40 px-2 py-0.5 rounded-[2px] bg-[#C9A962]/10">
                    SIH 2026
                  </span>
                </div>
                <p className="text-xs text-[#9C8B7A] font-['Crimson_Pro'] italic hidden sm:block">
                  Institutional Intelligence & Forensic Risk Archive
                </p>
              </div>
            </a>
          </div>

          {/* Center / Search Trigger */}
          <button
            onClick={() => setShowSearchModal(true)}
            className="hidden md:flex items-center gap-3 px-3.5 py-1.5 bg-[#251E19] border border-[#4A3F35] hover:border-[#C9A962] rounded-[4px] text-xs font-['Crimson_Pro'] text-[#9C8B7A] hover:text-[#E8DFD4] transition-all shadow-inner"
            title="Search Archive Dossiers (Ctrl+K)"
          >
            <Search className="w-3.5 h-3.5 text-[#C9A962]" strokeWidth={1.5} />
            <span>Search dossiers, projects, risk metrics...</span>
            <kbd className="text-[10px] font-mono font-bold px-1.5 py-0.5 bg-[#1C1714] border border-[#4A3F35] rounded text-[#C9A962]">Ctrl+K</kbd>
          </button>

          {/* Right: Theme Toggle, Role Switcher & Notifications */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Quick Theme Toggle */}
            <ThemeToggle />

            {/* Mobile Search Button */}
            <button
              onClick={() => setShowSearchModal(true)}
              className="md:hidden p-2 bg-[#251E19] border border-[#4A3F35] hover:border-[#C9A962] rounded-[4px] text-[#9C8B7A] hover:text-[#C9A962]"
              title="Quick Search"
            >
              <Search className="w-4 h-4" />
            </button>
          {/* Demo Mode Flag */}
          <div className="relative hidden md:flex items-center gap-1.5 px-3 py-1 bg-[#251E19] border border-[#C9A962]/40 rounded-[2px] text-xs font-['Cinzel'] font-bold tracking-widest text-[#C9A962]">
            <span className="text-[#C9A962]">✤</span>
            <span>SYNTHETIC DEMO ARCHIVE</span>
          </div>

          {/* Role Switcher */}
          <div className="relative">
            <button
              onClick={() => setShowRoleMenu(!showRoleMenu)}
              className="flex items-center gap-2 px-3 py-1.5 bg-[#251E19] border border-[#4A3F35] hover:border-[#C9A962] rounded-[4px] text-xs font-['Cinzel'] tracking-[0.15em] font-bold text-[#E8DFD4] transition-colors"
              title="Switch user role for testing"
            >
              <UserCheck className="w-3.5 h-3.5 text-[#C9A962]" strokeWidth={1.5} />
              <span className="hidden md:inline">{role}</span>
              <span className="md:hidden font-mono">{role.slice(0, 5)}</span>
              <ChevronDown className="w-3 h-3 text-[#9C8B7A]" />
            </button>

            {showRoleMenu && (
              <div className="absolute right-0 mt-2 w-80 bg-[#251E19] border border-[#C9A962]/50 rounded-[4px] shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95">
                <CornerFlourish size="sm" color="#C9A962" />
                <div className="flex items-center justify-between px-2 py-1.5 border-b border-[#4A3F35]">
                  <p className="text-[10px] font-['Cinzel'] font-bold tracking-[0.2em] text-[#C9A962] uppercase">
                    SIMULATE ACCESS PRIVILEGE
                  </p>
                  <span className="text-[9px] font-mono text-[#9C8B7A]">{roleMetadata.clearanceLevel}</span>
                </div>
                <div className="space-y-1.5 mt-1.5 font-['Crimson_Pro']">
                  {rolesList.map((r) => {
                    const isSelected = role === r.role;
                    return (
                      <button
                        key={r.role}
                        onClick={() => handleRoleChange(r.role)}
                        className={`w-full text-left p-2 rounded-[2px] transition-colors ${
                          isSelected
                            ? 'bg-[#C9A962]/15 border-l-2 border-[#C9A962]'
                            : 'hover:bg-[#3D332B]/50'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className={`font-['Cinzel'] text-xs font-bold ${isSelected ? 'text-[#C9A962]' : 'text-[#E8DFD4]'}`}>
                            {r.title}
                          </span>
                          <span className="text-[9px] font-mono px-1 py-0.2 bg-[#1C1714] text-[#9C8B7A] border border-[#4A3F35] rounded">
                            {r.clearanceLevel}
                          </span>
                        </div>
                        <p className="text-[11px] text-[#9C8B7A] line-clamp-1 italic mt-0.5">
                          {r.description}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Notifications Button */}
          <div className="relative">
            <button
              onClick={() => setShowNotificationToast(!showNotificationToast)}
              className="relative p-2 bg-[#251E19] border border-[#4A3F35] hover:border-[#C9A962] rounded-[4px] text-[#9C8B7A] hover:text-[#C9A962] transition-colors"
              title="Archival alerts & audit records"
              aria-label="Recent alerts"
            >
              <Bell className="w-4 h-4" strokeWidth={1.5} />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#8B2635] text-[#E8DFD4] text-[10px] font-mono font-bold flex items-center justify-center rounded-full border border-[#1C1714]">
                3
              </span>
            </button>

            {showNotificationToast && (
              <div className="absolute right-0 mt-2 w-84 bg-[#251E19] border border-[#C9A962]/50 rounded-[4px] shadow-2xl p-4 z-50 text-[#E8DFD4]">
                <CornerFlourish size="sm" color="#C9A962" />
                <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#4A3F35]">
                  <h4 className="font-['Cinzel'] font-bold text-xs tracking-[0.15em] text-[#C9A962] flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-[#8B2635]" strokeWidth={1.5} />
                    ARCHIVAL NOTICES
                  </h4>
                  <span className="text-[10px] font-mono text-[#9C8B7A]">REALTIME</span>
                </div>
                <div className="space-y-2 text-xs font-['Crimson_Pro']">
                  <div className="p-2.5 bg-[#1C1714] border border-[#8B2635]/60 rounded-[2px]">
                    <p className="font-bold text-[#fca5a5] font-['Cinzel'] text-[11px] tracking-wide">
                      CRITICAL ANOMALY DETECTED
                    </p>
                    <p className="text-[#E8DFD4] mt-0.5">
                      Project #MPLAD-10291 crossed 91/100 threshold (Duplicate invoice #INV-APX-884).
                    </p>
                    <span className="text-[10px] text-[#9C8B7A] italic">10 mins ago</span>
                  </div>
                  <div className="p-2.5 bg-[#1C1714] border border-[#C9A962]/40 rounded-[2px]">
                    <p className="font-bold text-[#C9A962] font-['Cinzel'] text-[11px] tracking-wide">
                      GEOGRAPHIC OVERLAP FLAG
                    </p>
                    <p className="text-[#E8DFD4] mt-0.5">
                      Site coordinates in Phulpur within 8m of 2023 completed asset.
                    </p>
                    <span className="text-[10px] text-[#9C8B7A] italic">2 hours ago</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* LIVE CRITICAL INCIDENT TICKER RIBBON */}
      <div className="bg-[#2A1D1A] border-b border-[#8B2635]/60 px-4 lg:px-8 py-1.5 text-xs font-['Crimson_Pro'] text-[#E8DFD4] flex items-center justify-between overflow-hidden">
        <div className="max-w-[1560px] mx-auto w-full flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 truncate">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ff4d4d] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#ff4d4d]"></span>
            </span>
            <span className="font-['Cinzel'] font-bold text-[10px] text-[#ff8080] tracking-wider shrink-0">
              FORENSIC ALERT:
            </span>
            <span className="truncate text-[#E8DFD4]">
              High-Risk Conflict in <strong className="text-[#C9A962]">#MPLAD-10291 (Phulpur)</strong> — 120% SoR Cost Inflation & ₹18.2L Duplicate Payment
            </span>
          </div>

          <a
            href="#/projects/proj-10291"
            className="shrink-0 inline-flex items-center gap-1 text-[11px] font-['Cinzel'] font-bold text-[#C9A962] hover:text-[#fff] underline underline-offset-2 transition-colors"
          >
            INSPECT CASE DOSSIER →
          </a>
        </div>
      </div>
    </header>

    {/* Quick Command Palette Modal */}
    <QuickSearchModal isOpen={showSearchModal} onClose={() => setShowSearchModal(false)} />
  </>
  );
};
