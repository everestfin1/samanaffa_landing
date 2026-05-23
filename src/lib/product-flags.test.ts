import { describe, expect, it, afterEach } from 'vitest';
import { isApeDeprecated } from '@/lib/product-flags';

describe('product-flags', () => {
  const original = process.env.NEXT_PUBLIC_APE_DEPRECATED;

  afterEach(() => {
    if (original === undefined) {
      delete process.env.NEXT_PUBLIC_APE_DEPRECATED;
    } else {
      process.env.NEXT_PUBLIC_APE_DEPRECATED = original;
    }
  });

  it('isApeDeprecated is false by default', () => {
    delete process.env.NEXT_PUBLIC_APE_DEPRECATED;
    expect(isApeDeprecated()).toBe(false);
  });

  it('isApeDeprecated is true when env is set', () => {
    process.env.NEXT_PUBLIC_APE_DEPRECATED = 'true';
    expect(isApeDeprecated()).toBe(true);
  });
});
