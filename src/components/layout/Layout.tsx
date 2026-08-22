import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { DemoDataNotice } from './DemoDataNotice';

export const Layout: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-white">
      {/* Top Simulated Data Notice Banner */}
      <DemoDataNotice />

      {/* Main Top Header */}
      <Header />

      {/* Content wrapper with Sidebar + Main area */}
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6 overflow-y-auto max-w-[1700px] w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
