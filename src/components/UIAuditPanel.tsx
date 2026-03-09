import React from 'react';
import { auditUI, UIIssue } from '../services/uiAuditor';
import { Loader2, Search, AlertTriangle, X } from 'lucide-react';

interface UIAuditPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UIAuditPanel = ({ isOpen, onClose }: UIAuditPanelProps) => {
  const [issues, setIssues] = React.useState<UIIssue[]>([]);
  const [loading, setLoading] = React.useState(false);

  if (!isOpen) return null;

  const runAudit = async () => {
    setLoading(true);
    const results = await auditUI();
    setIssues(results);
    setLoading(false);
  };

  return (
    <div className="fixed bottom-20 right-4 bg-[#141517] border border-white/10 p-4 rounded-2xl shadow-xl z-50 w-80">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-bold flex items-center gap-2">
          <Search size={16} /> مدقق UI/UX
        </h3>
        <button onClick={onClose} className="text-gray-400 hover:text-white">
          <X size={16} />
        </button>
      </div>
      <button 
        onClick={runAudit}
        className="w-full bg-[#FFD700] text-black font-bold py-2 rounded-xl mb-4 hover:bg-[#FFC000]"
        disabled={loading}
      >
        {loading ? <Loader2 className="animate-spin mx-auto" /> : 'ابدأ التدقيق'}
      </button>
      
      <div className="space-y-2 max-h-60 overflow-y-auto">
        {issues.map((issue, i) => (
          <div key={i} className="p-2 bg-white/5 rounded-lg text-xs">
            <div className="flex items-center gap-1 font-bold text-red-400 mb-1">
                <AlertTriangle size={12} />
                {issue.issue}
            </div>
            <p className="text-gray-300">{issue.suggestion}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
