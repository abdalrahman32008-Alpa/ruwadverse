import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Chrome, Apple, Linkedin } from 'lucide-react';

export const AuthPage = () => {
  const { signInWithGoogle, signInWithApple, signInWithLinkedIn } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleAuth = async (provider: 'google' | 'apple' | 'linkedin') => {
    try {
      if (provider === 'google') await signInWithGoogle();
      if (provider === 'apple') await signInWithApple();
      if (provider === 'linkedin') await signInWithLinkedIn();
    } catch (err: any) {
      setError(err.message || 'حدث خطأ أثناء تسجيل الدخول');
    }
  };

  return (
    <div className="min-h-screen bg-[#0d1117] flex items-center justify-center p-4" dir="rtl">
      <div className="w-full max-w-md p-8 rounded-3xl bg-[#141517]/80 backdrop-blur-md border border-white/10 shadow-2xl">
        <h1 className="text-3xl font-bold text-white mb-8 text-center">تسجيل الدخول إلى ruwadverse</h1>
        
        {error && <div className="p-4 mb-6 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl text-sm">{error}</div>}
        
        <div className="space-y-4">
          <button onClick={() => handleAuth('google')} className="w-full flex items-center justify-center gap-3 p-4 rounded-xl bg-white text-black font-bold hover:bg-gray-200 transition-colors">
            <Chrome size={20} /> تسجيل الدخول بـ Google
          </button>
          <button onClick={() => handleAuth('apple')} className="w-full flex items-center justify-center gap-3 p-4 rounded-xl bg-white text-black font-bold hover:bg-gray-200 transition-colors">
            <Apple size={20} /> تسجيل الدخول بـ Apple
          </button>
          <button onClick={() => handleAuth('linkedin')} className="w-full flex items-center justify-center gap-3 p-4 rounded-xl bg-[#0077b5] text-white font-bold hover:bg-[#006097] transition-colors">
            <Linkedin size={20} /> تسجيل الدخول بـ LinkedIn
          </button>
        </div>
        
        <div className="mt-8 text-center">
          <button className="text-[#FFD700] hover:underline">تسجيل بالبريد الإلكتروني</button>
        </div>
      </div>
    </div>
  );
};
