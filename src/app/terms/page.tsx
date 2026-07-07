import type { Metadata } from 'next';
import LegalDocumentPage from '@/components/legal/LegalDocumentPage';
import { CGU } from '@/lib/legal/cgu';

export const metadata: Metadata = {
  title: "Conditions générales d'utilisation | Sama Naffa",
  description:
    "Conditions générales d'utilisation du service Sama Naffa — EVEREST Finance SA. Version 1.0, en vigueur à compter du 01/06/2026.",
};

export default function TermsPage() {
  return (
    <LegalDocumentPage
      document={CGU}
      relatedLinks={[
        { href: '/privacy', label: 'Politique de confidentialité' },
        { href: '/cookies', label: 'Politique cookies' },
        { href: '/privacy#mentions-legales', label: 'Mentions légales' },
      ]}
    />
  );
}
