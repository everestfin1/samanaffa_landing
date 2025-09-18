'use client';

import { useState } from 'react';
import PaymentMethodSelect from '../forms/PaymentMethodSelect';

interface InvestmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data: InvestmentData) => void;
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
  onConfirm 
}: InvestmentModalProps) {
  const [amount, setAmount] = useState<string>('100000');
  const [tranche, setTranche] = useState<'A' | 'B' | 'C' | 'D'>('D');
  const [method, setMethod] = useState<string>('orange-money');

  const calculateProjectedValue = (amount: number, tranche: 'A' | 'B' | 'C' | 'D') => {
    const option = trancheOptions.find(t => t.value === tranche);
    if (!option) return 0;
    
    const semiAnnualRate = option.rate / 2 / 100;
    const periods = option.term * 2;
    const semiAnnualPayment = amount * semiAnnualRate;
    const totalInterest = semiAnnualPayment * periods;
    return amount + totalInterest;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (amount && parseFloat(amount) >= 10000) {
      onConfirm({
        amount: parseFloat(amount),
        tranche,
        method
      });
      // Reset form
      setAmount('100000');
      setTranche('D');
      setMethod('orange-money');
    }
  };

  if (!isOpen) return null;

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
            <div>
              <label className="block text-sm font-medium text-night mb-3">Choisir une tranche</label>
              <div className="grid grid-cols-2 gap-3">
                {trancheOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setTranche(option.value)}
                    className={`p-4 border-2 rounded-lg transition-all text-left ${
                      tranche === option.value
                        ? 'border-gold-metallic bg-gold-light/20 text-gold-dark'
                        : 'border-timberwolf/30 hover:border-gold-metallic/40'
                    }`}
                  >
                    <div className="font-semibold">{option.label}</div>
                    <div className="text-sm text-night/60">{option.description}</div>
                    <div className="text-sm font-bold text-gold-metallic">{option.rate}%</div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-night mb-2">Montant d'investissement (FCFA)</label>
              <input 
                type="number" 
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                min="10000"
                step="10000"
                className="w-full px-4 py-3 border border-timberwolf/30 rounded-lg focus:ring-2 focus:ring-gold-metallic focus:border-transparent"
                placeholder="Minimum 10,000 FCFA"
                required
              />
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
              className="flex-1 bg-gold-metallic text-white py-3 px-4 rounded-lg font-medium hover:bg-gold-dark transition-colors"
            >
              Confirmer l'investissement
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
