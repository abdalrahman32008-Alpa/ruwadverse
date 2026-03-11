import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User, Shield, Bell, Lock, CreditCard, AlertTriangle, 
  Camera, Save, LogOut, Check, X, Mail, Smartphone, Globe, Sparkles, Loader2, Gift, Copy, TrendingUp, Users, Trophy
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-hot-toast';
import { generateQuickBio } from '../services/raed';
import { supabase } from '../lib/supabase';
import { KYCVerification } from '../components/KYCVerification';

export const SettingsPage = () => {
  const { t, language, setLanguage } = useLanguage();
  const { user, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState('account');
  const [loading, setLoading] = useState(false);
  const [isGeneratingBio, setIsGeneratingBio] = useState(false);
  const [showKYC, setShowKYC] = useState(false);

  // Local state for form fields
  const [fullName, setFullName] = useState('');
  const [headline, setHeadline] = useState('');
  const [bio, setBio] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [investmentInterests, setInvestmentInterests] = useState('');

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
      setLinkedin(user.user_metadata?.linkedin || '');
      setInvestmentInterests(user.user_metadata?.investment_interests?.join(', ') || '');
    }
  }, [user]);

  const handleGenerateBio = async () => {
    setIsGeneratingBio(true);
    try {
      const generated = await generateQuickBio(['React', 'Node.js', 'AI'], headline);
      if (generated) {
        setBio(generated);
        toast.success(t('success'));
      }
    } catch (error) {
      toast.error(t('error'));
    } finally {
      setIsGeneratingBio(false);
    }
  };

  const [searchQuery, setSearchQuery] = useState('');

  const tabs = [
    { id: 'account', label: t('settingsAccount'), icon: User, group: 'personal' },
    { id: 'security', label: t('settingsSecurity'), icon: Shield, group: 'security' },
    { id: 'notifications', label: t('settingsNotifications'), icon: Bell, group: 'preferences' },
    { id: 'privacy', label: t('settingsPrivacy'), icon: Lock, group: 'security' },
    { id: 'referral', label: t('referralTitle'), icon: Gift, group: 'preferences' },
    { id: 'subscription', label: t('settingsSubscription'), icon: CreditCard, group: 'billing' },
    { id: 'danger', label: t('settingsDanger'), icon: AlertTriangle, color: 'text-red-500', group: 'danger' },
  ];

  const filteredTabs = tabs.filter(tab => 
    tab.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tab.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const groups = [
    { id: 'personal', label: t('personalInfoGroup') },
    { id: 'security', label: t('securityPrivacyGroup') },
    { id: 'preferences', label: t('preferencesGroup') },
    { id: 'billing', label: t('billingGroup') },
    { id: 'danger', label: t('dangerZoneGroup') },
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
          location: location,
          linkedin: linkedin,
          investment_interests: investmentInterests.split(',').map(i => i.trim()).filter(i => i)
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
      toast.error(t('error'));
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

      <div className="max-w-6xl mx-auto pb-20 pt-24 px-4 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">{t('settings')}</h1>
            <p className="text-gray-400 text-sm">{t('manageAccountDesc')}</p>
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <input 
                type="text"
                placeholder={t('searchSettingsPlaceholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#141517] border border-white/10 rounded-xl py-2 px-4 pl-10 text-sm outline-none focus:border-[#FFD700]/50 transition-all"
              />
              <Globe className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
            </div>
            <button 
              onClick={signOut}
              className="p-2 bg-red-500/10 text-red-500 border border-red-500/20 rounded-xl hover:bg-red-500 hover:text-white transition-all"
              title={t('logout')}
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>
      
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Tabs */}
        <div className="w-full lg:w-72 shrink-0">
          <div className="bg-[#141517] border border-white/10 rounded-3xl p-3 sticky top-24 space-y-6">
            {groups.map((group) => {
              const groupTabs = filteredTabs.filter(t => t.group === group.id);
              if (groupTabs.length === 0) return null;

              return (
                <div key={group.id}>
                  <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2 px-3">{group.label}</h4>
                  <div className="space-y-1">
                    {groupTabs.map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-full flex items-center gap-3 p-3 rounded-2xl transition-all ${
                          activeTab === tab.id 
                            ? 'bg-[#FFD700] text-black font-bold shadow-lg shadow-[#FFD700]/10' 
                            : `text-gray-400 hover:bg-white/5 hover:text-white ${tab.color || ''}`
                        }`}
                      >
                        <tab.icon size={18} />
                        <span className="text-sm">{tab.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1">
          <AnimatePresence mode="wait">
            {showKYC ? (
              <motion.div
                key="kyc"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="bg-[#141517] border border-white/10 rounded-[32px] p-6 md:p-10 shadow-2xl"
              >
                <KYCVerification onComplete={() => setShowKYC(false)} />
              </motion.div>
            ) : (
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="bg-[#141517] border border-white/10 rounded-[32px] p-6 md:p-10 shadow-2xl"
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
                         <label className="block text-sm font-medium text-gray-400 mb-2">{t('phoneLabel')}</label>
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
                        <label className="block text-sm font-medium text-gray-400 mb-2">{t('locationLabel')}</label>
                        <div className="relative">
                          <Globe className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                          <input 
                            type="text" 
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            placeholder={t('locationLabel')}
                            className="w-full bg-black/20 border border-white/10 rounded-xl p-3 pl-10 text-white focus:border-[#FFD700] outline-none transition-colors" 
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">{t('headline')}</label>
                        <input 
                          type="text" 
                          value={headline}
                          onChange={(e) => setHeadline(e.target.value)}
                          placeholder={t('headlinePlaceholder')}
                          className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-white focus:border-[#FFD700] outline-none transition-colors" 
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">{t('linkedinLabel')}</label>
                        <input 
                          type="url" 
                          value={linkedin}
                          onChange={(e) => setLinkedin(e.target.value)}
                          placeholder="https://linkedin.com/in/username"
                          className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-white focus:border-[#FFD700] outline-none transition-colors" 
                          dir="ltr"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">{t('investmentInterestsLabel')}</label>
                      <input 
                        type="text" 
                        value={investmentInterests}
                        onChange={(e) => setInvestmentInterests(e.target.value)}
                        placeholder={t('investmentInterestsPlaceholder')}
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
                          {t('raedAiBioBtn')}
                        </button>
                      </div>
                      <textarea 
                        rows={4} 
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        placeholder={t('bioPlaceholder')}
                        className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-white focus:border-[#FFD700] outline-none transition-colors resize-none" 
                      />
                    </div>
                    
                    {/* Language Switcher */}
                    <div className="pt-4 border-t border-white/10">
                      <label className="block text-sm font-medium text-gray-400 mb-2">{t('languageLabel')}</label>
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
                        placeholder={t('currentPasswordPlaceholder')}
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-white focus:border-[#FFD700] outline-none"
                      />
                      <input 
                        type="password" 
                        placeholder={t('newPasswordPlaceholder')}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-white focus:border-[#FFD700] outline-none"
                      />
                      <button 
                        onClick={() => toast.success(t('success'))}
                        className="w-fit px-6 py-2 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors text-sm"
                      >
                        {t('updatePasswordBtn')}
                      </button>
                    </div>
                  </div>

                  <div className="border-t border-white/10 pt-6">
                    <h3 className="font-bold mb-4 flex items-center gap-2">
                      <Shield size={20} className="text-[#FFD700]" />
                      {t('kycSectionTitle')}
                    </h3>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-white/5 p-4 rounded-2xl border border-white/10 gap-4">
                      <div>
                        <p className="font-medium">{t('kycSectionTitle')}</p>
                        <p className="text-gray-400 text-xs">{t('kycSectionDesc')}</p>
                      </div>
                      <button 
                        onClick={() => setShowKYC(true)}
                        className="px-4 py-2 bg-[#FFD700] text-black font-bold rounded-xl hover:bg-[#FFC000] transition-colors text-sm whitespace-nowrap"
                      >
                        {t('kycStartBtn')}
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
                        <p className="font-medium">{t('twoFactorApp')}</p>
                        <p className="text-gray-400 text-xs">{t('twoFactorDesc')}</p>
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
                    <h3 className="font-bold mb-4">{t('activeDevicesTitle')}</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/10">
                        <div className="flex items-center gap-3">
                          <Smartphone size={20} className="text-gray-400" />
                          <div>
                            <p className="text-sm font-medium">iPhone 13 - Cairo, EG</p>
                            <p className="text-[10px] text-green-500">{t('activeNow')}</p>
                          </div>
                        </div>
                        <button className="text-xs text-red-500 hover:underline">{t('logoutDevice')}</button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'notifications' && (
                <div className="space-y-6">
                  <p className="text-sm text-gray-400 mb-4">{t('notifSettingsDesc')}</p>
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
                    <h4 className="text-sm font-bold mb-4">{t('notifChannelsTitle')}</h4>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Mail size={18} className="text-gray-400" />
                          <span className="text-sm">{t('emailNotif')}</span>
                        </div>
                        <Check size={18} className="text-green-500" />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Smartphone size={18} className="text-gray-400" />
                          <span className="text-sm">{t('browserNotif')}</span>
                        </div>
                        <button className="text-xs text-[#FFD700] hover:underline">{t('enableBtn')}</button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'privacy' && (
                <div className="space-y-8">
                  <div>
                    <h3 className="font-bold mb-4">{t('profileVisibilityTitle')}</h3>
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
                          <span className="capitalize">{type === 'public' ? t('visibilityPublic') : type === 'followers' ? t('visibilityFollowers') : t('visibilityPrivate')}</span>
                          {profileVisibility === type && <Check size={18} className="text-[#FFD700]" />}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="border-t border-white/10 pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-bold">{t('hideOnlineStatusTitle')}</h3>
                        <p className="text-xs text-gray-400">{t('hideOnlineStatusDesc')}</p>
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
                      <Save size={16} /> {t('exportDataBtn')}
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'referral' && (
                <div className="space-y-8">
                  <div className="text-center bg-gradient-to-br from-[#FFD700]/10 to-transparent p-8 rounded-[32px] border border-[#FFD700]/20">
                    <div className="w-20 h-20 bg-[#FFD700]/20 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Gift size={40} className="text-[#FFD700]" />
                    </div>
                    <h2 className="text-2xl font-bold mb-2">{t('referralTitle')}</h2>
                    <p className="text-gray-400 mb-8 max-w-md mx-auto">{t('referralDesc')}</p>
                    
                    <div className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
                      <div className="flex-1 bg-black/40 border border-white/10 rounded-xl p-3 text-sm text-gray-300 font-mono text-left truncate">
                        https://ruwadverse.com/join?ref={user?.id?.substring(0, 8)}
                      </div>
                      <button 
                        onClick={() => {
                          navigator.clipboard.writeText(`https://ruwadverse.com/join?ref=${user?.id?.substring(0, 8)}`);
                          toast.success(t('success'));
                        }}
                        className="bg-[#FFD700] text-black px-6 py-3 rounded-xl font-bold hover:bg-[#FFC000] transition-colors flex items-center justify-center gap-2"
                      >
                        <Copy size={18} />
                        {t('copyReferral')}
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-white/5 border border-white/10 p-6 rounded-2xl text-center">
                      <Users className="mx-auto text-gray-500 mb-2" size={24} />
                      <div className="text-2xl font-bold">12</div>
                      <div className="text-xs text-gray-500">{t('totalInvites')}</div>
                    </div>
                    <div className="bg-white/5 border border-white/10 p-6 rounded-2xl text-center">
                      <TrendingUp className="mx-auto text-gray-500 mb-2" size={24} />
                      <div className="text-2xl font-bold">1,200</div>
                      <div className="text-xs text-gray-500">{t('pointsEarned')}</div>
                    </div>
                    <div className="bg-white/5 border border-white/10 p-6 rounded-2xl text-center">
                      <Trophy className="mx-auto text-[#FFD700] mb-2" size={24} />
                      <div className="text-2xl font-bold">#42</div>
                      <div className="text-xs text-gray-500">{t('referralRank')}</div>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-white/10">
                    <h4 className="font-bold mb-4">{t('referralHowItWorks')}</h4>
                    <div className="space-y-4">
                      <div className="flex gap-4">
                        <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-xs font-bold shrink-0">1</div>
                        <p className="text-sm text-gray-400">{t('referralStep1')}</p>
                      </div>
                      <div className="flex gap-4">
                        <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-xs font-bold shrink-0">2</div>
                        <p className="text-sm text-gray-400">{t('referralStep2')}</p>
                      </div>
                      <div className="flex gap-4">
                        <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-xs font-bold shrink-0">3</div>
                        <p className="text-sm text-gray-400">{t('referralStep3')}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'subscription' && (
                <div className="space-y-8">
                  <div className="text-center py-8 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-[32px] border border-white/5">
                    <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                      <CreditCard size={40} className="text-[#FFD700]" />
                    </div>
                    <h2 className="text-2xl font-bold mb-2">{t('planFree')}</h2>
                    <p className="text-gray-400 mb-8">{t('currentPlanDesc')}</p>
                    <button className="bg-[#FFD700] text-black px-8 py-3 rounded-xl font-bold hover:bg-[#FFC000] transition-colors shadow-lg shadow-[#FFD700]/10">
                      {t('upgradeToPro')}
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-6 bg-white/5 border border-white/10 rounded-2xl">
                      <h4 className="font-bold mb-2 flex items-center gap-2">
                        <Check size={18} className="text-green-500" />
                        {t('oneClickCancel')}
                      </h4>
                      <p className="text-xs text-gray-400">يمكنك إلغاء اشتراكك في أي وقت بضغطة واحدة دون تعقيدات أو مكالمات هاتفية.</p>
                    </div>
                    <div className="p-6 bg-white/5 border border-white/10 rounded-2xl">
                      <h4 className="font-bold mb-2 flex items-center gap-2">
                        <Shield size={18} className="text-blue-500" />
                        {t('noSpamGuarantee')}
                      </h4>
                      <p className="text-xs text-gray-400">نحن نضمن لك عدم إرسال رسائل ترويجية مزعجة. نرسل فقط ما يهمك فعلاً.</p>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-white/10">
                    <h4 className="font-bold mb-4">{t('billingHistoryTitle')}</h4>
                    <div className="text-center py-10 text-gray-500 text-sm">
                      {t('noInvoices')}
                    </div>
                  </div>
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
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
    </div>
  );
};
