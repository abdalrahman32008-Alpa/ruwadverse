import React, { useState } from 'react';
import { Settings, Bell, Shield, Globe, User, Moon, Sun, Lock, LogOut } from 'lucide-react';
import { motion } from 'motion/react';

export const SettingsPage = () => {
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    marketing: false
  });
  const [darkMode, setDarkMode] = useState(true);
  const [language, setLanguage] = useState('ar');

  return (
    <div className="max-w-4xl mx-auto pb-20">
      <h1 className="text-3xl font-bold mb-8 flex items-center gap-3">
        <Settings className="text-[#FFD700]" />
        الإعدادات
      </h1>

      <div className="space-y-6">
        {/* Account Settings */}
        <section className="bg-[#141517] border border-white/10 rounded-3xl p-6">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2 border-b border-white/5 pb-4">
            <User className="text-[#FFD700]" size={20} />
            الحساب الشخصي
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl hover:bg-white/10 transition-colors cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gray-700 overflow-hidden">
                  <img src="https://i.pravatar.cc/150?u=1" alt="Avatar" className="w-full h-full object-cover" />
                </div>
                <div>
                  <h3 className="font-bold">أحمد محمد</h3>
                  <p className="text-sm text-gray-400">ahmed@example.com</p>
                </div>
              </div>
              <button className="text-[#FFD700] text-sm font-bold">تعديل</button>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl">
              <span className="text-gray-300">كلمة المرور</span>
              <button className="text-sm text-gray-400 hover:text-white flex items-center gap-1">
                <Lock size={14} /> تغيير
              </button>
            </div>
          </div>
        </section>

        {/* Preferences */}
        <section className="bg-[#141517] border border-white/10 rounded-3xl p-6">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2 border-b border-white/5 pb-4">
            <Globe className="text-[#FFD700]" size={20} />
            التفضيلات
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl">
              <div className="flex items-center gap-3">
                {darkMode ? <Moon size={20} /> : <Sun size={20} />}
                <span>المظهر</span>
              </div>
              <button 
                onClick={() => setDarkMode(!darkMode)}
                className={`w-12 h-6 rounded-full p-1 transition-colors ${darkMode ? 'bg-[#FFD700]' : 'bg-gray-600'}`}
              >
                <motion.div 
                  layout 
                  className="w-4 h-4 bg-white rounded-full shadow-md"
                  animate={{ x: darkMode ? 24 : 0 }}
                />
              </button>
            </div>

            <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl">
              <div className="flex items-center gap-3">
                <Globe size={20} />
                <span>اللغة</span>
              </div>
              <select 
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="bg-black/20 border border-white/10 rounded-lg px-3 py-1 text-sm outline-none focus:border-[#FFD700]"
              >
                <option value="ar">العربية</option>
                <option value="en">English</option>
              </select>
            </div>
          </div>
        </section>

        {/* Notifications */}
        <section className="bg-[#141517] border border-white/10 rounded-3xl p-6">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2 border-b border-white/5 pb-4">
            <Bell className="text-[#FFD700]" size={20} />
            الإشعارات
          </h2>
          <div className="space-y-4">
            {Object.entries(notifications).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl">
                <span className="capitalize text-gray-300">
                  {key === 'email' ? 'البريد الإلكتروني' : key === 'push' ? 'إشعارات التطبيق' : 'عروض تسويقية'}
                </span>
                <button 
                  onClick={() => setNotifications({...notifications, [key]: !value})}
                  className={`w-12 h-6 rounded-full p-1 transition-colors ${value ? 'bg-green-500' : 'bg-gray-600'}`}
                >
                  <motion.div 
                    layout 
                    className="w-4 h-4 bg-white rounded-full shadow-md"
                    animate={{ x: value ? 24 : 0 }}
                  />
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Danger Zone */}
        <section className="bg-red-500/5 border border-red-500/20 rounded-3xl p-6">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-red-500 border-b border-red-500/10 pb-4">
            <Shield size={20} />
            منطقة الخطر
          </h2>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-white">تسجيل الخروج</h3>
              <p className="text-sm text-gray-400">إنهاء الجلسة الحالية</p>
            </div>
            <button className="bg-red-500/10 text-red-500 px-4 py-2 rounded-xl font-bold hover:bg-red-500 hover:text-white transition-colors flex items-center gap-2">
              <LogOut size={18} />
              خروج
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};
