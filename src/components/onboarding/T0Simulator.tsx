'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { objectives } from '@/components/data/objectives';
import SavingsSimulatorControls from '@/components/SamaNaffa/SavingsSimulatorControls';
import { validateDuree, validateMensualite } from '@/lib/savings-simulation';
import OnboardingStepHeader from '@/components/onboarding/OnboardingStepHeader';
import { getProjectIconScaleClasses, isAutresProject } from '@/lib/project-icon-display';

export type ProjectId =
  | 'maison'
  | 'etudes'
  | 'business'
  | 'voyage'
  | 'tabaski'
  | 'retraite'
  | 'autres';

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

const PROJECTS: Project[] = objectives.map((o) => ({
  id: o.slug as ProjectId,
  objectiveId: o.id,
  name: o.name,
  icon: o.icon,
  titre: o.titre,
  description: o.description,
  defaultDuration: o.duree,
  defaultMonthly: o.mensualite,
}));

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
  const [mensualiteError, setMensualiteError] = useState<string | null>(null);
  const [dureeError, setDureeError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSelect = (p: Project) => {
    setSelected(p);
    setMonthly(p.defaultMonthly);
    setDuration(p.defaultDuration);
    setMensualiteError(null);
    setDureeError(null);
    setSubmitError(null);
  };

  const handleMensualiteChange = (value: number) => {
    setMonthly(value);
    setMensualiteError(validateMensualite(value));
  };

  const handleDureeChange = (value: number) => {
    setDuration(value);
    setDureeError(validateDuree(value));
  };

  const handleContinue = () => {
    const mErr = validateMensualite(monthly);
    const dErr = validateDuree(duration);
    setMensualiteError(mErr);
    setDureeError(dErr);
    if (mErr || dErr || !selected) {
      setSubmitError('Veuillez corriger les valeurs du simulateur.');
      return;
    }
    setSubmitError(null);
    onContinue({
      project: selected.id,
      monthlyAmount: monthly,
      durationMonths: duration,
    });
  };

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
                  type="button"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => handleSelect(p)}
                  className={`group flex flex-col items-center gap-2 py-4 opacity-80 hover:opacity-100 transition-all duration-300 hover:scale-105 ${
                    p.id === 'autres'
                      ? 'col-span-2 justify-self-center w-[calc((100%-1rem)/2)] md:col-span-1 md:col-start-2 md:w-auto'
                      : ''
                  }`}
                >
                  <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-[#F2F8F4] group-hover:bg-gradient-to-br group-hover:from-[#e8f5e8] group-hover:to-[#d4f4d4] group-hover:shadow-lg transition-all duration-300 flex items-center justify-center relative">
                    <Image
                      src={p.icon}
                      alt={p.name}
                      width={48}
                      height={48}
                      className={`w-10 h-10 md:w-12 md:h-12 object-cover transition-transform duration-300 ${getProjectIconScaleClasses(isAutresProject(p.id))}`}
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
              type="button"
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

            <div className="bg-white border border-timberwolf/30 rounded-2xl p-5 sm:p-6 shadow-xs">
              <SavingsSimulatorControls
                mensualite={monthly}
                duree={duration}
                onMensualiteChange={handleMensualiteChange}
                onDureeChange={handleDureeChange}
                mensualiteError={mensualiteError}
                dureeError={dureeError}
                layout="stacked"
              />
            </div>

            {submitError && (
              <p className="text-sm text-red-600 text-center mt-3">{submitError}</p>
            )}

            <button
              type="button"
              onClick={handleContinue}
              className="group relative w-full mt-6 px-8 py-4 bg-gradient-to-r from-[#344925] to-[#435933] hover:from-[#2a3a1e] hover:to-[#364529] text-white font-semibold rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:scale-[0.98] flex items-center justify-center gap-3 overflow-hidden"
            >
              <span className="relative z-10">Je commence maintenant</span>
              <span className="relative z-10 group-hover:translate-x-1 transition-transform duration-300">
                →
              </span>
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
