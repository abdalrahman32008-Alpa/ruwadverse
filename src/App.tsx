import React, { useState, useEffect, useRef, Suspense } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Logo } from './components/Logo';
import { generateRaedResponse } from './services/raed';
import { ArrowLeft, Check, ChevronDown, Lightbulb, Briefcase, Sparkles, Shield, TrendingUp, Menu, X, MessageSquare, Globe, Search, Terminal, Activity, Eye, Network } from 'lucide-react';
import { ChatInterface } from './components/ChatInterface';
import { Onboarding } from './components/Onboarding';
import { OnboardingTutorial } from './components/OnboardingTutorial';
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
import { supabase, isSupabaseConfigured } from './lib/supabase';
import { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './components/ProtectedRoute';
import { siteConfig } from './config';

import { AuthPage } from './pages/AuthPage';
import { AuthCallbackPage } from './pages/AuthCallbackPage';
import { ResetPasswordPage } from './pages/ResetPasswordPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { RaedPage } from './pages/RaedPage';
import { NotificationsPage } from './pages/NotificationsPage';
import { ProfileRedirect } from './pages/ProfileRedirect';
import { NewIdeaPage } from './pages/NewIdeaPage';
import { HomePage } from './pages/HomePage';
import { ProfilePage } from './pages/ProfilePage';
import { Sidebar } from './components/layout/Sidebar';
import { Navbar } from './components/layout/Navbar';
import { BottomNav } from './components/layout/BottomNav';
import { RAEDAgent } from './components/RAEDAgent';
import { EnthusiasmEngine } from './components/EnthusiasmEngine';
import { SystemHealthDashboard } from './components/SystemHealthDashboard';

// Lazy Load Pages
const AboutPage = React.lazy(() => import('./pages/AboutPage').then(module => ({ default: module.AboutPage })));
const ContactPage = React.lazy(() => import('./pages/ContactPage').then(module => ({ default: module.ContactPage })));
const PrivacyPage = React.lazy(() => import('./pages/PrivacyPage').then(module => ({ default: module.PrivacyPage })));
const TermsPage = React.lazy(() => import('./pages/TermsPage').then(module => ({ default: module.TermsPage })));
const FeedPage = React.lazy(() => import('./pages/FeedPage').then(module => ({ default: module.FeedPage })));
const MessagesPage = React.lazy(() => import('./pages/MessagesPage').then(module => ({ default: module.MessagesPage })));
const AchievementsPage = React.lazy(() => import('./pages/AchievementsPage').then(module => ({ default: module.AchievementsPage })));
const ProjectWorkspacePage = React.lazy(() => import('./pages/ProjectWorkspacePage').then(module => ({ default: module.ProjectWorkspacePage })));
const MarketTrendsDashboard = React.lazy(() => import('./pages/MarketTrendsDashboard').then(module => ({ default: module.MarketTrendsDashboard })));
const SettingsPage = React.lazy(() => import('./pages/SettingsPage').then(module => ({ default: module.SettingsPage })));
const IdeaDetailPage = React.lazy(() => import('./pages/IdeaDetailPage').then(module => ({ default: module.IdeaDetailPage })));
const ReferralPage = React.lazy(() => import('./pages/ReferralPage').then(module => ({ default: module.ReferralPage })));
const ContractPage = React.lazy(() => import('./pages/ContractPage').then(module => ({ default: module.ContractPage })));
const SupportPage = React.lazy(() => import('./pages/SupportPage').then(module => ({ default: module.SupportPage })));
const FounderDashboard = React.lazy(() => import('./pages/FounderDashboard').then(module => ({ default: module.FounderDashboard })));
const DealRoomPage = React.lazy(() => import('./pages/DealRoomPage').then(module => ({ default: module.DealRoomPage })));
const ProjectBuildingPage = React.lazy(() => import('./pages/ProjectBuildingPage').then(module => ({ default: module.ProjectBuildingPage })));
const MarketNewsPage = React.lazy(() => import('./pages/MarketNewsPage').then(module => ({ default: module.MarketNewsPage })));

import { LandingPage } from './components/layout/LandingPage';

// --- Types ---
type UserType = 'idea' | 'skill' | 'investor' | null;
type Page = 'home' | 'register' | 'onboarding' | 'dashboard' | 'profile-skill' | 'profile-founder' | 'profile-investor' | 'marketplace' | 'about' | 'contact' | 'privacy' | 'terms' | 'messages' | 'referral' | 'contract' | 'founder-dashboard' | 'support';

// --- Components ---

import { KYCVerification } from './components/KYCVerification';
import { SESSION_TIMEOUT_MS, WARNING_TIMEOUT_MS } from './utils/security';
import { calculateUserLevel } from './utils/gamification';
import { GlobalSearch } from './components/GlobalSearch';
import { ErrorBoundary } from './components/ErrorBoundary';
import * as Sentry from "@sentry/react";
import { Toaster } from 'react-hot-toast';

import { useUserTracker } from './hooks/useUserTracker';

const SupabaseWarning = () => {
  if (isSupabaseConfigured) return null;
  return (
    <div className="fixed top-0 left-0 right-0 z-[9999] bg-red-600 text-white px-4 py-2 text-center text-sm font-medium shadow-lg">
      ⚠️ تنبيه: متغيرات Supabase مفقودة. يرجى إضافتها في لوحة التحكم (Secrets) ليعمل نظام تسجيل الدخول.
    </div>
  );
};

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

const Footer = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
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
              <li><button onClick={() => navigate('/about')} className="hover:text-[#FFD700] transition-colors">{t('about')}</button></li>
              <li><button onClick={() => navigate('/contact')} className="hover:text-[#FFD700] transition-colors">{t('contact')}</button></li>
              <li><button onClick={() => navigate('/support')} className="hover:text-[#FFD700] transition-colors">{t('supportTitle')}</button></li>
              <li><a href="#" className="hover:text-[#FFD700] transition-colors">{t('features')}</a></li>
              <li><a href="#" className="hover:text-[#FFD700] transition-colors">{t('pricingTitle')}</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4 text-white">{t('legal')}</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><button onClick={() => navigate('/privacy')} className="hover:text-[#FFD700] transition-colors">{t('privacyTitle')}</button></li>
              <li><button onClick={() => navigate('/terms')} className="hover:text-[#FFD700] transition-colors">{t('termsTitle')}</button></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4 text-white">{t('social')}</h4>
            <div className="flex gap-4 mb-6">
              <a href={siteConfig.socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-[#FFD700] hover:text-black transition-all">
                <span className="sr-only">Twitter</span>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path></svg>
              </a>
              <a href={siteConfig.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-[#FFD700] hover:text-black transition-all">
                <span className="sr-only">LinkedIn</span>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
              </a>
              <a href={siteConfig.socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-[#FFD700] hover:text-black transition-all">
                <span className="sr-only">Instagram</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
              </a>
            </div>
            <h4 className="font-bold mb-4 text-white">{t('contact')}</h4>
            <a href={`mailto:${siteConfig.contact.email}`} className="text-sm text-gray-400 hover:text-[#FFD700] transition-colors flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
              {siteConfig.contact.email}
            </a>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-white/5 text-center text-sm text-gray-500">
          &copy; {new Date().getFullYear()} Ruwadverse. {t('allRightsReserved')}
        </div>
      </div>
    </footer>
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
          <div className="flex flex-col gap-6 max-w-2xl mx-auto">
            {types.map((type) => (
              <button
                key={type.id}
                onClick={() => onSelectType(type.id as UserType)}
                className="w-full rounded-2xl border border-[#21262d] bg-[#161b22] p-8 hover:border-[#FFD700] transition-all duration-300 cursor-pointer min-h-[200px] flex flex-col md:flex-row items-center md:items-start text-center md:text-start gap-6 relative overflow-hidden group"
              >
                <div className={`w-16 h-16 shrink-0 rounded-2xl ${type.bg} ${type.border} border flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                  <div className={type.color}>{type.icon}</div>
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold mb-3">{type.title}</h3>
                  <p className="text-[#8b949e] text-base leading-relaxed mb-6">{type.desc}</p>
                  <div className="inline-flex items-center gap-2 text-sm font-bold text-[#FFD700] group-hover:translate-x-[-8px] rtl:group-hover:translate-x-[8px] transition-transform">
                    <span>{t('startNow')}</span>
                    <ArrowLeft size={16} className="rotate-180 rtl:rotate-0" />
                  </div>
                </div>
                <div className={`absolute inset-0 bg-gradient-to-r ${type.bg} to-transparent opacity-0 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none`} />
              </button>
            ))}
            
            {/* KYC Trigger */}
            <div className="mt-8 flex justify-center">
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
      <OnboardingTutorial />
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
            <div className="space-y-6">
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

              {/* RAED Intelligence Hub (Founder) */}
              <div className="bg-[#0B0C0E] border border-white/10 p-6 rounded-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
                <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                  <Terminal size={16} className="text-green-500" />
                  RAED Intelligence Hub
                </h3>
                <div className="space-y-3">
                  <div className="bg-black/40 border border-white/5 p-3 rounded-xl flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Activity size={14} className="text-blue-400" />
                      <span className="text-xs text-gray-300">Market Simulator</span>
                    </div>
                    <span className="text-[10px] bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded border border-blue-500/20">Ready</span>
                  </div>
                  <div className="bg-black/40 border border-white/5 p-3 rounded-xl flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Terminal size={14} className="text-green-500" />
                      <span className="text-xs text-gray-300">Autonomous Co-Founder</span>
                    </div>
                    <span className="text-[10px] bg-green-500/10 text-green-400 px-2 py-0.5 rounded border border-green-500/20 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" /> Active
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {userType === 'investor' && (
            <div className="space-y-6">
              {/* RAED Intelligence Hub (Investor) */}
              <div className="bg-[#0B0C0E] border border-white/10 p-6 rounded-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
                <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                  <Network size={16} className="text-purple-400" />
                  RAED Intelligence Hub
                </h3>
                <div className="space-y-3">
                  <div className="bg-black/40 border border-white/5 p-3 rounded-xl flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Eye size={14} className="text-red-500" />
                      <span className="text-xs text-gray-300">Risk Oracle Alerts</span>
                    </div>
                    <span className="text-[10px] bg-red-500/10 text-red-400 px-2 py-0.5 rounded border border-red-500/20">2 High Risk</span>
                  </div>
                  <div className="bg-black/40 border border-white/5 p-3 rounded-xl flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Network size={14} className="text-cyan-400" />
                      <span className="text-xs text-gray-300">Quantum Cap Table</span>
                    </div>
                    <span className="text-[10px] bg-cyan-500/10 text-cyan-400 px-2 py-0.5 rounded border border-cyan-500/20">Updated</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {activeTab === 'overview' && (
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-6">
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
              </div>

              <div className="space-y-6">
                <EnthusiasmEngine role={userType as any} />
              </div>
            </div>
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

function App() {
  return (
    <Sentry.ErrorBoundary
      fallback={
        <div style={{
          minHeight: '100vh',
          background: '#0d1117',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '16px',
          fontFamily: 'Tajawal'
        }}>
          <p style={{ color: '#FFD700', fontSize: '24px' }}>
            حدث خطأ غير متوقع
          </p>
          <p style={{ color: '#ffffff', fontSize: '16px' }}>
            تم إرسال تقرير للفريق التقني تلقائياً
          </p>
          <button
            onClick={() => window.location.href = '/'}
            style={{
              background: '#FFD700',
              color: '#0d1117',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '8px',
              fontSize: '16px',
              cursor: 'pointer',
              fontFamily: 'Tajawal'
            }}
          >
            العودة للرئيسية
          </button>
        </div>
      }
      showDialog
    >
      <ErrorBoundary>
        <AuthProvider>
          <AppContent />
          <Toaster position="top-center" toastOptions={{
            style: {
              background: '#141517',
              color: '#fff',
              border: '1px solid rgba(255,255,255,0.1)',
            },
          }} />
        </AuthProvider>
      </ErrorBoundary>
    </Sentry.ErrorBoundary>
  );
}

export default Sentry.withProfiler(App);

function AppContent() {
  const [loading, setLoading] = useState(true);
  const [userType, setUserType] = useState<UserType>(null);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAuditOpen, setIsAuditOpen] = useState(false);
  
  // تفعيل نظام التتبع والتعلم الآلي
  useUserTracker();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showSessionWarning, setShowSessionWarning] = useState(false);
  const { user, signOut } = useAuth();
  const { dir } = useLanguage();
  const sessionTimer = useRef<NodeJS.Timeout | undefined>(undefined);
  const warningTimer = useRef<NodeJS.Timeout | undefined>(undefined);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const resetSessionTimer = () => {
    if (sessionTimer.current) clearTimeout(sessionTimer.current);
    if (warningTimer.current) clearTimeout(warningTimer.current);
    setShowSessionWarning(false);

    if (user) {
      warningTimer.current = setTimeout(() => setShowSessionWarning(true), WARNING_TIMEOUT_MS);
      sessionTimer.current = setTimeout(() => {
        signOut();
        navigate('/');
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
    
    if (user && storedUserType && storedOnboardingData) {
      setUserType(storedUserType as UserType);
      // If we have data, we can skip to dashboard, but let's keep loading screen for effect
      // The loading screen will finish and then we'll be on dashboard
      if (location.pathname === '/') {
        navigate('/home');
      }
    }
  }, [user]);

  const handleUserTypeSelect = (type: UserType) => {
    setUserType(type);
    navigate('/onboarding');
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
              raed_score: data.raed_score || 0,
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
    navigate('/home');
    window.scrollTo(0, 0);
  };

  return (
    <>
      <SupabaseWarning />
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
        <div className="min-h-screen flex flex-col font-sans overflow-x-hidden">
          <Navbar onFeedback={() => setIsFeedbackOpen(true)} onSearch={() => setIsSearchOpen(true)} onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
          <GlobalSearch isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
          
          <div className={`flex flex-1 pt-16 ${user ? 'pb-24 md:pb-0' : ''}`}>
            {user && (
              <div className="hidden md:block">
                <Sidebar isOpen={isSidebarOpen} />
              </div>
            )}
            <main className={`flex-1 transition-all duration-300 ${user && isSidebarOpen ? (dir === 'rtl' ? 'md:mr-64' : 'md:ml-64') : ''}`}>
              <Suspense fallback={<PageLoader />}>
              <AnimatePresence mode="wait">
                <Routes location={location}>
                  <Route path="/" element={
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                      <LandingPage />
                    </motion.div>
                  } />
                  
                  <Route path="/auth" element={
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                      <AuthPage />
                    </motion.div>
                  } />
                  
                  <Route path="/auth/callback" element={
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                      <AuthCallbackPage />
                    </motion.div>
                  } />
                  
                  <Route path="/auth/reset-password" element={
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                      <ResetPasswordPage />
                    </motion.div>
                  } />

                  <Route path="/about" element={
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                      <AboutPage />
                    </motion.div>
                  } />

                  <Route path="/contact" element={
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                      <ContactPage />
                    </motion.div>
                  } />

                  <Route path="/privacy" element={
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                      <PrivacyPage />
                    </motion.div>
                  } />

                  <Route path="/terms" element={
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                      <TermsPage />
                    </motion.div>
                  } />

                  {/* Protected Routes */}
                  <Route path="/marketplace" element={
                    <ProtectedRoute>
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <Marketplace />
                      </motion.div>
                    </ProtectedRoute>
                  } />

                  <Route path="/feed" element={
                    <ProtectedRoute>
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <FeedPage />
                      </motion.div>
                    </ProtectedRoute>
                  } />

                  <Route path="/achievements" element={
                    <ProtectedRoute>
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <AchievementsPage />
                      </motion.div>
                    </ProtectedRoute>
                  } />

                  <Route path="/workspace" element={
                    <ProtectedRoute>
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <ProjectWorkspacePage />
                      </motion.div>
                    </ProtectedRoute>
                  } />

                  <Route path="/market-trends" element={
                    <ProtectedRoute>
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <MarketTrendsDashboard />
                      </motion.div>
                    </ProtectedRoute>
                  } />

                  <Route path="/settings" element={
                    <ProtectedRoute>
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <SettingsPage />
                      </motion.div>
                    </ProtectedRoute>
                  } />

                  <Route path="/idea/:id" element={
                    <ProtectedRoute>
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <IdeaDetailPage />
                      </motion.div>
                    </ProtectedRoute>
                  } />

                  <Route path="/profile-skill" element={
                    <ProtectedRoute>
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <SkillProfile />
                      </motion.div>
                    </ProtectedRoute>
                  } />

                  <Route path="/profile-founder" element={
                    <ProtectedRoute>
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <FounderProfile />
                      </motion.div>
                    </ProtectedRoute>
                  } />

                  <Route path="/profile-investor" element={
                    <ProtectedRoute>
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <InvestorProfile />
                      </motion.div>
                    </ProtectedRoute>
                  } />

                  <Route path="/onboarding" element={
                    <ProtectedRoute>
                      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                        <Onboarding userType={userType} onComplete={handleOnboardingComplete} />
                      </motion.div>
                    </ProtectedRoute>
                  } />

                  <Route path="/dashboard" element={
                    <ProtectedRoute>
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <Dashboard userType={userType} />
                      </motion.div>
                    </ProtectedRoute>
                  } />

                  <Route path="/messages" element={
                    <ProtectedRoute>
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <MessagesPage />
                      </motion.div>
                    </ProtectedRoute>
                  } />

                  <Route path="/referral" element={
                    <ProtectedRoute>
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <ReferralPage />
                      </motion.div>
                    </ProtectedRoute>
                  } />

                  <Route path="/contract" element={
                    <ProtectedRoute>
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <ContractPage />
                      </motion.div>
                    </ProtectedRoute>
                  } />

                  <Route path="/founder-dashboard" element={
                    <ProtectedRoute>
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <FounderDashboard />
                      </motion.div>
                    </ProtectedRoute>
                  } />

                  <Route path="/deal-room/:id?" element={
                    <ProtectedRoute>
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <DealRoomPage />
                      </motion.div>
                    </ProtectedRoute>
                  } />

                  <Route path="/project-building" element={
                    <ProtectedRoute>
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <ProjectBuildingPage />
                      </motion.div>
                    </ProtectedRoute>
                  } />

                  <Route path="/market-news" element={
                    <ProtectedRoute>
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <MarketNewsPage />
                      </motion.div>
                    </ProtectedRoute>
                  } />

                  <Route path="/home" element={
                    <ProtectedRoute>
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <HomePage />
                      </motion.div>
                    </ProtectedRoute>
                  } />

                  <Route path="/support" element={
                    <ProtectedRoute>
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <SupportPage />
                      </motion.div>
                    </ProtectedRoute>
                  } />

                  <Route path="/raed" element={
                    <ProtectedRoute>
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <RaedPage />
                      </motion.div>
                    </ProtectedRoute>
                  } />

                  <Route path="/community" element={<Navigate to="/feed" replace />} />

                  <Route path="/notifications" element={
                    <ProtectedRoute>
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <NotificationsPage />
                      </motion.div>
                    </ProtectedRoute>
                  } />

                  <Route path="/profile/:id" element={
                    <ProtectedRoute>
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <ProfilePage />
                      </motion.div>
                    </ProtectedRoute>
                  } />

                  <Route path="/profile/me" element={
                    <ProtectedRoute>
                      <ProfileRedirect />
                    </ProtectedRoute>
                  } />

                  <Route path="/ideas/new" element={
                    <ProtectedRoute>
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <NewIdeaPage />
                      </motion.div>
                    </ProtectedRoute>
                  } />

                  <Route path="/admin/health" element={
                    <ProtectedRoute>
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="pt-24 pb-20 px-4">
                        <SystemHealthDashboard />
                      </motion.div>
                    </ProtectedRoute>
                  } />

                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
              </AnimatePresence>
            </Suspense>
            {user && <RAEDAgent />}
            {user && <EnthusiasmEngine role={userType as any} />}
            </main>
          </div>

          {!user && <Footer />}
          {user && <BottomNav />}
          <FeedbackModal isOpen={isFeedbackOpen} onClose={() => setIsFeedbackOpen(false)} />
          <GlobalSearch isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
          <CookieConsent />
        </div>
      )}
    </>
  );
}
