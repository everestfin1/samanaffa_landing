"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ArrowLeft, TrendingUp, PlusIcon, ArrowDownIcon } from "lucide-react";
import Link from "next/link";
import { useSelection } from "@/lib/selection-context";
import TransferModal from "@/components/modals/TransferModal";
import KYCVerificationMessage from "@/components/kyc/KYCVerificationMessage";

interface UserAccount {
  id: string;
  accountType: string;
  accountNumber: string;
  productCode?: string | null;
  productName?: string | null;
  balance: number;
  status: string;
  createdAt: string;
}

type KYCStatus = 'PENDING' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED';

export default function SouscrireAPEPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const { selectionData } = useSelection();
  
  const [apeAccount, setApeAccount] = useState<UserAccount | null>(null);
  const [isLoadingAccount, setIsLoadingAccount] = useState(true);
  const [kycStatus, setKycStatus] = useState<KYCStatus>('PENDING');
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [isCreatingAccount, setIsCreatingAccount] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Check if user is logged in
  useEffect(() => {
    if (!session) {
      // Redirect to login with return URL
      router.push('/login?returnUrl=/souscrire-ape');
      return;
    }
  }, [session, router]);

  // Fetch user's APE account and KYC status
  useEffect(() => {
    if (!session?.user) return;

    const fetchAccountData = async () => {
      try {
        setIsLoadingAccount(true);
        
        // Fetch accounts
        const accountsResponse = await fetch('/api/accounts');
        if (accountsResponse.ok) {
          const accountsData = await accountsResponse.json();
          if (accountsData.success) {
            const apeAcc = accountsData.accounts.find(
              (acc: UserAccount) => acc.accountType === 'APE_INVESTMENT'
            );
            setApeAccount(apeAcc || null);
          }
        }

        // Fetch user profile for KYC status
        const profileResponse = await fetch('/api/users/profile');
        if (profileResponse.ok) {
          const profileData = await profileResponse.json();
          if (profileData.success && profileData.user) {
            setKycStatus(profileData.user.kycStatus || 'PENDING');
          }
        }
      } catch (error) {
        console.error('Error fetching account data:', error);
        setError('Erreur lors du chargement de vos informations');
      } finally {
        setIsLoadingAccount(false);
      }
    };

    fetchAccountData();
  }, [session]);

  // Create APE investment account
  const handleCreateAPEAccount = async () => {
    if (!session?.user || isCreatingAccount) return;

    setIsCreatingAccount(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch('/api/accounts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          productId: 'ape_investment',
          accountType: 'APE_INVESTMENT'
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.error || 'Erreur lors de la création du compte APE');
      }

      const data = await response.json();
      if (!data.success || !data.account) {
        throw new Error(data.error || 'Réponse inattendue du serveur');
      }

      setApeAccount(data.account);
      setSuccess('Compte APE créé avec succès ! Vous pouvez maintenant effectuer votre premier investissement.');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur inconnue lors de la création du compte APE';
      setError(message);
    } finally {
      setIsCreatingAccount(false);
    }
  };

  const handleTransferCompleted = async () => {
    setShowTransferModal(false);
    setSuccess('Investissement effectué avec succès !');
    
    // Refresh account data
    try {
      const response = await fetch('/api/accounts');
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          const apeAcc = data.accounts.find(
            (acc: UserAccount) => acc.accountType === 'APE_INVESTMENT'
          );
          setApeAccount(apeAcc || null);
        }
      }
    } catch (error) {
      console.error('Error refreshing account data:', error);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Show loading state
  if (!session || isLoadingAccount) {
    return (
      <div className="min-h-screen bg-background">
        <main className="py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-2xl border border-timberwolf/20 p-8">
              <div className="flex items-center justify-center py-12">
                <div className="w-8 h-8 border-4 border-gold-metallic border-t-transparent rounded-full animate-spin" />
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <main>
        {/* Hero Section */}
        <section className="py-12 bg-card">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-8">
              <Link
                href="/"
                className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors duration-300 mb-6"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Retour à l&apos;APE
              </Link>
              
              <h1 className="text-4xl font-bold text-card-foreground mb-4">
                Investissement APE
              </h1>
              <p className="text-lg text-muted-foreground">
                {selectionData?.type === 'ape' && selectionData.trancheId 
                  ? `Tranche ${selectionData.trancheId} - ${selectionData.duration} à ${selectionData.rate}%`
                  : 'Investissez dans l\'Appel Public à l\'Épargne du Sénégal'
                }
              </p>
            </div>

            {/* Selection Summary */}
            {selectionData?.type === 'ape' && (
              <div className="bg-gradient-to-r from-gold-metallic to-gold-dark rounded-2xl p-6 text-white mb-8">
                <h3 className="text-lg font-semibold mb-4">Votre sélection</h3>
                <div className="grid md:grid-cols-4 gap-4">
                  <div>
                    <div className="text-sm opacity-80">Tranche</div>
                    <div className="text-xl font-bold">Émission {selectionData.trancheId}</div>
                  </div>
                  <div>
                    <div className="text-sm opacity-80">Durée</div>
                    <div className="text-xl font-bold">{selectionData.duration}</div>
                  </div>
                  <div>
                    <div className="text-sm opacity-80">Taux</div>
                    <div className="text-xl font-bold">{selectionData.rate}%</div>
                  </div>
                  <div>
                    <div className="text-sm opacity-80">Valeur nominale</div>
                    <div className="text-xl font-bold">{selectionData.nominalValue}</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Main Content */}
        <section className="py-12 bg-muted">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Success/Error Messages */}
            {success && (
              <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
                <p className="text-green-700 font-medium">{success}</p>
              </div>
            )}
            
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
                <p className="text-red-700 font-medium">{error}</p>
              </div>
            )}

            <div className="bg-card rounded-3xl p-8">
              {!apeAccount ? (
                // No APE account - Show creation option
                <div className="text-center py-12 space-y-6">
                  <div className="w-16 h-16 bg-gold-metallic/10 rounded-full flex items-center justify-center mx-auto">
                    <TrendingUp className="w-8 h-8 text-gold-metallic" />
                  </div>
                  
                  <div>
                    <h2 className="text-2xl font-bold text-card-foreground mb-2">
                      Créer votre compte APE
                    </h2>
                    <p className="text-muted-foreground">
                      Pour investir dans l'APE, vous devez d'abord créer un compte d'investissement.
                    </p>
                  </div>

                  <button
                    onClick={handleCreateAPEAccount}
                    disabled={isCreatingAccount}
                    className={`inline-flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                      !isCreatingAccount
                        ? 'bg-gold-metallic hover:bg-gold-dark text-white shadow-lg hover:shadow-xl'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    {isCreatingAccount ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Création en cours...</span>
                      </>
                    ) : (
                      <>
                        <PlusIcon className="w-5 h-5" />
                        <span>Créer mon compte APE</span>
                      </>
                    )}
                  </button>

                  {/* KYC Information */}
                  <div className="mt-8 p-6 bg-blue-50 border border-blue-200 rounded-xl">
                    <h3 className="font-semibold text-blue-900 mb-2">Information importante</h3>
                    <p className="text-blue-800 text-sm">
                      Vous pouvez commencer à investir immédiatement, même si votre vérification d'identité est en cours. 
                      Les retraits seront disponibles une fois votre identité approuvée.
                    </p>
                  </div>
                </div>
              ) : (
                // Has APE account - Show investment interface
                <div className="space-y-8">
                  {/* Account Summary */}
                  <div className="bg-gradient-to-r from-gold-metallic to-gold-dark rounded-2xl p-6 text-white">
                    <h3 className="text-lg font-semibold mb-4">Votre compte APE</h3>
                    <div className="grid md:grid-cols-3 gap-6">
                      <div>
                        <div className="text-sm opacity-80">Numéro de compte</div>
                        <div className="text-lg font-mono">{apeAccount.accountNumber}</div>
                      </div>
                      <div>
                        <div className="text-sm opacity-80">Solde investi</div>
                        <div className="text-2xl font-bold">{formatCurrency(apeAccount.balance)} FCFA</div>
                      </div>
                      <div>
                        <div className="text-sm opacity-80">Statut</div>
                        <div className="text-lg font-semibold capitalize">{apeAccount.status.toLowerCase()}</div>
                      </div>
                    </div>
                  </div>

                  {/* Investment Actions */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-white rounded-2xl border border-timberwolf/20 p-6">
                      <h4 className="text-lg font-semibold text-night mb-4">Effectuer un investissement</h4>
                      <p className="text-night/70 text-sm mb-6">
                        Investissez dans l'APE avec des montants flexibles. Minimum 10,000 FCFA.
                      </p>
                      <button
                        onClick={() => setShowTransferModal(true)}
                        className="w-full bg-gold-metallic text-white py-3 px-4 rounded-xl font-semibold hover:bg-gold-dark transition-colors flex items-center justify-center space-x-2"
                      >
                        <ArrowDownIcon className="w-5 h-5" />
                        <span>Investir maintenant</span>
                      </button>
                    </div>

                    <div className="bg-white rounded-2xl border border-timberwolf/20 p-6">
                      <h4 className="text-lg font-semibold text-night mb-4">Statut de vérification</h4>
                      <KYCVerificationMessage
                        kycStatus={kycStatus}
                        variant="inline"
                        onContactSupport={() => window.open('/contact', '_blank')}
                        onRestartRegistration={() => window.open('/register', '_blank')}
                      />
                    </div>
                  </div>

                  {/* Investment Information */}
                  {selectionData?.type === 'ape' && selectionData.additionalInfo && (
                    <div className="bg-white rounded-2xl border border-timberwolf/20 p-6">
                      <h4 className="text-lg font-semibold text-night mb-4">Détails de l'émission</h4>
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <div className="text-sm text-night/60 mb-1">Maturité</div>
                          <div className="font-semibold">{selectionData.additionalInfo.maturite}</div>
                        </div>
                        <div>
                          <div className="text-sm text-night/60 mb-1">Différé</div>
                          <div className="font-semibold">{selectionData.additionalInfo.differe}</div>
                        </div>
                        <div>
                          <div className="text-sm text-night/60 mb-1">Remboursement</div>
                          <div className="font-semibold">{selectionData.additionalInfo.remboursement}</div>
                        </div>
                        <div>
                          <div className="text-sm text-night/60 mb-1">Montant de l'émission</div>
                          <div className="font-semibold">{selectionData.amount}</div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </section>
      </main>

      {/* Transfer Modal */}
      {apeAccount && (
        <TransferModal
          isOpen={showTransferModal}
          onClose={() => setShowTransferModal(false)}
          currentBalance={apeAccount.balance}
          type="deposit"
          accountName="Compte APE"
          accountType="ape_investment"
          kycStatus={kycStatus}
          onConfirm={handleTransferCompleted}
        />
      )}
    </div>
  );
}
