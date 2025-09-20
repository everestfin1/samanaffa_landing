'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import {
  BanknotesIcon,
  ArrowTrendingUpIcon,
  ArrowRightIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  InformationCircleIcon,
  EyeIcon,
  EyeSlashIcon
} from '@heroicons/react/24/outline';
import TransferModal from '../modals/TransferModal';
import Image from 'next/image';

interface UserAccount {
  id: string;
  accountType: string;
  accountNumber: string;
  balance: number;
  status: string;
  createdAt: string;
  recentTransactions: Array<{
    id: string;
    intentType: string;
    amount: number;
    status: string;
    referenceNumber: string;
    createdAt: string;
  }>;
}

interface TransactionIntent {
  id: string;
  accountType: string;
  intentType: string;
  amount: number;
  paymentMethod: string;
  status: string;
  referenceNumber: string;
  createdAt: string;
  userNotes?: string;
}

export default function SamaNaffaPortal() {
  const { data: session } = useSession();
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [transferType, setTransferType] = useState<'deposit' | 'withdraw'>('deposit');
  const [selectedAccount, setSelectedAccount] = useState<string>('');
  const [showBalance, setShowBalance] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Real data from backend
  const [samaNaffaAccount, setSamaNaffaAccount] = useState<UserAccount | null>(null);
  const [transactionHistory, setTransactionHistory] = useState<TransactionIntent[]>([]);

  // Pagination state
  const [loadedTransactions, setLoadedTransactions] = useState<TransactionIntent[]>([]);
  const [totalTransactions, setTotalTransactions] = useState(0);
  const [hasMoreTransactions, setHasMoreTransactions] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Fetch user's Sama Naffa account data
  useEffect(() => {
    const fetchAccountData = async () => {
      if (!session) return;

      try {
        // Fetch user accounts
        const accountsResponse = await fetch('/api/accounts');
        const accountsData = await accountsResponse.json();

        if (accountsData.success) {
          const samaNaffaAcc = accountsData.accounts.find(
            (acc: UserAccount) => acc.accountType === 'SAMA_NAFFA'
          );
          setSamaNaffaAccount(samaNaffaAcc || null);
        }

        // Fetch initial transaction history (5 items)
        await fetchTransactions(5, 0);
      } catch (error) {
        console.error('Error fetching account data:', error);
        setError('Erreur lors du chargement des données');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAccountData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session]);

  // Function to fetch transactions with pagination
  const fetchTransactions = async (limit: number = 5, offset: number = 0) => {
    if (!session) return;

    try {
      const transactionsResponse = await fetch(
        `/api/transactions/intent?userId=${(session.user as any).id}&limit=${limit}&offset=${offset}`
      );
      const transactionsData = await transactionsResponse.json();

      if (transactionsData.success) {
        const samaNaffaTransactions = transactionsData.transactionIntents.filter(
          (tx: TransactionIntent) => tx.accountType === 'SAMA_NAFFA'
        );

        if (offset === 0) {
          // First load
          setLoadedTransactions(samaNaffaTransactions);
          setTotalTransactions(transactionsData.pagination.total);
          setHasMoreTransactions(transactionsData.pagination.hasMore);
        } else {
          // Load more - append to existing
          setLoadedTransactions(prev => [...prev, ...samaNaffaTransactions]);
          setHasMoreTransactions(transactionsData.pagination.hasMore);
        }

        // Update full transaction history for other operations
        const allTransactionsResponse = await fetch(`/api/transactions/intent?userId=${(session.user as any).id}`);
        const allTransactionsData = await allTransactionsResponse.json();

        if (allTransactionsData.success) {
          const allSamaNaffaTransactions = allTransactionsData.transactionIntents.filter(
            (tx: TransactionIntent) => tx.accountType === 'SAMA_NAFFA'
          );
          setTransactionHistory(allSamaNaffaTransactions);
        }
      }
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  // Load more transactions
  const loadMoreTransactions = async () => {
    if (!session || isLoadingMore || !hasMoreTransactions) return;

    setIsLoadingMore(true);
    try {
      await fetchTransactions(5, loadedTransactions.length);
    } finally {
      setIsLoadingMore(false);
    }
  };

  const handleTransferConfirm = async (data: { amount: number; method: string; note?: string }) => {
    if (!session || !samaNaffaAccount) return;

    try {
      const response = await fetch('/api/transactions/intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: (session.user as any).id,
          accountType: 'sama_naffa',
          intentType: transferType,
          amount: data.amount,
          paymentMethod: data.method,
          userNotes: data.note
        })
      });

      const result = await response.json();

      if (result.success) {
        // Refresh account data
        const accountsResponse = await fetch('/api/accounts');
        const accountsData = await accountsResponse.json();
        
        if (accountsData.success) {
          const updatedAccount = accountsData.accounts.find(
            (acc: UserAccount) => acc.accountType === 'SAMA_NAFFA'
          );
          setSamaNaffaAccount(updatedAccount || null);
        }

        // Refresh transaction history and paginated data
        await fetchTransactions(loadedTransactions.length > 0 ? loadedTransactions.length : 5, 0);

        setShowTransferModal(false);
        alert(`Transaction ${transferType === 'deposit' ? 'de dépôt' : 'de retrait'} soumise avec succès! Référence: ${result.transactionIntent.referenceNumber}`);
      } else {
        alert('Erreur lors de la soumission de la transaction');
      }
    } catch (error) {
      console.error('Error submitting transaction:', error);
      alert('Erreur lors de la soumission de la transaction');
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="bg-gradient-to-r from-gold-light/20 to-gold-metallic/10 rounded-2xl p-8 border border-gold-metallic/20">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-night mb-2">Sama Naffa</h2>
              <p className="text-night/70 text-lg">Chargement de votre compte...</p>
            </div>
            <div className="hidden md:block">
              <div className="bg-gold-metallic/10 p-4 rounded-full">
                <BanknotesIcon className="w-12 h-12 text-gold-metallic" />
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-timberwolf/20 p-8">
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-4 border-gold-metallic border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="space-y-8">
        <div className="bg-gradient-to-r from-gold-light/20 to-gold-metallic/10 rounded-2xl p-8 border border-gold-metallic/20">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-night mb-2">Sama Naffa</h2>
              <p className="text-night/70 text-lg">Erreur lors du chargement</p>
            </div>
            <div className="hidden md:block">
              <div className="bg-gold-metallic/10 p-4 rounded-full">
                <BanknotesIcon className="w-12 h-12 text-gold-metallic" />
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-timberwolf/20 p-8">
          <div className="text-center py-12">
            <p className="text-red-600 mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="bg-gold-metallic text-white px-6 py-2 rounded-lg font-medium hover:bg-gold-dark transition-colors"
            >
              Réessayer
            </button>
          </div>
        </div>
      </div>
    );
  }

  // No account found
  if (!samaNaffaAccount) {
    return (
      <div className="space-y-8">
        <div className="bg-gradient-to-r from-gold-light/20 to-gold-metallic/10 rounded-2xl p-8 border border-gold-metallic/20">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-night mb-2">Sama Naffa</h2>
              <p className="text-night/70 text-lg">Compte non trouvé</p>
            </div>
            <div className="hidden md:block">
              <div className="bg-gold-metallic/10 p-4 rounded-full">
                <BanknotesIcon className="w-12 h-12 text-gold-metallic" />
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-timberwolf/20 p-8">
          <div className="text-center py-12">
            <p className="text-night/70 mb-4">Votre compte Sama Naffa n'a pas été trouvé.</p>
            <p className="text-sm text-night/50">Veuillez contacter le support si le problème persiste.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-gold-light/20 to-gold-metallic/10 rounded-2xl p-8 border border-gold-metallic/20">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-night mb-2">Sama Naffa</h2>
            <p className="text-night/70 text-lg">Votre compte d'épargne principal</p>
          </div>
          <div className="hidden md:block">
            <div className="bg-gold-metallic/10 p-4 rounded-full">
              <BanknotesIcon className="w-12 h-12 text-gold-metallic" />
            </div>
          </div>
        </div>
      </div>

      {/* Primary Naffa Account */}
      <div className="bg-white rounded-2xl border border-timberwolf/20 p-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-night">Mon Naffa</h3>
        </div>

        {/* Account Balance Card */}
        <div className="mb-8">
          {/* Card Design */}
          <div className="relative bg-gradient-to-br from-sama-secondary-green-dark via-sama-secondary-green to-sama-primary-green-dark rounded-2xl p-8 text-white overflow-hidden">
            {/* Grainy texture overlay */}
            <div className="absolute inset-0 opacity-80 z-10" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
              mixBlendMode: 'overlay'
            }}></div>
            
            {/* Decorative circles */}
            <div className="absolute top-4 right-4 w-32 h-32 border border-white/10 rounded-full"></div>
            <div className="absolute top-8 right-8 w-24 h-24 border border-white/10 rounded-full"></div>
            <div className="absolute -top-4 -right-4 w-16 h-16 border border-white/10 rounded-full"></div>
            
            {/* Logo */}
            <div className="absolute top-6 right-6 z-30">
                <Image
                  src="/sama_naffa_logo.png"
                  alt="Sama Naffa Logo"
                  className="h-12 w-auto"
                  width={100}
                  height={48}
                />
            </div>

            {/* Card Content */}
            <div className="relative z-10">
              <div className="mb-8">
                <h4 className="text-lg font-medium text-white/90 mb-2">Solde Naffa</h4>
                <div className="flex items-center space-x-3">
                  <div className="text-2xl font-bold tracking-wider">
                    {showBalance ? `${Number(samaNaffaAccount.balance).toLocaleString()} FCFA` : '••••••••••••'}
                  </div>
                  <button 
                    onClick={() => setShowBalance(!showBalance)}
                    className="text-white/80 hover:text-white transition-colors"
                  >
                    {showBalance ? <EyeSlashIcon className="w-6 h-6" /> : <EyeIcon className="w-6 h-6" />}
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-white/70 text-sm mb-1">Association</p>
                  <p className="text-lg font-mono tracking-wider">{samaNaffaAccount.accountNumber}</p>
                </div>
                
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-white/70 text-xs">Taux d'intérêt</p>
                    <p className="text-lg font-semibold">7.5% annuel</p>
                  </div>
                  <div className="text-right">
                    <p className="text-white/70 text-xs">Statut</p>
                    <p className="text-lg font-semibold capitalize">{samaNaffaAccount.status}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex space-x-4">
          <button 
            onClick={() => {setTransferType('deposit'); setSelectedAccount(samaNaffaAccount.id); setShowTransferModal(true);}}
            className="flex-1 bg-gold-metallic text-white py-4 px-6 rounded-xl font-semibold hover:bg-gold-dark transition-colors flex items-center justify-center space-x-2"
          >
            <ArrowDownIcon className="w-5 h-5" />
            <span>Effectuer un dépôt</span>
          </button>
          <button 
            onClick={() => {setTransferType('withdraw'); setSelectedAccount(samaNaffaAccount.id); setShowTransferModal(true);}}
            className="flex-1 border-2 border-gold-metallic text-gold-metallic py-4 px-6 rounded-xl font-semibold hover:bg-gold-metallic/5 transition-colors flex items-center justify-center space-x-2"
          >
            <ArrowUpIcon className="w-5 h-5" />
            <span>Effectuer un retrait</span>
          </button>
        </div>
      </div>

      {/* Transaction History */}
      <div className="bg-white rounded-2xl border border-timberwolf/20 p-8">
        <h3 className="text-xl font-bold text-night mb-6">Historique des transactions</h3>
        
        {loadedTransactions.length > 0 ? (
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
                {loadedTransactions.map((transaction) => (
                  <tr key={transaction.id} className="hover:bg-timberwolf/5 transition-colors">
                    <td className="py-4 px-2 text-sm text-night">
                      {new Date(transaction.createdAt).toLocaleDateString('fr-FR')}
                    </td>
                    <td className="py-4 px-2">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        transaction.intentType === 'DEPOSIT' ? 'bg-green-100 text-green-800' :
                        transaction.intentType === 'WITHDRAWAL' ? 'bg-red-100 text-red-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {transaction.intentType === 'DEPOSIT' ? 'Dépôt' :
                         transaction.intentType === 'WITHDRAWAL' ? 'Retrait' : 'Investissement'}
                      </span>
                    </td>
                    <td className="py-4 px-2 text-sm text-night/70">
                      {transaction.paymentMethod}
                    </td>
                    <td className={`py-4 px-2 text-sm font-semibold text-right ${
                      transaction.intentType === 'WITHDRAWAL' ? 'text-red-600' : 'text-green-600'
                    }`}>
                      {transaction.intentType === 'WITHDRAWAL' ? '-' : '+'}{transaction.amount.toLocaleString()} FCFA
                    </td>
                    <td className="py-4 px-2 text-sm font-medium text-right">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        transaction.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                        transaction.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                        transaction.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {transaction.status === 'COMPLETED' ? 'Complété' :
                         transaction.status === 'PENDING' ? 'En attente' :
                         transaction.status === 'REJECTED' ? 'Rejeté' : 'En cours'}
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

        {/* Load More Button - only show if there are more than 5 transactions total and more to load */}
        {totalTransactions > 5 && hasMoreTransactions && (
          <div className="mt-6 flex justify-center">
            <button
              onClick={loadMoreTransactions}
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
      
      {/* Transfer Modal */}
      <TransferModal
        isOpen={showTransferModal}
        onClose={() => setShowTransferModal(false)}
        currentBalance={samaNaffaAccount.balance}
        type={transferType}
        accountName="Mon Compte Naffa Principal"
        onConfirm={handleTransferConfirm}
      />
    </div>
  );
}