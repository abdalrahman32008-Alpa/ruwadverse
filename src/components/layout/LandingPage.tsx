import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  ArrowRight, CheckCircle, Users, Lightbulb, TrendingUp, 
  MessageSquare, Shield, Star, Mic, Zap, Award, Bookmark,
  Bot, ShoppingBag, Globe
} from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { supabase } from '../../lib/supabase';

export const LandingPage = () => {
  const { t, dir } = useLanguage();
  const [stats, setStats] = useState({ users: 0, ideas: 0, partnerships: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      // Mock fetching or real fetching if tables exist
      // const { count: usersCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true });
      // const { count: ideasCount } = await supabase.from('ideas').select('*', { count: 'exact', head: true });
      
      // Simulating real data for now
      setStats({
        users: 12543,
        ideas: 842,
        partnerships: 156
      });
    };
    fetchStats();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-[#0d1117] text-white overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,215,0,0.1),transparent_50%)]" />
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              {t('heroTitle')} <br />
              <span className="text-[#FFD700]">{t('heroSubtitle')}</span>
            </h1>
            <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
              {t('heroDesc')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Link 
                to="/auth" 
                className="bg-[#FFD700] text-black px-8 py-4 rounded-xl font-bold text-lg hover:bg-[#FFC000] transition-colors flex items-center justify-center gap-2"
              >
                {t('startNow')} <ArrowRight size={20} />
              </Link>
              <a 
                href="#features" 
                className="bg-white/5 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white/10 transition-colors border border-white/10"
              >
                {t('learnMore')}
              </a>
            </div>

            {/* Stats Counter */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-sm">
              <div>
                <div className="text-4xl font-bold text-[#FFD700] mb-2">+{stats.users.toLocaleString()}</div>
                <div className="text-gray-300 font-medium">مستخدم نشط</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-[#FFD700] mb-2">+{stats.ideas.toLocaleString()}</div>
                <div className="text-gray-300 font-medium">فكرة مشروع</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-[#FFD700] mb-2">+{stats.partnerships.toLocaleString()}</div>
                <div className="text-gray-300 font-medium">شراكة ناجحة</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-20 px-4 bg-[#141517]">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-bold text-center mb-16">
            {t('problemTitle')}
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: t('problem1Title'), desc: t('problem1Desc'), icon: Users },
              { title: t('problem2Title'), desc: t('problem2Desc'), icon: Lightbulb },
              { title: t('problem3Title'), desc: t('problem3Desc'), icon: TrendingUp },
            ].map((item, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="bg-[#0d1117] p-8 rounded-3xl border border-white/5 hover:border-red-500/30 transition-colors group"
              >
                <div className="w-14 h-14 bg-red-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-red-500/20 transition-colors">
                  <item.icon className="text-red-500" size={28} />
                </div>
                <h3 className="text-xl font-bold mb-4">{item.title}</h3>
                <p className="text-gray-400 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-bold text-center mb-16">
            {t('solutionTitle')}
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: t('solution1Title'), desc: t('solution1Desc'), icon: Users },
              { title: t('solution2Title'), desc: t('solution2Desc'), icon: Bot },
              { title: t('solution3Title'), desc: t('solution3Desc'), icon: TrendingUp },
            ].map((item, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="bg-[#141517] p-8 rounded-3xl border border-white/5 hover:border-[#FFD700]/30 transition-colors group"
              >
                <div className="w-14 h-14 bg-[#FFD700]/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-[#FFD700]/20 transition-colors">
                  <item.icon className="text-[#FFD700]" size={28} />
                </div>
                <h3 className="text-xl font-bold mb-4">{item.title}</h3>
                <p className="text-gray-400 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* RAED Section */}
      <section className="py-20 px-4 bg-[#141517] overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-16">
          <div className="flex-1">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                {t('raedTitle')} <br />
                <span className="text-[#FFD700]">{t('raedSubtitle')}</span>
              </h2>
              <p className="text-xl text-gray-400 mb-8">
                {t('raedDesc')}
              </p>
              <ul className="space-y-4">
                {[t('raedFeature1'), t('raedFeature2'), t('raedFeature3')].map((feature, i) => (
                  <li key={i} className="flex items-center gap-3 text-lg">
                    <CheckCircle className="text-[#FFD700]" size={24} />
                    {feature}
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
          <div className="flex-1 relative">
            <div className="absolute inset-0 bg-[#FFD700]/20 blur-[100px] rounded-full" />
            <img 
              src="https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=800" 
              alt="RAED AI" 
              className="relative z-10 rounded-3xl border border-white/10 shadow-2xl"
            />
          </div>
        </div>
      </section>

      {/* New Features Grid */}
      <section id="features" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-bold text-center mb-16">
            {t('features')}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: MessageSquare, label: t('community') },
              { icon: Bot, label: t('raed') },
              { icon: Zap, label: t('stories') },
              { icon: ShoppingBag, label: t('marketplace') },
              { icon: Shield, label: t('smartContracts') },
              { icon: Star, label: t('reputationSystem') },
              { icon: Mic, label: t('audioRooms') },
              { icon: Users, label: t('smartMatching') },
              { icon: Bookmark, label: t('bookmarks') },
              { icon: Award, label: t('achievements') },
            ].map((feature, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.05 }}
                className="bg-[#141517] p-6 rounded-2xl border border-white/5 flex flex-col items-center justify-center text-center gap-4 hover:bg-white/5 transition-colors"
              >
                <feature.icon className="text-[#FFD700]" size={32} />
                <span className="font-bold">{feature.label}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-20 px-4 bg-[#141517]">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-bold text-center mb-16">
            لماذا Ruwadverse؟
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-right border-collapse">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="p-4 text-gray-400 font-normal">الميزة</th>
                  <th className="p-4 text-[#FFD700] text-xl font-bold">Ruwadverse</th>
                  <th className="p-4 text-gray-500">LinkedIn</th>
                  <th className="p-4 text-gray-500">Facebook</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { feature: t('aiCoFounder'), ruwad: true, others: false },
                  { feature: t('smartPartnerMatching'), ruwad: true, others: false },
                  { feature: t('contractVerification'), ruwad: true, others: false },
                  { feature: t('specializedCommunity'), ruwad: true, others: true },
                  { feature: t('companyBuildingTools'), ruwad: true, others: false },
                ].map((row, i) => (
                  <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="p-4 font-bold">{row.feature}</td>
                    <td className="p-4"><CheckCircle className="text-[#FFD700]" /></td>
                    <td className="p-4"><div className="w-2 h-2 bg-gray-700 rounded-full" /></td>
                    <td className="p-4"><div className="w-2 h-2 bg-gray-700 rounded-full" /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-bold text-center mb-16">
            {t('pricingTitle')}
          </h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Free Plan */}
            <div className="bg-[#141517] p-8 rounded-3xl border border-white/10">
              <h3 className="text-2xl font-bold mb-2">{t('freePlan')}</h3>
            <div className="text-4xl font-bold text-white mb-6">0 <span className="text-lg text-gray-400">{t('sar')} / {t('month')}</span></div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-3"><CheckCircle size={20} className="text-gray-400" /> {t('communityAccess')}</li>
                <li className="flex items-center gap-3"><CheckCircle size={20} className="text-gray-400" /> {t('browseIdeas')}</li>
                <li className="flex items-center gap-3"><CheckCircle size={20} className="text-gray-400" /> {t('basicProfile')}</li>
              </ul>
              <Link to="/auth" className="block w-full bg-white/10 text-white py-3 rounded-xl font-bold text-center hover:bg-white/20 transition-colors">
                {t('startNow')}
              </Link>
            </div>

            {/* Pro Plan */}
            <div className="bg-gradient-to-b from-[#FFD700]/10 to-[#141517] p-8 rounded-3xl border border-[#FFD700]/30 relative overflow-hidden">
              <div className="absolute top-4 right-4 bg-[#FFD700] text-black text-xs font-bold px-3 py-1 rounded-full">الأكثر طلباً</div>
              <h3 className="text-2xl font-bold mb-2 text-[#FFD700]">{t('proPlan')}</h3>
            <div className="text-4xl font-bold text-[#FFD700] mb-6">99 <span className="text-lg text-gray-400">{t('sar')} / {t('month')}</span></div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-3"><CheckCircle size={20} className="text-[#FFD700]" /> {t('allFreeFeatures')}</li>
                <li className="flex items-center gap-3"><CheckCircle size={20} className="text-[#FFD700]" /> {t('unlimitedRaed')}</li>
                <li className="flex items-center gap-3"><CheckCircle size={20} className="text-[#FFD700]" /> {t('accountVerification')}</li>
                <li className="flex items-center gap-3"><CheckCircle size={20} className="text-[#FFD700]" /> {t('priorityVisibility')}</li>
              </ul>
              <Link to="/auth" className="block w-full bg-[#FFD700] text-black py-3 rounded-xl font-bold text-center hover:bg-[#FFC000] transition-colors">
                {t('subscribe')}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-[#FFD700] text-black text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-6xl font-bold mb-8">جاهز لبدء رحلتك؟</h2>
          <p className="text-xl mb-10 max-w-2xl mx-auto opacity-80">
            انضم الآن إلى آلاف الرواد الذين يبنون مستقبلهم مع Ruwadverse.
          </p>
          <Link 
            to="/auth" 
            className="bg-black text-white px-12 py-5 rounded-xl font-bold text-xl hover:bg-gray-900 transition-colors inline-block"
          >
            {t('startNow')}
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#050505] py-12 px-4 border-t border-white/10">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-2xl font-bold text-[#FFD700] mb-4">Ruwadverse</h3>
            <p className="text-gray-400">{t('platformDesc')}</p>
          </div>
          <div>
            <h4 className="font-bold mb-4">{t('quickLinks')}</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link to="/" className="hover:text-[#FFD700]">{t('home')}</Link></li>
              <li><Link to="/about" className="hover:text-[#FFD700]">{t('about')}</Link></li>
              <li><Link to="/contact" className="hover:text-[#FFD700]">{t('contactUs')}</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">{t('legal')}</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link to="/privacy" className="hover:text-[#FFD700]">{t('privacyPolicy')}</Link></li>
              <li><Link to="/terms" className="hover:text-[#FFD700]">{t('terms')}</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">{t('contactUs')}</h4>
            <div className="flex gap-4">
              {/* Social Icons */}
              <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-[#FFD700] hover:text-black transition-colors cursor-pointer">
                <MessageSquare size={20} />
              </div>
              <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-[#FFD700] hover:text-black transition-colors cursor-pointer">
                <Globe size={20} />
              </div>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-white/10 text-center text-gray-500">
          {t('rightsReserved')}
        </div>
      </footer>
    </div>
  );
};
