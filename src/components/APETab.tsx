'use client';

import { useState } from 'react';
import {
  BuildingLibraryIcon,
  CalculatorIcon,
  ChartBarIcon,
  DocumentTextIcon,
  ShieldCheckIcon,
  ArrowTrendingUpIcon,
  CalendarDaysIcon,
  BanknotesIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';

export default function APETab() {
  const [bondCalculator, setBondCalculator] = useState({
    amount: 1000000,
    term: 12,
    interestRate: 8.0
  });

  const [investmentPlanner, setInvestmentPlanner] = useState({
    monthlyInvestment: 100000,
    targetAmount: 5000000,
    riskTolerance: 'moderate'
  });

  const calculateBondReturns = () => {
    const monthlyRate = bondCalculator.interestRate / 100 / 12;
    const maturityAmount = bondCalculator.amount * Math.pow(1 + monthlyRate, bondCalculator.term);
    const totalReturn = maturityAmount - bondCalculator.amount;
    const annualReturn = (totalReturn / bondCalculator.amount) * (12 / bondCalculator.term) * 100;
    return { maturityAmount, totalReturn, annualReturn };
  };

  const calculateInvestmentTimeline = () => {
    const monthlyRate = bondCalculator.interestRate / 100 / 12;
    const months = Math.log(investmentPlanner.targetAmount / investmentPlanner.monthlyInvestment * monthlyRate + 1) / Math.log(1 + monthlyRate);
    return Math.ceil(months);
  };

  const { maturityAmount, totalReturn, annualReturn } = calculateBondReturns();
  const timeToTarget = calculateInvestmentTimeline();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="heading-1 text-3xl md:text-4xl text-night mb-4">
          APE Sénégal
          <span className="text-gold-metallic"> - Appel Public à l'Épargne</span>
        </h1>
        <p className="body-copy text-lg text-night/70 max-w-3xl">
          Investissez dans l'Appel Public à l'Épargne de l'État du Sénégal. Un placement sécurisé 
          avec des rendements attractifs, soutenu par la garantie gouvernementale et coté à la BRVM.
        </p>
      </div>

      {/* APE Overview Cards */}
      <section className="mb-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-gradient-to-br from-gold-metallic to-gold-metallic/80 text-night rounded-xl p-6">
            <div className="flex items-center justify-between mb-3">
              <ArrowTrendingUpIcon className="w-8 h-8" />
              <span className="text-sm font-medium bg-night/10 px-2 py-1 rounded">Garanti</span>
            </div>
            <h3 className="text-2xl font-bold mb-1">8.0%</h3>
            <p className="text-sm opacity-90">Taux d'intérêt annuel</p>
          </div>

          <div className="bg-white border border-timberwolf/20 rounded-xl p-6">
            <div className="flex items-center justify-between mb-3">
              <BanknotesIcon className="w-8 h-8 text-gold-metallic" />
              <ShieldCheckIcon className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-night mb-1">10,000</h3>
            <p className="text-sm text-night/70">Investissement minimum (FCFA)</p>
          </div>

          <div className="bg-white border border-timberwolf/20 rounded-xl p-6">
            <div className="flex items-center justify-between mb-3">
              <CalendarDaysIcon className="w-8 h-8 text-gold-metallic" />
              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Flexible</span>
            </div>
            <h3 className="text-2xl font-bold text-night mb-1">1-10</h3>
            <p className="text-sm text-night/70">Durées disponibles (années)</p>
          </div>

          <div className="bg-white border border-timberwolf/20 rounded-xl p-6">
            <div className="flex items-center justify-between mb-3">
              <BuildingLibraryIcon className="w-8 h-8 text-gold-metallic" />
              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">BRVM</span>
            </div>
            <h3 className="text-2xl font-bold text-night mb-1">150B</h3>
            <p className="text-sm text-night/70">Programme APE (FCFA)</p>
          </div>
        </div>
      </section>

      {/* Bond Calculator & Simulator */}
      <section className="mb-12">
        <h2 className="heading-2 text-2xl text-night mb-6 flex items-center">
          <CalculatorIcon className="w-6 h-6 text-gold-metallic mr-3" />
          Calculateur & Simulateur APE
        </h2>
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-2xl p-8 border border-timberwolf/20">
            <h3 className="text-xl font-semibold text-night mb-6">Calculateur Avancé</h3>
            
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-night/70 mb-2">Montant d'investissement</label>
                  <div className="relative">
                    <input
                      type="number"
                      value={bondCalculator.amount}
                      onChange={(e) => setBondCalculator({...bondCalculator, amount: parseInt(e.target.value) || 0})}
                      className="w-full border border-timberwolf rounded-lg px-4 py-3 pr-16 focus:ring-2 focus:ring-gold-metallic focus:border-transparent"
                      placeholder="1,000,000"
                      min="10000"
                      max="10000000"
                    />
                    <span className="absolute right-3 top-3 text-night/50">FCFA</span>
                  </div>
                  <p className="text-xs text-night/60 mt-1">Min: 10,000 FCFA • Max: 10,000,000 FCFA</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-night/70 mb-2">Durée d'investissement</label>
                  <select
                    value={bondCalculator.term}
                    onChange={(e) => setBondCalculator({...bondCalculator, term: parseInt(e.target.value)})}
                    className="w-full border border-timberwolf rounded-lg px-4 py-3 focus:ring-2 focus:ring-gold-metallic focus:border-transparent"
                  >
                    <option value={12}>1 an (12 mois)</option>
                    <option value={36}>3 ans (36 mois)</option>
                    <option value={60}>5 ans (60 mois)</option>
                    <option value={84}>7 ans (84 mois)</option>
                    <option value={120}>10 ans (120 mois)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-night/70 mb-2">Taux d'intérêt annuel</label>
                  <div className="relative">
                    <input
                      type="number"
                      value={bondCalculator.interestRate}
                      onChange={(e) => setBondCalculator({...bondCalculator, interestRate: parseFloat(e.target.value) || 0})}
                      className="w-full border border-timberwolf rounded-lg px-4 py-3 pr-12 focus:ring-2 focus:ring-gold-metallic focus:border-transparent"
                      step="0.1"
                      min="5"
                      max="12"
                    />
                    <span className="absolute right-3 top-3 text-night/50">%</span>
                  </div>
                  <p className="text-xs text-night/60 mt-1">Taux actuel: 8.0% (variable selon les conditions de marché)</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-gradient-to-br from-gold-metallic/10 to-gold-metallic/5 rounded-lg p-6">
                  <h4 className="font-semibold text-night mb-4">Résultats de votre investissement</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-night/70">Capital investi:</span>
                      <span className="font-semibold text-night">{bondCalculator.amount.toLocaleString()} FCFA</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-night/70">Intérêts gagnés:</span>
                      <span className="font-semibold text-gold-metallic">+{Math.round(totalReturn).toLocaleString()} FCFA</span>
                    </div>
                    <div className="border-t border-gold-metallic/20 pt-3">
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-night">Total à maturité:</span>
                        <span className="text-xl font-bold text-night">{Math.round(maturityAmount).toLocaleString()} FCFA</span>
                      </div>
                    </div>
                    <div className="bg-white/50 rounded px-3 py-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-night/70">Rendement annuel:</span>
                        <span className="text-sm font-semibold text-night">{annualReturn.toFixed(2)}%</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-night/5 rounded-lg p-4">
                  <h5 className="font-medium text-night mb-2">Comparaison avec l'épargne traditionnelle</h5>
                  <div className="text-sm space-y-1">
                    <div className="flex justify-between">
                      <span className="text-night/70">Livret d'épargne (2%):</span>
                      <span className="text-night">{(bondCalculator.amount * Math.pow(1.02, bondCalculator.term/12)).toLocaleString()} FCFA</span>
                    </div>
                    <div className="flex justify-between font-semibold text-green-700">
                      <span>Gain supplémentaire APE:</span>
                      <span>+{(maturityAmount - bondCalculator.amount * Math.pow(1.02, bondCalculator.term/12)).toLocaleString()} FCFA</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <button className="flex-1 bg-gold-metallic text-night py-3 rounded-lg font-semibold hover:bg-gold-metallic/90 transition-colors">
                Simuler un autre scénario
              </button>
              <button className="flex-1 bg-night text-white py-3 rounded-lg font-semibold hover:bg-night/90 transition-colors">
                Commencer l'investissement
              </button>
            </div>
          </div>

          <div className="space-y-6">
            {/* Investment Strategy Planner */}
            <div className="bg-white rounded-xl p-6 border border-timberwolf/20">
              <h4 className="font-semibold text-night mb-4">Planificateur de Stratégie</h4>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-night/70 mb-2">Investissement mensuel</label>
                  <div className="relative">
                    <input
                      type="number"
                      value={investmentPlanner.monthlyInvestment}
                      onChange={(e) => setInvestmentPlanner({...investmentPlanner, monthlyInvestment: parseInt(e.target.value) || 0})}
                      className="w-full border border-timberwolf rounded-lg px-3 py-2 pr-12 text-sm"
                      placeholder="100,000"
                    />
                    <span className="absolute right-3 top-2 text-night/50 text-sm">FCFA</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-night/70 mb-2">Objectif financier</label>
                  <div className="relative">
                    <input
                      type="number"
                      value={investmentPlanner.targetAmount}
                      onChange={(e) => setInvestmentPlanner({...investmentPlanner, targetAmount: parseInt(e.target.value) || 0})}
                      className="w-full border border-timberwolf rounded-lg px-3 py-2 pr-12 text-sm"
                      placeholder="5,000,000"
                    />
                    <span className="absolute right-3 top-2 text-night/50 text-sm">FCFA</span>
                  </div>
                </div>

                <div className="bg-gold-metallic/10 rounded-lg p-3">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-night/70">Temps pour atteindre l'objectif:</span>
                  </div>
                  <p className="text-lg font-bold text-night">{Math.floor(timeToTarget/12)} ans {timeToTarget%12} mois</p>
                </div>

                <button className="w-full bg-gold-metallic text-night py-2 rounded-lg font-medium text-sm hover:bg-gold-metallic/90 transition-colors">
                  Créer mon plan
                </button>
              </div>
            </div>

            {/* Market Analysis */}
            <div className="bg-white rounded-xl p-6 border border-timberwolf/20">
              <h4 className="font-semibold text-night mb-4 flex items-center">
                <ChartBarIcon className="w-5 h-5 text-gold-metallic mr-2" />
                Analyse de Marché
              </h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-timberwolf/20">
                  <span className="text-sm text-night/70">Taux APE actuel:</span>
                  <span className="font-semibold text-green-600">8.0% ↗</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-timberwolf/20">
                  <span className="text-sm text-night/70">Inflation (2023):</span>
                  <span className="font-semibold text-night">3.7%</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-timberwolf/20">
                  <span className="text-sm text-night/70">Rendement réel:</span>
                  <span className="font-semibold text-gold-metallic">+4.3%</span>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-lg p-3 mt-3">
                  <p className="text-xs text-green-800">
                    <InformationCircleIcon className="w-4 h-4 inline mr-1" />
                    Conditions favorables pour investir dans l'APE
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Government Bond Education */}
      <section className="mb-12">
        <h2 className="heading-2 text-2xl text-night mb-6 flex items-center">
          <DocumentTextIcon className="w-6 h-6 text-gold-metallic mr-3" />
          Guide d'Investissement APE
        </h2>
        <div className="grid lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="bg-white rounded-xl p-6 border border-timberwolf/20">
              <h3 className="text-lg font-semibold text-night mb-4">Qu'est-ce que l'APE ?</h3>
              <div className="space-y-4 text-sm text-night/70">
                <p>
                  L'Appel Public à l'Épargne (APE) est un instrument financier émis par l'État du Sénégal 
                  pour financer ses projets de développement. En investissant dans l'APE, vous prêtez 
                  de l'argent à l'État qui s'engage à vous rembourser avec des intérêts.
                </p>
                <div className="bg-gold-metallic/10 rounded-lg p-4">
                  <h4 className="font-medium text-night mb-2">Avantages clés:</h4>
                  <ul className="space-y-1">
                    <li>• Garantie de l'État du Sénégal</li>
                    <li>• Rendement fixe et prévisible</li>
                    <li>• Cotation à la BRVM pour la liquidité</li>
                    <li>• Contribution au développement national</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 border border-timberwolf/20">
              <h3 className="text-lg font-semibold text-night mb-4">Processus d'Investissement</h3>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-gold-metallic text-night rounded-full flex items-center justify-center text-xs font-bold">1</div>
                  <div>
                    <h4 className="font-medium text-night">Préparation des documents</h4>
                    <p className="text-sm text-night/70">Carte d'identité, justificatif de revenus, RIB</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-gold-metallic text-night rounded-full flex items-center justify-center text-xs font-bold">2</div>
                  <div>
                    <h4 className="font-medium text-night">Ouverture de compte</h4>
                    <p className="text-sm text-night/70">Compte-titres chez un intermédiaire agréé</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-gold-metallic text-night rounded-full flex items-center justify-center text-xs font-bold">3</div>
                  <div>
                    <h4 className="font-medium text-night">Souscription</h4>
                    <p className="text-sm text-night/70">Passez votre ordre d'achat APE</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-gold-metallic text-night rounded-full flex items-center justify-center text-xs font-bold">4</div>
                  <div>
                    <h4 className="font-medium text-night">Suivi</h4>
                    <p className="text-sm text-night/70">Recevez vos intérêts et suivez votre investissement</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-xl p-6 border border-timberwolf/20">
              <h3 className="text-lg font-semibold text-night mb-4">Documents Requis</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-5 h-5 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                    <span className="text-xs">✓</span>
                  </div>
                  <span className="text-sm text-night/70">Carte d'identité nationale ou passeport</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-5 h-5 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                    <span className="text-xs">✓</span>
                  </div>
                  <span className="text-sm text-night/70">Justificatif de domicile récent</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-5 h-5 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                    <span className="text-xs">✓</span>
                  </div>
                  <span className="text-sm text-night/70">Justificatif de revenus (3 derniers bulletins)</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-5 h-5 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                    <span className="text-xs">✓</span>
                  </div>
                  <span className="text-sm text-night/70">RIB ou coordonnées bancaires</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-5 h-5 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center">
                    <span className="text-xs">!</span>
                  </div>
                  <span className="text-sm text-night/70">Numéro d'identification fiscale (NINEA)</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 border border-timberwolf/20">
              <h3 className="text-lg font-semibold text-night mb-4">Évaluation des Risques</h3>
              <div className="space-y-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h4 className="font-medium text-green-800 mb-2">Risque Faible</h4>
                  <p className="text-sm text-green-700">
                    L'APE est garanti par l'État du Sénégal, ce qui en fait un investissement 
                    à très faible risque avec un rendement fixe.
                  </p>
                </div>
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-medium text-blue-800 mb-2">Liquidité</h4>
                  <p className="text-sm text-blue-700">
                    Possibilité de revendre sur le marché secondaire (BRVM) avant l'échéance, 
                    sous réserve des conditions de marché.
                  </p>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h4 className="font-medium text-yellow-800 mb-2">Considérations</h4>
                  <p className="text-sm text-yellow-700">
                    Investissement à moyen/long terme. Pénalités possibles en cas de retrait anticipé.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Investment Tracking */}
      <section>
        <h2 className="heading-2 text-2xl text-night mb-6">Suivi de mes Investissements APE</h2>
        <div className="bg-white rounded-2xl p-8 border border-timberwolf/20">
          <div className="text-center py-12">
            <BuildingLibraryIcon className="w-16 h-16 text-night/30 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-night mb-2">Aucun investissement APE actif</h3>
            <p className="text-night/70 mb-6 max-w-md mx-auto">
              Commencez votre parcours d'investissement dans l'APE du Sénégal. 
              Utilisez nos calculateurs pour planifier votre stratégie.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-gold-metallic text-night px-8 py-3 rounded-lg font-semibold hover:bg-gold-metallic/90 transition-colors">
                Commencer un investissement
              </button>
              <button className="border border-timberwolf text-night px-8 py-3 rounded-lg font-semibold hover:bg-timberwolf/20 transition-colors">
                Planifier ma stratégie
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
