'use client';

import { useState } from 'react';
import PaymentMethodSelect from '../forms/PaymentMethodSelect';

interface TransferModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'deposit' | 'withdraw';
  accountName?: string;
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
  onConfirm 
}: TransferModalProps) {
  const [amount, setAmount] = useState<string>('');
  const [method, setMethod] = useState<string>('orange-money');
  const [note, setNote] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (amount && parseFloat(amount) > 0) {
      onConfirm({
        amount: parseFloat(amount),
        method,
        note: note.trim() || undefined
      });
      // Reset form
      setAmount('');
      setMethod('orange-money');
      setNote('');
    }
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

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-night mb-2">Montant (FCFA)</label>
              <input 
                type="number" 
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="50000"
                min="1000"
                step="1000"
                className="w-full px-4 py-3 border border-timberwolf/30 rounded-lg focus:ring-2 focus:ring-gold-metallic focus:border-transparent"
                required
              />
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
              className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors text-white ${
                type === 'deposit' 
                  ? 'bg-gold-metallic hover:bg-gold-dark' 
                  : 'bg-red-600 hover:bg-red-700'
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
