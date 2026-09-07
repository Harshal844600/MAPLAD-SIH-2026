import React from 'react';
import { ArrowLeft, UserCheck, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ClassicalButton } from './ClassicalButton';
import { DossierCard } from './DossierCard';
import { ArchiveLabel } from './ArchiveLabel';
import { CornerFlourish } from './CornerFlourish';
import { useCurrentUser } from '../../services/store/useCurrentUser';
import { AppPermission, ROLE_DEFINITIONS } from '../../services/store/rbac';
import { UserRole } from '../../types';

interface AccessDeniedDossierProps {
  requiredPermission?: AppPermission;
  allowedRoles?: UserRole[];
  title?: string;
  description?: string;
}

export const AccessDeniedDossier: React.FC<AccessDeniedDossierProps> = ({
  requiredPermission,
  allowedRoles,
  title = 'INSTITUTIONAL CLEARANCE RESTRICTION',
  description,
}) => {
  const { role, roleMetadata, setRole } = useCurrentUser();

  const fallbackRoles: UserRole[] = allowedRoles || ['SUPER_ADMIN', 'AUDITOR'];

  return (
    <div className="max-w-3xl mx-auto py-12 px-4">
      <DossierCard variant="crimson" className="p-8 md:p-10 space-y-6 relative overflow-hidden">
        <CornerFlourish size="lg" color="#8B2635" />

        <div className="flex items-center justify-between border-b border-[#8B2635]/40 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-[#8B2635]/20 border border-[#8B2635] flex items-center justify-center text-[#ff8080]">
              <Lock className="w-6 h-6" />
            </div>
            <div>
              <ArchiveLabel text="SECURITY PROTOCOL — RBAC GATE" />
              <h2 className="text-2xl font-['Cormorant_Garamond'] font-bold text-[#E8DFD4] mt-0.5">
                {title}
              </h2>
            </div>
          </div>

          <span className="px-3 py-1 bg-[#1C1714] border border-[#8B2635] text-[#ff8080] font-['Cinzel'] font-bold text-xs rounded">
            LEVEL: {roleMetadata.clearanceLevel}
          </span>
        </div>

        <div className="space-y-3 font-['Crimson_Pro'] text-base text-[#E8DFD4]">
          <p>
            Your current active role is <strong className="text-[#C9A962] font-['Cinzel'] font-bold">[{roleMetadata.title}]</strong> under <span className="italic">{roleMetadata.department}</span>.
          </p>
          <p className="text-[#9C8B7A] text-sm">
            {description ||
              `Access to this forensic archival volume requires authorized supervisory or audit clearance (${fallbackRoles.join(', ')}). Your current profile permissions do not grant clearance for this subsystem.`}
          </p>
        </div>

        {/* QUICK ROLE SWITCHER SHORTCUT FOR DEMO & TESTING */}
        <div className="p-4 bg-[#1C1714] border border-[#4A3F35] rounded space-y-3">
          <div className="text-xs font-['Cinzel'] font-bold text-[#C9A962] flex items-center gap-2">
            <UserCheck className="w-4 h-4" /> ELEVATE PROFILE ROLE FOR EVALUATION:
          </div>
          <div className="flex flex-wrap gap-2">
            {fallbackRoles.map((targetRole) => (
              <button
                key={targetRole}
                type="button"
                onClick={() => setRole(targetRole)}
                className="px-3 py-1.5 bg-[#251E19] hover:bg-[#8B2635]/30 border border-[#4A3F35] hover:border-[#C9A962] rounded text-xs font-['Cinzel'] font-bold text-[#E8DFD4] transition-all"
              >
                Switch to {ROLE_DEFINITIONS[targetRole]?.title || targetRole}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-[#4A3F35]">
          <Link to="/dashboard">
            <ClassicalButton variant="secondary" size="md">
              <ArrowLeft className="w-4 h-4 mr-2" />
              RETURN TO COMMAND CENTER
            </ClassicalButton>
          </Link>
        </div>
      </DossierCard>
    </div>
  );
};
