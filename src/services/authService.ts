import { supabase } from '../lib/supabase';

const redirectTo = 'https://ruwadverse.vercel.app/auth/callback';

export const authService = {
  async signInWithGoogle() {
    return await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo }
    });
  },
  async signInWithApple() {
    return await supabase.auth.signInWithOAuth({
      provider: 'apple',
      options: { redirectTo }
    });
  },
  async signInWithLinkedIn() {
    return await supabase.auth.signInWithOAuth({
      provider: 'linkedin_oidc',
      options: { redirectTo }
    });
  },
  async signOut() {
    return await supabase.auth.signOut();
  },
  async getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  },
  onAuthStateChange(callback: (event: string, session: any) => void) {
    return supabase.auth.onAuthStateChange(callback);
  }
};
