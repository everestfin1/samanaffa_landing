import { describe, expect, it } from 'vitest';
import { parseMinioUri } from './storage/config';
import {
  isPersistedSignature,
  isStoredSignatureObject,
  isValidSignatureDataUrl,
  parseSignatureDataUrl,
} from './signature';

describe('isValidSignatureDataUrl', () => {
  it('rejects empty and invalid values', () => {
    expect(isValidSignatureDataUrl(null)).toBe(false);
    expect(isValidSignatureDataUrl('')).toBe(false);
    expect(isValidSignatureDataUrl('not-an-image')).toBe(false);
    expect(isValidSignatureDataUrl('data:image/png;base64,abc')).toBe(false);
  });

  it('accepts a realistic PNG data URL', () => {
    const sample =
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==';
    expect(isValidSignatureDataUrl(sample)).toBe(true);
  });
});

describe('isPersistedSignature', () => {
  it('accepts inline data URLs and object storage references', () => {
    const sample =
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==';
    expect(isPersistedSignature(sample)).toBe(true);
    expect(isPersistedSignature('minio://signatures/user-1/mandate.png')).toBe(true);
    expect(isPersistedSignature('minio://didit/user/x.jpg')).toBe(false);
  });
});

describe('parseSignatureDataUrl', () => {
  it('decodes PNG data URLs', () => {
    const sample =
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==';
    const { buffer, contentType } = parseSignatureDataUrl(sample);
    expect(contentType).toBe('image/png');
    expect(buffer.length).toBeGreaterThan(0);
  });
});

describe('isStoredSignatureObject', () => {
  it('detects mandate object keys', () => {
    expect(isStoredSignatureObject('minio://signatures/abc/mandate.png')).toBe(true);
    expect(parseMinioUri('minio://signatures/abc/mandate.png')).toBe('signatures/abc/mandate.png');
  });
});
