import React from 'react';
import { Routes, Route } from 'react-router-dom';
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
import { SettingsPage, CreateIdeaPage, BookmarksPage, AchievementsPage, AdminDashboard } from './pages/OtherPages';

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/auth" element={<AuthPage />} />
      <Route path="/auth/callback" element={<AuthCallbackPage />} />
      <Route path="/*" element={
        <ProtectedRoute>
          <Layout>
            <Routes>
              <Route path="/feed" element={<FeedPage />} />
              <Route path="/marketplace" element={<MarketplacePage />} />
              <Route path="/raed" element={<RAEDChatPage />} />
              <Route path="/messages" element={<MessagesPage />} />
              <Route path="/notifications" element={<NotificationsPage />} />
              <Route path="/profile/:id" element={<ProfilePage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/ideas/new" element={<CreateIdeaPage />} />
              <Route path="/bookmarks" element={<BookmarksPage />} />
              <Route path="/achievements" element={<AchievementsPage />} />
              <Route path="/admin" element={<AdminDashboard />} />
            </Routes>
          </Layout>
        </ProtectedRoute>
      } />
    </Routes>
  );
};
