import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, ShoppingBag, Bot, MessageSquare, Bell, Bookmark, Award, Settings, PlusCircle, LayoutDashboard } from 'lucide-react';

const menuItems = [
  { icon: Home, label: 'الرئيسية', path: '/feed' },
  { icon: ShoppingBag, label: 'السوق', path: '/marketplace' },
  { icon: Bot, label: 'RAED', path: '/raed' },
  { icon: MessageSquare, label: 'الرسائل', path: '/messages' },
  { icon: Bell, label: 'الإشعارات', path: '/notifications' },
  { icon: Bookmark, label: 'المحفوظات', path: '/bookmarks' },
  { icon: Award, label: 'الإنجازات', path: '/achievements' },
  { icon: Settings, label: 'الإعدادات', path: '/settings' },
];

export const Sidebar = () => {
  const location = useLocation();

  return (
    <aside className="fixed left-0 top-16 h-[calc(100vh-64px)] w-64 bg-[#0d1117] border-l border-white/10 p-4 hidden md:flex flex-col justify-between overflow-y-auto custom-scrollbar">
      <div className="space-y-2">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center gap-3 p-3 rounded-xl font-bold transition-colors ${
              location.pathname === item.path
                ? 'bg-[#FFD700] text-black'
                : 'text-gray-400 hover:bg-[#141517] hover:text-white'
            }`}
          >
            <item.icon size={20} />
            {item.label}
          </Link>
        ))}
      </div>

      <div className="mt-8 pt-6 border-t border-white/10 space-y-4">
        <Link 
          to="/ideas/new" 
          className="flex items-center justify-center gap-2 bg-white/5 border border-white/10 text-white p-3 rounded-xl hover:bg-white/10 transition-colors font-bold w-full"
        >
          <PlusCircle size={20} className="text-[#FFD700]" />
          مشروع جديد
        </Link>
        
        <Link 
          to="/admin" 
          className="flex items-center gap-3 p-3 rounded-xl text-gray-500 hover:text-white hover:bg-white/5 transition-colors text-sm"
        >
          <LayoutDashboard size={18} />
          لوحة التحكم
        </Link>
      </div>
    </aside>
  );
};
