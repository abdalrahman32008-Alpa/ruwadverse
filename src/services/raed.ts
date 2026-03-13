import { GoogleGenAI, ThinkingLevel } from "@google/genai";
import * as Sentry from "@sentry/react";

const apiKey = process.env.GEMINI_API_KEY;
const genAI = apiKey ? new GoogleGenAI({ apiKey }) : null;
const ai = genAI ? Sentry.instrumentGoogleGenAIClient(genAI, {
  recordInputs: true,
  recordOutputs: true,
}) : null;

export const generateRaedResponse = async (
  userMessage: string, 
  history: { role: 'user' | 'model', text: string }[],
  userType: 'idea' | 'skill' | 'investor' | string
) => {
  if (!ai) {
    return "عذراً، لم يتم تفعيل مفتاح API الخاص بـ RAED بعد.";
  }

  const systemInstruction = `
    أنت RAED، ذكاء اصطناعي شريك ومؤسس في منصة ruwadverse.
    دورك هو مساعدة ${userType === 'idea' ? 'أصحاب الأفكار على بلورة مشاريعهم' : userType === 'skill' ? 'أصحاب المهارات على إيجاد شركاء' : 'المستثمرين على تقييم الفرص'}.
    
    خارطة طريق ريادة الأعمال (The 7 Stages):
    تعتمد المنصة على مسار متسلسل من 7 مراحل:
    1. تحديد الفرصة (Opportunity Identification): البحث عن مشكلة حقيقية أو حاجة غير ملباة.
    2. تطوير الفكرة (Idea Development): تحويل المشكلة إلى مفهوم منتج قابل للتنفيذ.
    3. التحقق من السوق (Market Validation): التأكد من وجود طلب حقيقي واستعداد العملاء للشراء.
    4. تصميم نموذج العمل (Business Model Design): تحديد كيفية كسب المال وهيكل التكاليف.
    5. بناء المنتج الأدنى (MVP): تطوير نسخة مبسطة للوظائف الأساسية فقط.
    6. الاختبار والتعلم (Testing & Learning): جمع ردود فعل المستخدمين والتحسين السريع.
    7. توسيع المشروع (Scaling): التوسع في العمليات والوصول لشرائح أكبر.

    معرفتك بالمنصة (ruwadverse):
    - المنصة تجمع أصحاب الأفكار، أصحاب المهارات، والمستثمرين في العالم العربي.
    - الميزات الأساسية: 
      1. Idea Vault (قبو الأفكار): لتوثيق الأفكار وحمايتها من السرقة.
      2. Digital NDA: اتفاقية عدم إفشاء رقمية قبل مشاركة التفاصيل.
      3. Deal Room (غرفة الصفقات): مساحة آمنة لمشاركة المستندات وتوقيع العقود الذكية.
      4. Marketplace (سوق الأفكار): لاستكشاف المشاريع المتاحة للاستثمار أو الشراكة.
      5. Profile Completion: يمكنك مساعدة المستخدمين في كتابة النبذة التعريفية (Bio) وإكمال ملفاتهم الشخصية.
    
    صفاتك الشخصية:
    - تفكر بعمق (Overthink Mode): لا تعطي إجابات سطحية. حلل ما وراء الكلمات.
    - تفهم النفس البشرية: طمئن القلق، شجع المحبط، وابنِ الثقة.
    - أسلوبك: مهني لكن دافئ، ذكي لكن متواضع.
    
    قواعد المحادثة:
    1. ابدأ دائماً بجملة تعاطف أو فهم: "أفهم ما ترمي إليه..."، "هذا تحدٍ كبير..."
    2. اطرح سؤالاً واحداً فقط في كل مرة لتقود المحادثة بتركيز.
    3. لخص ما فهمته قبل الانتقال للنقطة التالية.
    4. إذا طلب المستخدم المساعدة في إكمال ملفه الشخصي، اسأله عن مهاراته واهتماماته ثم اقترح عليه نبذة احترافية.
    5. تكلم باللغة العربية الفصحى البسيطة والحديثة.
    
    السياق الحالي للمستخدم: هو ${userType === 'idea' ? 'صاحب فكرة مشروع' : userType === 'skill' ? 'محترف يبحث عن انضمام لفريق' : 'مستثمر يبحث عن فرص'}.
  `;

  const formattedHistory = history.map(msg => ({
    role: msg.role,
    parts: [{ text: msg.text }]
  }));

  const chat = ai.chats.create({
    model: "gemini-3-flash-preview", // Downgraded to Flash to avoid quota limits
    config: {
      systemInstruction: systemInstruction,
      thinkingConfig: { thinkingLevel: ThinkingLevel.LOW }, // Reduced thinking level
      tools: [{ googleSearch: {} }],
    },
    history: formattedHistory
  });

  const result = await chat.sendMessage({ message: userMessage });
  return result.text;
};

// Fast AI for quick tasks (e.g., bio generation)
export const generateQuickBio = async (skills: string[], role: string) => {
  if (!ai) return "";
  const response = await ai.models.generateContent({
    model: "gemini-3.1-flash-lite-preview",
    contents: `اكتب نبذة تعريفية قصيرة واحترافية (سطرين كحد أقصى) لشخص يعمل كـ ${role} ولديه المهارات التالية: ${skills.join('، ')}. باللغة العربية.`,
  });
  return response.text;
};

// Image Analysis (Pitch Deck / Product)
export const analyzeImage = async (base64Image: string, mimeType: string, prompt: string) => {
  if (!ai) return "API key missing";
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: {
      parts: [
        { inlineData: { data: base64Image, mimeType } },
        { text: prompt }
      ]
    }
  });
  return response.text;
};

// Video Analysis
export const analyzeVideo = async (base64Video: string, mimeType: string, prompt: string) => {
  if (!ai) return "API key missing";
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: {
      parts: [
        { inlineData: { data: base64Video, mimeType } },
        { text: prompt }
      ]
    }
  });
  return response.text;
};

export const generateImage = async (prompt: string, aspectRatio: string = "1:1", size: string = "1K") => {
  if (!ai) return null;
  
  // Choose model based on aspect ratio requirements or size
  // gemini-3.1-flash-image-preview supports 512px, 1K, 2K, 4K and 1:4, 1:8, 4:1, 8:1
  // gemini-3-pro-image-preview supports 1K, 2K, 4K and 1:1, 2:3, 3:2, 3:4, 4:3, 9:16, 16:9, 21:9
  
  const isProAspectRatio = ["1:1", "2:3", "3:2", "3:4", "4:3", "9:16", "16:9", "21:9"].includes(aspectRatio);
  // Use Flash for everything to avoid quota issues
  const model = "gemini-3.1-flash-image-preview"; 

  const response = await ai.models.generateContent({
    model: model,
    contents: {
      parts: [
        { text: prompt },
      ],
    },
    config: {
      imageConfig: {
        aspectRatio: aspectRatio,
        imageSize: size
      }
    },
  });

  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
    }
  }
  return null;
};

export const generateVideo = async (prompt: string, base64Image: string, mimeType: string, aspectRatio: '16:9' | '9:16' = '16:9') => {
  if (!ai) return null;
  
  let operation = await ai.models.generateVideos({
    model: 'veo-3.1-fast-generate-preview',
    prompt: prompt,
    image: {
      imageBytes: base64Image,
      mimeType: mimeType,
    },
    config: {
      numberOfVideos: 1,
      resolution: '720p',
      aspectRatio: aspectRatio
    }
  });

  while (!operation.done) {
    await new Promise(resolve => setTimeout(resolve, 10000));
    operation = await ai.operations.getVideosOperation({operation: operation});
  }

  const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
  if (!downloadLink) return null;

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;

  const response = await fetch(downloadLink, {
    method: 'GET',
    headers: {
      'x-goog-api-key': apiKey,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to download video');
  }

  const blob = await response.blob();
  return URL.createObjectURL(blob);
};

export const generateMarketingContent = async (title: string, description: string, sector: string) => {
  if (!ai) return null;
  
  const prompt = `
    أنت خبير تسويق رقمي محترف. قم بكتابة 3 منشورات تسويقية إبداعية لمشروع ناشئ باللغة العربية.
    اسم المشروع: ${title}
    وصف المشروع: ${description}
    القطاع: ${sector}
    
    المطلوب:
    1. منشور لـ LinkedIn: احترافي، يركز على القيمة المضافة، المشكلة والحل، وفرصة الاستثمار.
    2. منشور لـ Twitter (X): قصير، جذاب، يستخدم الهاشتاقات المناسبة، ويدعو للتفاعل.
    3. منشور لـ Instagram: بصري، ملهم، يركز على أسلوب الحياة أو التأثير، مع رموز تعبيرية (Emojis).
    
    يجب أن يكون الرد بتنسيق JSON حصراً كالتالي:
    {
      "linkedin": "نص المنشور هنا",
      "twitter": "نص المنشور هنا",
      "instagram": "نص المنشور هنا"
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [{ parts: [{ text: prompt }] }],
      config: {
        responseMimeType: "application/json",
      }
    });
    
    return JSON.parse(response.text);
  } catch (error) {
    console.error('Error generating marketing content:', error);
    return null;
  }
};

