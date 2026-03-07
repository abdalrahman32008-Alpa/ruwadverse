import React from 'react';
import { motion } from 'motion/react';

export const AboutPage = () => {
  return (
    <div className="min-h-screen bg-[#0B0C0E] text-white pt-24 pb-20 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-[#FFD700]">من نحن</h1>
          <p className="text-xl text-gray-400 leading-relaxed">
            نحن منصة "رواد فيرس"، الجسر الرقمي الذي يربط بين الطموح والفرصة في العالم العربي.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-[#141517] p-8 rounded-2xl border border-white/5 text-center">
            <h3 className="text-4xl font-bold text-[#FFD700] mb-2">+10K</h3>
            <p className="text-gray-400">مستخدم نشط</p>
          </div>
          <div className="bg-[#141517] p-8 rounded-2xl border border-white/5 text-center">
            <h3 className="text-4xl font-bold text-[#FFD700] mb-2">+500</h3>
            <p className="text-gray-400">شراكة ناجحة</p>
          </div>
          <div className="bg-[#141517] p-8 rounded-2xl border border-white/5 text-center">
            <h3 className="text-4xl font-bold text-[#FFD700] mb-2">$2M+</h3>
            <p className="text-gray-400">استثمارات مسهلة</p>
          </div>
        </div>

        <div className="space-y-12">
          <section>
            <h2 className="text-2xl font-bold mb-4 text-white">قصتنا</h2>
            <p className="text-gray-300 leading-loose">
              بدأت فكرة رواد فيرس من حاجة ملحة في السوق العربي: الكثير من الأفكار الرائعة تموت لأن أصحابها لا يجدون الشريك التقني المناسب أو التمويل اللازم. قررنا استخدام الذكاء الاصطناعي (RAED) لسد هذه الفجوة وبناء مجتمع ريادي متكامل.
            </p>
          </section>
          
          <section>
            <h2 className="text-2xl font-bold mb-4 text-white">رؤيتنا</h2>
            <p className="text-gray-300 leading-loose">
              أن نكون المنصة الأولى عالمياً لتمكين رواد الأعمال العرب، وخلق مليون فرصة عمل من خلال الشركات الناشئة التي تنطلق من منصتنا بحلول عام 2030.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};
