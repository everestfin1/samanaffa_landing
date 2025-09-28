'use client';

import { useState, useEffect } from 'react';
import PaymentMethodSelect from '../forms/PaymentMethodSelect';
import KYCVerificationMessage from '../kyc/KYCVerificationMessage';

interface InvestmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data: InvestmentData) => void;
  preselectedTranche?: 'A' | 'B' | 'C' | 'D' | null;
  kycStatus?: 'PENDING' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED';
}

interface InvestmentData {
  amount: number;
  tranche: 'A' | 'B' | 'C' | 'D';
  method: string;
}

const trancheOptions = [
  { value: 'A' as const, label: 'Tranche A', term: 3, rate: 6.40, description: 'Court terme - 3 ans' },
  { value: 'B' as const, label: 'Tranche B', term: 5, rate: 6.60, description: 'Moyen terme - 5 ans' },
  { value: 'C' as const, label: 'Tranche C', term: 7, rate: 6.75, description: 'Long terme - 7 ans' },
  { value: 'D' as const, label: 'Tranche D', term: 10, rate: 6.95, description: 'Très long terme - 10 ans' }
];

export default function InvestmentModal({ 
  isOpen, 
  onClose, 
  onConfirm,
  preselectedTranche,
  kycStatus = 'APPROVED'
}: InvestmentModalProps) {
  const [amount, setAmount] = useState<string>('100000');
  const [tranche, setTranche] = useState<'A' | 'B' | 'C' | 'D'>(preselectedTranche || 'D');
  const [method, setMethod] = useState<string>('intouch');
  const [error, setError] = useState<string>('');

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

  const handleSubmit = (e: React.FormEvent) => {
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
    
    // Redirect to WhatsApp instead of creating intent
    const message = encodeURIComponent(
      `Bonjour, je souhaite investir ${investmentAmount.toLocaleString()} FCFA dans la ${selectedOption?.label} (${selectedOption?.rate}% sur ${selectedOption?.term} ans). Pouvez-vous m'aider avec le traitement du paiement ?`
    );
    const whatsappUrl = `https://wa.me/221770993382?text=${message}`;
    window.open(whatsappUrl, '_blank');
    
    // Close modal after redirect
    onClose();
  };

  if (!isOpen) return null;

  // Show KYC verification message if user is not approved
  if (kycStatus !== 'APPROVED') {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl p-8 max-w-lg w-full mx-4">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-night">
              Vérification d'identité requise
            </h3>
            <button 
              onClick={onClose}
              className="text-night/60 hover:text-night"
            >
              ✕
            </button>
          </div>

          <div className="mb-6">
            <p className="text-night/70 mb-4">
              Pour effectuer des investissements, votre identité doit être vérifiée.
            </p>
          </div>

          <KYCVerificationMessage
            kycStatus={kycStatus}
            variant="modal"
            onContactSupport={() => window.open('/contact', '_blank')}
            onRestartRegistration={() => window.open('/register', '_blank')}
          />

          <div className="flex justify-end mt-6">
            <button
              onClick={onClose}
              className="px-6 py-2 border border-timberwolf/30 text-night rounded-lg font-medium hover:bg-timberwolf/10 transition-colors"
            >
              Fermer
            </button>
          </div>
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
              disabled={!!error || (amount ? parseFloat(amount) < 10000 : true)}
              className="flex-1 bg-gold-metallic text-white py-3 px-4 rounded-lg font-medium hover:bg-gold-dark transition-colors disabled:bg-gray-400"
            >
              Confirmer l'investissement
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
