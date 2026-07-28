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
        <h2 className="text-xl font-semibold text-night mt-10 mb-4 first:mt-0">
          {section.text}
        </h2>
      );
    case 'paragraph':
      return isCompact ? (
        <p className="text-xs leading-relaxed text-[#4a4f45] mb-3 text-justify">{section.text}</p>
      ) : (
        <p className="text-night/80 leading-relaxed mb-4 text-justify">{section.text}</p>
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
        <div className={`overflow-x-auto ${isCompact ? 'mb-3' : 'mb-6'}`}>
          <table
            className={`w-full border border-timberwolf/40 rounded-lg ${
              isCompact ? 'text-xs' : 'text-sm'
            }`}
          >
            <thead>
              <tr className="bg-timberwolf/20">
                {section.headers.map((header) => (
                  <th
                    key={header}
                    className="text-left p-2 sm:p-3 font-semibold text-night border-b border-timberwolf/40"
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
                    <td
                      key={`${row[0]}-${i}`}
                      className="p-2 sm:p-3 text-night/80 align-top text-justify"
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
