import { supabase } from './supabase';
import { GoogleGenAI } from '@google/genai';

const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const EvolutionEngine = {
  // 1. تسجيل نشاط المستخدم للتعلم منه
  async logActivity(userId: string | undefined, action: string, path: string, metadata: any = {}) {
    try {
      await supabase.from('user_activity_logs').insert([{
        user_id: userId,
        action_type: action,
        page_path: path,
        metadata
      }]);
    } catch (error) {
      console.error('Cortex Logging Error:', error);
    }
  },

  // 2. تحليل البيانات وتوليد تقرير التطور (يعمل في الخلفية)
  async analyzeAndEvolve() {
    try {
      // جلب آخر 100 نشاط
      const { data: logs } = await supabase
        .from('user_activity_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      if (!logs || logs.length < 10) return;

      const prompt = `
        You are the Evolution Engine of Ruwadverse platform. 
        Analyze these user activity logs: ${JSON.stringify(logs)}
        
        Tasks:
        1. Identify friction points (where users struggle).
        2. Suggest UI/UX improvements.
        3. Identify features users seem to want based on searches.
        4. If you find a technical limitation you can't fix, report it clearly.
        
        Return a JSON array of objects:
        {
          "insight_type": "ux_improvement" | "bug_report" | "feature_suggestion",
          "content": "description",
          "suggested_code": "optional code snippet",
          "difficulty_level": "easy" | "medium" | "hard"
        }
      `;

      const response = await genAI.models.generateContent({
        model: 'gemini-3.1-flash-lite-preview',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        }
      });

      const reports = JSON.parse(response.text);

      // تخزين التقارير في قاعدة البيانات
      if (Array.isArray(reports)) {
        await supabase.from('system_evolution_reports').insert(reports);
      }
      
      return reports;
    } catch (error) {
      console.error('Evolution Engine Error:', error);
    }
  }
};
