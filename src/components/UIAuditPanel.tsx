import React from 'react';
import { auditUI, auditFullPlatform, UIIssue } from '../services/uiAuditor';
import { Loader2, Search, AlertTriangle, X, Globe, Smartphone, Monitor } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface UIAuditPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UIAuditPanel = ({ isOpen, onClose }: UIAuditPanelProps) => {
  const [issues, setIssues] = React.useState<UIIssue[]>([]);
  const [fullResults, setFullResults] = React.useState<Record<string, UIIssue[]>>({});
  const [loading, setLoading] = React.useState(false);
  const [mode, setMode] = React.useState<'single' | 'full'>('single');

  if (!isOpen) return null;

  const runAudit = async () => {
    setLoading(true);
    setMode('single');
    const results = await auditUI();
    setIssues(results);
    setFullResults({});
    setLoading(false);
  };

  const runFullAudit = async () => {
    setLoading(true);
    setMode('full');
    const results = await auditFullPlatform();
    setFullResults(results);
    setIssues([]);
    setLoading(false);
  };

  const isMobile = window.innerWidth < 768;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
      className="fixed bottom-20 left-4 bg-[#141517]/95 backdrop-blur-xl border border-white/10 p-5 rounded-3xl shadow-2xl z-[70] w-96 max-h-[80vh] flex flex-col"
    >
      <div className="flex justify-between items-center mb-4">
        <div className="flex flex-col">
          <h3 className="font-bold flex items-center gap-2 text-white">
            <Search size={18} className="text-[#FFD700]" /> مدقق UI/UX الذكي
          </h3>
          <div className="flex items-center gap-2 mt-1">
            {isMobile ? (
              <span className="flex items-center gap-1 text-[10px] text-gray-400 bg-white/5 px-2 py-0.5 rounded-full">
                <Smartphone size={10} /> نسخة الهاتف
              </span>
            ) : (
              <span className="flex items-center gap-1 text-[10px] text-gray-400 bg-white/5 px-2 py-0.5 rounded-full">
                <Monitor size={10} /> نسخة الديسكتوب
              </span>
            )}
          </div>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full text-gray-400 hover:text-white transition-colors">
          <X size={20} />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <button 
          onClick={runAudit}
          className="flex flex-col items-center justify-center gap-1 bg-white/5 border border-white/10 text-white py-3 rounded-2xl hover:bg-white/10 transition-all disabled:opacity-50"
          disabled={loading}
        >
          {loading && mode === 'single' ? <Loader2 className="animate-spin" size={18} /> : <Search size={18} />}
          <span className="text-[10px] font-bold">تدقيق الصفحة</span>
        </button>
        <button 
          onClick={runFullAudit}
          className="flex flex-col items-center justify-center gap-1 bg-[#FFD700] text-black py-3 rounded-2xl hover:bg-[#FFC000] transition-all disabled:opacity-50"
          disabled={loading}
        >
          {loading && mode === 'full' ? <Loader2 className="animate-spin" size={18} /> : <Globe size={18} />}
          <span className="text-[10px] font-bold">تدقيق المنصة كاملة</span>
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
        {loading && (
          <div className="flex flex-col items-center justify-center py-10 text-gray-400 gap-3">
            <Loader2 className="animate-spin text-[#FFD700]" size={32} />
            <p className="text-xs animate-pulse">جاري تحليل الواجهة بالذكاء الاصطناعي...</p>
          </div>
        )}

        {!loading && mode === 'single' && issues.length > 0 && (
          <div className="space-y-2">
            <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-2">نتائج الصفحة الحالية</p>
            {issues.map((issue, i) => (
              <IssueCard key={i} issue={issue} />
            ))}
          </div>
        )}

        {!loading && mode === 'full' && Object.keys(fullResults).length > 0 && (
          <div className="space-y-6">
            {Object.entries(fullResults).map(([page, pageIssues], i) => (
              <div key={i} className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="h-px flex-1 bg-white/10"></div>
                  <span className="text-[10px] font-bold text-[#FFD700] bg-[#FFD700]/10 px-2 py-0.5 rounded-full">{page}</span>
                  <div className="h-px flex-1 bg-white/10"></div>
                </div>
                {pageIssues.map((issue, j) => (
                  <IssueCard key={j} issue={issue} />
                ))}
              </div>
            ))}
          </div>
        )}

        {!loading && issues.length === 0 && Object.keys(fullResults).length === 0 && (
          <div className="text-center py-10 text-gray-500">
            <AlertTriangle size={32} className="mx-auto mb-2 opacity-20" />
            <p className="text-xs">اضغط على الأزرار أعلاه لبدء عملية التدقيق</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

const IssueCard = ({ issue }: { issue: UIIssue }) => (
  <motion.div 
    initial={{ opacity: 0, x: -10 }}
    animate={{ opacity: 1, x: 0 }}
    className="p-3 bg-white/5 border border-white/5 rounded-2xl text-xs hover:border-white/20 transition-colors group"
  >
    <div className="flex items-start justify-between gap-2 mb-2">
      <div className="flex items-center gap-1.5 font-bold text-white">
        <div className={`w-1.5 h-1.5 rounded-full ${
          issue.severity === 'high' ? 'bg-red-500' : 
          issue.severity === 'medium' ? 'bg-yellow-500' : 'bg-blue-500'
        }`} />
        {issue.issue}
      </div>
      <span className="text-[8px] bg-white/10 px-1.5 py-0.5 rounded text-gray-400 uppercase">
        {issue.viewport}
      </span>
    </div>
    <p className="text-gray-400 leading-relaxed mb-2">{issue.suggestion}</p>
    <div className="flex justify-end">
      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
        issue.severity === 'high' ? 'bg-red-500/10 text-red-400' : 
        issue.severity === 'medium' ? 'bg-yellow-500/10 text-yellow-400' : 'bg-blue-500/10 text-blue-400'
      }`}>
        {issue.severity === 'high' ? 'أولوية قصوى' : issue.severity === 'medium' ? 'متوسط' : 'تحسين بسيط'}
      </span>
    </div>
  </motion.div>
);
