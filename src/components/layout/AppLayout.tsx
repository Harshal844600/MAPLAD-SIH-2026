import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { AppHeader } from './AppHeader';
import { AppSidebar } from './AppSidebar';
import { ErrorBoundary } from '../ui/ErrorBoundary';
import { AmbientDustParticles } from '../ui/AmbientDustParticles';

export const AppLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  // Check if current route is the front/landing page
  const isLandingPage = location.pathname === '/' || location.pathname === '';

  return (
    <div className="min-h-screen flex flex-col bg-[#0a0a0a] light:bg-[#F8F9FA] text-gray-100 light:text-slate-900 antialiased relative z-10 transition-colors duration-300">
      {/* Background Ambient Dust & Starfield Atmosphere */}
      <AmbientDustParticles />

      <AppHeader onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

      <div className={`flex-1 flex w-full mx-auto ${isLandingPage ? 'max-w-[1680px]' : 'max-w-[1680px]'}`}>
        {/* Only render sidebar on inner pages (not on the front page) */}
        {!isLandingPage && (
          <AppSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        )}

        <main className={`flex-1 overflow-x-hidden min-w-0 ${isLandingPage ? 'p-4 sm:p-6 lg:p-10 w-full' : 'p-4 lg:p-8'}`}>
          <ErrorBoundary>
            <Outlet />
          </ErrorBoundary>
        </main>
      </div>

      {/* Institutional Restrained Footer (only on inner pages since landing page has its own 5-column footer) */}
      {!isLandingPage && (
        <footer className="border-t border-white/10 light:border-slate-200 bg-[#0a0a0a] light:bg-white py-4 px-6 text-center text-xs text-gray-400 light:text-slate-600 font-mono tracking-wider no-print transition-colors duration-300">
          <div className="max-w-[1680px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
            <span>MPLAD SENTINEL • FORENSIC RISK INTELLIGENCE & GOVERNANCE</span>
            <span className="text-[#c9b8a0] light:text-[#8C735D]">GOVERNMENT OF INDIA • MoSPI</span>
          </div>
        </footer>
      )}
    </div>
  );
};
