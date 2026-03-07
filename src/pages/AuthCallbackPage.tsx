import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export const AuthCallbackPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleCallback = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        const { user } = session;
        
        // Upsert profile
        await supabase
          .from('profiles')
          .upsert({
            id: user.id,
            full_name: user.user_metadata.full_name || '',
            avatar_url: user.user_metadata.avatar_url || '',
            updated_at: new Date().toISOString(),
          }, { onConflict: 'id' });

        // Check onboarding
        const { data: profile } = await supabase
          .from('profiles')
          .select('onboarding_completed')
          .eq('id', user.id)
          .single();

        if (profile?.onboarding_completed) {
          navigate('/dashboard');
        } else {
          navigate('/onboarding');
        }
      } else {
        navigate('/auth');
      }
    };

    handleCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0d1117]">
      <div className="w-16 h-16 border-4 border-[#FFD700] border-t-transparent rounded-full animate-spin" />
    </div>
  );
};
