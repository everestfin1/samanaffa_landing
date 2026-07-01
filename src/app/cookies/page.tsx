import type { Metadata } from 'next';
import LegalDocumentPage from '@/components/legal/LegalDocumentPage';
import { COOKIE_POLICY } from '@/lib/legal/cookie-policy';

export const metadata: Metadata = {
  title: 'Politique cookies | Sama Naffa',
  description:
    'Politique relative aux cookies et autres traceurs — Sama Naffa, EVEREST Finance SA.',
};

export default function CookiesPage() {
  return (
    <LegalDocumentPage
      document={COOKIE_POLICY}
      relatedLinks={[
        { href: '/privacy', label: 'Politique de confidentialité' },
        { href: '/terms', label: "Conditions générales d'utilisation" },
      ]}
    />
  );
}
