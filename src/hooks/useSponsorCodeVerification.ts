'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { normalizeSponsorCode } from '@/lib/sponsor-code-utils';

export type SponsorCodeStatus = 'idle' | 'verifying' | 'valid' | 'invalid';

export function useSponsorCodeVerification(initialCode = '') {
  const [code, setCode] = useState(initialCode ? normalizeSponsorCode(initialCode) : '');
  const [status, setStatus] = useState<SponsorCodeStatus>('idle');
  const [message, setMessage] = useState('');
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const verify = useCallback(async (raw: string) => {
    const normalized = normalizeSponsorCode(raw);
    if (!normalized || normalized.length < 3) {
      setStatus('idle');
      setMessage('');
      return;
    }

    setStatus('verifying');
    setMessage('');

    try {
      const response = await fetch('/api/ape/verify-sponsor-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: normalized }),
      });
      const data = await response.json();

      if (data.valid) {
        setStatus('valid');
        setMessage(data.message || 'Code valide');
      } else {
        setStatus('invalid');
        setMessage(data.error || 'Code invalide');
      }
    } catch {
      setStatus('invalid');
      setMessage('Erreur de vérification');
    }
  }, []);

  const handleChange = useCallback(
    (value: string) => {
      const upperValue = normalizeSponsorCode(value);
      setCode(upperValue);

      if (timeoutRef.current) clearTimeout(timeoutRef.current);

      if (!upperValue || upperValue.length < 3) {
        setStatus('idle');
        setMessage('');
        return;
      }

      timeoutRef.current = setTimeout(() => {
        void verify(upperValue);
      }, 500);
    },
    [verify],
  );

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const canProceedWithCode =
    status === 'idle' || status === 'valid' || !code.trim();

  const reset = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setCode('');
    setStatus('idle');
    setMessage('');
  }, []);

  return {
    code,
    status,
    message,
    setCode,
    handleChange,
    verify,
    reset,
    canProceedWithCode,
  };
}
