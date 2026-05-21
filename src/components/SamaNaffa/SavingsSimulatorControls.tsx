'use client';

import { formatCurrency } from '@/lib/utils';
import {
  calculerCapitalFinal,
  dureeTermLabel,
  SAVINGS_DUREE_MAX,
  SAVINGS_DUREE_MIN,
  SAVINGS_MENSUALITE_MAX,
  SAVINGS_MENSUALITE_MIN,
  SAVINGS_MENSUALITE_STEP,
  tauxParDuree,
} from '@/lib/savings-simulation';

export interface SavingsSimulatorControlsProps {
  mensualite: number;
  duree: number;
  onMensualiteChange: (value: number) => void;
  onDureeChange: (value: number) => void;
  mensualiteError?: string | null;
  dureeError?: string | null;
  onMensualiteBlur?: () => void;
  onDureeBlur?: () => void;
  /** When false, only amount/duration controls (no results block). */
  showResults?: boolean;
  layout?: 'full' | 'stacked';
}

export default function SavingsSimulatorControls({
  mensualite,
  duree,
  onMensualiteChange,
  onDureeChange,
  mensualiteError = null,
  dureeError = null,
  onMensualiteBlur,
  onDureeBlur,
  showResults = true,
  layout = 'full',
}: SavingsSimulatorControlsProps) {
  const taux = tauxParDuree(duree);
  const { capitalFinal, interets } = calculerCapitalFinal(mensualite, duree, taux);

  const mensualiteFill =
    ((mensualite - SAVINGS_MENSUALITE_MIN) / (SAVINGS_MENSUALITE_MAX - SAVINGS_MENSUALITE_MIN)) *
    100;
  const dureeFill =
    ((duree - SAVINGS_DUREE_MIN) / (SAVINGS_DUREE_MAX - SAVINGS_DUREE_MIN)) * 100;

  const gridClass =
    layout === 'stacked'
      ? 'grid grid-cols-1 gap-5'
      : 'grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5 lg:gap-8';

  return (
    <div className="space-y-4 sm:space-y-5 lg:space-y-6">
      <div className={gridClass}>
        <div className="space-y-2 lg:space-y-3">
          <label className="block text-sm sm:text-base font-medium text-[#060606]">
            Montant mensuel
          </label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              min={SAVINGS_MENSUALITE_MIN}
              max={SAVINGS_MENSUALITE_MAX}
              step={SAVINGS_MENSUALITE_STEP}
              value={mensualite}
              onChange={(e) => onMensualiteChange(Number(e.target.value))}
              onBlur={onMensualiteBlur}
              className={`w-full px-3 py-2 border rounded-lg text-sm sm:text-base font-bold text-[#C38D1C] focus:ring-2 focus:ring-[#435933] focus:border-transparent transition-colors ${
                mensualiteError ? 'border-red-300 bg-red-50' : 'border-gray-300'
              }`}
            />
            <span className="text-sm text-gray-600 whitespace-nowrap">FCFA</span>
          </div>
          {mensualiteError && <p className="text-sm text-red-600">{mensualiteError}</p>}
          <input
            type="range"
            min={SAVINGS_MENSUALITE_MIN}
            max={SAVINGS_MENSUALITE_MAX}
            step={SAVINGS_MENSUALITE_STEP}
            value={mensualite}
            onChange={(e) => onMensualiteChange(Number(e.target.value))}
            className="w-full h-2 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right, #435933 0%, #435933 ${mensualiteFill}%, #e5e7eb ${mensualiteFill}%, #e5e7eb 100%)`,
            }}
          />
          <div className="flex justify-between text-[10px] sm:text-xs text-gray-500">
            <span>1 000 FCFA</span>
            <span>500 000 FCFA</span>
          </div>
        </div>

        <div className="space-y-2 lg:space-y-3">
          <label className="block text-sm sm:text-base font-medium text-[#060606]">
            Durée d&apos;épargne
          </label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              min={SAVINGS_DUREE_MIN}
              max={SAVINGS_DUREE_MAX}
              step={1}
              value={duree}
              onChange={(e) => onDureeChange(Number(e.target.value))}
              onBlur={onDureeBlur}
              className={`w-full px-3 py-2 border rounded-lg text-sm sm:text-base font-bold text-[#435933] focus:ring-2 focus:ring-[#435933] focus:border-transparent transition-colors ${
                dureeError ? 'border-red-300 bg-red-50' : 'border-gray-300'
              }`}
            />
            <span className="text-sm text-gray-600 whitespace-nowrap">mois</span>
          </div>
          {dureeError && <p className="text-sm text-red-600">{dureeError}</p>}
          <input
            type="range"
            min={SAVINGS_DUREE_MIN}
            max={SAVINGS_DUREE_MAX}
            step={1}
            value={duree}
            onChange={(e) => onDureeChange(Number(e.target.value))}
            className="w-full h-2 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right, #435933 0%, #435933 ${dureeFill}%, #e5e7eb ${dureeFill}%, #e5e7eb 100%)`,
            }}
          />
          <div className="flex justify-between text-[10px] sm:text-xs text-gray-500">
            <span>6 mois</span>
            <span>180 mois (15 ans)</span>
          </div>
        </div>
      </div>

      {showResults && (
        <>
          <div className="p-3 sm:p-4 bg-gradient-to-r from-[#435933]/10 to-[#C38D1C]/10 rounded-lg sm:rounded-xl border border-[#435933]/20">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
              <span className="text-[#435933] font-medium text-sm sm:text-base">
                Taux d&apos;intérêt :{' '}
                <span className="font-bold text-base sm:text-lg">{taux.toFixed(1)}%</span> par an
              </span>
              <span className="text-[10px] sm:text-xs text-gray-600">{dureeTermLabel(duree)}</span>
            </div>
          </div>

          <div className="text-center space-y-2 sm:space-y-3 p-4 sm:p-6 bg-gradient-to-br from-[#F2F8F4] to-white rounded-lg sm:rounded-xl">
            <h4 className="font-normal text-[#060606] text-base sm:text-lg">Capital final estimé</h4>
            <div className="font-bold text-[#435933] text-xl sm:text-2xl lg:text-3xl">
              {formatCurrency(Math.round(capitalFinal))}
            </div>
            <div className="font-normal text-[#969696] text-xs sm:text-sm">
              Plan {Math.round((duree / 12) * 10) / 10} ans — {formatCurrency(mensualite)}/mois
            </div>
            <div className="grid grid-cols-3 gap-2 sm:gap-3 p-2 sm:p-3 bg-white rounded-lg shadow-sm">
              <div className="text-center">
                <div className="text-[10px] sm:text-xs text-gray-600 mb-1">Total versé</div>
                <div className="font-medium text-[#C38D1C] text-xs sm:text-sm break-words">
                  {formatCurrency(mensualite * duree)}
                </div>
              </div>
              <div className="text-center">
                <div className="text-[10px] sm:text-xs text-gray-600 mb-1">Intérêts gagnés</div>
                <div className="font-bold text-[#435933] text-xs sm:text-sm break-words">
                  +{formatCurrency(Math.round(interets))}
                </div>
              </div>
              <div className="text-center">
                <div className="text-[10px] sm:text-xs text-gray-800 font-medium mb-1">
                  Total final
                </div>
                <div className="font-bold text-[#435933] text-sm sm:text-base break-words">
                  {formatCurrency(Math.round(capitalFinal))}
                </div>
              </div>
            </div>
            <p className="text-[10px] text-night/40 italic">
              * Simulation indicative, non contractuelle
            </p>
          </div>
        </>
      )}
    </div>
  );
}
