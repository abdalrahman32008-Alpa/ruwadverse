import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, Bell, MessageSquare, Menu, Globe } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { Logo } from '../Logo';

export const Navbar = () => {
  const { user } = useAuth();
  const location = useLocation();
  const { t, language, setLanguage } = useLanguage();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleLanguage = () => {
    setLanguage(language === 'ar' ? 'en' : 'ar');
  };

  if (!user) {
    return (
      <nav className="fixed top-0 w-full z-50 bg-[#0d1117]/80 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link to="/">
              <Logo />
            </Link>
            <div className="hidden md:flex items-center gap-6">
              <a href="#features" className="text-gray-300 hover:text-[#FFD700] transition-colors">{t('features')}</a>
              <a href="#pricing" className="text-gray-300 hover:text-[#FFD700] transition-colors">{t('pricingTitle')}</a>
              <a href="#about" className="text-gray-300 hover:text-[#FFD700] transition-colors">{t('about')}</a>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={toggleLanguage}
              className="p-2 text-gray-400 hover:text-white transition-colors flex items-center gap-1"
            >
              <Globe size={20} />
              <span className="text-sm font-bold uppercase">{language}</span>
            </button>
            <Link 
              to="/auth" 
              className="hidden md:block text-white hover:text-[#FFD700] font-medium transition-colors"
            >
              {t('login')}
            </Link>
            <Link 
              to="/auth" 
              className="bg-[#FFD700] text-black px-4 py-2 rounded-xl font-bold hover:bg-[#FFC000] transition-colors"
            >
              {t('startNow')}
            </Link>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="fixed top-0 w-full z-50 bg-[#0d1117] border-b border-white/10 h-16">
      <div className="h-full px-4 flex items-center justify-between">
        <div className="flex items-center gap-4 w-64">
          <Link to="/feed" className="flex items-center gap-2">
            <Logo />
          </Link>
        </div>

        <div className="flex-1 max-w-2xl mx-4 hidden md:block">
          <div className="relative group">
            <Search className="absolute right-3 top-2.5 text-gray-500 group-focus-within:text-[#FFD700] transition-colors" size={20} />
            <input 
              type="text" 
              placeholder={t('search')} 
              className="w-full bg-[#141517] border border-white/10 rounded-xl py-2 pr-10 pl-4 text-white focus:outline-none focus:border-[#FFD700]/50 transition-all" 
            />
            <div className="absolute left-3 top-2.5 flex gap-1">
              <kbd className="hidden lg:inline-block px-1.5 py-0.5 text-[10px] font-mono text-gray-500 bg-white/5 rounded border border-white/10">/</kbd>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={toggleLanguage}
            className="p-2 text-gray-400 hover:text-white transition-colors hidden md:flex items-center gap-1"
          >
            <Globe size={20} />
            <span className="text-sm font-bold uppercase">{language}</span>
          </button>

          <Link to="/notifications" className="relative p-2 text-gray-400 hover:text-[#FFD700] transition-colors">
            <Bell size={24} />
            <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-[#0d1117]" />
          </Link>
          
          <Link to="/messages" className="relative p-2 text-gray-400 hover:text-[#FFD700] transition-colors">
            <MessageSquare size={24} />
            <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-[#0d1117]" />
          </Link>
          
          <Link to="/profile/me" className="flex items-center gap-2 pl-2 rounded-full hover:bg-white/5 transition-colors">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#FFD700] to-[#FFC000] flex items-center justify-center font-bold text-black shadow-lg shadow-[#FFD700]/20">
              {user.email?.[0].toUpperCase()}
            </div>
          </Link>
        </div>
      </div>
    </nav>
  );
};

