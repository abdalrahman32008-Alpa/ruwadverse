import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Eye, Users, TrendingUp, DollarSign, Activity, Target, ArrowUpRight, ArrowDownRight, Plus, Sparkles } from 'lucide-react';
import { IdeaAnalyzer } from '../components/IdeaAnalyzer';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

export const FounderDashboard = () => {
  const { user } = useAuth();
  const [showAnalyzer, setShowAnalyzer] = useState(false);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    views: 0,
    requests: 0,
    conversion: 0,
    investors: 0
  });
  const [chartData, setChartData] = useState<any[]>([]);
  const [pieData, setPieData] = useState<any[]>([]);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  const [showOnboarding, setShowOnboarding] = useState(false);
  const [onboardingStep, setOnboardingStep] = useState(0);

  const marketingTips = [
    "منشورات LinkedIn التي تحتوي على أرقام حقيقية تحصل على تفاعل أعلى بنسبة 40%.",
    "استخدم 'جواز سفر المشروع' الخاص بك في توقيع بريدك الإلكتروني لجذب المستثمرين.",
    "أفضل وقت للنشر على تويتر للمشاريع الناشئة هو الثلاثاء الساعة 10 صباحاً.",
    "القصص الشخصية (Storytelling) هي أقوى أداة تسويقية للمؤسسين في المراحل الأولى.",
    "تفاعل مع منشورات المستثمرين في قطاعك قبل أن تطلب منهم الاستثمار."
  ];

  const [currentTip, setCurrentTip] = useState(marketingTips[0]);

  useEffect(() => {
    setCurrentTip(marketingTips[Math.floor(Math.random() * marketingTips.length)]);
  }, []);

  useEffect(() => {
    const hasSeenOnboarding = localStorage.getItem('hasSeenDashboardOnboarding');
    if (!hasSeenOnboarding) {
      setShowOnboarding(true);
    }
  }, []);

  const completeOnboarding = () => {
    localStorage.setItem('hasSeenDashboardOnboarding', 'true');
    setShowOnboarding(false);
  };

  const onboardingSteps = [
    { title: 'مرحباً بك في لوحة التحكم', content: 'هنا يمكنك متابعة أداء أفكارك وتفاعلات المستثمرين والشركاء معها.' },
    { title: 'الإحصائيات السريعة', content: 'تابع المشاهدات، طلبات الشراكة، ومعدل التحويل في لمحة واحدة.' },
    { title: 'محلل الأفكار RAED', content: 'استخدم الذكاء الاصطناعي لتحليل فكرتك وتطويرها قبل نشرها للمستثمرين.' },
  ];

  useEffect(() => {
    if (!user) return;

    const fetchDashboardData = async () => {
      try {
        // Fetch user's ideas
        const { data: ideas, error: ideasError } = await supabase
          .from('ideas')
          .select('*')
          .eq('user_id', user.id);

        if (ideasError) throw ideasError;

        // Fetch partnerships (requests)
        const ideaIds = ideas?.map(i => i.id) || [];
        let partnershipsCount = 0;
        let investmentsCount = 0;

        if (ideaIds.length > 0) {
            const { count: pCount } = await supabase
                .from('partnerships')
                .select('*', { count: 'exact', head: true })
                .in('idea_id', ideaIds);
            partnershipsCount = pCount || 0;

            const { count: iCount } = await supabase
                .from('investments')
                .select('*', { count: 'exact', head: true })
                .in('idea_id', ideaIds);
            investmentsCount = iCount || 0;
        }

        // Calculate stats
        setStats({
            views: Math.floor(Math.random() * 1000) + 100, // Mock views for now
            requests: partnershipsCount,
            conversion: partnershipsCount > 0 ? Math.floor((partnershipsCount / (ideas?.length || 1)) * 100) : 0,
            investors: investmentsCount
        });

        // Generate Chart Data
        const months = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
        const currentYear = new Date().getFullYear();
        const monthlyData = Array(12).fill(0).map((_, i) => ({ name: months[i], ideas: 0, requests: 0 }));

        ideas?.forEach(idea => {
            const date = new Date(idea.created_at);
            if (date.getFullYear() === currentYear) {
                monthlyData[date.getMonth()].ideas += 1;
            }
        });

        const currentMonth = new Date().getMonth();
        setChartData(monthlyData.slice(0, currentMonth + 1));

        // Generate Pie Data
        const sectorCounts: Record<string, number> = {};
        ideas?.forEach(idea => {
            const sector = idea.sector || 'عام';
            sectorCounts[sector] = (sectorCounts[sector] || 0) + 1;
        });

        const newPieData = Object.keys(sectorCounts).map(sector => ({
            name: sector,
            value: sectorCounts[sector]
        }));
        setPieData(newPieData);

      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  return (
    <div className="min-h-screen bg-[#0B0C0E] text-white pt-24 pb-20 px-4 relative overflow-hidden">
      {/* Onboarding Overlay */}
      <AnimatePresence>
        {showOnboarding && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-[#1C1D20] w-full max-w-md rounded-3xl border border-[#FFD700]/30 p-8 text-center shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-white/5">
                <motion.div 
                  className="h-full bg-[#FFD700]" 
                  initial={{ width: 0 }}
                  animate={{ width: `${((onboardingStep + 1) / onboardingSteps.length) * 100}%` }}
                />
              </div>
              
              <div className="w-16 h-16 bg-[#FFD700]/10 rounded-2xl flex items-center justify-center text-[#FFD700] mx-auto mb-6">
                <Sparkles size={32} />
              </div>
              
              <h2 className="text-2xl font-bold mb-4">{onboardingSteps[onboardingStep].title}</h2>
              <p className="text-gray-400 mb-8 leading-relaxed">
                {onboardingSteps[onboardingStep].content}
              </p>
              
              <div className="flex gap-4">
                {onboardingStep < onboardingSteps.length - 1 ? (
                  <button 
                    onClick={() => setOnboardingStep(prev => prev + 1)}
                    className="flex-1 bg-[#FFD700] text-black py-3 rounded-xl font-bold hover:bg-[#FFC000] transition-all"
                  >
                    التالي
                  </button>
                ) : (
                  <button 
                    onClick={completeOnboarding}
                    className="flex-1 bg-[#FFD700] text-black py-3 rounded-xl font-bold hover:bg-[#FFC000] transition-all"
                  >
                    ابدأ الآن
                  </button>
                )}
                <button 
                  onClick={completeOnboarding}
                  className="px-6 py-3 text-gray-500 hover:text-white transition-colors"
                >
                  تخطي
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

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

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <h1 className="text-3xl font-bold text-white">لوحة التحكم</h1>
          <div className="flex gap-2 w-full sm:w-auto">
            <button className="flex-1 sm:flex-none px-4 py-2 bg-[#141517] border border-white/10 rounded-xl text-sm text-gray-300 hover:text-white hover:border-white/20 transition-all">تصدير</button>
            <button onClick={() => setShowAnalyzer(!showAnalyzer)} className="flex-[2] sm:flex-none px-4 py-2 bg-[#FFD700] text-black font-bold rounded-xl hover:bg-[#FFC000] transition-all text-sm flex items-center justify-center gap-2">
              <Plus size={16} />
              {showAnalyzer ? 'إخفاء المحلل' : 'فكرة جديدة (RAED)'}
            </button>
          </div>
        </div>

        {showAnalyzer && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mb-8">
            <IdeaAnalyzer />
          </motion.div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
          <div className="bg-[#141517] p-4 sm:p-6 rounded-2xl border border-white/5 relative overflow-hidden group hover:border-[#FFD700]/30 transition-all">
            <div className="absolute top-0 right-0 w-16 h-16 sm:w-24 sm:h-24 bg-[#FFD700]/5 rounded-bl-full -mr-4 -mt-4 sm:-mr-6 sm:-mt-6 transition-transform group-hover:scale-110"></div>
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 sm:p-3 bg-[#FFD700]/10 text-[#FFD700] rounded-xl"><Eye size={20} className="sm:w-6 sm:h-6" /></div>
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold text-white mb-1">{stats.views.toLocaleString()}</h3>
            <p className="text-[10px] sm:text-sm text-gray-400">إجمالي المشاهدات</p>
          </div>

          <div className="bg-[#141517] p-4 sm:p-6 rounded-2xl border border-white/5 relative overflow-hidden group hover:border-blue-500/30 transition-all">
            <div className="absolute top-0 right-0 w-16 h-16 sm:w-24 sm:h-24 bg-blue-500/5 rounded-bl-full -mr-4 -mt-4 sm:-mr-6 sm:-mt-6 transition-transform group-hover:scale-110"></div>
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 sm:p-3 bg-blue-500/10 text-blue-500 rounded-xl"><Users size={20} className="sm:w-6 sm:h-6" /></div>
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold text-white mb-1">{stats.requests}</h3>
            <p className="text-[10px] sm:text-sm text-gray-400">طلبات الشراكة</p>
          </div>

          <div className="bg-[#141517] p-4 sm:p-6 rounded-2xl border border-white/5 relative overflow-hidden group hover:border-purple-500/30 transition-all">
            <div className="absolute top-0 right-0 w-16 h-16 sm:w-24 sm:h-24 bg-purple-500/5 rounded-bl-full -mr-4 -mt-4 sm:-mr-6 sm:-mt-6 transition-transform group-hover:scale-110"></div>
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 sm:p-3 bg-purple-500/10 text-purple-500 rounded-xl"><Target size={20} className="sm:w-6 sm:h-6" /></div>
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold text-white mb-1">{stats.conversion}%</h3>
            <p className="text-[10px] sm:text-sm text-gray-400">معدل التحويل</p>
          </div>

          <div className="bg-[#141517] p-4 sm:p-6 rounded-2xl border border-white/5 relative overflow-hidden group hover:border-green-500/30 transition-all">
            <div className="absolute top-0 right-0 w-16 h-16 sm:w-24 sm:h-24 bg-green-500/5 rounded-bl-full -mr-4 -mt-4 sm:-mr-6 sm:-mt-6 transition-transform group-hover:scale-110"></div>
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 sm:p-3 bg-green-500/10 text-green-500 rounded-xl"><DollarSign size={20} className="sm:w-6 sm:h-6" /></div>
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold text-white mb-1">{stats.investors}</h3>
            <p className="text-[10px] sm:text-sm text-gray-400">مستثمرون</p>
          </div>
        </div>

        {/* Marketing Tip */}
        <div className="bg-white/5 border border-white/10 p-6 rounded-2xl mb-8">
          <div className="flex items-center gap-2 text-gray-400 mb-2">
            <Sparkles size={16} />
            <span className="text-xs font-bold uppercase tracking-wider">نصيحة التسويق اليوم</span>
          </div>
          <p className="text-sm text-white leading-relaxed">
            {currentTip}
          </p>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Main Activity Chart - Hidden on very small screens or replaced by summary */}
          <div className="lg:col-span-2 bg-[#141517] p-6 rounded-2xl border border-white/5">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Activity size={20} className="text-[#FFD700]" />
                نشاط الأفكار
              </h3>
              <div className="hidden sm:flex gap-2">
                <button className="text-xs bg-white/5 px-2 py-1 rounded text-gray-400">أسبوعي</button>
                <button className="text-xs bg-[#FFD700]/10 px-2 py-1 rounded text-[#FFD700]">شهري</button>
              </div>
            </div>
            
            <div className="h-[300px] w-full">
              {loading ? (
                  <div className="w-full h-full flex items-center justify-center text-gray-500">جاري التحميل...</div>
              ) : chartData.length > 0 && chartData.some(d => d.ideas > 0) ? (
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                        <linearGradient id="colorIdeas" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#FFD700" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#FFD700" stopOpacity={0}/>
                        </linearGradient>
                    </defs>
                    <XAxis dataKey="name" stroke="#666" fontSize={10} tickLine={false} axisLine={false} />
                    <YAxis stroke="#666" fontSize={10} tickLine={false} axisLine={false} />
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                    <Tooltip 
                        contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '8px', color: '#fff' }}
                        itemStyle={{ color: '#fff' }}
                    />
                    <Area type="monotone" dataKey="ideas" stroke="#FFD700" strokeWidth={3} fillOpacity={1} fill="url(#colorIdeas)" />
                    </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-gray-500 bg-white/5 rounded-xl border border-dashed border-white/10">
                  <Activity size={40} className="mb-2 opacity-20" />
                  <p className="text-sm">لا توجد بيانات كافية للعرض</p>
                  <p className="text-xs mt-1">ابدأ بنشر أفكارك لتظهر هنا</p>
                </div>
              )}
            </div>
          </div>

          {/* Sector Distribution */}
          <div className="bg-[#141517] p-6 rounded-2xl border border-white/5">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Users size={20} className="text-[#FFD700]" />
              توزيع القطاعات
            </h3>
            <div className="h-[250px] w-full flex items-center justify-center relative">
              {loading ? (
                  <div className="text-gray-500">جاري التحميل...</div>
              ) : pieData.length > 0 ? (
                <>
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                    <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        fill="#8884d8"
                        paddingAngle={5}
                        dataKey="value"
                    >
                        {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip 
                        contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '8px', color: '#fff' }}
                        itemStyle={{ color: '#fff' }}
                    />
                    </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="text-center">
                    <span className="block text-2xl font-bold text-white">{pieData.reduce((a, b) => a + b.value, 0)}</span>
                    <span className="text-[10px] text-gray-500">فكرة</span>
                    </div>
                </div>
                </>
              ) : (
                <div className="text-gray-500 text-sm">لا توجد بيانات</div>
              )}
            </div>
            <div className="mt-6 grid grid-cols-2 gap-3">
              {pieData.map((entry, index) => (
                <div key={index} className="flex items-center gap-2 text-[10px] text-gray-400">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                  <span className="truncate">{entry.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile Summary Cards (Visible only on mobile) */}
        <div className="sm:hidden space-y-4">
          <h3 className="text-lg font-bold text-white px-1">ملخص النشاط</h3>
          <div className="bg-gradient-to-br from-[#FFD700]/20 to-transparent p-5 rounded-2xl border border-[#FFD700]/20">
            <div className="flex items-center gap-3 mb-3">
              <TrendingUp className="text-[#FFD700]" size={20} />
              <span className="font-bold">أداء الأسبوع</span>
            </div>
            <p className="text-sm text-gray-300 leading-relaxed">
              لقد زاد التفاعل مع أفكارك بنسبة <span className="text-[#FFD700] font-bold">12%</span> مقارنة بالأسبوع الماضي. ننصحك بتحديث وصف "مشروع التقنية المالية" لجذب المزيد من المستثمرين.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
