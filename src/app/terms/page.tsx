import type { Metadata } from 'next';
import LegalDocumentPage from '@/components/legal/LegalDocumentPage';
import {
  MANDATE_TERMS_SECTIONS,
  MANDATE_TERMS_TITLE,
} from '@/lib/mandate-terms-content';
import type { LegalDocument } from '@/lib/legal/types';

export const metadata: Metadata = {
  title: "Conditions générales | Sama Naffa",
  description:
    "Conditions générales d'ouverture et d'utilisation du service Sama Naffa — mandat de gestion.",
};

const TERMS_DOCUMENT: LegalDocument = {
  title: MANDATE_TERMS_TITLE,
  subtitle: 'EVEREST Finance SA — société agréée AMF-UMOA n° SGI/2016-01',
  sections: MANDATE_TERMS_SECTIONS.flatMap((section) => [
    { type: 'heading' as const, text: section.heading },
    { type: 'paragraph' as const, text: section.body },
  ]),
};

export default function TermsPage() {
  return (
    <LegalDocumentPage
      document={TERMS_DOCUMENT}
      relatedLinks={[
        { href: '/privacy', label: 'Politique de confidentialité' },
        { href: '/cookies', label: 'Politique cookies' },
        { href: '/privacy#mentions-legales', label: 'Mentions légales' },
      ]}
    />
  );
}
