import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, Bell, MessageSquare, Menu, Globe, Crown, 
  X, Home, ShoppingBag, ChevronDown, User, Settings, 
  LogOut, HelpCircle, Share2, FileText, Shield, Bot
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { Logo } from '../Logo';
import { Notifications } from '../Notifications';

interface NavbarProps {
  onFeedback?: () => void;
  onSearch?: () => void;
  onToggleSidebar?: () => void;
}

export const Navbar = ({ onFeedback, onSearch, onToggleSidebar }: NavbarProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { t, language, setLanguage, dir } = useLanguage();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const toggleLanguage = () => {
    setLanguage(language === 'ar' ? 'en' : 'ar');
  };

  const handleNavigate = (path: string) => {
    navigate(path);
    setIsOpen(false);
  };

  return (
    <nav className="fixed top-0 w-full z-50 bg-[#0B0C0E]/80 backdrop-blur-xl border-b border-[rgba(255,255,255,0.08)]" dir={dir}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            {user && (
              <button 
                onClick={onToggleSidebar} 
                className="text-gray-400 hover:text-white p-1 hidden md:block transition-colors"
                aria-label="Toggle Sidebar"
              >
                <Menu size={24} />
              </button>
            )}
            <div className="cursor-pointer flex items-center gap-2 z-50" onClick={() => handleNavigate('/')}>
              <Logo width="120" height="40" />
            </div>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-6 space-x-reverse rtl:space-x-reverse ltr:space-x-reverse">
              <button onClick={() => handleNavigate(user ? '/home' : '/')} className="text-sm text-gray-400 hover:text-white transition-colors mx-3">{t('home')}</button>
              <button onClick={() => handleNavigate('/feed')} className="text-sm text-gray-400 hover:text-white transition-colors mx-3">المجتمع</button>
              <button onClick={() => handleNavigate('/marketplace')} className="text-sm text-gray-400 hover:text-white transition-colors mx-3">سوق الأفكار</button>
              <button onClick={() => handleNavigate('/support')} className="text-sm text-gray-400 hover:text-white transition-colors mx-3">{t('supportTitle')}</button>
              
              {onSearch && (
                <button 
                  onClick={onSearch}
                  className="flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-gray-400 hover:text-white transition-all text-xs mx-3"
                >
                  <Search size={14} />
                  <span>بحث...</span>
                  <span className="text-[10px] bg-white/10 px-1 rounded ml-1 opacity-50">Ctrl+K</span>
                </button>
              )}
              
              {user && (
                <>
                  <button onClick={() => handleNavigate('/raed')} className="text-sm text-gray-400 hover:text-white transition-colors mx-3">رائد (RAED)</button>
                  <button onClick={() => handleNavigate('/messages')} className="text-sm text-gray-400 hover:text-white transition-colors mx-3">الرسائل</button>
                  <button onClick={() => handleNavigate('/dashboard')} className="text-sm text-gray-400 hover:text-white transition-colors mx-3">لوحة التحكم</button>
                  <button onClick={() => handleNavigate('/settings')} className="text-sm text-gray-400 hover:text-white transition-colors mx-3">الإعدادات</button>
                </>
              )}

              <div className="relative group inline-block mx-3">
                <button className="text-sm text-gray-400 hover:text-white transition-colors flex items-center gap-1">
                  الملفات <ChevronDown size={14} />
                </button>
                <div className="absolute top-full left-0 mt-2 w-48 bg-[#141517] border border-white/10 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                  <button onClick={() => handleNavigate('/profile/me')} className="block w-full text-start px-4 py-2 text-sm text-gray-300 hover:bg-white/5 hover:text-[#FFD700]">ملفي الشخصي</button>
                  {user && (
                    <>
                      <div className="h-px bg-white/10 my-1"></div>
                      <button onClick={() => handleNavigate('/referral')} className="block w-full text-start px-4 py-2 text-sm text-gray-300 hover:bg-white/5 hover:text-[#FFD700]">برنامج الإحالة</button>
                      <button onClick={() => handleNavigate('/contract')} className="block w-full text-start px-4 py-2 text-sm text-gray-300 hover:bg-white/5 hover:text-[#FFD700]">العقود</button>
                    </>
                  )}
                </div>
              </div>
              
              {!user && <a href="#features" className="text-sm text-gray-400 hover:text-white transition-colors mx-3">{t('features')}</a>}
              
              {user && <div className="mx-3"><Notifications /></div>}

              {onFeedback && (
                <button onClick={onFeedback} className="text-gray-400 hover:text-white transition-colors mx-3" title={t('feedback')} aria-label={t('feedback')}>
                  <MessageSquare size={18} aria-hidden="true" />
                </button>
              )}
              
              <button onClick={toggleLanguage} className="text-gray-400 hover:text-white transition-colors mx-3 flex items-center gap-1" aria-label={language === 'ar' ? 'Switch to English' : 'Switch to Arabic'}>
                <Globe size={18} aria-hidden="true" />
                <span className="text-xs font-mono uppercase">{language === 'ar' ? 'EN' : 'AR'}</span>
              </button>
              <div className="h-4 w-px bg-white/10 mx-2" aria-hidden="true"></div>
              
              {user ? (
                <button onClick={signOut} className="text-sm font-medium bg-white/10 hover:bg-white/20 text-white px-4 py-1.5 rounded-full transition-all border border-white/5 mx-2">
                  تسجيل خروج
                </button>
              ) : (
                <button onClick={() => handleNavigate('/auth')} className="text-sm font-medium bg-white/10 hover:bg-white/20 text-white px-4 py-1.5 rounded-full transition-all border border-white/5 mx-2">
                  {t('startNow')}
                </button>
              )}
            </div>
          </div>

          {/* Mobile Buttons */}
          <div className="flex md:hidden items-center gap-2 sm:gap-4 z-50">
            {onSearch && (
              <button onClick={onSearch} className="text-gray-400 hover:text-white p-2" aria-label="Search">
                <Search size={20} />
              </button>
            )}
            <button onClick={toggleLanguage} className="text-gray-400 hover:text-white p-2 flex items-center justify-center" aria-label={language === 'ar' ? 'Switch to English' : 'Switch to Arabic'}>
              <span className="text-xs font-mono uppercase font-bold">{language === 'ar' ? 'EN' : 'AR'}</span>
            </button>
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-400 hover:text-white p-2 relative flex items-center justify-center" aria-label="Toggle menu" aria-expanded={isOpen}>
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: '100vh' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="md:hidden fixed inset-0 top-16 bg-[#0B0C0E]/95 backdrop-blur-xl border-t border-white/5 overflow-y-auto z-40"
          >
            <div className="px-6 py-8 flex flex-col gap-6">
              <div className="flex flex-col gap-4">
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">القائمة الرئيسية</h4>
                <button onClick={() => handleNavigate(user ? '/home' : '/')} className="text-start text-xl font-bold text-white hover:text-[#FFD700] transition-colors flex items-center gap-3">
                  <Home size={20} /> {t('home')}
                </button>
                <button onClick={() => handleNavigate('/feed')} className="text-start text-xl font-bold text-white hover:text-[#FFD700] transition-colors flex items-center gap-3">
                  <Globe size={20} /> المجتمع
                </button>
                <button onClick={() => handleNavigate('/marketplace')} className="text-start text-xl font-bold text-white hover:text-[#FFD700] transition-colors flex items-center gap-3">
                  <ShoppingBag size={20} /> سوق الأفكار
                </button>
                <button onClick={() => handleNavigate('/raed')} className="text-start text-xl font-bold text-white hover:text-[#FFD700] transition-colors flex items-center gap-3">
                  <Bot size={20} /> رائد (RAED)
                </button>
                <button onClick={() => handleNavigate('/support')} className="text-start text-xl font-bold text-white hover:text-[#FFD700] transition-colors flex items-center gap-3">
                  <HelpCircle size={20} /> {t('supportTitle')}
                </button>
              </div>

              {user && (
                <div className="flex flex-col gap-4 pt-6 border-t border-white/10">
                  <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">لوحة التحكم</h4>
                  <button onClick={() => handleNavigate('/messages')} className="text-start text-xl font-bold text-white hover:text-[#FFD700] transition-colors flex items-center gap-3">
                    <MessageSquare size={20} /> الرسائل
                  </button>
                  <button onClick={() => handleNavigate('/dashboard')} className="text-start text-xl font-bold text-white hover:text-[#FFD700] transition-colors flex items-center gap-3">
                    <FileText size={20} /> لوحة التحكم
                  </button>
                  <button onClick={() => handleNavigate('/referral')} className="text-start text-xl font-bold text-white hover:text-[#FFD700] transition-colors flex items-center gap-3">
                    <Share2 size={20} /> برنامج الإحالة
                  </button>
                  <button onClick={() => handleNavigate('/contract')} className="text-start text-xl font-bold text-white hover:text-[#FFD700] transition-colors flex items-center gap-3">
                    <Shield size={20} /> العقود
                  </button>
                </div>
              )}

              <div className="flex flex-col gap-4 pt-6 border-t border-white/10">
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">الحساب</h4>
                <button onClick={() => handleNavigate('/profile/me')} className="text-start text-xl font-bold text-white hover:text-[#FFD700] transition-colors flex items-center gap-3">
                  <User size={20} /> ملفي الشخصي
                </button>
                <button onClick={() => handleNavigate('/settings')} className="text-start text-xl font-bold text-white hover:text-[#FFD700] transition-colors flex items-center gap-3">
                  <Settings size={20} /> الإعدادات
                </button>
                <button onClick={() => handleNavigate('/notifications')} className="text-start text-xl font-bold text-white hover:text-[#FFD700] transition-colors flex items-center gap-3">
                  <Bell size={20} /> التنبيهات
                </button>
              </div>

              <div className="flex flex-col gap-4 pt-6 border-t border-white/10">
                {onFeedback && (
                  <button onClick={() => { onFeedback(); setIsOpen(false); }} className="text-start text-lg text-gray-300 hover:text-[#FFD700] transition-colors flex items-center gap-3">
                    <MessageSquare size={20} /> {t('feedback')}
                  </button>
                )}
                {user ? (
                  <button onClick={() => { signOut(); setIsOpen(false); }} className="text-start text-lg text-red-400 hover:text-red-300 transition-colors mt-4 flex items-center gap-3">
                    <LogOut size={20} /> تسجيل خروج
                  </button>
                ) : (
                  <button onClick={() => handleNavigate('/auth')} className="w-full bg-[#FFD700] text-black font-bold py-4 rounded-xl mt-4 text-center hover:bg-[#FFC000] transition-colors">
                    {t('startJourney')}
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
