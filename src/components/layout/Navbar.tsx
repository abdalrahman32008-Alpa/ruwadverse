import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, Bell, MessageSquare, Menu } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Logo } from '../Logo';

export const Navbar = () => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    return (
      <nav className="fixed top-0 w-full z-50 bg-[#0d1117]/80 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Logo />
          <div className="flex gap-4">
            <Link to="/auth" className="text-white hover:text-[#FFD700]">دخول</Link>
            <Link to="/auth" className="bg-[#FFD700] text-black px-4 py-2 rounded-xl font-bold">ابدأ مجاناً</Link>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="fixed top-0 w-full z-50 bg-[#0d1117]/80 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Logo />
        <div className="flex-1 max-w-md mx-4">
          <div className="relative">
            <Search className="absolute right-3 top-2.5 text-gray-400" size={20} />
            <input type="text" placeholder="بحث..." className="w-full bg-[#141517] border border-white/10 rounded-xl py-2 pr-10 pl-4 text-white" />
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/notifications" className="text-gray-400 hover:text-[#FFD700]"><Bell size={24} /></Link>
          <Link to="/messages" className="text-gray-400 hover:text-[#FFD700]"><MessageSquare size={24} /></Link>
          <div className="w-8 h-8 rounded-full bg-[#FFD700] flex items-center justify-center font-bold text-black">
            {user.email?.[0].toUpperCase()}
          </div>
        </div>
      </div>
    </nav>
  );
};
