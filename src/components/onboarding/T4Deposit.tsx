'use client';

import { useState } from 'react';
import Image from 'next/image';
import { formatCurrency } from '@/lib/utils';

interface T4DepositProps {
  userId: string;
  firstName: string;
  initialAmount?: number;
  initialWallet?: string | null;
  onSuccess: (amount: number, wallet: string) => void;
  onBack?: () => void;
}

const WALLETS = [
  { id: 'orange_money', label: 'Orange Money', logo: '/payment-provider-logos/Orange-Money-logo.png', bgColor: 'bg-[#FF7900]/5' },
  { id: 'wave',         label: 'Wave',         logo: '/payment-provider-logos/wave-logo.png',         bgColor: 'bg-[#1CB5E0]/5' },
  { id: 'free_money',   label: 'Free Money',   logo: '/payment-provider-logos/free-money-logo.png',  bgColor: 'bg-[#E3000F]/5' },
];

const QUICK_AMOUNTS = [10000, 25000, 50000, 100000];

export default function T4Deposit({ userId, firstName, initialAmount, initialWallet, onSuccess, onBack }: T4DepositProps) {
  const [amountStr, setAmountStr] = useState(initialAmount ? initialAmount.toString() : '25000');
  const [wallet, setWallet] = useState<string | null>(initialWallet ?? null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const amount = parseInt(amountStr.replace(/\D/g, ''), 10) || 0;

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
        <p className="text-xl md:text-2xl font-bold text-night mt-3 mb-2 whitespace-nowrap">
          {firstName}, prépare ton premier dépôt
        </p>
        <p className="text-night/60 text-sm">
          Pendant qu&apos;on vérifie tes documents — ton argent sera crédité dès validation.
        </p>
      </div>

      <div className="bg-white border border-timberwolf/30 rounded-2xl p-6 space-y-6">
        <div>
          <label className="block text-sm font-medium text-night/80 mb-3">Montant</label>
          <div className="grid grid-cols-2 gap-3 mb-3">
            {QUICK_AMOUNTS.map((a) => (
              <button
                key={a}
                onClick={() => setAmountStr(String(a))}
                className={`py-3 rounded-xl border-2 font-semibold transition-all duration-300 ${
                  amount === a
                    ? 'border-[#435933] bg-gradient-to-r from-[#e8f5e8] to-[#d4f4d4] text-[#435933] shadow-sm'
                    : 'border-timberwolf/30 text-night/70 hover:border-[#435933]/50 hover:bg-[#F2F8F4]'
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
          <div className="space-y-3">
            {WALLETS.map((w) => (
              <button
                key={w.id}
                onClick={() => setWallet(w.id)}
                className={`w-full flex items-center gap-4 p-4 border-2 rounded-xl text-left transition-all duration-300 ${
                  wallet === w.id
                    ? 'border-[#435933] bg-gradient-to-r from-[#e8f5e8] to-[#d4f4d4] shadow-md'
                    : 'border-timberwolf/30 hover:border-[#435933]/50 hover:bg-[#F2F8F4]'
                }`}
              >
                <div className={`w-12 h-12 rounded-lg ${w.bgColor} flex items-center justify-center p-1 shrink-0`}>
                  <Image
                    src={w.logo}
                    alt={w.label}
                    width={40}
                    height={40}
                    className="object-contain"
                  />
                </div>
                <span className={`font-semibold ${wallet === w.id ? 'text-[#435933]' : 'text-night'}`}>
                  {w.label}
                </span>
                {wallet === w.id && (
                  <div className="ml-auto w-5 h-5 rounded-full bg-[#435933] flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {error && <p className="text-sm text-red-600 text-center">{error}</p>}

        <button
          onClick={handleSubmit}
          disabled={loading || !wallet || amount < 1000}
          className="group relative w-full px-8 py-4 bg-gradient-to-r from-[#344925] to-[#435933] hover:from-[#2a3a1e] hover:to-[#364529] disabled:opacity-50 text-white font-semibold rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:scale-[0.98] flex items-center justify-center gap-3 overflow-hidden"
        >
          <span className="relative z-10">{loading ? 'Programmation...' : `Programmer ${formatCurrency(amount)} FCFA`}</span>
          {!loading && <span className="relative z-10 group-hover:translate-x-1 transition-transform duration-300">→</span>}
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
