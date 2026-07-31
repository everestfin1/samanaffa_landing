import type { Metadata } from 'next';
import LegalDocumentPage from '@/components/legal/LegalDocumentPage';
import { CCU } from '@/lib/legal/ccu';

export const metadata: Metadata = {
  title: 'Convention-Cadre Utilisateur (CCU) | Sama Naffa',
  description:
    'Convention-Cadre Utilisateur de Sama Naffa — EVEREST Finance SA. Version projet 21/07/2026 (en revue juridique).',
};

export default function TermsPage() {
  return (
    <LegalDocumentPage
      document={CCU}
      relatedLinks={[
        { href: '/privacy', label: 'Politique de confidentialité' },
        { href: '/cookies', label: 'Politique cookies' },
        { href: '/privacy#mentions-legales', label: 'Mentions légales' },
      ]}
    />
  );
}
