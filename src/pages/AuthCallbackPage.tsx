import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { motion } from 'motion/react';

export const AuthCallbackPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuth = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      // If we don't have a session, it might be a PKCE flow with a code in the URL
      if (!session) {
        const params = new URLSearchParams(window.location.search);
        const code = params.get('code');
        
        if (code) {
          const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
          if (exchangeError) {
            console.error('Error exchanging code for session:', exchangeError);
            navigate('/auth');
            return;
          }
          // After exchange, get the session again
          const { data: { session: newSession } } = await supabase.auth.getSession();
          if (!newSession) {
            navigate('/auth');
            return;
          }
        } else if (error) {
          navigate('/auth');
          return;
        } else {
          // No code and no session
          navigate('/auth');
          return;
        }
      }

      // Re-fetch session to be sure we have the latest
      const { data: { session: finalSession } } = await supabase.auth.getSession();
      if (!finalSession) {
        navigate('/auth');
        return;
      }

      // Check onboarding status
      const { data: profileRecord } = await supabase
        .from('profiles')
        .select('user_type, onboarding_data')
        .eq('id', finalSession.user.id)
        .single();

      if (!profileRecord || !profileRecord.user_type || !profileRecord.onboarding_data) {
        navigate('/onboarding');
      } else {
        const redirectTo = sessionStorage.getItem('redirect_after_login');
        sessionStorage.removeItem('redirect_after_login');
        navigate(redirectTo || '/home');
      }
    };

    handleAuth();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-[#0d1117] flex flex-col items-center justify-center gap-4 relative overflow-hidden">
      {/* Animated Background Shapes */}
      <motion.div 
        animate={{ y: [0, -30, 0], x: [0, 20, 0], rotate: [0, 10, 0] }} 
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-20 right-10 w-64 h-64 bg-[#FFD700]/5 rounded-full blur-3xl pointer-events-none"
      />
      <motion.div 
        animate={{ y: [0, 40, 0], x: [0, -30, 0], scale: [1, 1.2, 1] }} 
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute bottom-20 left-10 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl pointer-events-none"
      />

      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center justify-center gap-4 relative z-10"
      >
        <div className="w-12 h-12 border-4 border-[#FFD700] border-t-transparent rounded-full animate-spin" />
        <p className="text-white font-tajawal text-lg">جارٍ تسجيل الدخول...</p>
      </motion.div>
    </div>
  );
};
