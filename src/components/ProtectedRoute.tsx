import React, { useEffect, useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-hot-toast';
import { useLanguage } from '../contexts/LanguageContext';

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [shouldRedirect, setShouldRedirect] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      sessionStorage.setItem('intended_url', location.pathname);
      toast.error(t('requiredLogin'), {
        duration: 2000,
      });
      
      const timer = setTimeout(() => {
        setShouldRedirect(true);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [loading, user, location, t]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0d1117]">
        <div className="w-16 h-16 border-4 border-[#FFD700]/20 border-t-[#FFD700] rounded-full animate-spin" />
      </div>
    );
  }

  if (shouldRedirect) {
    return <Navigate to="/auth" replace />;
  }

  if (!user) {
    // Return null or a loading state while waiting for the redirect timer
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0d1117]">
        <div className="text-center">
          <h2 className="text-xl font-bold text-white mb-2">{t('loginToContinue')}</h2>
          <p className="text-gray-400">{t('requiredLogin')}</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
