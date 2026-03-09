import React, { useState, useEffect } from 'react';
import { Users, DollarSign, TrendingUp, Activity, BarChart2, PieChart, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { supabase } from '../lib/supabase';

interface ActivityItem {
    id: string;
    user: string;
    action: string;
    target: string;
    time: string;
}

export const AdminDashboard = () => {
  const [stats, setStats] = useState({
    users: 0,
    projects: 0,
    investments: 0,
    growth: 0
  });
  const [recentActivity, setRecentActivity] = useState<ActivityItem[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        // Fetch counts
        const { count: usersCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true });
        const { count: ideasCount } = await supabase.from('ideas').select('*', { count: 'exact', head: true });
        const { count: investmentsCount } = await supabase.from('investments').select('*', { count: 'exact', head: true });
        
        // Calculate total investment amount (if possible, otherwise just count)
        // Since we can't sum easily without RPC or fetching all, we'll just use count for now or fetch all and sum client side (not scalable but ok for demo)
        const { data: investments } = await supabase.from('investments').select('amount');
        const totalInvestment = investments?.reduce((sum, item) => sum + (Number(item.amount) || 0), 0) || 0;

        setStats({
            users: usersCount || 0,
            projects: ideasCount || 0,
            investments: totalInvestment,
            growth: 0 // Need historical data
        });

        // Fetch recent activity (New Ideas)
        const { data: recentIdeas } = await supabase
            .from('ideas')
            .select(`
                id, 
                title, 
                created_at, 
                owner:user_id (full_name)
            `)
            .order('created_at', { ascending: false })
            .limit(5);

        const activities: ActivityItem[] = recentIdeas?.map((idea: any) => ({
            id: idea.id,
            user: idea.owner?.[0]?.full_name || idea.owner?.full_name || 'مستخدم',
            action: 'نشر مشروع جديد',
            target: idea.title,
            time: new Date(idea.created_at).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })
        })) || [];

        setRecentActivity(activities);

        // Chart Data (Users & Projects over time - mocked based on current data distribution if possible, or just show current month)
        // For now, let's just show a simple chart with current data as the latest point
        const months = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
        const currentMonth = new Date().getMonth();
        
        // We can't easily get historical counts without a history table or complex queries.
        // I will just show empty chart or a single point.
        // Or better, fetch all users/ideas created_at and aggregate client side.
        
        const { data: allUsers } = await supabase.from('profiles').select('created_at');
        const { data: allIdeas } = await supabase.from('ideas').select('created_at');

        const monthlyStats = Array(12).fill(0).map((_, i) => ({ name: months[i], users: 0, projects: 0 }));
        const currentYear = new Date().getFullYear();

        allUsers?.forEach(u => {
            const d = new Date(u.created_at);
            if (d.getFullYear() === currentYear) monthlyStats[d.getMonth()].users++;
        });

        allIdeas?.forEach(i => {
            const d = new Date(i.created_at);
            if (d.getFullYear() === currentYear) monthlyStats[d.getMonth()].projects++;
        });

        setChartData(monthlyStats.slice(0, currentMonth + 1));

      } catch (error) {
        console.error('Error fetching admin data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, []);

  return (
    <div className="max-w-7xl mx-auto pb-20 pt-24 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">لوحة التحكم</h1>
        <div className="flex gap-2">
          <button className="bg-[#141517] border border-white/10 px-4 py-2 rounded-xl text-sm hover:bg-white/5 transition-colors">تصدير التقرير</button>
          <button className="bg-[#FFD700] text-black px-4 py-2 rounded-xl text-sm font-bold hover:bg-[#FFC000] transition-colors">إضافة مستخدم</button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          { title: 'إجمالي المستخدمين', value: loading ? '-' : stats.users.toLocaleString(), change: '+0%', icon: Users, color: 'text-blue-400' },
          { title: 'المشاريع النشطة', value: loading ? '-' : stats.projects.toLocaleString(), change: '+0%', icon: Activity, color: 'text-green-400' },
          { title: 'إجمالي الاستثمارات', value: loading ? '-' : `$${stats.investments.toLocaleString()}`, change: '+0%', icon: DollarSign, color: 'text-[#FFD700]' },
          { title: 'معدل النمو', value: '0%', change: '+0%', icon: TrendingUp, color: 'text-purple-400' },
        ].map((stat, i) => (
          <div key={i} className="bg-[#141517] border border-white/10 p-6 rounded-3xl">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-xl bg-white/5 ${stat.color}`}>
                <stat.icon size={24} />
              </div>
              <span className="text-green-400 text-sm font-bold bg-green-400/10 px-2 py-1 rounded-lg">{stat.change}</span>
            </div>
            <h3 className="text-gray-400 text-sm mb-1">{stat.title}</h3>
            <p className="text-2xl font-bold text-white">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Chart */}
        <div className="lg:col-span-2 bg-[#141517] border border-white/10 p-6 rounded-3xl">
          <h3 className="text-xl font-bold mb-6">نمو المنصة (هذا العام)</h3>
          <div className="h-[300px] w-full">
            {loading ? (
                <div className="w-full h-full flex items-center justify-center">
                    <Loader2 className="animate-spin text-[#FFD700]" size={40} />
                </div>
            ) : chartData.length > 0 && (chartData.some(d => d.users > 0 || d.projects > 0)) ? (
                <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                    <XAxis dataKey="name" stroke="#666" />
                    <YAxis stroke="#666" />
                    <Tooltip 
                    contentStyle={{ backgroundColor: '#141517', borderColor: '#333', borderRadius: '12px' }}
                    itemStyle={{ color: '#fff' }}
                    />
                    <Line type="monotone" dataKey="users" stroke="#FFD700" strokeWidth={3} dot={{ r: 4, fill: '#FFD700' }} name="مستخدمين" />
                    <Line type="monotone" dataKey="projects" stroke="#4ADE80" strokeWidth={3} dot={{ r: 4, fill: '#4ADE80' }} name="مشاريع" />
                </LineChart>
                </ResponsiveContainer>
            ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-500">
                    لا توجد بيانات كافية للعرض
                </div>
            )}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-[#141517] border border-white/10 p-6 rounded-3xl">
          <h3 className="text-xl font-bold mb-6">النشاط الحديث</h3>
          <div className="space-y-6">
            {loading ? (
                <div className="space-y-4">
                    {[1, 2, 3].map(i => <div key={i} className="skeleton-text w-full h-12" />)}
                </div>
            ) : recentActivity.length > 0 ? (
                recentActivity.map((activity) => (
                <div key={activity.id} className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-gray-700 shrink-0 flex items-center justify-center text-white font-bold">
                        {activity.user[0]}
                    </div>
                    <div>
                    <p className="text-sm text-white">
                        <span className="font-bold">{activity.user}</span> {activity.action} <span className="text-[#FFD700]">{activity.target}</span>
                    </p>
                    <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                    </div>
                </div>
                ))
            ) : (
                <p className="text-gray-500 text-center">لا يوجد نشاط حديث</p>
            )}
          </div>
          <button className="w-full mt-6 py-3 text-sm text-gray-400 hover:text-white border border-white/10 rounded-xl hover:bg-white/5 transition-colors">
            عرض كل النشاط
          </button>
        </div>
      </div>

      {/* System Status */}
      <div className="grid md:grid-cols-3 gap-6 mt-8">
        <div className="bg-[#141517] border border-white/10 p-6 rounded-3xl flex items-center justify-between">
          <div className="flex items-center gap-4">
            <CheckCircle className="text-green-400" />
            <div>
              <h4 className="font-bold">حالة النظام</h4>
              <p className="text-sm text-gray-400">جميع الخدمات تعمل</p>
            </div>
          </div>
          <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
        </div>
        <div className="bg-[#141517] border border-white/10 p-6 rounded-3xl flex items-center justify-between">
          <div className="flex items-center gap-4">
            <AlertCircle className="text-yellow-400" />
            <div>
              <h4 className="font-bold">تنبيهات الأمان</h4>
              <p className="text-sm text-gray-400">لا توجد تهديدات</p>
            </div>
          </div>
          <span className="text-xs bg-white/5 px-2 py-1 rounded-lg">آمن</span>
        </div>
        <div className="bg-[#141517] border border-white/10 p-6 rounded-3xl flex items-center justify-between">
          <div className="flex items-center gap-4">
            <PieChart className="text-blue-400" />
            <div>
              <h4 className="font-bold">استهلاك الموارد</h4>
              <p className="text-sm text-gray-400">45% من السعة</p>
            </div>
          </div>
          <div className="w-20 h-2 bg-gray-700 rounded-full overflow-hidden">
            <div className="w-[45%] h-full bg-blue-400 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
};
