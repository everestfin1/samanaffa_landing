'use client';

import type { VerificationResult } from '@didit-protocol/sdk-web';

export async function openDiditSdkVerification(
  verificationUrl: string,
  onComplete: (result: VerificationResult) => void,
): Promise<void> {
  const { DiditSdk } = await import('@didit-protocol/sdk-web');
  DiditSdk.shared.onComplete = onComplete;
  await DiditSdk.shared.startVerification({
    url: verificationUrl,
    configuration: {
      closeModalOnComplete: true,
      loggingEnabled: process.env.NODE_ENV === 'development',
    },
  });
}

export async function closeDiditSdkModal(): Promise<void> {
  try {
    const { DiditSdk } = await import('@didit-protocol/sdk-web');
    if (DiditSdk.shared.isPresented) {
      DiditSdk.shared.close();
    }
  } catch {
    // SDK not loaded yet
  }
}
