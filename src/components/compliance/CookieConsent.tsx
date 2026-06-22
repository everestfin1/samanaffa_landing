'use client';

import { useEffect, useState } from 'react';
import Script from 'next/script';

const CONSENT_KEY = 'sama-naffa-cookie-consent';

export default function CookieConsent() {
  const [consent, setConsent] = useState<'pending' | 'accepted' | 'declined'>('pending');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem(CONSENT_KEY);
    if (stored === 'accepted') {
      setConsent('accepted');
    } else if (stored === 'declined') {
      setConsent('declined');
    }
  }, []);

  const accept = () => {
    localStorage.setItem(CONSENT_KEY, 'accepted');
    setConsent('accepted');
  };

  const decline = () => {
    localStorage.setItem(CONSENT_KEY, 'declined');
    setConsent('declined');
  };

  if (!mounted) return null;

  return (
    <>
      {consent === 'accepted' && (
        <>
          <Script id="google-tag-manager" strategy="afterInteractive">
            {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-W9GHF4S2');`}
          </Script>
          <Script id="facebook-pixel" strategy="afterInteractive">
            {`
              !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '2209795136215271');
              fbq('track', 'PageView');
            `}
          </Script>
        </>
      )}

      {consent === 'pending' && (
        <div
          className="fixed bottom-0 inset-x-0 z-[100] p-4 sm:p-6"
          role="dialog"
          aria-label="Consentement cookies"
        >
          <div className="max-w-3xl mx-auto bg-white border border-timberwolf/30 rounded-2xl shadow-xl p-5 sm:p-6">
            <p className="text-sm text-night/80 leading-relaxed mb-4">
              Nous utilisons des cookies et traceurs (Google Analytics, Meta Pixel) pour
              mesurer l&apos;audience du site. Vous pouvez accepter ou refuser leur
              utilisation.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
              <button
                type="button"
                onClick={decline}
                className="px-5 py-2.5 rounded-lg border border-timberwolf/40 text-night/70 text-sm font-medium hover:bg-timberwolf/10 transition-colors"
              >
                Refuser
              </button>
              <button
                type="button"
                onClick={accept}
                className="px-5 py-2.5 rounded-lg bg-[#435933] text-white text-sm font-semibold hover:bg-[#364529] transition-colors"
              >
                Accepter
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
