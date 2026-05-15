'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatCurrency } from '@/lib/utils';

type ProjectId = 'maison' | 'etudes' | 'business' | 'voyage' | 'tabaski' | 'retraite';

interface Project {
  id: ProjectId;
  emoji: string;
  name: string;
  defaultDuration: number; // months
  defaultMonthly: number;
}

const PROJECTS: Project[] = [
  { id: 'maison',   emoji: '🏠', name: 'Maison',   defaultDuration: 120, defaultMonthly: 50000 },
  { id: 'etudes',   emoji: '🎓', name: 'Études',   defaultDuration: 180, defaultMonthly: 25000 },
  { id: 'business', emoji: '💼', name: 'Business', defaultDuration: 60,  defaultMonthly: 30000 },
  { id: 'voyage',   emoji: '✈️', name: 'Voyage',   defaultDuration: 24,  defaultMonthly: 40000 },
  { id: 'tabaski',  emoji: '🕌', name: 'Tabaski',  defaultDuration: 12,  defaultMonthly: 35000 },
  { id: 'retraite', emoji: '👴', name: 'Retraite', defaultDuration: 240, defaultMonthly: 20000 },
];

const rateForMonths = (m: number) =>
  m <= 6 ? 3.5 : m <= 12 ? 4.5 : m <= 36 ? 6.0 : m <= 60 ? 7.0 : m <= 120 ? 8.5 : 10.0;

export interface T0Result {
  project: ProjectId;
  monthlyAmount: number;
  durationMonths: number;
}

interface T0SimulatorProps {
  initial?: T0Result | null;
  onContinue: (result: T0Result) => void;
}

export default function T0Simulator({ initial, onContinue }: T0SimulatorProps) {
  const initialProject = initial ? PROJECTS.find((p) => p.id === initial.project) ?? null : null;
  const [selected, setSelected] = useState<Project | null>(initialProject);
  const [monthly, setMonthly] = useState(initial?.monthlyAmount ?? 0);
  const [duration, setDuration] = useState(initial?.durationMonths ?? 0);

  const handleSelect = (p: Project) => {
    setSelected(p);
    setMonthly(p.defaultMonthly);
    setDuration(p.defaultDuration);
  };

  const projection = useMemo(() => {
    if (!selected) return { final: 0, interest: 0 };
    const rate = rateForMonths(duration) / 100;
    // simplified compound model for mock UX (good enough at T0)
    const total = monthly * duration;
    const interest = total * rate * (duration / 12) * 0.5;
    return { final: total + interest, interest };
  }, [selected, monthly, duration]);

  return (
    <div className="max-w-md mx-auto px-4 py-10">
      <AnimatePresence mode="wait">
        {!selected ? (
          <motion.div
            key="grid"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.3 }}
          >
            <div className="text-center mb-8">
              <p className="text-sm uppercase tracking-widest text-gold mb-2">Étape 0 · Aucune inscription requise</p>
              <h1 className="text-3xl font-bold text-night mb-3">
                Quel est ton projet de vie ?
              </h1>
              <p className="text-night/60">
                Choisis ton projet et découvre combien tu peux épargner.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {PROJECTS.map((p, i) => (
                <motion.button
                  key={p.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => handleSelect(p)}
                  className="group flex flex-col items-center justify-center p-6 bg-white border-2 border-timberwolf/30 rounded-2xl hover:border-gold hover:shadow-lg active:scale-95 transition-all"
                >
                  <span className="text-4xl mb-3 group-hover:scale-110 transition-transform">{p.emoji}</span>
                  <span className="font-semibold text-night">{p.name}</span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="simulator"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
          >
            <button
              onClick={() => setSelected(null)}
              className="text-sm text-night/60 hover:text-night mb-4 inline-flex items-center gap-1"
            >
              ← Choisir un autre projet
            </button>

            <div className="text-center mb-8">
              <span className="text-6xl">{selected.emoji}</span>
              <h2 className="text-2xl md:text-3xl font-bold text-night mt-2">{selected.name}</h2>
            </div>

            <div className="bg-white border border-timberwolf/30 rounded-2xl p-6 space-y-6 shadow-xs">
              <div>
                <label className="flex justify-between text-sm font-medium text-night/80 mb-2">
                  <span>Mensualité</span>
                  <span className="text-gold font-semibold">{formatCurrency(monthly)} FCFA</span>
                </label>
                <input
                  type="range"
                  min={5000}
                  max={500000}
                  step={5000}
                  value={monthly}
                  onChange={(e) => setMonthly(Number(e.target.value))}
                  className="w-full accent-gold"
                />
                <div className="flex justify-between text-xs text-night/40 mt-1">
                  <span>5 000</span>
                  <span>500 000</span>
                </div>
              </div>

              <div>
                <label className="flex justify-between text-sm font-medium text-night/80 mb-2">
                  <span>Durée</span>
                  <span className="text-gold font-semibold">{duration} mois</span>
                </label>
                <input
                  type="range"
                  min={6}
                  max={240}
                  step={6}
                  value={duration}
                  onChange={(e) => setDuration(Number(e.target.value))}
                  className="w-full accent-gold"
                />
                <div className="flex justify-between text-xs text-night/40 mt-1">
                  <span>6 mois</span>
                  <span>20 ans</span>
                </div>
              </div>

              <div className="bg-night text-white rounded-xl p-5">
                <p className="text-xs uppercase tracking-wider text-gold mb-1">Au terme</p>
                <p className="text-3xl font-bold">{formatCurrency(Math.round(projection.final))} FCFA</p>
                <p className="text-sm text-white/60 mt-1">
                  Dont {formatCurrency(Math.round(projection.interest))} d&apos;intérêts à {rateForMonths(duration)}%/an
                </p>
                <p className="text-[10px] text-white/30 mt-3 italic">
                  * Simulation indicative, non contractuelle
                </p>
              </div>
            </div>

            <button
              onClick={() => onContinue({ project: selected.id, monthlyAmount: monthly, durationMonths: duration })}
              className="w-full mt-6 bg-gold hover:bg-gold/90 text-night font-semibold py-4 rounded-xl transition-colors shadow-md active:scale-[0.98]"
            >
              Je commence maintenant →
            </button>

            <p className="text-center text-xs text-night/40 mt-3">
              45 secondes · Zéro donnée demandée
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
