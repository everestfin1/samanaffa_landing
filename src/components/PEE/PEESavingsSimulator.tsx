'use client';

import { useEffect, useState } from 'react';
import Decimal from 'decimal.js';

import { Card, CardContent } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils';

const tauxParDuree = (mois: number): number => {
  if (mois <= 6) return 3.5;
  if (mois <= 12) return 4.5;
  if (mois <= 36) return 6.0;
  if (mois <= 60) return 7.0;
  if (mois <= 120) return 8.5;
  return 10.0;
};

const getDaysRemaining = (monthIndex: number, totalMonths: number): number => {
  const exactDays12Months = [365, 334, 306, 275, 245, 214, 184, 153, 122, 92, 61, 1];

  if (totalMonths === 12 && monthIndex < 12) {
    return exactDays12Months[monthIndex] ?? 1;
  }

  const monthLengths = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

  let daysRemaining = 0;
  for (let i = monthIndex; i < totalMonths; i++) {
    daysRemaining += monthLengths[i % 12] ?? 30;
  }

  if (monthIndex === totalMonths - 1) {
    return 1;
  }

  return daysRemaining;
};

const calculerCapitalFinal = (
  mensuel: number,
  dureeMois: number,
  tauxAnnuel: number
): { capitalFinal: number; interets: number } => {
  Decimal.set({ precision: 20, rounding: Decimal.ROUND_HALF_UP });

  const tauxAnnuelDecimal = new Decimal(tauxAnnuel).div(100);
  const montantMensuel = new Decimal(mensuel);
  let capitalFinal = new Decimal(0);

  for (let i = 0; i < dureeMois; i++) {
    const joursRestants = getDaysRemaining(i, dureeMois);
    const exponent = new Decimal(joursRestants).div(365);
    const facteur = new Decimal(1).plus(tauxAnnuelDecimal).pow(exponent);
    capitalFinal = capitalFinal.plus(montantMensuel.times(facteur));
  }

  const capitalVerse = mensuel * dureeMois;
  const interets = capitalFinal.toNumber() - capitalVerse;

  return {
    capitalFinal: capitalFinal.toNumber(),
    interets,
  };
};

export default function PEESavingsSimulator() {
  const [duree, setDuree] = useState(12);
  const [mensualite, setMensualite] = useState(30000);
  const [taux, setTaux] = useState(tauxParDuree(12));
  const [mensualiteError, setMensualiteError] = useState<string | null>(null);
  const [dureeError, setDureeError] = useState<string | null>(null);

  useEffect(() => {
    setTaux(tauxParDuree(duree));
  }, [duree]);

  const handleMensualiteChange = (value: number) => {
    setMensualite(value);
    setMensualiteError(null);
    
    if (isNaN(value) || value < 30000) {
      setMensualiteError('Le montant minimum est de 30 000 FCFA');
      return;
    }
    
    if (value > 500000) {
      setMensualiteError('Le montant maximum est de 500 000 FCFA');
      return;
    }
    
    if (value % 1000 !== 0) {
      setMensualiteError('Le montant doit être un multiple de 1 000 FCFA');
      return;
    }
  };

  const handleDureeChange = (value: number) => {
    setDuree(value);
    setDureeError(null);
    
    if (isNaN(value) || value < 6) {
      setDureeError('La durée minimum est de 6 mois');
      return;
    }
    
    if (value > 180) {
      setDureeError('La durée maximum est de 180 mois (15 ans)');
      return;
    }
  };

  const { capitalFinal, interets } = calculerCapitalFinal(mensualite, duree, taux);
  const totalVerse = mensualite * duree;

  return (
    <section id="simulateur" className="py-16 md:py-20" style={{ backgroundImage: "url('/simulator_bg.jpg')" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8 lg:mb-10">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-[#2e0e36] mb-3">
              Simulateur d'épargne
            </h2>
            <p className="text-base md:text-lg text-[#2e0e36]/70">
              Ajustez le montant et la durée pour estimer votre capital.
            </p>
          </div>

          <Card className="rounded-xl sm:rounded-2xl lg:rounded-[35px] border border-gray-300 bg-white/75">
            <CardContent className="p-4 sm:p-6 lg:p-10 space-y-6 lg:space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 lg:gap-6">
                <div className="space-y-2 lg:space-y-3">
                  <label className="block text-sm sm:text-base lg:text-lg font-medium text-[#2e0e36]">
                    Montant mensuel
                  </label>
                  <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                      <input
                        type="number"
                        min={30000}
                        max={500000}
                        step={1000}
                        value={mensualite}
                        onChange={(e) => handleMensualiteChange(Number(e.target.value))}
                        className={`w-full px-3 py-2 border rounded-lg text-sm sm:text-base font-bold text-[#C09037] focus:ring-2 focus:ring-[#C09037] focus:border-transparent transition-colors ${
                          mensualiteError ? 'border-red-300 bg-red-50' : 'border-gray-300'
                        }`}
                      />
                    </div>
                    <span className="text-sm text-[#2e0e36]/70 whitespace-nowrap">FCFA</span>
                  </div>
                  {mensualiteError && (
                    <p className="text-sm text-red-600">{mensualiteError}</p>
                  )}
                  <input
                    type="range"
                    min={30000}
                    max={500000}
                    step={1000}
                    value={mensualite}
                    onChange={(e) => handleMensualiteChange(Number(e.target.value))}
                    className="w-full h-2 sm:h-2 lg:h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full appearance-none cursor-pointer slider"
                    style={{
                      background: `linear-gradient(to right, #C09037 0%, #C09037 ${((mensualite - 30000) / (500000 - 30000)) * 100}%, #e5e7eb ${((mensualite - 30000) / (500000 - 30000)) * 100}%, #e5e7eb 100%)`,
                    }}
                  />
                  <div className="flex justify-between text-[10px] sm:text-xs lg:text-sm text-gray-500">
                    <span>30K</span>
                    <span className="hidden sm:inline">500K</span>
                  </div>
                </div>

                <div className="space-y-2 lg:space-y-3">
                  <label className="block text-sm sm:text-base lg:text-lg font-medium text-[#2e0e36]">
                    Durée d'épargne
                  </label>
                  <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                      <input
                        type="number"
                        min={6}
                        max={180}
                        step={1}
                        value={duree}
                        onChange={(e) => handleDureeChange(Number(e.target.value))}
                        className={`w-full px-3 py-2 border rounded-lg text-sm sm:text-base font-bold text-[#2e0e36] focus:ring-2 focus:ring-[#C09037] focus:border-transparent transition-colors ${
                          dureeError ? 'border-red-300 bg-red-50' : 'border-gray-300'
                        }`}
                      />
                    </div>
                    <span className="text-sm text-[#2e0e36]/70 whitespace-nowrap">mois</span>
                  </div>
                  {dureeError && (
                    <p className="text-sm text-red-600">{dureeError}</p>
                  )}
                  <input
                    type="range"
                    min={6}
                    max={180}
                    step={1}
                    value={duree}
                    onChange={(e) => handleDureeChange(Number(e.target.value))}
                    className="w-full h-2 sm:h-2 lg:h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full appearance-none cursor-pointer slider"
                    style={{
                      background: `linear-gradient(to right, #2e0e36 0%, #2e0e36 ${((duree - 6) / (180 - 6)) * 100}%, #e5e7eb ${((duree - 6) / (180 - 6)) * 100}%, #e5e7eb 100%)`,
                    }}
                  />
                  <div className="flex justify-between text-[10px] sm:text-xs lg:text-sm text-gray-500">
                    <span>6 mois</span>
                    <span className="hidden sm:inline">15 ans</span>
                  </div>
                </div>
              </div>

              <div className="p-3 sm:p-3 lg:p-4 bg-gradient-to-r from-[#2e0e36]/10 to-[#C09037]/10 rounded-lg sm:rounded-xl border border-[#2e0e36]/20">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-3 lg:gap-0">
                  <span className="text-[#2e0e36] font-medium text-sm sm:text-base lg:text-lg text-center sm:text-left">
                    Taux d'intérêt :{" "}
                    <span className="font-bold text-base sm:text-lg lg:text-xl text-[#C09037]">
                      {taux.toFixed(1)}%
                    </span>{" "}
                    <span className="hidden sm:inline">par an</span>
                  </span>
                  <div className="text-[10px] sm:text-xs lg:text-sm text-gray-600">
                    {duree <= 6 && "💡 Très court terme"}
                    {duree > 6 && duree <= 12 && "📈 Court terme"}
                    {duree > 12 && duree <= 36 && "🚀 Moyen terme"}
                    {duree > 36 && duree <= 60 && "💎 Long terme"}
                    {duree > 60 && "🏆 Très long terme"}
                  </div>
                </div>
              </div>

              <div className="text-center space-y-2 sm:space-y-3 lg:space-y-4 p-3 sm:p-4 lg:p-6 bg-gradient-to-br from-[#F2F8F4] to-white rounded-lg sm:rounded-xl">
                <h4 className="font-normal text-[#2e0e36] text-base sm:text-lg lg:text-[24px] mb-1 sm:mb-2">
                  Capital final estimé
                </h4>
                <div className="font-bold text-[#2e0e36] text-xl sm:text-2xl lg:text-[36px] mb-1 sm:mb-2">
                  {formatCurrency(Math.round(capitalFinal))}
                </div>
                <div className="font-normal text-[#969696] text-xs sm:text-sm lg:text-base mb-2 sm:mb-3 lg:mb-4 px-2">
                  Plan {Math.round((duree / 12) * 10) / 10} ans - Rendement{" "}
                  {taux.toFixed(1)}% - {formatCurrency(mensualite)}/mois
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 sm:gap-3 lg:gap-4 p-2 sm:p-3 lg:p-4 bg-white rounded-lg shadow-sm">
                <div className="text-center">
                  <div className="text-[10px] sm:text-xs lg:text-sm text-gray-600 mb-1">
                    Total versé
                  </div>
                  <div className="font-medium text-[#C09037] text-xs sm:text-sm lg:text-lg break-words">
                    {formatCurrency(totalVerse)}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-[10px] sm:text-xs lg:text-sm text-gray-600 mb-1">
                    Intérêts
                  </div>
                  <div className="font-medium text-[#2e0e36] text-xs sm:text-sm lg:text-lg break-words">
                    +{formatCurrency(Math.round(interets))}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-[10px] sm:text-xs lg:text-sm text-gray-600 mb-1">
                    Total final
                  </div>
                  <div className="font-medium text-[#2e0e36] text-xs sm:text-sm lg:text-lg break-words">
                    {formatCurrency(Math.round(capitalFinal))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
