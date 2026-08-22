import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { DemoDataNotice } from './DemoDataNotice';

export const Layout: React.FC = () => {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-white">
      {/* Top Simulated Data Notice Banner */}
      <DemoDataNotice />

      {/* Main Top Header */}
      <Header onToggleMobileNav={() => setMobileNavOpen((prev) => !prev)} />

      {/* Content wrapper with Sidebar + Main area */}
      <div className="flex flex-1 min-w-0 w-full">
        <Sidebar mobileOpen={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />
        <main className="flex-1 w-full min-w-0 max-w-[1600px] mx-auto px-4 sm:px-5 lg:px-6 py-5 lg:py-6 overflow-y-auto overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
