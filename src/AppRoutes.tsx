import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
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

export const AppRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/auth/callback" element={<AuthCallbackPage />} />
        <Route path="/*" element={
          <ProtectedRoute>
            <Layout>
              <Routes>
                <Route path="/feed" element={<PageTransition><FeedPage /></PageTransition>} />
                <Route path="/marketplace" element={<PageTransition><MarketplacePage /></PageTransition>} />
                <Route path="/raed" element={<PageTransition><RAEDChatPage /></PageTransition>} />
                <Route path="/messages" element={<PageTransition><MessagesPage /></PageTransition>} />
                <Route path="/notifications" element={<PageTransition><NotificationsPage /></PageTransition>} />
                <Route path="/profile/:id" element={<PageTransition><ProfilePage /></PageTransition>} />
                <Route path="/settings" element={<PageTransition><SettingsPage /></PageTransition>} />
                <Route path="/ideas/new" element={<PageTransition><CreateIdeaPage /></PageTransition>} />
                <Route path="/bookmarks" element={<PageTransition><BookmarksPage /></PageTransition>} />
                <Route path="/achievements" element={<PageTransition><AchievementsPage /></PageTransition>} />
                <Route path="/admin" element={<PageTransition><AdminDashboard /></PageTransition>} />
              </Routes>
            </Layout>
          </ProtectedRoute>
        } />
      </Routes>
    </AnimatePresence>
  );
};
