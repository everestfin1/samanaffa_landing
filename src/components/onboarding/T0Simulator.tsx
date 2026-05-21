'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { objectives } from '@/components/data/objectives';
import { formatCurrency } from '@/lib/utils';
import OnboardingStepHeader from '@/components/onboarding/OnboardingStepHeader';

export type ProjectId = 'maison' | 'etudes' | 'business' | 'voyage' | 'tabaski' | 'retraite';

const OBJECTIVE_ID_BY_PROJECT: Record<ProjectId, number> = {
  maison: 1,
  etudes: 2,
  voyage: 3,
  business: 4,
  retraite: 5,
  tabaski: 6,
};

interface Project {
  id: ProjectId;
  objectiveId: number;
  name: string;
  icon: string;
  titre: string;
  description: string;
  defaultDuration: number;
  defaultMonthly: number;
}

const PROJECTS: Project[] = (
  Object.entries(OBJECTIVE_ID_BY_PROJECT) as [ProjectId, number][]
).map(([id, objectiveId]) => {
  const objective = objectives.find((o) => o.id === objectiveId)!;
  return {
    id,
    objectiveId,
    name: objective.name,
    icon: objective.icon,
    titre: objective.titre,
    description: objective.description,
    defaultDuration: objective.duree,
    defaultMonthly: objective.mensualite,
  };
});

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
    const total = monthly * duration;
    const interest = total * rate * (duration / 12) * 0.5;
    return { final: total + interest, interest };
  }, [selected, monthly, duration]);

  return (
    <div className="max-w-md md:max-w-xl mx-auto px-4 py-10">
      <AnimatePresence mode="wait">
        {!selected ? (
          <motion.div
            key="grid"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.3 }}
          >
            <OnboardingStepHeader
              title="Quel est votre projet de vie ?"
              description="Choisissez votre projet et découvrez combien vous pouvez épargner."
            />

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
              {PROJECTS.map((p, i) => (
                <motion.button
                  key={p.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => handleSelect(p)}
                  className="group flex flex-col items-center gap-2 py-4 opacity-80 hover:opacity-100 transition-all duration-300 hover:scale-105"
                >
                  <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-[#F2F8F4] group-hover:bg-gradient-to-br group-hover:from-[#e8f5e8] group-hover:to-[#d4f4d4] group-hover:shadow-lg transition-all duration-300 flex items-center justify-center relative">
                    <Image
                      src={p.icon}
                      alt={p.name}
                      width={48}
                      height={48}
                      className="w-10 h-10 md:w-12 md:h-12 object-contain group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <span className="font-semibold text-sm md:text-base text-night group-hover:text-[#435933] transition-colors text-center">
                    {p.name}
                  </span>
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

            <OnboardingStepHeader
              title={selected.titre}
              description={selected.description}
              className="mb-8"
            />

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

              <div className="bg-gradient-to-br from-[#F2F8F4] to-white border border-[#435933]/10 rounded-xl p-5">
                <p className="text-xs uppercase tracking-wider text-[#435933]/70 mb-1">Au terme</p>
                <p className="text-3xl font-bold text-[#435933]">{formatCurrency(Math.round(projection.final))} FCFA</p>
                <p className="text-sm text-night/60 mt-1">
                  Dont <span className="font-semibold text-[#435933]">{formatCurrency(Math.round(projection.interest))}</span> d&apos;intérêts à <span className="font-semibold text-[#435933]">{rateForMonths(duration)}%/an</span>
                </p>
                <p className="text-[10px] text-night/40 mt-3 italic">
                  * Simulation indicative, non contractuelle
                </p>
              </div>
            </div>

            <button
              onClick={() => onContinue({ project: selected.id, monthlyAmount: monthly, durationMonths: duration })}
              className="group relative w-full mt-6 px-8 py-4 bg-gradient-to-r from-[#344925] to-[#435933] hover:from-[#2a3a1e] hover:to-[#364529] text-white font-semibold rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:scale-[0.98] flex items-center justify-center gap-3 overflow-hidden"
            >
              <span className="relative z-10">Je commence maintenant</span>
              <span className="relative z-10 group-hover:translate-x-1 transition-transform duration-300">→</span>
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
