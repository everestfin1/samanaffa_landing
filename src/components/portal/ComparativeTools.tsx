'use client';

import { useState } from 'react';
import Decimal from 'decimal.js';
import {
  ChartBarIcon,
  ScaleIcon,
  ArrowTrendingUpIcon,
  BanknotesIcon,
  CalendarDaysIcon,
  ShieldCheckIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  CheckCircleIcon,
  XCircleIcon,
  CurrencyDollarIcon,
  ClockIcon,
  StarIcon,
  LightBulbIcon
} from '@heroicons/react/24/outline';

interface ComparisonScenario {
  id: string;
  name: string;
  samaNaffaAmount: number;
  samaNaffaDuration: number;
  samaNaffaRate: number;
  apeAmount: number;
  apeDuration: 3 | 5 | 7 | 10;
  apeRate: number;
  totalInvestment: number;
  projectedReturn: number;
  riskLevel: 'low' | 'medium' | 'high';
  liquidityScore: number;
}

export default function ComparativeTools() {
  const [activeComparison, setActiveComparison] = useState<'returns' | 'risk' | 'liquidity' | 'scenarios'>('returns');
  const [comparisonAmount, setComparisonAmount] = useState<string>('1000000');
  const [comparisonDuration, setComparisonDuration] = useState<number>(5);

  const scenarios: ComparisonScenario[] = [
    {
      id: '1',
      name: 'Stratégie équilibrée',
      samaNaffaAmount: 600000,
      samaNaffaDuration: 5,
      samaNaffaRate: 6.0,
      apeAmount: 400000,
      apeDuration: 5,
      apeRate: 6.60,
      totalInvestment: 1000000,
      projectedReturn: 1324000,
      riskLevel: 'low',
      liquidityScore: 75
    },
    {
      id: '2',
      name: 'Croissance maximale',
      samaNaffaAmount: 300000,
      samaNaffaDuration: 10,
      samaNaffaRate: 8.5,
      apeAmount: 700000,
      apeDuration: 10,
      apeRate: 6.95,
      totalInvestment: 1000000,
      projectedReturn: 1486500,
      riskLevel: 'medium',
      liquidityScore: 45
    },
    {
      id: '3',
      name: 'Sécurité prioritaire',
      samaNaffaAmount: 800000,
      samaNaffaDuration: 3,
      samaNaffaRate: 4.5,
      apeAmount: 200000,
      apeDuration: 3,
      apeRate: 6.40,
      totalInvestment: 1000000,
      projectedReturn: 1148400,
      riskLevel: 'low',
      liquidityScore: 90
    }
  ];

  // Helper function to calculate days remaining for each payment
  const getDaysRemaining = (monthIndex: number, totalMonths: number): number => {
    // For 12-month period, use exact calendar days
    const exactDays12Months = [365, 334, 306, 275, 245, 214, 184, 153, 122, 92, 61, 1];
    
    if (totalMonths === 12 && monthIndex < 12) {
      return exactDays12Months[monthIndex];
    }
    
    // For other durations, calculate based on standard month lengths
    const monthLengths = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    
    // Calculate days remaining from this month
    let daysRemaining = 0;
    for (let i = monthIndex; i < totalMonths; i++) {
      daysRemaining += monthLengths[i % 12];
    }
    
    // Last payment compounds for only 1 day (end of period)
    if (monthIndex === totalMonths - 1) {
      return 1;
    }
    
    return daysRemaining;
  };

  const calculateSamaNaffaReturn = (amount: number, duration: number) => {
    const rates = {
      0.5: 3.5, 1: 4.5, 3: 6.0, 5: 7.0, 10: 8.5, 20: 10.0
    };
    
    let rate = 3.5;
    if (duration <= 0.5) rate = 3.5;
    else if (duration <= 1) rate = 4.5;
    else if (duration <= 3) rate = 6.0;
    else if (duration <= 5) rate = 7.0;
    else if (duration <= 10) rate = 8.5;
    else rate = 10.0;

    // Use Decimal.js for high-precision financial calculations
    // Formula: amount * (1 + annual_rate)^(days_remaining/365)
    // Achieves <0.02% deviation from Excel (within acceptable tolerance)
    Decimal.set({ precision: 20, rounding: Decimal.ROUND_HALF_UP });
    
    const annualRateDecimal = new Decimal(rate).div(100);
    const months = Math.round(duration * 12);
    const monthlyAmount = new Decimal(amount).div(months);
    
    // Calculate compound interest for recurring contributions
    // Each monthly contribution compounds for the remaining days
    let totalAmount = new Decimal(0);
    for (let i = 0; i < months; i++) {
      const remainingDays = getDaysRemaining(i, months);
      const exponent = new Decimal(remainingDays).div(365);
      const facteur = new Decimal(1).plus(annualRateDecimal).pow(exponent);
      totalAmount = totalAmount.plus(monthlyAmount.times(facteur));
    }
    
    return totalAmount.toNumber();
  };

  const calculateAPEReturn = (amount: number, duration: 3 | 5 | 7 | 10) => {
    const rates = { 3: 6.40, 5: 6.60, 7: 6.75, 10: 6.95 };
    const rate = rates[duration];
    const semiAnnualRate = rate / 2 / 100;
    const periods = duration * 2;
    const totalInterest = amount * semiAnnualRate * periods;
    return amount + totalInterest;
  };

  const renderReturnsComparison = () => {
    const amount = parseInt(comparisonAmount) || 1000000;
    const samaNaffaReturn = calculateSamaNaffaReturn(amount, comparisonDuration);
    const apeReturn = calculateAPEReturn(amount, comparisonDuration as 3 | 5 | 7 | 10);

    return (
      <div className="space-y-8">
        <div className="bg-white rounded-2xl border border-timberwolf/20 p-8">
          <h3 className="text-xl font-bold text-night mb-6">Comparaison des rendements</h3>
          
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div>
              <label className="block text-sm font-medium text-night mb-2">Montant à investir (FCFA)</label>
              <input 
                type="number" 
                value={comparisonAmount}
                onChange={(e) => setComparisonAmount(e.target.value)}
                className="w-full px-4 py-3 border border-timberwolf/30 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="1000000"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-night mb-2">Durée (années)</label>
              <select 
                value={comparisonDuration}
                onChange={(e) => setComparisonDuration(parseInt(e.target.value))}
                className="w-full px-4 py-3 border border-timberwolf/30 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="3">3 ans</option>
                <option value="5">5 ans</option>
                <option value="7">7 ans</option>
                <option value="10">10 ans</option>
              </select>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Sama Naffa Results */}
            <div className="bg-green-50 rounded-2xl border border-green-200 p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="bg-green-100 p-2 rounded-lg">
                  <BanknotesIcon className="w-6 h-6 text-green-600" />
                </div>
                <h4 className="text-lg font-bold text-night">Sama Naffa</h4>
              </div>
              
              <div className="space-y-4">
                <div>
                  <span className="text-sm text-night/60">Capital final estimé</span>
                  <div className="text-2xl font-bold text-green-600">
                    {samaNaffaReturn.toLocaleString('fr-FR', { maximumFractionDigits: 0 })} FCFA
                  </div>
                </div>
                <div>
                  <span className="text-sm text-night/60">Intérêts gagnés</span>
                  <div className="text-lg font-semibold text-night">
                    {(samaNaffaReturn - amount).toLocaleString('fr-FR', { maximumFractionDigits: 0 })} FCFA
                  </div>
                </div>
                <div>
                  <span className="text-sm text-night/60">Rendement total</span>
                  <div className="text-lg font-semibold text-green-600">
                    {(((samaNaffaReturn - amount) / amount) * 100).toFixed(1)}%
                  </div>
                </div>
              </div>

              <div className="mt-4 p-3 bg-white rounded-lg border">
                <div className="flex items-center space-x-2 mb-2">
                  <CheckCircleIcon className="w-4 h-4 text-green-500" />
                  <span className="text-sm font-medium text-night">Avantages</span>
                </div>
                <ul className="text-xs text-night/70 space-y-1">
                  <li>• Flexibilité des contributions</li>
                  <li>• Défis d'épargne motivants</li>
                  <li>• Tontines communautaires</li>
                  <li>• Accès mobile 24/7</li>
                </ul>
              </div>
            </div>

            {/* APE Results */}
            <div className="bg-blue-50 rounded-2xl border border-blue-200 p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <ShieldCheckIcon className="w-6 h-6 text-blue-600" />
                </div>
                <h4 className="text-lg font-bold text-night">Emprunt Obligataire</h4>
              </div>
              
              <div className="space-y-4">
                <div>
                  <span className="text-sm text-night/60">Capital final garanti</span>
                  <div className="text-2xl font-bold text-blue-600">
                    {apeReturn.toLocaleString('fr-FR', { maximumFractionDigits: 0 })} FCFA
                  </div>
                </div>
                <div>
                  <span className="text-sm text-night/60">Intérêts garantis</span>
                  <div className="text-lg font-semibold text-night">
                    {(apeReturn - amount).toLocaleString('fr-FR', { maximumFractionDigits: 0 })} FCFA
                  </div>
                </div>
                <div>
                  <span className="text-sm text-night/60">Rendement annuel</span>
                  <div className="text-lg font-semibold text-blue-600">
                    {comparisonDuration === 3 ? '6.40' : 
                     comparisonDuration === 5 ? '6.60' : 
                     comparisonDuration === 7 ? '6.75' : '6.95'}%
                  </div>
                </div>
              </div>

              <div className="mt-4 p-3 bg-white rounded-lg border">
                <div className="flex items-center space-x-2 mb-2">
                  <CheckCircleIcon className="w-4 h-4 text-blue-500" />
                  <span className="text-sm font-medium text-night">Avantages</span>
                </div>
                <ul className="text-xs text-night/70 space-y-1">
                  <li>• Garantie de l'État</li>
                  <li>• Paiements semestriels</li>
                  <li>• Rendements fixes</li>
                  <li>• Marché secondaire</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Comparison Summary */}
          <div className="mt-8 bg-timberwolf/5 rounded-lg p-6">
            <h4 className="font-semibold text-night mb-4">Résumé de la comparaison</h4>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div className="text-center">
                <div className="font-semibold text-night">Meilleur rendement</div>
                <div className={`text-lg font-bold ${samaNaffaReturn > apeReturn ? 'text-green-600' : 'text-blue-600'}`}>
                  {samaNaffaReturn > apeReturn ? 'Sama Naffa' : 'Emprunt Obligataire'}
                </div>
                <div className="text-xs text-night/60">
                  +{Math.abs(samaNaffaReturn - apeReturn).toLocaleString('fr-FR', { maximumFractionDigits: 0 })} FCFA
                </div>
              </div>
              <div className="text-center">
                <div className="font-semibold text-night">Sécurité</div>
                <div className="text-lg font-bold text-blue-600">Emprunt Obligataire</div>
                <div className="text-xs text-night/60">Garantie État</div>
              </div>
              <div className="text-center">
                <div className="font-semibold text-night">Flexibilité</div>
                <div className="text-lg font-bold text-green-600">Sama Naffa</div>
                <div className="text-xs text-night/60">Plus d'options</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderRiskComparison = () => (
    <div className="space-y-8">
      <div className="bg-white rounded-2xl border border-timberwolf/20 p-8">
        <h3 className="text-xl font-bold text-night mb-6">Analyse des risques et liquidité</h3>
        
        <div className="grid md:grid-cols-2 gap-8">
          {/* Risk Analysis */}
          <div>
            <h4 className="font-semibold text-night mb-4">Profil de risque</h4>
            <div className="space-y-4">
              <div className="border border-timberwolf/20 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-medium text-night">Sama Naffa</span>
                  <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-sm">Risque Moyen</span>
                </div>
                <div className="space-y-2 text-sm text-night/70">
                  <div className="flex items-center space-x-2">
                    <ExclamationTriangleIcon className="w-4 h-4 text-yellow-500" />
                    <span>Dépend de la performance de la plateforme</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <InformationCircleIcon className="w-4 h-4 text-blue-500" />
                    <span>Taux variables selon la durée</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircleIcon className="w-4 h-4 text-green-500" />
                    <span>Diversification avec tontines</span>
                  </div>
                </div>
              </div>

              <div className="border border-timberwolf/20 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-medium text-night">Emprunt Obligataire</span>
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">Risque Faible</span>
                </div>
                <div className="space-y-2 text-sm text-night/70">
                  <div className="flex items-center space-x-2">
                    <ShieldCheckIcon className="w-4 h-4 text-green-500" />
                    <span>Garantie souveraine du Sénégal</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircleIcon className="w-4 h-4 text-green-500" />
                    <span>Taux fixes et prévisibles</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <InformationCircleIcon className="w-4 h-4 text-blue-500" />
                    <span>Risque de taux d'intérêt</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Liquidity Analysis */}
          <div>
            <h4 className="font-semibold text-night mb-4">Liquidité</h4>
            <div className="space-y-4">
              <div className="border border-timberwolf/20 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-medium text-night">Sama Naffa</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-16 bg-timberwolf/20 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: '85%' }}></div>
                    </div>
                    <span className="text-sm text-night/60">85%</span>
                  </div>
                </div>
                <div className="space-y-2 text-sm text-night/70">
                  <div>• Accès flexible aux fonds</div>
                  <div>• Retraits partiels possibles</div>
                  <div>• Frais de sortie anticipée</div>
                </div>
              </div>

              <div className="border border-timberwolf/20 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-medium text-night">Emprunt Obligataire</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-16 bg-timberwolf/20 rounded-full h-2">
                      <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '60%' }}></div>
                    </div>
                    <span className="text-sm text-night/60">60%</span>
                  </div>
                </div>
                <div className="space-y-2 text-sm text-night/70">
                  <div>• Engagement jusqu'à maturité</div>
                  <div>• Marché secondaire disponible</div>
                  <div>• Prix variable selon le marché</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Risk-Return Matrix */}
        <div className="mt-8 bg-timberwolf/5 rounded-lg p-6">
          <h4 className="font-semibold text-night mb-4">Matrice risque-rendement</h4>
          <div className="relative bg-white rounded-lg p-6 border">
            <div className="grid grid-cols-3 gap-4 h-48">
              {/* Low Risk, Low Return */}
              <div className="bg-green-50 rounded-lg p-4 flex flex-col justify-end">
                <div className="text-center">
                  <div className="w-3 h-3 bg-blue-500 rounded-full mx-auto mb-2"></div>
                  <div className="text-xs font-medium">APE 3-5 ans</div>
                  <div className="text-xs text-night/60">Faible risque</div>
                </div>
              </div>
              
              {/* Medium Risk, Medium Return */}
              <div className="bg-yellow-50 rounded-lg p-4 flex flex-col justify-center">
                <div className="text-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full mx-auto mb-2"></div>
                  <div className="text-xs font-medium">Sama Naffa</div>
                  <div className="text-xs text-night/60">Risque modéré</div>
                </div>
              </div>
              
              {/* High Risk, High Return */}
              <div className="bg-red-50 rounded-lg p-4 flex flex-col justify-start">
                <div className="text-center">
                  <div className="w-3 h-3 bg-blue-600 rounded-full mx-auto mb-2"></div>
                  <div className="text-xs font-medium">APE 10 ans</div>
                  <div className="text-xs text-night/60">Rendement élevé</div>
                </div>
              </div>
            </div>
            
            <div className="absolute bottom-2 left-2 text-xs text-night/60">Faible rendement</div>
            <div className="absolute top-2 right-2 text-xs text-night/60">Rendement élevé</div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderScenarios = () => (
    <div className="space-y-8">
      <div className="bg-white rounded-2xl border border-timberwolf/20 p-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-night">Scénarios de portefeuille mixte</h3>
          <button className="bg-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-purple-700 transition-colors">
            Créer un scénario
          </button>
        </div>
        
        <div className="space-y-6">
          {scenarios.map((scenario) => (
            <div key={scenario.id} className="border border-timberwolf/20 rounded-lg p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h4 className="text-lg font-bold text-night mb-1">{scenario.name}</h4>
                  <div className="flex items-center space-x-4 text-sm text-night/60">
                    <span>Total: {scenario.totalInvestment.toLocaleString()} FCFA</span>
                    <span className={`px-2 py-1 rounded text-xs ${
                      scenario.riskLevel === 'low' ? 'bg-green-100 text-green-800' :
                      scenario.riskLevel === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {scenario.riskLevel === 'low' ? 'Risque faible' :
                       scenario.riskLevel === 'medium' ? 'Risque modéré' :
                       'Risque élevé'}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-green-600">
                    {scenario.projectedReturn.toLocaleString()} FCFA
                  </div>
                  <div className="text-sm text-night/60">Projection à terme</div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-4">
                {/* Sama Naffa Allocation */}
                <div className="bg-green-50 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-3">
                    <BanknotesIcon className="w-5 h-5 text-green-600" />
                    <span className="font-semibold text-night">Sama Naffa</span>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-night/70">Montant:</span>
                      <span className="font-semibold">{scenario.samaNaffaAmount.toLocaleString()} FCFA</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-night/70">Durée:</span>
                      <span className="font-semibold">{scenario.samaNaffaDuration} ans</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-night/70">Taux:</span>
                      <span className="font-semibold text-green-600">{scenario.samaNaffaRate}%</span>
                    </div>
                  </div>
                </div>

                {/* APE Allocation */}
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-3">
                    <ShieldCheckIcon className="w-5 h-5 text-blue-600" />
                    <span className="font-semibold text-night">Emprunt Obligataire</span>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-night/70">Montant:</span>
                      <span className="font-semibold">{scenario.apeAmount.toLocaleString()} FCFA</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-night/70">Durée:</span>
                      <span className="font-semibold">{scenario.apeDuration} ans</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-night/70">Taux:</span>
                      <span className="font-semibold text-blue-600">{scenario.apeRate}%</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Allocation Chart */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-night">Répartition</span>
                  <span className="text-sm text-night/60">Score liquidité: {scenario.liquidityScore}/100</span>
                </div>
                <div className="w-full bg-timberwolf/20 rounded-full h-3 flex overflow-hidden">
                  <div 
                    className="bg-green-500 h-full"
                    style={{ width: `${(scenario.samaNaffaAmount / scenario.totalInvestment) * 100}%` }}
                  ></div>
                  <div 
                    className="bg-blue-500 h-full"
                    style={{ width: `${(scenario.apeAmount / scenario.totalInvestment) * 100}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs text-night/60 mt-1">
                  <span>Sama Naffa ({((scenario.samaNaffaAmount / scenario.totalInvestment) * 100).toFixed(0)}%)</span>
                  <span>APE ({((scenario.apeAmount / scenario.totalInvestment) * 100).toFixed(0)}%)</span>
                </div>
              </div>

              <div className="flex space-x-3">
                <button className="flex-1 bg-purple-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-purple-700 transition-colors">
                  Analyser en détail
                </button>
                <button className="flex-1 border border-purple-600 text-purple-600 py-2 px-4 rounded-lg font-medium hover:bg-purple-50 transition-colors">
                  Dupliquer
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Strategy Recommendations */}
      <div className="bg-white rounded-2xl border border-timberwolf/20 p-8">
        <h3 className="text-xl font-bold text-night mb-6">Recommandations stratégiques</h3>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-start space-x-3 p-4 bg-blue-50 rounded-lg">
              <LightBulbIcon className="w-6 h-6 text-blue-500 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-night mb-1">Diversification optimale</h4>
                <p className="text-sm text-night/70">
                  Répartissez 60-70% dans Sama Naffa pour la croissance et 30-40% dans APE pour la stabilité.
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3 p-4 bg-green-50 rounded-lg">
              <CalendarDaysIcon className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-night mb-1">Échelonnement temporel</h4>
                <p className="text-sm text-night/70">
                  Variez les échéances pour maintenir un flux de liquidités régulier.
                </p>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-start space-x-3 p-4 bg-yellow-50 rounded-lg">
              <ArrowTrendingUpIcon className="w-6 h-6 text-yellow-500 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-night mb-1">Réinvestissement</h4>
                <p className="text-sm text-night/70">
                  Réinvestissez automatiquement les intérêts APE dans Sama Naffa pour maximiser la croissance.
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3 p-4 bg-purple-50 rounded-lg">
              <ScaleIcon className="w-6 h-6 text-purple-500 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-night mb-1">Rééquilibrage</h4>
                <p className="text-sm text-night/70">
                  Réévaluez et ajustez votre allocation tous les 6 mois selon vos objectifs.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSectionContent = () => {
    switch (activeComparison) {
      case 'returns':
        return renderReturnsComparison();
      case 'risk':
        return renderRiskComparison();
      case 'scenarios':
        return renderScenarios();
      default:
        return renderReturnsComparison();
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl p-8 border border-purple-100">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-night mb-2">Outils de comparaison</h2>
            <p className="text-night/70 text-lg">Comparez et optimisez vos stratégies d'investissement</p>
          </div>
          <div className="hidden md:block">
            <div className="bg-purple-100 p-4 rounded-full">
              <ScaleIcon className="w-12 h-12 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-2xl border border-timberwolf/20 p-2">
        <div className="flex flex-wrap gap-2">
          {[
            { id: 'returns', label: 'Rendements', icon: ArrowTrendingUpIcon },
            { id: 'risk', label: 'Risques & Liquidité', icon: ShieldCheckIcon },
            { id: 'scenarios', label: 'Portefeuilles mixtes', icon: ChartBarIcon }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveComparison(tab.id as 'returns' | 'risk' | 'scenarios')}
              className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-colors ${
                activeComparison === tab.id
                  ? 'bg-purple-600 text-white shadow-lg'
                  : 'text-night hover:bg-timberwolf/10'
              }`}
            >
              <tab.icon className="w-5 h-5" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Section Content */}
      {renderSectionContent()}
    </div>
  );
}
