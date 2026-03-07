import React from 'react';
import { Layout } from './Layout';
import { motion } from 'motion/react';
import { ArrowLeft, Lightbulb, Briefcase, TrendingUp, Sparkles, Check, ChevronDown, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <Layout>
      <section className="relative pt-20 pb-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-5xl md:text-7xl font-bold mb-8 tracking-tight leading-[1.1]">
            منصة <span className="text-[#FFD700]">ruwadverse</span> <br />
            لريادة الأعمال الذكية
          </h1>
          <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
            تجمع أصحاب الأفكار، المهارات، والمستثمرين في بيئة واحدة مدعومة بالذكاء الاصطناعي.
          </p>
          <div className="flex justify-center gap-4">
            <button onClick={() => navigate('/auth')} className="bg-[#FFD700] text-black px-8 py-4 rounded-xl font-bold text-lg hover:bg-[#FFC000] transition-colors">
              ابدأ رحلتك الآن
            </button>
          </div>
        </motion.div>
      </section>

      <section className="py-20 grid md:grid-cols-3 gap-8">
        {[
          { icon: Lightbulb, title: 'صاحب فكرة', desc: 'حوّل فكرتك لمشروع حقيقي' },
          { icon: Briefcase, title: 'صاحب مهارة', desc: 'انضم لفرق عمل واعدة' },
          { icon: TrendingUp, title: 'مستثمر', desc: 'استثمر في أفكار واعدة' },
        ].map((item, i) => (
          <div key={i} className="p-8 rounded-3xl bg-[#141517] border border-white/10 hover:border-[#FFD700]/50 transition-colors">
            <item.icon size={48} className="text-[#FFD700] mb-6" />
            <h3 className="text-2xl font-bold mb-4">{item.title}</h3>
            <p className="text-gray-400">{item.desc}</p>
          </div>
        ))}
      </section>
    </Layout>
  );
};
