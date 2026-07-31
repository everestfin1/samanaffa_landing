import Link from 'next/link';
import type { LegalDocument } from '@/lib/legal/types';
import LegalSectionContent from './LegalSectionContent';

type LegalDocumentPageProps = {
  document: LegalDocument;
  extraDocuments?: { id: string; document: LegalDocument }[];
  relatedLinks?: { href: string; label: string }[];
};

export default function LegalDocumentPage({
  document,
  extraDocuments = [],
  relatedLinks = [],
}: LegalDocumentPageProps) {
  return (
    <main className="legal-doc">
      <div className="legal-doc__inner">
        <h1 className="legal-doc__title">{document.title}</h1>
        {document.subtitle && (
          <p className="legal-doc__subtitle">{document.subtitle}</p>
        )}

        {document.sections.map((section, index) => (
          <LegalSectionContent key={`${section.type}-${index}`} section={section} />
        ))}

        {extraDocuments.map(({ id, document: extra }) => (
          <section key={id} id={id} className="legal-doc__extra">
            <h2 className="legal-doc__h2">{extra.title}</h2>
            {extra.subtitle && (
              <p className="legal-doc__subtitle">{extra.subtitle}</p>
            )}
            {extra.sections.map((section, index) => (
              <LegalSectionContent
                key={`${id}-${section.type}-${index}`}
                section={section}
              />
            ))}
          </section>
        ))}

        {relatedLinks.length > 0 && (
          <nav className="legal-doc__related" aria-label="Documents liés">
            {relatedLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                {link.label}
              </Link>
            ))}
          </nav>
        )}
      </div>
    </main>
  );
}
