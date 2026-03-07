import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';
import { Eye, Users, TrendingUp, DollarSign, Activity, Target, ArrowUpRight, ArrowDownRight, Plus } from 'lucide-react';
import { IdeaAnalyzer } from '../components/IdeaAnalyzer';

export const FounderDashboard = () => {
  const [showAnalyzer, setShowAnalyzer] = useState(false);
  const [stats, setStats] = useState({
    views: 12450,
    requests: 85,
    conversion: 0.68,
    investors: 12
  });

  const data = [
    { name: 'يناير', views: 4000, requests: 24 },
    { name: 'فبراير', views: 3000, requests: 13 },
    { name: 'مارس', views: 2000, requests: 98 },
    { name: 'أبريل', views: 2780, requests: 39 },
    { name: 'مايو', views: 1890, requests: 48 },
    { name: 'يونيو', views: 2390, requests: 38 },
    { name: 'يوليو', views: 3490, requests: 43 },
  ];

  const pieData = [
    { name: 'مطورين', value: 400 },
    { name: 'مصممين', value: 300 },
    { name: 'مستثمرين', value: 300 },
    { name: 'مسوقين', value: 200 },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  return (
    <div className="min-h-screen bg-[#0B0C0E] text-white pt-24 pb-20 px-4">
      <div className="max-w-7xl mx-auto">
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
              <span className="flex items-center text-green-500 text-xs font-bold bg-green-500/10 px-2 py-1 rounded-full">+12% <ArrowUpRight size={12} /></span>
            </div>
            <h3 className="text-3xl font-bold text-white mb-1">{stats.views.toLocaleString()}</h3>
            <p className="text-sm text-gray-400">إجمالي المشاهدات</p>
          </div>

          <div className="bg-[#141517] p-6 rounded-2xl border border-white/5 relative overflow-hidden group hover:border-blue-500/30 transition-all">
            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-bl-full -mr-6 -mt-6 transition-transform group-hover:scale-110"></div>
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-blue-500/10 text-blue-500 rounded-xl"><Users size={24} /></div>
              <span className="flex items-center text-green-500 text-xs font-bold bg-green-500/10 px-2 py-1 rounded-full">+5% <ArrowUpRight size={12} /></span>
            </div>
            <h3 className="text-3xl font-bold text-white mb-1">{stats.requests}</h3>
            <p className="text-sm text-gray-400">طلبات الشراكة</p>
          </div>

          <div className="bg-[#141517] p-6 rounded-2xl border border-white/5 relative overflow-hidden group hover:border-purple-500/30 transition-all">
            <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 rounded-bl-full -mr-6 -mt-6 transition-transform group-hover:scale-110"></div>
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-purple-500/10 text-purple-500 rounded-xl"><Target size={24} /></div>
              <span className="flex items-center text-red-500 text-xs font-bold bg-red-500/10 px-2 py-1 rounded-full">-2% <ArrowDownRight size={12} /></span>
            </div>
            <h3 className="text-3xl font-bold text-white mb-1">{stats.conversion}%</h3>
            <p className="text-sm text-gray-400">معدل التحويل</p>
          </div>

          <div className="bg-[#141517] p-6 rounded-2xl border border-white/5 relative overflow-hidden group hover:border-green-500/30 transition-all">
            <div className="absolute top-0 right-0 w-24 h-24 bg-green-500/5 rounded-bl-full -mr-6 -mt-6 transition-transform group-hover:scale-110"></div>
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-green-500/10 text-green-500 rounded-xl"><DollarSign size={24} /></div>
              <span className="flex items-center text-green-500 text-xs font-bold bg-green-500/10 px-2 py-1 rounded-full">+8% <ArrowUpRight size={12} /></span>
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
              نشاط الأفكار (آخر 6 أشهر)
            </h3>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#FFD700" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#FFD700" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorRequests" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8884d8" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" stroke="#666" />
                  <YAxis stroke="#666" />
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '8px', color: '#fff' }}
                    itemStyle={{ color: '#fff' }}
                  />
                  <Area type="monotone" dataKey="views" stroke="#FFD700" fillOpacity={1} fill="url(#colorViews)" />
                  <Area type="monotone" dataKey="requests" stroke="#8884d8" fillOpacity={1} fill="url(#colorRequests)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-[#141517] p-6 rounded-2xl border border-white/5">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Users size={20} className="text-[#FFD700]" />
              توزيع الزوار
            </h3>
            <div className="h-[300px] w-full flex items-center justify-center relative">
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
                  <span className="block text-2xl font-bold text-white">1.2K</span>
                  <span className="text-xs text-gray-500">زائر</span>
                </div>
              </div>
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
