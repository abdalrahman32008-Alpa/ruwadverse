import { describe, it, expect, vi } from 'vitest';

vi.mock('@google/genai', () => {
  class GoogleGenAI {
    constructor() {
      return {
        chats: {
          create: vi.fn(() => ({
            sendMessage: vi.fn().mockResolvedValue({ text: 'مرحباً، كيف يمكنني مساعدتك؟' }),
          })),
        },
      };
    }
  }
  return {
    GoogleGenAI,
    ThinkingLevel: { LOW: 'LOW' }
  };
});

import { generateRaedResponse } from './raed';

describe('raed service', () => {
  it('should generate a response', async () => {
    const response = await generateRaedResponse('مرحباً', [], 'idea');
    expect(response).toBe('مرحباً، كيف يمكنني مساعدتك؟');
  });
});
