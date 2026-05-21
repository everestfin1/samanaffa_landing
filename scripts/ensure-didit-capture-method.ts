/**
 * One-off: set Didit webhook capture_method so desktop browsers can use webcam
 * instead of QR-only handoff. Requires DIDIT_API_KEY in env.
 *
 * Usage: bunx tsx scripts/ensure-didit-capture-method.ts
 */
import { config } from 'dotenv';

config({ path: '.env.local' });
config();
import { ensureDiditCaptureMethodAllowsDesktop, resetDiditCaptureMethodCache } from '../src/lib/didit-capture-method';

const apiKey = process.env.DIDIT_API_KEY;
if (!apiKey) {
  console.error('DIDIT_API_KEY is required');
  process.exit(1);
}

async function main() {
  resetDiditCaptureMethodCache();
  await ensureDiditCaptureMethodAllowsDesktop(apiKey);

  const res = await fetch('https://verification.didit.me/v3/webhook/', {
    headers: { 'x-api-key': apiKey },
  });
  const config = await res.json();
  console.log('capture_method:', config.capture_method ?? '(unknown)');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
