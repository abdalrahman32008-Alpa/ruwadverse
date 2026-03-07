import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Globe, PlusCircle, MessageSquare, User } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

export const BottomNav = () => {
  const location = useLocation();
  const { t } = useLanguage();

  const menuItems = [
    { icon: Home, label: t('home'), path: '/feed' },
    { icon: Globe, label: t('community'), path: '/community' },
    { icon: PlusCircle, label: t('createPost'), path: '/ideas/new', isSpecial: true },
    { icon: MessageSquare, label: t('messages'), path: '/messages' },
    { icon: User, label: t('profile'), path: '/profile/me' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 w-full bg-[#0d1117] border-t border-white/10 p-2 md:hidden z-50 pb-safe">
      <div className="flex justify-around items-center">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-colors ${
              location.pathname === item.path
                ? 'text-[#FFD700]'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            {item.isSpecial ? (
              <div className="bg-[#FFD700] text-black p-3 rounded-full -mt-8 shadow-lg shadow-[#FFD700]/20 border-4 border-[#0d1117]">
                <item.icon size={24} />
              </div>
            ) : (
              <>
                <item.icon size={24} />
                <span className="text-[10px]">{item.label}</span>
              </>
            )}
          </Link>
        ))}
      </div>
    </nav>
  );
};
