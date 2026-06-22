'use client';

import { useState, useEffect } from 'react';
import { useUserProfile } from '@/hooks/useUserProfile';
import { formatCurrency } from '@/lib/utils';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface DepositIntentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete?: (amount: number, wallet: string) => void;
}

const WALLETS = [
  { id: 'orange_money', label: 'Orange Money', emoji: '🟠', color: 'bg-[#FF7900]/10 border-[#FF7900]/50 hover:border-[#FF7900]', activeColor: 'bg-[#FF7900] border-[#FF7900] text-white' },
  { id: 'wave',         label: 'Wave',         emoji: '🔵', color: 'bg-[#1CB5E0]/10 border-[#1CB5E0]/50 hover:border-[#1CB5E0]', activeColor: 'bg-[#1CB5E0] border-[#1CB5E0] text-white' },
  { id: 'free_money',   label: 'Free Money',   emoji: '⚪️', color: 'bg-[#E3000F]/10 border-[#E3000F]/50 hover:border-[#E3000F]', activeColor: 'bg-[#E3000F] border-[#E3000F] text-white' },
];

const QUICK_AMOUNTS = [10000, 25000, 50000, 100000];

export default function DepositIntentModal({ isOpen, onClose, onComplete }: DepositIntentModalProps) {
  const { data: userProfile } = useUserProfile();
  const [amountStr, setAmountStr] = useState('25000');
  const [wallet, setWallet] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pendingIntent, setPendingIntent] = useState<any>(null);

  const firstName = userProfile?.firstName || '';
  const amount = parseInt(amountStr.replace(/\D/g, ''), 10) || 0;

  // Check for existing pending deposit intents on mount
  useEffect(() => {
    if (!isOpen || !userProfile?.id) return;

    const checkPendingIntents = async () => {
      try {
        const res = await fetch('/api/users/transactions');
        if (!res.ok) return;
        const data = await res.json();
        
        // Find pending deposit intents awaiting KYC approval
        const pendingDeposit = data.transactions?.find((tx: any) =>
          tx.intentType === 'DEPOSIT' &&
          tx.status === 'PENDING' &&
          tx.awaitingKycApproval === true
        );

        if (pendingDeposit) {
          setPendingIntent(pendingDeposit);
          setAmountStr(pendingDeposit.amount);
          setWallet(pendingDeposit.paymentMethod?.toLowerCase());
        }
      } catch {
        // Ignore error, start fresh
      }
    };

    checkPendingIntents();
  }, [isOpen, userProfile?.id]);

  const handleSubmit = async () => {
    if (!wallet || amount < 1000) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/onboarding/deposit-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, wallet }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erreur');
      onComplete?.(amount, wallet);
      onClose();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Erreur');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-timberwolf/20 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-night">Programmer un versement</h2>
            <p className="text-sm text-night/60 mt-1">Sera crédité après validation KYC</p>
          </div>
          <button
            onClick={onClose}
            className="text-night/50 hover:text-night transition-colors"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          <div className="text-center mb-6">
            <span className="text-5xl">💸</span>
            <p className="text-night/60 text-sm mt-2">
              {firstName}, prépare ton premier versement
            </p>
            {pendingIntent && (
              <div className="mt-3 inline-block bg-amber-50 border border-amber-200 rounded-full px-4 py-2 text-sm text-amber-800">
                ⏳ Versement en attente : {formatCurrency(parseFloat(pendingIntent.amount))} FCFA
              </div>
            )}
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-night/80 mb-3">Montant</label>
            <div className="grid grid-cols-2 gap-2 mb-3">
              {QUICK_AMOUNTS.map((a) => (
                <button
                  key={a}
                  onClick={() => setAmountStr(String(a))}
                  className={`py-3 rounded-xl border-2 font-semibold transition-all ${
                    amount === a
                      ? 'border-gold bg-gold/10 text-night'
                      : 'border-timberwolf/30 text-night/70 hover:border-gold/50'
                  }`}
                >
                  {formatCurrency(a)}
                </button>
              ))}
            </div>
            <input
              type="number"
              min={1000}
              step={1000}
              value={amount}
              onChange={(e) => setAmountStr(e.target.value)}
              className="w-full px-4 py-3 text-lg text-center border border-timberwolf/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold"
              placeholder="Montant personnalisé"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-night/80 mb-3">Wallet</label>
            <div className="space-y-2">
              {WALLETS.map((w) => (
                <button
                  key={w.id}
                  onClick={() => setWallet(w.id)}
                  className={`w-full flex items-center gap-3 p-4 border-2 rounded-xl text-left transition-all ${
                    wallet === w.id
                      ? 'border-gold bg-gold/10'
                      : 'border-timberwolf/30 hover:border-gold/50'
                  }`}
                >
                  <span className="text-2xl">{w.emoji}</span>
                  <span className="font-semibold text-night">{w.label}</span>
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading || !wallet || amount < 1000}
            className="w-full bg-gold hover:bg-gold/90 disabled:opacity-50 text-night font-semibold py-4 rounded-xl transition-all"
          >
            {loading ? 'Programmation...' : `Programmer ${formatCurrency(amount)} FCFA →`}
          </button>

          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-900">
            <p className="font-semibold mb-1">⏳ Versement en attente de validation</p>
            <p>
              Aucun montant n'est prélevé maintenant. Il le sera après validation de tes documents
              (généralement moins de 24h).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
