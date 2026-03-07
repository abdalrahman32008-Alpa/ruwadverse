import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, ShoppingBag, Bot, MessageSquare, User } from 'lucide-react';

const navItems = [
  { icon: Home, label: 'الرئيسية', path: '/feed' },
  { icon: ShoppingBag, label: 'السوق', path: '/marketplace' },
  { icon: Bot, label: 'RAED', path: '/raed' },
  { icon: MessageSquare, label: 'الرسائل', path: '/messages' },
  { icon: User, label: 'حسابي', path: '/profile/me' },
];

export const BottomNav = () => {
  const location = useLocation();

  return (
    <div className="fixed bottom-0 w-full z-50 bg-[#0d1117]/90 backdrop-blur-md border-t border-white/10 md:hidden">
      <div className="flex justify-around p-2">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex flex-col items-center gap-1 p-2 rounded-xl ${
              location.pathname === item.path ? 'text-[#FFD700]' : 'text-gray-400'
            }`}
          >
            <item.icon size={24} />
            <span className="text-[10px] font-bold">{item.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};
