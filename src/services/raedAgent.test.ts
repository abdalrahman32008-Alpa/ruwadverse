import { describe, it, expect, vi } from 'vitest';
import { AdvancedRaedAgent } from './raedAgent';

vi.mock('@google/genai', () => {
  return {
    GoogleGenAI: class {
      constructor() {
        return {
          models: {
            generateContent: vi.fn().mockResolvedValue({
              text: 'مرحباً، أنا وكيلك الذكي.',
              candidates: [{ content: { role: 'model', parts: [{ text: 'مرحباً، أنا وكيلك الذكي.' }] } }]
            }),
          },
        };
      }
    },
    Type: { OBJECT: 'OBJECT', STRING: 'STRING', ARRAY: 'ARRAY' },
  };
});

describe('AdvancedRaedAgent', () => {
  it('should send a message', async () => {
    const agent = new AdvancedRaedAgent('idea');
    const response = await agent.sendMessage('مرحباً');
    expect(response).toBe('مرحباً، أنا وكيلك الذكي.');
  });
});
