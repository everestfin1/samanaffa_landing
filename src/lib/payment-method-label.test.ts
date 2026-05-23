import { describe, expect, it } from 'vitest';
import {
  getPaymentMethodDisplayLabel,
  isLegacyWalletPaymentMethod,
} from '@/lib/payment-method-label';

describe('payment-method-label', () => {
  it('maps known wallet ids to French labels', () => {
    expect(getPaymentMethodDisplayLabel('intouch')).toBe('Intouch');
    expect(getPaymentMethodDisplayLabel('orange_money')).toBe('Orange Money');
    expect(getPaymentMethodDisplayLabel('wave')).toBe('Wave');
  });

  it('detects legacy wallet payment methods', () => {
    expect(isLegacyWalletPaymentMethod('orange_money')).toBe(true);
    expect(isLegacyWalletPaymentMethod('intouch')).toBe(false);
  });
});
