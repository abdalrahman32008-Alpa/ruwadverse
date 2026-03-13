import { describe, it, expect, vi } from 'vitest';
import { auditUI } from './uiAuditor';

vi.mock('@google/genai', () => {
  return {
    GoogleGenAI: class {
      constructor() {
        return {
          models: {
            generateContent: vi.fn().mockResolvedValue({
              text: JSON.stringify([{
                page: 'الصفحة الحالية',
                issue: 'مشكلة في التباين',
                suggestion: 'تحسين الألوان',
                severity: 'low',
                viewport: 'desktop'
              }])
            }),
          },
        };
      }
    },
  };
});

describe('uiAuditor', () => {
  it('should audit UI', async () => {
    document.body.innerHTML = '<div><h1>Test Page</h1><p>Test content</p></div>';
    const issues = await auditUI('الصفحة الحالية');
    expect(issues.length).toBe(1);
    expect(issues[0].issue).toBe('مشكلة في التباين');
  });
});
