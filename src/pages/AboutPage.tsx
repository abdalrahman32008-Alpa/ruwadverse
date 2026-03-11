import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, Target, Users, Rocket } from 'lucide-react';

export const AboutPage = () => {
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

      <div className="max-w-5xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
            className="w-20 h-20 mx-auto bg-gradient-to-br from-[#FFD700] to-orange-500 rounded-2xl flex items-center justify-center mb-8 shadow-[0_0_40px_rgba(255,215,0,0.3)] rotate-12"
          >
            <Sparkles size={40} className="text-black -rotate-12" />
          </motion.div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-white via-[#FFD700] to-white">من نحن</h1>
          <p className="text-xl md:text-2xl text-gray-400 leading-relaxed max-w-3xl mx-auto font-light">
            نحن منصة "رواد فيرس"، الجسر الرقمي الذي يربط بين الطموح والفرصة في العالم العربي.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 mb-24">
          {[
            { value: '+10K', label: 'مستخدم نشط', icon: Users, delay: 0.2 },
            { value: '+500', label: 'شراكة ناجحة', icon: Target, delay: 0.4 },
            { value: '100M+', label: 'ج.م استثمارات مسهلة', icon: Rocket, delay: 0.6 }
          ].map((stat, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: stat.delay, duration: 0.5 }}
              whileHover={{ y: -10, scale: 1.02 }}
              className="bg-[#141517]/80 backdrop-blur-xl p-8 rounded-3xl border border-white/5 text-center relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#FFD700]/0 to-[#FFD700]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <stat.icon size={32} className="mx-auto mb-6 text-gray-500 group-hover:text-[#FFD700] transition-colors duration-500" />
              <h3 className="text-5xl font-bold text-white mb-3 group-hover:text-[#FFD700] transition-colors duration-500">{stat.value}</h3>
              <p className="text-gray-400 font-medium">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        <div className="space-y-24">
          <motion.section 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex flex-col md:flex-row gap-12 items-center"
          >
            <div className="flex-1">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white flex items-center gap-4">
                <span className="w-12 h-1 bg-[#FFD700] rounded-full" />
                قصتنا
              </h2>
              <p className="text-lg text-gray-300 leading-relaxed font-light">
                بدأت فكرة رواد فيرس من حاجة ملحة في السوق العربي: الكثير من الأفكار الرائعة تموت لأن أصحابها لا يجدون الشريك التقني المناسب أو التمويل اللازم. قررنا استخدام الذكاء الاصطناعي (RAED) لسد هذه الفجوة وبناء مجتمع ريادي متكامل.
              </p>
            </div>
            <div className="flex-1 relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-[#FFD700]/20 to-transparent rounded-3xl blur-2xl" />
              <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80" alt="Team collaboration" className="rounded-3xl relative z-10 border border-white/10 shadow-2xl" />
            </div>
          </motion.section>
          
          <motion.section 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex flex-col md:flex-row-reverse gap-12 items-center"
          >
            <div className="flex-1">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white flex items-center gap-4">
                <span className="w-12 h-1 bg-[#FFD700] rounded-full" />
                رؤيتنا
              </h2>
              <p className="text-lg text-gray-300 leading-relaxed font-light">
                أن نكون المنصة الأولى عالمياً لتمكين رواد الأعمال العرب، وخلق مليون فرصة عمل من خلال الشركات الناشئة التي تنطلق من منصتنا بحلول عام 2030.
              </p>
            </div>
            <div className="flex-1 relative">
              <div className="absolute inset-0 bg-gradient-to-bl from-blue-500/20 to-transparent rounded-3xl blur-2xl" />
              <img src="https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=800&q=80" alt="Future vision" className="rounded-3xl relative z-10 border border-white/10 shadow-2xl" />
            </div>
          </motion.section>
        </div>
      </div>
    </div>
  );
};
