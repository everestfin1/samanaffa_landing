'use client';

import { useCallback, useState } from 'react';
import Image from 'next/image';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { objectives } from '@/components/data/objectives';
import SavingsSimulatorControls from '@/components/SamaNaffa/SavingsSimulatorControls';
import { validateDuree, validateMensualite } from '@/lib/savings-simulation';
import {
  NAFFA_CUSTOM_NAME_MAX,
  NaffaPlanInput,
  validateCustomNaffaName,
} from '@/lib/naffa-plan';
import { getProjectIconScaleClasses, isAutresProject } from '@/lib/project-icon-display';

type ObjectiveOption = (typeof objectives)[number];

interface CreateNaffaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateNaffa: (plan: NaffaPlanInput) => void;
  isSubmitting?: boolean;
  errorMessage?: string | null;
}

export default function CreateNaffaModal({
  isOpen,
  onClose,
  onCreateNaffa,
  isSubmitting = false,
  errorMessage = null,
}: CreateNaffaModalProps) {
  const [selectedObjective, setSelectedObjective] = useState<ObjectiveOption | null>(null);
  const [mensualite, setMensualite] = useState(0);
  const [duree, setDuree] = useState(0);
  const [mensualiteError, setMensualiteError] = useState<string | null>(null);
  const [dureeError, setDureeError] = useState<string | null>(null);
  const [customName, setCustomName] = useState('');
  const [customNameError, setCustomNameError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const isAutresSelected = selectedObjective?.slug === 'autres';

  const resetForm = useCallback(() => {
    setSelectedObjective(null);
    setMensualite(0);
    setDuree(0);
    setCustomName('');
    setMensualiteError(null);
    setDureeError(null);
    setCustomNameError(null);
    setSubmitError(null);
  }, []);

  const handleClose = useCallback(() => {
    if (isSubmitting) return;
    resetForm();
    onClose();
  }, [isSubmitting, onClose, resetForm]);

  const handleSelectObjective = (objective: ObjectiveOption) => {
    setSelectedObjective(objective);
    setMensualite(objective.mensualite);
    setDuree(objective.duree);
    setCustomName('');
    setMensualiteError(null);
    setDureeError(null);
    setCustomNameError(null);
    setSubmitError(null);
  };

  const handleMensualiteChange = (value: number) => {
    setMensualite(value);
    setMensualiteError(validateMensualite(value));
  };

  const handleDureeChange = (value: number) => {
    setDuree(value);
    setDureeError(validateDuree(value));
  };

  const handleConfirm = () => {
    const mErr = validateMensualite(mensualite);
    const dErr = validateDuree(duree);
    const nameErr =
      selectedObjective?.slug === 'autres' ? validateCustomNaffaName(customName) : null;
    setMensualiteError(mErr);
    setDureeError(dErr);
    setCustomNameError(nameErr);

    if (!selectedObjective || mErr || dErr || nameErr) {
      setSubmitError('Complétez votre projet et ajustez le plan d’épargne.');
      return;
    }

    setSubmitError(null);
    onCreateNaffa({
      objectiveSlug: selectedObjective.slug,
      objectiveId: selectedObjective.id,
      objectiveName: selectedObjective.name,
      objectiveTitre: selectedObjective.titre,
      monthlyAmount: mensualite,
      durationMonths: duree,
      ...(selectedObjective.slug === 'autres' ? { customName: customName.trim() } : {}),
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="flex w-full max-w-2xl max-h-[90vh] flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="flex shrink-0 items-center justify-between border-b border-timberwolf/20 bg-white p-6">
          <div>
            <h2 className="text-2xl font-bold text-night">Créer un nouveau Naffa</h2>
            <p className="mt-1 text-night/70">
              {selectedObjective
                ? 'Ajustez votre versement mensuel et la durée de votre plan.'
                : 'Choisissez votre projet, puis définissez votre plan d’épargne.'}
            </p>
          </div>
          <button
            type="button"
            onClick={handleClose}
            disabled={isSubmitting}
            className="rounded-lg p-2 text-night/50 transition-colors hover:bg-timberwolf/10 hover:text-night disabled:cursor-not-allowed disabled:opacity-60"
            aria-label="Fermer"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto p-6">
          {!selectedObjective ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {objectives.map((objective) => (
                <button
                  key={objective.slug}
                  type="button"
                  onClick={() => handleSelectObjective(objective)}
                  disabled={isSubmitting}
                  className={`group flex flex-col items-center gap-2 py-3 opacity-90 hover:opacity-100 transition-all hover:scale-[1.02] disabled:opacity-50 ${
                    objective.slug === 'autres'
                      ? 'col-span-2 justify-self-center w-[calc((100%-1rem)/2)] sm:col-span-1 sm:col-start-2 sm:w-auto'
                      : ''
                  }`}
                >
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#F2F8F4] group-hover:bg-gradient-to-br group-hover:from-[#e8f5e8] group-hover:to-[#d4f4d4] flex items-center justify-center">
                    <Image
                      src={objective.icon}
                      alt={objective.name}
                      width={40}
                      height={40}
                      className={`w-9 h-9 sm:w-10 sm:h-10 object-cover ${getProjectIconScaleClasses(isAutresProject(objective.slug))}`}
                    />
                  </div>
                  <span className="font-semibold text-sm text-night group-hover:text-[#435933] text-center">
                    {objective.name}
                  </span>
                </button>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              <button
                type="button"
                onClick={() => {
                  if (isSubmitting) return;
                  setSelectedObjective(null);
                  setSubmitError(null);
                }}
                disabled={isSubmitting}
                className="text-sm text-night/60 hover:text-night disabled:opacity-50"
              >
                ← Choisir un autre projet
              </button>

              <div className="rounded-xl border border-timberwolf/20 bg-[#F2F8F4]/50 px-4 py-3">
                <p className="font-semibold text-night">{selectedObjective.titre}</p>
                <p className="mt-1 text-sm text-night/60">{selectedObjective.description}</p>
              </div>

              {isAutresSelected && (
                <div className="space-y-2">
                  <label htmlFor="naffa-custom-name" className="block text-sm font-medium text-night">
                    Nom de votre Naffa
                  </label>
                  <input
                    id="naffa-custom-name"
                    type="text"
                    value={customName}
                    onChange={(e) => {
                      setCustomName(e.target.value);
                      if (customNameError) {
                        setCustomNameError(null);
                      }
                    }}
                    onBlur={() => setCustomNameError(validateCustomNaffaName(customName))}
                    maxLength={NAFFA_CUSTOM_NAME_MAX}
                    placeholder="Ex. Projet mariage, Achat moto…"
                    disabled={isSubmitting}
                    className={`w-full rounded-lg border px-3 py-2 text-sm text-night focus:border-transparent focus:ring-2 focus:ring-[#435933] ${
                      customNameError ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                  />
                  {customNameError ? (
                    <p className="text-sm text-red-600">{customNameError}</p>
                  ) : (
                    <p className="text-xs text-night/50">
                      Ce nom apparaîtra sur votre tableau de bord.
                    </p>
                  )}
                </div>
              )}

              <SavingsSimulatorControls
                mensualite={mensualite}
                duree={duree}
                onMensualiteChange={handleMensualiteChange}
                onDureeChange={handleDureeChange}
                mensualiteError={mensualiteError}
                dureeError={dureeError}
                layout="stacked"
              />

              {submitError && (
                <p className="text-sm text-red-600 text-center">{submitError}</p>
              )}
            </div>
          )}
        </div>

        <div className="relative z-10 shrink-0 border-t border-timberwolf/20 bg-white p-6 space-y-3 shadow-[0_-4px_12px_rgba(0,0,0,0.04)]">
          {errorMessage && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">
              {errorMessage}
            </div>
          )}

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            {selectedObjective && (
              <p className="text-xs text-night/60">
                {isAutresSelected && customName.trim()
                  ? `Naffa · ${customName.trim()} · `
                  : ''}
                Versement cible : {mensualite.toLocaleString('fr-FR')} FCFA/mois · Durée : {duree}{' '}
                mois ({Math.round((duree / 12) * 10) / 10} ans)
              </p>
            )}

            <div className="flex items-center justify-end gap-3 sm:ml-auto">
              <button
                type="button"
                onClick={handleClose}
                disabled={isSubmitting}
                className="rounded-lg border border-timberwolf/30 px-6 py-2 font-medium text-night transition-colors hover:bg-timberwolf/10 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={handleConfirm}
                disabled={!selectedObjective || isSubmitting}
                className={`rounded-lg px-6 py-2 font-medium transition-colors ${
                  selectedObjective && !isSubmitting
                    ? 'bg-gold-metallic text-white hover:bg-gold-dark'
                    : 'cursor-not-allowed bg-timberwolf/30 text-night/50'
                }`}
              >
                {isSubmitting ? 'Création...' : 'Créer ce Naffa'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
