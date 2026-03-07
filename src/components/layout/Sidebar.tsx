import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, ShoppingBag, Bot, MessageSquare, Bell, Bookmark, Award, Settings } from 'lucide-react';

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
    <aside className="fixed left-0 top-16 h-[calc(100vh-64px)] w-64 bg-[#0d1117] border-l border-white/10 p-4 hidden md:block">
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
            <item.icon size={24} />
            {item.label}
          </Link>
        ))}
      </div>
    </aside>
  );
};
