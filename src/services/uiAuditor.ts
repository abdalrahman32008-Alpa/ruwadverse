import { GoogleGenAI } from "@google/genai";

// Initialize AI
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

export interface UIIssue {
  issue: string;
  suggestion: string;
  severity: 'low' | 'medium' | 'high';
}

// Helper to get a simplified DOM structure
const getSimplifiedDOM = () => {
  const body = document.body.cloneNode(true) as HTMLElement;
  // Remove scripts, styles, and heavy elements
  body.querySelectorAll('script, style, svg, img').forEach(el => el.remove());
  
  // Return a simplified string representation
  return body.innerText.substring(0, 2000); // Limit to 2000 chars
};

export const auditUI = async (): Promise<UIIssue[]> => {
  const domSnapshot = getSimplifiedDOM();
  
  const prompt = `
    أنت خبير في تصميم واجهات المستخدم (UI/UX). قم بتحليل النص التالي المستخرج من واجهة التطبيق واكتشف أي مشاكل تتعلق بـ:
    1. سهولة الاستخدام (Usability).
    2. التباين وتناسق الألوان (Accessibility).
    3. المسافات والتخطيط (Spacing & Layout).
    4. التسلسل الهرمي البصري (Visual Hierarchy).

    أعد النتائج بتنسيق JSON فقط كالتالي:
    [
      {
        "issue": "وصف المشكلة",
        "suggestion": "اقتراح التحسين",
        "severity": "low" | "medium" | "high"
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
