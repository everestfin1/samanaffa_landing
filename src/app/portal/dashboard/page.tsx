'use client';

import { useSession, signOut } from 'next-auth/react';
import { useUserProfile } from '../../../hooks/useUserProfile';
import { useRecentTransactions } from '../../../hooks/useTransactions';
import {
  UserIcon,
  ShieldCheckIcon,
  DocumentTextIcon,
  CameraIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ClockIcon,
  EyeIcon,
  ArrowRightIcon,
  ArrowDownTrayIcon,
  ArrowUpTrayIcon,
  BanknotesIcon,
  ChartBarIcon,
  DevicePhoneMobileIcon,
  BuildingLibraryIcon,
  BellIcon,
  QuestionMarkCircleIcon,
  PhoneIcon,
  StarIcon
} from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import PortalHeader from '../../../components/portal/PortalHeader';
import { SavingsPlanner } from '../../../components/SamaNaffa/SavingsPlanner';
import ProfileCompletionModal from '../../../components/portal/ProfileCompletionModal';
import KYCInitiationModal from '../../../components/portal/KYCInitiationModal';
import type { PendingOnboardingDeposit } from '../../../components/portal/OnboardingDepositModal';
import { meetsPortalCommunicationsRequirements } from '@/lib/portal-profile-completion';

type KYCStatus = 'PENDING' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED';

interface KYCStep {
  id: string;
  title: string;
  description: string;
  status: 'completed' | 'current' | 'pending' | 'failed';
  required: boolean;
}

interface UserData {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  kycStatus: KYCStatus;
  isNewUser: boolean;
  profileCompletionStatus?: string;
  dateOfBirth?: string;
  address?: string;
  city?: string;
  country?: string;
  statutEmploi?: string;
  termsAccepted?: boolean;
  privacyAccepted?: boolean;
  accounts: Array<{
    id: string;
    accountType: string;
    accountNumber: string;
    balance: number;
    status: string;
  }>;
}

interface TransactionIntent {
  id: string;
  accountType: string;
  intentType: string;
  type: 'DEPOSIT' | 'WITHDRAWAL' | 'INVESTMENT';
  amount: number;
  paymentMethod: string;
  status: string;
  referenceNumber: string;
  createdAt: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [isProfileIncomplete, setIsProfileIncomplete] = useState(false);
  const [showKycModal, setShowKycModal] = useState(false);
  const [pendingDeposit, setPendingDeposit] = useState<PendingOnboardingDeposit | null>(null);

  // Use Tanstack Query hooks for data fetching
  const { data: userData, isLoading: isLoadingProfile, error: profileError } = useUserProfile();
  const { data: recentTransactions = [], isLoading: isLoadingTransactions, error: transactionsError } = useRecentTransactions(userData?.id || '', 5);

  // Check if profile is incomplete (has .tmp email or missing required fields).
  // GET /api/users/profile must return profileCompletionStatus + consents so this stays in sync with the DB.
  useEffect(() => {
    if (!userData) return;

    const done =
      userData.profileCompletionStatus === 'COMPLETE' ||
      meetsPortalCommunicationsRequirements(userData);

    if (done) {
      setIsProfileIncomplete(false);
      setShowProfileModal(false);
      return;
    }

    setIsProfileIncomplete(true);
    setShowProfileModal(true);
  }, [userData]);

  // Post-KYC: prompt user to confirm programmed onboarding deposit via Intouch
  useEffect(() => {
    if (!userData || isProfileIncomplete) return;
    if (userData.kycStatus !== 'APPROVED') return;

    let cancelled = false;
    (async () => {
      try {
        const res = await fetch('/api/onboarding/pending-deposit');
        if (!res.ok || cancelled) return;
        const data = await res.json();
        if (data.intent && !cancelled) {
          setPendingDeposit(data.intent);
        }
      } catch {
        // non-fatal
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [userData, isProfileIncomplete]);

  // Calculate APE investment total from completed transactions
  const apeInvestmentTotal = recentTransactions
    .filter(tx => tx.accountType === 'APE_INVESTMENT' && tx.intentType === 'INVESTMENT' && tx.status === 'COMPLETED')
    .reduce((sum, tx) => sum + tx.amount, 0);

  // Combined loading and error states
  const isLoading = isLoadingProfile || isLoadingTransactions;
  const error = profileError?.message || transactionsError?.message || '';

  // Redirect to login if not authenticated
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-light flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-gold-metallic border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-night/70">Vérification de l'authentification...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    router.push('/login');
    return null;
  }

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/login' });
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-light flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-gold-metallic border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-night/70">Chargement de votre tableau de bord...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error || (!isLoading && !userData)) {
    return (
      <div className="min-h-screen bg-gray-light flex items-center justify-center">
        <div className="text-center">
          <ExclamationTriangleIcon className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-night/70 mb-4">
            {error || 'Erreur lors du chargement de votre tableau de bord'}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="bg-gold-metallic text-white px-6 py-2 rounded-lg font-medium hover:bg-gold-dark transition-colors"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  const kycStatus = (userData?.kycStatus as KYCStatus) || 'PENDING';

  const renderApprovedDashboard = () => (
    <div className="space-y-8">
      {kycStatus !== 'APPROVED' && (
        <div
          className={`rounded-2xl p-5 border ${
            kycStatus === 'REJECTED'
              ? 'bg-red-50 border-red-200'
              : 'bg-amber-50 border-amber-200'
          }`}
        >
          <p className="font-semibold text-night">
            {kycStatus === 'REJECTED'
              ? 'Vérification d\'identité à reprendre'
              : kycStatus === 'UNDER_REVIEW'
                ? 'Vérification d\'identité en cours d\'examen'
                : 'Vérification d\'identité requise'}
          </p>
          <p className="text-sm text-night/70 mt-1">
            {kycStatus === 'REJECTED'
              ? 'Veuillez relancer votre vérification pour accéder à toutes les fonctionnalités.'
              : kycStatus === 'UNDER_REVIEW'
                ? 'Notre équipe examine votre dossier (généralement moins de 24 h).'
                : 'Finalisez votre KYC pour débloquer les versements et retraits.'}
          </p>
          {(kycStatus === 'PENDING' || kycStatus === 'REJECTED') && (
            <button
              type="button"
              onClick={() => setShowKycModal(true)}
              className="mt-3 text-sm font-medium text-gold-metallic hover:underline"
            >
              {kycStatus === 'REJECTED' ? 'Relancer la vérification' : 'Compléter la vérification'}
            </button>
          )}
        </div>
      )}

      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-gold-light/20 to-gold-metallic/10 rounded-2xl p-8 border border-gold-metallic/20">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-night mb-2">
              Bienvenue, {userData?.firstName} !
            </h1>
            <p className="text-night/70 text-lg">
              Votre tableau de bord financier personnel
            </p>
          </div>
          <div className="hidden md:block">
            <div className="bg-gold-metallic/10 p-4 rounded-full">
              <ChartBarIcon className="w-12 h-12 text-gold-metallic" />
            </div>
          </div>
        </div>
      </div>


      {pendingDeposit && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="font-semibold text-amber-900">Premier versement à confirmer</p>
            <p className="text-sm text-amber-800/90 mt-1">
              Votre identité est validée. Finalisez votre versement de{' '}
              {pendingDeposit.amount.toLocaleString('fr-FR')} FCFA via Intouch.
            </p>
          </div>
          <button
            type="button"
            onClick={() => router.push('/portal/sama-naffa?confirmDeposit=1')}
            className="shrink-0 px-5 py-2.5 bg-gold-metallic text-white rounded-lg font-semibold hover:bg-gold-dark transition-colors"
          >
            Gérer sur Sama Naffa
          </button>
        </div>
      )}

      {/* Quick Access Cards */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-night">Accès rapide</h2>
          <div className="h-px bg-gradient-to-r from-gold-metallic/20 to-transparent flex-1 ml-4"></div>
        </div>
        
        <button
          onClick={() => router.push('/portal/sama-naffa')}
          className="group w-full bg-gradient-to-br from-sama-primary-green/5 to-sama-primary-green-light/10 rounded-2xl border-2 border-sama-primary-green/20 p-8 hover:shadow-xl hover:shadow-sama-primary-green/10 transition-all duration-300 text-left hover:border-sama-primary-green/40 hover:scale-[1.01]"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="flex items-center space-x-4">
              <div className="bg-sama-primary-green p-4 rounded-2xl shadow-lg shrink-0">
                <DevicePhoneMobileIcon className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-xl text-night group-hover:text-sama-primary-green transition-colors">
                  Sama Naffa
                </h3>
                <p className="text-sm text-night/60 font-medium">Votre épargne gérée</p>
              </div>
            </div>
            <p className="text-sm text-night/70 leading-relaxed md:max-w-md md:text-center">
              Suivez vos objectifs d&apos;épargne et la valeur de votre Naffa, géré pour votre compte.
            </p>
            <div className="flex items-center text-sama-primary-green text-sm font-bold group-hover:text-sama-primary-green transition-colors shrink-0">
              <span>Accéder au service</span>
              <ArrowRightIcon className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </button>
      </div>

      {/* Savings Planner Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-night">Planificateur d'épargne</h2>
          <div className="h-px bg-gradient-to-r from-gold-metallic/20 to-transparent flex-1 ml-4"></div>
        </div>
        
        <div className="bg-white rounded-2xl border border-timberwolf/20 p-8">
          <SavingsPlanner redirectTo="sama-naffa" />
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-2xl border border-timberwolf/20 p-8">
        <h2 className="text-xl font-bold text-night mb-6">Activité récente</h2>
        <div className="space-y-4">
          {recentTransactions.length > 0 ? (
            recentTransactions.map((transaction) => (
              <div key={transaction.id} className="flex items-center space-x-4 p-4 border border-timberwolf/20 rounded-lg">
                <div className="w-10 h-10 bg-gold-metallic/10 rounded-full flex items-center justify-center">
                  {transaction.type === 'DEPOSIT' ? (
                    <ArrowDownTrayIcon className="w-5 h-5 text-gold-metallic" />
                  ) : transaction.type === 'WITHDRAWAL' ? (
                    <ArrowUpTrayIcon className="w-5 h-5 text-gold-metallic" />
                  ) : (
                    <BuildingLibraryIcon className="w-5 h-5 text-gold-metallic" />
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-night">
                    {transaction.type === 'DEPOSIT' ? 'Versement' : 
                     transaction.type === 'WITHDRAWAL' ? 'Retrait' : 
                     'Opération'}
                  </h3>
                  <p className="text-sm text-night/70">
                    {transaction.type === 'WITHDRAWAL' ? '-' : '+'}{transaction.amount.toLocaleString('fr-FR')} FCFA
                    {transaction.accountType && ` - ${transaction.accountType === 'SAMA_NAFFA' ? 'Sama Naffa' : 
                      transaction.accountType === 'APE_INVESTMENT' ? 'APE' : transaction.accountType}`}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-sm text-night/60">
                    {new Date(transaction.createdAt).toLocaleDateString('fr-FR')}
                  </span>
                  <div className={`text-xs mt-1 ${
                    transaction.status === 'COMPLETED' ? 'text-green-600' :
                    transaction.status === 'PENDING' ? 'text-yellow-600' :
                    'text-red-600'
                  }`}>
                    {transaction.status === 'COMPLETED' ? 'Complété' :
                     transaction.status === 'PENDING' ? 'En attente' :
                     'Échoué'}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <div className="bg-gold-metallic/10 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <ClockIcon className="w-8 h-8 text-gold-metallic" />
              </div>
              <p className="text-night/60">Aucune transaction récente</p>
              <p className="text-sm text-night/40">Vos transactions apparaîtront ici</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );


  return (
    <div className="min-h-screen bg-gray-light">
      <PortalHeader
        userData={{
          firstName: userData?.firstName || '',
          lastName: userData?.lastName || '',
          email: userData?.email || '',
          phone: userData?.phone || '',
          userId: userData?.id || '',
          isNewUser: false,
          kycStatus: (userData?.kycStatus as KYCStatus) || 'PENDING'
        }}
        kycStatus={(userData?.kycStatus as KYCStatus) || 'PENDING'}
        activeTab="dashboard"
        setActiveTab={() => {}} // Not used with navigation
        onLogout={handleLogout}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderApprovedDashboard()}
      </main>

      {/* Profile completion modal — non-dismissible when profile is incomplete */}
      <ProfileCompletionModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        dismissible={!isProfileIncomplete}
        initialData={
          userData
            ? {
                email: userData.email,
                termsAccepted: userData.termsAccepted,
                privacyAccepted: userData.privacyAccepted,
                marketingAccepted: userData.marketingAccepted,
              }
            : undefined
        }
      />

      <KYCInitiationModal
        isOpen={showKycModal}
        onClose={() => setShowKycModal(false)}
        onComplete={() => window.location.reload()}
      />

    </div>
  );
}
