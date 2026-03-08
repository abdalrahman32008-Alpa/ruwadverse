import { describe, it, expect, vi } from 'vitest';
import { predictSuccess, FounderData, StartupData } from '../models/prediction';

vi.mock('@sentry/react', () => ({
  instrumentGoogleGenAIClient: vi.fn((client) => client),
}));

// Mock the Gemini API
vi.mock('@google/genai', () => {
  return {
    GoogleGenAI: vi.fn().mockImplementation(() => ({
      models: {
        generateContent: vi.fn().mockResolvedValue({
          text: JSON.stringify({
            successScore: 85,
            failureSignals: ['High competition'],
            explanation: 'فريق قوي وسوق كبير، لكن المنافسة شرسة.'
          })
        })
      }
    }))
  };
});

describe('Success Prediction Model', () => {
  it('should predict success score and identify failure signals', async () => {
    const founder: FounderData = {
      experienceYears: 10,
      pastStartups: 2,
      skills: ['Leadership', 'Tech']
    };

    const startup: StartupData = {
      idea: 'AI Platform',
      marketSize: 500,
      traction: '10k MRR',
      competitors: 5
    };

    const result = await predictSuccess(founder, startup);
    
    expect(result).toBeDefined();
    expect(result.successScore).toBe(85);
    expect(result.failureSignals).toContain('High competition');
    expect(result.explanation).toBeDefined();
  });
});
