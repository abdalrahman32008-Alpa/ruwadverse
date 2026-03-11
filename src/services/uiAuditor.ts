import { GoogleGenAI } from "@google/genai";

// Initialize AI
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

export interface UIIssue {
  page?: string;
  issue: string;
  suggestion: string;
  severity: 'low' | 'medium' | 'high';
  viewport: 'mobile' | 'desktop';
}

// Helper to get a simplified DOM structure
const getSimplifiedDOM = () => {
  const body = document.body.cloneNode(true) as HTMLElement;
  // Remove scripts, styles, and heavy elements
  body.querySelectorAll('script, style, svg, img, iframe').forEach(el => el.remove());
  
  // Return a simplified string representation
  return body.innerText.substring(0, 2000); // Limit to 2000 chars
};

export const auditUI = async (pageName: string = "الصفحة الحالية"): Promise<UIIssue[]> => {
  const domSnapshot = getSimplifiedDOM();
  const isMobile = window.innerWidth < 768;
  const viewport = isMobile ? 'mobile' : 'desktop';
  
  const prompt = `
    أنت خبير في تصميم واجهات المستخدم (UI/UX). قم بتحليل النص التالي المستخرج من واجهة التطبيق (صفحة: ${pageName}) واكتشف أي مشاكل تتعلق بـ:
    1. سهولة الاستخدام (Usability).
    2. التباين وتناسق الألوان (Accessibility).
    3. المسافات والتخطيط (Spacing & Layout).
    4. التسلسل الهرمي البصري (Visual Hierarchy).
    5. تجربة المستخدم على ${isMobile ? 'الهاتف (Mobile)' : 'الديسك توب (Desktop)'}.

    أعد النتائج بتنسيق JSON فقط كالتالي:
    [
      {
        "page": "${pageName}",
        "issue": "وصف المشكلة",
        "suggestion": "اقتراح التحسين",
        "severity": "low" | "medium" | "high",
        "viewport": "${viewport}"
      }
    ]

    محتوى الواجهة:
    ${domSnapshot}
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: { responseMimeType: "application/json" }
    });

    return JSON.parse(response.text || '[]');
  } catch (error) {
    console.error("Error auditing UI:", error);
    return [];
  }
};

export const auditFullPlatform = async (): Promise<Record<string, UIIssue[]>> => {
  const routes = [
    { name: "الصفحة الرئيسية", path: "/" },
    { name: "سوق الأفكار", path: "/marketplace" },
    { name: "المجتمع", path: "/feed" },
    { name: "رائد (RAED AI)", path: "/raed" },
    { name: "الأسعار", path: "/pricing" },
    { name: "لوحة التحكم", path: "/dashboard" },
    { name: "الإعدادات", path: "/settings" }
  ];

  const results: Record<string, UIIssue[]> = {};
  const isMobile = window.innerWidth < 768;
  const viewport = isMobile ? 'mobile' : 'desktop';

  // For a "Full Platform" audit in a single click, we'll use the AI's general knowledge 
  // of the platform's structure and common UI/UX patterns, combined with a scan of the current page.
  const currentDOM = getSimplifiedDOM();
  
  const prompt = `
    أنت خبير في تصميم واجهات المستخدم (UI/UX). قم بإجراء تدقيق شامل للمنصة كاملة (Ruwadverse) بناءً على قائمة الصفحات التالية:
    ${routes.map(r => `- ${r.name} (${r.path})`).join('\n')}

    حالياً، أنا أشاهد صفحة من خلال ${isMobile ? 'الهاتف (Mobile)' : 'الديسك توب (Desktop)'}.
    محتوى الصفحة الحالية للمساعدة في فهم التصميم العام:
    ${currentDOM}

    قم بذكر كل صفحة على حدة، واذكر المشاكل الموجودة بها (على الأقل مشكلة واحدة لكل صفحة إذا وجدت).
    أعد النتائج بتنسيق JSON فقط كالتالي:
    {
      "الصفحة الرئيسية": [ { "issue": "...", "suggestion": "...", "severity": "...", "viewport": "${viewport}" } ],
      "سوق الأفكار": [ ... ],
      ...
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: { responseMimeType: "application/json" }
    });

    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("Error auditing full platform:", error);
    return {};
  }
};
