'use client';

import { useEffect, useState } from 'react';
import { Analytics } from '@vercel/analytics/next';

const CONSENT_KEY = 'sama-naffa-cookie-consent';

/** Vercel Analytics loads only after explicit cookie consent (S-01). */
export default function ConsentGatedAnalytics() {
  const [consented, setConsented] = useState(false);

  useEffect(() => {
    const check = () => {
      setConsented(localStorage.getItem(CONSENT_KEY) === 'accepted');
    };
    check();
    window.addEventListener('storage', check);
    return () => window.removeEventListener('storage', check);
  }, []);

  if (!consented) return null;
  return <Analytics />;
}
