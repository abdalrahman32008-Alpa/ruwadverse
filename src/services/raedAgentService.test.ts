import { describe, it, expect, vi } from 'vitest';
import { RAEDAgentService } from './raedAgentService';
import { supabase } from '../lib/supabase';

vi.mock('../lib/supabase', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      or: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: { id: '1', title: 'Test Idea' }, error: null }),
      limit: vi.fn().mockResolvedValue({ data: [], error: null }),
    })),
  },
}));

vi.mock('@google/genai', () => {
  return {
    GoogleGenAI: class {
      constructor() {
        return {
          models: {
            generateContent: vi.fn().mockResolvedValue({
              text: 'تحليل المشكلة: ...',
              candidates: [{ content: { role: 'model', parts: [{ text: 'تحليل المشكلة: ...' }] } }]
            }),
          },
        };
      }
    },
    Type: { OBJECT: 'OBJECT', STRING: 'STRING', ARRAY: 'ARRAY' },
    FunctionDeclaration: {},
  };
});

describe('RAEDAgentService', () => {
  it('should execute search_partners tool', async () => {
    const result = await RAEDAgentService.executeTool('search_partners', { query: 'developer' });
    expect(result).toEqual([]);
  });

  it('should analyze UI issue', async () => {
    const result = await RAEDAgentService.analyzeUIIssue('Button is not clickable');
    expect(result).toBe('تحليل المشكلة: ...');
  });
});
