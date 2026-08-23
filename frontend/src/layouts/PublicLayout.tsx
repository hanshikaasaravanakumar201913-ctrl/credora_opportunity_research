import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from '../components/Navbar.js';
import { Footer } from '../components/Footer.js';

export const PublicLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#E8DAC2] dark:bg-dark-bg text-[#0A110D] dark:text-[#E2EDE2] selection:bg-[#0D2B1D] dark:selection:bg-[#4EA36C] selection:text-[#F7EFE1] transition-colors duration-200">
      <Navbar />
      <main className="flex-1 pt-20">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};
