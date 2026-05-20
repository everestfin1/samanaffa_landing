'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface T3QuizProps {
  firstName: string;
  onSuccess: (formula: string) => void | Promise<void>;
  onBack?: () => void;
}

type QuizAnswer = string;

interface Question {
  id: 'situation' | 'savingsCapacity' | 'experience';
  prompt: string;
  options: { value: QuizAnswer; label: string }[];
}

const QUESTIONS: Question[] = [
  {
    id: 'situation',
    prompt: 'Quelle est votre situation actuelle ?',
    options: [
      { value: 'salarie',     label: 'Salarié(e)' },
      { value: 'commercant',  label: 'Commerçant(e)' },
      { value: 'etudiant',    label: 'Étudiant(e)' },
      { value: 'entrepreneur',label: 'Entrepreneur(e)' },
      { value: 'autre',       label: 'Autre' },
    ],
  },
  {
    id: 'savingsCapacity',
    prompt: 'Combien pouvez-vous épargner par mois ?',
    options: [
      { value: '<10k',  label: 'Moins de 10 000 FCFA' },
      { value: '10-50k',label: '10 000 – 50 000 FCFA' },
      { value: '>50k',  label: 'Plus de 50 000 FCFA' },
    ],
  },
  {
    id: 'experience',
    prompt: 'Quelle est votre expérience avec l\'épargne ?',
    options: [
      { value: 'debutant',  label: 'Je débute' },
      { value: 'parfois',   label: 'J\'épargne parfois' },
      { value: 'regulier',  label: 'J\'épargne régulièrement' },
    ],
  },
];

const recommendFormula = (answers: Record<string, QuizAnswer>): { name: string; rate: number; description: string; highlights: string[] } => {
  // Simple rule-based recommender for the mock
  if (answers.savingsCapacity === '>50k' && answers.experience !== 'debutant') {
    return { 
      name: 'Formule Croissance', 
      rate: 8.5, 
      description: 'épargne régulière long-terme',
      highlights: ['Idéal pour un horizon de 5+ ans', 'Rendement maximisé', 'Versements programmés flexibles']
    };
  }
  if (answers.savingsCapacity === '<10k' || answers.experience === 'debutant') {
    return { 
      name: 'Formule Libre', 
      rate: 6.0, 
      description: 'flexibilité maximale, sans engagement',
      highlights: ['Aucun engagement de durée', 'Retraits possibles à tout moment', 'Parfait pour commencer']
    };
  }
  return { 
    name: 'Formule Équilibre', 
    rate: 7.0, 
    description: 'équilibre entre rendement et souplesse',
    highlights: ['Engagement modéré (12-36 mois)', 'Bon compromis rendement/liquidité', 'Protection contre l\'inflation']
  };
};

export default function T3Quiz({ firstName, onSuccess, onBack }: T3QuizProps) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, QuizAnswer>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ReturnType<typeof recommendFormula> | null>(null);

  const current = QUESTIONS[step];

  const handleAnswer = async (value: QuizAnswer) => {
    const next = { ...answers, [current.id]: value };
    setAnswers(next);

    if (step < QUESTIONS.length - 1) {
      setTimeout(() => setStep(step + 1), 150); // slight delay to show selected state
      return;
    }

    // Last question — compute + persist (result UI only after server OK — ONB-036)
    const formula = recommendFormula(next);
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/onboarding/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          investorProfile: {
            ...next,
            recommendedFormula: formula.name,
            recommendedRate: formula.rate,
            completedAt: new Date().toISOString(),
          },
        }),
      });
      if (!res.ok) throw new Error('Erreur de sauvegarde');

      const formulaRes = await fetch('/api/onboarding/apply-formula', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ formulaName: formula.name }),
      });
      if (!formulaRes.ok) {
        const data = await formulaRes.json().catch(() => ({}));
        throw new Error(
          (data as { error?: string }).error || 'Impossible d\'appliquer la formule',
        );
      }

      setResult(formula);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Impossible d\'enregistrer votre profil. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  if (result) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md mx-auto px-4 py-16 text-center"
      >
        <span className="text-6xl">🎯</span>
        <p className="text-xl md:text-2xl font-bold text-night mt-4 mb-3 whitespace-nowrap">
          {firstName}, vous êtes fait(e) pour
        </p>
        <div className="bg-gradient-to-br from-[#F2F8F4] to-white border border-[#435933]/20 rounded-2xl p-6 my-6 shadow-sm">
          <p className="text-xl font-bold text-[#435933]">{result.name}</p>
          <p className="text-4xl font-bold text-[#435933] my-3">{result.rate}% <span className="text-lg text-[#435933]/70">/ an</span></p>
          <p className="text-sm text-night/70 mb-6">{result.description}</p>
          
          <div className="space-y-2 text-left bg-white/70 rounded-xl p-4">
            {result.highlights.map((highlight, idx) => (
              <div key={idx} className="flex items-start gap-2 text-sm text-night/80">
                <span className="text-[#435933] font-bold">✓</span>
                <span>{highlight}</span>
              </div>
            ))}
          </div>
        </div>
        
        {error && <p className="text-sm text-red-600 mb-4">{error}</p>}
        
        <button
          onClick={() => {
            if (error) {
              // Retry save if it failed
              handleAnswer(answers[QUESTIONS[QUESTIONS.length - 1].id]);
            } else {
              void onSuccess(result.name);
            }
          }}
          disabled={loading}
          className="group relative w-full px-8 py-4 bg-gradient-to-r from-[#344925] to-[#435933] hover:from-[#2a3a1e] hover:to-[#364529] disabled:opacity-50 text-white font-semibold rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:scale-[0.98] flex items-center justify-center gap-3 overflow-hidden"
        >
          <span className="relative z-10">{loading ? 'Enregistrement...' : error ? 'Réessayer' : 'Programmer mon premier dépôt'}</span>
          {!loading && !error && <span className="relative z-10 group-hover:translate-x-1 transition-transform duration-300">→</span>}
        </button>
      </motion.div>
    );
  }

  const handleBackInQuiz = () => {
    if (step === 0) {
      onBack?.();
    } else {
      setStep(step - 1);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12 overflow-hidden">
      {(onBack || step > 0) && (
        <button
          onClick={handleBackInQuiz}
          className="text-sm text-night/60 hover:text-night mb-4 inline-flex items-center gap-1"
        >
          ← {step === 0 ? 'Retour' : 'Question précédente'}
        </button>
      )}
      <div className="text-center mb-2">
        <p className="text-xs uppercase tracking-widest text-night/40 font-semibold">
          Question {step + 1} sur {QUESTIONS.length}
        </p>
      </div>

      <div className="w-full h-1.5 bg-timberwolf/30 rounded-full mb-10 overflow-hidden">
        <motion.div
          className="h-full bg-gold rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${((step + 1) / QUESTIONS.length) * 100}%` }}
          transition={{ ease: 'easeInOut', duration: 0.3 }}
        />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
        >
          <h2 className="text-xl md:text-2xl font-bold text-night text-center mb-8">
            {current.prompt}
          </h2>

          <div className="space-y-3">
            {current.options.map((opt) => {
              const isSelected = answers[current.id] === opt.value;
              return (
                <button
                  key={opt.value}
                  onClick={() => handleAnswer(opt.value)}
                  className={`w-full p-4 border-2 rounded-xl text-left font-medium transition-all duration-300 hover:shadow-md active:scale-[0.98] ${
                    isSelected 
                      ? 'border-[#435933] bg-gradient-to-r from-[#e8f5e8] to-[#d4f4d4] text-[#435933] shadow-md' 
                      : 'bg-white border-timberwolf/30 hover:border-[#435933]/50 hover:bg-[#F2F8F4] text-night'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                      isSelected ? 'border-[#435933] bg-[#435933]' : 'border-timberwolf/50'
                    }`}>
                      {isSelected && <span className="text-white text-xs">✓</span>}
                    </div>
                    {opt.label}
                  </div>
                </button>
              );
            })}
          </div>
        </motion.div>
      </AnimatePresence>

      <p className="text-center text-[10px] text-night/40 mt-10">
        Profilage investisseur · Instruction N°60/CREPMF/2020
      </p>
    </div>
  );
}
