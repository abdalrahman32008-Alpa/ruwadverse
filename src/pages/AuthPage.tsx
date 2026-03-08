import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Chrome, Apple, Linkedin, Eye, EyeOff, Lightbulb, Briefcase, TrendingUp, Mail, Lock, User, ArrowRight } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { toast } from 'react-hot-toast';

type AuthMode = 'login' | 'register' | 'forgot_password' | 'verify_otp';
type UserType = 'idea' | 'skill' | 'investor';

export const AuthPage = () => {
  const { signInWithGoogle, signInWithApple, signInWithLinkedIn } = useAuth();
  const [mode, setMode] = useState<AuthMode>('login');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [userType, setUserType] = useState<UserType | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [otp, setOtp] = useState('');

  const handleSocialAuth = async (provider: 'google' | 'apple' | 'linkedin') => {
    try {
      sessionStorage.setItem('redirect_after_login', '/feed');
      if (provider === 'google') await signInWithGoogle();
      if (provider === 'apple') await signInWithApple();
      if (provider === 'linkedin') await signInWithLinkedIn();
    } catch (err: any) {
      setError(err.message || 'حدث خطأ أثناء تسجيل الدخول');
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      
      const redirectTo = sessionStorage.getItem('redirect_after_login');
      sessionStorage.removeItem('redirect_after_login');
      navigate(redirectTo || '/feed');
    } catch (err: any) {
      setError(err.message === 'Invalid login credentials' ? 'البريد الإلكتروني أو كلمة المرور غير صحيحة' : err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (password !== confirmPassword) {
      setError('كلمات المرور غير متطابقة');
      return;
    }
    
    if (!userType) {
      setError('يرجى اختيار نوع الحساب');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            user_type: userType,
          }
        }
      });
      
      if (error) throw error;
      
      setMode('verify_otp');
      toast.success('تم إرسال رمز التأكيد إلى بريدك الإلكتروني');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const { error } = await supabase.auth.verifyOtp({
        email,
        token: otp,
        type: 'signup'
      });
      
      if (error) throw error;
      
      navigate('/onboarding');
    } catch (err: any) {
      setError('رمز التأكيد غير صحيح أو منتهي الصلاحية');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });
      
      if (error) throw error;
      
      toast.success('تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني');
      setMode('login');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const calculatePasswordStrength = (pass: string) => {
    let strength = 0;
    if (pass.length >= 8) strength += 25;
    if (pass.match(/[A-Z]/)) strength += 25;
    if (pass.match(/[0-9]/)) strength += 25;
    if (pass.match(/[^A-Za-z0-9]/)) strength += 25;
    return strength;
  };

  const passwordStrength = calculatePasswordStrength(password);

  return (
    <div className="min-h-screen bg-[#0d1117] flex items-center justify-center p-4 relative overflow-hidden" dir="rtl">
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

      <div className="w-full max-w-md p-8 rounded-3xl bg-[#141517]/80 backdrop-blur-md border border-white/10 shadow-2xl relative z-10">
        
        {mode === 'verify_otp' ? (
          <div>
            <h1 className="text-3xl font-bold text-white mb-4 text-center">تحقق من بريدك الإلكتروني</h1>
            <p className="text-gray-400 text-center mb-8">أرسلنا رمز تأكيد إلى {email}</p>
            
            {error && <div className="p-4 mb-6 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl text-sm">{error}</div>}
            
            <form onSubmit={handleVerifyOtp} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">رمز التأكيد (6 أرقام)</label>
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#FFD700] text-center tracking-[1em] font-mono text-xl"
                  placeholder="------"
                />
              </div>
              <button disabled={loading || otp.length !== 6} type="submit" className="w-full bg-[#FFD700] text-black font-bold py-3 rounded-xl hover:bg-[#FFC000] transition-colors disabled:opacity-50">
                {loading ? 'جاري التأكيد...' : 'تأكيد'}
              </button>
              <button type="button" onClick={() => setMode('register')} className="w-full text-gray-400 hover:text-white text-sm transition-colors">
                العودة للتسجيل
              </button>
            </form>
          </div>
        ) : mode === 'forgot_password' ? (
          <div>
            <h1 className="text-3xl font-bold text-white mb-4 text-center">نسيت كلمة المرور؟</h1>
            <p className="text-gray-400 text-center mb-8">أدخل بريدك الإلكتروني وسنرسل لك رابطاً لإعادة تعيين كلمة المرور.</p>
            
            {error && <div className="p-4 mb-6 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl text-sm">{error}</div>}
            
            <form onSubmit={handleForgotPassword} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">البريد الإلكتروني</label>
                <div className="relative">
                  <Mail className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-black/20 border border-white/10 rounded-xl pr-12 pl-4 py-3 text-white focus:outline-none focus:border-[#FFD700]"
                    placeholder="name@example.com"
                  />
                </div>
              </div>
              <button disabled={loading} type="submit" className="w-full bg-[#FFD700] text-black font-bold py-3 rounded-xl hover:bg-[#FFC000] transition-colors disabled:opacity-50">
                {loading ? 'جاري الإرسال...' : 'إرسال رابط إعادة التعيين'}
              </button>
              <button type="button" onClick={() => setMode('login')} className="w-full text-gray-400 hover:text-white text-sm transition-colors flex items-center justify-center gap-2">
                <ArrowRight size={16} /> العودة لتسجيل الدخول
              </button>
            </form>
          </div>
        ) : (
          <>
            <div className="flex bg-black/20 p-1 rounded-xl mb-8">
              <button 
                onClick={() => { setMode('login'); setError(null); }}
                className={`flex-1 py-2 text-sm font-bold rounded-lg transition-colors ${mode === 'login' ? 'bg-[#141517] text-white shadow-sm' : 'text-gray-400 hover:text-white'}`}
              >
                تسجيل دخول
              </button>
              <button 
                onClick={() => { setMode('register'); setError(null); }}
                className={`flex-1 py-2 text-sm font-bold rounded-lg transition-colors ${mode === 'register' ? 'bg-[#141517] text-white shadow-sm' : 'text-gray-400 hover:text-white'}`}
              >
                حساب جديد
              </button>
            </div>

            {error && <div className="p-4 mb-6 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl text-sm">{error}</div>}

            {mode === 'login' ? (
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">البريد الإلكتروني</label>
                  <div className="relative">
                    <Mail className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-black/20 border border-white/10 rounded-xl pr-12 pl-4 py-3 text-white focus:outline-none focus:border-[#FFD700]"
                      placeholder="name@example.com"
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium text-gray-400">كلمة المرور</label>
                    <button type="button" onClick={() => setMode('forgot_password')} className="text-xs text-[#FFD700] hover:underline">نسيت كلمة المرور؟</button>
                  </div>
                  <div className="relative">
                    <Lock className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-black/20 border border-white/10 rounded-xl pr-12 pl-12 py-3 text-white focus:outline-none focus:border-[#FFD700]"
                      placeholder="••••••••"
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white">
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>
                <button disabled={loading} type="submit" className="w-full bg-[#FFD700] text-black font-bold py-3 rounded-xl hover:bg-[#FFC000] transition-colors disabled:opacity-50 mt-6">
                  {loading ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول'}
                </button>
              </form>
            ) : (
              <form onSubmit={handleRegister} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">الاسم الكامل</label>
                  <div className="relative">
                    <User className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full bg-black/20 border border-white/10 rounded-xl pr-12 pl-4 py-3 text-white focus:outline-none focus:border-[#FFD700]"
                      placeholder="أحمد محمد"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">البريد الإلكتروني</label>
                  <div className="relative">
                    <Mail className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-black/20 border border-white/10 rounded-xl pr-12 pl-4 py-3 text-white focus:outline-none focus:border-[#FFD700]"
                      placeholder="name@example.com"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">كلمة المرور</label>
                  <div className="relative">
                    <Lock className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-black/20 border border-white/10 rounded-xl pr-12 pl-12 py-3 text-white focus:outline-none focus:border-[#FFD700]"
                      placeholder="••••••••"
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white">
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  {password && (
                    <div className="mt-2 flex gap-1 h-1.5">
                      <div className={`flex-1 rounded-full ${passwordStrength >= 25 ? 'bg-red-500' : 'bg-white/10'}`}></div>
                      <div className={`flex-1 rounded-full ${passwordStrength >= 50 ? 'bg-orange-500' : 'bg-white/10'}`}></div>
                      <div className={`flex-1 rounded-full ${passwordStrength >= 75 ? 'bg-yellow-500' : 'bg-white/10'}`}></div>
                      <div className={`flex-1 rounded-full ${passwordStrength >= 100 ? 'bg-green-500' : 'bg-white/10'}`}></div>
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">تأكيد كلمة المرور</label>
                  <div className="relative">
                    <Lock className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full bg-black/20 border border-white/10 rounded-xl pr-12 pl-12 py-3 text-white focus:outline-none focus:border-[#FFD700]"
                      placeholder="••••••••"
                    />
                  </div>
                </div>
                
                <div className="pt-2">
                  <label className="block text-sm font-medium text-gray-400 mb-3">نوع الحساب</label>
                  <div className="flex flex-col gap-4 max-w-2xl mx-auto">
                    <button 
                      type="button" 
                      onClick={() => setUserType('idea')}
                      className={`p-4 rounded-xl border flex items-center gap-4 transition-all ${userType === 'idea' ? 'bg-purple-500/20 border-purple-500 text-purple-400' : 'bg-black/20 border-white/10 text-gray-400 hover:border-white/30'}`}
                    >
                      <div className={`w-12 h-12 shrink-0 rounded-xl flex items-center justify-center ${userType === 'idea' ? 'bg-purple-500/20 text-purple-400' : 'bg-white/5 text-gray-400'}`}>
                        <Lightbulb size={24} />
                      </div>
                      <div className="text-start">
                        <span className="block font-bold text-lg mb-1">صاحب فكرة</span>
                        <span className="block text-sm opacity-80">لدي فكرة مشروع وأبحث عن فريق أو تمويل</span>
                      </div>
                    </button>
                    <button 
                      type="button" 
                      onClick={() => setUserType('skill')}
                      className={`p-4 rounded-xl border flex items-center gap-4 transition-all ${userType === 'skill' ? 'bg-blue-500/20 border-blue-500 text-blue-400' : 'bg-black/20 border-white/10 text-gray-400 hover:border-white/30'}`}
                    >
                      <div className={`w-12 h-12 shrink-0 rounded-xl flex items-center justify-center ${userType === 'skill' ? 'bg-blue-500/20 text-blue-400' : 'bg-white/5 text-gray-400'}`}>
                        <Briefcase size={24} />
                      </div>
                      <div className="text-start">
                        <span className="block font-bold text-lg mb-1">صاحب مهارة</span>
                        <span className="block text-sm opacity-80">أمتلك مهارات وأريد الانضمام لمشاريع واعدة</span>
                      </div>
                    </button>
                    <button 
                      type="button" 
                      onClick={() => setUserType('investor')}
                      className={`p-4 rounded-xl border flex items-center gap-4 transition-all ${userType === 'investor' ? 'bg-green-500/20 border-green-500 text-green-400' : 'bg-black/20 border-white/10 text-gray-400 hover:border-white/30'}`}
                    >
                      <div className={`w-12 h-12 shrink-0 rounded-xl flex items-center justify-center ${userType === 'investor' ? 'bg-green-500/20 text-green-400' : 'bg-white/5 text-gray-400'}`}>
                        <TrendingUp size={24} />
                      </div>
                      <div className="text-start">
                        <span className="block font-bold text-lg mb-1">مستثمر</span>
                        <span className="block text-sm opacity-80">أبحث عن مشاريع ناشئة للاستثمار فيها</span>
                      </div>
                    </button>
                  </div>
                </div>

                <button disabled={loading} type="submit" className="w-full bg-[#FFD700] text-black font-bold py-3 rounded-xl hover:bg-[#FFC000] transition-colors disabled:opacity-50 mt-6">
                  {loading ? 'جاري إنشاء الحساب...' : 'إنشاء الحساب'}
                </button>
              </form>
            )}

            <div className="mt-8">
              <div className="relative flex items-center py-4">
                <div className="flex-grow border-t border-white/10"></div>
                <span className="flex-shrink-0 mx-4 text-gray-500 text-sm">أو</span>
                <div className="flex-grow border-t border-white/10"></div>
              </div>
              <div className="space-y-3">
                <button onClick={() => handleSocialAuth('google')} className="w-full flex items-center justify-center gap-3 p-3 rounded-xl bg-white text-black font-bold hover:bg-gray-200 transition-colors text-sm">
                  <Chrome size={18} /> المتابعة بـ Google
                </button>
                <button onClick={() => handleSocialAuth('apple')} className="w-full flex items-center justify-center gap-3 p-3 rounded-xl bg-white text-black font-bold hover:bg-gray-200 transition-colors text-sm">
                  <Apple size={18} /> المتابعة بـ Apple
                </button>
                <button onClick={() => handleSocialAuth('linkedin')} className="w-full flex items-center justify-center gap-3 p-3 rounded-xl bg-[#0077b5] text-white font-bold hover:bg-[#006097] transition-colors text-sm">
                  <Linkedin size={18} /> المتابعة بـ LinkedIn
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
