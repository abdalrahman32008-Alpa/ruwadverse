import React from 'react';
import { Users, DollarSign, TrendingUp, Activity, BarChart2, PieChart, AlertCircle, CheckCircle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

const USER_STATS = [
  { name: 'يناير', users: 400, projects: 240 },
  { name: 'فبراير', users: 300, projects: 139 },
  { name: 'مارس', users: 200, projects: 980 },
  { name: 'أبريل', users: 278, projects: 390 },
  { name: 'مايو', users: 189, projects: 480 },
  { name: 'يونيو', users: 239, projects: 380 },
];

const RECENT_ACTIVITY = [
  { id: 1, user: 'أحمد محمد', action: 'أنشأ مشروع جديد', target: 'منصة تعليمية', time: 'منذ 5 دقائق' },
  { id: 2, user: 'سارة علي', action: 'استثمرت في', target: 'تطبيق توصيل', time: 'منذ 15 دقيقة' },
  { id: 3, user: 'خالد عمر', action: 'انضم كشريك مؤسس', target: 'مشروع الطاقة', time: 'منذ ساعة' },
  { id: 4, user: 'نورة سعد', action: 'نشرت تحديث', target: 'إنجاز جديد', time: 'منذ ساعتين' },
];

export const AdminDashboard = () => {
  return (
    <div className="max-w-7xl mx-auto pb-20">
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
          { title: 'إجمالي المستخدمين', value: '12,345', change: '+12%', icon: Users, color: 'text-blue-400' },
          { title: 'المشاريع النشطة', value: '482', change: '+5%', icon: Activity, color: 'text-green-400' },
          { title: 'إجمالي الاستثمارات', value: '$2.4M', change: '+18%', icon: DollarSign, color: 'text-[#FFD700]' },
          { title: 'معدل النمو', value: '24%', change: '+2%', icon: TrendingUp, color: 'text-purple-400' },
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
          <h3 className="text-xl font-bold mb-6">نمو المنصة</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={USER_STATS}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                <XAxis dataKey="name" stroke="#666" />
                <YAxis stroke="#666" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#141517', borderColor: '#333', borderRadius: '12px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Line type="monotone" dataKey="users" stroke="#FFD700" strokeWidth={3} dot={{ r: 4, fill: '#FFD700' }} />
                <Line type="monotone" dataKey="projects" stroke="#4ADE80" strokeWidth={3} dot={{ r: 4, fill: '#4ADE80' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-[#141517] border border-white/10 p-6 rounded-3xl">
          <h3 className="text-xl font-bold mb-6">النشاط الحديث</h3>
          <div className="space-y-6">
            {RECENT_ACTIVITY.map((activity) => (
              <div key={activity.id} className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-gray-700 shrink-0" />
                <div>
                  <p className="text-sm text-white">
                    <span className="font-bold">{activity.user}</span> {activity.action} <span className="text-[#FFD700]">{activity.target}</span>
                  </p>
                  <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
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
