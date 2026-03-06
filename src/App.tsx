import React, { useState, useEffect, useRef, Suspense } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Logo } from './components/Logo';
import { generateRaedResponse } from './services/raed';
import { ArrowLeft, Check, ChevronDown, Lightbulb, Briefcase, Sparkles, Shield, TrendingUp, Menu, X, MessageSquare, Globe } from 'lucide-react';
import { ChatInterface } from './components/ChatInterface';
import { Onboarding } from './components/Onboarding';
import { FeedbackModal } from './components/FeedbackModal';
import { getDailyMarketInsight, MarketData } from './utils/marketData';
import { useLanguage } from './contexts/LanguageContext';
import { CookieConsent } from './components/CookieConsent';
import { PaymentModal } from './components/PaymentModal';
import { ExploreSection } from './components/ExploreSection';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts';
import { SocialLogin } from './components/SocialLogin';
import { SkillProfile } from './components/profiles/SkillProfile';
import { FounderProfile } from './components/profiles/FounderProfile';
import { InvestorProfile } from './components/profiles/InvestorProfile';
import { Marketplace } from './components/Marketplace';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Notifications } from './components/Notifications';
import { Analytics } from './components/Analytics';
import { Skeleton } from './components/Skeleton';
import { supabase } from './lib/supabase';

// Lazy Load Pages
const AboutPage = React.lazy(() => import('./pages/AboutPage').then(module => ({ default: module.AboutPage })));
const ContactPage = React.lazy(() => import('./pages/ContactPage').then(module => ({ default: module.ContactPage })));
const PrivacyPage = React.lazy(() => import('./pages/PrivacyPage').then(module => ({ default: module.PrivacyPage })));
const TermsPage = React.lazy(() => import('./pages/TermsPage').then(module => ({ default: module.TermsPage })));
const MessagesPage = React.lazy(() => import('./pages/MessagesPage').then(module => ({ default: module.MessagesPage })));
const ReferralPage = React.lazy(() => import('./pages/ReferralPage').then(module => ({ default: module.ReferralPage })));
const ContractPage = React.lazy(() => import('./pages/ContractPage').then(module => ({ default: module.ContractPage })));
const SupportPage = React.lazy(() => import('./pages/SupportPage').then(module => ({ default: module.SupportPage })));
const FounderDashboard = React.lazy(() => import('./pages/FounderDashboard').then(module => ({ default: module.FounderDashboard })));

// --- Types ---
type UserType = 'idea' | 'skill' | 'investor' | null;
type Page = 'home' | 'register' | 'onboarding' | 'dashboard' | 'profile-skill' | 'profile-founder' | 'profile-investor' | 'marketplace' | 'about' | 'contact' | 'privacy' | 'terms' | 'messages' | 'referral' | 'contract' | 'founder-dashboard' | 'support';

// --- Components ---

import { KYCVerification } from './components/KYCVerification';
import { SESSION_TIMEOUT_MS, WARNING_TIMEOUT_MS } from './utils/security';
import { calculateUserLevel } from './utils/gamification';

const LoadingScreen = ({ onComplete }: { onComplete: () => void }) => {
  useEffect(() => {
    const timer = setTimeout(onComplete, 2500);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div 
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#0d1117]"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
      >
        <Logo width="300" height="108" />
        <motion.div 
          className="mt-4 h-1 bg-gray-800 rounded-full overflow-hidden w-48 mx-auto"
        >
          <motion.div 
            className="h-full bg-[#FFD700]"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 2 }}
          />
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

const Navbar = ({ onNavigate, onFeedback }: { onNavigate: (page: Page) => void, onFeedback: () => void }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { t, language, setLanguage, dir } = useLanguage();
  const { user, signOut } = useAuth();

  const toggleLanguage = () => {
    setLanguage(language === 'ar' ? 'en' : 'ar');
  };

  return (
    <nav className="fixed top-0 w-full z-40 bg-[#0B0C0E]/80 backdrop-blur-xl border-b border-[rgba(255,255,255,0.08)]" dir={dir}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="cursor-pointer flex items-center gap-2" onClick={() => onNavigate('home')}>
            <Logo width="120" height="40" />
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-6 space-x-reverse rtl:space-x-reverse ltr:space-x-reverse">
              <button onClick={() => onNavigate('home')} className="text-sm text-gray-400 hover:text-white transition-colors mx-3">{t('home')}</button>
              <button onClick={() => onNavigate('marketplace')} className="text-sm text-gray-400 hover:text-white transition-colors mx-3">سوق الأفكار</button>
              <button onClick={() => onNavigate('support')} className="text-sm text-gray-400 hover:text-white transition-colors mx-3">{t('supportTitle')}</button>
              
              {user && (
                <>
                  <button onClick={() => onNavigate('messages')} className="text-sm text-gray-400 hover:text-white transition-colors mx-3">الرسائل</button>
                  <button onClick={() => onNavigate('founder-dashboard')} className="text-sm text-gray-400 hover:text-white transition-colors mx-3">لوحة التحكم</button>
                </>
              )}

              <div className="relative group inline-block mx-3">
                <button className="text-sm text-gray-400 hover:text-white transition-colors flex items-center gap-1">
                  الملفات <ChevronDown size={14} />
                </button>
                <div className="absolute top-full left-0 mt-2 w-48 bg-[#141517] border border-white/10 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                  <button onClick={() => onNavigate('profile-skill')} className="block w-full text-start px-4 py-2 text-sm text-gray-300 hover:bg-white/5 hover:text-[#FFD700]">ملف المهارة</button>
                  <button onClick={() => onNavigate('profile-founder')} className="block w-full text-start px-4 py-2 text-sm text-gray-300 hover:bg-white/5 hover:text-[#FFD700]">ملف المؤسس</button>
                  <button onClick={() => onNavigate('profile-investor')} className="block w-full text-start px-4 py-2 text-sm text-gray-300 hover:bg-white/5 hover:text-[#FFD700]">ملف المستثمر</button>
                  {user && (
                    <>
                      <div className="h-px bg-white/10 my-1"></div>
                      <button onClick={() => onNavigate('referral')} className="block w-full text-start px-4 py-2 text-sm text-gray-300 hover:bg-white/5 hover:text-[#FFD700]">برنامج الإحالة</button>
                      <button onClick={() => onNavigate('contract')} className="block w-full text-start px-4 py-2 text-sm text-gray-300 hover:bg-white/5 hover:text-[#FFD700]">العقود</button>
                    </>
                  )}
                </div>
              </div>
              
              <a href="#features" className="text-sm text-gray-400 hover:text-white transition-colors mx-3">{t('features')}</a>
              <a href="#raed" className="text-sm text-gray-400 hover:text-white transition-colors mx-3">RAED</a>
              
              {user && <div className="mx-3"><Notifications /></div>}

              <button onClick={onFeedback} className="text-gray-400 hover:text-white transition-colors mx-3" title={t('feedback')} aria-label={t('feedback')}>
                <MessageSquare size={18} aria-hidden="true" />
              </button>
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
                <button onClick={() => onNavigate('register')} className="text-sm font-medium bg-white/10 hover:bg-white/20 text-white px-4 py-1.5 rounded-full transition-all border border-white/5 mx-2">
                  {t('startNow')}
                </button>
              )}
            </div>
          </div>
          <div className="-mr-2 flex md:hidden items-center gap-4">
             <button onClick={toggleLanguage} className="text-gray-400 hover:text-white flex items-center gap-1" aria-label={language === 'ar' ? 'Switch to English' : 'Switch to Arabic'}>
                <span className="text-xs font-mono uppercase">{language === 'ar' ? 'EN' : 'AR'}</span>
              </button>
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-400 hover:text-white p-2" aria-label="Toggle menu" aria-expanded={isOpen}>
              {isOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
            </button>
          </div>
        </div>
      </div>
      {isOpen && (
        <div className="md:hidden bg-[#0B0C0E] border-b border-white/5 px-4 pb-4 pt-2 space-y-2">
          <button onClick={() => { onNavigate('home'); setIsOpen(false); }} className="block w-full text-start py-2 text-gray-300">{t('home')}</button>
          <button onClick={() => { onNavigate('marketplace'); setIsOpen(false); }} className="block w-full text-start py-2 text-gray-300">سوق الأفكار</button>
          <button onClick={() => { onNavigate('support'); setIsOpen(false); }} className="block w-full text-start py-2 text-gray-300">{t('supportTitle')}</button>
          {user && (
            <>
              <button onClick={() => { onNavigate('messages'); setIsOpen(false); }} className="block w-full text-start py-2 text-gray-300">الرسائل</button>
              <button onClick={() => { onNavigate('founder-dashboard'); setIsOpen(false); }} className="block w-full text-start py-2 text-gray-300">لوحة التحكم</button>
            </>
          )}
          <button onClick={() => { onNavigate('profile-skill'); setIsOpen(false); }} className="block w-full text-start py-2 text-gray-300">ملف المهارة</button>
          <button onClick={() => { onNavigate('profile-founder'); setIsOpen(false); }} className="block w-full text-start py-2 text-gray-300">ملف المؤسس</button>
          <button onClick={() => { onNavigate('profile-investor'); setIsOpen(false); }} className="block w-full text-start py-2 text-gray-300">ملف المستثمر</button>
          <button onClick={() => { onFeedback(); setIsOpen(false); }} className="block w-full text-start py-2 text-gray-300">{t('feedback')}</button>
          {user ? (
            <button onClick={() => { signOut(); setIsOpen(false); }} className="block w-full text-start py-2 text-[#FFD700]">تسجيل خروج</button>
          ) : (
            <button onClick={() => { onNavigate('register'); setIsOpen(false); }} className="block w-full text-start py-2 text-[#FFD700]">{t('startJourney')}</button>
          )}
        </div>
      )}
    </nav>
  );
};

const Footer = ({ onNavigate }: { onNavigate?: (page: Page) => void }) => {
  const { t } = useLanguage();
  return (
    <footer className="bg-[#0B0C0E] border-t border-white/5 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <Logo width="120" height="40" />
            <p className="mt-4 text-gray-400 text-sm leading-relaxed">
              {t('footerDesc')}
            </p>
          </div>
          <div>
            <h4 className="font-bold mb-4 text-white">{t('platform')}</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><button onClick={() => onNavigate?.('about')} className="hover:text-[#FFD700] transition-colors">من نحن</button></li>
              <li><button onClick={() => onNavigate?.('contact')} className="hover:text-[#FFD700] transition-colors">تواصل معنا</button></li>
              <li><button onClick={() => onNavigate?.('support')} className="hover:text-[#FFD700] transition-colors">{t('supportTitle')}</button></li>
              <li><a href="#" className="hover:text-[#FFD700] transition-colors">{t('features')}</a></li>
              <li><a href="#" className="hover:text-[#FFD700] transition-colors">{t('pricingTitle')}</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4 text-white">{t('legal')}</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><button onClick={() => onNavigate?.('privacy')} className="hover:text-[#FFD700] transition-colors">سياسة الخصوصية</button></li>
              <li><button onClick={() => onNavigate?.('terms')} className="hover:text-[#FFD700] transition-colors">شروط الاستخدام</button></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4 text-white">{t('social')}</h4>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-[#FFD700] hover:text-black transition-all">
                <span className="sr-only">Twitter</span>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path></svg>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-[#FFD700] hover:text-black transition-all">
                <span className="sr-only">LinkedIn</span>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
              </a>
            </div>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-white/5 text-center text-sm text-gray-500">
          &copy; {new Date().getFullYear()} Ruwadverse. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

const Hero = ({ onStart }: { onStart: () => void }) => {
  const { t } = useLanguage();
  return (
    <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#FFD700]/10 via-[#0B0C0E]/50 to-[#0B0C0E] opacity-50 pointer-events-none blur-3xl" />
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-[#FFD700] mb-8 animate-float">
            <Sparkles size={12} />
            <span>{t('heroSubtitle')}</span>
          </div>
          
          <h1 className="text-5xl md:text-8xl font-bold mb-8 tracking-tight leading-[1.1]">
            {t('heroTitle')} <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-white/40">{t('solution2Title')}</span>
          </h1>
          
          <p className="text-xl text-[#8A8F98] mb-12 max-w-2xl mx-auto leading-relaxed font-light">
            {t('heroDesc')}
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4 items-center mb-16">
            <button onClick={onStart} className="btn-linear-primary px-8 py-4 rounded-full text-lg min-w-[200px]">
              {t('startJourney')}
            </button>
            <button className="btn-linear-secondary px-8 py-4 rounded-full text-lg min-w-[200px] flex items-center justify-center gap-2 group">
              <span>{t('learnMore')}</span>
              <ChevronDown size={16} className="group-hover:translate-y-1 transition-transform" />
            </button>
          </div>

          {/* Start with Ideas Form Mock */}
          <div className="max-w-xl mx-auto mb-16 relative z-20">
            <div className="bg-[#141517]/80 backdrop-blur-md border border-white/10 rounded-full p-2 flex items-center shadow-2xl">
              <div className="pl-4 pr-2 text-gray-400">
                <Lightbulb size={20} />
              </div>
              <input 
                type="text" 
                aria-label={t('q_idea_fear_ph')}
                placeholder={t('q_idea_fear_ph')} 
                className="bg-transparent border-none outline-none text-white w-full placeholder-gray-500 text-sm"
              />
              <button className="bg-[#FFD700] text-black font-bold px-6 py-2 rounded-full text-sm hover:bg-[#FFC000] transition-colors whitespace-nowrap">
                {t('startNow')}
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2">{t('aiMatches')}</p>
          </div>

          {/* Stats Mock */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto mb-20 border-t border-b border-white/5 py-8">
            <div>
              <h3 className="text-3xl font-bold text-white mb-1">{t('usersCount')}</h3>
              <p className="text-xs text-gray-500 uppercase tracking-wider">Active Users</p>
            </div>
            <div>
              <h3 className="text-3xl font-bold text-white mb-1">{t('projectsCount')}</h3>
              <p className="text-xs text-gray-500 uppercase tracking-wider">Startups</p>
            </div>
             <div>
              <h3 className="text-3xl font-bold text-white mb-1">$2M+</h3>
              <p className="text-xs text-gray-500 uppercase tracking-wider">Invested</p>
            </div>
             <div>
              <h3 className="text-3xl font-bold text-white mb-1">92%</h3>
              <p className="text-xs text-gray-500 uppercase tracking-wider">Success Rate</p>
            </div>
          </div>

          {/* Hero Image / Dashboard Preview */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 1 }}
            className="mt-20 relative mx-auto max-w-5xl"
          >
            <div className="absolute inset-0 bg-[#FFD700] blur-[100px] opacity-10 rounded-full" />
            <div className="relative rounded-xl border border-white/10 bg-[#141517]/50 backdrop-blur-xl overflow-hidden shadow-2xl">
              <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5 bg-[#141517]">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50" />
                  <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50" />
                </div>
                <div className="mx-auto text-xs text-gray-500 font-mono">ruwadverse_dashboard.exe</div>
              </div>
              <div className="p-8 grid grid-cols-3 gap-6 opacity-80">
                {/* Fake UI Elements for Preview */}
                <div className="col-span-1 space-y-4">
                  <div className="h-32 rounded-lg bg-white/5 border border-white/5" />
                  <div className="h-48 rounded-lg bg-white/5 border border-white/5" />
                </div>
                <div className="col-span-2 space-y-4">
                  <div className="h-16 rounded-lg bg-white/5 border border-white/5" />
                  <div className="h-64 rounded-lg bg-white/5 border border-white/5" />
                </div>
              </div>
              {/* Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B0C0E] via-transparent to-transparent" />
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

const Pricing = () => {
  const { t } = useLanguage();
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<'free' | 'pro'>('free');

  const handleSubscribe = (plan: 'free' | 'pro') => {
    setSelectedPlan(plan);
    setIsPaymentOpen(true);
  };

  return (
    <>
      <section className="py-20 bg-[#0B0C0E] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">{t('pricingTitle')}</h2>
            <p className="text-[#8A8F98] max-w-2xl mx-auto">
              اختر الخطة المناسبة لاحتياجاتك. ابدأ مجاناً أو احصل على ميزات احترافية مع باقة رائد Pro.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Free Plan */}
            <div className="linear-card p-8 rounded-3xl border border-white/5 relative group hover:border-white/20 transition-all">
              <h3 className="text-2xl font-bold mb-2">{t('freePlan')}</h3>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl font-bold">0</span>
                <span className="text-sm text-gray-400">{t('sar')} / {t('month')}</span>
              </div>
              <ul className="space-y-4 mb-8 text-sm text-gray-300">
                <li className="flex items-center gap-3">
                  <Check size={16} className="text-green-500" />
                  <span>ملف شخصي كامل</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check size={16} className="text-green-500" />
                  <span>تقديم 3 أفكار شهرياً</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check size={16} className="text-green-500" />
                  <span>تحليل RAED الأساسي</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check size={16} className="text-green-500" />
                  <span>تصفح سوق الأفكار</span>
                </li>
                <li className="flex items-center gap-3 text-gray-600">
                  <X size={16} />
                  <span>تواصل مباشر مع المستثمرين</span>
                </li>
              </ul>
              <button 
                onClick={() => handleSubscribe('free')}
                className="w-full py-3 rounded-xl border border-white/10 hover:bg-white/5 transition-colors font-bold text-sm"
              >
                {t('startNow')}
              </button>
            </div>

            {/* Pro Plan */}
            <div className="linear-card p-8 rounded-3xl border border-[#FFD700]/30 relative group hover:border-[#FFD700] transition-all bg-[#FFD700]/5">
              <div className="absolute top-0 right-0 bg-[#FFD700] text-black text-xs font-bold px-3 py-1 rounded-bl-xl rounded-tr-2xl">
                الأكثر اختياراً
              </div>
              <h3 className="text-2xl font-bold mb-2 text-[#FFD700]">{t('proPlan')}</h3>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl font-bold">299</span>
                <span className="text-sm text-gray-400">{t('sar')} / {t('month')}</span>
              </div>
              <ul className="space-y-4 mb-8 text-sm text-gray-300">
                <li className="flex items-center gap-3">
                  <Check size={16} className="text-[#FFD700]" />
                  <span>أفكار ورسائل غير محدودة</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check size={16} className="text-[#FFD700]" />
                  <span>تحليل RAED المتعمق</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check size={16} className="text-[#FFD700]" />
                  <span>تواصل مباشر مع المستثمرين</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check size={16} className="text-[#FFD700]" />
                  <span>عقود رقمية قانونية</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check size={16} className="text-[#FFD700]" />
                  <span>شارة Pro ولوحة إحصائيات متقدمة</span>
                </li>
              </ul>
              <button 
                onClick={() => handleSubscribe('pro')}
                className="w-full py-3 rounded-xl bg-[#FFD700] text-black hover:bg-[#FFC000] transition-colors font-bold text-sm shadow-lg shadow-[#FFD700]/20"
              >
                جرّب Pro شهراً مجاناً
              </button>
              <div className="mt-4 text-center">
                <p className="text-xs text-gray-500 mb-2">{t('paymentMethods')}</p>
                <div className="flex justify-center gap-2 opacity-50">
                   <div className="w-8 h-5 bg-white/10 rounded"></div>
                   <div className="w-8 h-5 bg-white/10 rounded"></div>
                   <div className="w-8 h-5 bg-white/10 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <PaymentModal isOpen={isPaymentOpen} onClose={() => setIsPaymentOpen(false)} plan={selectedPlan} />
    </>
  );
};

const ProblemSolution = () => {
  const { t } = useLanguage();
  return (
    <section id="features" className="py-32 bg-[#0B0C0E]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">{t('problemTitle')}</h2>
          <p className="text-[#8A8F98] text-lg max-w-2xl mx-auto">
            {t('problem1Desc')}
            <br />
            {t('problem2Desc')}
          </p>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[minmax(300px,auto)]">
          {/* Card 1: Idea Owner (Large) */}
          <div className="md:col-span-2 linear-card rounded-3xl p-8 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 blur-[80px] rounded-full group-hover:bg-purple-500/20 transition-colors" />
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400 mb-6 border border-purple-500/20">
                <Lightbulb size={24} />
              </div>
              <h3 className="text-2xl font-bold mb-4">{t('ideaTitle')}</h3>
              <p className="text-[#8A8F98] mb-8 max-w-md">
                {t('ideaDesc')}
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                  <div className="text-sm text-gray-400 mb-1">{t('raedFeature1')}</div>
                  <div className="text-green-400 text-sm font-mono flex items-center gap-2"><Shield size={14} /> {t('solution1Title')}</div>
                </div>
                <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                  <div className="text-sm text-gray-400 mb-1">{t('marketInsight')}</div>
                  <div className="text-purple-400 text-sm font-mono">{t('heroSubtitle')}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Skilled (Tall) */}
          <div className="md:row-span-2 linear-card rounded-3xl p-8 relative overflow-hidden group">
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 blur-[80px] rounded-full group-hover:bg-blue-500/20 transition-colors" />
            <div className="relative z-10 h-full flex flex-col">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 mb-6 border border-blue-500/20">
                <Briefcase size={24} />
              </div>
              <h3 className="text-2xl font-bold mb-4">{t('skillTitle')}</h3>
              <p className="text-[#8A8F98] mb-8">
                {t('skillDesc')}
              </p>
              <div className="mt-auto space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-white/5 p-3 rounded-lg border border-white/5 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-700 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="h-2 bg-gray-600 rounded w-1/2 mb-1.5" />
                      <div className="h-1.5 bg-gray-700 rounded w-1/3" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Card 3: Investor */}
          <div className="linear-card rounded-3xl p-8 relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-64 h-64 bg-green-500/10 blur-[80px] rounded-full group-hover:bg-green-500/20 transition-colors" />
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center text-green-400 mb-6 border border-green-500/20">
                <TrendingUp size={24} />
              </div>
              <h3 className="text-2xl font-bold mb-4">{t('investorTitle')}</h3>
              <p className="text-[#8A8F98]">
                {t('investorDesc')}
              </p>
            </div>
          </div>

          {/* Card 4: RAED AI */}
          <div className="md:col-span-2 linear-card rounded-3xl p-8 relative overflow-hidden flex items-center">
            <div className="absolute inset-0 bg-gradient-to-r from-[#FFD700]/5 to-transparent" />
            <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 w-full">
              <div className="flex-1">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFD700]/10 border border-[#FFD700]/20 text-xs text-[#FFD700] mb-4">
                  <Sparkles size={12} />
                  <span>AI Core</span>
                </div>
                <h3 className="text-2xl font-bold mb-4">{t('raedTitle')}</h3>
                <p className="text-[#8A8F98]">
                  {t('raedDesc')}
                </p>
              </div>
              <div className="w-full md:w-1/3 bg-[#141517] border border-white/10 rounded-xl p-4 shadow-2xl">
                <div className="flex gap-3 mb-4">
                  <div className="w-8 h-8 rounded-full bg-[#FFD700] flex items-center justify-center text-black font-bold text-xs">R</div>
                  <div className="bg-[#2C2D31] p-3 rounded-lg rounded-tl-none text-xs text-gray-300 leading-relaxed">
                    {t('raedWelcome').replace('{userType}', t('userTypeSkill'))}
                  </div>
                </div>
                <div className="flex gap-2">
                  <div className="h-8 bg-[#FFD700] rounded-lg w-full flex items-center justify-center text-black text-xs font-bold cursor-pointer">{t('startNow')}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const RaedSection = () => {
  const { t } = useLanguage();
  return (
    <section id="raed" className="py-32 relative overflow-hidden bg-[#0B0C0E]">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#FFD700]/5 via-transparent to-transparent" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <div className="lg:w-1/2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFD700]/10 border border-[#FFD700]/20 text-xs text-[#FFD700] mb-6">
              <Sparkles size={12} />
              <span>AI Co-Founder</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              {t('raedTitle')}
              <br />
              {t('raedSubtitle')}
            </h2>
            <p className="text-[#8A8F98] text-lg mb-8 leading-relaxed">
              {t('raedDesc')}
            </p>
            <ul className="space-y-4">
              {[
                t('raedFeature1'),
                t('raedFeature2'),
                t('raedFeature3'),
                t('solution1Title')
              ].map((item, idx) => (
                <li key={idx} className="flex items-center gap-3 text-gray-300">
                  <div className="w-5 h-5 rounded-full bg-[#FFD700]/20 flex items-center justify-center text-[#FFD700]">
                    <Check size={12} />
                  </div>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="lg:w-1/2 w-full perspective-1000">
            <div className="linear-card p-1 rounded-3xl relative transform rotate-y-12 rotate-x-6 hover:rotate-0 transition-transform duration-700 ease-out shadow-2xl">
              <div className="bg-[#141517] rounded-[20px] p-6 overflow-hidden relative">
                <div className="absolute top-0 right-0 p-4 opacity-20">
                  <Logo width="100" height="40" />
                </div>
                <div className="space-y-6 mt-4">
                  <div className="flex gap-4 justify-end">
                    <div className="bg-[#2C2D31] px-4 py-3 rounded-2xl rounded-tr-none max-w-[85%] text-sm text-gray-200 shadow-sm">
                      {t('q_idea_fear_ph')}
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FFD700] to-[#FFA500] flex items-center justify-center text-black font-bold text-sm shadow-lg shadow-[#FFD700]/20">
                      R
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-bold text-[#FFD700]">RAED AI</span>
                        <span className="text-[10px] text-gray-500 bg-white/5 px-1.5 py-0.5 rounded">Thinking...</span>
                      </div>
                      <div className="bg-[#FFD700]/5 px-4 py-3 rounded-2xl rounded-tl-none text-sm text-gray-200 border border-[#FFD700]/10 leading-relaxed">
                        {t('raedWelcome').replace('{userType}', t('userTypeIdea'))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const RegisterPage = ({ onSelectType }: { onSelectType: (type: UserType) => void }) => {
  const { t } = useLanguage();
  const [showKYC, setShowKYC] = useState(false);

  const types = [
    { id: 'idea', title: t('ideaTitle'), icon: <Lightbulb size={28} />, desc: t('ideaDesc'), color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20' },
    { id: 'skill', title: t('skillTitle'), icon: <Briefcase size={28} />, desc: t('skillDesc'), color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
    { id: 'investor', title: t('investorTitle'), icon: <TrendingUp size={28} />, desc: t('investorDesc'), color: 'text-green-400', bg: 'bg-green-500/10', border: 'border-green-500/20' },
  ];

  return (
    <div className="min-h-screen pt-32 pb-20 px-4 flex items-center justify-center">
      <div className="max-w-5xl w-full">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">{t('registerTitle')}</h2>
          <p className="text-[#8A8F98]">{t('registerSubtitle')}</p>
        </div>

        <SocialLogin />
        
        {!showKYC ? (
          <div className="grid md:grid-cols-3 gap-6">
            {types.map((type) => (
              <button
                key={type.id}
                onClick={() => onSelectType(type.id as UserType)}
                className="linear-card p-1 rounded-3xl group text-start md:text-center relative overflow-hidden transition-all hover:-translate-y-1 hover:shadow-2xl"
              >
                <div className="bg-[#141517] rounded-[20px] p-8 h-full relative z-10 flex flex-col items-center">
                  <div className={`w-16 h-16 rounded-2xl ${type.bg} ${type.border} border flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <div className={type.color}>{type.icon}</div>
                  </div>
                  <h3 className="text-xl font-bold mb-3">{type.title}</h3>
                  <p className="text-[#8A8F98] text-sm leading-relaxed">{type.desc}</p>
                  
                  <div className="mt-8 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2 text-xs font-medium text-white bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
                    <span>{t('startNow')}</span>
                    <ArrowLeft size={12} className="rotate-180 rtl:rotate-0" />
                  </div>
                </div>
                <div className={`absolute inset-0 bg-gradient-to-b ${type.bg} to-transparent opacity-0 group-hover:opacity-20 transition-opacity duration-500`} />
              </button>
            ))}
            
            {/* KYC Trigger */}
            <div className="md:col-span-3 mt-8 flex justify-center">
               <button 
                 onClick={() => setShowKYC(true)}
                 className="flex items-center gap-2 text-sm text-gray-400 hover:text-[#FFD700] transition-colors border border-white/10 px-4 py-2 rounded-full hover:border-[#FFD700]/30"
               >
                 <Shield size={14} />
                 {t('verifyIdentity')} (KYC)
               </button>
            </div>
          </div>
        ) : (
          <KYCVerification onComplete={() => setShowKYC(false)} />
        )}
      </div>
    </div>
  );
};

const Dashboard = ({ userType }: { userType: UserType }) => {
  const [marketData, setMarketData] = useState<MarketData | null>(null);
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'overview' | 'matches' | 'performance'>('overview');
  
  // Mock user points for demo
  const userPoints = 150; 
  const { level, progress, nextLevelPoints } = calculateUserLevel(userPoints);

  useEffect(() => {
    const data = getDailyMarketInsight();
    setMarketData(data);
  }, []);

  return (
    <div className="min-h-screen pt-28 pb-12 px-4 max-w-7xl mx-auto">
      {/* Dashboard Tabs */}
      <div className="flex gap-4 mb-8 border-b border-white/10 pb-1 overflow-x-auto" role="tablist">
        <button 
          role="tab"
          aria-selected={activeTab === 'overview'}
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 text-sm font-bold border-b-2 transition-colors whitespace-nowrap ${activeTab === 'overview' ? 'border-[#FFD700] text-[#FFD700]' : 'border-transparent text-gray-400 hover:text-white'}`}
        >
          {t('dashboardTitle')}
        </button>
        <button 
          role="tab"
          aria-selected={activeTab === 'matches'}
          onClick={() => setActiveTab('matches')}
          className={`px-4 py-2 text-sm font-bold border-b-2 transition-colors whitespace-nowrap ${activeTab === 'matches' ? 'border-[#FFD700] text-[#FFD700]' : 'border-transparent text-gray-400 hover:text-white'}`}
        >
          {t('aiMatches')}
        </button>
        <button 
          role="tab"
          aria-selected={activeTab === 'performance'}
          onClick={() => setActiveTab('performance')}
          className={`px-4 py-2 text-sm font-bold border-b-2 transition-colors whitespace-nowrap ${activeTab === 'performance' ? 'border-[#FFD700] text-[#FFD700]' : 'border-transparent text-gray-400 hover:text-white'}`}
        >
          {t('performance')}
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Sidebar / Profile */}
        <div className="lg:col-span-1 space-y-6">
          <div className="linear-card p-6 rounded-2xl text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#FFD700] to-transparent opacity-50" />
            <div className="w-24 h-24 mx-auto bg-[#141517] border border-white/10 rounded-full mb-4 flex items-center justify-center text-3xl shadow-xl relative z-10">
              <div className="absolute inset-0 rounded-full bg-gradient-to-b from-white/5 to-transparent" />
              👤
            </div>
            <h2 className="text-xl font-bold mb-1">
              {userType === 'idea' ? 'Ahmed Mohamed' : userType === 'skill' ? 'Sarah Ali' : 'Khalid Abdullah'}
            </h2>
            <p className="text-[#8A8F98] text-sm mb-4 flex items-center justify-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FFD700]" />
              {userType === 'idea' ? t('userTypeIdea') : userType === 'skill' ? t('userTypeSkill') : t('userTypeInvestor')}
            </p>
            <div className="flex justify-center gap-2 mb-4">
              <span className="px-3 py-1 bg-[#141517] border border-white/10 rounded-full text-xs text-gray-400">{t('completeProfile')}</span>
              <span className="px-3 py-1 bg-[#141517] border border-green-500/20 text-green-400 rounded-full text-xs flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                {t('online')}
              </span>
            </div>
            
            {/* Gamification Level */}
            <div className="bg-[#141517] rounded-xl p-3 border border-white/5">
              <div className="flex justify-between items-center text-xs mb-2">
                <span className="text-gray-400">Level: <span className="text-[#FFD700] font-bold">{level}</span></span>
                <span className="text-gray-500">{userPoints} / {nextLevelPoints} XP</span>
              </div>
              <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 1 }}
                  className="h-full bg-gradient-to-r from-[#FFD700] to-amber-500"
                />
              </div>
            </div>
            
            {/* Quick Actions */}
            <div className="grid grid-cols-3 gap-2 mt-6 border-t border-white/5 pt-4">
              <button className="bg-[#141517] border border-white/10 p-2 rounded-xl flex flex-col items-center justify-center gap-1 hover:bg-white/5 transition-colors group">
                <MessageSquare size={16} className="text-[#FFD700] group-hover:scale-110 transition-transform" />
                <span className="text-[10px] text-gray-400">Chat RAED</span>
              </button>
              <button className="bg-[#141517] border border-white/10 p-2 rounded-xl flex flex-col items-center justify-center gap-1 hover:bg-white/5 transition-colors group">
                <div className="w-4 h-4 rounded-full border border-white/30 flex items-center justify-center group-hover:border-[#FFD700]">
                  <div className="w-2 h-2 bg-white rounded-full group-hover:bg-[#FFD700]" />
                </div>
                <span className="text-[10px] text-gray-400">Edit</span>
              </button>
              <button className="bg-[#141517] border border-white/10 p-2 rounded-xl flex flex-col items-center justify-center gap-1 hover:bg-white/5 transition-colors group">
                <Globe size={16} className="text-blue-400 group-hover:scale-110 transition-transform" />
                <span className="text-[10px] text-gray-400">Share</span>
              </button>
            </div>
          </div>

          {/* Endorsements Mock */}
          <div className="linear-card p-6 rounded-2xl">
            <h3 className="font-bold text-sm mb-4 text-white">{t('mySkills')}</h3>
            <div className="space-y-3">
              {['Strategic Planning', 'Product Management', 'Leadership'].map((skill, idx) => (
                <div key={idx} className="flex justify-between items-center text-sm text-gray-400">
                  <span>{skill}</span>
                  <button className="text-[#FFD700] hover:bg-[#FFD700]/10 px-2 py-0.5 rounded text-xs border border-[#FFD700]/20 transition-colors">
                    +1 {t('endorse')}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {userType === 'idea' && marketData && (
            <div className="linear-card p-6 rounded-2xl relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-[#FFD700]/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="flex justify-between items-start mb-4 relative z-10">
                <h3 className="font-bold flex items-center gap-2 text-[#FFD700]">
                  <Sparkles size={16} />
                  {t('marketInsight')}
                </h3>
                <span className="text-[10px] bg-[#FFD700]/10 text-[#FFD700] px-2 py-1 rounded-full border border-[#FFD700]/20 flex items-center gap-1">
                  <span className="w-1 h-1 rounded-full bg-[#FFD700] animate-pulse" />
                  {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>

              <div className="space-y-4 relative z-10">
                <div>
                  <div className="flex justify-between text-xs mb-2 text-gray-400">
                    <span>{t('successProb')}</span>
                    <span className={`font-mono font-bold ${marketData.trend === 'up' ? 'text-green-400' : marketData.trend === 'down' ? 'text-red-400' : 'text-yellow-400'}`}>
                      {marketData.percentage}% 
                      {marketData.trend === 'up' ? ' ↑' : marketData.trend === 'down' ? ' ↓' : ' -'}
                    </span>
                  </div>
                  <div className="h-1.5 bg-[#141517] rounded-full overflow-hidden border border-white/5">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${marketData.percentage}%` }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                      className={`h-full ${marketData.trend === 'up' ? 'bg-gradient-to-r from-green-500 to-emerald-400' : marketData.trend === 'down' ? 'bg-gradient-to-r from-red-500 to-orange-400' : 'bg-gradient-to-r from-yellow-500 to-amber-400'} shadow-[0_0_10px_rgba(255,215,0,0.2)]`} 
                    />
                  </div>
                </div>
                
                <div className="bg-[#141517]/50 p-3 rounded-lg border border-white/5 text-xs text-gray-300 leading-relaxed">
                  <p className="flex gap-2">
                    <TrendingUp size={14} className="text-[#FFD700] shrink-0 mt-0.5" />
                    {t(marketData.insight)}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {activeTab === 'overview' && (
            <>
              {userType === 'idea' && (
                <>
                   <div className="bg-[#FFD700]/5 border border-[#FFD700]/10 p-4 rounded-xl flex items-start gap-3 relative overflow-hidden">
                     <div className="absolute top-0 left-0 w-1 h-full bg-[#FFD700]" />
                     <Lightbulb className="text-[#FFD700] shrink-0 mt-1" size={20} />
                     <div>
                       <h4 className="font-bold text-[#FFD700] text-sm mb-1">{t('marketTip')}</h4>
                       <p className="text-sm text-gray-400 leading-relaxed">
                         {t('raedDesc')}
                       </p>
                     </div>
                   </div>
                   <ChatInterface userType={userType} />
                </>
              )}

              {userType === 'skill' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-bold">{t('exploreIdeas')}</h3>
                    <button className="text-xs text-[#8A8F98] hover:text-white transition-colors">{t('learnMore')}</button>
                  </div>
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="linear-card p-6 rounded-2xl hover:bg-white/[0.02] transition-colors cursor-pointer group border-l-4 border-l-transparent hover:border-l-[#FFD700]">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h4 className="font-bold text-lg group-hover:text-[#FFD700] transition-colors">{t('edTechPlatform')}</h4>
                          <p className="text-[#8A8F98] text-sm mt-1">{t('educationRiyadh')}</p>
                        </div>
                        <span className="bg-[#FFD700]/10 text-[#FFD700] border border-[#FFD700]/20 text-xs font-bold px-3 py-1 rounded-full">
                          {t('equity10')}
                        </span>
                      </div>
                      <p className="text-gray-400 text-sm mb-4 leading-relaxed">
                        {t('lookingForCoFounder')}
                      </p>
                      <div className="flex justify-between items-center text-xs text-[#8A8F98] pt-4 border-t border-white/5">
                        <span>{t('posted2DaysAgo')}</span>
                        <button className="text-white hover:text-[#FFD700] flex items-center gap-1 transition-colors">
                          {t('learnMore')} <ArrowLeft size={12} className="rtl:rotate-0 rotate-180" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {userType === 'investor' && (
                <div className="space-y-6">
                  <div className="flex gap-2 mb-6 overflow-x-auto pb-2 no-scrollbar">
                    <button className="px-4 py-2 rounded-full bg-[#FFD700] text-black text-sm font-bold whitespace-nowrap shadow-lg shadow-[#FFD700]/20">{t('opt_all_sectors')}</button>
                    <button className="px-4 py-2 rounded-full bg-[#141517] border border-white/10 text-gray-300 text-sm whitespace-nowrap hover:bg-white/5 transition-colors">{t('opt_fintech')}</button>
                    <button className="px-4 py-2 rounded-full bg-[#141517] border border-white/10 text-gray-300 text-sm whitespace-nowrap hover:bg-white/5 transition-colors">{t('opt_healthtech')}</button>
                    <button className="px-4 py-2 rounded-full bg-[#141517] border border-white/10 text-gray-300 text-sm whitespace-nowrap hover:bg-white/5 transition-colors">{t('opt_edtech')}</button>
                  </div>
                  
                  <div className="grid gap-4">
                    {[1, 2].map((i) => (
                      <div key={i} className="linear-card p-6 rounded-2xl hover:bg-white/[0.02] transition-colors group">
                        <div className="flex items-center justify-between mb-6">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-[#141517] border border-white/10 rounded-xl flex items-center justify-center text-2xl shadow-inner">
                              🚀
                            </div>
                            <div>
                              <h4 className="font-bold text-lg group-hover:text-[#FFD700] transition-colors">{i === 1 ? t('finTechProject') : t('healthTechProject')}</h4>
                              <p className="text-xs text-[#8A8F98] mt-1">{t('seedStageRiyadh')}</p>
                            </div>
                          </div>
                          <div className="bg-green-500/10 p-2 rounded-lg border border-green-500/20 text-green-500">
                            <Shield size={20} />
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-4 mb-6">
                          <div className="bg-[#141517] p-3 rounded-xl border border-white/5 text-center">
                            <p className="text-[10px] text-[#8A8F98] uppercase tracking-wider mb-1">{t('valuation')}</p>
                            <p className="font-bold text-[#FFD700] font-mono">{t('sar3m')}</p>
                          </div>
                          <div className="bg-[#141517] p-3 rounded-xl border border-white/5 text-center">
                            <p className="text-[10px] text-[#8A8F98] uppercase tracking-wider mb-1">{t('team')}</p>
                            <p className="font-bold text-white">{t('complete')}</p>
                          </div>
                          <div className="bg-[#141517] p-3 rounded-xl border border-white/5 text-center">
                            <p className="text-[10px] text-[#8A8F98] uppercase tracking-wider mb-1">{t('raedScore')}</p>
                            <p className="font-bold text-green-400 font-mono">92/100</p>
                          </div>
                        </div>
                        
                        <button className="w-full py-3 rounded-xl border border-[#FFD700]/30 text-[#FFD700] hover:bg-[#FFD700] hover:text-black transition-all text-sm font-bold shadow-lg hover:shadow-[#FFD700]/20">
                          {t('learnMore')}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          {activeTab === 'matches' && (
            <div className="space-y-4">
              <h3 className="text-xl font-bold mb-4">{t('aiMatches')}</h3>
              
              {/* Explore Section Integration */}
              {userType === 'investor' ? (
                <ExploreSection type="projects" />
              ) : (
                <ExploreSection type="cofounders" />
              )}
            </div>
          )}

          {activeTab === 'performance' && (
             <div className="space-y-4">
               <h3 className="text-xl font-bold mb-4">{t('performance')}</h3>
               
               {/* Key Metrics */}
               <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                 <div className="linear-card p-6 rounded-2xl border border-white/5">
                   <h4 className="text-sm text-gray-400 mb-2">Profile Strength</h4>
                   <div className="flex items-end gap-2">
                     <div className="text-3xl font-bold text-[#FFD700]">85%</div>
                     <span className="text-xs text-green-400 mb-1">Excellent</span>
                   </div>
                   <div className="w-full bg-white/10 h-1.5 rounded-full mt-3 overflow-hidden">
                     <motion.div 
                       initial={{ width: 0 }}
                       animate={{ width: '85%' }}
                       transition={{ duration: 1 }}
                       className="bg-[#FFD700] h-full rounded-full" 
                     />
                   </div>
                 </div>
                 
                 <div className="linear-card p-6 rounded-2xl border border-white/5">
                   <h4 className="text-sm text-gray-400 mb-2">Response Rate</h4>
                   <div className="text-3xl font-bold text-green-400">92%</div>
                   <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                     <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                     Avg. response time: 2h
                   </p>
                 </div>
                 
                 <div className="linear-card p-6 rounded-2xl border border-white/5">
                   <h4 className="text-sm text-gray-400 mb-2">Top Idea</h4>
                   <div className="text-xl font-bold text-white truncate mb-1">FinTech Pay</div>
                   <div className="flex items-center gap-1 text-xs text-green-400">
                     <TrendingUp size={12} />
                     <span>+15% engagement this week</span>
                   </div>
                 </div>
               </div>

               <div className="grid md:grid-cols-3 gap-4">
                 {/* Engagement Chart */}
                 <div className="md:col-span-2 linear-card p-6 rounded-2xl border border-white/5">
                   <h4 className="text-sm text-gray-400 mb-4">Engagement Trend</h4>
                   <div className="h-64 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={[
                          {name: 'Jan', val: 400}, {name: 'Feb', val: 300}, {name: 'Mar', val: 600}, 
                          {name: 'Apr', val: 800}, {name: 'May', val: 500}, {name: 'Jun', val: 900},
                          {name: 'Jul', val: 1000}
                        ]}>
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                          <XAxis dataKey="name" stroke="#666" tick={{fontSize: 12}} axisLine={false} tickLine={false} />
                          <YAxis stroke="#666" tick={{fontSize: 12}} axisLine={false} tickLine={false} />
                          <Tooltip 
                            contentStyle={{ backgroundColor: '#141517', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px' }}
                            itemStyle={{ color: '#FFD700' }}
                          />
                          <Line type="monotone" dataKey="val" stroke="#FFD700" strokeWidth={3} dot={{r: 4, fill: '#141517', strokeWidth: 2}} activeDot={{r: 6}} />
                        </LineChart>
                      </ResponsiveContainer>
                   </div>
                 </div>

                 {/* Partnership Pie Chart */}
                 <div className="linear-card p-6 rounded-2xl border border-white/5">
                   <h4 className="text-sm text-gray-400 mb-4">{t('partnershipCalc')}</h4>
                   <div className="h-64 w-full">
                     <ResponsiveContainer width="100%" height="100%">
                       <PieChart>
                         <Pie
                           data={[
                             { name: 'Idea', value: 40, color: '#FFD700' },
                             { name: 'Skill', value: 30, color: '#3b82f6' },
                             { name: 'Execution', value: 30, color: '#22c55e' },
                           ]}
                           cx="50%"
                           cy="50%"
                           innerRadius={60}
                           outerRadius={80}
                           paddingAngle={5}
                           dataKey="value"
                         >
                           <Cell key="cell-0" fill="#FFD700" />
                           <Cell key="cell-1" fill="#3b82f6" />
                           <Cell key="cell-2" fill="#22c55e" />
                         </Pie>
                         <Tooltip 
                           contentStyle={{ backgroundColor: '#141517', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px' }}
                           itemStyle={{ color: '#fff' }}
                         />
                       </PieChart>
                     </ResponsiveContainer>
                   </div>
                   <div className="flex justify-center gap-4 mt-4 text-xs">
                     <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#FFD700]"></span> Idea (40%)</div>
                     <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-500"></span> Skill (30%)</div>
                     <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500"></span> Exec (30%)</div>
                   </div>
                 </div>
               </div>
             </div>
          )}
        </div>
      </div>
    </div>
  );
};

const PageLoader = () => (
  <div className="min-h-screen pt-32 px-4 max-w-7xl mx-auto">
     <div className="space-y-6 animate-pulse">
        <div className="h-8 bg-white/10 rounded w-1/3"></div>
        <div className="h-64 bg-white/5 rounded-2xl border border-white/5"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           <div className="h-40 bg-white/5 rounded-2xl border border-white/5"></div>
           <div className="h-40 bg-white/5 rounded-2xl border border-white/5"></div>
           <div className="h-40 bg-white/5 rounded-2xl border border-white/5"></div>
        </div>
     </div>
  </div>
);

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

function AppContent() {
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState<Page>('home');
  const [userType, setUserType] = useState<UserType>(null);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [showSessionWarning, setShowSessionWarning] = useState(false);
  const { user, signOut } = useAuth();
  const sessionTimer = useRef<NodeJS.Timeout>();
  const warningTimer = useRef<NodeJS.Timeout>();

  const resetSessionTimer = () => {
    if (sessionTimer.current) clearTimeout(sessionTimer.current);
    if (warningTimer.current) clearTimeout(warningTimer.current);
    setShowSessionWarning(false);

    if (user) {
      warningTimer.current = setTimeout(() => setShowSessionWarning(true), WARNING_TIMEOUT_MS);
      sessionTimer.current = setTimeout(() => {
        signOut();
        setPage('home');
      }, SESSION_TIMEOUT_MS);
    }
  };

  useEffect(() => {
    const events = ['mousedown', 'keydown', 'scroll', 'touchstart'];
    const handleActivity = () => resetSessionTimer();

    events.forEach(event => window.addEventListener(event, handleActivity));
    resetSessionTimer();

    return () => {
      events.forEach(event => window.removeEventListener(event, handleActivity));
      if (sessionTimer.current) clearTimeout(sessionTimer.current);
      if (warningTimer.current) clearTimeout(warningTimer.current);
    };
  }, [user]);

  useEffect(() => {
    const storedUserType = localStorage.getItem('ruwad_user_type');
    const storedOnboardingData = localStorage.getItem('ruwad_onboarding_data');
    
    if (storedUserType && storedOnboardingData) {
      setUserType(storedUserType as UserType);
      // If we have data, we can skip to dashboard, but let's keep loading screen for effect
      // The loading screen will finish and then we'll be on dashboard
      setPage('dashboard');
    }
  }, []);

  const handleStart = () => {
    setPage('register');
    window.scrollTo(0, 0);
  };

  const handleUserTypeSelect = (type: UserType) => {
    setUserType(type);
    setPage('onboarding');
    window.scrollTo(0, 0);
  };

  const handleOnboardingComplete = async (data: any) => {
    console.log('Onboarding data:', data);
    if (userType) {
      localStorage.setItem('ruwad_user_type', userType);
      localStorage.setItem('ruwad_onboarding_data', JSON.stringify(data));

      if (user) {
        try {
          const { error } = await supabase
            .from('profiles')
            .upsert({
              id: user.id,
              user_type: userType,
              onboarding_data: data,
              updated_at: new Date().toISOString(),
            });
            
          if (error) {
            console.error('Error saving profile:', error);
          }
        } catch (err) {
          console.error('Error saving profile:', err);
        }
      }
    }
    setPage('dashboard');
    window.scrollTo(0, 0);
  };

  return (
    <>
      <Analytics />
      <AnimatePresence>
        {loading && <LoadingScreen onComplete={() => setLoading(false)} />}
        {showSessionWarning && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-8 right-8 z-50 bg-[#141517] border border-red-500/20 p-6 rounded-2xl shadow-2xl max-w-sm"
          >
            <h4 className="text-lg font-bold text-white mb-2">انتهت جلستك</h4>
            <p className="text-gray-400 text-sm mb-4">هل تريد البقاء متصلاً؟ سيتم تسجيل خروجك خلال دقيقة.</p>
            <div className="flex gap-3">
              <button onClick={resetSessionTimer} className="flex-1 bg-[#FFD700] text-black font-bold py-2 rounded-lg text-sm">نعم، ابقني متصلاً</button>
              <button onClick={() => signOut()} className="flex-1 bg-white/10 text-white font-bold py-2 rounded-lg text-sm">خروج</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!loading && (
        <div className="min-h-screen flex flex-col font-sans">
          <Navbar onNavigate={setPage} onFeedback={() => setIsFeedbackOpen(true)} />
          
          <main className="flex-grow">
            <Suspense fallback={<PageLoader />}>
              <AnimatePresence mode="wait">
                {page === 'home' && (
                <motion.div
                  key="home"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <Hero onStart={handleStart} />
                  <ProblemSolution />
                  <Pricing />
                  <RaedSection />
                </motion.div>
              )}

              {page === 'register' && (
                <motion.div
                  key="register"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <RegisterPage onSelectType={handleUserTypeSelect} />
                </motion.div>
              )}

              {page === 'marketplace' && (
                <motion.div
                  key="marketplace"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <Marketplace />
                </motion.div>
              )}

              {page === 'profile-skill' && (
                <motion.div
                  key="profile-skill"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <SkillProfile />
                </motion.div>
              )}

              {page === 'profile-founder' && (
                <motion.div
                  key="profile-founder"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <FounderProfile />
                </motion.div>
              )}

              {page === 'profile-investor' && (
                <motion.div
                  key="profile-investor"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <InvestorProfile />
                </motion.div>
              )}

              {page === 'onboarding' && (
                <motion.div
                  key="onboarding"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <Onboarding userType={userType} onComplete={handleOnboardingComplete} />
                </motion.div>
              )}

              {page === 'dashboard' && (
                <motion.div
                  key="dashboard"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <Dashboard userType={userType} />
                </motion.div>
              )}

              {page === 'about' && (
                <motion.div key="about" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <AboutPage />
                </motion.div>
              )}

              {page === 'contact' && (
                <motion.div key="contact" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <ContactPage />
                </motion.div>
              )}

              {page === 'privacy' && (
                <motion.div key="privacy" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <PrivacyPage />
                </motion.div>
              )}

              {page === 'terms' && (
                <motion.div key="terms" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <TermsPage />
                </motion.div>
              )}

              {page === 'messages' && (
                <motion.div key="messages" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <MessagesPage />
                </motion.div>
              )}

              {page === 'referral' && (
                <motion.div key="referral" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <ReferralPage />
                </motion.div>
              )}

              {page === 'contract' && (
                <motion.div key="contract" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <ContractPage />
                </motion.div>
              )}

              {page === 'support' && (
                <motion.div key="support" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <SupportPage />
                </motion.div>
              )}

              {page === 'founder-dashboard' && (
                <motion.div key="founder-dashboard" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <FounderDashboard />
                </motion.div>
              )}
              </AnimatePresence>
            </Suspense>
          </main>

          <Footer onNavigate={setPage} />
          <FeedbackModal isOpen={isFeedbackOpen} onClose={() => setIsFeedbackOpen(false)} />
          <CookieConsent />
        </div>
      )}
    </>
  );
}
