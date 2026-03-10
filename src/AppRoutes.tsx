import React from 'react';
import { Routes, Route, useLocation, Outlet } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { Layout } from './components/layout/Layout';
import { LandingPage } from './components/layout/LandingPage';
import { AuthPage } from './pages/AuthPage';
import { AuthCallbackPage } from './pages/AuthCallbackPage';
import { ProtectedRoute } from './components/ProtectedRoute';
import { FeedPage } from './pages/FeedPage';
import { MarketplacePage } from './pages/MarketplacePage';
import { RAEDChatPage } from './pages/RAEDChatPage';
import { ProfilePage } from './pages/ProfilePage';
import { MessagesPage } from './pages/MessagesPage';
import { NotificationsPage } from './pages/NotificationsPage';
import { SettingsPage } from './pages/SettingsPage';
import { CreateIdeaPage } from './pages/CreateIdeaPage';
import { BookmarksPage } from './pages/BookmarksPage';
import { AchievementsPage } from './pages/AchievementsPage';
import { AdminDashboard } from './pages/AdminDashboard';
import { CommunityPage } from './pages/CommunityPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { OnboardingTour } from './components/OnboardingTour';
import { WhatsNewModal } from './components/WhatsNewModal';
import { AuthPromptModal } from './components/auth/AuthPromptModal';

import { PricingPage } from './pages/PricingPage';

const PageTransition = ({ children }: { children: React.ReactNode }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.3 }}
  >
    {children}
  </motion.div>
);

const LayoutWrapper = () => (
  <Layout>
    <Outlet />
    <OnboardingTour />
    <WhatsNewModal />
    {/* AuthPromptModal is controlled locally or via context, but we can put it here if we had a global state */}
  </Layout>
);

export const AppRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <div key={location.pathname} className="w-full">
        <Routes location={location}>
          {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/auth/callback" element={<AuthCallbackPage />} />

        {/* Public Routes with Layout (Navbar only for visitors) */}
        <Route element={<LayoutWrapper />}>
          <Route path="/marketplace" element={<PageTransition><MarketplacePage /></PageTransition>} />
        </Route>

        {/* Protected Routes */}
        <Route element={<ProtectedRoute><LayoutWrapper /></ProtectedRoute>}>
          <Route path="/feed" element={<PageTransition><FeedPage /></PageTransition>} />
          <Route path="/community" element={<PageTransition><CommunityPage /></PageTransition>} />
          <Route path="/raed" element={<PageTransition><RAEDChatPage /></PageTransition>} />
          <Route path="/messages" element={<PageTransition><MessagesPage /></PageTransition>} />
          <Route path="/notifications" element={<PageTransition><NotificationsPage /></PageTransition>} />
          <Route path="/profile/me" element={<PageTransition><ProfilePage isMe /></PageTransition>} />
          <Route path="/profile/:id" element={<PageTransition><ProfilePage /></PageTransition>} />
          <Route path="/settings" element={<PageTransition><SettingsPage /></PageTransition>} />
          <Route path="/ideas/new" element={<PageTransition><CreateIdeaPage /></PageTransition>} />
          <Route path="/bookmarks" element={<PageTransition><BookmarksPage /></PageTransition>} />
          <Route path="/achievements" element={<PageTransition><AchievementsPage /></PageTransition>} />
          <Route path="/admin" element={<PageTransition><AdminDashboard /></PageTransition>} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      </div>
    </AnimatePresence>
  );
};
