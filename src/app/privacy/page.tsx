import type { Metadata } from 'next';
import LegalDocumentPage from '@/components/legal/LegalDocumentPage';
import { LEGAL_NOTICES, PRIVACY_POLICY } from '@/lib/legal/privacy-policy';

export const metadata: Metadata = {
  title: 'Politique de confidentialité | Sama Naffa',
  description:
    'Politique de confidentialité et protection des données personnelles — Sama Naffa, EVEREST Finance SA.',
};

export default function PrivacyPage() {
  return (
    <LegalDocumentPage
      document={PRIVACY_POLICY}
      extraDocuments={[{ id: 'mentions-legales', document: LEGAL_NOTICES }]}
      relatedLinks={[
        { href: '/cookies', label: 'Politique cookies' },
        { href: '/terms', label: "Conditions générales d'utilisation" },
      ]}
    />
  );
}
