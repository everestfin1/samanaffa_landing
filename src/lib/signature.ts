import { parseMinioUri } from '@/lib/storage/config';

const MIN_SIGNATURE_DATA_URL_LENGTH = 100;
const SIGNATURE_OBJECT_KEY_PREFIX = 'signatures/';

/** PNG/JPEG data URL from SignaturePad — rejects empty or trivial payloads. */
export function isValidSignatureDataUrl(value: string | null | undefined): boolean {
  if (!value || typeof value !== 'string') return false;
  const trimmed = value.trim();
  if (!trimmed.startsWith('data:image/')) return false;
  if (trimmed.length < MIN_SIGNATURE_DATA_URL_LENGTH) return false;
  return true;
}

export function isStoredSignatureObject(value: string | null | undefined): boolean {
  if (!value || typeof value !== 'string') return false;
  const key = parseMinioUri(value.trim());
  return !!key && key.startsWith(SIGNATURE_OBJECT_KEY_PREFIX);
}

/** Inline data URL (legacy/dev) or object-storage reference (`minio://signatures/...`). */
export function isPersistedSignature(value: string | null | undefined): boolean {
  return isValidSignatureDataUrl(value) || isStoredSignatureObject(value);
}

export function parseSignatureDataUrl(dataUrl: string): {
  buffer: Buffer;
  contentType: string;
} {
  const trimmed = dataUrl.trim();
  const match = /^data:(image\/(?:png|jpeg|jpg));base64,([A-Za-z0-9+/=]+)$/i.exec(trimmed);
  if (!match) {
    throw new Error('Invalid signature data URL');
  }

  const contentType = match[1].toLowerCase() === 'image/jpg' ? 'image/jpeg' : match[1].toLowerCase();
  const buffer = Buffer.from(match[2], 'base64');
  if (buffer.length < 32) {
    throw new Error('Signature image is empty');
  }

  return { buffer, contentType };
}
