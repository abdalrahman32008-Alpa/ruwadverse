import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Eye, Users, TrendingUp, DollarSign, Activity, Target, ArrowUpRight, ArrowDownRight, Plus } from 'lucide-react';
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

  useEffect(() => {
    if (!user) return;

    const fetchDashboardData = async () => {
      try {
        // Fetch user's ideas
        const { data: ideas, error: ideasError } = await supabase
          .from('ideas')
          .select('*')
          .eq('owner_id', user.id);

        if (ideasError) throw ideasError;

        // Fetch partnerships (requests)
        // Assuming partnerships table has idea_id which links to ideas owned by user
        // We need to fetch partnerships where idea_id is in user's ideas
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
            views: 0, // No views tracking in schema yet
            requests: partnershipsCount,
            conversion: 0, // Need more data
            investors: investmentsCount
        });

        // Generate Chart Data from ideas created_at
        // Group by month
        const months = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
        const currentYear = new Date().getFullYear();
        const monthlyData = Array(12).fill(0).map((_, i) => ({ name: months[i], ideas: 0, requests: 0 }));

        ideas?.forEach(idea => {
            const date = new Date(idea.created_at);
            if (date.getFullYear() === currentYear) {
                monthlyData[date.getMonth()].ideas += 1;
            }
        });

        // Filter out future months or just show all? Show up to current month
        const currentMonth = new Date().getMonth();
        setChartData(monthlyData.slice(0, currentMonth + 1));

        // Generate Pie Data (Ideas by Sector)
        const sectorCounts: Record<string, number> = {};
        ideas?.forEach(idea => {
            const sector = idea.sector || 'Uncategorized';
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
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">لوحة التحكم</h1>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-[#141517] border border-white/10 rounded-xl text-sm text-gray-300 hover:text-white hover:border-white/20 transition-all">تصدير التقرير</button>
            <button onClick={() => setShowAnalyzer(!showAnalyzer)} className="px-4 py-2 bg-[#FFD700] text-black font-bold rounded-xl hover:bg-[#FFC000] transition-all text-sm flex items-center gap-2">
              <Plus size={16} />
              {showAnalyzer ? 'إخفاء محلل الأفكار' : 'إضافة فكرة جديدة (RAED)'}
            </button>
          </div>
        </div>

        {showAnalyzer && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mb-8">
            <IdeaAnalyzer />
          </motion.div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-[#141517] p-6 rounded-2xl border border-white/5 relative overflow-hidden group hover:border-[#FFD700]/30 transition-all">
            <div className="absolute top-0 right-0 w-24 h-24 bg-[#FFD700]/5 rounded-bl-full -mr-6 -mt-6 transition-transform group-hover:scale-110"></div>
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-[#FFD700]/10 text-[#FFD700] rounded-xl"><Eye size={24} /></div>
              {/* Placeholder trend */}
              <span className="flex items-center text-gray-500 text-xs font-bold bg-white/5 px-2 py-1 rounded-full">--</span>
            </div>
            <h3 className="text-3xl font-bold text-white mb-1">{stats.views.toLocaleString()}</h3>
            <p className="text-sm text-gray-400">إجمالي المشاهدات</p>
          </div>

          <div className="bg-[#141517] p-6 rounded-2xl border border-white/5 relative overflow-hidden group hover:border-blue-500/30 transition-all">
            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-bl-full -mr-6 -mt-6 transition-transform group-hover:scale-110"></div>
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-blue-500/10 text-blue-500 rounded-xl"><Users size={24} /></div>
              <span className="flex items-center text-green-500 text-xs font-bold bg-green-500/10 px-2 py-1 rounded-full">نشط</span>
            </div>
            <h3 className="text-3xl font-bold text-white mb-1">{stats.requests}</h3>
            <p className="text-sm text-gray-400">طلبات الشراكة</p>
          </div>

          <div className="bg-[#141517] p-6 rounded-2xl border border-white/5 relative overflow-hidden group hover:border-purple-500/30 transition-all">
            <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 rounded-bl-full -mr-6 -mt-6 transition-transform group-hover:scale-110"></div>
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-purple-500/10 text-purple-500 rounded-xl"><Target size={24} /></div>
            </div>
            <h3 className="text-3xl font-bold text-white mb-1">{stats.conversion}%</h3>
            <p className="text-sm text-gray-400">معدل التحويل</p>
          </div>

          <div className="bg-[#141517] p-6 rounded-2xl border border-white/5 relative overflow-hidden group hover:border-green-500/30 transition-all">
            <div className="absolute top-0 right-0 w-24 h-24 bg-green-500/5 rounded-bl-full -mr-6 -mt-6 transition-transform group-hover:scale-110"></div>
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-green-500/10 text-green-500 rounded-xl"><DollarSign size={24} /></div>
            </div>
            <h3 className="text-3xl font-bold text-white mb-1">{stats.investors}</h3>
            <p className="text-sm text-gray-400">مستثمرون مهتمون</p>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2 bg-[#141517] p-6 rounded-2xl border border-white/5">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Activity size={20} className="text-[#FFD700]" />
              نشاط الأفكار (هذا العام)
            </h3>
            <div className="h-[300px] w-full">
              {loading ? (
                  <div className="w-full h-full flex items-center justify-center text-gray-500">جاري التحميل...</div>
              ) : chartData.length > 0 && chartData.some(d => d.ideas > 0) ? (
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <defs>
                        <linearGradient id="colorIdeas" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#FFD700" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#FFD700" stopOpacity={0}/>
                        </linearGradient>
                    </defs>
                    <XAxis dataKey="name" stroke="#666" />
                    <YAxis stroke="#666" />
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                    <Tooltip 
                        contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '8px', color: '#fff' }}
                        itemStyle={{ color: '#fff' }}
                    />
                    <Area type="monotone" dataKey="ideas" stroke="#FFD700" fillOpacity={1} fill="url(#colorIdeas)" />
                    </AreaChart>
                </ResponsiveContainer>
              ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-500">لا توجد بيانات كافية للعرض</div>
              )}
            </div>
          </div>

          <div className="bg-[#141517] p-6 rounded-2xl border border-white/5">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Users size={20} className="text-[#FFD700]" />
              توزيع القطاعات
            </h3>
            <div className="h-[300px] w-full flex items-center justify-center relative">
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
                    <span className="text-xs text-gray-500">فكرة</span>
                    </div>
                </div>
                </>
              ) : (
                  <div className="text-gray-500">لا توجد بيانات</div>
              )}
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2">
              {pieData.map((entry, index) => (
                <div key={index} className="flex items-center gap-2 text-xs text-gray-400">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                  <span>{entry.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
