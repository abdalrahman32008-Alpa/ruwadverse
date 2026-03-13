import { describe, it, expect, vi } from 'vitest';
import { authService } from './authService';
import { supabase } from '../lib/supabase';

vi.mock('../lib/supabase', () => ({
  supabase: {
    auth: {
      signInWithOAuth: vi.fn(),
      signOut: vi.fn(),
      getUser: vi.fn(),
      onAuthStateChange: vi.fn(),
    },
  },
}));

describe('authService', () => {
  it('should call signInWithOAuth with google', async () => {
    await authService.signInWithGoogle();
    expect(supabase.auth.signInWithOAuth).toHaveBeenCalledWith({
      provider: 'google',
      options: expect.any(Object),
    });
  });

  it('should call signOut', async () => {
    await authService.signOut();
    expect(supabase.auth.signOut).toHaveBeenCalled();
  });
});
