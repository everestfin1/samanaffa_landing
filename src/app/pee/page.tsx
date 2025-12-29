import { Metadata } from 'next';
import Script from "next/script";
import PEE from '@/components/PEE/PEE';

export const metadata: Metadata = {
  title: 'Plan Épargne Éducation (PEE) | EVEREST Finance',
  description: 'Préparez dès aujourd’hui l’avenir scolaire de vos enfants. Épargne progressive dès 30 000 FCFA/mois avec un rendement attractif à partir de 4,5%.',
  openGraph: {
    title: 'Plan Épargne Éducation (PEE) | EVEREST Finance',
    description: 'Assurez l\'avenir de vos enfants avec le PEE. Épargne sécurisée et rentable.',
    images: [
      {
        url: '/pee/Banniere_PEE_3.png',
        width: 1200,
        height: 630,
        alt: 'Bannière PEE Everest Finance',
      },
    ],
  },
  icons: {
    icon: '/logo-everest.png', 
  }
};

export default function PEEPage() {
  return (
    <>
      {/* Google Analytics - PEE Only */}
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-71C611KYZZ"
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-71C611KYZZ');
        `}
      </Script>
      <PEE />
    </>
  );
}
