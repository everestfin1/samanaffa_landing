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

  useEffect(() => {
    setTaux(tauxParDuree(duree));
  }, [duree]);

  const { capitalFinal, interets } = calculerCapitalFinal(mensualite, duree, taux);
  const totalVerse = mensualite * duree;

  return (
    <section id="simulateur" className="py-16 md:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-[#2e0e36] mb-3">
              Simulateur d’épargne
            </h2>
            <p className="text-base md:text-lg text-[#2e0e36]/70">
              Ajustez le montant et la durée pour estimer votre capital.
            </p>
          </div>

          <Card className="rounded-3xl shadow-xl border border-gray-100">
            <CardContent className="p-6 md:p-10 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-[#2e0e36]">
                    Montant mensuel
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="number"
                      min={1000}
                      max={500000}
                      step={1000}
                      value={mensualite}
                      onChange={(e) => setMensualite(Number(e.target.value))}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-[#C38D1C] focus:border-[#C38D1C] transition-colors"
                    />
                    <span className="text-sm text-[#2e0e36]/70 whitespace-nowrap">FCFA</span>
                  </div>
                  <input
                    type="range"
                    min={1000}
                    max={500000}
                    step={1000}
                    value={mensualite}
                    onChange={(e) => setMensualite(Number(e.target.value))}
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-[#2e0e36]">
                    Durée d’épargne
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="number"
                      min={6}
                      max={180}
                      step={1}
                      value={duree}
                      onChange={(e) => setDuree(Number(e.target.value))}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-[#C38D1C] focus:border-[#C38D1C] transition-colors"
                    />
                    <span className="text-sm text-[#2e0e36]/70 whitespace-nowrap">mois</span>
                  </div>
                  <input
                    type="range"
                    min={6}
                    max={180}
                    step={1}
                    value={duree}
                    onChange={(e) => setDuree(Number(e.target.value))}
                    className="w-full"
                  />
                </div>
              </div>

              <div className="p-4 rounded-xl border border-[#C38D1C]/25 bg-[#C38D1C]/10">
                <div className="text-center text-[#2e0e36]">
                  <span className="font-medium">Taux d’intérêt : </span>
                  <span className="font-bold text-[#C38D1C]">{taux.toFixed(1)}%</span>
                  <span className="font-medium"> / an</span>
                </div>
              </div>

              <div className="text-center space-y-2 p-5 rounded-2xl bg-gray-50">
                <h3 className="text-base md:text-lg text-[#2e0e36]">Capital final estimé</h3>
                <div className="text-2xl md:text-4xl font-bold text-[#2e0e36]">
                  {formatCurrency(Math.round(capitalFinal))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="rounded-2xl border border-gray-100 p-4 bg-white text-center">
                  <div className="text-xs md:text-sm text-[#2e0e36]/70 mb-1">Total versé</div>
                  <div className="font-semibold text-[#C38D1C]">{formatCurrency(totalVerse)}</div>
                </div>
                <div className="rounded-2xl border border-gray-100 p-4 bg-white text-center">
                  <div className="text-xs md:text-sm text-[#2e0e36]/70 mb-1">Intérêts gagnés</div>
                  <div className="font-semibold text-[#2e0e36]">+{formatCurrency(Math.round(interets))}</div>
                </div>
                <div className="rounded-2xl border border-gray-100 p-4 bg-white text-center">
                  <div className="text-xs md:text-sm text-[#2e0e36]/70 mb-1">Total final</div>
                  <div className="font-semibold text-[#2e0e36]">{formatCurrency(Math.round(capitalFinal))}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
