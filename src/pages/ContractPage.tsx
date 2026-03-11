import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FileText, Download, CheckCircle, PenTool, Calendar, Shield, Users, Loader2, ChevronLeft, ArrowRight } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface Contract {
  id: string;
  parties: { name: string; role: string; percentage: string }[];
  terms: string;
  signed: boolean;
  created_at: string;
  status: string;
}

export const ContractPage = () => {
  const { user } = useAuth();
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null);
  const [loading, setLoading] = useState(true);
  const [signing, setSigning] = useState(false);
  const contractRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!user) return;
    fetchContracts();
  }, [user]);

  const fetchContracts = async () => {
    try {
      const { data, error } = await supabase
        .from('contracts')
        .select('*')
        .or(`founder_id.eq.${user.id},investor_id.eq.${user.id}`)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      const formatted = (data || []).map(d => ({
        ...d,
        parties: Array.isArray(d.parties) ? d.parties : [],
        terms: d.terms || ''
      }));

      setContracts(formatted);
      if (formatted.length === 1) {
        setSelectedContract(formatted[0]);
      }
    } catch (error) {
      console.error('Error fetching contracts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSign = async () => {
    if (!selectedContract) return;
    setSigning(true);
    try {
        const { error } = await supabase
            .from('contracts')
            .update({ signed: true, status: 'signed' })
            .eq('id', selectedContract.id);

        if (error) throw error;
        
        setSelectedContract(prev => prev ? { ...prev, signed: true, status: 'signed' } : null);
        setContracts(prev => prev.map(c => c.id === selectedContract.id ? { ...c, signed: true, status: 'signed' } : c));
    } catch (error) {
        console.error('Error signing contract:', error);
    } finally {
        setSigning(false);
    }
  };

  const handleDownloadPDF = async () => {
    if (!contractRef.current || !selectedContract) return;

    try {
      const canvas = await html2canvas(contractRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#141517'
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: [canvas.width, canvas.height]
      });

      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      pdf.save(`contract-${selectedContract.id.slice(0, 8)}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  if (loading) {
      return (
          <div className="min-h-screen bg-[#0B0C0E] pt-24 flex justify-center">
              <Loader2 className="animate-spin text-[#FFD700]" size={40} />
          </div>
      );
  }

  if (contracts.length === 0) {
      return (
        <div className="min-h-screen bg-[#0B0C0E] text-white pt-24 pb-20 px-4 flex flex-col items-center justify-center">
            <FileText size={64} className="text-gray-600 mb-4" />
            <h2 className="text-2xl font-bold mb-2">لا توجد عقود نشطة</h2>
            <p className="text-gray-400">ليس لديك أي عقود معلقة أو نشطة حالياً.</p>
        </div>
      );
  }

  if (!selectedContract) {
    return (
      <div className="min-h-screen bg-[#0B0C0E] text-white pt-24 pb-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-right">العقود الرقمية</h1>
          <div className="grid gap-4">
            {contracts.map(contract => (
              <button 
                key={contract.id}
                onClick={() => setSelectedContract(contract)}
                className="bg-[#141517] border border-white/5 p-6 rounded-2xl hover:border-[#FFD700]/30 transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-xl ${contract.signed ? 'bg-green-500/10 text-green-500' : 'bg-[#FFD700]/10 text-[#FFD700]'}`}>
                    <FileText size={24} />
                  </div>
                  <div className="text-right">
                    <h3 className="font-bold text-lg">عقد شراكة رقمي</h3>
                    <p className="text-sm text-gray-500">رقم العقد: {contract.id.slice(0, 8).toUpperCase()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`text-xs px-3 py-1 rounded-full font-bold ${contract.signed ? 'bg-green-500/10 text-green-500' : 'bg-yellow-500/10 text-yellow-500'}`}>
                    {contract.signed ? 'موقع' : 'بانتظار التوقيع'}
                  </span>
                  <ChevronLeft className="text-gray-600 group-hover:text-white transition-colors" />
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const termsList = selectedContract.terms.split('\n').filter(t => t.trim() !== '');

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

      <div className="max-w-4xl mx-auto relative z-10">
        <button 
          onClick={() => setSelectedContract(null)}
          className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors"
        >
          <ArrowRight size={18} /> العودة لقائمة العقود
        </button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#141517] border border-white/5 rounded-2xl p-8 relative overflow-hidden"
        >
          <div ref={contractRef} className="bg-[#141517] p-4 rounded-xl">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#FFD700]/5 rounded-bl-full -mr-8 -mt-8"></div>
            
            <div className="flex justify-between items-start mb-8 border-b border-white/5 pb-6">
              <div className="text-right">
                <h1 className="text-3xl font-bold text-white mb-2">عقد شراكة رقمي</h1>
                <span className="text-sm text-gray-400">رقم العقد: {selectedContract.id.slice(0, 8).toUpperCase()}</span>
              </div>
              <div className="text-left">
                <span className="block text-sm text-gray-400 mb-1">تاريخ الإنشاء</span>
                <span className="font-mono text-white">{new Date(selectedContract.created_at).toLocaleDateString('ar-SA')}</span>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div className="bg-black/20 p-6 rounded-xl border border-white/5">
                <h3 className="text-lg font-bold text-[#FFD700] mb-4 flex items-center gap-2">
                  <Users size={18} /> أطراف العقد
                </h3>
                <ul className="space-y-4">
                  {selectedContract.parties.map((party, idx) => (
                    <li key={idx} className="flex justify-between items-center border-b border-white/5 pb-2 last:border-0">
                      <div className="text-right">
                        <span className="font-bold text-white block">{party.name}</span>
                        <span className="text-xs text-gray-500">{party.role}</span>
                      </div>
                      <span className="text-[#FFD700] font-mono font-bold">{party.percentage}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-black/20 p-6 rounded-xl border border-white/5">
                <h3 className="text-lg font-bold text-[#FFD700] mb-4 flex items-center gap-2">
                  <Shield size={18} /> الشروط والأحكام
                </h3>
                <ul className="space-y-3 list-disc list-inside text-sm text-gray-300 text-right">
                  {termsList.map((term, idx) => (
                    <li key={idx}>{term}</li>
                  ))}
                </ul>
              </div>
            </div>

            {selectedContract.signed && (
              <div className="mt-8 pt-8 border-t border-white/5 flex justify-between items-center">
                <div className="text-center">
                  <div className="text-xs text-gray-500 mb-2">توقيع الطرف الأول</div>
                  <div className="font-script text-xl text-white opacity-70">Signed</div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-gray-500 mb-2">توقيع الطرف الثاني</div>
                  <div className="font-script text-xl text-[#FFD700]">{user?.user_metadata?.full_name || 'Signed'}</div>
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-col items-center justify-center pt-8 border-t border-white/5 mt-4">
            {!selectedContract.signed ? (
              <button 
                onClick={handleSign}
                disabled={signing}
                className="px-8 py-3 bg-[#FFD700] text-black font-bold rounded-xl hover:bg-[#FFC000] transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {signing ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  <>
                    <PenTool size={20} /> التوقيع الرقمي
                  </>
                )}
              </button>
            ) : (
              <div className="text-center animate-fade-in w-full">
                <div className="w-16 h-16 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-500/30">
                  <CheckCircle size={32} />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">تم التوقيع بنجاح!</h3>
                <p className="text-gray-400 mb-6">تم توثيق العقد في السجلات الرقمية.</p>
                <button 
                  onClick={handleDownloadPDF}
                  className="px-6 py-2 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-colors flex items-center gap-2 mx-auto border border-white/10"
                >
                  <Download size={18} /> تحميل نسخة PDF
                </button>
              </div>
            )}
          </div>

        </motion.div>
      </div>
    </div>
  );
};
