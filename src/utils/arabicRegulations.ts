import { GoogleGenAI } from '@google/genai';
import * as Sentry from "@sentry/react";

const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const ai = Sentry.instrumentGoogleGenAIClient(genAI, {
  recordInputs: true,
  recordOutputs: true,
});

export interface RegulationResult {
  country: string;
  suggestedEntity: string; // e.g., "شركة ذات مسؤولية محدودة (LLC)"
  legalRequirements: string[];
  partnershipAdvice: string;
}

export async function analyzeRegulations(country: string, sector: string, ideaDesc: string): Promise<RegulationResult> {
  try {
    const prompt = `
      Analyze the legal regulations in ${country} for a startup in the ${sector} sector.
      Idea: ${ideaDesc}
      
      Provide a JSON response in Arabic (Egyptian/Khaleeji dialect mix) with:
      - country (string)
      - suggestedEntity (string, e.g., "شركة ذات مسؤولية محدودة (LLC)")
      - legalRequirements (array of strings)
      - partnershipAdvice (string, advice on drafting the partnership agreement)
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3.1-pro-preview',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as RegulationResult;
    }

    throw new Error("Failed to parse regulation response");
  } catch (error) {
    console.error("Regulation analysis error:", error);
    return {
      country,
      suggestedEntity: "غير محدد",
      legalRequirements: ["يرجى استشارة محامٍ محلي."],
      partnershipAdvice: "تأكد من توثيق جميع الاتفاقيات قانونياً."
    };
  }
}
