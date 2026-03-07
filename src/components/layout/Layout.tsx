import React from 'react';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { BottomNav } from './BottomNav';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';

export const Layout = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const { dir } = useLanguage();

  return (
    <div className="min-h-screen bg-[#0d1117] text-white" dir={dir}>
      <Navbar />
      <div className="flex pt-16 pb-16 md:pb-0">
        {user && <Sidebar />}
        <main className={`flex-1 p-4 md:p-8 transition-all duration-300 ${user ? (dir === 'rtl' ? 'md:mr-64' : 'md:ml-64') : ''}`}>
          {children}
        </main>
      </div>
      {user && <BottomNav />}
    </div>
  );
};

