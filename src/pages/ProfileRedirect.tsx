import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { motion } from 'motion/react';

export const ProfileRedirect = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const checkUserType = async () => {
      if (!user) {
        navigate('/auth');
        return;
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('user_type')
        .eq('id', user.id)
        .single();

      if (profile?.user_type === 'skill') {
        navigate('/profile-skill');
      } else if (profile?.user_type === 'investor') {
        navigate('/profile-investor');
      } else {
        navigate('/profile-founder');
      }
    };

    checkUserType();
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-[#0d1117] flex items-center justify-center relative overflow-hidden">
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

      <div className="w-12 h-12 border-4 border-[#FFD700] border-t-transparent rounded-full animate-spin relative z-10" />
    </div>
  );
};
