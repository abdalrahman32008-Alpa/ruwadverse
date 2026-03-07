import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Lightbulb, Briefcase, TrendingUp, Sparkles, Check, ChevronDown, Shield, Users, Rocket, Globe } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0B0C0E] text-white font-sans overflow-x-hidden">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-[#0B0C0E]/80 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-[#FFD700] rounded-xl flex items-center justify-center text-black font-bold text-xl">R</div>
            <span className="text-xl font-bold tracking-tight">ruwadverse</span>
          </div>
          <div className="hidden md:flex gap-8 text-sm font-medium text-gray-300">
            <a href="#features" className="hover:text-white transition-colors">الميزات</a>
            <a href="#how-it-works" className="hover:text-white transition-colors">كيف يعمل</a>
            <a href="#pricing" className="hover:text-white transition-colors">الأسعار</a>
          </div>
          <div className="flex gap-4">
            <button onClick={() => navigate('/auth')} className="text-sm font-bold hover:text-[#FFD700] transition-colors">تسجيل الدخول</button>
            <button onClick={() => navigate('/auth')} className="bg-[#FFD700] text-black px-5 py-2 rounded-xl text-sm font-bold hover:bg-[#FFC000] transition-colors">
              ابدأ مجاناً
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-40 pb-32 px-6 text-center overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-[#FFD700]/10 rounded-full blur-[120px] -z-10" />
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 mb-8 text-sm text-[#FFD700]">
            <Sparkles size={14} />
            <span>الجيل القادم من ريادة الأعمال</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-8 tracking-tight leading-[1.1]">
            أطلق مشروعك الريادي <br />
            مع <span className="text-[#FFD700] relative">
              شريكك الذكي
              <svg className="absolute w-full h-3 -bottom-1 left-0 text-[#FFD700] opacity-30" viewBox="0 0 100 10" preserveAspectRatio="none">
                <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="2" fill="none" />
              </svg>
            </span>
          </h1>
          
          <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed">
            منصة متكاملة تجمع رواد الأعمال، المستثمرين، وأصحاب المهارات في بيئة واحدة مدعومة بالذكاء الاصطناعي لتحويل الأفكار إلى مشاريع ناجحة.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-20">
            <button onClick={() => navigate('/auth')} className="bg-[#FFD700] text-black px-8 py-4 rounded-xl font-bold text-lg hover:bg-[#FFC000] transition-all hover:scale-105 flex items-center justify-center gap-2">
              ابدأ رحلتك الآن <ArrowLeft className="rtl:rotate-180" />
            </button>
            <button className="bg-white/5 text-white border border-white/10 px-8 py-4 rounded-xl font-bold text-lg hover:bg-white/10 transition-all flex items-center justify-center gap-2">
              شاهد العرض التوضيحي
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 border-t border-white/10 pt-12 max-w-4xl mx-auto">
            {[
              { label: 'رائد أعمال', value: '+10K' },
              { label: 'مشروع ناجح', value: '+500' },
              { label: 'استثمارات', value: '$50M' },
              { label: 'شريك مؤسس', value: '+2K' },
            ].map((stat, i) => (
              <div key={i}>
                <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-sm text-gray-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-32 px-6 bg-[#0B0C0E]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-bold mb-6">كل ما تحتاجه للنجاح</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">أدوات متكاملة تغطي رحلة مشروعك من الفكرة وحتى التوسع والنمو.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Lightbulb, title: 'سوق الأفكار', desc: 'اعرض فكرتك واحصل على تقييم فوري من المجتمع والذكاء الاصطناعي.' },
              { icon: Users, title: 'بناء الفريق', desc: 'اعثر على الشريك المؤسس المثالي أو الموظفين الموهوبين لمشروعك.' },
              { icon: TrendingUp, title: 'جولات التمويل', desc: 'تواصل مع مستثمرين ملائكيين وصناديق استثمارية مهتمة بقطاعك.' },
              { icon: Shield, title: 'حماية الملكية', desc: 'توثيق الأفكار وحماية حقوق الملكية الفكرية عبر تقنية البلوك تشين.' },
              { icon: Rocket, title: 'مسرعة أعمال', desc: 'برامج تسريع أعمال افتراضية مع توجيه وإرشاد من خبراء عالميين.' },
              { icon: Globe, title: 'توسع عالمي', desc: 'أدوات لمساعدتك على دراسة الأسواق الجديدة والتوسع إقليمياً وعالمياً.' },
            ].map((item, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -10 }}
                className="p-8 rounded-3xl bg-[#141517] border border-white/10 hover:border-[#FFD700]/30 transition-all group"
              >
                <div className="w-14 h-14 bg-[#FFD700]/10 rounded-2xl flex items-center justify-center text-[#FFD700] mb-6 group-hover:bg-[#FFD700] group-hover:text-black transition-colors">
                  <item.icon size={28} />
                </div>
                <h3 className="text-2xl font-bold mb-4">{item.title}</h3>
                <p className="text-gray-400 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-6">
        <div className="max-w-5xl mx-auto bg-gradient-to-r from-[#FFD700] to-[#FFC000] rounded-[3rem] p-12 md:p-24 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
          
          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-bold text-black mb-8">جاهز لتحويل فكرتك إلى واقع؟</h2>
            <p className="text-xl text-black/70 mb-12 max-w-2xl mx-auto">
              انضم إلى آلاف الرواد الذين يبنون مستقبلهم اليوم مع ruwadverse.
            </p>
            <button onClick={() => navigate('/auth')} className="bg-black text-white px-10 py-5 rounded-2xl font-bold text-lg hover:bg-gray-900 transition-transform hover:scale-105 shadow-2xl">
              انضم مجاناً الآن
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-20 px-6 bg-[#050505]">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-[#FFD700] rounded-lg flex items-center justify-center text-black font-bold">R</div>
              <span className="text-xl font-bold">ruwadverse</span>
            </div>
            <p className="text-gray-400 max-w-sm leading-relaxed">
              المنصة الأولى عربياً لتمكين رواد الأعمال وبناء الشركات الناشئة الناجحة باستخدام أحدث تقنيات الذكاء الاصطناعي.
            </p>
          </div>
          <div>
            <h4 className="font-bold mb-6">المنصة</h4>
            <ul className="space-y-4 text-gray-400">
              <li><a href="#" className="hover:text-[#FFD700]">عن المنصة</a></li>
              <li><a href="#" className="hover:text-[#FFD700]">الوظائف</a></li>
              <li><a href="#" className="hover:text-[#FFD700]">المدونة</a></li>
              <li><a href="#" className="hover:text-[#FFD700]">تواصل معنا</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-6">قانوني</h4>
            <ul className="space-y-4 text-gray-400">
              <li><a href="#" className="hover:text-[#FFD700]">شروط الاستخدام</a></li>
              <li><a href="#" className="hover:text-[#FFD700]">سياسة الخصوصية</a></li>
              <li><a href="#" className="hover:text-[#FFD700]">ملفات تعريف الارتباط</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto pt-8 border-t border-white/5 text-center text-gray-500 text-sm">
          © {new Date().getFullYear()} ruwadverse. جميع الحقوق محفوظة.
        </div>
      </footer>
    </div>
  );
};
