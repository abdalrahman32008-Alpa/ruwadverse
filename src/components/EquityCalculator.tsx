import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { toast } from 'react-hot-toast';

export const EquityCalculator = ({ ideaId }: { ideaId: string }) => {
  const [split, setSplit] = useState({ founder: 70, partner: 30 });

  const saveAgreement = async () => {
    const { error } = await supabase.from('equity_agreements').insert({
      idea_id: ideaId,
      equity_split: JSON.stringify(split)
    });
    if (error) toast.error('خطأ في حفظ الاتفاقية');
    else toast.success('تم حفظ اتفاقية الحصص!');
  };

  return (
    <div className="p-6 bg-[#141517] rounded-2xl border border-white/10">
      <h3 className="text-xl font-bold mb-4">حاسبة الحصص العادلة</h3>
      <div className="flex gap-4 mb-4">
        <input type="number" value={split.founder} onChange={(e) => setSplit({...split, founder: Number(e.target.value)})} className="bg-white/5 p-2 rounded w-20" />
        <input type="number" value={split.partner} onChange={(e) => setSplit({...split, partner: Number(e.target.value)})} className="bg-white/5 p-2 rounded w-20" />
      </div>
      <button onClick={saveAgreement} className="bg-[#FFD700] text-black px-6 py-2 rounded-xl font-bold">حفظ الاتفاقية</button>
    </div>
  );
};
