'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import PaymentMethodSelect from '../forms/PaymentMethodSelect';
import IntouchPayment from '../payments/IntouchPayment';
import KYCVerificationMessage from '../kyc/KYCVerificationMessage';

interface TransferModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'deposit' | 'withdraw';
  accountName?: string;
  currentBalance?: number;
  onConfirm: (data: TransferData) => void;
  accountType?: 'sama_naffa' | 'ape_investment';
  kycStatus?: 'PENDING' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED';
}

interface TransferData {
  amount: number;
  method: string;
  note?: string;
}

export default function TransferModal({ 
  isOpen, 
  onClose, 
  type, 
  accountName,
  currentBalance = 0,
  onConfirm,
  accountType = 'sama_naffa',
  kycStatus = 'APPROVED'
}: TransferModalProps) {
  const { data: session } = useSession();
  const [amount, setAmount] = useState<string>('');
  const [method, setMethod] = useState<string>('intouch');
  const [note, setNote] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [showIntouchPayment, setShowIntouchPayment] = useState<boolean>(false);
  const [referenceNumber, setReferenceNumber] = useState<string>('');

  const handleAmountChange = (value: string) => {
    setAmount(value);
    setError(''); // Clear error when user types

    if (!value) {
      return;
    }

    const requestedAmount = parseFloat(value);
    if (Number.isNaN(requestedAmount)) {
      return;
    }

    if (type === 'deposit') {
      if (requestedAmount < 500) {
        setError('Le montant minimum de dépôt est de 500 FCFA');
        return;
      }
      if (requestedAmount % 500 !== 0) {
        setError('Les dépôts doivent être par paliers de 500 FCFA');
        return;
      }
    }

    if (type === 'withdraw' && requestedAmount > currentBalance) {
      setError(`Fonds insuffisants. Solde disponible: ${currentBalance.toLocaleString()} FCFA`);
    }
  };

  const generateReferenceNumber = () => {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `${accountType.toUpperCase()}-${type.toUpperCase()}-${timestamp}-${random}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!amount || parseFloat(amount) <= 0) {
      setError('Veuillez entrer un montant valide');
      return;
    }

    const requestedAmount = parseFloat(amount);
    
    // Additional validation for withdrawals
    if (type === 'withdraw' && requestedAmount > currentBalance) {
      setError(`Fonds insuffisants. Solde disponible: ${currentBalance.toLocaleString()} FCFA`);
      return;
    }

    if (type === 'deposit') {
      if (requestedAmount < 500) {
        setError('Le montant minimum de dépôt est de 500 FCFA');
        return;
      }
      if (requestedAmount % 500 !== 0) {
        setError('Les dépôts doivent être par paliers de 500 FCFA');
        return;
      }
    }

    // Minimum amount validation (temporarily disabled for testing)
    // if (requestedAmount < 1000) {
    //   setError('Le montant minimum est de 1,000 FCFA');
    //   return;
    // }

    // Handle Intouch payment
    if (method === 'intouch') {
      const refNumber = generateReferenceNumber();
      setReferenceNumber(refNumber);
      setShowIntouchPayment(true);
      return;
    }

    // Fallback to WhatsApp for other methods
    const message = encodeURIComponent(
      `Bonjour, je souhaite effectuer un ${type === 'deposit' ? 'dépôt' : 'retrait'} de ${requestedAmount.toLocaleString()} FCFA${note.trim() ? ` - ${note.trim()}` : ''}. Pouvez-vous m'aider avec le traitement du paiement ?`
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
      method: 'intouch',
      note: note
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
              Pour effectuer des {type === 'deposit' ? 'dépôts' : 'retraits'}, votre identité doit être vérifiée.
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
            intentType={type as 'deposit' | 'investment' | 'withdrawal'}
            referenceNumber={referenceNumber}
            onSuccess={handleIntouchSuccess}
            onError={handleIntouchError}
            onCancel={handleIntouchCancel}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-night">
            {type === 'deposit' ? 'Effectuer un dépôt' : 'Effectuer un retrait'}
            {accountName && ` - ${accountName}`}
          </h3>
          <button 
            onClick={onClose}
            className="text-night/60 hover:text-night"
          >
            ✕
          </button>
        </div>

        {/* Balance Display for Withdrawals */}
        {type === 'withdraw' && (
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-blue-800">Solde disponible:</span>
              <span className="text-lg font-bold text-blue-900">
                {currentBalance.toLocaleString()} FCFA
              </span>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-night mb-2">Montant (FCFA)</label>
              <input 
                type="number" 
                value={amount}
                onChange={(e) => handleAmountChange(e.target.value)}
                placeholder={type === 'withdraw' ? `Max: ${currentBalance.toLocaleString()}` : 'Entrer un multiple de 500'}
                min={type === 'deposit' ? 500 : 1}
                max={type === 'withdraw' ? currentBalance : undefined}
                step={type === 'deposit' ? 500 : 1}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-gold-metallic focus:border-transparent ${
                  error ? 'border-red-300 bg-red-50' : 'border-timberwolf/30'
                }`}
                required
              />
              {error && (
                <p className="mt-1 text-sm text-red-600">{error}</p>
              )}
            </div>
            
            <PaymentMethodSelect
              value={method}
              onChange={setMethod}
              type={type}
            />

            <div>
              <label className="block text-sm font-medium text-night mb-2">Note (optionnelle)</label>
              <textarea 
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Motif de la transaction..."
                rows={3}
                className="w-full px-4 py-3 border border-timberwolf/30 rounded-lg focus:ring-2 focus:ring-gold-metallic focus:border-transparent"
              />
            </div>
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
              disabled={!!error || (type === 'withdraw' && parseFloat(amount) > currentBalance)}
              className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors text-white ${
                type === 'deposit' 
                  ? 'bg-gold-metallic hover:bg-gold-dark disabled:bg-gray-400' 
                  : 'bg-red-600 hover:bg-red-700 disabled:bg-gray-400'
              }`}
            >
              {type === 'deposit' ? 'Déposer' : 'Retirer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
