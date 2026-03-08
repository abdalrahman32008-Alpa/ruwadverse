import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export const AuthCallbackPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuth = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error || !session) {
        navigate('/auth');
        return;
      }

      // Check onboarding status
      const { data: profile } = await supabase
        .from('profiles')
        .select('onboarding_completed')
        .eq('id', session.user.id)
        .single();

      if (!profile || !profile.onboarding_completed) {
        navigate('/onboarding');
      } else {
        const redirectTo = sessionStorage.getItem('redirect_after_login');
        sessionStorage.removeItem('redirect_after_login');
        navigate(redirectTo || '/feed');
      }
    };

    handleAuth();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-[#0d1117] flex flex-col items-center justify-center gap-4">
      <div className="w-12 h-12 border-4 border-[#FFD700] border-t-transparent rounded-full animate-spin" />
      <p className="text-white font-tajawal text-lg">جارٍ تسجيل الدخول...</p>
    </div>
  );
};
