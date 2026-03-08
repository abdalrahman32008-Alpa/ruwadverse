import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User, Shield, Bell, Lock, CreditCard, AlertTriangle, 
  Camera, Save, LogOut, Check, X, Mail, Smartphone, Globe, Sparkles, Loader2
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-hot-toast';
import { generateQuickBio } from '../services/raed';
import { supabase } from '../lib/supabase';

export const SettingsPage = () => {
  const { t, language, setLanguage } = useLanguage();
  const { user, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState('account');
  const [loading, setLoading] = useState(false);
  const [isGeneratingBio, setIsGeneratingBio] = useState(false);

  // Local state for form fields
  const [fullName, setFullName] = useState('');
  const [headline, setHeadline] = useState('');
  const [bio, setBio] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');

  // Security state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  // Privacy state
  const [profileVisibility, setProfileVisibility] = useState('public');
  const [onlineStatusHidden, setOnlineStatusHidden] = useState(false);

  // Notifications state
  const [notifSettings, setNotifSettings] = useState({
    interactions: true,
    comments: true,
    partnership: true,
    messages: true,
    raed: false
  });

  useEffect(() => {
    if (user) {
      setFullName(user.user_metadata?.full_name || '');
      setHeadline(user.user_metadata?.headline || '');
      setBio(user.user_metadata?.bio || '');
      setAvatarUrl(user.user_metadata?.avatar_url || '');
      setEmail(user.email || '');
      setPhone(user.user_metadata?.phone || '');
      setLocation(user.user_metadata?.location || '');
    }
  }, [user]);

  const handleGenerateBio = async () => {
    setIsGeneratingBio(true);
    try {
      const generated = await generateQuickBio(['React', 'Node.js', 'AI'], headline);
      if (generated) {
        setBio(generated);
        toast.success('تم توليد النبذة بنجاح');
      }
    } catch (error) {
      toast.error('حدث خطأ أثناء توليد النبذة');
    } finally {
      setIsGeneratingBio(false);
    }
  };

  const tabs = [
    { id: 'account', label: t('settingsAccount'), icon: User },
    { id: 'security', label: t('settingsSecurity'), icon: Shield },
    { id: 'notifications', label: t('settingsNotifications'), icon: Bell },
    { id: 'privacy', label: t('settingsPrivacy'), icon: Lock },
    { id: 'subscription', label: t('settingsSubscription'), icon: CreditCard },
    { id: 'danger', label: t('settingsDanger'), icon: AlertTriangle, color: 'text-red-500' },
  ];

  const handleSave = async () => {
    if (!user) return;
    setLoading(true);
    try {
      // Update auth metadata
      const { error: authError } = await supabase.auth.updateUser({
        data: {
          full_name: fullName,
          headline: headline,
          bio: bio,
          avatar_url: avatarUrl,
          phone: phone,
          location: location
        }
      });

      if (authError) throw authError;

      // Update public users table
      const { error: dbError } = await supabase
        .from('users')
        .update({
          name: fullName,
          avatar_url: avatarUrl
        })
        .eq('id', user.id);

      if (dbError) throw dbError;

      toast.success(t('success'));
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('حدث خطأ أثناء حفظ التغييرات');
    } finally {
      setLoading(false);
    }
  };

  const toggleLanguage = () => {
    setLanguage(language === 'ar' ? 'en' : 'ar');
    toast.success(language === 'ar' ? 'Switched to English' : 'تم التحويل للعربية');
  };

  return (
    <div className="min-h-screen bg-[#0B0C0E] text-white relative overflow-hidden">
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

      <div className="max-w-4xl mx-auto pb-20 pt-24 px-4 relative z-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">{t('settings')}</h1>
        <button 
          onClick={signOut}
          className="flex items-center gap-2 px-4 py-2 bg-red-500/10 text-red-500 border border-red-500/20 rounded-xl hover:bg-red-500 hover:text-white transition-colors"
        >
          <LogOut size={18} />
          {t('logout')}
        </button>
      </div>
      
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Tabs */}
        <div className="w-full md:w-64 shrink-0">
          <div className="bg-[#141517] border border-white/10 rounded-2xl p-2 sticky top-24">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${
                  activeTab === tab.id 
                    ? 'bg-[#FFD700] text-black font-bold' 
                    : `text-gray-400 hover:bg-white/5 hover:text-white ${tab.color || ''}`
                }`}
              >
                <tab.icon size={20} />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="bg-[#141517] border border-white/10 rounded-3xl p-6 md:p-8"
            >
              {activeTab === 'account' && (
                <div className="space-y-8">
                  <div className="flex flex-col sm:flex-row items-center gap-6">
                    <div className="relative group cursor-pointer">
                      <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#FFD700] to-[#FFC000] flex items-center justify-center text-3xl font-bold text-black overflow-hidden">
                        {avatarUrl ? (
                          <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                        ) : (
                          user?.email?.[0].toUpperCase()
                        )}
                      </div>
                      <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Camera className="text-white" />
                      </div>
                    </div>
                    <div className="text-center sm:text-start">
                      <h3 className="font-bold text-lg">{t('changeAvatar')}</h3>
                      <p className="text-sm text-gray-400">JPG, GIF or PNG. Max size of 800K</p>
                    </div>
                  </div>

                  <div className="grid gap-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">{t('fullName')}</label>
                        <input 
                          type="text" 
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-white focus:border-[#FFD700] outline-none transition-colors" 
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">{t('emailLabel')}</label>
                        <input 
                          type="email" 
                          value={email}
                          disabled
                          className="w-full bg-black/10 border border-white/5 rounded-xl p-3 text-gray-500 cursor-not-allowed outline-none" 
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">رقم الهاتف</label>
                        <div className="relative">
                          <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                          <input 
                            type="tel" 
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="+20 123 456 789"
                            className="w-full bg-black/20 border border-white/10 rounded-xl p-3 pl-10 text-white focus:border-[#FFD700] outline-none transition-colors" 
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">الموقع / المدينة</label>
                        <div className="relative">
                          <Globe className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                          <input 
                            type="text" 
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            placeholder="القاهرة، مصر"
                            className="w-full bg-black/20 border border-white/10 rounded-xl p-3 pl-10 text-white focus:border-[#FFD700] outline-none transition-colors" 
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">{t('headline')}</label>
                      <input 
                        type="text" 
                        value={headline}
                        onChange={(e) => setHeadline(e.target.value)}
                        placeholder="مثال: رائد أعمال تقني | مطور برمجيات"
                        className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-white focus:border-[#FFD700] outline-none transition-colors" 
                      />
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <label className="block text-sm font-medium text-gray-400">{t('bio')}</label>
                        <button 
                          onClick={handleGenerateBio}
                          disabled={isGeneratingBio}
                          className="text-xs text-[#FFD700] hover:text-[#FFC000] flex items-center gap-1 transition-colors disabled:opacity-50"
                        >
                          {isGeneratingBio ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
                          توليد ذكي (RAED AI)
                        </button>
                      </div>
                      <textarea 
                        rows={4} 
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        placeholder="أخبر المجتمع عن رؤيتك وأهدافك..."
                        className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-white focus:border-[#FFD700] outline-none transition-colors resize-none" 
                      />
                    </div>
                    
                    {/* Language Switcher */}
                    <div className="pt-4 border-t border-white/10">
                      <label className="block text-sm font-medium text-gray-400 mb-2">اللغة / Language</label>
                      <button 
                        onClick={toggleLanguage}
                        className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors"
                      >
                        <Globe size={18} />
                        {language === 'ar' ? 'English' : 'العربية'}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'security' && (
                <div className="space-y-8">
                  <div>
                    <h3 className="font-bold mb-4 flex items-center gap-2">
                      <Lock size={20} className="text-[#FFD700]" />
                      تغيير كلمة المرور
                    </h3>
                    <div className="grid gap-4">
                      <input 
                        type="password" 
                        placeholder="كلمة المرور الحالية"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-white focus:border-[#FFD700] outline-none"
                      />
                      <input 
                        type="password" 
                        placeholder="كلمة المرور الجديدة"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-white focus:border-[#FFD700] outline-none"
                      />
                      <button 
                        onClick={() => toast.success('تم إرسال رابط إعادة تعيين كلمة المرور لبريدك')}
                        className="w-fit px-6 py-2 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors text-sm"
                      >
                        تحديث كلمة المرور
                      </button>
                    </div>
                  </div>

                  <div className="border-t border-white/10 pt-6">
                    <h3 className="font-bold mb-4 flex items-center gap-2">
                      <Shield size={20} className="text-[#FFD700]" />
                      {t('twoFactor')}
                    </h3>
                    <div className="flex items-center justify-between bg-white/5 p-4 rounded-2xl border border-white/10">
                      <div>
                        <p className="font-medium">المصادقة عبر التطبيق</p>
                        <p className="text-gray-400 text-xs">استخدم تطبيق Google Authenticator لتأمين حسابك.</p>
                      </div>
                      <button 
                        onClick={() => setTwoFactorEnabled(!twoFactorEnabled)}
                        className={`w-12 h-6 rounded-full relative transition-all ${twoFactorEnabled ? 'bg-[#FFD700]' : 'bg-white/10'}`}
                      >
                        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${twoFactorEnabled ? 'right-1' : 'left-1'}`} />
                      </button>
                    </div>
                  </div>

                  <div className="border-t border-white/10 pt-6">
                    <h3 className="font-bold mb-4">الأجهزة النشطة</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/10">
                        <div className="flex items-center gap-3">
                          <Smartphone size={20} className="text-gray-400" />
                          <div>
                            <p className="text-sm font-medium">iPhone 13 - Cairo, EG</p>
                            <p className="text-[10px] text-green-500">نشط الآن</p>
                          </div>
                        </div>
                        <button className="text-xs text-red-500 hover:underline">تسجيل خروج</button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'notifications' && (
                <div className="space-y-6">
                  <p className="text-sm text-gray-400 mb-4">تحكم في كيفية وصول التنبيهات إليك لتبقى على اطلاع دائم.</p>
                  {[
                    { key: 'interactions', label: t('notificationInteractions') },
                    { key: 'comments', label: t('notificationComments') },
                    { key: 'partnership', label: t('notificationPartnership') },
                    { key: 'messages', label: t('notificationMessages') },
                    { key: 'raed', label: t('notificationRaed') }
                  ].map((item) => (
                    <div key={item.key} className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
                      <span className="text-gray-300">{item.label}</span>
                      <button 
                        onClick={() => setNotifSettings(prev => ({ ...prev, [item.key]: !prev[item.key as keyof typeof notifSettings] }))}
                        className={`w-12 h-6 rounded-full relative transition-all ${notifSettings[item.key as keyof typeof notifSettings] ? 'bg-[#FFD700]' : 'bg-white/10'}`}
                      >
                        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${notifSettings[item.key as keyof typeof notifSettings] ? 'right-1' : 'left-1'}`} />
                      </button>
                    </div>
                  ))}
                  
                  <div className="pt-6 border-t border-white/10">
                    <h4 className="text-sm font-bold mb-4">قنوات التنبيه</h4>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Mail size={18} className="text-gray-400" />
                          <span className="text-sm">البريد الإلكتروني</span>
                        </div>
                        <Check size={18} className="text-green-500" />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Smartphone size={18} className="text-gray-400" />
                          <span className="text-sm">إشعارات المتصفح</span>
                        </div>
                        <button className="text-xs text-[#FFD700] hover:underline">تفعيل</button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'privacy' && (
                <div className="space-y-8">
                  <div>
                    <h3 className="font-bold mb-4">رؤية الملف الشخصي</h3>
                    <div className="grid gap-3">
                      {['public', 'followers', 'private'].map((type) => (
                        <button 
                          key={type}
                          onClick={() => setProfileVisibility(type)}
                          className={`flex items-center justify-between p-4 rounded-xl border transition-all ${
                            profileVisibility === type 
                              ? 'bg-[#FFD700]/10 border-[#FFD700] text-white' 
                              : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
                          }`}
                        >
                          <span className="capitalize">{type === 'public' ? 'عام للجميع' : type === 'followers' ? 'للمتابعين فقط' : 'خاص (أنا فقط)'}</span>
                          {profileVisibility === type && <Check size={18} className="text-[#FFD700]" />}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="border-t border-white/10 pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-bold">إخفاء حالة الاتصال</h3>
                        <p className="text-xs text-gray-400">لن يتمكن الآخرون من رؤية متى كنت متصلاً آخر مرة.</p>
                      </div>
                      <button 
                        onClick={() => setOnlineStatusHidden(!onlineStatusHidden)}
                        className={`w-12 h-6 rounded-full relative transition-all ${onlineStatusHidden ? 'bg-[#FFD700]' : 'bg-white/10'}`}
                      >
                        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${onlineStatusHidden ? 'right-1' : 'left-1'}`} />
                      </button>
                    </div>
                  </div>

                  <div className="border-t border-white/10 pt-6">
                    <button className="text-sm text-[#FFD700] hover:underline flex items-center gap-2">
                      <Save size={16} /> تصدير جميع بياناتي (GDPR)
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'subscription' && (
                <div className="text-center py-8">
                  <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CreditCard size={40} className="text-[#FFD700]" />
                  </div>
                  <h2 className="text-2xl font-bold mb-2">{t('planFree')}</h2>
                  <p className="text-gray-400 mb-8">You are currently on the free plan.</p>
                  <button className="bg-[#FFD700] text-black px-8 py-3 rounded-xl font-bold hover:bg-[#FFC000] transition-colors">
                    {t('upgradeToPro')}
                  </button>
                </div>
              )}

              {activeTab === 'danger' && (
                <div className="space-y-6">
                  <div className="p-4 border border-red-500/20 bg-red-500/5 rounded-xl">
                    <h3 className="text-red-500 font-bold mb-2">{t('deleteAccount')}</h3>
                    <p className="text-sm text-gray-400 mb-4">{t('deleteAccountConfirm')}</p>
                    <button className="bg-red-500/10 text-red-500 border border-red-500/20 px-4 py-2 rounded-lg text-sm font-bold hover:bg-red-500 hover:text-white transition-colors">
                      {t('deleteAccount')}
                    </button>
                  </div>
                </div>
              )}

              {/* Save Button (except for danger tab) */}
              {activeTab !== 'danger' && (
                <div className="mt-8 pt-6 border-t border-white/10 flex justify-end">
                  <button 
                    onClick={handleSave}
                    disabled={loading}
                    className="bg-[#FFD700] text-black px-6 py-3 rounded-xl font-bold hover:bg-[#FFC000] transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" /> : <Save size={20} />}
                    {t('saveChanges')}
                  </button>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
    </div>
  );
};
