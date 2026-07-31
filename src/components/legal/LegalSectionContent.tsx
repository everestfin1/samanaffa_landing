import type { LegalSection } from '@/lib/legal/types';

type LegalSectionContentProps = {
  section: LegalSection;
  variant?: 'page' | 'compact';
};

export default function LegalSectionContent({
  section,
  variant = 'page',
}: LegalSectionContentProps) {
  const isCompact = variant === 'compact';

  switch (section.type) {
    case 'heading':
      return isCompact ? (
        <h4 className="text-sm font-semibold text-[#263A18] mt-4 mb-1.5 first:mt-0">
          {section.text}
        </h4>
      ) : (
        <h2 className="legal-doc__h2">{section.text}</h2>
      );
    case 'paragraph':
      return isCompact ? (
        <p className="text-xs leading-relaxed text-[#4a4f45] mb-3 text-justify">{section.text}</p>
      ) : (
        <p className="legal-doc__p">{section.text}</p>
      );
    case 'lead-paragraph':
      return isCompact ? (
        <p className="text-xs leading-relaxed text-[#4a4f45] mb-3 text-justify">
          <strong className="font-semibold text-[#263A18]">{section.lead}.</strong> {section.text}
        </p>
      ) : (
        <p className="legal-doc__p">
          <strong className="legal-doc__lead">{section.lead}.</strong> {section.text}
        </p>
      );
    case 'list':
      return isCompact ? (
        <ul className="list-disc pl-5 mb-3 space-y-1.5 text-xs text-[#4a4f45] text-justify">
          {section.items.map((item) => (
            <li key={item} className="leading-relaxed text-justify">
              {item}
            </li>
          ))}
        </ul>
      ) : (
        <ul className="legal-doc__list">
          {section.items.map((item) => (
            <li key={item} className="legal-doc__li">
              {item}
            </li>
          ))}
        </ul>
      );
    case 'table':
      return (
        <div className={isCompact ? 'mb-3 overflow-x-auto' : 'legal-doc__table-wrap'}>
          <table
            className={
              isCompact
                ? 'w-full border border-timberwolf/40 rounded-lg text-xs'
                : 'legal-doc__table'
            }
          >
            <thead>
              <tr className={isCompact ? 'bg-timberwolf/20' : undefined}>
                {section.headers.map((header) => (
                  <th
                    key={header}
                    className={
                      isCompact
                        ? 'text-left p-2 sm:p-3 font-semibold text-night border-b border-timberwolf/40'
                        : undefined
                    }
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {section.rows.map((row) => (
                <tr
                  key={row.join('|')}
                  className={isCompact ? 'border-b border-timberwolf/20 last:border-0' : undefined}
                >
                  {row.map((cell, i) => (
                    <td
                      key={`${row[0]}-${i}`}
                      className={
                        isCompact
                          ? 'p-2 sm:p-3 text-night/80 align-top text-justify'
                          : undefined
                      }
                    >
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
