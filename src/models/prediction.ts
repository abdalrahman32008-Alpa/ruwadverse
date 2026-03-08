import { GoogleGenAI } from '@google/genai';
import * as Sentry from "@sentry/react";

const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const ai = Sentry.instrumentGoogleGenAIClient(genAI, {
  recordInputs: true,
  recordOutputs: true,
});

export interface FounderData {
  linkedinProfileUrl?: string;
  experienceYears: number;
  pastStartups: number;
  skills: string[];
}

export interface StartupData {
  idea: string;
  marketSize: number;
  traction: string; // e.g., "100 active users", "none"
  competitors: number;
}

export interface PredictionResult {
  successScore: number; // 0-100
  failureSignals: string[];
  explanation: string;
}

export async function predictSuccess(founder: FounderData, startup: StartupData): Promise<PredictionResult> {
  try {
    const prompt = `
      Analyze the probability of success for this startup using a simulated Fuzzy Random Forest model.
      Consider Founder Fit (experience, past startups, skills) and Startup Data (idea, market size, traction, competitors).
      Detect failure signals like "no traction" or "market saturation".
      
      Founder:
      - Experience: ${founder.experienceYears} years
      - Past Startups: ${founder.pastStartups}
      - Skills: ${founder.skills.join(', ')}
      
      Startup:
      - Idea: ${startup.idea}
      - Market Size: $${startup.marketSize}M
      - Traction: ${startup.traction}
      - Competitors: ${startup.competitors}
      
      Return a JSON object with:
      - successScore (number 0-100)
      - failureSignals (array of strings)
      - explanation (string explaining the score in Arabic)
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3.1-pro-preview',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as PredictionResult;
    }

    throw new Error("Failed to parse prediction response");
  } catch (error) {
    console.error("Prediction error:", error);
    return {
      successScore: 50,
      failureSignals: ["Error analyzing data"],
      explanation: "حدث خطأ أثناء تحليل البيانات. يرجى المحاولة لاحقاً."
    };
  }
}
