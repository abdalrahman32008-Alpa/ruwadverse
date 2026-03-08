import React from 'react';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { BottomNav } from './BottomNav';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';

export const Layout = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const { dir } = useLanguage();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);

  return (
    <div className="min-h-screen bg-[#0d1117] text-white" dir={dir}>
      <Navbar onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
      <div className="flex pt-16 pb-16 md:pb-0">
        {user && (
          <Sidebar isOpen={isSidebarOpen} />
        )}
        <main className={`flex-1 p-4 md:p-8 transition-all duration-300 ${user && isSidebarOpen ? (dir === 'rtl' ? 'md:pr-64' : 'md:pl-64') : ''}`}>
          {children}
        </main>
      </div>
      {user && <BottomNav />}
    </div>
  );
};

