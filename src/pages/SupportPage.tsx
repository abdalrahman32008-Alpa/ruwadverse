import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, ChevronUp, Send, MessageSquare, HelpCircle, FileText, Shield } from 'lucide-react';

export const SupportPage = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [formData, setFormData] = useState({ name: '', email: '', type: 'general', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const faqs = [
    {
      q: "كيف يعمل RAED؟",
      a: "RAED هو مساعد ذكي يستخدم الذكاء الاصطناعي لتحليل أفكارك، واقتراح الشركاء المناسبين، وتوجيهك نحو الاستثمار الأمثل بناءً على بيانات السوق الحالية."
    },
    {
      q: "كيف تُحسب نسب الشراكة؟",
      a: "يتم حساب النسب بناءً على مساهمة كل طرف (الفكرة، المجهود، التمويل) باستخدام خوارزمية عادلة تضمن حقوق الجميع."
    },
    {
      q: "هل أفكاري محمية؟",
      a: "نعم، جميع الأفكار مشفرة ولا يتم مشاركتها إلا مع الأطراف التي تختارها أنت، ويتم توقيع اتفاقيات عدم إفصاح (NDA) رقمياً."
    },
    {
      q: "كيف أتواصل مع المستثمرين؟",
      a: "يمكنك التواصل مع المستثمرين من خلال ترقية حسابك إلى باقة 'رائد Pro'، مما يتيح لك المراسلة المباشرة وعرض ملفك بشكل مميز."
    },
    {
      q: "ما الفرق بين الباقات؟",
      a: "الباقة المجانية تتيح لك البداية والبحث، بينما باقة Pro تمنحك أدوات متقدمة، عقود قانونية، وتواصل مباشر مع المستثمرين."
    }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate API call
    setTimeout(() => {
      setSubmitted(true);
      setFormData({ name: '', email: '', type: 'general', message: '' });
      setTimeout(() => setSubmitted(false), 3000);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#0B0C0E] text-white pt-24 pb-20 px-4 relative overflow-hidden">
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

      <div className="max-w-4xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4 text-[#FFD700]">مركز المساعدة والدعم</h1>
          <p className="text-gray-400">نحن هنا لمساعدتك في رحلتك الريادية. تصفح الأسئلة الشائعة أو تواصل معنا مباشرة.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* FAQ Section */}
          <div>
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <HelpCircle className="text-[#FFD700]" />
              الأسئلة الشائعة
            </h2>
            <div className="space-y-4">
              {faqs.map((faq, idx) => (
                <div key={idx} className="bg-[#141517] border border-white/5 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                    className="w-full flex justify-between items-center p-4 text-right hover:bg-white/5 transition-colors"
                  >
                    <span className="font-medium">{faq.q}</span>
                    {openFaq === idx ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </button>
                  <AnimatePresence>
                    {openFaq === idx && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="p-4 pt-0 text-gray-400 text-sm leading-relaxed border-t border-white/5">
                          {faq.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <MessageSquare className="text-[#FFD700]" />
              تواصل معنا
            </h2>
            <form onSubmit={handleSubmit} className="bg-[#141517] p-6 rounded-2xl border border-white/5 space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">الاسم الكامل</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 focus:border-[#FFD700] focus:outline-none transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">البريد الإلكتروني</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                  className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 focus:border-[#FFD700] focus:outline-none transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">نوع المشكلة</label>
                <select
                  value={formData.type}
                  onChange={e => setFormData({...formData, type: e.target.value})}
                  className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 focus:border-[#FFD700] focus:outline-none transition-colors text-gray-300"
                >
                  <option value="general">استفسار عام</option>
                  <option value="technical">مشكلة تقنية</option>
                  <option value="billing">الفواتير والاشتراكات</option>
                  <option value="partnership">شراكات</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">الرسالة</label>
                <textarea
                  required
                  rows={4}
                  value={formData.message}
                  onChange={e => setFormData({...formData, message: e.target.value})}
                  className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 focus:border-[#FFD700] focus:outline-none transition-colors"
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full py-3 bg-[#FFD700] text-black font-bold rounded-xl hover:bg-[#FFC000] transition-colors flex items-center justify-center gap-2"
              >
                <Send size={18} />
                إرسال الرسالة
              </button>
            </form>
          </div>
        </div>

        {/* Success Toast */}
        <AnimatePresence>
          {submitted && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-full shadow-lg flex items-center gap-2 z-50"
            >
              <Shield size={18} />
              تم استلام رسالتك، سنرد خلال 24 ساعة
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
