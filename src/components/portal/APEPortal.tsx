'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import {
  BuildingLibraryIcon,
  BanknotesIcon,
  ArrowTrendingUpIcon,
  ArrowDownIcon,
  InformationCircleIcon,
  CheckCircleIcon,
  PlusIcon,
  ShieldCheckIcon,
  EyeIcon,
  EyeSlashIcon
} from '@heroicons/react/24/outline';
import InvestmentModal from '../modals/InvestmentModal';
import { ArrowRightIcon } from 'lucide-react';

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
  investmentTranche?: string;
  investmentTerm?: number;
}

interface Investment {
  id: string;
  tranche: 'A' | 'B' | 'C' | 'D';
  amount: number;
  term: 3 | 5 | 7 | 10;
  interestRate: number;
  purchaseDate: string;
  nextPayment: string;
  totalValue: number;
}

interface APEPortalProps {
  kycStatus?: 'PENDING' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED';
}

export default function APEPortal({ kycStatus = 'APPROVED' }: APEPortalProps) {
  const { data: session } = useSession();
  const [showInvestmentModal, setShowInvestmentModal] = useState(false);
  const [selectedTranche, setSelectedTranche] = useState<'A' | 'B' | 'C' | 'D' | null>(null);
  const [showBalance, setShowBalance] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Real data from backend
  const [apeAccount, setApeAccount] = useState<UserAccount | null>(null);
  const [transactionHistory, setTransactionHistory] = useState<TransactionIntent[]>([]);
  const [investments, setInvestments] = useState<Investment[]>([]);

  // Pagination state
  const [loadedTransactions, setLoadedTransactions] = useState<TransactionIntent[]>([]);
  const [totalTransactions, setTotalTransactions] = useState(0);
  const [hasMoreTransactions, setHasMoreTransactions] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Fetch user's APE account data
  useEffect(() => {
    const fetchAccountData = async () => {
      if (!session) return;

      try {
        // Fetch user accounts
        const accountsResponse = await fetch('/api/accounts');
        const accountsData = await accountsResponse.json();

        if (accountsData.success) {
          const apeAcc = accountsData.accounts.find(
            (acc: UserAccount) => acc.accountType === 'APE_INVESTMENT'
          );
          setApeAccount(apeAcc || null);
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
        const apeTransactions = transactionsData.transactionIntents.filter(
          (tx: TransactionIntent) => tx.accountType === 'APE_INVESTMENT'
        );

        if (offset === 0) {
          // First load
          setLoadedTransactions(apeTransactions);
          setTotalTransactions(transactionsData.pagination.total);
          setHasMoreTransactions(transactionsData.pagination.hasMore);
        } else {
          // Load more - append to existing
          setLoadedTransactions(prev => [...prev, ...apeTransactions]);
          setHasMoreTransactions(transactionsData.pagination.hasMore);
        }

        // Update full transaction history for other operations
        const allTransactionsResponse = await fetch(`/api/transactions/intent?userId=${(session.user as any).id}`);
        const allTransactionsData = await allTransactionsResponse.json();

        if (allTransactionsData.success) {
          const allApeTransactions = allTransactionsData.transactionIntents.filter(
            (tx: TransactionIntent) => tx.accountType === 'APE_INVESTMENT'
          );
          setTransactionHistory(allApeTransactions);

          // Convert transaction intents to investment format for display
          const investmentData = allApeTransactions
            .filter((tx: TransactionIntent) => tx.intentType === 'INVESTMENT' && tx.status === 'COMPLETED')
            .map((tx: TransactionIntent) => ({
              id: tx.id,
              tranche: tx.investmentTranche as 'A' | 'B' | 'C' | 'D',
              amount: tx.amount,
              term: tx.investmentTerm as 3 | 5 | 7 | 10,
              interestRate: getInterestRateForTranche(tx.investmentTranche as 'A' | 'B' | 'C' | 'D'),
              purchaseDate: tx.createdAt,
              nextPayment: calculateNextPayment(tx.createdAt, tx.investmentTerm as number),
              totalValue: calculateTotalValue(tx.amount, tx.investmentTranche as 'A' | 'B' | 'C' | 'D', tx.investmentTerm as number)
            }));
          setInvestments(investmentData);
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

  // Helper functions
  const getInterestRateForTranche = (tranche: 'A' | 'B' | 'C' | 'D'): number => {
    const rates = { A: 6.40, B: 6.60, C: 6.75, D: 6.95 };
    return rates[tranche];
  };

  const calculateNextPayment = (purchaseDate: string, term: number): string => {
    const date = new Date(purchaseDate);
    date.setMonth(date.getMonth() + 6); // Semi-annual payments
    return date.toISOString().split('T')[0];
  };

  const calculateTotalValue = (amount: number, tranche: 'A' | 'B' | 'C' | 'D', term: number): number => {
    const rate = getInterestRateForTranche(tranche);
    return Math.round(amount * (1 + rate / 100 * term));
  };

  const trancheOptions = [
    { value: 'A' as const, label: 'Tranche A', term: 3, rate: 6.40, description: 'Court terme - 3 ans', isin: 'SN0000004268' },
    { value: 'B' as const, label: 'Tranche B', term: 5, rate: 6.60, description: 'Moyen terme - 5 ans', isin: 'SN0000004276' },
    { value: 'C' as const, label: 'Tranche C', term: 7, rate: 6.75, description: 'Long terme - 7 ans', isin: 'SN0000004284' },
    { value: 'D' as const, label: 'Tranche D', term: 10, rate: 6.95, description: 'Très long terme - 10 ans', isin: 'SN0000004292' }
  ];

  const handleInvestmentConfirm = async (data: { amount: number; tranche: 'A' | 'B' | 'C' | 'D'; method: string }) => {
    // This function is no longer used since we redirect to WhatsApp directly
    // The modal now handles the WhatsApp redirect internally
    setShowInvestmentModal(false);
    setSelectedTranche(null);
  };

  const getTermForTranche = (tranche: 'A' | 'B' | 'C' | 'D'): number => {
    const terms = { A: 3, B: 5, C: 7, D: 10 };
    return terms[tranche];
  };

  const getIsinForTranche = (tranche: 'A' | 'B' | 'C' | 'D'): string => {
    const isins = { A: 'SN0000004268', B: 'SN0000004276', C: 'SN0000004284', D: 'SN0000004292' };
    return isins[tranche];
  };

  const handleTrancheClick = (tranche: 'A' | 'B' | 'C' | 'D') => {
    setSelectedTranche(tranche);
    setShowInvestmentModal(true);
  };

  const totalInvestment = investments.reduce((sum, inv) => sum + inv.amount, 0);
  const totalProjectedValue = investments.reduce((sum, inv) => sum + inv.totalValue, 0);

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-8">
        {/* <div className="bg-gradient-to-r from-gold-light/20 to-gold-metallic/10 rounded-2xl p-8 border border-gold-metallic/20">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-night mb-2">Emprunt Obligataire</h2>
              <p className="text-night/70 text-lg">Chargement de votre portefeuille...</p>
            </div>
            <div className="hidden md:block">
              <div className="bg-gold-metallic/10 p-4 rounded-full">
                <BuildingLibraryIcon className="w-12 h-12 text-gold-metallic" />
              </div>
            </div>
          </div>
        </div> */}

        {/* Portfolio Overview Skeleton */}
        <div className="grid grid-cols-1 gap-6">
          <div>
            <div className="relative bg-gold-metallic rounded-2xl p-8 text-white overflow-hidden">
              {/* Grainy texture overlay */}
              <div className="absolute inset-0 opacity-30 z-10" style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                mixBlendMode: 'overlay'
              }}></div>

              {/* Decorative circles */}
              <div className="absolute top-4 right-4 w-32 h-32 border border-white/10 rounded-full"></div>
              <div className="absolute top-8 right-8 w-24 h-24 border border-white/10 rounded-full"></div>
              <div className="absolute -top-4 -right-4 w-16 h-16 border border-white/10 rounded-full"></div>

              {/* Logo */}
              <div className="absolute top-6 right-6 z-50">
                <div className="bg-white/20 px-3 py-1 rounded-lg backdrop-blur-sm">
                  <span className="text-xs font-bold text-white">APE</span>
                </div>
              </div>

              {/* Card Content Skeleton */}
              <div className="relative z-10 h-full flex flex-col">
                {/* Header Section */}
                <div className="mb-6">
                  <h4 className="text-lg font-medium text-white/90 mb-2">Investissement Total</h4>
                  <div className="flex items-center space-x-3">
                    <div className="text-3xl font-bold tracking-wider">••••••••••••</div>
                    <EyeIcon className="w-6 h-6 text-white/80" />
                  </div>
                </div>

                {/* Main Content Grid */}
                <div className="flex-1 grid grid-cols-2 gap-6">
                  {/* Left Column */}
                  <div className="space-y-4">
                    <div>
                      <p className="text-white/70 text-sm mb-1">Compte N°</p>
                      <div className="h-5 bg-white/20 rounded animate-pulse"></div>
                    </div>

                    <div>
                      <p className="text-white/70 text-sm mb-1">Investissements actifs</p>
                      <div className="h-8 bg-white/20 rounded animate-pulse"></div>
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-4">
                    <div>
                      <p className="text-white/70 text-sm mb-1">Rendement moyen</p>
                      <div className="h-8 bg-white/20 rounded animate-pulse"></div>
                    </div>

                    <div>
                      <p className="text-white/70 text-sm mb-1">Valeur projetée</p>
                      <div className="h-6 bg-white/20 rounded animate-pulse"></div>
                    </div>
                  </div>
                </div>
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
        {/* <div className="bg-gradient-to-r from-gold-light/20 to-gold-metallic/10 rounded-2xl p-8 border border-gold-metallic/20">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-night mb-2">Emprunt Obligataire</h2>
              <p className="text-night/70 text-lg">Erreur lors du chargement</p>
            </div>
            <div className="hidden md:block">
              <div className="bg-gold-metallic/10 p-4 rounded-full">
                <BuildingLibraryIcon className="w-12 h-12 text-gold-metallic" />
              </div>
            </div>
          </div>
        </div> */}
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

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      {/* <div className="bg-gradient-to-r from-gold-light/20 to-gold-metallic/10 rounded-2xl p-8 border border-gold-metallic/20">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-night mb-2">Emprunt Obligataire</h2>
            <p className="text-night/70 text-lg">Investissez dans les obligations d'État du Sénégal</p>
          </div>
          <div className="hidden md:block">
            <div className="bg-gold-metallic/10 p-4 rounded-full">
              <BuildingLibraryIcon className="w-12 h-12 text-gold-metallic" />
            </div>
          </div>
        </div>
      </div> */}

      {/* Portfolio Overview */}
      <div className="grid grid-cols-1 gap-6">
        {/* Investment Total Card */}
        <div>
          <div className="relative bg-gold-metallic rounded-2xl p-8 text-white overflow-hidden">
            {/* Grainy texture overlay */}
            <div className="absolute inset-0 opacity-30 z-10" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
              mixBlendMode: 'overlay'
            }}></div>
            
            {/* Decorative circles */}
            <div className="absolute top-4 right-4 w-32 h-32 border border-white/10 rounded-full"></div>
            <div className="absolute top-8 right-8 w-24 h-24 border border-white/10 rounded-full"></div>
            <div className="absolute -top-4 -right-4 w-16 h-16 border border-white/10 rounded-full"></div>
            
            {/* Logo */}
            <div className="absolute top-6 right-6 z-50">
              <div className="bg-white/20 px-3 py-1 rounded-lg backdrop-blur-sm">
                <span className="text-xs font-bold text-white">APE</span>
              </div>
            </div>

            {/* Card Content */}
            <div className="relative z-10 h-full flex flex-col">
              {/* Header Section */}
              <div className="mb-6">
                <h4 className="text-lg font-medium text-white/90 mb-2">Investissement Total</h4>
                <div className="flex items-center space-x-3">
                  <div className="text-3xl font-bold tracking-wider">
                    {showBalance ? `${Number(totalInvestment).toLocaleString()} FCFA` : '••••••••••••'}
                  </div>
                  <button
                    onClick={() => setShowBalance(!showBalance)}
                    className="text-white/80 hover:text-white transition-colors"
                  >
                    {showBalance ? <EyeSlashIcon className="w-6 h-6" /> : <EyeIcon className="w-6 h-6" />}
                  </button>
                </div>
              </div>

              {/* Main Content Grid */}
              <div className="flex-1 grid grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-4">
                <div>
                  <p className="text-white/70 text-sm mb-1">Compte N°</p>
                  <p className="text-lg font-mono tracking-wider">{apeAccount?.accountNumber || 'APE-2025-001'}</p>
                </div>
                
                <div>
                  <p className="text-white/70 text-sm mb-1">Investissements actifs</p>
                  <p className="text-2xl font-bold">{investments.length}</p>
                </div>
              </div>

                {/* Right Column */}
                <div className="space-y-4">
                  <div>
                    <p className="text-white/70 text-sm mb-1">Rendement moyen</p>
                    <p className="text-2xl font-bold text-gold-light">
                      {investments.length > 0 
                        ? (investments.reduce((sum, inv) => sum + inv.interestRate, 0) / investments.length).toFixed(2)
                        : '0.00'
                      }%
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-white/70 text-sm mb-1">Valeur projetée</p>
                    <div className="flex items-baseline gap-2">
                      <p className="text-xl font-bold">{showBalance ? `${totalProjectedValue.toLocaleString()} FCFA` : '••••••••••••'}</p>
                      {showBalance && (
                        <p className="text-sm font-medium">
                          (+{(totalProjectedValue - totalInvestment).toLocaleString()})
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>


      </div>

      {/* Investment Tranches */}
      <div className="bg-white rounded-2xl border border-timberwolf/20 p-8">
        <div className="mb-8">
          <h3 className="text-xl font-bold text-night mb-2">Choisissez Votre Tranche d'Investissement</h3>
          <p className="text-night/70">4 options d'investissement adaptées à vos objectifs financiers</p>
        </div>

        <div className="grid md:grid-cols-4 gap-6">
          {trancheOptions.map((option, index) => {
            const colors = [
              { bg: 'bg-green-500', text: 'text-white' }, // Emission A - Green
              { bg: 'bg-yellow-400', text: 'text-black' }, // Emission B - Yellow
              { bg: 'bg-red-600', text: 'text-white' },    // Emission C - Red
              { bg: 'bg-gray-700', text: 'text-white' }    // Emission D - Dark Gray
            ];
            const color = colors[index];
            
            return (
              <div 
                key={option.value}
                className="bg-white rounded-2xl border border-timberwolf/20 p-6 hover:shadow-lg transition-all duration-300 group"
              >
                {/* Header with colored background */}
                <div className={`${color.bg} rounded-t-2xl -m-6 mb-4 p-4 ${color.text}`}>
                  <h4 className="font-bold text-lg uppercase">Emission {option.value}</h4>
                </div>
                
                {/* Interest Rate */}
                <div className="text-center mb-6">
                  <div className="text-4xl font-bold text-night mb-2">{option.rate}%</div>
                  <div className="text-sm text-night/60">SUR {option.term} ANS</div>
                </div>
                
                {/* Nominal Value */}
                <div className="border-t border-timberwolf/20 pt-4 mb-6">
                  <div className="text-sm text-night/60 mb-1">VALEUR NOMINALE:</div>
                  <div className="font-bold text-night">10 000 FCFA*</div>
                </div>
                
                {/* ISIN Code */}
                <div className="mb-4">
                  <div className="text-sm text-night/60 mb-1">Code ISIN:</div>
                  <div className="font-mono text-sm text-night bg-timberwolf/10 px-3 py-2 rounded-lg">
                    {option.isin}
                  </div>
                </div>

                {/* Emission Amount */}
                <div className="mb-6">
                  <div className="text-sm text-night/60 mb-1">Montant de l'émission:</div>
                  <div className="font-bold text-night">
                    {option.value === 'A' && '60 milliards de FCFA'}
                    {option.value === 'B' && '100 milliards de FCFA'}
                    {option.value === 'C' && '80 milliards de FCFA'}
                    {option.value === 'D' && '60 milliards de FCFA'}
                  </div>
                </div>
                
                {/* Invest Button */}
                <button
                  onClick={() => handleTrancheClick(option.value)}
                  className="w-full bg-gold-metallic text-white py-3 px-4 rounded-lg font-semibold hover:bg-gold-dark transition-colors flex items-center justify-center space-x-2 group-hover:scale-105 transform duration-200"
                >
                  <span>J'investis</span>
                  <ArrowRightIcon className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Investment History */}
      <div className="bg-white rounded-2xl border border-timberwolf/20 p-8">
        <h3 className="text-xl font-bold text-night mb-6">Historique des investissements</h3>

        {loadedTransactions.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-timberwolf/20">
                  <th className="text-left py-3 px-2 text-sm font-semibold text-night/70">Date</th>
                  <th className="text-left py-3 px-2 text-sm font-semibold text-night/70">Type</th>
                  <th className="text-left py-3 px-2 text-sm font-semibold text-night/70">Tranche</th>
                  <th className="text-left py-3 px-2 text-sm font-semibold text-night/70">ISIN</th>
                  <th className="text-right py-3 px-2 text-sm font-semibold text-night/70">Montant</th>
                  <th className="text-right py-3 px-2 text-sm font-semibold text-night/70">Taux</th>
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
                        transaction.intentType === 'INVESTMENT' ? 'bg-blue-100 text-blue-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {transaction.intentType === 'INVESTMENT' ? 'Investissement' : 'Intérêts'}
                      </span>
                    </td>
                    <td className="py-4 px-2 text-sm text-night/70">
                      {transaction.investmentTranche ? `Tranche ${transaction.investmentTranche}` : '-'}
                    </td>
                    <td className="py-4 px-2 text-sm text-night/70 font-mono">
                      {transaction.investmentTranche ? 
                        getIsinForTranche(transaction.investmentTranche as 'A' | 'B' | 'C' | 'D')
                        : '-'}
                    </td>
                    <td className={`py-4 px-2 text-sm font-semibold text-right ${
                      transaction.intentType === 'INVESTMENT' ? 'text-blue-600' : 'text-green-600'
                    }`}>
                      +{transaction.amount.toLocaleString()} FCFA
                    </td>
                    <td className="py-4 px-2 text-sm font-medium text-right text-night">
                      {transaction.investmentTranche ? getInterestRateForTranche(transaction.investmentTranche as 'A' | 'B' | 'C' | 'D') : '-'}%
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
              <BuildingLibraryIcon className="w-8 h-8 text-gold-metallic" />
            </div>
            <p className="text-night/60">Aucun investissement récent</p>
            <p className="text-sm text-night/40">Vos investissements APE apparaîtront ici</p>
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
                <span>Charger plus d'investissements</span>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Investment Modal */}
      <InvestmentModal
        isOpen={showInvestmentModal}
        onClose={() => {
          setShowInvestmentModal(false);
          setSelectedTranche(null);
        }}
        onConfirm={handleInvestmentConfirm}
        preselectedTranche={selectedTranche}
        kycStatus={kycStatus}
        accountType="ape_investment"
      />
    </div>
  );
}