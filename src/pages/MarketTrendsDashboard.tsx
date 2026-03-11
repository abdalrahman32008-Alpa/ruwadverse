import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { motion } from 'motion/react';
import { supabase } from '../lib/supabase';
import { Loader2, Lock } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';

export const MarketTrendsDashboard = () => {
  const { subscriptionTier } = useAuth();
  const [data, setData] = useState<any[]>([]);
  const [sectorData, setSectorData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrends = async () => {
      try {
        const { data: ideas, error } = await supabase
          .from('ideas')
          .select('created_at, sector');

        if (error) throw error;

        // Group by month
        const months = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
        const currentYear = new Date().getFullYear();
        const monthlyData = Array(12).fill(0).map((_, i) => ({ name: months[i], value: 0 }));
        const sectorCounts: Record<string, number> = {};

        ideas?.forEach(idea => {
            const date = new Date(idea.created_at);
            if (date.getFullYear() === currentYear) {
                monthlyData[date.getMonth()].value += 1;
            }
            if (idea.sector) {
                sectorCounts[idea.sector] = (sectorCounts[idea.sector] || 0) + 1;
            }
        });

        // Filter up to current month
        const currentMonth = new Date().getMonth();
        setData(monthlyData.slice(0, currentMonth + 1));
        setSectorData(Object.keys(sectorCounts).map(k => ({ name: k, value: sectorCounts[k] })));

      } catch (error) {
        console.error('Error fetching market trends:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrends();
  }, []);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#FFD700', '#A855F7'];

  return (
    <div className="min-h-screen pt-24 px-4 max-w-7xl mx-auto relative overflow-hidden pb-20">
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

      <div className="relative z-10">
        <h1 className="text-3xl font-bold text-white mb-8">لوحة تحليلات السوق</h1>
        
        <div className="grid lg:grid-cols-2 gap-8">
            <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="linear-card p-6 rounded-3xl bg-[#141517]/80 backdrop-blur-md border border-white/10 shadow-2xl"
            >
            <h3 className="text-lg font-bold text-white mb-4">نمو الأفكار الجديدة (هذا العام)</h3>
            <div className="h-80">
                {loading ? (
                    <div className="w-full h-full flex items-center justify-center">
                        <Loader2 className="animate-spin text-[#FFD700]" size={40} />
                    </div>
                ) : data.length > 0 && data.some(d => d.value > 0) ? (
                    <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis dataKey="name" stroke="#9CA3AF" />
                        <YAxis stroke="#9CA3AF" />
                        <Tooltip contentStyle={{ backgroundColor: '#141517', border: 'none', borderRadius: '8px' }} />
                        <Line type="monotone" dataKey="value" stroke="#FFD700" strokeWidth={3} dot={{ fill: '#FFD700', strokeWidth: 2 }} activeDot={{ r: 8 }} />
                    </LineChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-500">
                        لا توجد بيانات كافية للعرض
                    </div>
                )}
            </div>
            </motion.div>

            {/* Sector Analysis - Pro Feature */}
            <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative linear-card p-6 rounded-3xl bg-[#141517]/80 backdrop-blur-md border border-white/10 shadow-2xl overflow-hidden"
            >
                {subscriptionTier === 'free' && (
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-md flex flex-col items-center justify-center z-20">
                        <div className="bg-[#FFD700]/10 p-4 rounded-full mb-4 border border-[#FFD700]/20">
                            <Lock className="text-[#FFD700]" size={32} />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">تحليل القطاعات المتقدم</h3>
                        <p className="text-gray-400 text-sm mb-6 max-w-xs text-center">احصل على رؤى تفصيلية حول القطاعات الأكثر نمواً والفرص الاستثمارية.</p>
                        <Link 
                            to="/pricing" 
                            className="bg-[#FFD700] text-black font-bold py-2 px-6 rounded-xl hover:bg-[#FFC000] transition-colors shadow-lg shadow-[#FFD700]/20"
                        >
                            ترقية للعضوية المميزة
                        </Link>
                    </div>
                )}
                
                <h3 className="text-lg font-bold text-white mb-4">توزيع القطاعات (Pro)</h3>
                <div className={`h-80 ${subscriptionTier === 'free' ? 'blur-md opacity-50' : ''}`}>
                    {loading ? (
                        <div className="w-full h-full flex items-center justify-center">
                            <Loader2 className="animate-spin text-[#FFD700]" size={40} />
                        </div>
                    ) : sectorData.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={sectorData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                            >
                                {sectorData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip contentStyle={{ backgroundColor: '#141517', border: 'none', borderRadius: '8px' }} />
                        </PieChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-500">
                            لا توجد بيانات كافية للعرض
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
      </div>
    </div>
  );
};
