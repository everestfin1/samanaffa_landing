import { describe, expect, it } from 'vitest';
import {
  readSessionVersionFromProfile,
  resolveSessionVersion,
  resolveSessionVersionForBump,
} from '@/lib/auth-session';

describe('auth-session', () => {
  it('resolveSessionVersion prefers dedicated column', () => {
    expect(resolveSessionVersion(3, { sessionVersion: 9 })).toBe(3);
    expect(resolveSessionVersion(null, { sessionVersion: 9 })).toBe(9);
  });

  it('resolveSessionVersionForBump uses max of column and legacy JSON', () => {
    expect(resolveSessionVersionForBump(2, { sessionVersion: 5 })).toBe(5);
    expect(resolveSessionVersionForBump(7, { sessionVersion: 3 })).toBe(7);
    expect(resolveSessionVersionForBump(0, {})).toBe(0);
  });

  it('readSessionVersionFromProfile returns 0 when missing', () => {
    expect(readSessionVersionFromProfile(null)).toBe(0);
    expect(readSessionVersionFromProfile({ foo: 1 })).toBe(0);
  });
});
