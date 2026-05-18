'use client';

import { useState } from 'react';

interface T2FirstNameProps {
  userId: string;
  initialValue?: string;
  onSuccess: (firstName: string) => void;
  onBack?: () => void;
}

export default function T2FirstName({ userId, initialValue, onSuccess, onBack }: T2FirstNameProps) {
  const [firstName, setFirstName] = useState(initialValue ?? '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!firstName.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/onboarding/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstName: firstName.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erreur');
      onSuccess(firstName.trim());
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Erreur');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      {onBack && (
        <button
          onClick={onBack}
          className="text-sm text-night/60 hover:text-night mb-4 inline-flex items-center gap-1"
        >
          ← Retour
        </button>
      )}
      <div className="text-center mb-10">
        <span className="text-5xl">👤</span>
        <p className="text-xl md:text-2xl font-bold text-night mt-3 mb-2 whitespace-nowrap">
          Comment devons-nous vous appeler ?
        </p>
        <p className="text-night/60 text-sm">
          Votre prénom suffit pour commencer.
        </p>
      </div>

      <div className="space-y-4">
        <input
          type="text"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          placeholder="Votre prénom"
          className="w-full px-6 py-5 text-2xl text-center border-2 border-timberwolf/40 rounded-2xl focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all"
          autoFocus
          maxLength={50}
        />
        <div className="flex justify-between px-2">
          <span className="text-xs text-night/40">
            {firstName.trim() ? 'Prénom valide' : 'Champ requis'}
          </span>
          <span className="text-xs text-night/40">
            {firstName.length}/50
          </span>
        </div>
        {error && <p className="text-sm text-red-600 text-center">{error}</p>}
        <button
          onClick={handleSubmit}
          disabled={loading || !firstName.trim()}
          className="group relative w-full px-8 py-4 bg-gradient-to-r from-[#344925] to-[#435933] hover:from-[#2a3a1e] hover:to-[#364529] disabled:opacity-50 text-white font-semibold rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:scale-[0.98] flex items-center justify-center gap-3 overflow-hidden"
        >
          <span className="relative z-10">{loading ? 'Enregistrement...' : 'Continuer'}</span>
          {!loading && <span className="relative z-10 group-hover:translate-x-1 transition-transform duration-300">→</span>}
        </button>
      </div>

      <p className="text-center text-xs text-night/40 mt-6">
        * Données de démonstration
      </p>
    </div>
  );
}
