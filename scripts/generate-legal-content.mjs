#!/usr/bin/env node
/**
 * Generates src/lib/legal/privacy-policy.ts and src/lib/legal/cgu.ts
 * from extracted Word document text files in project_docs/.
 *
 * Run: node scripts/generate-legal-content.mjs
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');

function escapeTs(str) {
  return str.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
}

function formatSection(section, indent = 4) {
  const pad = ' '.repeat(indent);
  switch (section.type) {
    case 'heading':
      return `${pad}{ type: 'heading', text: '${escapeTs(section.text)}' },`;
    case 'paragraph':
      return `${pad}{ type: 'paragraph', text: '${escapeTs(section.text)}' },`;
    case 'list':
      return `${pad}{
${pad}  type: 'list',
${pad}  items: [
${section.items.map((i) => `${pad}    '${escapeTs(i)}',`).join('\n')}
${pad}  ],
${pad}},`;
    case 'table':
      return `${pad}{
${pad}  type: 'table',
${pad}  headers: [${section.headers.map((h) => `'${escapeTs(h)}'`).join(', ')}],
${pad}  rows: [
${section.rows.map((row) => `${pad}    [${row.map((c) => `'${escapeTs(c)}'`).join(', ')}],`).join('\n')}
${pad}  ],
${pad}},`;
    default:
      return '';
  }
}

function formatDocument(name, doc, sourceComment) {
  const sections = doc.sections.map((s) => formatSection(s)).join('\n');
  return `import type { LegalDocument } from './types';

/** Source: ${sourceComment} */
export const ${name}: LegalDocument = {
  title: '${escapeTs(doc.title)}',
  ${doc.subtitle ? `subtitle: '${escapeTs(doc.subtitle)}',` : ''}
  sections: [
${sections}
  ],
};
`;
}

function isTableHeaderLine(line) {
  const headers = [
    'Catégorie',
    'Finalité',
    'Prestataire',
    'Traceur',
    'Opération / Service',
  ];
  return headers.some((h) => line === h || line.startsWith(h));
}

function parseTable(lines, startIndex) {
  const headerLine = lines[startIndex].trim();
  let colCount = 2;
  if (headerLine === 'Catégorie') colCount = 2;
  else if (headerLine === 'Finalité') colCount = 2;
  else if (headerLine === 'Prestataire') colCount = 2;
  else if (headerLine === 'Traceur') colCount = 4;
  else if (headerLine.startsWith('Opération')) colCount = 3;

  const headers = [];
  let i = startIndex;
  for (let c = 0; c < colCount && i < lines.length; c++, i++) {
    headers.push(lines[i].trim());
  }

  const rows = [];
  while (i < lines.length) {
    const row = [];
    for (let c = 0; c < colCount; c++) {
      if (i >= lines.length) break;
      const cell = lines[i].trim();
      if (
        !cell ||
        /^\d+\.\s/.test(cell) ||
        cell === 'Mentions légales' ||
        /^ARTICLE \d+/i.test(cell) ||
        isTableHeaderLine(cell) ||
        cell.startsWith('Données sensibles') ||
        cell.startsWith('Données relatives')
      ) {
        return { table: { type: 'table', headers, rows }, nextIndex: i };
      }
      row.push(cell);
      i++;
    }
    if (row.length === colCount) rows.push(row);
    else break;
  }
  return { table: { type: 'table', headers, rows }, nextIndex: i };
}

function parsePrivacyExtracted(text) {
  const lines = text.split(/\r?\n/).map((l) => l.trim()).filter((l) => l.length > 0);

  const privacy = {
    title: lines[0],
    subtitle: lines[1],
    sections: [],
  };

  let mentionsStart = lines.findIndex((l) => l === 'Mentions légales');
  const privacyLines = lines.slice(2, mentionsStart);
  const mentionsLines = lines.slice(mentionsStart + 1);

  // Intro before section 1
  let i = 0;
  while (i < privacyLines.length && !/^1\.\s/.test(privacyLines[i])) {
    privacy.sections.push({ type: 'paragraph', text: privacyLines[i] });
    i++;
  }

  while (i < privacyLines.length) {
    const line = privacyLines[i];
    const headingMatch = line.match(/^(\d+)\.\s+(.+)$/);
    if (headingMatch) {
      privacy.sections.push({ type: 'heading', text: `${headingMatch[1]}. ${headingMatch[2]}` });
      i++;
      continue;
    }

    if (isTableHeaderLine(line)) {
      const { table, nextIndex } = parseTable(privacyLines, i);
      privacy.sections.push(table);
      i = nextIndex;
      continue;
    }

    if (line.startsWith('–') || line.startsWith('-')) {
      const items = [];
      while (i < privacyLines.length && (privacyLines[i].startsWith('–') || privacyLines[i].startsWith('-'))) {
        items.push(privacyLines[i].replace(/^[–-]\s*/, ''));
        i++;
      }
      privacy.sections.push({ type: 'list', items });
      continue;
    }

    if (/^Données sensibles|^Données relatives|^L'utilisateur peut/.test(line)) {
      privacy.sections.push({ type: 'paragraph', text: line });
      i++;
      continue;
    }

    // paragraph block until next heading/table/list
    const paras = [];
    while (i < privacyLines.length) {
      const l = privacyLines[i];
      if (/^\d+\.\s/.test(l) || isTableHeaderLine(l) || l.startsWith('–') || l.startsWith('-')) break;
      paras.push(l);
      i++;
    }
    if (paras.length) {
      privacy.sections.push({ type: 'paragraph', text: paras.join(' ') });
    }
  }

  const mentions = {
    title: 'Mentions légales',
    subtitle: mentionsLines[0] || 'Application et site SamaNaffa.',
    sections: [],
  };

  i = 1;
  const mentionHeadings = new Set([
    'Éditeur',
    'Directeur de la publication',
    'Hébergement',
    'Activité et régulation',
    'Nature du service et avertissement',
    'Propriété intellectuelle',
    'Protection des données personnelles',
    'Droit applicable',
  ]);

  while (i < mentionsLines.length) {
    const line = mentionsLines[i];
    if (mentionHeadings.has(line)) {
      mentions.sections.push({ type: 'heading', text: line });
      i++;
      const paras = [];
      while (i < mentionsLines.length && !mentionHeadings.has(mentionsLines[i])) {
        paras.push(mentionsLines[i]);
        i++;
      }
      if (paras.length) {
        mentions.sections.push({ type: 'paragraph', text: paras.join(' ') });
      }
      continue;
    }
    i++;
  }

  return { privacy, mentions };
}

function parseCguExtracted(text) {
  const lines = text.split(/\r?\n/).map((l) => l.trim()).filter((l) => l.length > 0);

  const title = "Conditions générales d'utilisation";
  const versionLine = lines.find((l) => l.startsWith('Version ')) || '';
  const subtitle = `Sama Naffa — EVEREST Finance SA. ${versionLine}`;

  const sections = [];
  const operatorLines = [];
  let i = 0;
  while (i < lines.length && !/^ARTICLE \d+/i.test(lines[i])) {
    if (
      !['SAMA NAFFA', "Plateforme d'épargne digitale", 'CONDITIONS GÉNÉRALES D\'UTILISATION', versionLine, 'Opérateur du service'].includes(lines[i]) &&
      lines[i] !== title.toUpperCase() &&
      !lines[i].startsWith('Version ')
    ) {
      operatorLines.push(lines[i]);
    }
    i++;
  }

  if (operatorLines.length) {
    sections.push({ type: 'paragraph', text: operatorLines.join(' — ') });
  }

  while (i < lines.length) {
    const line = lines[i];

    if (/^ARTICLE \d+/i.test(line)) {
      sections.push({ type: 'heading', text: line });
      i++;
      continue;
    }

    if (line.startsWith('Opération / Service')) {
      const { table, nextIndex } = parseTable(lines, i);
      sections.push(table);
      i = nextIndex;
      continue;
    }

    if (/^\d+\.\d+(\.\d+)?\s*-?\s*/.test(line)) {
      sections.push({ type: 'heading', text: line });
      i++;
      continue;
    }

    if (line.startsWith('–') || line.startsWith('-')) {
      const items = [];
      while (i < lines.length && (lines[i].startsWith('–') || lines[i].startsWith('-'))) {
        items.push(lines[i].replace(/^[–-]\s*/, ''));
        i++;
      }
      sections.push({ type: 'list', items });
      continue;
    }

    if (/^Risque |^Court terme|^Moyen|^Très long|^Orange Money|^Wave$|^Free Money|^Fait à/.test(line)) {
      sections.push({ type: 'paragraph', text: line });
      i++;
      continue;
    }

    if (/^\d+\.\s/.test(line) && !/^\d+\.\d+/.test(line)) {
      const items = [];
      while (i < lines.length && /^\d+\.\s/.test(lines[i]) && !/^\d+\.\d+/.test(lines[i])) {
        items.push(lines[i].replace(/^\d+\.\s*/, ''));
        i++;
      }
      sections.push({ type: 'list', items });
      continue;
    }

    const paras = [];
    while (i < lines.length) {
      const l = lines[i];
      if (
        /^ARTICLE \d+/i.test(l) ||
        l.startsWith('Opération / Service') ||
        /^\d+\.\d+/.test(l) ||
        l.startsWith('–') ||
        l.startsWith('-') ||
        (/^\d+\.\s/.test(l) && !/^\d+\.\d+/.test(l)) ||
        /^Fait à/.test(l)
      ) {
        break;
      }
      paras.push(l);
      i++;
    }
    if (paras.length) {
      sections.push({ type: 'paragraph', text: paras.join(' ') });
    } else {
      i++;
    }
  }

  return { title, subtitle, sections };
}

function pickCguSummary(sections) {
  const keywords = [
    'ARTICLE 2',
    'ARTICLE 4',
    'ARTICLE 5',
    'ARTICLE 10',
    'ARTICLE 12',
    'ARTICLE 20',
  ];
  const summary = [];
  for (let i = 0; i < sections.length; i++) {
    const s = sections[i];
    if (s.type === 'heading' && keywords.some((k) => s.text.startsWith(k))) {
      const heading = s.text;
      const bodyParts = [];
      for (let j = i + 1; j < sections.length; j++) {
        const next = sections[j];
        if (next.type === 'heading' && next.text.startsWith('ARTICLE ')) break;
        if (next.type === 'paragraph') {
          bodyParts.push(next.text);
          if (bodyParts.join(' ').length > 400) break;
        }
      }
      summary.push({ heading, body: bodyParts.join(' ').slice(0, 500) });
    }
  }
  return summary;
}

function main() {
  const privacyPath = path.join(
    root,
    'project_docs/Politique de confidentialite et mentions legales (1).extracted.txt',
  );
  const cguPath = path.join(root, 'project_docs/CGU Sama Naffa 24062026 VF.extracted.txt');

  const privacyText = fs.readFileSync(privacyPath, 'utf8');
  const cguText = fs.readFileSync(cguPath, 'utf8');

  const { privacy, mentions } = parsePrivacyExtracted(privacyText);
  const cgu = parseCguExtracted(cguText);
  const summary = pickCguSummary(cgu.sections);

  const privacySections = privacy.sections.map((s) => formatSection(s)).join('\n');
  const mentionsSections = mentions.sections.map((s) => formatSection(s)).join('\n');
  const privacyOut = `import type { LegalDocument } from './types';

/** Source: project_docs/Politique de confidentialite et mentions legales (1).docx */
export const PRIVACY_POLICY: LegalDocument = {
  title: '${escapeTs(privacy.title)}',
  subtitle: '${escapeTs(privacy.subtitle)}',
  sections: [
${privacySections}
  ],
};

export const LEGAL_NOTICES: LegalDocument = {
  title: '${escapeTs(mentions.title)}',
  subtitle: '${escapeTs(mentions.subtitle)}',
  sections: [
${mentionsSections}
  ],
};
`;

  const cguSections = cgu.sections.map((s) => formatSection(s)).join('\n');
  const summaryTs = summary
    .map(
      (s) => `  {
    heading: '${escapeTs(s.heading)}',
    body: '${escapeTs(s.body)}',
  },`,
    )
    .join('\n');

  const cguOut = `import type { LegalDocument } from './types';

/** Source: project_docs/CGU Sama Naffa 24062026 VF.docx */
export const CGU_TITLE = '${escapeTs(cgu.title)}';

export const CGU_VERSION = '${escapeTs(cgu.subtitle)}';

/** Excerpt shown in portal profile completion before full acceptance. */
export const CGU_ACCEPTANCE_SUMMARY: { heading: string; body: string }[] = [
${summaryTs}
];

export const CGU: LegalDocument = {
  title: CGU_TITLE,
  subtitle: '${escapeTs(cgu.subtitle)}',
  sections: [
${cguSections}
  ],
};
`;

  fs.writeFileSync(path.join(root, 'src/lib/legal/privacy-policy.ts'), privacyOut);
  fs.writeFileSync(path.join(root, 'src/lib/legal/cgu.ts'), cguOut);
  console.log('Generated privacy-policy.ts and cgu.ts');
}

main();
