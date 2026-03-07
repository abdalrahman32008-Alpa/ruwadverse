import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { siteConfig } from '../config';

export const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, send to API
    alert('تم إرسال رسالتك بنجاح! سنرد عليك قريباً.');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="min-h-screen bg-[#0B0C0E] text-white pt-24 pb-20 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-[#FFD700]">تواصل معنا</h1>
          <p className="text-xl text-gray-400">
            نحن هنا للإجابة على استفساراتك ومساعدتك في رحلتك الريادية.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12">
          <div className="space-y-8">
            <div className="bg-[#141517] p-6 rounded-2xl border border-white/5">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Mail className="text-[#FFD700]" /> البريد الإلكتروني
              </h3>
              <p className="text-gray-400">{siteConfig.contact.email}</p>
            </div>
            <div className="bg-[#141517] p-6 rounded-2xl border border-white/5">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Phone className="text-[#FFD700]" /> الهاتف
              </h3>
              <p className="text-gray-400">{siteConfig.contact.phone}</p>
            </div>
            <div className="bg-[#141517] p-6 rounded-2xl border border-white/5">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <MapPin className="text-[#FFD700]" /> العنوان
              </h3>
              <p className="text-gray-400">{siteConfig.contact.address}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 bg-[#141517] p-8 rounded-2xl border border-white/5">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">الاسم الكامل</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#FFD700]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">البريد الإلكتروني</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#FFD700]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">الموضوع</label>
              <input
                type="text"
                required
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#FFD700]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">الرسالة</label>
              <textarea
                rows={4}
                required
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#FFD700]"
              ></textarea>
            </div>
            <button
              type="submit"
              className="w-full bg-[#FFD700] text-black font-bold py-3 rounded-xl hover:bg-[#FFC000] transition-colors flex items-center justify-center gap-2"
            >
              <Send size={18} /> إرسال الرسالة
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
