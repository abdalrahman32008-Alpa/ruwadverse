import React from 'react';
import { Settings, Bell, Shield, Globe, User } from 'lucide-react';

export const SettingsPage = () => {
  return (
    <div className="min-h-screen pt-24 px-4 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-white mb-8">الإعدادات</h1>
      <div className="space-y-6">
        <div className="linear-card p-6 rounded-3xl bg-[#141517]/80 backdrop-blur-md border border-white/10">
          <div className="flex items-center gap-4 mb-6">
            <User className="text-[#FFD700]" />
            <h2 className="text-xl font-bold text-white">الملف الشخصي</h2>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 bg-white/5 rounded-2xl">
              <span className="text-gray-300">تعديل الاسم</span>
              <button className="text-[#FFD700] hover:underline">تعديل</button>
            </div>
          </div>
        </div>

        <div className="linear-card p-6 rounded-3xl bg-[#141517]/80 backdrop-blur-md border border-white/10">
          <div className="flex items-center gap-4 mb-6">
            <Bell className="text-[#FFD700]" />
            <h2 className="text-xl font-bold text-white">التنبيهات</h2>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 bg-white/5 rounded-2xl">
              <span className="text-gray-300">تنبيهات البريد الإلكتروني</span>
              <input type="checkbox" className="toggle" defaultChecked />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
