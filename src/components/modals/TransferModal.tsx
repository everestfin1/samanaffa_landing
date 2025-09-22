'use client';

import { useState } from 'react';
import PaymentMethodSelect from '../forms/PaymentMethodSelect';

interface TransferModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'deposit' | 'withdraw';
  accountName?: string;
  currentBalance?: number;
  onConfirm: (data: TransferData) => void;
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
  onConfirm 
}: TransferModalProps) {
  const [amount, setAmount] = useState<string>('');
  const [method, setMethod] = useState<string>('intouch');
  const [note, setNote] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handleAmountChange = (value: string) => {
    setAmount(value);
    setError(''); // Clear error when user types
    
    // Validate withdrawal amount
    if (type === 'withdraw' && value) {
      const requestedAmount = parseFloat(value);
      if (requestedAmount > currentBalance) {
        setError(`Fonds insuffisants. Solde disponible: ${currentBalance.toLocaleString()} FCFA`);
      }
    }
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

    // Minimum amount validation
    if (requestedAmount < 1000) {
      setError('Le montant minimum est de 1,000 FCFA');
      return;
    }

    onConfirm({
      amount: requestedAmount,
      method,
      note: note.trim() || undefined
    });
    
    // Reset form
    setAmount('');
    setMethod('intouch');
    setNote('');
    setError('');
  };

  if (!isOpen) return null;

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
                placeholder={type === 'withdraw' ? `Max: ${currentBalance.toLocaleString()}` : "50000"}
                min="1000"
                max={type === 'withdraw' ? currentBalance : undefined}
                step="1000"
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
              <label className="block text-sm font-medium text-night mb-2">Note (optionnel)</label>
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