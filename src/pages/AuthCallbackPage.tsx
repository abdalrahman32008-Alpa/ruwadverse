import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export const AuthCallbackPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) {
        navigate('/auth');
        return;
      }

      // Check if profile exists and onboarding is completed
      const { data: profile } = await supabase
        .from('profiles')
        .select('onboarding_completed, user_type')
        .eq('id', session.user.id)
        .single();

      if (!profile || !profile.onboarding_completed) {
        navigate('/onboarding');
        return;
      }

      // Check for redirect URL
      const redirectTo = sessionStorage.getItem('redirect_after_login');
      sessionStorage.removeItem('redirect_after_login');
      
      navigate(redirectTo || '/feed');
    });
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0d1117]">
      <div className="w-16 h-16 border-4 border-[#FFD700] border-t-transparent rounded-full animate-spin" />
    </div>
  );
};
