import React, { createContext, useContext, useEffect, useState } from 'react';
import * as Sentry from "@sentry/react";
import { supabase } from '../lib/supabase';
import { Session, User } from '@supabase/supabase-js';
import { SubscriptionTier } from '../types';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  loading: boolean;
  subscriptionTier: SubscriptionTier;
  signInWithGoogle: (redirectTo?: string) => Promise<void>;
  signInWithApple: (redirectTo?: string) => Promise<void>;
  signInWithLinkedIn: (redirectTo?: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [subscriptionTier, setSubscriptionTier] = useState<SubscriptionTier>('free');

  const fetchSubscriptionTier = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('subscription_tier')
        .eq('id', userId)
        .single();
      
      if (data?.subscription_tier) {
        setSubscriptionTier(data.subscription_tier as SubscriptionTier);
      } else {
        setSubscriptionTier('free');
      }
    } catch (error) {
      console.error('Error fetching subscription tier:', error);
      setSubscriptionTier('free');
    }
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchSubscriptionTier(session.user.id);
        Sentry.setUser({
          id: session.user.id,
          email: session.user.email,
          username: session.user.user_metadata?.full_name
        });
      } else {
        Sentry.setUser(null);
        setSubscriptionTier('free');
      }
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchSubscriptionTier(session.user.id);
        Sentry.setUser({
          id: session.user.id,
          email: session.user.email,
          username: session.user.user_metadata?.full_name
        });
      } else {
        Sentry.setUser(null);
        setSubscriptionTier('free');
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signInWithGoogle = async (redirectTo?: string) => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: redirectTo || `${window.location.origin}/auth/callback`
      }
    });
    if (error) {
      console.error('Error signing in with Google:', error.message);
      Sentry.captureMessage('Login failed', {
        level: 'warning',
        extra: { method: 'google', error: error.message }
      });
    }
  };

  const signInWithApple = async (redirectTo?: string) => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'apple',
      options: {
        redirectTo: redirectTo || `${window.location.origin}/auth/callback`
      }
    });
    if (error) {
      console.error('Error signing in with Apple:', error.message);
      Sentry.captureMessage('Login failed', {
        level: 'warning',
        extra: { method: 'apple', error: error.message }
      });
    }
  };

  const signInWithLinkedIn = async (redirectTo?: string) => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'linkedin',
      options: {
        redirectTo: redirectTo || `${window.location.origin}/auth/callback`
      }
    });
    if (error) {
      console.error('Error signing in with LinkedIn:', error.message);
      Sentry.captureMessage('Login failed', {
        level: 'warning',
        extra: { method: 'linkedin', error: error.message }
      });
    }
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) console.error('Error signing out:', error.message);
    Sentry.setUser(null);
    setSubscriptionTier('free');
  };

  return (
    <AuthContext.Provider value={{ session, user, loading, subscriptionTier, signInWithGoogle, signInWithApple, signInWithLinkedIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
