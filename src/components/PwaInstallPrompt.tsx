'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import type { PWAInstallElement } from '@khmyznikov/pwa-install';

const HIDDEN_PREFIXES = ['/admin', '/maintenance'];

const FR_INSTALL_DESCRIPTION =
  'Ajoutez Sama Naffa à votre écran d’accueil pour un accès rapide, comme une application.';

/**
 * French PWA install dialog (Android install + iOS “Ajouter à l’écran d’accueil” guide).
 * Built-in FR strings activate when the browser language is French (typical for SN clients).
 */
export default function PwaInstallPrompt() {
  const pathname = usePathname();
  const ref = useRef<PWAInstallElement | null>(null);
  const hidden = HIDDEN_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );

  useEffect(() => {
    if (hidden) return;

    let cancelled = false;

    void import('@khmyznikov/pwa-install').then(() => {
      if (cancelled || !ref.current) return;
      ref.current.styles = { '--tint-color': '#c4972f' };
      ref.current.installDescription = FR_INSTALL_DESCRIPTION;
      ref.current.useLocalStorage = true;
      ref.current.manifestUrl = '/manifest.json';
    });

    return () => {
      cancelled = true;
    };
  }, [hidden]);

  if (hidden) return null;

  return (
    <pwa-install
      ref={ref}
      manifest-url="/manifest.json"
      use-local-storage=""
      install-description={FR_INSTALL_DESCRIPTION}
    />
  );
}
