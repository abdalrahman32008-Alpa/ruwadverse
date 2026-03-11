import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-hot-toast';

export const PassionSurvey = ({ onComplete }: { onComplete: () => void }) => {
  const { user } = useAuth();
  const [answers, setAnswers] = useState({ risk: 5, impact: 5, creativity: 5 });

  const handleSubmit = async () => {
    if (!user) return;
    const { error } = await supabase.from('passion_profiles').insert({
      user_id: user.id,
      passion_score: (answers.risk + answers.impact + answers.creativity) / 15 * 100,
      values_alignment: JSON.stringify(answers)
    });
    if (error) toast.error('خطأ في حفظ البيانات');
    else {
      toast.success('تم حفظ ملف الشغف الخاص بك!');
      onComplete();
    }
  };

  return (
    <div className="p-6 bg-[#141517] rounded-2xl border border-white/10">
      <h3 className="text-xl font-bold mb-4">استبيان مطابقة الشغف</h3>
      {/* Add sliders for risk, impact, creativity */}
      <button onClick={handleSubmit} className="bg-[#FFD700] text-black px-6 py-2 rounded-xl font-bold">حفظ</button>
    </div>
  );
};
