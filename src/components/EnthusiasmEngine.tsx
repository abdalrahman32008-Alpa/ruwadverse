import React from 'react';
import { motion } from 'motion/react';
import { 
  TrendingUp, Award, Shield, Zap, 
  BarChart3, PieChart as PieIcon, 
  CheckCircle2, Flame, Target, 
  ArrowUpRight, Users, Briefcase
} from 'lucide-react';
import { 
  ResponsiveContainer, AreaChart, Area, 
  XAxis, YAxis, Tooltip, PieChart, 
  Pie, Cell 
} from 'recharts';
import { useLanguage } from '../contexts/LanguageContext';

// --- Types ---
interface Milestone {
  id: string;
  title: string;
  status: 'completed' | 'in-progress' | 'pending';
  reward: string;
  date: string;
}

interface ContributionData {
  month: string;
  value: number;
}

// --- Components ---

export const ContributionTracker = () => {
  const { t } = useLanguage();
  
  const data: ContributionData[] = [
    { month: 'Jan', value: 30 },
    { month: 'Feb', value: 45 },
    { month: 'Mar', value: 60 },
    { month: 'Apr', value: 85 },
    { month: 'May', value: 70 },
    { month: 'Jun', value: 95 },
  ];

  return (
    <div className="linear-card p-6 rounded-2xl border border-white/5 bg-[#141517]/50 backdrop-blur-sm relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
        <Zap size={80} className="text-[#FFD700]" />
      </div>
      
      <div className="flex justify-between items-start mb-6 relative z-10">
        <div>
          <h3 className="text-lg font-bold flex items-center gap-2">
            <Flame className="text-orange-500" size={20} />
            {t('contributionTracker')}
          </h3>
          <p className="text-xs text-gray-400 mt-1">{t('skillValue')}: <span className="text-[#FFD700] font-bold">Expert</span></p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-[#FFD700]">2,450</div>
          <div className="text-[10px] text-gray-500 uppercase tracking-wider">{t('contributionPoints')}</div>
        </div>
      </div>

      <div className="h-40 w-full mb-6 relative z-10">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#FFD700" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#FFD700" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <Tooltip 
              contentStyle={{ backgroundColor: '#141517', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
              itemStyle={{ color: '#FFD700' }}
            />
            <Area 
              type="monotone" 
              dataKey="value" 
              stroke="#FFD700" 
              fillOpacity={1} 
              fill="url(#colorValue)" 
              strokeWidth={3}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="flex justify-between items-center relative z-10">
        <div className="flex -space-x-2">
          {[1,2,3].map(i => (
            <div key={i} className="w-8 h-8 rounded-full border-2 border-[#141517] bg-gray-800 flex items-center justify-center text-[10px] font-bold">
              {i === 1 ? '🏆' : i === 2 ? '⭐' : '🔥'}
            </div>
          ))}
        </div>
        <button className="text-xs font-bold text-[#FFD700] flex items-center gap-1 hover:underline">
          {t('nextReward')}: Pro Badge <ArrowUpRight size={14} />
        </button>
      </div>
    </div>
  );
};

export const EquityVisualizer = () => {
  const { t } = useLanguage();
  
  const data = [
    { name: 'Your Equity', value: 15, color: '#FFD700' },
    { name: 'Founders', value: 60, color: '#3b82f6' },
    { name: 'Investors', value: 25, color: '#22c55e' },
  ];

  return (
    <div className="linear-card p-6 rounded-2xl border border-white/5 bg-[#141517]/50 backdrop-blur-sm relative overflow-hidden">
      <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
        <PieIcon className="text-blue-400" size={20} />
        {t('equityVisualizer')}
      </h3>

      <div className="grid md:grid-cols-2 gap-6 items-center">
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ backgroundColor: '#141517', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        <div className="space-y-4">
          <div className="bg-white/5 p-3 rounded-xl border border-white/5">
            <div className="text-[10px] text-gray-500 uppercase mb-1">{t('potentialValue')}</div>
            <div className="text-xl font-bold text-green-400">$450,000</div>
            <div className="text-[10px] text-gray-400 mt-1">Based on $3M Valuation</div>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <TrendingUp size={14} className="text-green-400" />
            <span>{t('equityGrowth')}: +12% MoM</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export const DueDiligenceDashboard = () => {
  const { t } = useLanguage();
  const [score, setScore] = React.useState(Number(localStorage.getItem('enthusiasm_score') || '94'));

  React.useEffect(() => {
    const handleUpdate = () => {
      setScore(Number(localStorage.getItem('enthusiasm_score') || '94'));
    };
    window.addEventListener('enthusiasm_updated', handleUpdate);
    return () => window.removeEventListener('enthusiasm_updated', handleUpdate);
  }, []);
  
  const metrics = [
    { label: 'Transparency', value: score, color: 'bg-green-500' },
    { label: 'Milestone Completion', value: Math.min(score - 6, 100), color: 'bg-blue-500' },
    { label: 'Team Stability', value: Math.min(score - 2, 100), color: 'bg-purple-500' },
    { label: 'Market Traction', value: 75, color: 'bg-[#FFD700]' },
  ];

  return (
    <div className="linear-card p-6 rounded-2xl border border-white/5 bg-[#141517]/50 backdrop-blur-sm">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold flex items-center gap-2">
          <Shield className="text-green-400" size={20} />
          {t('dueDiligence')}
        </h3>
        <span className="px-3 py-1 bg-green-500/10 text-green-400 rounded-full text-[10px] font-bold border border-green-500/20">
          VERIFIED BY RAED
        </span>
      </div>

      <div className="space-y-6">
        {metrics.map((m, i) => (
          <div key={i}>
            <div className="flex justify-between text-xs mb-2">
              <span className="text-gray-400">{m.label}</span>
              <span className="font-bold text-white">{m.value}%</span>
            </div>
            <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                whileInView={{ width: `${m.value}%` }}
                transition={{ duration: 1, delay: i * 0.1 }}
                className={`h-full ${m.color}`}
              />
            </div>
          </div>
        ))}
      </div>

      <button className="w-full mt-6 py-3 bg-white/5 border border-white/10 rounded-xl text-xs font-bold hover:bg-white/10 transition-colors flex items-center justify-center gap-2">
        <BarChart3 size={14} />
        {t('transparencyReport')}
      </button>
    </div>
  );
};

export const MilestoneRewards = () => {
  const { t } = useLanguage();
  
  const milestones: Milestone[] = [
    { id: '1', title: 'MVP Launch', status: 'completed', reward: '500 XP + Founder Badge', date: '2024-01-15' },
    { id: '2', title: 'First 100 Users', status: 'in-progress', reward: '1000 XP + Marketing Boost', date: 'In Progress' },
    { id: '3', title: 'Seed Funding', status: 'pending', reward: '2500 XP + Investor Network', date: 'Planned' },
  ];

  return (
    <div className="linear-card p-6 rounded-2xl border border-white/5 bg-[#141517]/50 backdrop-blur-sm">
      <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
        <Target className="text-[#FFD700]" size={20} />
        {t('milestoneRewards')}
      </h3>

      <div className="space-y-4">
        {milestones.map((m, i) => (
          <div key={m.id} className="flex items-start gap-4 p-4 rounded-xl bg-white/5 border border-white/5 relative overflow-hidden group">
            <div className={`mt-1 shrink-0 ${m.status === 'completed' ? 'text-green-400' : m.status === 'in-progress' ? 'text-[#FFD700]' : 'text-gray-600'}`}>
              {m.status === 'completed' ? <CheckCircle2 size={20} /> : <div className="w-5 h-5 rounded-full border-2 border-current" />}
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <h4 className={`font-bold text-sm ${m.status === 'pending' ? 'text-gray-500' : 'text-white'}`}>{m.title}</h4>
                <span className="text-[10px] text-gray-500">{m.date}</span>
              </div>
              <p className="text-xs text-gray-400 mt-1">{m.reward}</p>
            </div>
            {m.status === 'in-progress' && (
              <div className="absolute bottom-0 left-0 h-1 bg-[#FFD700] w-1/2" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export const EnthusiasmEngine = ({ role }: { role: 'idea' | 'skill' | 'investor' }) => {
  return (
    <div className="grid gap-6">
      {role === 'skill' && (
        <>
          <ContributionTracker />
          <EquityVisualizer />
        </>
      )}
      {role === 'investor' && (
        <>
          <DueDiligenceDashboard />
          <div className="grid md:grid-cols-2 gap-6">
            <div className="linear-card p-6 rounded-2xl border border-white/5 flex flex-col items-center justify-center text-center gap-2">
              <Users className="text-blue-400" size={32} />
              <div className="text-xl font-bold">12 Active Startups</div>
              <div className="text-xs text-gray-500">In your portfolio</div>
            </div>
            <div className="linear-card p-6 rounded-2xl border border-white/5 flex flex-col items-center justify-center text-center gap-2">
              <Briefcase className="text-[#FFD700]" size={32} />
              <div className="text-xl font-bold">$2.4M Invested</div>
              <div className="text-xs text-gray-500">Total deployment</div>
            </div>
          </div>
        </>
      )}
      {role === 'idea' && (
        <>
          <MilestoneRewards />
          <div className="linear-card p-6 rounded-2xl border border-white/5 bg-gradient-to-r from-[#FFD700]/10 to-transparent">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-[#FFD700] text-black flex items-center justify-center font-bold text-xl">
                {localStorage.getItem('enthusiasm_score') || '98'}
              </div>
              <div>
                <h4 className="font-bold">Transparency Score</h4>
                <p className="text-xs text-gray-400">Top 2% of founders this month</p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
