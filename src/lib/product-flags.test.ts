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

  it('isApeDeprecated is true by default (mono-produit Sama Naffa)', () => {
    delete process.env.NEXT_PUBLIC_APE_DEPRECATED;
    expect(isApeDeprecated()).toBe(true);
  });

  it('isApeDeprecated is false only when explicitly disabled for legacy testing', () => {
    process.env.NEXT_PUBLIC_APE_DEPRECATED = 'false';
    expect(isApeDeprecated()).toBe(false);
  });

  it('isApeDeprecated stays true for any other env value', () => {
    process.env.NEXT_PUBLIC_APE_DEPRECATED = 'true';
    expect(isApeDeprecated()).toBe(true);
  });
});
