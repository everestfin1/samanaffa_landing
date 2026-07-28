'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import type { C1Account } from '@/components/portal/C1Dashboard';

const CARD_COLORS = [
  '#344425', // match C1 balance card
  '#2e4620',
  '#707c33',
  '#ae8103',
  '#c4874a',
  '#8a5a2b',
] as const;

const SLUG_COLOR: Record<string, string> = {
  maison: '#344425',
  etudes: '#344425',
  education: '#344425',
  business: '#344425',
  voyage: '#344425',
  autres: '#344425',
  reve: '#344425',
  rêve: '#344425',
};

function readMetaString(
  meta: Record<string, unknown> | null | undefined,
  key: string,
): string | null {
  if (!meta || !(key in meta)) return null;
  const v = meta[key];
  return typeof v === 'string' && v.trim() ? v.trim() : null;
}

function colorForAccount(_account: C1Account, _index: number): string {
  return '#344425';
}

function formatAnniversary(account: C1Account): string | null {
  const locked = account.lockedUntil ? new Date(account.lockedUntil) : null;
  if (locked && !Number.isNaN(locked.getTime())) {
    return locked.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  }
  const created = new Date(account.createdAt);
  if (Number.isNaN(created.getTime())) return null;
  const next = new Date(created);
  next.setFullYear(next.getFullYear() + 1);
  return next.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

interface C2KondanneListProps {
  accounts: C1Account[];
}

export default function C2KondanneList({ accounts }: C2KondanneListProps) {
  const router = useRouter();
  const [hiddenIds, setHiddenIds] = useState<Record<string, boolean>>({});

  const toggleBalance = (id: string) => {
    setHiddenIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="c2-shell">
      <div className="c2-main">
        <button
          type="button"
          className="c2-back"
          onClick={() => router.push('/portal/dashboard')}
        >
          ← Retour
        </button>

        <h1 className="c2-title">Mes Kondannés</h1>

        {accounts.length === 0 ? (
          <div className="c2-empty">
            <p>Aucun Kondanné pour le moment.</p>
            <button
              type="button"
              className="c1-create"
              onClick={() => router.push('/portal/sama-naffa/creer')}
            >
              + Créer un Kondanné
            </button>
          </div>
        ) : (
          <ul className="c2-list">
            {accounts.map((account, index) => {
              const hidden = Boolean(hiddenIds[account.id]);
              const dateLabel = formatAnniversary(account);
              const name = account.productName?.trim() || 'Mon Kondanné';
              return (
                <li key={account.id}>
                  <div
                    role="link"
                    tabIndex={0}
                    className="c2-card"
                    style={{ backgroundColor: colorForAccount(account, index) }}
                    onClick={() => router.push(`/portal/sama-naffa/${account.id}`)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        router.push(`/portal/sama-naffa/${account.id}`);
                      }
                    }}
                  >
                    <p className="c2-card-name">{name}</p>
                    <div className="c2-card-row">
                      <p className="c2-card-balance">
                        {hidden ? (
                          <span className="c2-card-amount">••••••••</span>
                        ) : (
                          <>
                            <span className="c2-card-amount">
                              {Math.round(account.balance).toLocaleString('fr-FR')}
                            </span>{' '}
                            <span className="c2-card-currency">FCFA</span>
                          </>
                        )}
                      </p>
                      <button
                        type="button"
                        className="c2-card-eye"
                        aria-label={hidden ? 'Afficher le solde' : 'Masquer le solde'}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleBalance(account.id);
                        }}
                      >
                        {hidden ? (
                          <EyeSlashIcon className="h-5 w-5" />
                        ) : (
                          <EyeIcon className="h-5 w-5" />
                        )}
                      </button>
                      {dateLabel && (
                        <span className="c2-card-date">{dateLabel}</span>
                      )}
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
