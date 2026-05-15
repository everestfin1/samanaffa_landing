'use client';

import { useState } from 'react';
import { formatCurrency } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface T4DepositProps {
  userId: string;
  firstName: string;
  initialAmount?: number;
  initialWallet?: string | null;
  onSuccess: (amount: number, wallet: string) => void;
  onBack?: () => void;
}

const WALLETS = [
  { id: 'orange_money', label: 'Orange Money', emoji: '🟠', color: 'bg-[#FF7900]/10 border-[#FF7900]/50 hover:border-[#FF7900]', activeColor: 'bg-[#FF7900] border-[#FF7900] text-white' },
  { id: 'wave',         label: 'Wave',         emoji: '🔵', color: 'bg-[#1CB5E0]/10 border-[#1CB5E0]/50 hover:border-[#1CB5E0]', activeColor: 'bg-[#1CB5E0] border-[#1CB5E0] text-white' },
  { id: 'free_money',   label: 'Free Money',   emoji: '⚪️', color: 'bg-[#E3000F]/10 border-[#E3000F]/50 hover:border-[#E3000F]', activeColor: 'bg-[#E3000F] border-[#E3000F] text-white' },
];

const QUICK_AMOUNTS = [10000, 25000, 50000, 100000];

export default function T4Deposit({ userId, firstName, initialAmount, initialWallet, onSuccess, onBack }: T4DepositProps) {
  const [amountStr, setAmountStr] = useState(initialAmount ? initialAmount.toString() : '25000');
  const [wallet, setWallet] = useState<string | null>(initialWallet ?? null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const amount = parseInt(amountStr.replace(/\D/g, ''), 10) || 0;

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '');
    if (raw) {
      setAmountStr(parseInt(raw, 10).toLocaleString('fr-FR'));
    } else {
      setAmountStr('');
    }
  };

  const handleSubmit = async () => {
    if (!wallet || amount < 1000) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/onboarding/deposit-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, amount, wallet }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erreur');
      onSuccess(amount, wallet);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Erreur');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-10">
      {onBack && (
        <button
          onClick={onBack}
          className="text-sm text-night/60 hover:text-night mb-4 inline-flex items-center gap-1"
        >
          ← Retour
        </button>
      )}
      <div className="text-center mb-6">
        <span className="text-5xl">💸</span>
        <h1 className="text-2xl md:text-3xl font-bold text-night mt-3 mb-2">
          {firstName}, prépare ton premier dépôt
        </h1>
        <p className="text-night/60 text-sm">
          Pendant qu&apos;on vérifie tes documents — ton argent sera crédité dès validation.
        </p>
      </div>

      <div className="bg-white border border-timberwolf/30 rounded-2xl p-6 space-y-6">
        <div>
          <label className="block text-sm font-medium text-night/80 mb-3">Montant</label>
          <div className="grid grid-cols-2 gap-2 mb-3">
            {QUICK_AMOUNTS.map((a) => (
              <button
                key={a}
                onClick={() => setAmount(a)}
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
            onChange={(e) => setAmount(Number(e.target.value))}
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

        {error && <p className="text-sm text-red-600 text-center">{error}</p>}

        <button
          onClick={handleSubmit}
          disabled={loading || !wallet || amount < 1000}
          className="w-full bg-gold hover:bg-gold/90 disabled:opacity-50 text-night font-semibold py-4 rounded-xl"
        >
          {loading ? 'Programmation...' : `Programmer ${formatCurrency(amount)} FCFA →`}
        </button>
      </div>

      <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-900">
        <p className="font-semibold mb-1">⏳ Dépôt en attente de validation</p>
        <p>
          Aucun montant n&apos;est prélevé maintenant. Il le sera après validation de tes documents
          (généralement moins de 24h).
        </p>
      </div>
    </div>
  );
}
