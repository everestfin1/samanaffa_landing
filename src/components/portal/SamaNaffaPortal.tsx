'use client';

import { useEffect, useMemo, useState } from 'react';
import { useSession } from 'next-auth/react';
import {
  ArrowDownIcon,
  ArrowUpIcon,
  BanknotesIcon,
  ClockIcon,
  EyeIcon,
  EyeSlashIcon,
  PlusIcon,
} from '@heroicons/react/24/outline';
import Image from 'next/image';

import TransferModal from '../modals/TransferModal';
import CreateNaffaModal from '../modals/CreateNaffaModal';
import { NaffaType } from '../data/naffaTypes';

type IntentKind = 'DEPOSIT' | 'WITHDRAWAL' | 'INVESTMENT';

interface UserAccount {
  id: string;
  accountType: string;
  accountNumber: string;
  productCode?: string | null;
  productName?: string | null;
  balance: number;
  status: string;
  createdAt: string;
  interestRate?: number | null;
  lockPeriodMonths?: number | null;
  lockedUntil?: string | null;
  isLocked?: boolean;
  allowAdditionalDeposits?: boolean;
  metadata?: Record<string, unknown>;
  recentTransactions: Array<{
    id: string;
    intentType: IntentKind;
    amount: number;
    status: string;
    referenceNumber: string;
    createdAt: string;
  }>;
}

interface TransactionIntent {
  id: string;
  accountType: string;
  accountId: string;
  intentType: IntentKind;
  amount: number;
  paymentMethod: string;
  status: string;
  referenceNumber: string;
  createdAt: string;
  userNotes?: string;
}

interface SamaNaffaPortalProps {
  kycStatus?: 'PENDING' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED';
}

export default function SamaNaffaPortal({ kycStatus = 'APPROVED' }: SamaNaffaPortalProps) {
  const { data: session } = useSession();
  const userId = useMemo(() => (session?.user as any)?.id ?? null, [session]);

  const [isLoadingAccounts, setIsLoadingAccounts] = useState(true);
  const [accountsError, setAccountsError] = useState<string | null>(null);

  const [accounts, setAccounts] = useState<UserAccount[]>([]);
  const [selectedAccountId, setSelectedAccountId] = useState<string | null>(null);

  const [showBalance, setShowBalance] = useState(false);

  const [showTransferModal, setShowTransferModal] = useState(false);
  const [transferType, setTransferType] = useState<'deposit' | 'withdraw'>('deposit');

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isCreatingAccount, setIsCreatingAccount] = useState(false);
  const [creationFeedback, setCreationFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const [transactions, setTransactions] = useState<TransactionIntent[]>([]);
  const [pagedTransactions, setPagedTransactions] = useState<TransactionIntent[]>([]);
  const [totalTransactions, setTotalTransactions] = useState(0);
  const [hasMoreTransactions, setHasMoreTransactions] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [actionWarning, setActionWarning] = useState<string | null>(null);

  const orderedThemes = [
    'from-sama-secondary-green-dark via-sama-secondary-green to-sama-primary-green-dark',
    'from-[#C38D1C] via-[#b3830f] to-[#a37a0d]',
    'from-[#435933] via-[#5a7344] to-[#364529]',
    'from-[#30461f] via-[#243318] to-[#1a2612]',
    'from-[#b3830f] via-[#C38D1C] to-[#d49a20]',
  ];

  const getThemeByIndex = (index: number) => orderedThemes[index % orderedThemes.length];

  const successMessage = creationFeedback?.type === 'success' ? creationFeedback.message : null;
  const modalErrorMessage = creationFeedback?.type === 'error' ? creationFeedback.message : null;

  const selectedAccount = useMemo(
    () => (selectedAccountId ? accounts.find(acc => acc.id === selectedAccountId) ?? null : null),
    [accounts, selectedAccountId],
  );

  const fetchAccounts = async () => {
    if (!userId) return;

    setIsLoadingAccounts(true);
    setAccountsError(null);

    try {
      const response = await fetch('/api/accounts');
      if (!response.ok) {
        throw new Error('Impossible de récupérer vos comptes Sama Naffa.');
      }

      const payload = await response.json();
      if (!payload.success) {
        throw new Error(payload.error || 'Réponse inattendue du serveur.');
      }

      const samaAccounts: UserAccount[] = (payload.accounts || []).filter(
        (account: UserAccount) => account.accountType === 'SAMA_NAFFA',
      );

      setAccounts(samaAccounts);

      if (samaAccounts.length > 0) {
        const defaultAccountId =
          selectedAccountId && samaAccounts.some(acc => acc.id === selectedAccountId)
            ? selectedAccountId
            : samaAccounts[0].id;

        setSelectedAccountId(defaultAccountId);
      } else {
        setSelectedAccountId(null);
      }
    } catch (err) {
      console.error('[SamaNaffaPortal] fetchAccounts error:', err);
      const message = err instanceof Error ? err.message : 'Erreur inconnue lors du chargement de vos comptes.';
      setAccountsError(message);
    } finally {
      setIsLoadingAccounts(false);
    }
  };

  const fetchTransactions = async (accountId: string, limit = 5, offset = 0) => {
    if (!userId) return;

    try {
      const response = await fetch(`/api/transactions/intent?userId=${userId}&limit=${limit}&offset=${offset}`);
      if (!response.ok) {
        throw new Error('Impossible de récupérer vos transactions.');
      }

      const payload = await response.json();
      if (!payload.success) {
        throw new Error(payload.error || 'Réponse inattendue lors du chargement des transactions.');
      }

      const filteredTransactions: TransactionIntent[] = (payload.transactionIntents || []).filter(
        (tx: TransactionIntent) => tx.accountType === 'SAMA_NAFFA' && tx.accountId === accountId,
      );

      if (offset === 0) {
        setPagedTransactions(filteredTransactions);
        setTransactions(filteredTransactions);
      } else {
        setPagedTransactions(prev => [...prev, ...filteredTransactions]);
        setTransactions(prev => {
          const combined = [...prev, ...filteredTransactions];
          const unique = new Map<string, TransactionIntent>();
          combined.forEach(tx => unique.set(tx.id, tx));
          return Array.from(unique.values()).sort(
            (a, b) => new Date(b.createdAt).valueOf() - new Date(a.createdAt).valueOf(),
          );
        });
      }

      setTotalTransactions(payload.pagination?.total ?? filteredTransactions.length ?? 0);
      setHasMoreTransactions(payload.pagination?.hasMore ?? false);
    } catch (err) {
      console.error('[SamaNaffaPortal] fetchTransactions error:', err);
    }
  };

  useEffect(() => {
    if (!userId) return;
    fetchAccounts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  useEffect(() => {
    if (!selectedAccountId) return;
    fetchTransactions(selectedAccountId, 5, 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedAccountId]);

  const handleSelectAccount = (accountId: string) => {
    setSelectedAccountId(accountId);
    setCreationFeedback(null);
  };

  const handleCreateAccount = async (naffaType: NaffaType) => {
    if (!naffaType || isCreatingAccount) return;

    setCreationFeedback(null);
    setIsCreatingAccount(true);

    try {
      const response = await fetch('/api/accounts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: naffaType.id }),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => null);
        throw new Error(payload?.error || 'Création de Naffa impossible pour le moment.');
      }

      const payload = await response.json();
      if (!payload.success || !payload.account) {
        throw new Error(payload.error || 'Réponse inattendue du serveur.');
      }

      setCreationFeedback({
        type: 'success',
        message: `Le Naffa "${payload.account.productName || naffaType.name}" a été créé avec succès.`,
      });
      setShowCreateModal(false);
      await fetchAccounts();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur inconnue lors de la création du Naffa.';
      setCreationFeedback({ type: 'error', message });
    } finally {
      setIsCreatingAccount(false);
    }
  };

  const handleOpenTransfer = (type: 'deposit' | 'withdraw') => {
    if (!selectedAccount) return;

    setActionWarning(null);

    if (
      type === 'withdraw' &&
      selectedAccount.isLocked &&
      selectedAccount.lockedUntil &&
      new Date(selectedAccount.lockedUntil) > new Date()
    ) {
      setActionWarning(
        `Ce Naffa est bloqué jusqu'au ${new Date(selectedAccount.lockedUntil).toLocaleDateString('fr-FR', {
          day: '2-digit',
          month: 'long',
          year: 'numeric',
        })}. Les retraits seront disponibles à partir de cette date.`,
      );
      return;
    }

    setTransferType(type);
    setShowTransferModal(true);
  };

  const handleTransferCompleted = async () => {
    setShowTransferModal(false);
    if (selectedAccountId) {
      await fetchTransactions(selectedAccountId, 5, 0);
      await fetchAccounts();
    }
  };

  const handleLoadMoreTransactions = async () => {
    if (!selectedAccountId || isLoadingMore || !hasMoreTransactions) return;
    setIsLoadingMore(true);
    try {
      await fetchTransactions(selectedAccountId, 5, pagedTransactions.length);
    } finally {
      setIsLoadingMore(false);
    }
  };

  if (isLoadingAccounts) {
    return (
      <div className="space-y-8">
        <div className="bg-white rounded-2xl border border-timberwolf/20 p-8">
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-4 border-gold-metallic border-t-transparent rounded-full animate-spin" />
          </div>
        </div>
      </div>
    );
  }

  if (accountsError) {
    return (
      <div className="space-y-8">
        <div className="bg-white rounded-2xl border border-timberwolf/20 p-8">
          <div className="text-center py-12">
            <p className="text-red-600 mb-4">{accountsError}</p>
            <button
              onClick={fetchAccounts}
              className="bg-gold-metallic text-white px-6 py-2 rounded-lg font-medium hover:bg-gold-dark transition-colors"
            >
              Réessayer
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!selectedAccount) {
    return (
      <div className="space-y-8">
        {creationFeedback && (
          <div
            className={`border rounded-xl px-4 py-3 ${
              creationFeedback.type === 'error'
                ? 'bg-red-50 border-red-200 text-red-700'
                : 'bg-emerald-50 border-emerald-200 text-emerald-700'
            }`}
          >
            {creationFeedback.message}
          </div>
        )}
        <div className="bg-white rounded-2xl border border-timberwolf/20 p-8">
          <div className="text-center py-12 space-y-4">
            <p className="text-night/70">Aucun Naffa actif pour le moment.</p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center space-x-2 bg-sama-primary-green text-white px-4 py-2 rounded-lg font-medium hover:bg-sama-secondary-green-dark transition-colors"
            >
              <PlusIcon className="w-5 h-5" />
              <span>Créer mon premier Naffa</span>
            </button>
          </div>
        </div>

        <CreateNaffaModal
          isOpen={showCreateModal}
          onClose={() => {
            if (!isCreatingAccount) {
              setShowCreateModal(false);
              setCreationFeedback(null);
            }
          }}
          onSelectNaffa={handleCreateAccount}
        isSubmitting={isCreatingAccount}
        errorMessage={creationFeedback?.type === 'error' ? creationFeedback.message : null}
        />
      </div>
    );
  }

  const isAccountLocked =
    selectedAccount.isLocked &&
    selectedAccount.lockedUntil &&
    new Date(selectedAccount.lockedUntil) > new Date();

  const lockedUntilDate = isAccountLocked
    ? new Date(selectedAccount.lockedUntil!).toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      })
    : null;

  const canWithdraw = !isAccountLocked;

  return (
    <div className="space-y-8">
      {creationFeedback && (
        <div
          className={`border rounded-xl px-4 py-3 ${
            creationFeedback.type === 'error'
              ? 'bg-red-50 border-red-200 text-red-700'
              : 'bg-emerald-50 border-emerald-200 text-emerald-700'
          }`}
        >
          {creationFeedback.message}
        </div>
      )}

      <div className="bg-white rounded-2xl border border-timberwolf/20 p-8 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h3 className="text-xl font-bold text-night">Mes Naffa</h3>
            <p className="text-night/60 text-sm">
              {accounts.length > 1
                ? `${accounts.length} comptes d'épargne actifs`
                : 'Votre compte d’épargne Sama Naffa'}
            </p>
          </div>
          <div className="flex items-center gap-3">
            {isAccountLocked && (
              <div className="flex items-center space-x-2 bg-amber-50 border border-amber-200 rounded-xl px-4 py-2 text-amber-700">
                <ClockIcon className="w-5 h-5" />
                <span>
                  Bloqué jusqu'au{' '}
                  {new Date(selectedAccount.lockedUntil!).toLocaleDateString('fr-FR', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric',
                  })}
                </span>
              </div>
            )}
            <button
              onClick={() => {
                setCreationFeedback(null);
                setShowCreateModal(true);
              }}
              className="flex items-center space-x-2 bg-sama-primary-green text-white px-4 py-2 rounded-lg font-medium hover:bg-sama-secondary-green-dark transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              disabled={isCreatingAccount}
            >
              <PlusIcon className="w-5 h-5" />
              <span>{isCreatingAccount ? 'Création en cours...' : 'Créer un Naffa'}</span>
            </button>
          </div>
        </div>

        {accounts.length > 1 && (
          <div className="relative h-[400px] mb-8">
            <div className="absolute top-4 right-4 z-50">
              <button
                onClick={() => setShowBalance(prev => !prev)}
                className="flex items-center space-x-2 bg-white/90 backdrop-blur-sm text-night px-4 py-2 rounded-lg shadow-lg hover:bg-white transition-colors border border-timberwolf/20"
              >
                {showBalance ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                <span className="text-sm font-medium">{showBalance ? 'Masquer' : 'Afficher'}</span>
              </button>
            </div>
            <div className="relative w-full h-full">
              {accounts.map((account, index) => {
                const isSelected = account.id === selectedAccountId;
                const totalCards = accounts.length;
                const selectedIndex = accounts.findIndex(acc => acc.id === selectedAccountId);
                
                // Calculate stacking position with directional offsets for clarity
                let translateY = 0;
                let translateX = 0;
                let scale = 1;
                let zIndex = 0;
                let opacity = 1;

                if (isSelected) {
                  translateY = 0;
                  translateX = 0;
                  scale = 1;
                  zIndex = 120;
                  opacity = 1;
                } else {
                  const delta = index - selectedIndex;
                  const distance = Math.abs(delta);
                  translateY = -(distance * 16 + 8);
                  translateX = delta * 26;
                  scale = Math.max(0.78, 1 - distance * 0.06);
                  zIndex = 120 - distance * 2 - (delta > 0 ? 1 : 0);
                  opacity = Math.max(0.4, 1 - distance * 0.22);
                }

                const cardTheme = getThemeByIndex(index);

                return (
                  <button
                    key={account.id}
                    onClick={() => handleSelectAccount(account.id)}
                    className="absolute top-0 left-0 w-full transition-all duration-500 ease-out cursor-pointer"
                    style={{
                      transform: `translateY(${translateY}px) translateX(${translateX}px) scale(${scale})`,
                      zIndex,
                      opacity,
                    }}
                  >
                    <div className={`relative bg-gradient-to-br ${cardTheme} rounded-2xl p-8 text-white overflow-hidden shadow-2xl border border-white/10`}>
                      <div
                        className="absolute inset-0 opacity-30 z-10"
                        style={{
                          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                          mixBlendMode: 'overlay',
                        }}
                      />
                      
                      <div className="absolute top-4 right-4 w-32 h-32 border border-white/10 rounded-full" />
                      <div className="absolute top-8 right-8 w-24 h-24 border border-white/10 rounded-full" />
                      <div className="absolute -top-4 -right-4 w-16 h-16 border border-white/10 rounded-full" />
                      
                      <div className="absolute top-6 right-6 z-30">
                        <Image src="/sama_naffa_logo.png" alt="Sama Naffa Logo" className="h-12 w-auto" width={100} height={48} />
                      </div>

                      <div className="relative z-20 space-y-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-white/70">Compte d'épargne</p>
                            <h4 className="text-xl font-semibold">{account.productName || 'Naffa personnalisé'}</h4>
                          </div>
                        </div>

                        <div>
                          <p className="text-white/70 text-sm mb-1">Solde disponible</p>
                          <div className="flex items-center space-x-4">
                            <p className="text-3xl font-bold tracking-wide">
                              {showBalance ? `${Number(account.balance).toLocaleString('fr-FR')} FCFA` : '••••••••••••'}
                            </p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          <div>
                            <p className="text-xs text-white/60 uppercase">N° d'association</p>
                            <p className="font-mono text-sm">{account.accountNumber}</p>
                          </div>
                          <div>
                            <p className="text-xs text-white/60 uppercase">Taux d'intérêt</p>
                            <p className="text-sm font-semibold">{account.interestRate ?? 4.5}% annuel</p>
                          </div>
                          <div>
                            <p className="text-xs text-white/60 uppercase">Statut</p>
                            <p className="text-sm font-semibold capitalize">{account.status.toLowerCase()}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {accounts.length === 1 && (
          <div className="relative bg-gradient-to-br from-sama-secondary-green-dark via-sama-secondary-green to-sama-primary-green-dark rounded-2xl p-8 text-white overflow-hidden shadow-2xl border border-white/10">
            <div
              className="absolute inset-0 opacity-80 z-10"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                mixBlendMode: 'overlay',
              }}
            />
            <div className="absolute top-4 right-4 w-32 h-32 border border-white/10 rounded-full" />
            <div className="absolute top-8 right-8 w-24 h-24 border border-white/10 rounded-full" />
            <div className="absolute -top-4 -right-4 w-16 h-16 border border-white/10 rounded-full" />
            <div className="absolute top-6 right-6 z-30">
              <Image src="/sama_naffa_logo.png" alt="Sama Naffa Logo" className="h-12 w-auto" width={100} height={48} />
            </div>

            <div className="relative z-20 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-white/70">Compte d'épargne</p>
                  <h4 className="text-xl font-semibold">{selectedAccount.productName || 'Naffa personnalisé'}</h4>
                </div>
              </div>

              <div>
                <p className="text-white/70 text-sm mb-1">Solde disponible</p>
                <div className="flex items-center space-x-4">
                  <p className="text-3xl font-bold tracking-wide">
                    {showBalance ? `${Number(selectedAccount.balance).toLocaleString('fr-FR')} FCFA` : '••••••••••••'}
                  </p>
                  <button onClick={() => setShowBalance(prev => !prev)} className="text-white/80 hover:text-white transition-colors">
                    {showBalance ? <EyeSlashIcon className="w-6 h-6" /> : <EyeIcon className="w-6 h-6" />}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <p className="text-xs text-white/60 uppercase">N° d'association</p>
                  <p className="font-mono text-sm">{selectedAccount.accountNumber}</p>
                </div>
                <div>
                  <p className="text-xs text-white/60 uppercase">Taux d'intérêt</p>
                  <p className="text-sm font-semibold">{selectedAccount.interestRate ?? 4.5}% annuel</p>
                </div>
                <div>
                  <p className="text-xs text-white/60 uppercase">Statut</p>
                  <p className="text-sm font-semibold capitalize">{selectedAccount.status.toLowerCase()}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-col md:flex-row gap-3">
          <button
            onClick={() => handleOpenTransfer('deposit')}
            className="flex-1 bg-gold-metallic text-white py-4 px-6 rounded-xl font-semibold hover:bg-gold-dark transition-colors flex items-center justify-center space-x-2"
          >
            <ArrowDownIcon className="w-5 h-5" />
            <span>Effectuer un dépôt</span>
          </button>
          <button
            onClick={() => handleOpenTransfer('withdraw')}
            className={`flex-1 border-2 py-4 px-6 rounded-xl font-semibold transition-colors flex items-center justify-center space-x-2 ${
              canWithdraw
                ? 'border-gold-metallic text-gold-metallic hover:bg-gold-metallic/5'
                : 'border-timberwolf/60 text-timberwolf/70 cursor-not-allowed bg-timberwolf/10'
            }`}
            disabled={!canWithdraw}
          >
            <ArrowUpIcon className="w-5 h-5" />
            <span>
              {canWithdraw ? 'Effectuer un retrait' : `Retrait indisponible jusqu'au ${lockedUntilDate}`}
            </span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-timberwolf/20 p-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-night">Historique des transactions</h3>
          <p className="text-sm text-night/50">
            {pagedTransactions.length} / {totalTransactions} transactions affichées
          </p>
        </div>

        {pagedTransactions.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-timberwolf/20">
                  <th className="text-left py-3 px-2 text-sm font-semibold text-night/70">Date</th>
                  <th className="text-left py-3 px-2 text-sm font-semibold text-night/70">Type</th>
                  <th className="text-left py-3 px-2 text-sm font-semibold text-night/70">Méthode</th>
                  <th className="text-right py-3 px-2 text-sm font-semibold text-night/70">Montant</th>
                  <th className="text-right py-3 px-2 text-sm font-semibold text-night/70">Statut</th>
                  <th className="text-right py-3 px-2 text-sm font-semibold text-night/70">Référence</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-timberwolf/10">
                {pagedTransactions.map(transaction => (
                  <tr key={transaction.id} className="hover:bg-timberwolf/5 transition-colors">
                    <td className="py-4 px-2 text-sm text-night">
                      {new Date(transaction.createdAt).toLocaleDateString('fr-FR')}
                    </td>
                    <td className="py-4 px-2">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          transaction.intentType === 'DEPOSIT'
                            ? 'bg-green-100 text-green-800'
                            : transaction.intentType === 'WITHDRAWAL'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {transaction.intentType === 'DEPOSIT'
                          ? 'Dépôt'
                          : transaction.intentType === 'WITHDRAWAL'
                          ? 'Retrait'
                          : 'Investissement'}
                      </span>
                    </td>
                    <td className="py-4 px-2 text-sm text-night/70">{transaction.paymentMethod}</td>
                    <td
                      className={`py-4 px-2 text-sm font-semibold text-right ${
                        transaction.intentType === 'WITHDRAWAL' ? 'text-red-600' : 'text-green-600'
                      }`}
                    >
                      {transaction.intentType === 'WITHDRAWAL' ? '-' : '+'}
                      {transaction.amount.toLocaleString('fr-FR')} FCFA
                    </td>
                    <td className="py-4 px-2 text-sm font-medium text-right">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          transaction.status === 'COMPLETED'
                            ? 'bg-green-100 text-green-800'
                            : transaction.status === 'PENDING'
                            ? 'bg-yellow-100 text-yellow-800'
                            : transaction.status === 'REJECTED'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {transaction.status === 'COMPLETED'
                          ? 'Complété'
                          : transaction.status === 'PENDING'
                          ? 'En attente'
                          : transaction.status === 'REJECTED'
                          ? 'Rejeté'
                          : 'En cours'}
                      </span>
                    </td>
                    <td className="py-4 px-2 text-sm font-medium text-right text-night">
                      {transaction.referenceNumber}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="bg-gold-metallic/10 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <BanknotesIcon className="w-8 h-8 text-gold-metallic" />
            </div>
            <p className="text-night/60">Aucune transaction récente</p>
            <p className="text-sm text-night/40">Vos transactions Sama Naffa apparaîtront ici</p>
          </div>
        )}

        {totalTransactions > pagedTransactions.length && hasMoreTransactions && (
          <div className="mt-6 flex justify-center">
            <button
              onClick={handleLoadMoreTransactions}
              disabled={isLoadingMore}
              className={`flex items-center space-x-2 py-2 px-6 rounded-lg font-medium text-sm transition-colors ${
                isLoadingMore
                  ? 'bg-timberwolf/50 text-night/50 cursor-not-allowed'
                  : 'bg-gold-metallic/10 text-gold-metallic hover:bg-gold-metallic hover:text-white border border-gold-metallic/20'
              }`}
            >
              {isLoadingMore ? (
                <>
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  <span>Chargement...</span>
                </>
              ) : (
                <span>Charger plus de transactions</span>
              )}
            </button>
          </div>
        )}
      </div>

      <TransferModal
        isOpen={showTransferModal}
        onClose={() => setShowTransferModal(false)}
        currentBalance={selectedAccount?.balance ?? 0}
        type={transferType}
        accountName={selectedAccount?.productName || 'Mon Naffa'}
        accountType="sama_naffa"
        kycStatus={kycStatus}
        onConfirm={handleTransferCompleted}
      />

      <CreateNaffaModal
        isOpen={showCreateModal}
        onClose={() => {
          if (!isCreatingAccount) {
            setShowCreateModal(false);
            setCreationFeedback(null);
          }
        }}
        onSelectNaffa={handleCreateAccount}
        isSubmitting={isCreatingAccount}
        errorMessage={creationFeedback?.type === 'error' ? creationFeedback.message : null}
      />
    </div>
  );
}
