'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { C1Account } from '@/components/portal/C1Dashboard';
import KondanneCard from '@/components/portal/KondanneCard';
import { sortAccountsByCreation } from '@/lib/kondanne-card-colors';

interface C2KondanneListProps {
  accounts: C1Account[];
}

export default function C2KondanneList({ accounts }: C2KondanneListProps) {
  const router = useRouter();
  const [hiddenIds, setHiddenIds] = useState<Record<string, boolean>>({});
  const orderedAccounts = sortAccountsByCreation(accounts);

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
            {orderedAccounts.map((account) => (
              <li key={account.id}>
                <KondanneCard
                  account={account}
                  accounts={accounts}
                  hidden={Boolean(hiddenIds[account.id])}
                  onToggleBalance={() => toggleBalance(account.id)}
                  onClick={() => router.push(`/portal/sama-naffa/${account.id}`)}
                />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
