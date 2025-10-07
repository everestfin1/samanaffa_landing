'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import PaymentMethodSelect from '../forms/PaymentMethodSelect';
import IntouchPayment from '../payments/IntouchPayment';

interface InvestmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data: InvestmentData) => void;
  preselectedTranche?: 'A' | 'B' | 'C' | 'D' | null;
  kycStatus?: 'PENDING' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED';
  accountType?: 'ape_investment';
}

interface InvestmentData {
  amount: number;
  tranche: 'A' | 'B' | 'C' | 'D';
  method: string;
}

const trancheOptions = [
  { value: 'A' as const, label: 'Tranche A', term: 3, rate: 6.40, description: 'Court terme - 3 ans', isin: 'SN0000004268' },
  { value: 'B' as const, label: 'Tranche B', term: 5, rate: 6.60, description: 'Moyen terme - 5 ans', isin: 'SN0000004276' },
  { value: 'C' as const, label: 'Tranche C', term: 7, rate: 6.75, description: 'Long terme - 7 ans', isin: 'SN0000004284' },
  { value: 'D' as const, label: 'Tranche D', term: 10, rate: 6.95, description: 'Très long terme - 10 ans', isin: 'SN0000004292' }
];

export default function InvestmentModal({
  isOpen,
  onClose,
  onConfirm,
  preselectedTranche,
  kycStatus = 'APPROVED',
  accountType = 'ape_investment'
}: InvestmentModalProps) {
  const { data: session } = useSession();
  const [amount, setAmount] = useState<string>('100000');
  const [tranche, setTranche] = useState<'A' | 'B' | 'C' | 'D'>(preselectedTranche || 'D');
  const [method, setMethod] = useState<string>('intouch');
  const [error, setError] = useState<string>('');
  const [showIntouchPayment, setShowIntouchPayment] = useState<boolean>(false);
  const [referenceNumber, setReferenceNumber] = useState<string>('');
  const [isPreflightChecking, setIsPreflightChecking] = useState<boolean>(false);
  const [preflightMessage, setPreflightMessage] = useState<string>('');

  // Update tranche when preselectedTranche changes
  useEffect(() => {
    if (preselectedTranche) {
      setTranche(preselectedTranche);
    }
  }, [preselectedTranche]);

  const calculateProjectedValue = (amount: number, tranche: 'A' | 'B' | 'C' | 'D') => {
    const option = trancheOptions.find(t => t.value === tranche);
    if (!option) return 0;
    
    const semiAnnualRate = option.rate / 2 / 100;
    const periods = option.term * 2;
    const semiAnnualPayment = amount * semiAnnualRate;
    const totalInterest = semiAnnualPayment * periods;
    return amount + totalInterest;
  };

  const handleAmountChange = (value: string) => {
    setAmount(value);
    setError(''); // Clear error when user types
  };

  const generateReferenceNumber = () => {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `${accountType.toUpperCase()}-INVESTMENT-${timestamp}-${random}`;
  };

  const runPreflightChecks = async (requestedAmount: number) => {
    setIsPreflightChecking(true);
    setPreflightMessage('Vérification de votre compte et de votre identité...');
    setError('');

    try {
      const sessionUserId = (session?.user as any)?.id;
      if (!sessionUserId) {
        throw new Error('Votre session a expiré. Veuillez vous reconnecter.');
      }

      const supportedAccountTypes: Array<'ape_investment'> = ['ape_investment'];
      if (!supportedAccountTypes.includes(accountType)) {
        throw new Error('Type de compte non pris en charge pour les paiements Intouch.');
      }

      const response = await fetch('/api/accounts', {
        method: 'GET',
        cache: 'no-store',
      });

      if (!response.ok) {
        throw new Error('Impossible de vérifier vos comptes. Veuillez réessayer plus tard.');
      }

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.error || 'Aucun compte valide trouvé.');
      }

      const normalizedAccountType = accountType.toUpperCase();
      const matchingAccount = (data.accounts || []).find(
        (account: any) => account.accountType === normalizedAccountType
      );

      if (!matchingAccount) {
        throw new Error('Le compte sélectionné est introuvable. Contactez le support pour assistance.');
      }

      return true;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Erreur lors de la vérification des prérequis du paiement.';
      setError(message);
      return false;
    } finally {
      setIsPreflightChecking(false);
      setPreflightMessage('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!amount || parseFloat(amount) <= 0) {
      setError('Veuillez entrer un montant valide');
      return;
    }

    const investmentAmount = parseFloat(amount);

    // Minimum amount validation
    if (investmentAmount < 10000) {
      setError('Le montant minimum d\'investissement est de 10,000 FCFA');
      return;
    }

    const selectedOption = trancheOptions.find(t => t.value === tranche);

    // Handle Intouch payment
    if (method === 'intouch') {
      const canProceed = await runPreflightChecks(investmentAmount);
      if (!canProceed) {
        return;
      }

      const refNumber = generateReferenceNumber();
      setReferenceNumber(refNumber);
      setShowIntouchPayment(true);
      return;
    }

    // Fallback to WhatsApp for other methods
    const message = encodeURIComponent(
      `Bonjour, je souhaite investir ${investmentAmount.toLocaleString()} FCFA dans la ${selectedOption?.label} (${selectedOption?.rate}% sur ${selectedOption?.term} ans) - ISIN: ${selectedOption?.isin}. Pouvez-vous m'aider avec le traitement du paiement ?`
    );
    const whatsappUrl = `https://wa.me/221770993382?text=${message}`;
    window.open(whatsappUrl, '_blank');

    // Close modal after redirect
    onClose();
  };

  const handleIntouchSuccess = (transactionId: string) => {
    console.log('Intouch payment successful:', transactionId);
    onConfirm({
      amount: parseFloat(amount),
      tranche: tranche,
      method: 'intouch'
    });
    onClose();
  };

  const handleIntouchError = (error: string) => {
    setError(error);
    setShowIntouchPayment(false);
  };

  const handleIntouchCancel = () => {
    setShowIntouchPayment(false);
  };

  if (!isOpen) return null;

  // Show Intouch payment component
  if (showIntouchPayment && (session?.user as any)?.id) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl p-8 max-w-lg w-full mx-4">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-night">
              Paiement via Intouch
            </h3>
            <button
              onClick={onClose}
              className="text-night/60 hover:text-night"
            >
              ✕
            </button>
          </div>

          <IntouchPayment
            amount={parseFloat(amount)}
            userId={(session?.user as any)?.id}
            accountType={accountType}
            intentType={'investment' as any}
            referenceNumber={referenceNumber}
            investmentTranche={tranche}
            investmentTerm={trancheOptions.find(t => t.value === tranche)?.term as 3 | 5 | 7 | 10}
            onSuccess={handleIntouchSuccess}
            onError={handleIntouchError}
            onCancel={handleIntouchCancel}
          />
        </div>
      </div>
    );
  }

  const selectedOption = trancheOptions.find(t => t.value === tranche);
  const projectedValue = calculateProjectedValue(parseFloat(amount || '0'), tranche);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 max-w-lg w-full mx-4">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-night">Souscrire à Emprunt Obligataire</h3>
          <button 
            onClick={onClose}
            className="text-night/60 hover:text-night"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            {/* Selected Tranche Display */}
            <div className="bg-gold-light/20 border border-gold-metallic/30 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-gold-dark">{selectedOption?.label}</h4>
                  <p className="text-sm text-night/60">{selectedOption?.description}</p>
                  <p className="text-xs text-night/50 font-mono mt-1">ISIN: {selectedOption?.isin}</p>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-gold-metallic">{selectedOption?.rate}%</div>
                  <div className="text-xs text-night/50">par an</div>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-night mb-2">Montant d'investissement (FCFA)</label>
              <input 
                type="number" 
                value={amount}
                onChange={(e) => handleAmountChange(e.target.value)}
                min="10000"
                step="10000"
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-gold-metallic focus:border-transparent ${
                  error ? 'border-red-300 bg-red-50' : 'border-timberwolf/30'
                }`}
                placeholder="Minimum 10 000 FCFA"
                required
              />
              {error && (
                <p className="mt-1 text-sm text-red-600">{error}</p>
              )}
            </div>

            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <h4 className="font-semibold text-night mb-2">Projection d'investissement</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-night/60">Montant investi:</span>
                  <span className="font-semibold">{parseInt(amount || '0').toLocaleString()} FCFA</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-night/60">Durée:</span>
                  <span className="font-semibold">{selectedOption?.term} ans</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-night/60">Taux d'intérêt:</span>
                  <span className="font-semibold text-gold-metallic">{selectedOption?.rate}%</span>
                </div>
                <div className="flex justify-between border-t pt-2">
                  <span className="text-night/60">Valeur à maturité:</span>
                  <span className="font-bold text-green-600">
                    {projectedValue.toLocaleString()} FCFA
                  </span>
                </div>
              </div>
            </div>

            <PaymentMethodSelect
              value={method}
              onChange={setMethod}
              type="payment"
            />
          </div>

          {preflightMessage && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-900">
              {preflightMessage}
            </div>
          )}

          <div className="flex space-x-3 mt-6">
            <button 
              type="button"
              onClick={onClose}
              className="flex-1 border border-timberwolf/30 text-night py-3 px-4 rounded-lg font-medium hover:bg-timberwolf/10 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={
                !!error ||
                isPreflightChecking ||
                (amount ? parseFloat(amount) < 10000 : true)
              }
              className="flex-1 bg-gold-metallic text-white py-3 px-4 rounded-lg font-medium hover:bg-gold-dark transition-colors disabled:bg-gray-400"
            >
              {isPreflightChecking
                ? 'Vérification...'
                : 'Confirmer l\'investissement'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
