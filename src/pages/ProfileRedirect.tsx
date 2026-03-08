import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

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
    <div className="min-h-screen bg-[#0d1117] flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-[#FFD700] border-t-transparent rounded-full animate-spin" />
    </div>
  );
};
