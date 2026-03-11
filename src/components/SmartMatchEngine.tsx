import React, { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { GoogleGenAI } from '@google/genai';
import { toast } from 'react-hot-toast';
import { Sparkles } from 'lucide-react';

const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const SmartMatchEngine = () => {
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    const runSmartMatch = async () => {
      try {
        // جلب بيانات المستخدم الحالي
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        // جلب آخر الأنشطة
        const { data: logs } = await supabase
          .from('user_activity_logs')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(20);

        // جلب أفكار/مشاريع مقترحة
        const { data: ideas } = await supabase
          .from('ideas')
          .select('*')
          .limit(50);

        if (!profile || !ideas) return;

        const prompt = `
          You are a Smart Matchmaking AI for Ruwadverse.
          User Profile: ${JSON.stringify(profile)}
          Recent Activity: ${JSON.stringify(logs)}
          Available Ideas: ${JSON.stringify(ideas)}
          
          Task: Find the BEST single match for this user from the available ideas.
          If a strong match exists, return a JSON object:
          {
            "matchFound": true,
            "ideaId": "...",
            "reason": "Arabic explanation why this is a good match"
          }
          If no strong match, return {"matchFound": false}.
        `;

        const response = await genAI.models.generateContent({
          model: 'gemini-3.1-flash-lite-preview',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
          }
        });

        const match = JSON.parse(response.text);

        if (match.matchFound) {
          const matchedIdea = ideas.find(i => i.id === match.ideaId);
          if (matchedIdea) {
            toast((t) => (
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 font-bold text-[#FFD700]">
                  <Sparkles size={16} />
                  <span>اقتراح ذكي من رائد</span>
                </div>
                <p className="text-sm text-gray-300">{match.reason}</p>
                <button 
                  onClick={() => {
                    window.location.href = `/ideas/${matchedIdea.id}`;
                    toast.dismiss(t.id);
                  }}
                  className="mt-2 bg-[#FFD700] text-black text-xs py-1 px-3 rounded-lg font-bold"
                >
                  عرض المشروع
                </button>
              </div>
            ), { duration: 6000, icon: '💡' });
          }
        }
      } catch (error) {
        console.error('Smart Match Error:', error);
      }
    };

    // تشغيل المطابقة الذكية بعد 10 ثوانٍ من دخول المستخدم
    const timer = setTimeout(runSmartMatch, 10000);
    return () => clearTimeout(timer);
  }, [user]);

  return null; // يعمل في الخلفية فقط
};
