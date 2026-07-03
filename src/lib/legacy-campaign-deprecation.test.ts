import { describe, expect, it, afterEach } from 'vitest';
import {
  guardLegacyCampaignApi,
  isLegacyCampaignDeprecated,
  matchesPathPrefix,
  LEGACY_API_PATH_PREFIXES,
  LEGACY_PUBLIC_PATH_PREFIXES,
} from '@/lib/legacy-campaign-deprecation';

describe('legacy-campaign-deprecation', () => {
  const original = process.env.NEXT_PUBLIC_APE_DEPRECATED;

  afterEach(() => {
    if (original === undefined) {
      delete process.env.NEXT_PUBLIC_APE_DEPRECATED;
    } else {
      process.env.NEXT_PUBLIC_APE_DEPRECATED = original;
    }
  });

  it('isLegacyCampaignDeprecated is true by default', () => {
    delete process.env.NEXT_PUBLIC_APE_DEPRECATED;
    expect(isLegacyCampaignDeprecated()).toBe(true);
  });

  it('guardLegacyCampaignApi returns 410 when deprecated', async () => {
    delete process.env.NEXT_PUBLIC_APE_DEPRECATED;
    const res = guardLegacyCampaignApi();
    expect(res?.status).toBe(410);
  });

  it('matches legacy public and API prefixes', () => {
    expect(matchesPathPrefix('/pee', LEGACY_PUBLIC_PATH_PREFIXES)).toBe(true);
    expect(matchesPathPrefix('/api/ape/subscribe', LEGACY_API_PATH_PREFIXES)).toBe(true);
    expect(matchesPathPrefix('/sama-naffa', LEGACY_PUBLIC_PATH_PREFIXES)).toBe(false);
  });
});
