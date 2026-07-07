import Link from 'next/link';
import type { LegalDocument, LegalSection } from '@/lib/legal/types';

function SectionContent({ section }: { section: LegalSection }) {
  switch (section.type) {
    case 'heading':
      return (
        <h2 className="text-xl font-semibold text-night mt-10 mb-4 first:mt-0">
          {section.text}
        </h2>
      );
    case 'paragraph':
      return (
        <p className="text-night/80 leading-relaxed mb-4 text-justify">{section.text}</p>
      );
    case 'list':
      return (
        <ul className="list-disc pl-6 mb-4 space-y-2 text-night/80 text-justify">
          {section.items.map((item) => (
            <li key={item} className="leading-relaxed text-justify">
              {item}
            </li>
          ))}
        </ul>
      );
    case 'table':
      return (
        <div className="overflow-x-auto mb-6">
          <table className="w-full text-sm border border-timberwolf/40 rounded-lg">
            <thead>
              <tr className="bg-timberwolf/20">
                {section.headers.map((header) => (
                  <th
                    key={header}
                    className="text-left p-3 font-semibold text-night border-b border-timberwolf/40"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {section.rows.map((row) => (
                <tr key={row.join('|')} className="border-b border-timberwolf/20 last:border-0">
                  {row.map((cell, i) => (
                    <td key={`${row[0]}-${i}`} className="p-3 text-night/80 align-top text-justify">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    default:
      return null;
  }
}

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
    <main className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-6 py-16 sm:py-24">
        <h1 className="text-3xl sm:text-4xl font-light text-night mb-3">
          {document.title}
        </h1>
        {document.subtitle && (
          <p className="text-night/60 mb-10 text-justify">{document.subtitle}</p>
        )}

        {document.sections.map((section, index) => (
          <SectionContent key={`${section.type}-${index}`} section={section} />
        ))}

        {extraDocuments.map(({ id, document: extra }) => (
          <section key={id} id={id} className="mt-16 pt-10 border-t border-timberwolf/30">
            <h2 className="text-2xl font-light text-night mb-3">{extra.title}</h2>
            {extra.subtitle && (
              <p className="text-night/60 mb-8 text-justify">{extra.subtitle}</p>
            )}
            {extra.sections.map((section, index) => (
              <SectionContent key={`${id}-${section.type}-${index}`} section={section} />
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
