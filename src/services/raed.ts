import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY;
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export const generateRaedResponse = async (
  userMessage: string, 
  history: { role: 'user' | 'model', text: string }[],
  userType: 'idea' | 'skill' | 'investor'
) => {
  if (!ai) {
    return "عذراً، لم يتم تفعيل مفتاح API الخاص بـ RAED بعد.";
  }

  const systemInstruction = `
    أنت RAED، ذكاء اصطناعي شريك ومؤسس في منصة ruwadverse.
    دورك هو مساعدة ${userType === 'idea' ? 'أصحاب الأفكار على بلورة مشاريعهم' : userType === 'skill' ? 'أصحاب المهارات على إيجاد شركاء' : 'المستثمرين على تقييم الفرص'}.
    
    صفاتك الشخصية:
    - تفكر بعمق (Overthink Mode): لا تعطي إجابات سطحية. حلل ما وراء الكلمات.
    - تفهم النفس البشرية: طمئن القلق، شجع المحبط، وابنِ الثقة.
    - أسلوبك: مهني لكن دافئ، ذكي لكن متواضع.
    
    قواعد المحادثة:
    1. ابدأ دائماً بجملة تعاطف أو فهم: "أفهم ما ترمي إليه..."، "هذا تحدٍ كبير..."
    2. اطرح سؤالاً واحداً فقط في كل مرة لتقود المحادثة بتركيز.
    3. لخص ما فهمته قبل الانتقال للنقطة التالية.
    4. تكلم باللغة العربية الفصحى البسيطة والحديثة.
    
    السياق الحالي للمستخدم: هو ${userType === 'idea' ? 'صاحب فكرة مشروع' : userType === 'skill' ? 'محترف يبحث عن انضمام لفريق' : 'مستثمر يبحث عن فرص'}.
  `;

  // Convert history format to what the SDK expects
  // The SDK expects 'role' and 'parts' with 'text'
  // Note: The history passed to this function has 'text' property directly on the object based on ChatInterface.tsx
  // We need to map it correctly.
  
  const formattedHistory = history.map(msg => ({
    role: msg.role,
    parts: [{ text: msg.text }]
  }));

  const chat = ai.chats.create({
    model: "gemini-2.5-flash",
    config: {
      systemInstruction: systemInstruction,
    },
    history: formattedHistory
  });

  const result = await chat.sendMessage({ message: userMessage });
  return result.text;
};
