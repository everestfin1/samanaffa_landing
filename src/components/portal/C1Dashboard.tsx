'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { formatCurrency } from '@/lib/utils';

export interface C1Account {
  id: string;
  productName?: string | null;
  balance: number;
  lockPeriodMonths?: number | null;
  lockedUntil?: string | null;
  createdAt: string;
  metadata?: Record<string, unknown> | null;
}

export interface C1Transaction {
  id: string;
  type?: 'DEPOSIT' | 'WITHDRAWAL' | 'INVESTMENT' | string;
  intentType?: string;
  amount: number;
  status: string;
  createdAt: string;
  accountType?: string;
  /** Optional label when API provides account / product context. */
  label?: string | null;
}

type KYCStatus = 'PENDING' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED';

interface C1DashboardProps {
  firstName: string;
  kycStatus: KYCStatus;
  accounts: C1Account[];
  transactions: C1Transaction[];
  pendingDepositAmount?: number | null;
  onStartKyc?: () => void;
  onConfirmDeposit?: () => void;
}

function readMetaNumber(meta: Record<string, unknown> | null | undefined, key: string): number | null {
  if (!meta || !(key in meta)) return null;
  const n = Number(meta[key]);
  return Number.isFinite(n) && n > 0 ? n : null;
}

function formatActivityDate(iso: string): string {
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

function formatAnniversary(account: C1Account): string | null {
  const locked = account.lockedUntil ? new Date(account.lockedUntil) : null;
  if (locked && !Number.isNaN(locked.getTime())) {
    return locked.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  }
  const created = new Date(account.createdAt);
  if (Number.isNaN(created.getTime())) return null;
  const next = new Date(created);
  next.setFullYear(next.getFullYear() + 1);
  return next.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

function progressForAccount(account: C1Account): number {
  const monthly = readMetaNumber(account.metadata ?? undefined, 'monthlyAmount');
  const duration =
    readMetaNumber(account.metadata ?? undefined, 'durationMonths') ??
    (account.lockPeriodMonths && account.lockPeriodMonths > 0
      ? account.lockPeriodMonths
      : null);
  if (monthly && duration) {
    const target = monthly * duration;
    if (target > 0) return Math.min(1, Math.max(0.04, account.balance / target));
  }
  // Soft visual when we lack a target (Momar always shows a bar).
  if (account.balance <= 0) return 0.08;
  return Math.min(0.62, 0.18 + Math.log10(account.balance + 1) / 10);
}

function statusLabel(status: string): { text: string; tone: 'ok' | 'pending' | 'bad' } {
  const s = status.toUpperCase();
  if (s === 'COMPLETED' || s === 'SUCCESS' || s === 'PAID') {
    return { text: 'Complété', tone: 'ok' };
  }
  if (s === 'PENDING' || s === 'PROCESSING' || s === 'INITIATED') {
    return { text: 'En attente', tone: 'pending' };
  }
  return { text: 'Échoué', tone: 'bad' };
}

function activityTitle(tx: C1Transaction): string {
  if (tx.label) return tx.label;
  const t = String(tx.type || tx.intentType || '').toUpperCase();
  if (t.includes('WITHDRAW')) return 'Retrait';
  if (t.includes('INVEST') || t.includes('REVAL') || t.includes('INTEREST')) {
    return 'Réévaluation du portefeuille';
  }
  return 'Versement';
}

export default function C1Dashboard({
  firstName,
  kycStatus,
  accounts,
  transactions,
  pendingDepositAmount,
  onStartKyc,
  onConfirmDeposit,
}: C1DashboardProps) {
  const router = useRouter();
  const [showBalance, setShowBalance] = useState(true);
  const greetingName = firstName.trim() || 'toi';
  const totalBalance = accounts.reduce((sum, a) => sum + (Number(a.balance) || 0), 0);
  const showKycBanner = kycStatus !== 'APPROVED';

  return (
    <div className="c1-shell">
      <div className="c1-main">
        {showKycBanner && (
          <div className="c1-kyc-banner" role="status">
            {kycStatus === 'REJECTED'
              ? 'Vérification d’identité à reprendre'
              : kycStatus === 'UNDER_REVIEW'
                ? 'KYC en attente de validation...'
                : 'Vérification d’identité requise'}
            {(kycStatus === 'PENDING' || kycStatus === 'REJECTED') && onStartKyc && (
              <button type="button" className="c1-kyc-action" onClick={onStartKyc}>
                {kycStatus === 'REJECTED' ? 'Relancer' : 'Compléter'}
              </button>
            )}
          </div>
        )}

        {pendingDepositAmount != null && pendingDepositAmount > 0 && (
          <div className="c1-deposit-banner">
            <p>
              Premier versement à confirmer · {formatCurrency(pendingDepositAmount)} FCFA
            </p>
            <button type="button" className="c1-deposit-action" onClick={onConfirmDeposit}>
              Confirmer
            </button>
          </div>
        )}

        <div className="c1-hello-row">
          <h1 className="c1-hello">Bonjour, {greetingName} !</h1>
          <button
            type="button"
            className="c1-create"
            onClick={() => router.push('/portal/sama-naffa')}
          >
            + Créer un Kondanné
          </button>
        </div>

        <section className="c1-balance" aria-label="Solde Sama Naffa">
          <div className="c1-balance-top">
            <p className="c1-balance-label">Sama Naffa</p>
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
                    {Math.round(totalBalance).toLocaleString('fr-FR')}
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

        <section className="c1-section">
          <h2 className="c1-section-title">Mes Kondannés</h2>
          {accounts.length === 0 ? (
            <div className="c1-empty">
              <p>Aucun Kondanné pour le moment.</p>
              <button
                type="button"
                className="c1-create c1-create--ghost"
                onClick={() => router.push('/portal/sama-naffa')}
              >
                + Créer un Kondanné
              </button>
            </div>
          ) : (
            <ul className="c1-kondanne-list">
              {accounts.map((account) => {
                const months =
                  account.lockPeriodMonths ??
                  readMetaNumber(account.metadata ?? undefined, 'durationMonths');
                const anniversary = formatAnniversary(account);
                const progress = progressForAccount(account);
                return (
                  <li key={account.id}>
                    <button
                      type="button"
                      className="c1-kondanne"
                      onClick={() => router.push('/portal/sama-naffa')}
                    >
                      <div className="c1-kondanne-head">
                        <span className="c1-kondanne-name">
                          {account.productName?.trim() || 'Mon Kondanné'}
                        </span>
                        {months != null && (
                          <span className="c1-kondanne-pill">{Math.round(months)} mois</span>
                        )}
                      </div>
                      <p className="c1-kondanne-balance">
                        {showBalance
                          ? `${Math.round(account.balance).toLocaleString('fr-FR')} FCFA`
                          : '••••••••'}
                      </p>
                      {anniversary && (
                        <p className="c1-kondanne-meta">
                          Prochaine date anniversaire · {anniversary}
                        </p>
                      )}
                      <div className="c1-progress" aria-hidden>
                        <div
                          className="c1-progress-fill"
                          style={{ width: `${Math.round(progress * 100)}%` }}
                        />
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        <section className="c1-section">
          <h2 className="c1-section-title">Activité récente</h2>
          <div className="c1-activity">
            {transactions.length === 0 ? (
              <p className="c1-activity-empty">Aucune transaction récente</p>
            ) : (
              transactions.map((tx) => {
                const st = statusLabel(tx.status);
                const kind = String(tx.type || tx.intentType || '').toUpperCase();
                const signed =
                  kind.includes('WITHDRAW')
                    ? `-${Math.round(tx.amount).toLocaleString('fr-FR')} FCFA`
                    : `+${Math.round(tx.amount).toLocaleString('fr-FR')} FCFA`;
                return (
                  <div key={tx.id} className="c1-activity-row">
                    <div className="c1-activity-left">
                      <p className="c1-activity-title">{activityTitle(tx)}</p>
                      <p className="c1-activity-date">{formatActivityDate(tx.createdAt)}</p>
                    </div>
                    <div className="c1-activity-right">
                      <p className={`c1-activity-amount c1-activity-amount--${st.tone}`}>
                        {signed}
                      </p>
                      <p className={`c1-activity-status c1-activity-status--${st.tone}`}>
                        {st.text}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
