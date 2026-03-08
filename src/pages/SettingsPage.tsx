import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User, Shield, Bell, Lock, CreditCard, AlertTriangle, 
  Camera, Save, LogOut, Check, X, Mail, Smartphone, Globe, Sparkles, Loader2
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-hot-toast';
import { generateQuickBio } from '../services/raed';

export const SettingsPage = () => {
  const { t, language, setLanguage } = useLanguage();
  const { user, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState('account');
  const [loading, setLoading] = useState(false);
  const [isGeneratingBio, setIsGeneratingBio] = useState(false);

  // Local state for form fields
  const [fullName, setFullName] = useState('عبدالرحمن محمد');
  const [headline, setHeadline] = useState('Full Stack Developer');
  const [bio, setBio] = useState('');

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
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setLoading(false);
    toast.success(t('success'));
  };

  const toggleLanguage = () => {
    setLanguage(language === 'ar' ? 'en' : 'ar');
    toast.success(language === 'ar' ? 'Switched to English' : 'تم التحويل للعربية');
  };

  return (
    <div className="max-w-4xl mx-auto pb-20 pt-24 px-4">
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
                  <div className="flex items-center gap-6">
                    <div className="relative group cursor-pointer">
                      <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#FFD700] to-[#FFC000] flex items-center justify-center text-3xl font-bold text-black overflow-hidden">
                        {user?.email?.[0].toUpperCase()}
                      </div>
                      <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Camera className="text-white" />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">{t('changeAvatar')}</h3>
                      <p className="text-sm text-gray-400">JPG, GIF or PNG. Max size of 800K</p>
                    </div>
                  </div>

                  <div className="grid gap-6">
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
                      <label className="block text-sm font-medium text-gray-400 mb-2">{t('headline')}</label>
                      <input 
                        type="text" 
                        value={headline}
                        onChange={(e) => setHeadline(e.target.value)}
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
                        className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-white focus:border-[#FFD700] outline-none transition-colors" 
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
                  <div className="bg-white/5 p-4 rounded-xl border border-white/10 flex items-center justify-between">
                    <div>
                      <h3 className="font-bold">{t('changeEmail')}</h3>
                      <p className="text-sm text-gray-400">{user?.email}</p>
                    </div>
                    <button className="text-[#FFD700] hover:underline">{t('change')}</button>
                  </div>
                  
                  <div className="border-t border-white/10 pt-6">
                    <h3 className="font-bold mb-4">{t('twoFactor')}</h3>
                    <div className="flex items-center justify-between">
                      <p className="text-gray-400 text-sm">Secure your account with 2FA.</p>
                      <div className="w-12 h-6 bg-white/10 rounded-full relative cursor-pointer transition-colors hover:bg-white/20">
                        <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform" />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'notifications' && (
                <div className="space-y-6">
                  {[
                    t('notificationInteractions'),
                    t('notificationComments'),
                    t('notificationPartnership'),
                    t('notificationMessages'),
                    t('notificationRaed')
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                      <span className="text-gray-300">{item}</span>
                      <div className={`w-12 h-6 rounded-full relative cursor-pointer transition-colors ${i < 3 ? 'bg-[#FFD700]' : 'bg-white/10'}`}>
                        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${i < 3 ? 'right-1' : 'left-1'}`} />
                      </div>
                    </div>
                  ))}
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
  );
};
