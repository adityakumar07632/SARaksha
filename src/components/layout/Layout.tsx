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
      <div className="flex flex-1 min-w-0">
        <Sidebar mobileOpen={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />
        <main className="flex-1 p-3.5 sm:p-5 md:p-6 overflow-y-auto max-w-[1700px] w-full min-w-0 mx-auto overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
