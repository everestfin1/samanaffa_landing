import Link from 'next/link';
import type { LegalDocument } from '@/lib/legal/types';
import LegalSectionContent from './LegalSectionContent';

type LegalDocumentPageProps = {
  document: LegalDocument;
  extraDocuments?: { id: string; document: LegalDocument }[];
  relatedLinks?: { href: string; label: string }[];
  /** Staging/dev draft notice — shown above the title when set. */
  draftBanner?: string;
};

export default function LegalDocumentPage({
  document,
  extraDocuments = [],
  relatedLinks = [],
  draftBanner,
}: LegalDocumentPageProps) {
  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-6 py-16 sm:py-24">
        {draftBanner ? (
          <p
            role="status"
            className="mb-8 rounded-lg border border-amber-300/80 bg-amber-50 px-4 py-3 text-sm text-amber-950"
          >
            {draftBanner}
          </p>
        ) : null}
        <h1 className="text-3xl sm:text-4xl font-light text-night mb-3">
          {document.title}
        </h1>
        {document.subtitle && (
          <p className="text-night/60 mb-10 text-justify">{document.subtitle}</p>
        )}

        {document.sections.map((section, index) => (
          <LegalSectionContent key={`${section.type}-${index}`} section={section} />
        ))}

        {extraDocuments.map(({ id, document: extra }) => (
          <section key={id} id={id} className="mt-16 pt-10 border-t border-timberwolf/30">
            <h2 className="text-2xl font-light text-night mb-3">{extra.title}</h2>
            {extra.subtitle && (
              <p className="text-night/60 mb-8 text-justify">{extra.subtitle}</p>
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
          <nav className="mt-12 pt-8 border-t border-timberwolf/30 flex flex-wrap gap-4 text-sm">
            {relatedLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-[#435933] hover:underline font-medium"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        )}
      </div>
    </main>
  );
}
