import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Globe, ShoppingBag, Bot, MessageSquare, Bell, User, Settings, PlusCircle, LayoutDashboard, LogOut, Crown } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';

export const Sidebar = () => {
  const location = useLocation();
  const { t } = useLanguage();
  const { signOut, subscriptionTier } = useAuth();

  const menuItems = [
    { id: 'sidebar-feed', icon: Home, label: t('home'), path: '/home' },
    { id: 'sidebar-community', icon: Globe, label: t('community'), path: '/feed' },
    { id: 'sidebar-marketplace', icon: ShoppingBag, label: t('marketplace'), path: '/marketplace' },
    { id: 'sidebar-raed', icon: Bot, label: t('raed'), path: '/raed' },
    { id: 'sidebar-messages', icon: MessageSquare, label: t('messages'), path: '/messages', badge: 3 },
    { id: 'sidebar-notifications', icon: Bell, label: t('notifications'), path: '/notifications', badge: 5 },
    { id: 'sidebar-profile', icon: User, label: t('profile'), path: '/profile/me' },
    { id: 'sidebar-settings', icon: Settings, label: t('settings'), path: '/settings' },
  ];

  return (
    <aside className="fixed start-0 top-16 h-[calc(100vh-64px)] w-64 bg-[#0d1117] border-e border-white/10 p-4 hidden md:flex flex-col justify-between overflow-y-auto custom-scrollbar z-40">
      <div className="space-y-2">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            id={item.id}
            to={item.path}
            className={`flex items-center justify-between p-3 rounded-xl font-bold transition-colors ${
              location.pathname === item.path
                ? 'bg-[#FFD700] text-black'
                : 'text-gray-400 hover:bg-[#141517] hover:text-white'
            }`}
          >
            <div className="flex items-center gap-3">
              <item.icon size={20} />
              <span>{item.label}</span>
            </div>
            {item.badge && (
              <span className={`text-xs px-2 py-0.5 rounded-full ${
                location.pathname === item.path 
                  ? 'bg-black/20 text-black' 
                  : 'bg-[#FFD700] text-black'
              }`}>
                {item.badge}
              </span>
            )}
          </Link>
        ))}
      </div>

      <div className="mt-8 pt-6 border-t border-white/10 space-y-4">
        {subscriptionTier === 'free' && (
          <Link 
            to="/pricing" 
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-black p-3 rounded-xl hover:opacity-90 transition-opacity font-bold w-full shadow-lg shadow-[#FFD700]/20"
          >
            <Crown size={20} />
            ترقية للعضوية المميزة
          </Link>
        )}

        <Link 
          id="create-post-btn"
          to="/ideas/new" 
          className="flex items-center justify-center gap-2 bg-white/5 border border-white/10 text-white p-3 rounded-xl hover:bg-white/10 transition-colors font-bold w-full"
        >
          <PlusCircle size={20} className="text-[#FFD700]" />
          {t('newProject')}
        </Link>
        
        <Link 
          to="/admin" 
          className="flex items-center gap-3 p-3 rounded-xl text-gray-500 hover:text-white hover:bg-white/5 transition-colors text-sm"
        >
          <LayoutDashboard size={18} />
          {t('dashboard')}
        </Link>
        
        <button 
          onClick={() => signOut()}
          className="flex items-center gap-3 p-3 rounded-xl text-red-500 hover:bg-red-500/10 transition-colors text-sm w-full text-start"
        >
          <LogOut size={18} />
          {t('logout')}
        </button>
      </div>
    </aside>
  );
};

