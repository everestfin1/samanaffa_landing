'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import type { C1Account } from '@/components/portal/C1Dashboard';
import { kondanneCardColor } from '@/lib/kondanne-card-colors';
import { formatCurrency } from '@/lib/utils';
import { calculerCapitalFinal, tauxParDuree } from '@/lib/savings-simulation';

type KYCStatus = 'PENDING' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED';

interface C2Transaction {
  id: string;
  intentType?: string;
  type?: string;
  amount: number;
  status: string;
  createdAt: string;
}

interface C2KondanneDetailProps {
  account: C1Account;
  accounts: C1Account[];
  kycStatus: KYCStatus;
}

function readMetaNumber(meta: Record<string, unknown> | null | undefined, key: string): number | null {
  if (!meta || !(key in meta)) return null;
  const n = Number(meta[key]);
  return Number.isFinite(n) && n > 0 ? n : null;
}

function formatHistoryDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return '';
  }
}

function formatEcheance(account: C1Account): string {
  if (account.lockedUntil) {
    const d = new Date(account.lockedUntil);
    if (!Number.isNaN(d.getTime())) {
      return d.toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
    }
  }
  const created = new Date(account.createdAt);
  if (Number.isNaN(created.getTime())) return '—';
  const months =
    readMetaNumber(account.metadata ?? undefined, 'durationMonths') ??
    account.lockPeriodMonths ??
    12;
  const end = new Date(created);
  end.setMonth(end.getMonth() + months);
  return end.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

function historyTitle(tx: C2Transaction): string {
  const t = String(tx.type || tx.intentType || '').toUpperCase();
  if (t.includes('WITHDRAW')) return 'Retrait';
  if (t.includes('INVEST') || t.includes('REVAL') || t.includes('INTEREST')) {
    return 'Réévaluation';
  }
  return 'Versement';
}

export default function C2KondanneDetail({ account, accounts }: C2KondanneDetailProps) {
  const router = useRouter();
  const [showBalance, setShowBalance] = useState(true);
  const [transactions, setTransactions] = useState<C2Transaction[]>([]);
  const [isLoadingTx, setIsLoadingTx] = useState(true);

  const meta = account.metadata ?? undefined;
  const monthlyAmount = readMetaNumber(meta, 'monthlyAmount');
  const durationMonths =
    readMetaNumber(meta, 'durationMonths') ??
    (account.lockPeriodMonths && account.lockPeriodMonths > 0
      ? account.lockPeriodMonths
      : null);

  const expectedReturn = useMemo(() => {
    if (!monthlyAmount || !durationMonths) return null;
    const rate = tauxParDuree(durationMonths);
    return calculerCapitalFinal(monthlyAmount, durationMonths, rate).interets;
  }, [monthlyAmount, durationMonths]);

  const totalDeposited = useMemo(() => {
    const completedDeposits = transactions.filter((tx) => {
      const t = String(tx.type || tx.intentType || '').toUpperCase();
      const s = tx.status.toUpperCase();
      return (
        t.includes('DEPOSIT') &&
        (s === 'COMPLETED' || s === 'SUCCESS' || s === 'PAID')
      );
    });
    if (completedDeposits.length > 0) {
      return completedDeposits.reduce((sum, tx) => sum + (Number(tx.amount) || 0), 0);
    }
    return account.balance > 0 ? account.balance : null;
  }, [transactions, account.balance]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setIsLoadingTx(true);
      try {
        const res = await fetch(
          `/api/transactions/intent?accountId=${encodeURIComponent(account.id)}&limit=20`,
        );
        if (!res.ok || cancelled) return;
        const data = await res.json();
        if (!cancelled) {
          setTransactions(data.transactionIntents || []);
        }
      } catch {
        if (!cancelled) setTransactions([]);
      } finally {
        if (!cancelled) setIsLoadingTx(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [account.id]);

  const name = account.productName?.trim() || 'Mon Kondanné';

  return (
    <div className="c1-shell">
      <div className="c2-detail-main">
        <button
          type="button"
          className="c2-back"
          onClick={() => router.push('/portal/sama-naffa')}
        >
          ← Mes Kondannés
        </button>

        <h1 className="c2-title">{name}</h1>

        <div className="c2-detail-hero">
          <section
            className="c1-balance c2-detail-balance"
            aria-label={`Solde ${name}`}
            style={{ backgroundColor: kondanneCardColor(account.id, accounts) }}
          >
            <div className="c1-balance-top">
              <p className="c1-balance-label">{name}</p>
              <Image
                src="/sama_naffa_logo.png"
                alt=""
                width={76}
                height={42}
                className="c1-balance-logo"
              />
            </div>
            <div className="c1-balance-amount-row">
              <p className="c1-balance-amount">
                {showBalance ? (
                  <>
                    <span className="c1-balance-number">
                      {Math.round(account.balance).toLocaleString('fr-FR')}
                    </span>{' '}
                    <span className="c1-balance-currency">FCFA</span>
                  </>
                ) : (
                  <span className="c1-balance-number">••••••••</span>
                )}
              </p>
              <button
                type="button"
                className="c1-eye"
                onClick={() => setShowBalance((v) => !v)}
                aria-label={showBalance ? 'Masquer le solde' : 'Afficher le solde'}
              >
                {showBalance ? (
                  <EyeIcon className="h-5 w-5" />
                ) : (
                  <EyeSlashIcon className="h-5 w-5" />
                )}
              </button>
            </div>
          </section>

          <div className="c2-stats">
            <div className="c2-stat">
              <p className="c2-stat-label">Total versé</p>
              <p className="c2-stat-value">
                {totalDeposited != null ? formatCurrency(totalDeposited) : '—'}
              </p>
            </div>
            <div className="c2-stat">
              <p className="c2-stat-label">Horizon</p>
              <p className="c2-stat-value">
                {durationMonths != null ? `${Math.round(durationMonths)} mois` : '—'}
              </p>
            </div>
            <div className="c2-stat">
              <p className="c2-stat-label">Échéance</p>
              <p className="c2-stat-value">{formatEcheance(account)}</p>
            </div>
            <div className="c2-stat">
              <p className="c2-stat-label">Rendement escompté*</p>
              <p className="c2-stat-value">
                {expectedReturn != null ? formatCurrency(expectedReturn) : '—'}
              </p>
            </div>
          </div>
        </div>

        <div className="c2-actions">
          <button
            type="button"
            className="c2-action c2-action--primary"
            onClick={() => router.push(`/portal/sama-naffa/${account.id}/alimenter`)}
          >
            Alimente
          </button>
          <button
            type="button"
            className="c2-action c2-action--outline"
            onClick={() => router.push(`/portal/sama-naffa/${account.id}/retrait`)}
          >
            Retire
          </button>
          <button
            type="button"
            className="c2-action c2-action--ghost"
            onClick={() => router.push('/portal/releves')}
          >
            Relevés
          </button>
        </div>

        <h2 className="c2-history-title">Historique</h2>
        <div className="c2-history">
          {isLoadingTx ? (
            <p className="c2-history-empty">Chargement…</p>
          ) : transactions.length === 0 ? (
            <p className="c2-history-empty">Aucune transaction pour le moment</p>
          ) : (
            transactions.map((tx) => {
              const kind = String(tx.type || tx.intentType || '').toUpperCase();
              const isWithdraw = kind.includes('WITHDRAW');
              const signed = isWithdraw
                ? `-${Math.round(tx.amount).toLocaleString('fr-FR')} FCFA`
                : `+${Math.round(tx.amount).toLocaleString('fr-FR')} FCFA`;
              return (
                <div key={tx.id} className="c2-history-row">
                  <div className="c2-history-left">
                    <p className="c2-history-name">{historyTitle(tx)}</p>
                    <p className="c2-history-date">{formatHistoryDate(tx.createdAt)}</p>
                  </div>
                  <p
                    className={`c2-history-amount ${
                      isWithdraw ? 'c2-history-amount--out' : 'c2-history-amount--in'
                    }`}
                  >
                    {signed}
                  </p>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
