import { describe, expect, it } from 'vitest';
import {
  isOnboardingInProgress,
  readOnboardingProgress,
} from '@/lib/onboarding-progress';
import {
  readSessionVersionFromProfile,
  resolveSessionVersion,
} from '@/lib/auth-session';

describe('readOnboardingProgress', () => {
  it('reads nested onboarding step', () => {
    expect(
      readOnboardingProgress({ onboarding: { step: 'T5', depositAmount: 5000 } }).step,
    ).toBe('T5');
  });
});

describe('isOnboardingInProgress', () => {
  it('is true before T6', () => {
    expect(isOnboardingInProgress({ onboarding: { step: 'T5' } })).toBe(true);
    expect(isOnboardingInProgress(null)).toBe(true);
  });

  it('is false at T6', () => {
    expect(isOnboardingInProgress({ onboarding: { step: 'T6' } })).toBe(false);
  });
});

describe('session version resolution', () => {
  it('prefers dedicated column over JSON', () => {
    expect(resolveSessionVersion(3, { sessionVersion: 1 })).toBe(3);
  });

  it('falls back to investorProfile JSON', () => {
    expect(resolveSessionVersion(null, { sessionVersion: 2 })).toBe(2);
    expect(readSessionVersionFromProfile({ sessionVersion: 2 })).toBe(2);
  });
});
