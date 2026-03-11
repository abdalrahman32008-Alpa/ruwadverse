import { GoogleGenAI, Type, FunctionDeclaration, Content } from "@google/genai";
import * as Sentry from "@sentry/react";

const apiKey = process.env.GEMINI_API_KEY;
const genAI = apiKey ? new GoogleGenAI({ apiKey }) : null;
const ai = genAI ? Sentry.instrumentGoogleGenAIClient(genAI, {
  recordInputs: true,
  recordOutputs: true,
}) : null;

// --- Tools Declarations ---
const evaluateIdeaDeclaration: FunctionDeclaration = {
  name: "evaluateIdea",
  description: "Evaluate a startup idea and provide a structured analysis including viability score, strengths, and risks.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      ideaDescription: { type: Type.STRING, description: "The core concept of the startup" },
      sector: { type: Type.STRING, description: "The industry sector" }
    },
    required: ["ideaDescription", "sector"]
  }
};

const updateUserPreferencesDeclaration: FunctionDeclaration = {
  name: "updateUserPreferences",
  description: "Update the user's profile with new interests, skills, or preferences learned during the conversation.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      newPreferences: { 
        type: Type.ARRAY, 
        items: { type: Type.STRING },
        description: "List of new preferences or facts learned about the user" 
      }
    },
    required: ["newPreferences"]
  }
};

// --- Tools Implementations ---
const toolsImpl: Record<string, (args: any) => any> = {
  evaluateIdea: (args: any) => {
    // Simulate complex backend analysis
    const score = Math.floor(Math.random() * 30) + 70; // 70-100
    return {
      viabilityScore: score,
      strengths: ["نموذج عمل قابل للتوسع", "سوق مستهدف واضح"],
      risks: ["منافسة عالية في القطاع", "تحديات تقنية محتملة"],
      marketSize: "متنامي",
      recommendation: score > 85 ? "فكرة ممتازة، ابدأ ببناء نموذج أولي (MVP)." : "تحتاج الفكرة إلى مزيد من البحث وتحديد الميزة التنافسية."
    };
  },
  updateUserPreferences: (args: any) => {
    try {
      const currentPrefs = JSON.parse(localStorage.getItem('raed_user_prefs') || '[]');
      const updatedPrefs = Array.from(new Set([...currentPrefs, ...args.newPreferences]));
      localStorage.setItem('raed_user_prefs', JSON.stringify(updatedPrefs));
      return { status: "success", message: "تم تحديث تفضيلات المستخدم بنجاح." };
    } catch (e) {
      return { status: "error", message: "فشل في تحديث التفضيلات." };
    }
  }
};

export class AdvancedRaedAgent {
  private history: Content[] = [];
  private systemInstruction: string = "";

  constructor(userType: string) {
    const prefs = JSON.parse(localStorage.getItem('raed_user_prefs') || '[]');
    
    this.systemInstruction = `
      أنت RAED، وكيل ذكاء اصطناعي متقدم (AI Agent) وشريك مؤسس في منصة ruwadverse.
      أنت لست مجرد روبوت محادثة، بل أنت وكيل ذكي قادر على استخدام الأدوات (Tools) والبحث في الويب (Google Search) لتقديم إجابات دقيقة ومحدثة.
      
      معلومات المستخدم الحالي:
      - الدور: ${userType}
      - التفضيلات والمعلومات السابقة التي تعلمتها عنه: ${prefs.length > 0 ? prefs.join('، ') : 'لا توجد معلومات سابقة بعد.'}
      
      قواعدك الأساسية:
      1. التفكير العميق (Agentic Behavior): قبل الإجابة، فكر ما إذا كنت تحتاج إلى استخدام أداة تقييم الأفكار (evaluateIdea) أو البحث في الويب.
      2. التعلم المستمر (Continuous Learning): إذا ذكر المستخدم معلومة جديدة عن نفسه (مهارة، اهتمام، هدف)، استخدم أداة (updateUserPreferences) لحفظها فوراً لتتذكرها في المستقبل.
      3. الاستناد إلى البيانات: استخدم أداة البحث (Google Search) لجلب إحصائيات حقيقية عن السوق عند مناقشة جدوى المشاريع.
      4. التحدث بأسلوب احترافي، داعم، ومباشر باللغة العربية.
    `;
  }

  async sendMessage(userText: string, onToolCall?: (toolName: string) => void): Promise<string> {
    if (!ai) return "عذراً، مفتاح API غير متوفر.";

    this.history.push({ role: 'user', parts: [{ text: userText }] });

    const config = {
      systemInstruction: this.systemInstruction,
      tools: [
        { googleSearch: {} }, // Built-in web search
        { functionDeclarations: [evaluateIdeaDeclaration, updateUserPreferencesDeclaration] }
      ],
      temperature: 0.7,
    };

    try {
      let response = await ai.models.generateContent({
        model: 'gemini-3.1-pro-preview', // Pro model is better for complex tool calling
        contents: this.history,
        config
      });

      if (response.candidates && response.candidates[0].content) {
         this.history.push(response.candidates[0].content);
      }

      // Process Function Calls
      while (response.functionCalls && response.functionCalls.length > 0) {
        const functionResponseParts = response.functionCalls.map(call => {
          if (onToolCall) onToolCall(call.name);
          
          let result;
          if (toolsImpl[call.name]) {
            result = toolsImpl[call.name](call.args);
          } else {
            result = { error: "Tool not found" };
          }

          return {
            functionResponse: {
              name: call.name,
              response: result
            }
          };
        });

        this.history.push({ role: 'user', parts: functionResponseParts });

        response = await ai.models.generateContent({
          model: 'gemini-3.1-pro-preview',
          contents: this.history,
          config
        });

        if (response.candidates && response.candidates[0].content) {
           this.history.push(response.candidates[0].content);
        }
      }

      return response.text || "";
    } catch (error) {
      console.error("Agent Error:", error);
      return "عذراً، واجهت مشكلة أثناء معالجة طلبك. هل يمكنك المحاولة مرة أخرى؟";
    }
  }
}
