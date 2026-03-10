import { describe, it, expect, vi } from 'vitest';
import { analyzeRegulations } from '../utils/arabicRegulations';

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
            country: 'مصر',
            suggestedEntity: 'شركة ذات مسؤولية محدودة (LLC)',
            legalRequirements: ['سجل تجاري', 'بطاقة ضريبية'],
            partnershipAdvice: 'يجب توثيق العقد في الشهر العقاري.'
          })
        })
      }
    }))
  };
});

describe('Arabic Regulations Analyzer', () => {
  it('should analyze regulations and return a structured JSON response', async () => {
    const result = await analyzeRegulations('مصر', 'FinTech', 'تطبيق دفع إلكتروني');
    
    expect(result).toBeDefined();
    expect(result.country).toBe('مصر');
    expect(result.suggestedEntity).toContain('LLC');
    expect(result.legalRequirements.length).toBeGreaterThan(0);
    expect(result.partnershipAdvice).toBeDefined();
  });
});
