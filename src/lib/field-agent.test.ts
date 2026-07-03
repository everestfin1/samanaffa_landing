import { describe, it, expect } from 'vitest';
import { normalizeAgentCode } from '@/lib/field-agent';

describe('normalizeAgentCode', () => {
  it('trims and uppercases', () => {
    expect(normalizeAgentCode('  ag-dakar-01 ')).toBe('AG-DAKAR-01');
  });

  it('leaves already-normalized codes unchanged', () => {
    expect(normalizeAgentCode('AG-THIES-02')).toBe('AG-THIES-02');
  });
});
