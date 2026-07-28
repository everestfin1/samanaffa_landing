'use client';

import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  ChartBarIcon,
  DocumentTextIcon,
} from '@heroicons/react/24/outline';
import type { C1Account } from '@/components/portal/C1Dashboard';

interface C6Document {
  id: string;
  title: string;
  meta: string;
  kind: 'statement' | 'report';
}

/**
 * Figma catalog kept as visual mock only — see
 * project_docs/03-development/c6-releves-documents-notes.md
 */
const PLACEHOLDER_DOCUMENTS: C6Document[] = [
  {
    id: 'q-2026-06',
    title: 'Relevé trimestriel — juin 2026',
    meta: 'PDF · 210 Ko',
    kind: 'statement',
  },
  {
    id: 'q-2026-05',
    title: 'Relevé trimestriel — mai 2026',
    meta: 'PDF · 205 Ko',
    kind: 'statement',
  },
  {
    id: 'cr-s1-2026',
    title: 'Compte-rendu de gestion — S1 2026',
    meta: 'PDF · 480 Ko',
    kind: 'report',
  },
];

interface C6RelevesProps {
  accounts: C1Account[];
}

function daysUntil(iso: string): number | null {
  const target = new Date(iso);
  if (Number.isNaN(target.getTime())) return null;
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const end = new Date(target.getFullYear(), target.getMonth(), target.getDate());
  return Math.round((end.getTime() - start.getTime()) / 86_400_000);
}

function formatLongDate(iso: string): string {
  return new Date(iso).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export default function C6Releves({ accounts }: C6RelevesProps) {
  const router = useRouter();

  const renewal = useMemo(() => {
    const candidates = accounts
      .map((a) => a.lockedUntil)
      .filter((v): v is string => Boolean(v))
      .map((iso) => ({ iso, days: daysUntil(iso) }))
      .filter((x): x is { iso: string; days: number } => x.days != null && x.days >= 0)
      .sort((a, b) => a.days - b.days);

    const next = candidates[0];
    if (!next || next.days > 45) return null;
    return {
      days: next.days,
      dateLabel: formatLongDate(next.iso),
    };
  }, [accounts]);

  return (
    <div className="c6-shell">
      <button type="button" className="c2-back c6-back" onClick={() => router.back()}>
        ← Retour
      </button>

      <h1 className="c6-title">Relevés & documents</h1>

      {renewal && (
        <aside className="c6-banner" role="status">
          <p className="c6-banner-title">
            {renewal.days === 0
              ? 'Reconduction aujourd’hui'
              : `Reconduction dans ${renewal.days} jour${renewal.days > 1 ? 's' : ''}`}
          </p>
          <p className="c6-banner-body">
            Ton mandat sera reconduit le {renewal.dateLabel}. Un rappel te sera envoyé 5 jours
            avant l’échéance.
          </p>
        </aside>
      )}

      <section className="c6-card c6-card--mocked" aria-label="Aperçu documents (données fictives)">
        <p className="c6-mock-banner">
          Aperçu fictif — les vrais documents apparaîtront ici dès qu’ils seront disponibles.
        </p>
        <ul className="c6-list c6-list--mocked">
          {PLACEHOLDER_DOCUMENTS.map((doc) => {
            const Icon = doc.kind === 'report' ? ChartBarIcon : DocumentTextIcon;
            return (
              <li key={doc.id} className="c6-row">
                <div className="c6-row-left">
                  <span className="c6-doc-icon" aria-hidden>
                    <Icon className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="c6-doc-title">
                      {doc.title}
                      <span className="c6-mock-badge">Exemple</span>
                    </p>
                    <p className="c6-doc-meta">{doc.meta}</p>
                  </div>
                </div>
                <span className="c6-download c6-download--muted">Télécharger</span>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}
