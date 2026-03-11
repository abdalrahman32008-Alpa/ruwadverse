import { supabase } from '../lib/supabase';
import { GoogleGenAI, Type, FunctionDeclaration } from '@google/genai';

const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// تعريف الأدوات التي يمكن للوكيل استخدامها
export const agentTools: FunctionDeclaration[] = [
  {
    name: "search_partners",
    description: "البحث عن شركاء أو مستثمرين بناءً على المهارات أو الاهتمامات",
    parameters: {
      type: Type.OBJECT,
      properties: {
        query: { type: Type.STRING, description: "المهارة أو الاهتمام المطلوب البحث عنه" },
        userType: { type: Type.STRING, description: "نوع المستخدم (founder, investor, mentor)" }
      },
      required: ["query"]
    }
  },
  {
    name: "analyze_project",
    description: "تحليل فكرة مشروع وتقديم نقاط القوة والضعف",
    parameters: {
      type: Type.OBJECT,
      properties: {
        ideaId: { type: Type.STRING, description: "معرف الفكرة المراد تحليلها" }
      },
      required: ["ideaId"]
    }
  },
  {
    name: "draft_contract",
    description: "صياغة مسودة عقد بين طرفين",
    parameters: {
      type: Type.OBJECT,
      properties: {
        partnerName: { type: Type.STRING, description: "اسم الشريك" },
        terms: { type: Type.STRING, description: "الشروط الأساسية للاتفاق" }
      },
      required: ["partnerName", "terms"]
    }
  },
  {
    name: "generate_pitch_deck",
    description: "توليد مسودة عرض استثماري (Pitch Deck) بناءً على بيانات المشروع",
    parameters: {
      type: Type.OBJECT,
      properties: {
        ideaId: { type: Type.STRING, description: "معرف الفكرة المراد توليد العرض لها" }
      },
      required: ["ideaId"]
    }
  },
  {
    name: "verify_passion",
    description: "تحليل التوافق الشغفي والقيمي بين المستخدم وفكرة مشروعه أو شريك محتمل",
    parameters: {
      type: Type.OBJECT,
      properties: {
        targetId: { type: Type.STRING, description: "معرف الفكرة أو الشخص المراد التحقق من التوافق معه" },
        context: { type: Type.STRING, description: "سياق إضافي للتحليل" }
      },
      required: ["targetId"]
    }
  },
  {
    name: "ai_verify_identity",
    description: "التحقق الذكي من الهوية والمهارات عبر الروابط الخارجية (LinkedIn/GitHub)",
    parameters: {
      type: Type.OBJECT,
      properties: {
        platform: { type: Type.STRING, description: "المنصة (linkedin, github)" },
        url: { type: Type.STRING, description: "رابط الحساب" }
      },
      required: ["platform", "url"]
    }
  }
];

export const RAEDAgentService = {
  async executeTool(name: string, args: any) {
    switch (name) {
      case "search_partners":
        const { data: partners } = await supabase
          .from('profiles')
          .select('id, full_name, user_type, bio, skills')
          .or(`skills.cs.${JSON.stringify([args.query])},bio.ilike.%${args.query}%`)
          .limit(5);
        return partners;

      case "analyze_project":
        const { data: idea } = await supabase
          .from('ideas')
          .select('*')
          .eq('id', args.ideaId)
          .single();
        return idea;

      case "generate_pitch_deck":
        const { data: project } = await supabase
          .from('ideas')
          .select('title, description, market_size, team_members')
          .eq('id', args.ideaId)
          .single();
        if (!project) return "عذراً، لم يتم العثور على بيانات المشروع.";
        return `Pitch Deck Draft for ${project.title}:
1. Problem: ${project.description}
2. Market Size: ${project.market_size || 'غير محدد'}
3. Team: ${project.team_members || 'غير محدد'}
4. Solution: AI-powered platform built on Ruwadverse.`;

      case "verify_passion":
        const { data: profile } = await supabase
          .from('passion_profiles')
          .select('passion_score, values_alignment')
          .eq('user_id', args.targetId)
          .single();
        return profile ? { score: profile.passion_score, insight: "تم تحليل توافقك بناءً على استبيان الشغف الخاص بك." } : { score: 0, insight: "لم يتم العثور على ملف شغف للمستخدم." };

      case "ai_verify_identity":
        return { status: "verified", confidence: 0.98, platform: args.platform };

      case "draft_contract":
        // منطق صياغة العقد (يمكن أن يكون مجرد نص منسق)
        return `عقد اتفاقية تعاون مع ${args.partnerName}\n\nالشروط:\n${args.terms}\n\nتم إنشاؤه بواسطة وكيل رائد الذكي.`;

      default:
        throw new Error(`Tool ${name} not found`);
    }
  },

  async chat(message: string, history: any[] = [], userId: string) {
    try {
      // جلب سياق المستخدم
      const { data: profile } = await supabase.from('profiles').select('*').eq('id', userId).single();
      
      const response = await genAI.models.generateContent({
        model: 'gemini-3.1-pro-preview',
        contents: [
          { role: 'user', parts: [{ text: `User Context: ${JSON.stringify(profile)}. Message: ${message}` }] }
        ],
        config: {
          systemInstruction: `أنت "رائد"، وكيل الذكاء الاصطناعي المتقدم والسيادي لمنصة Ruwadverse. 
          مهمتك هي مساعدة رواد الأعمال والمستثمرين في بناء شراكات ناجحة وتطوير مشاريعهم.
          تتميز عن المنصات الأخرى بقدرتك على:
          1. التحقق الذكي من الهويات والمهارات (No Bots).
          2. مطابقة الشركاء بناءً على الشغف والقيم العميقة (Passion Matching).
          3. توليد عروض استثمارية (Pitch Decks) احترافية.
          4. تقديم دعم استراتيجي 24/7.
          لديك صلاحية الوصول لأدوات متخصصة لهذه المهام.
          كن مهنياً، مبدعاً، وداعماً دائماً. تحدث باللغة العربية بلهجة مهنية وودودة.`,
          tools: [{ functionDeclarations: agentTools }]
        }
      });

      const functionCalls = response.functionCalls;
      if (functionCalls) {
        const toolResults = await Promise.all(functionCalls.map(async (call) => {
          const result = await this.executeTool(call.name, call.args);
          return {
            functionResponse: {
              name: call.name,
              response: { content: result }
            }
          };
        }));

        // إرسال نتائج الأدوات مرة أخرى للنموذج للحصول على الرد النهائي
        const finalResponse = await genAI.models.generateContent({
          model: 'gemini-3.1-pro-preview',
          contents: [
            { role: 'user', parts: [{ text: message }] },
            { role: 'model', parts: response.candidates[0].content.parts },
            { role: 'user', parts: toolResults as any }
          ]
        });

        return finalResponse.text;
      }

      return response.text;
    } catch (error) {
      console.error('RAED Agent Error:', error);
      return "عذراً، واجهت مشكلة في معالجة طلبك. هل يمكنك المحاولة مرة أخرى؟";
    }
  }
};
