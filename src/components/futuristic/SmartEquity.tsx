import React from 'react';
import { motion } from 'motion/react';
import { Coins, CheckCircle2, Circle, ArrowRight, ShieldCheck, Link2, Clock, GitCommit } from 'lucide-react';

export const SmartEquity = () => {
  const milestones = [
    { id: 1, title: 'تأسيس الشركة (Incorporation)', equity: '10%', status: 'completed', date: '2024-01-15', metric: 'Legal Setup' },
    { id: 2, title: 'إطلاق النسخة التجريبية (MVP)', equity: '15%', status: 'completed', date: '2024-06-20', metric: '500+ Commits' },
    { id: 3, title: 'أول 1000 مستخدم نشط', equity: '20%', status: 'current', date: 'الربع الثالث 2024', metric: 'API Oracle Feed' },
    { id: 4, title: 'تحقيق إيرادات 100 ألف دولار', equity: '25%', status: 'pending', date: 'الربع الأول 2025', metric: 'Stripe Webhook' },
    { id: 5, title: 'جولة استثمارية (Series A)', equity: '30%', status: 'pending', date: 'الربع الرابع 2025', metric: 'Funding Oracle' },
  ];

  return (
    <div className="bg-[#0B0C0E] border border-emerald-500/20 rounded-3xl p-6 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none" />
      
      <div className="flex justify-between items-start mb-8 relative z-10">
        <div>
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Link2 className="text-emerald-400" />
            العقود الذكية الديناميكية (Dynamic Smart Contracts)
          </h3>
          <p className="text-gray-400 text-sm mt-1">تتبع المساهمات اللحظية (SliceFair-style) وتعديل الحصص عبر البلوكشين</p>
        </div>
        <div className="bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-full text-xs font-bold border border-emerald-500/20 flex items-center gap-1">
          <ShieldCheck size={14} />
          Ethereum-Compatible
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 relative z-10">
        <div className="bg-black/40 border border-white/5 p-4 rounded-xl flex items-center gap-3">
          <GitCommit className="text-emerald-500" size={24} />
          <div>
            <p className="text-xs text-gray-400">Code Commits</p>
            <p className="font-mono font-bold text-white">1,240</p>
          </div>
        </div>
        <div className="bg-black/40 border border-white/5 p-4 rounded-xl flex items-center gap-3">
          <Clock className="text-emerald-500" size={24} />
          <div>
            <p className="text-xs text-gray-400">Hours Logged</p>
            <p className="font-mono font-bold text-white">342h</p>
          </div>
        </div>
        <div className="bg-black/40 border border-white/5 p-4 rounded-xl flex items-center gap-3">
          <Coins className="text-emerald-500" size={24} />
          <div>
            <p className="text-xs text-gray-400">Revenue Impact</p>
            <p className="font-mono font-bold text-white">$12.4K</p>
          </div>
        </div>
      </div>

      <div className="relative z-10">
        {/* Progress Line */}
        <div className="absolute right-6 top-4 bottom-4 w-0.5 bg-white/5" />
        <div 
          className="absolute right-6 top-4 w-0.5 bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" 
          style={{ height: '50%' }} 
        />

        <div className="space-y-6">
          {milestones.map((milestone, index) => (
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              key={milestone.id} 
              className={`flex items-start gap-6 relative ${milestone.status === 'pending' ? 'opacity-50' : ''}`}
            >
              <div className="relative z-10 bg-[#0B0C0E] py-1">
                {milestone.status === 'completed' ? (
                  <CheckCircle2 className="text-emerald-500 bg-[#0B0C0E]" size={24} />
                ) : milestone.status === 'current' ? (
                  <div className="w-6 h-6 rounded-full border-2 border-emerald-500 bg-emerald-500/20 flex items-center justify-center">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
                  </div>
                ) : (
                  <Circle className="text-gray-600 bg-[#0B0C0E]" size={24} />
                )}
              </div>

              <div className={`flex-1 bg-[#141517] border ${milestone.status === 'current' ? 'border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.1)]' : 'border-white/5'} rounded-2xl p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4`}>
                <div>
                  <h4 className={`font-bold ${milestone.status === 'current' ? 'text-emerald-400' : 'text-white'}`}>
                    {milestone.title}
                  </h4>
                  <div className="flex items-center gap-2 mt-1">
                    <p className="text-xs text-gray-500">{milestone.date}</p>
                    <span className="text-[10px] bg-white/5 px-2 py-0.5 rounded text-gray-400 font-mono border border-white/10">
                      {milestone.metric}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-xs text-gray-500 mb-1">الحصة المستحقة</p>
                    <p className="font-mono text-white font-bold">{milestone.equity}</p>
                  </div>
                  {milestone.status === 'current' && (
                    <button className="bg-emerald-500/20 text-emerald-400 p-2 rounded-xl hover:bg-emerald-500/30 transition-colors">
                      <ArrowRight size={16} />
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
