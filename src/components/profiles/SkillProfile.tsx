import React, { useState } from 'react';
import { motion } from 'motion/react';
import { MapPin, Briefcase, ExternalLink, Edit2, Share2, CheckCircle, Plus, Star, Award, TrendingUp, Users, Eye } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

// --- مكون ملف صاحب المهارة ---
// يعرض هذا المكون الملف الشخصي للمستخدم من نوع "صاحب مهارة"
// يحتوي على أقسام للمهارات، المشاريع، الخبرات، والتوصيات
export const SkillProfile = () => {
  const [ssiScore, setSsiScore] = useState(85);

  // بيانات المهارات (وهمية)
  const skills = [
    { name: 'React.js', level: 'خبير', years: 5, progress: 95 },
    { name: 'Node.js', level: 'محترف', years: 4, progress: 85 },
    { name: 'UI/UX Design', level: 'متوسط', years: 2, progress: 60 },
    { name: 'TypeScript', level: 'محترف', years: 3, progress: 80 },
  ];

  const projects = [
    {
      title: 'منصة تعليمية',
      desc: 'تطبيق ويب تفاعلي لتعليم البرمجة للأطفال باستخدام الألعاب.',
      image: 'https://picsum.photos/seed/edtech/400/200',
      link: '#'
    },
    {
      title: 'متجر إلكتروني',
      desc: 'نظام تجارة إلكترونية متكامل مع بوابة دفع ودعم متعدد اللغات.',
      image: 'https://picsum.photos/seed/ecommerce/400/200',
      link: '#'
    }
  ];

  const experience = [
    {
      role: 'Senior Frontend Developer',
      company: 'Tech Solutions Co.',
      period: '2021 - الآن',
      desc: 'قيادة فريق الواجهة الأمامية وتطوير بنية تحتية قابلة للتوسع.'
    },
    {
      role: 'Full Stack Developer',
      company: 'StartUp Inc.',
      period: '2019 - 2021',
      desc: 'بناء وتطوير تطبيقات الويب من الصفر باستخدام MERN Stack.'
    }
  ];

  const recommendations = [
    {
      name: 'أحمد محمد',
      role: 'CTO at Tech Solutions',
      text: 'من أفضل المطورين الذين عملت معهم. دقة في العمل والتزام بالمواعيد.',
      image: 'https://picsum.photos/seed/user1/100/100'
    },
    {
      name: 'سارة علي',
      role: 'Product Manager',
      text: 'مبدع في حل المشاكل التقنية المعقدة ودائماً يقدم حلولاً مبتكرة.',
      image: 'https://picsum.photos/seed/user2/100/100'
    }
  ];

  return (
    <div className="min-h-screen bg-[#0B0C0E] text-white pb-20 pt-20">
      {/* Header Section */}
      <div className="relative mb-20">
        <div className="h-64 w-full bg-gradient-to-r from-[#FFD700]/20 via-[#FFA500]/20 to-[#FFD700]/20 relative overflow-hidden group">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
          <button className="absolute top-4 left-4 bg-black/50 p-2 rounded-full hover:bg-black/70 transition-colors opacity-0 group-hover:opacity-100">
            <Edit2 size={18} className="text-white" />
          </button>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="absolute -top-24 right-8 flex items-end gap-6">
            <div className="relative">
              <img 
                src="https://picsum.photos/seed/avatar/200/200" 
                alt="Profile" 
                className="w-40 h-40 rounded-full border-4 border-[#0B0C0E] shadow-2xl object-cover"
              />
              <button className="absolute bottom-2 left-2 bg-[#FFD700] p-2 rounded-full text-black hover:bg-[#FFC000] transition-colors shadow-lg">
                <Edit2 size={16} />
              </button>
            </div>
            
            <div className="mb-4 hidden md:block">
              <h1 className="text-3xl font-bold text-white mb-1 flex items-center gap-2">
                محمد عبد الله
                <CheckCircle size={20} className="text-[#FFD700]" fill="currentColor" stroke="black" />
              </h1>
              <p className="text-xl text-gray-300">مطور Full-Stack | متخصص React و Node.js</p>
              <div className="flex items-center gap-4 mt-2 text-sm text-gray-400">
                <span className="flex items-center gap-1"><MapPin size={14} /> الرياض، السعودية</span>
                <a href="#" className="flex items-center gap-1 text-[#FFD700] hover:underline"><ExternalLink size={14} /> portfolio.dev</a>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4 gap-3 md:hidden">
             {/* Mobile Header Content */}
             <div className="mt-16 text-center w-full">
                <h1 className="text-2xl font-bold text-white mb-1 flex items-center justify-center gap-2">
                  محمد عبد الله
                  <CheckCircle size={20} className="text-[#FFD700]" fill="currentColor" stroke="black" />
                </h1>
                <p className="text-sm text-gray-300">مطور Full-Stack | متخصص React و Node.js</p>
             </div>
          </div>

          <div className="flex justify-start pt-4 gap-3 mt-4 md:mt-0 md:absolute md:top-4 md:left-4">
            <button className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors">
              <Edit2 size={16} />
              <span>تعديل الملف</span>
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-[#FFD700] text-black rounded-xl hover:bg-[#FFC000] transition-colors font-bold">
              <Share2 size={16} />
              <span>مشاركة</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column (Main Content) */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* About Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#141517] border border-white/5 rounded-2xl p-6"
          >
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <span className="w-1 h-6 bg-[#FFD700] rounded-full"></span>
              نبذة عني
            </h2>
            <p className="text-gray-300 leading-relaxed">
              مطور برمجيات شغوف بخبرة تزيد عن 5 سنوات في بناء تطبيقات الويب القابلة للتوسع. أبحث عن فرصة للانضمام كشريك تقني في شركة ناشئة طموحة في مجال التقنية المالية أو التعليم. أؤمن بقوة الكود النظيف والتصميم المرتكز على المستخدم.
            </p>
            <div className="mt-4 flex gap-2">
              <span className="px-3 py-1 bg-[#FFD700]/10 text-[#FFD700] rounded-full text-sm border border-[#FFD700]/20">بحث عن شراكة</span>
              <span className="px-3 py-1 bg-blue-500/10 text-blue-400 rounded-full text-sm border border-blue-500/20">متاح للمشاريع</span>
            </div>
          </motion.div>

          {/* Skills Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-[#141517] border border-white/5 rounded-2xl p-6"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <span className="w-1 h-6 bg-[#FFD700] rounded-full"></span>
                المهارات
              </h2>
              <button className="text-[#FFD700] hover:bg-[#FFD700]/10 p-2 rounded-lg transition-colors">
                <Plus size={20} />
              </button>
            </div>
            <div className="space-y-6">
              {skills.map((skill, idx) => (
                <div key={idx} className="group">
                  <div className="flex justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white">{skill.name}</span>
                      <span className="text-xs text-gray-500 px-2 py-0.5 bg-white/5 rounded-full">{skill.level}</span>
                    </div>
                    <span className="text-sm text-gray-400">{skill.years} سنوات خبرة</span>
                  </div>
                  <div className="h-2 bg-white/5 rounded-full overflow-hidden relative">
                    <motion.div 
                      initial={{ width: 0 }}
                      whileInView={{ width: `${skill.progress}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className="h-full bg-gradient-to-r from-[#FFD700] to-[#FFA500] rounded-full"
                    />
                  </div>
                  <div className="mt-2 flex justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="text-xs text-gray-400 hover:text-[#FFD700] flex items-center gap-1">
                      <CheckCircle size={12} /> تأييد المهارة (12)
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Projects Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-[#141517] border border-white/5 rounded-2xl p-6"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <span className="w-1 h-6 bg-[#FFD700] rounded-full"></span>
                المشاريع والبورتفوليو
              </h2>
              <button className="text-[#FFD700] hover:bg-[#FFD700]/10 p-2 rounded-lg transition-colors">
                <Plus size={20} />
              </button>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {projects.map((project, idx) => (
                <div key={idx} className="group bg-black/20 rounded-xl overflow-hidden border border-white/5 hover:border-[#FFD700]/50 transition-all">
                  <div className="h-32 overflow-hidden">
                    <img src={project.image} alt={project.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-white mb-1">{project.title}</h3>
                    <p className="text-sm text-gray-400 mb-3 line-clamp-2">{project.desc}</p>
                    <a href={project.link} className="text-xs text-[#FFD700] flex items-center gap-1 hover:underline">
                      عرض المشروع <ExternalLink size={10} />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Experience Timeline */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-[#141517] border border-white/5 rounded-2xl p-6"
          >
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <span className="w-1 h-6 bg-[#FFD700] rounded-full"></span>
              الخبرات السابقة
            </h2>
            <div className="space-y-8 relative before:absolute before:right-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-white/10">
              {experience.map((exp, idx) => (
                <div key={idx} className="relative pr-8">
                  <div className="absolute right-0 top-1 w-4 h-4 bg-[#FFD700] rounded-full border-4 border-[#141517] shadow-[0_0_10px_rgba(255,215,0,0.5)]"></div>
                  <h3 className="text-lg font-bold text-white">{exp.role}</h3>
                  <div className="text-[#FFD700] text-sm mb-1">{exp.company}</div>
                  <span className="text-xs text-gray-500 block mb-2">{exp.period}</span>
                  <p className="text-sm text-gray-400">{exp.desc}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Recommendations */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-[#141517] border border-white/5 rounded-2xl p-6"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <span className="w-1 h-6 bg-[#FFD700] rounded-full"></span>
                التوصيات
              </h2>
              <button className="text-sm text-[#FFD700] hover:underline">طلب توصية</button>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {recommendations.map((rec, idx) => (
                <div key={idx} className="bg-white/5 p-4 rounded-xl border border-white/5">
                  <div className="flex items-center gap-3 mb-3">
                    <img src={rec.image} alt={rec.name} className="w-10 h-10 rounded-full" />
                    <div>
                      <h4 className="font-bold text-white text-sm">{rec.name}</h4>
                      <p className="text-xs text-gray-400">{rec.role}</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-300 italic">"{rec.text}"</p>
                </div>
              ))}
            </div>
          </motion.div>

        </div>

        {/* Right Column (Sidebar) */}
        <div className="space-y-6">
          
          {/* Completion Badge */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-[#141517] border border-white/5 rounded-2xl p-6 text-center relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-20 h-20 bg-[#FFD700]/10 rounded-bl-full -mr-4 -mt-4"></div>
            <h3 className="text-lg font-bold text-white mb-4">مستوى إكمال الملف</h3>
            <div className="relative w-32 h-32 mx-auto mb-4">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="64" cy="64" r="56" stroke="rgba(255,255,255,0.1)" strokeWidth="8" fill="none" />
                <circle cx="64" cy="64" r="56" stroke="#FFD700" strokeWidth="8" fill="none" strokeDasharray="351.86" strokeDashoffset={351.86 * (1 - ssiScore / 100)} className="transition-all duration-1000 ease-out" />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center flex-col">
                <span className="text-2xl font-bold text-white">{ssiScore}%</span>
                <span className="text-xs text-gray-400">متقدم</span>
              </div>
            </div>
            <p className="text-sm text-gray-400 mb-4">أكمل قسم "الشهادات" لزيادة فرص ظهورك.</p>
            <button className="w-full py-2 bg-white/5 hover:bg-white/10 text-white rounded-xl text-sm transition-colors">إكمال الملف</button>
          </motion.div>

          {/* Stats */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-[#141517] border border-white/5 rounded-2xl p-6"
          >
            <h3 className="text-lg font-bold text-white mb-4">إحصائيات الملف</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-500/20 text-blue-400 rounded-lg"><Eye size={18} /></div>
                  <span className="text-sm text-gray-300">الظهور في البحث</span>
                </div>
                <span className="font-bold text-white">1,240</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-500/20 text-green-400 rounded-lg"><Briefcase size={18} /></div>
                  <span className="text-sm text-gray-300">طلبات الشراكة</span>
                </div>
                <span className="font-bold text-white">8</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-[#FFD700]/20 text-[#FFD700] rounded-lg"><TrendingUp size={18} /></div>
                  <span className="text-sm text-gray-300">نسبة التوافق</span>
                </div>
                <span className="font-bold text-white">85%</span>
              </div>
            </div>
          </motion.div>

          {/* Availability */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-[#FFD700]/10 to-transparent border border-[#FFD700]/20 rounded-2xl p-6"
          >
            <div className="flex items-start gap-3">
              <Star className="text-[#FFD700] mt-1" size={20} fill="#FFD700" />
              <div>
                <h3 className="font-bold text-white mb-1">متاح للشراكة</h3>
                <p className="text-sm text-gray-400 mb-3">أبحث عن شريك مؤسس لمشروع تقني.</p>
                <button className="text-xs bg-[#FFD700] text-black px-3 py-1.5 rounded-lg font-bold hover:bg-[#FFC000] transition-colors">تواصل معي</button>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
};
