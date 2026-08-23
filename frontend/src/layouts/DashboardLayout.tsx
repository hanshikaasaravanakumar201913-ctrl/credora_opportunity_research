import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from '../components/Navbar.js';
import { Sidebar } from '../components/Sidebar.js';

export const DashboardLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#E8DAC2] dark:bg-dark-bg text-[#0A110D] dark:text-[#E2EDE2] selection:bg-[#0D2B1D] dark:selection:bg-[#4EA36C] selection:text-[#F7EFE1] transition-colors duration-200">
      <Navbar />
      <div className="flex pt-16">
        <div className="hidden md:block">
          <Sidebar />
        </div>
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto overflow-x-hidden min-h-[calc(100vh-4rem)]">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
