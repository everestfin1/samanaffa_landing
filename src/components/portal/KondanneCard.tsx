'use client';

import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import type { C1Account } from '@/components/portal/C1Dashboard';
import { kondanneCardColor } from '@/lib/kondanne-card-colors';

export function formatKondanneAnniversary(account: C1Account): string | null {
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

interface KondanneCardProps {
  account: C1Account;
  accounts: C1Account[];
  hidden?: boolean;
  onToggleBalance?: () => void;
  onClick: () => void;
}

export default function KondanneCard({
  account,
  accounts,
  hidden = false,
  onToggleBalance,
  onClick,
}: KondanneCardProps) {
  const dateLabel = formatKondanneAnniversary(account);
  const name = account.productName?.trim() || 'Mon Kondanné';

  return (
    <div
      role="link"
      tabIndex={0}
      className="c2-card"
      style={{ backgroundColor: kondanneCardColor(account.id, accounts) }}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
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
        {onToggleBalance && (
          <button
            type="button"
            className="c2-card-eye"
            aria-label={hidden ? 'Afficher le solde' : 'Masquer le solde'}
            onClick={(e) => {
              e.stopPropagation();
              onToggleBalance();
            }}
          >
            {hidden ? (
              <EyeSlashIcon className="h-5 w-5" />
            ) : (
              <EyeIcon className="h-5 w-5" />
            )}
          </button>
        )}
        {dateLabel && <span className="c2-card-date">{dateLabel}</span>}
      </div>
    </div>
  );
}
