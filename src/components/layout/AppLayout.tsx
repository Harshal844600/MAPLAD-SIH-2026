import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { AppHeader } from './AppHeader';
import { AppSidebar } from './AppSidebar';
import { ErrorBoundary } from '../ui/ErrorBoundary';
import { AmbientDustParticles } from '../ui/AmbientDustParticles';

export const AppLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-[#1C1714] text-[#E8DFD4] antialiased relative z-10">
      {/* Background Archival Dust & Starfield Atmosphere */}
      <AmbientDustParticles />

      <AppHeader onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

      <div className="flex-1 flex max-w-[1560px] w-full mx-auto">
        <AppSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <main className="flex-1 p-4 lg:p-8 overflow-x-hidden min-w-0">
          <ErrorBoundary>
            <Outlet />
          </ErrorBoundary>
        </main>
      </div>

      {/* Institutional Restrained Footer */}
      <footer className="border-t border-[#4A3F35] bg-[#1C1714] py-4 px-6 text-center text-xs text-[#9C8B7A] font-['Cinzel'] tracking-widest no-print">
        <div className="max-w-[1560px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>MPLAD SENTINEL • INSTITUTIONAL INTELLIGENCE ARCHIVE</span>
          <span className="text-[#C9A962]">GOVERNMENT OF INDIA • MoSPI</span>
        </div>
      </footer>
    </div>
  );
};
