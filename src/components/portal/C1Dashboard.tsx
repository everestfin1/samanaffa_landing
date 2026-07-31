'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { formatCurrency } from '@/lib/utils';
import { sortAccountsByCreation } from '@/lib/kondanne-card-colors';
import KondanneCard from '@/components/portal/KondanneCard';

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
  const [hiddenKondanneIds, setHiddenKondanneIds] = useState<Record<string, boolean>>({});
  const [activeKondanneIndex, setActiveKondanneIndex] = useState(0);
  const kondanneSliderRef = useRef<HTMLDivElement>(null);
  const greetingName = firstName.trim() || 'toi';
  // Extra Kondannés only — default/first Sama Naffa is already the top balance card.
  const sliderAccounts = useMemo(() => {
    const ordered = sortAccountsByCreation(accounts);
    return ordered.length > 1 ? ordered.slice(1) : [];
  }, [accounts]);
  const totalBalance = accounts.reduce((sum, a) => sum + (Number(a.balance) || 0), 0);
  const showKycBanner = kycStatus !== 'APPROVED';
  const primaryAccount = accounts.length === 1 ? accounts[0] : null;
  const balanceLabel = primaryAccount?.productName?.trim() || 'Sama Naffa';
  const showKondanneList = sliderAccounts.length > 0;
  const kondanneDestination =
    accounts.length === 1
      ? `/portal/sama-naffa/${accounts[0].id}`
      : '/portal/sama-naffa';

  const syncActiveKondanne = useCallback(() => {
    const slider = kondanneSliderRef.current;
    if (!slider || sliderAccounts.length === 0) return;
    const slideWidth = slider.clientWidth;
    if (slideWidth <= 0) return;
    const index = Math.round(slider.scrollLeft / slideWidth);
    setActiveKondanneIndex(Math.min(Math.max(index, 0), sliderAccounts.length - 1));
  }, [sliderAccounts.length]);

  useEffect(() => {
    if (activeKondanneIndex >= sliderAccounts.length) {
      setActiveKondanneIndex(0);
    }
  }, [activeKondanneIndex, sliderAccounts.length]);

  const scrollToKondanne = (index: number) => {
    const slider = kondanneSliderRef.current;
    if (!slider) return;
    const slideWidth = slider.clientWidth;
    slider.scrollTo({ left: slideWidth * index, behavior: 'smooth' });
    setActiveKondanneIndex(index);
  };

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
              Premier versement à confirmer · {formatCurrency(pendingDepositAmount)}
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
            onClick={() => router.push('/portal/sama-naffa/creer')}
          >
            + Créer un Kondanné
          </button>
        </div>

        <section
          className="c1-balance c1-balance--link"
          aria-label={`Solde ${balanceLabel}`}
          role="link"
          tabIndex={0}
          onClick={() => router.push(kondanneDestination)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              router.push(kondanneDestination);
            }
          }}
        >
          <div className="c1-balance-top">
            <p className="c1-balance-label">{balanceLabel}</p>
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
              onClick={(e) => {
                e.stopPropagation();
                setShowBalance((v) => !v);
              }}
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

        {showKondanneList && (
          <section className="c1-section c1-section--kondanne">
            <h2 className="c1-section-title">Mes Kondannés</h2>
            <div
              ref={kondanneSliderRef}
              className="c1-kondanne-slider"
              onScroll={syncActiveKondanne}
              aria-label="Mes Kondannés"
            >
              <ul className="c1-kondanne-track">
                {sliderAccounts.map((account) => (
                  <li key={account.id} className="c1-kondanne-slide">
                    <KondanneCard
                      account={account}
                      accounts={accounts}
                      hidden={Boolean(hiddenKondanneIds[account.id])}
                      onToggleBalance={() =>
                        setHiddenKondanneIds((prev) => ({
                          ...prev,
                          [account.id]: !prev[account.id],
                        }))
                      }
                      onClick={() => router.push(`/portal/sama-naffa/${account.id}`)}
                    />
                  </li>
                ))}
              </ul>
            </div>
            {sliderAccounts.length > 1 && (
              <div className="c1-kondanne-indicators" role="tablist" aria-label="Sélectionner un Kondanné">
                {sliderAccounts.map((account, index) => (
                  <button
                    key={account.id}
                    type="button"
                    role="tab"
                    className={`c1-kondanne-indicator${index === activeKondanneIndex ? ' is-active' : ''}`}
                    aria-label={account.productName?.trim() || `Kondanné ${index + 1}`}
                    aria-selected={index === activeKondanneIndex}
                    onClick={() => scrollToKondanne(index)}
                  />
                ))}
              </div>
            )}
          </section>
        )}

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
