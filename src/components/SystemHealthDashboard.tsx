import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Activity, Bug, Lightbulb, Code, AlertCircle, CheckCircle, ChevronDown, ChevronUp, BrainCircuit } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface EvolutionReport {
  id: string;
  insight_type: 'ux_improvement' | 'bug_report' | 'feature_suggestion';
  content: string;
  suggested_code: string;
  status: 'pending' | 'implemented' | 'impossible';
  difficulty_level: 'easy' | 'medium' | 'hard';
  created_at: string;
}

export const SystemHealthDashboard = () => {
  const [reports, setReports] = useState<EvolutionReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    const fetchReports = async () => {
      const { data } = await supabase
        .from('system_evolution_reports')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (data) setReports(data);
      setLoading(false);
    };

    fetchReports();
  }, []);

  const getIcon = (type: string) => {
    switch (type) {
      case 'ux_improvement': return <Activity className="text-blue-400" size={20} />;
      case 'bug_report': return <Bug className="text-red-400" size={20} />;
      case 'feature_suggestion': return <Lightbulb className="text-yellow-400" size={20} />;
      default: return <AlertCircle className="text-gray-400" size={20} />;
    }
  };

  const getDifficultyColor = (level: string) => {
    switch (level) {
      case 'easy': return 'bg-green-500/10 text-green-400 border-green-500/20';
      case 'medium': return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
      case 'hard': return 'bg-red-500/10 text-red-400 border-red-500/20';
      default: return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-[#141517] rounded-3xl border border-white/10 shadow-2xl">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center text-purple-400">
            <BrainCircuit size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">لوحة تطور النظام (The Cortex)</h2>
            <p className="text-sm text-gray-400">رؤى الذكاء الاصطناعي حول كيفية تحسين وتطوير المنصة</p>
          </div>
        </div>
        <div className="bg-white/5 px-4 py-2 rounded-xl border border-white/10 flex items-center gap-2">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
          <span className="text-xs text-gray-400">المحرك يعمل في الخلفية</span>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <div className="w-10 h-10 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-500">جاري تحليل البيانات وتوليد الرؤى...</p>
        </div>
      ) : reports.length === 0 ? (
        <div className="text-center py-20 bg-black/20 rounded-2xl border border-white/5">
          <AlertCircle size={40} className="mx-auto text-gray-600 mb-4" />
          <p className="text-gray-500">لا توجد تقارير تطور بعد. استمر في استخدام المنصة ليتعلم النظام.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reports.map((report) => (
            <motion.div 
              key={report.id}
              layout
              className={`bg-white/5 border rounded-2xl overflow-hidden transition-all ${
                expandedId === report.id ? 'border-purple-500/50' : 'border-white/5 hover:border-white/10'
              }`}
            >
              <div 
                onClick={() => setExpandedId(expandedId === report.id ? null : report.id)}
                className="p-4 flex items-center justify-between cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-black/20 rounded-lg">
                    {getIcon(report.insight_type)}
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-sm">
                      {report.insight_type === 'ux_improvement' ? 'تحسين تجربة المستخدم' : 
                       report.insight_type === 'bug_report' ? 'تقرير عن مشكلة تقنية' : 'اقتراح ميزة جديدة'}
                    </h3>
                    <p className="text-xs text-gray-500">
                      {new Date(report.created_at).toLocaleDateString('ar-EG', { day: 'numeric', month: 'short' })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-2 py-1 rounded-md text-[10px] font-bold border ${getDifficultyColor(report.difficulty_level)}`}>
                    {report.difficulty_level.toUpperCase()}
                  </span>
                  {expandedId === report.id ? <ChevronUp size={18} className="text-gray-500" /> : <ChevronDown size={18} className="text-gray-500" />}
                </div>
              </div>

              <AnimatePresence>
                {expandedId === report.id && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="px-4 pb-4 border-t border-white/5 pt-4"
                  >
                    <p className="text-sm text-gray-300 mb-4 leading-relaxed">{report.content}</p>
                    
                    {report.suggested_code && (
                      <div className="bg-black/40 rounded-xl p-4 border border-white/5 mb-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[10px] text-gray-500 font-mono flex items-center gap-1">
                            <Code size={12} /> كود مقترح
                          </span>
                          <button className="text-[10px] text-purple-400 hover:underline">نسخ الكود</button>
                        </div>
                        <pre className="text-xs text-purple-300 font-mono overflow-x-auto">
                          {report.suggested_code}
                        </pre>
                      </div>
                    )}

                    <div className="flex justify-end gap-2">
                      <button className="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-white rounded-lg text-xs transition-colors">
                        تجاهل
                      </button>
                      <button className="px-3 py-1.5 bg-purple-600 text-white rounded-lg text-xs font-bold hover:bg-purple-700 transition-colors flex items-center gap-1">
                        <CheckCircle size={14} /> تنفيذ التغيير
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};
