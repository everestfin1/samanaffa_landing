'use client';

import { useState, useEffect } from 'react';
import {
  BuildingLibraryIcon,
  CalculatorIcon,
  BookmarkIcon,
  DocumentCheckIcon,
  AcademicCapIcon,
  ClockIcon,
  ChartBarIcon,
  BanknotesIcon,
  CheckCircleIcon,
  PlusIcon,
  ArrowRightIcon,
  StarIcon,
  CalendarDaysIcon,
  ShieldCheckIcon,
  ArrowTrendingUpIcon,
  DocumentTextIcon,
  PlayIcon,
  HeartIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  CurrencyDollarIcon,
  ScaleIcon,
  LightBulbIcon,
  PhoneIcon,
  EnvelopeIcon,
  UserIcon,
  EyeIcon,
  TrashIcon,
  ShareIcon,
  BookOpenIcon
} from '@heroicons/react/24/outline';

interface BondCalculation {
  id: string;
  name: string;
  amount: number;
  term: 3 | 5 | 7 | 10;
  interestRate: number;
  semiAnnualPayment: number;
  maturityValue: number;
  totalInterest: number;
  createdAt: string;
  favorite: boolean;
}

interface InvestmentScenario {
  id: string;
  name: string;
  calculations: BondCalculation[];
  notes: string;
  createdAt: string;
}

interface WishlistItem {
  id: string;
  tranche: 'A' | 'B' | 'C' | 'D';
  amount: number;
  term: number;
  targetDate: string;
  reminders: boolean;
  priority: 'high' | 'medium' | 'low';
  notes: string;
}

interface KYCRequirement {
  id: string;
  title: string;
  description: string;
  required: boolean;
  completed: boolean;
  documentType: string;
  status: 'pending' | 'uploaded' | 'verified' | 'rejected';
}

interface EducationModule {
  id: string;
  title: string;
  category: 'basics' | 'advanced' | 'strategy';
  description: string;
  duration: number;
  progress: number;
  completed: boolean;
  content: string[];
}

export default function APEPortal() {
  const [activeSection, setActiveSection] = useState<'overview' | 'calculator' | 'scenarios' | 'readiness' | 'wishlist' | 'education' | 'status'>('overview');
  
  // Calculator state (moved from renderCalculator to fix Hooks order)
  const [amount, setAmount] = useState<string>('1000000');
  const [term, setTerm] = useState<3 | 5 | 7 | 10>(10);
  const [calculationName, setCalculationName] = useState<string>('');
  const [showResults, setShowResults] = useState(false);
  const [currentCalculation, setCurrentCalculation] = useState<BondCalculation | null>(null);
  const [savedCalculations, setSavedCalculations] = useState<BondCalculation[]>([
    {
      id: '1',
      name: 'Investissement principal',
      amount: 1000000,
      term: 10,
      interestRate: 6.95,
      semiAnnualPayment: 34750,
      maturityValue: 1695000,
      totalInterest: 695000,
      createdAt: '2025-09-15',
      favorite: true
    },
    {
      id: '2',
      name: 'Complément retraite',
      amount: 500000,
      term: 7,
      interestRate: 6.75,
      semiAnnualPayment: 16875,
      maturityValue: 736250,
      totalInterest: 236250,
      createdAt: '2025-09-10',
      favorite: false
    }
  ]);

  const [scenarios, setScenarios] = useState<InvestmentScenario[]>([
    {
      id: '1',
      name: 'Stratégie équilibrée',
      calculations: savedCalculations,
      notes: 'Répartition entre court et long terme pour optimiser les rendements',
      createdAt: '2025-09-15'
    }
  ]);

  const [wishlist, setWishlist] = useState<WishlistItem[]>([
    {
      id: '1',
      tranche: 'D',
      amount: 2000000,
      term: 10,
      targetDate: '2025-10-15',
      reminders: true,
      priority: 'high',
      notes: 'Investissement pour la retraite'
    },
    {
      id: '2',
      tranche: 'B',
      amount: 750000,
      term: 5,
      targetDate: '2025-11-01',
      reminders: true,
      priority: 'medium',
      notes: 'Diversification du portefeuille'
    }
  ]);

  const [kycRequirements] = useState<KYCRequirement[]>([
    {
      id: '1',
      title: 'Pièce d\'identité',
      description: 'CNI ou passeport valide',
      required: true,
      completed: true,
      documentType: 'identity',
      status: 'verified'
    },
    {
      id: '2',
      title: 'Justificatif de revenus',
      description: 'Bulletins de salaire ou attestation',
      required: true,
      completed: true,
      documentType: 'income',
      status: 'verified'
    },
    {
      id: '3',
      title: 'Justificatif de domicile',
      description: 'Facture récente ou attestation',
      required: true,
      completed: false,
      documentType: 'address',
      status: 'pending'
    },
    {
      id: '4',
      title: 'Ouverture compte SGI',
      description: 'Compte auprès d\'une SGI partenaire',
      required: true,
      completed: false,
      documentType: 'account',
      status: 'pending'
    }
  ]);

  const [educationModules] = useState<EducationModule[]>([
    {
      id: '1',
      title: 'Introduction aux obligations d\'État',
      category: 'basics',
      description: 'Comprendre les bases des obligations souveraines',
      duration: 25,
      progress: 100,
      completed: true,
      content: ['Qu\'est-ce qu\'une obligation', 'Rendement et risques', 'Fiscalité']
    },
    {
      id: '2',
      title: 'Stratégies d\'investissement APE',
      category: 'strategy',
      description: 'Optimiser votre portefeuille d\'obligations',
      duration: 40,
      progress: 60,
      completed: false,
      content: ['Laddering', 'Diversification', 'Timing', 'Réinvestissement']
    },
    {
      id: '3',
      title: 'Analyse des tranches APE 2025',
      category: 'advanced',
      description: 'Comparaison détaillée des 4 tranches',
      duration: 30,
      progress: 0,
      completed: false,
      content: ['Tranche A vs B vs C vs D', 'Profils de risque', 'Recommandations']
    }
  ]);

  // Bond calculation logic
  const calculateBond = (amount: number, term: 3 | 5 | 7 | 10) => {
    const rates = { 3: 6.40, 5: 6.60, 7: 6.75, 10: 6.95 };
    const interestRate = rates[term];
    const semiAnnualRate = interestRate / 2 / 100;
    const periods = term * 2;
    const semiAnnualPayment = amount * semiAnnualRate;
    const totalInterest = semiAnnualPayment * periods;
    const maturityValue = amount + totalInterest;

    return {
      interestRate,
      semiAnnualPayment,
      maturityValue,
      totalInterest
    };
  };

  const renderOverview = () => (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-gold-light/20 to-gold-metallic/10 rounded-2xl p-8 border border-gold-metallic/20">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-night mb-2">APE Sénégal Portal</h2>
            <p className="text-night/70 text-lg">Gérez vos investissements dans les obligations d'État du Sénégal</p>
          </div>
          <div className="hidden md:block">
            <div className="bg-gold-metallic/10 p-4 rounded-full">
              <BuildingLibraryIcon className="w-12 h-12 text-gold-metallic" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl border border-timberwolf/20 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-night/60">Portefeuille APE</p>
              <p className="text-2xl font-bold text-night">1 500 000 FCFA</p>
            </div>
            <BanknotesIcon className="w-8 h-8 text-gold-metallic" />
          </div>
          <div className="text-sm text-gold-dark">2 investissements actifs</div>
        </div>

        <div className="bg-white rounded-xl border border-timberwolf/20 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-night/60">Rendement moyen</p>
              <p className="text-2xl font-bold text-night">6.85%</p>
            </div>
            <ArrowTrendingUpIcon className="w-8 h-8 text-night" />
          </div>
          <div className="text-sm text-night/70">Excellent rendement</div>
        </div>

        <div className="bg-white rounded-xl border border-timberwolf/20 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-night/60">Prochains intérêts</p>
              <p className="text-2xl font-bold text-night">51 625 FCFA</p>
            </div>
            <CalendarDaysIcon className="w-8 h-8 text-gold-dark" />
          </div>
          <div className="text-sm text-gold-dark">Dans 45 jours</div>
        </div>

        <div className="bg-white rounded-xl border border-timberwolf/20 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-night/60">Scénarios sauvés</p>
              <p className="text-2xl font-bold text-night">{scenarios.length}</p>
            </div>
            <BookmarkIcon className="w-8 h-8 text-night" />
          </div>
          <div className="text-sm text-night/70">Stratégies planifiées</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-3 gap-6">
        <button 
          onClick={() => setActiveSection('calculator')}
          className="bg-white rounded-2xl border border-timberwolf/20 p-6 hover:shadow-lg transition-shadow text-left hover:border-gold-metallic/30"
        >
          <div className="flex items-center space-x-4">
            <div className="bg-gold-metallic/10 p-3 rounded-xl">
              <CalculatorIcon className="w-6 h-6 text-gold-metallic" />
            </div>
            <div>
              <h3 className="font-semibold text-night">Calculateur avancé</h3>
              <p className="text-sm text-night/60">Simulez vos investissements</p>
            </div>
          </div>
        </button>

        <button 
          onClick={() => setActiveSection('scenarios')}
          className="bg-white rounded-2xl border border-timberwolf/20 p-6 hover:shadow-lg transition-shadow text-left hover:border-gold-metallic/30"
        >
          <div className="flex items-center space-x-4">
            <div className="bg-gold-dark/10 p-3 rounded-xl">
              <ChartBarIcon className="w-6 h-6 text-gold-dark" />
            </div>
            <div>
              <h3 className="font-semibold text-night">Comparer les scénarios</h3>
              <p className="text-sm text-night/60">Analysez vos stratégies</p>
            </div>
          </div>
        </button>

        <button 
          onClick={() => setActiveSection('wishlist')}
          className="bg-white rounded-2xl border border-timberwolf/20 p-6 hover:shadow-lg transition-shadow text-left hover:border-gold-metallic/30"
        >
          <div className="flex items-center space-x-4">
            <div className="bg-night/10 p-3 rounded-xl">
              <HeartIcon className="w-6 h-6 text-night" />
            </div>
            <div>
              <h3 className="font-semibold text-night">Liste de souhaits</h3>
              <p className="text-sm text-night/60">Planifiez vos investissements</p>
            </div>
          </div>
        </button>
      </div>

      {/* Current Investments */}
      <div className="bg-white rounded-2xl border border-timberwolf/20 p-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-night">Vos investissements actuels</h3>
          <button className="text-gold-metallic hover:text-blue-700 font-medium">
            Voir tout
          </button>
        </div>
        <div className="space-y-4">
          {savedCalculations.slice(0, 2).map((calc) => (
            <div key={calc.id} className="border border-timberwolf/20 rounded-lg p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h4 className="font-semibold text-night mb-1">{calc.name}</h4>
                  <div className="flex items-center space-x-4 text-sm text-night/60">
                    <span>Tranche {calc.term === 3 ? 'A' : calc.term === 5 ? 'B' : calc.term === 7 ? 'C' : 'D'}</span>
                    <span>{calc.term} ans</span>
                    <span>{calc.interestRate}%</span>
                  </div>
                </div>
                {calc.favorite && (
                  <StarIcon className="w-6 h-6 text-yellow-500 fill-current" />
                )}
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-night/60">Montant investi</span>
                  <div className="font-bold text-night">{calc.amount.toLocaleString()} FCFA</div>
                </div>
                <div>
                  <span className="text-night/60">Paiement semestriel</span>
                  <div className="font-bold text-gold-metallic">{calc.semiAnnualPayment.toLocaleString()} FCFA</div>
                </div>
                <div>
                  <span className="text-night/60">Intérêts totaux</span>
                  <div className="font-bold text-gold-dark">{calc.totalInterest.toLocaleString()} FCFA</div>
                </div>
                <div>
                  <span className="text-night/60">Valeur à maturité</span>
                  <div className="font-bold text-night">{calc.maturityValue.toLocaleString()} FCFA</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Investment Readiness Status */}
      <div className="bg-white rounded-2xl border border-timberwolf/20 p-8">
        <h3 className="text-xl font-bold text-night mb-6">Statut de préparation à l'investissement</h3>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <span className="text-2xl font-bold text-green-600">75%</span>
            </div>
            <div>
              <h4 className="font-semibold text-night">Presque prêt !</h4>
              <p className="text-night/70">3/4 étapes complétées</p>
            </div>
          </div>
          <button 
            onClick={() => setActiveSection('readiness')}
            className="bg-gold-metallic text-night px-6 py-3 rounded-lg font-semibold hover:bg-gold-dark transition-colors"
          >
            Compléter
          </button>
        </div>
      </div>
    </div>
  );

  const handleCalculate = () => {
    const numAmount = parseInt(amount);
    if (numAmount >= 10000) {
      const result = calculateBond(numAmount, term);
      setCurrentCalculation({
        amount: numAmount,
        term,
        ...result,
        id: Date.now().toString(),
        name: calculationName,
        createdAt: new Date().toISOString().split('T')[0],
        favorite: false
      });
      setShowResults(true);
    }
  };

  const handleSaveCalculation = () => {
    if (currentCalculation && calculationName) {
      const newCalculation: BondCalculation = {
        id: Date.now().toString(),
        name: calculationName,
        amount: currentCalculation.amount,
        term: currentCalculation.term,
        interestRate: currentCalculation.interestRate,
        semiAnnualPayment: currentCalculation.semiAnnualPayment,
        maturityValue: currentCalculation.maturityValue,
        totalInterest: currentCalculation.totalInterest,
        createdAt: new Date().toISOString().split('T')[0],
        favorite: false
      };
      setSavedCalculations([...savedCalculations, newCalculation]);
      setCalculationName('');
      alert('Calcul sauvegardé avec succès !');
    }
  };

  const renderCalculator = () => {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold text-night">Calculateur avancé APE</h2>
          <div className="flex items-center space-x-2 bg-gold-metallic/10 text-gold-dark px-4 py-2 rounded-lg">
            <ShieldCheckIcon className="w-5 h-5" />
            <span className="font-medium">Garantie État</span>
          </div>
        </div>

        {/* Calculator Form */}
        <div className="bg-white rounded-2xl border border-timberwolf/20 p-8">
          <h3 className="text-xl font-bold text-night mb-6">Simulez votre investissement</h3>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-night mb-2">
                  Montant d'investissement (FCFA)
                </label>
                <input 
                  type="number" 
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  min="10000"
                  step="10000"
                  className="w-full px-4 py-3 border border-timberwolf/30 rounded-lg focus:ring-2 focus:ring-gold-metallic focus:border-transparent text-lg"
                  placeholder="Minimum 10,000 FCFA"
                />
                <p className="text-sm text-night/60 mt-1">Minimum: 10,000 FCFA</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-night mb-3">
                  Durée d'investissement
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { value: 3, label: '3 ans', rate: '6.40%', tranche: 'A' },
                    { value: 5, label: '5 ans', rate: '6.60%', tranche: 'B' },
                    { value: 7, label: '7 ans', rate: '6.75%', tranche: 'C' },
                    { value: 10, label: '10 ans', rate: '6.95%', tranche: 'D' }
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setTerm(option.value as 3 | 5 | 7 | 10)}
                      className={`p-4 border-2 rounded-lg transition-all ${
                        term === option.value
                          ? 'border-gold-metallic bg-gold-light/30 text-gold-dark'
                          : 'border-timberwolf/30 hover:border-gold-metallic/40'
                      }`}
                    >
                      <div className="font-semibold">Tranche {option.tranche}</div>
                      <div className="text-sm">{option.label}</div>
                      <div className="text-sm font-bold text-gold-metallic">{option.rate}</div>
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handleCalculate}
                disabled={!amount || parseInt(amount) < 10000}
                className="w-full bg-gold-metallic text-night py-3 px-6 rounded-lg font-semibold hover:bg-gold-dark transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Calculer les rendements
              </button>
            </div>

            {/* Tax Information */}
            <div className="bg-gold-light/20 rounded-lg p-6 border border-gold-metallic/20">
              <div className="flex items-start space-x-3">
                <InformationCircleIcon className="w-6 h-6 text-gold-dark flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold text-night mb-2">Information fiscale</h4>
                  <div className="text-sm text-night/70 space-y-2">
                    <p>• Les intérêts sont soumis à l'impôt selon votre statut fiscal</p>
                    <p>• Résidents du Sénégal: Retenue à la source applicable</p>
                    <p>• Non-résidents: Fiscalité selon conventions</p>
                    <p>• Consultez votre conseiller fiscal pour plus de détails</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Calculation Results */}
        {showResults && currentCalculation && (
          <div className="bg-white rounded-2xl border border-timberwolf/20 p-8">
            <h3 className="text-xl font-bold text-night mb-6">Résultats de votre simulation</h3>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gold-light/20 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-gold-metallic">
                      {currentCalculation.semiAnnualPayment.toLocaleString()} FCFA
                    </div>
                    <div className="text-sm text-night/60">Paiement semestriel</div>
                  </div>
                  <div className="bg-gold-dark/10 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-gold-dark">
                      {currentCalculation.totalInterest.toLocaleString()} FCFA
                    </div>
                    <div className="text-sm text-night/60">Intérêts totaux</div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-gold-dark to-gold-metallic rounded-lg p-6 text-night text-center">
                  <div className="text-3xl font-bold mb-2">
                    {currentCalculation.maturityValue.toLocaleString()} FCFA
                  </div>
                  <div className="text-night/70">Valeur totale à maturité</div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-night mb-2">
                    Nom de ce calcul (optionnel)
                  </label>
                  <input 
                    type="text" 
                    value={calculationName}
                    onChange={(e) => setCalculationName(e.target.value)}
                    className="w-full px-4 py-3 border border-timberwolf/30 rounded-lg focus:ring-2 focus:ring-gold-metallic focus:border-transparent"
                    placeholder="Ex: Investissement retraite"
                  />
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={handleSaveCalculation}
                    disabled={!calculationName}
                    className="flex-1 bg-gold-metallic text-night py-3 px-4 rounded-lg font-semibold hover:bg-gold-dark transition-colors disabled:bg-gray-300"
                  >
                    Sauvegarder
                  </button>
                  <button className="flex-1 border border-gold-metallic text-gold-metallic py-3 px-4 rounded-lg font-semibold hover:bg-blue-50 transition-colors">
                    Partager
                  </button>
                </div>
              </div>

              {/* Payment Schedule Preview */}
              <div className="bg-timberwolf/5 rounded-lg p-6">
                <h4 className="font-semibold text-night mb-4">Calendrier des paiements (aperçu)</h4>
                <div className="space-y-3 max-h-60 overflow-y-auto">
                  {Array.from({ length: Math.min(6, currentCalculation.term * 2) }, (_, i) => {
                    const date = new Date();
                    date.setMonth(date.getMonth() + (i + 1) * 6);
                    return (
                      <div key={i} className="flex justify-between items-center p-3 bg-white rounded border">
                        <span className="text-sm text-night/70">
                          {date.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
                        </span>
                        <span className="font-semibold text-green-600">
                          {currentCalculation.semiAnnualPayment.toLocaleString()} FCFA
                        </span>
                      </div>
                    );
                  })}
                  {currentCalculation.term * 2 > 6 && (
                    <div className="text-center text-sm text-night/60 py-2">
                      ... et {(currentCalculation.term * 2) - 6} paiements supplémentaires
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Saved Calculations */}
        <div className="bg-white rounded-2xl border border-timberwolf/20 p-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-night">Calculs sauvegardés</h3>
            <span className="text-sm text-night/60">{savedCalculations.length} calculs</span>
          </div>
          
          <div className="space-y-4">
            {savedCalculations.map((calc) => (
              <div key={calc.id} className="border border-timberwolf/20 rounded-lg p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="font-semibold text-night">{calc.name}</h4>
                      {calc.favorite && <StarIcon className="w-5 h-5 text-yellow-500 fill-current" />}
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-night/60">
                      <span>Tranche {calc.term === 3 ? 'A' : calc.term === 5 ? 'B' : calc.term === 7 ? 'C' : 'D'}</span>
                      <span>{calc.term} ans</span>
                      <span>{calc.interestRate}%</span>
                      <span>Créé le {new Date(calc.createdAt).toLocaleDateString('fr-FR')}</span>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button className="p-2 text-night/60 hover:text-gold-metallic transition-colors">
                      <EyeIcon className="w-5 h-5" />
                    </button>
                    <button className="p-2 text-night/60 hover:text-green-600 transition-colors">
                      <ShareIcon className="w-5 h-5" />
                    </button>
                    <button className="p-2 text-night/60 hover:text-red-600 transition-colors">
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-night/60">Montant</span>
                    <div className="font-bold text-night">{calc.amount.toLocaleString()} FCFA</div>
                  </div>
                  <div>
                    <span className="text-night/60">Semestriel</span>
                    <div className="font-bold text-gold-metallic">{calc.semiAnnualPayment.toLocaleString()} FCFA</div>
                  </div>
                  <div>
                    <span className="text-night/60">Intérêts totaux</span>
                    <div className="font-bold text-gold-dark">{calc.totalInterest.toLocaleString()} FCFA</div>
                  </div>
                  <div>
                    <span className="text-night/60">À maturité</span>
                    <div className="font-bold text-night">{calc.maturityValue.toLocaleString()} FCFA</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderScenarios = () => (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-night">Scénarios d'investissement</h2>
        <button className="bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors flex items-center space-x-2">
          <PlusIcon className="w-5 h-5" />
          <span>Nouveau scénario</span>
        </button>
      </div>

      {/* Scenario Comparison Tool */}
      <div className="bg-white rounded-2xl border border-timberwolf/20 p-8">
        <h3 className="text-xl font-bold text-night mb-6">Comparaison de scénarios</h3>
        
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Scenario 1 */}
          <div className="border border-purple-200 rounded-lg p-6 bg-purple-50">
            <h4 className="font-bold text-night mb-4">Scénario Conservateur</h4>
            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span className="text-night/70">Tranche A (3 ans):</span>
                <span className="font-semibold">800,000 FCFA</span>
              </div>
              <div className="flex justify-between">
                <span className="text-night/70">Tranche B (5 ans):</span>
                <span className="font-semibold">500,000 FCFA</span>
              </div>
              <div className="flex justify-between border-t pt-2">
                <span className="text-night/70">Total investi:</span>
                <span className="font-bold text-night">1,300,000 FCFA</span>
              </div>
              <div className="flex justify-between">
                <span className="text-night/70">Rendement moyen:</span>
                <span className="font-bold text-green-600">6.48%</span>
              </div>
            </div>
            <button className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-purple-700 transition-colors">
              Analyser
            </button>
          </div>

          {/* Scenario 2 */}
          <div className="border border-blue-200 rounded-lg p-6 bg-blue-50">
            <h4 className="font-bold text-night mb-4">Scénario Équilibré</h4>
            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span className="text-night/70">Tranche B (5 ans):</span>
                <span className="font-semibold">600,000 FCFA</span>
              </div>
              <div className="flex justify-between">
                <span className="text-night/70">Tranche C (7 ans):</span>
                <span className="font-semibold">700,000 FCFA</span>
              </div>
              <div className="flex justify-between border-t pt-2">
                <span className="text-night/70">Total investi:</span>
                <span className="font-bold text-night">1,300,000 FCFA</span>
              </div>
              <div className="flex justify-between">
                <span className="text-night/70">Rendement moyen:</span>
                <span className="font-bold text-green-600">6.68%</span>
              </div>
            </div>
            <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors">
              Analyser
            </button>
          </div>

          {/* Scenario 3 */}
          <div className="border border-green-200 rounded-lg p-6 bg-green-50">
            <h4 className="font-bold text-night mb-4">Scénario Agressif</h4>
            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span className="text-night/70">Tranche C (7 ans):</span>
                <span className="font-semibold">500,000 FCFA</span>
              </div>
              <div className="flex justify-between">
                <span className="text-night/70">Tranche D (10 ans):</span>
                <span className="font-semibold">800,000 FCFA</span>
              </div>
              <div className="flex justify-between border-t pt-2">
                <span className="text-night/70">Total investi:</span>
                <span className="font-bold text-night">1,300,000 FCFA</span>
              </div>
              <div className="flex justify-between">
                <span className="text-night/70">Rendement moyen:</span>
                <span className="font-bold text-green-600">6.88%</span>
              </div>
            </div>
            <button className="w-full bg-gold-metallic text-white py-2 px-4 rounded-lg font-medium hover:bg-gold-dark transition-colors">
              Analyser
            </button>
          </div>
        </div>
      </div>

      {/* Saved Scenarios */}
      <div className="space-y-6">
        {scenarios.map((scenario) => (
          <div key={scenario.id} className="bg-white rounded-2xl border border-timberwolf/20 p-8">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold text-night mb-2">{scenario.name}</h3>
                <p className="text-night/70">{scenario.notes}</p>
                <div className="text-sm text-night/60 mt-2">
                  Créé le {new Date(scenario.createdAt).toLocaleDateString('fr-FR')} • {scenario.calculations.length} calculs
                </div>
              </div>
              <div className="flex space-x-2">
                <button className="p-2 text-night/60 hover:text-gold-metallic transition-colors">
                  <EyeIcon className="w-5 h-5" />
                </button>
                <button className="p-2 text-night/60 hover:text-green-600 transition-colors">
                  <ShareIcon className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {scenario.calculations.map((calc) => (
                <div key={calc.id} className="border border-timberwolf/20 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-night">{calc.name}</h4>
                    <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      Tranche {calc.term === 3 ? 'A' : calc.term === 5 ? 'B' : calc.term === 7 ? 'C' : 'D'}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-night/60">Montant</span>
                      <div className="font-semibold">{calc.amount.toLocaleString()} FCFA</div>
                    </div>
                    <div>
                      <span className="text-night/60">Rendement</span>
                      <div className="font-semibold text-green-600">{calc.interestRate}%</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 flex space-x-3">
              <button className="flex-1 bg-purple-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-purple-700 transition-colors">
                Modifier le scénario
              </button>
              <button className="flex-1 border border-purple-600 text-purple-600 py-2 px-4 rounded-lg font-medium hover:bg-purple-50 transition-colors">
                Dupliquer
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Strategy Recommendations */}
      <div className="bg-white rounded-2xl border border-timberwolf/20 p-8">
        <h3 className="text-xl font-bold text-night mb-6">Recommandations stratégiques</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-start space-x-3 p-4 bg-blue-50 rounded-lg">
              <LightBulbIcon className="w-6 h-6 text-blue-500 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-night mb-1">Laddering Strategy</h4>
                <p className="text-sm text-night/70">
                  Répartissez vos investissements sur différentes échéances pour optimiser la liquidité et les rendements.
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3 p-4 bg-green-50 rounded-lg">
              <ScaleIcon className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-night mb-1">Diversification</h4>
                <p className="text-sm text-night/70">
                  Combinez APE avec d'autres produits d'épargne pour un portefeuille équilibré.
                </p>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-start space-x-3 p-4 bg-yellow-50 rounded-lg">
              <CalendarDaysIcon className="w-6 h-6 text-yellow-500 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-night mb-1">Timing optimal</h4>
                <p className="text-sm text-night/70">
                  Investissez tôt dans l'émission pour sécuriser votre allocation préférée.
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3 p-4 bg-purple-50 rounded-lg">
              <ArrowTrendingUpIcon className="w-6 h-6 text-purple-500 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-night mb-1">Réinvestissement</h4>
                <p className="text-sm text-night/70">
                  Réinvestissez vos intérêts semestriels pour maximiser l'effet de composition.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderReadiness = () => (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-night">Préparation à l'investissement</h2>
        <div className="flex items-center space-x-2">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
            <span className="text-lg font-bold text-green-600">75%</span>
          </div>
          <span className="text-night/60">Complété</span>
        </div>
      </div>

      {/* Eligibility Self-Check */}
      <div className="bg-white rounded-2xl border border-timberwolf/20 p-8">
        <h3 className="text-xl font-bold text-night mb-6">Auto-évaluation d'éligibilité</h3>
        
        <div className="space-y-4">
          {[
            { question: 'Êtes-vous citoyen sénégalais ou résident de la zone UEMOA ?', checked: true },
            { question: 'Avez-vous au moins 18 ans ?', checked: true },
            { question: 'Disposez-vous d\'un revenu régulier ou de fonds suffisants ?', checked: true },
            { question: 'Êtes-vous prêt à investir pour au moins 3 ans ?', checked: true },
            { question: 'Comprenez-vous les risques liés aux investissements ?', checked: false }
          ].map((item, index) => (
            <div key={index} className="flex items-start space-x-3 p-4 border border-timberwolf/20 rounded-lg">
              <input 
                type="checkbox" 
                checked={item.checked}
                className="w-5 h-5 text-gold-metallic border-timberwolf/30 rounded mt-0.5"
                readOnly
              />
              <span className="text-night flex-1">{item.question}</span>
              {item.checked ? (
                <CheckCircleIcon className="w-6 h-6 text-green-500" />
              ) : (
                <ExclamationTriangleIcon className="w-6 h-6 text-yellow-500" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Documentation Checklist */}
      <div className="bg-white rounded-2xl border border-timberwolf/20 p-8">
        <h3 className="text-xl font-bold text-night mb-6">Liste des documents requis</h3>
        
        <div className="space-y-4">
          {kycRequirements.map((req) => (
            <div key={req.id} className="flex items-center space-x-4 p-6 border border-timberwolf/20 rounded-lg">
              <div className="flex-shrink-0">
                {req.status === 'verified' ? (
                  <CheckCircleIcon className="w-8 h-8 text-green-500" />
                ) : req.status === 'uploaded' ? (
                  <ClockIcon className="w-8 h-8 text-yellow-500" />
                ) : req.status === 'rejected' ? (
                  <ExclamationTriangleIcon className="w-8 h-8 text-red-500" />
                ) : (
                  <DocumentCheckIcon className="w-8 h-8 text-gray-400" />
                )}
              </div>
              
              <div className="flex-1">
                <h4 className="font-semibold text-night mb-1">{req.title}</h4>
                <p className="text-sm text-night/70 mb-2">{req.description}</p>
                <div className="flex items-center space-x-2">
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    req.status === 'verified' ? 'bg-green-100 text-green-800' :
                    req.status === 'uploaded' ? 'bg-yellow-100 text-yellow-800' :
                    req.status === 'rejected' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {req.status === 'verified' ? 'Vérifié' :
                     req.status === 'uploaded' ? 'En cours' :
                     req.status === 'rejected' ? 'Rejeté' :
                     'En attente'}
                  </span>
                  {req.required && (
                    <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">
                      Obligatoire
                    </span>
                  )}
                </div>
              </div>
              
              <div className="flex-shrink-0">
                {req.status === 'pending' ? (
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                    Télécharger
                  </button>
                ) : req.status === 'rejected' ? (
                  <button className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors">
                    Corriger
                  </button>
                ) : (
                  <button className="border border-timberwolf/30 text-night px-4 py-2 rounded-lg text-sm font-medium hover:bg-timberwolf/10 transition-colors">
                    Voir
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Status Timeline */}
      <div className="bg-white rounded-2xl border border-timberwolf/20 p-8">
        <h3 className="text-xl font-bold text-night mb-6">Chronologie du processus</h3>
        
        <div className="space-y-6">
          {[
            { step: 'Inscription initiale', status: 'completed', date: '15 Sept 2025', description: 'Compte créé avec succès' },
            { step: 'Vérification KYC', status: 'completed', date: '16 Sept 2025', description: 'Documents d\'identité vérifiés' },
            { step: 'Documents complémentaires', status: 'current', date: '', description: 'Justificatif de domicile en attente' },
            { step: 'Ouverture compte SGI', status: 'pending', date: '', description: 'En attente de finalisation KYC' },
            { step: 'Prêt à investir', status: 'pending', date: '', description: 'Toutes les étapes complétées' }
          ].map((item, index) => (
            <div key={index} className="flex items-start space-x-4">
              <div className="flex-shrink-0 mt-1">
                <div className={`w-4 h-4 rounded-full ${
                  item.status === 'completed' ? 'bg-green-500' :
                  item.status === 'current' ? 'bg-blue-500' :
                  'bg-gray-300'
                }`}></div>
                {index < 4 && (
                  <div className={`w-0.5 h-12 ml-1.5 mt-2 ${
                    item.status === 'completed' ? 'bg-green-500' :
                    item.status === 'current' ? 'bg-blue-500' :
                    'bg-gray-300'
                  }`}></div>
                )}
              </div>
              <div className="flex-1 pb-6">
                <div className="flex items-center justify-between mb-1">
                  <h4 className={`font-semibold ${
                    item.status === 'completed' ? 'text-green-700' :
                    item.status === 'current' ? 'text-blue-700' :
                    'text-gray-500'
                  }`}>
                    {item.step}
                  </h4>
                  {item.date && (
                    <span className="text-sm text-night/60">{item.date}</span>
                  )}
                </div>
                <p className="text-sm text-night/70">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Next Steps */}
      <div className="bg-blue-50 rounded-2xl border border-blue-200 p-8">
        <h3 className="text-xl font-bold text-night mb-6">Prochaines étapes</h3>
        <div className="space-y-4">
          <div className="flex items-start space-x-3">
            <div className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">1</div>
            <div>
              <h4 className="font-semibold text-night">Télécharger le justificatif de domicile</h4>
              <p className="text-sm text-night/70">Facture récente ou attestation de domicile</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">2</div>
            <div>
              <h4 className="font-semibold text-night">Choisir une SGI partenaire</h4>
              <p className="text-sm text-night/70">Ouvrir un compte auprès d'une société de gestion</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">3</div>
            <div>
              <h4 className="font-semibold text-night">Finaliser l'investissement</h4>
              <p className="text-sm text-night/70">Confirmer vos choix et procéder au paiement</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderWishlist = () => (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-night">Liste de souhaits d'investissement</h2>
        <button className="bg-gold-metallic text-white px-6 py-3 rounded-lg font-semibold hover:bg-gold-dark transition-colors flex items-center space-x-2">
          <HeartIcon className="w-5 h-5" />
          <span>Ajouter un souhait</span>
        </button>
      </div>

      {/* Wishlist Items */}
      <div className="space-y-6">
        {wishlist.map((item) => (
          <div key={item.id} className="bg-white rounded-2xl border border-timberwolf/20 p-8">
            <div className="flex items-start justify-between mb-6">
              <div>
                <div className="flex items-center space-x-3 mb-2">
                  <h3 className="text-xl font-bold text-night">Tranche {item.tranche}</h3>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    item.priority === 'high' ? 'bg-red-100 text-red-800' :
                    item.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {item.priority === 'high' ? 'Priorité haute' :
                     item.priority === 'medium' ? 'Priorité moyenne' :
                     'Priorité basse'}
                  </span>
                </div>
                <p className="text-night/70">{item.notes}</p>
              </div>
              <div className="flex items-center space-x-2">
                {item.reminders && (
                  <div className="flex items-center space-x-1 text-gold-metallic">
                    <CalendarDaysIcon className="w-5 h-5" />
                    <span className="text-sm">Rappels actifs</span>
                  </div>
                )}
              </div>
            </div>

            <div className="grid md:grid-cols-4 gap-6 mb-6">
              <div>
                <span className="text-sm text-night/60">Montant souhaité</span>
                <div className="text-lg font-bold text-night">{item.amount.toLocaleString()} FCFA</div>
              </div>
              <div>
                <span className="text-sm text-night/60">Durée</span>
                <div className="text-lg font-bold text-night">{item.term} ans</div>
              </div>
              <div>
                <span className="text-sm text-night/60">Date cible</span>
                <div className="text-lg font-bold text-night">
                  {new Date(item.targetDate).toLocaleDateString('fr-FR')}
                </div>
              </div>
              <div>
                <span className="text-sm text-night/60">Rendement estimé</span>
                <div className="text-lg font-bold text-green-600">
                  {item.tranche === 'A' ? '6.40%' :
                   item.tranche === 'B' ? '6.60%' :
                   item.tranche === 'C' ? '6.75%' :
                   '6.95%'}
                </div>
              </div>
            </div>

            <div className="flex space-x-3">
              <button className="flex-1 bg-gold-metallic text-white py-3 px-4 rounded-lg font-semibold hover:bg-gold-dark transition-colors">
                Investir maintenant
              </button>
              <button className="flex-1 border border-green-600 text-green-600 py-3 px-4 rounded-lg font-semibold hover:bg-green-50 transition-colors">
                Modifier
              </button>
              <button className="px-4 py-3 text-night/60 hover:text-red-600 transition-colors">
                <TrashIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add New Wishlist Item */}
      <div className="bg-white rounded-2xl border border-timberwolf/20 p-8">
        <h3 className="text-xl font-bold text-night mb-6">Ajouter un nouveau souhait</h3>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-night mb-2">Tranche préférée</label>
            <select className="w-full px-4 py-3 border border-timberwolf/30 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent">
              <option value="A">Tranche A - 3 ans (6.40%)</option>
              <option value="B">Tranche B - 5 ans (6.60%)</option>
              <option value="C">Tranche C - 7 ans (6.75%)</option>
              <option value="D">Tranche D - 10 ans (6.95%)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-night mb-2">Montant souhaité (FCFA)</label>
            <input 
              type="number" 
              placeholder="1000000"
              min="10000"
              className="w-full px-4 py-3 border border-timberwolf/30 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-night mb-2">Date cible d'investissement</label>
            <input 
              type="date" 
              className="w-full px-4 py-3 border border-timberwolf/30 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-night mb-2">Priorité</label>
            <select className="w-full px-4 py-3 border border-timberwolf/30 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent">
              <option value="high">Priorité haute</option>
              <option value="medium">Priorité moyenne</option>
              <option value="low">Priorité basse</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-night mb-2">Notes personnelles</label>
            <textarea 
              rows={3}
              placeholder="Objectif de cet investissement..."
              className="w-full px-4 py-3 border border-timberwolf/30 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            ></textarea>
          </div>
          <div className="md:col-span-2">
            <label className="flex items-center space-x-2">
              <input type="checkbox" className="w-4 h-4 text-green-600 border-timberwolf/30 rounded" />
              <span className="text-sm text-night">Activer les rappels pour cette date</span>
            </label>
          </div>
        </div>

        <button className="w-full bg-gold-metallic text-white py-3 px-6 rounded-lg font-semibold hover:bg-gold-dark transition-colors mt-6">
          Ajouter à ma liste de souhaits
        </button>
      </div>

      {/* Calendar Integration */}
      <div className="bg-blue-50 rounded-2xl border border-blue-200 p-8">
        <h3 className="text-xl font-bold text-night mb-6">Rappels et calendrier</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-night mb-3">Prochains rappels</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 p-3 bg-white rounded border">
                <CalendarDaysIcon className="w-5 h-5 text-blue-500" />
                <div>
                  <div className="font-medium text-night">Tranche D - 2M FCFA</div>
                  <div className="text-sm text-night/60">15 octobre 2025</div>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-white rounded border">
                <CalendarDaysIcon className="w-5 h-5 text-blue-500" />
                <div>
                  <div className="font-medium text-night">Tranche B - 750K FCFA</div>
                  <div className="text-sm text-night/60">1 novembre 2025</div>
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold text-night mb-3">Préférences de notification</h4>
            <div className="space-y-3">
              <label className="flex items-center space-x-3">
                <input type="checkbox" defaultChecked className="w-4 h-4 text-gold-metallic border-timberwolf/30 rounded" />
                <span className="text-sm text-night">Email 7 jours avant</span>
              </label>
              <label className="flex items-center space-x-3">
                <input type="checkbox" defaultChecked className="w-4 h-4 text-gold-metallic border-timberwolf/30 rounded" />
                <span className="text-sm text-night">SMS 3 jours avant</span>
              </label>
              <label className="flex items-center space-x-3">
                <input type="checkbox" className="w-4 h-4 text-gold-metallic border-timberwolf/30 rounded" />
                <span className="text-sm text-night">Notification push le jour J</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderEducation = () => (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-night">Centre d'éducation APE</h2>
        <div className="flex items-center space-x-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-lg">
          <AcademicCapIcon className="w-5 h-5" />
          <span className="font-medium">Niveau: Intermédiaire</span>
        </div>
      </div>

      {/* Progress Overview */}
      <div className="bg-white rounded-2xl border border-timberwolf/20 p-8">
        <h3 className="text-xl font-bold text-night mb-6">Votre progression</h3>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">1</div>
            <div className="text-sm text-night/60">Modules complétés</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-gold-metallic mb-2">1</div>
            <div className="text-sm text-night/60">En cours</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-yellow-600 mb-2">53%</div>
            <div className="text-sm text-night/60">Progression globale</div>
          </div>
        </div>
      </div>

      {/* Education Modules */}
      <div className="space-y-6">
        {educationModules.map((module) => (
          <div key={module.id} className="bg-white rounded-2xl border border-timberwolf/20 p-8">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h3 className="text-xl font-bold text-night">{module.title}</h3>
                  {module.completed && (
                    <CheckCircleIcon className="w-6 h-6 text-green-500" />
                  )}
                </div>
                <p className="text-night/70 mb-2">{module.description}</p>
                <div className="flex items-center space-x-4 text-sm text-night/60">
                  <span className="flex items-center space-x-1">
                    <ClockIcon className="w-4 h-4" />
                    <span>{module.duration} min</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <BookOpenIcon className="w-4 h-4" />
                    <span>{module.content.length} sections</span>
                  </span>
                  <span className={`px-2 py-1 rounded text-xs ${
                    module.category === 'basics' ? 'bg-green-100 text-green-800' :
                    module.category === 'advanced' ? 'bg-red-100 text-red-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {module.category === 'basics' ? 'Débutant' :
                     module.category === 'advanced' ? 'Avancé' :
                     'Stratégie'}
                  </span>
                </div>
              </div>
              <div className="text-right ml-4">
                <div className="text-2xl font-bold text-gold-metallic mb-1">{module.progress}%</div>
                <div className="text-sm text-night/60">Complété</div>
              </div>
            </div>

            <div className="w-full bg-timberwolf/20 rounded-full h-2 mb-4">
              <div 
                className="bg-gradient-to-r from-blue-400 to-blue-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${module.progress}%` }}
              ></div>
            </div>

            {/* Content Preview */}
            <div className="bg-timberwolf/5 rounded-lg p-4 mb-4">
              <h4 className="font-semibold text-night mb-2">Contenu du module:</h4>
              <ul className="text-sm text-night/70 space-y-1">
                {module.content.map((item, index) => (
                  <li key={index} className="flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex space-x-3">
              {module.completed ? (
                <button className="flex-1 bg-gold-metallic text-white py-2 px-4 rounded-lg font-medium hover:bg-gold-dark transition-colors flex items-center justify-center space-x-2">
                  <CheckCircleIcon className="w-5 h-5" />
                  <span>Terminé</span>
                </button>
              ) : module.progress > 0 ? (
                <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2">
                  <PlayIcon className="w-5 h-5" />
                  <span>Continuer</span>
                </button>
              ) : (
                <button className="flex-1 border border-gold-metallic text-gold-metallic py-2 px-4 rounded-lg font-medium hover:bg-blue-50 transition-colors flex items-center justify-center space-x-2">
                  <PlayIcon className="w-5 h-5" />
                  <span>Commencer</span>
                </button>
              )}
              <button className="flex-1 border border-timberwolf/30 text-night py-2 px-4 rounded-lg font-medium hover:bg-timberwolf/10 transition-colors">
                Aperçu
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* FAQ Section */}
      <div className="bg-white rounded-2xl border border-timberwolf/20 p-8">
        <h3 className="text-xl font-bold text-night mb-6">Questions fréquentes sur l'APE</h3>
        <div className="space-y-4">
          {[
            {
              question: "Quelle est la différence entre les tranches A, B, C et D ?",
              answer: "Les tranches diffèrent par leur durée et leur taux de rendement. La tranche A (3 ans) offre 6.40%, la B (5 ans) 6.60%, la C (7 ans) 6.75%, et la D (10 ans) 6.95%."
            },
            {
              question: "Comment sont versés les intérêts ?",
              answer: "Les intérêts sont versés semestriellement, soit tous les 6 mois, directement sur votre compte SGI."
            },
            {
              question: "Puis-je vendre mes obligations avant l'échéance ?",
              answer: "Oui, il existe un marché secondaire, mais les conditions de vente peuvent varier selon les conditions de marché."
            },
            {
              question: "Quel est le montant minimum d'investissement ?",
              answer: "Le montant minimum est de 10,000 FCFA par obligation, soit la valeur nominale d'une obligation."
            }
          ].map((faq, index) => (
            <div key={index} className="border border-timberwolf/20 rounded-lg">
              <div className="p-4 cursor-pointer hover:bg-timberwolf/5">
                <h4 className="font-semibold text-night mb-2">{faq.question}</h4>
                <p className="text-sm text-night/70">{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Additional Resources */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-timberwolf/20 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <DocumentTextIcon className="w-8 h-8 text-blue-500" />
            <h3 className="text-lg font-bold text-night">Documents officiels</h3>
          </div>
          <div className="space-y-3">
            <button className="w-full text-left p-3 border border-timberwolf/20 rounded-lg hover:bg-timberwolf/5 transition-colors">
              <div className="font-medium text-night">Prospectus APE 2025</div>
              <div className="text-sm text-night/60">Document officiel complet</div>
            </button>
            <button className="w-full text-left p-3 border border-timberwolf/20 rounded-lg hover:bg-timberwolf/5 transition-colors">
              <div className="font-medium text-night">Conditions générales</div>
              <div className="text-sm text-night/60">Termes et conditions</div>
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-timberwolf/20 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <PhoneIcon className="w-8 h-8 text-green-500" />
            <h3 className="text-lg font-bold text-night">Support expert</h3>
          </div>
          <div className="space-y-3">
            <div className="p-3 border border-timberwolf/20 rounded-lg">
              <div className="font-medium text-night">Hotline APE</div>
              <div className="text-sm text-night/60">+221 33 XXX XX XX</div>
            </div>
            <div className="p-3 border border-timberwolf/20 rounded-lg">
              <div className="font-medium text-night">Email support</div>
              <div className="text-sm text-night/60">ape@everestfinance.sn</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStatus = () => (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-night">Suivi du statut APE</h2>
        <div className="flex items-center space-x-2 bg-green-100 text-green-800 px-4 py-2 rounded-lg">
          <CheckCircleIcon className="w-5 h-5" />
          <span className="font-medium">Éligible</span>
        </div>
      </div>

      {/* Current Status */}
      <div className="bg-white rounded-2xl border border-timberwolf/20 p-8">
        <h3 className="text-xl font-bold text-night mb-6">Statut actuel</h3>
        
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="text-center bg-green-50 rounded-lg p-6">
            <CheckCircleIcon className="w-12 h-12 text-green-500 mx-auto mb-3" />
            <h4 className="font-semibold text-night mb-2">KYC Approuvé</h4>
            <p className="text-sm text-night/60">Vérification d'identité complète</p>
          </div>
          <div className="text-center bg-yellow-50 rounded-lg p-6">
            <ClockIcon className="w-12 h-12 text-yellow-500 mx-auto mb-3" />
            <h4 className="font-semibold text-night mb-2">Compte SGI en cours</h4>
            <p className="text-sm text-night/60">Ouverture en cours de traitement</p>
          </div>
          <div className="text-center bg-gray-50 rounded-lg p-6">
            <UserIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <h4 className="font-semibold text-night mb-2">Prêt à investir</h4>
            <p className="text-sm text-night/60">En attente de finalisation</p>
          </div>
        </div>

        <div className="bg-blue-50 rounded-lg p-6">
          <h4 className="font-semibold text-night mb-3">Actions requises</h4>
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-night">Finaliser l'ouverture du compte SGI</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-night">Confirmer vos choix d'investissement</span>
            </div>
          </div>
        </div>
      </div>

      {/* Investment History */}
      <div className="bg-white rounded-2xl border border-timberwolf/20 p-8">
        <h3 className="text-xl font-bold text-night mb-6">Historique d'activité</h3>
        
        <div className="space-y-4">
          {[
            {
              date: '2025-09-17',
              action: 'Calcul sauvegardé',
              details: 'Investissement principal - Tranche D (10 ans)',
              status: 'completed'
            },
            {
              date: '2025-09-16',
              action: 'Documents KYC vérifiés',
              details: 'Pièce d\'identité et justificatif de revenus approuvés',
              status: 'completed'
            },
            {
              date: '2025-09-15',
              action: 'Inscription au portail',
              details: 'Compte créé avec succès',
              status: 'completed'
            },
            {
              date: '2025-09-14',
              action: 'Première visite',
              details: 'Consultation des informations APE',
              status: 'completed'
            }
          ].map((item, index) => (
            <div key={index} className="flex items-start space-x-4 p-4 border border-timberwolf/20 rounded-lg">
              <div className="flex-shrink-0 mt-1">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-semibold text-night">{item.action}</h4>
                  <span className="text-sm text-night/60">
                    {new Date(item.date).toLocaleDateString('fr-FR')}
                  </span>
                </div>
                <p className="text-sm text-night/70">{item.details}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Notifications & Updates */}
      <div className="bg-white rounded-2xl border border-timberwolf/20 p-8">
        <h3 className="text-xl font-bold text-night mb-6">Notifications et mises à jour</h3>
        
        <div className="space-y-4">
          <div className="flex items-start space-x-4 p-4 bg-blue-50 rounded-lg">
            <InformationCircleIcon className="w-6 h-6 text-blue-500 flex-shrink-0 mt-1" />
            <div>
              <h4 className="font-semibold text-night mb-1">Nouvelle tranche disponible</h4>
              <p className="text-sm text-night/70">
                Une allocation supplémentaire de la Tranche D est maintenant disponible. 
                Investissez rapidement pour sécuriser votre place.
              </p>
              <div className="text-xs text-gold-metallic mt-2">Il y a 2 heures</div>
            </div>
          </div>

          <div className="flex items-start space-x-4 p-4 bg-green-50 rounded-lg">
            <CheckCircleIcon className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
            <div>
              <h4 className="font-semibold text-night mb-1">Documents approuvés</h4>
              <p className="text-sm text-night/70">
                Vos documents KYC ont été vérifiés et approuvés avec succès.
              </p>
              <div className="text-xs text-green-600 mt-2">Hier</div>
            </div>
          </div>

          <div className="flex items-start space-x-4 p-4 bg-yellow-50 rounded-lg">
            <CalendarDaysIcon className="w-6 h-6 text-yellow-500 flex-shrink-0 mt-1" />
            <div>
              <h4 className="font-semibold text-night mb-1">Rappel: Date limite approche</h4>
              <p className="text-sm text-night/70">
                La date limite pour la souscription de la première phase est le 30 septembre 2025.
              </p>
              <div className="text-xs text-yellow-600 mt-2">Il y a 3 jours</div>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-timberwolf/20 p-6">
          <h3 className="text-lg font-bold text-night mb-4">Besoin d'aide ?</h3>
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <PhoneIcon className="w-5 h-5 text-blue-500" />
              <div>
                <div className="font-medium text-night">Support téléphonique</div>
                <div className="text-sm text-night/60">+221 33 XXX XX XX</div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <EnvelopeIcon className="w-5 h-5 text-green-500" />
              <div>
                <div className="font-medium text-night">Email</div>
                <div className="text-sm text-night/60">support@everestfinance.sn</div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-timberwolf/20 p-6">
          <h3 className="text-lg font-bold text-night mb-4">Préférences de notification</h3>
          <div className="space-y-3">
            <label className="flex items-center space-x-3">
              <input type="checkbox" defaultChecked className="w-4 h-4 text-gold-metallic border-timberwolf/30 rounded" />
              <span className="text-sm text-night">Mises à jour par email</span>
            </label>
            <label className="flex items-center space-x-3">
              <input type="checkbox" defaultChecked className="w-4 h-4 text-gold-metallic border-timberwolf/30 rounded" />
              <span className="text-sm text-night">Alertes SMS importantes</span>
            </label>
            <label className="flex items-center space-x-3">
              <input type="checkbox" className="w-4 h-4 text-gold-metallic border-timberwolf/30 rounded" />
              <span className="text-sm text-night">Notifications marketing</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSectionContent = () => {
    switch (activeSection) {
      case 'calculator':
        return renderCalculator();
      case 'scenarios':
        return renderScenarios();
      case 'readiness':
        return renderReadiness();
      case 'wishlist':
        return renderWishlist();
      case 'education':
        return renderEducation();
      case 'status':
        return renderStatus();
      default:
        return renderOverview();
    }
  };

  return (
    <div className="space-y-8">
      {/* Navigation Tabs */}
      <div className="bg-white rounded-2xl border border-timberwolf/20 p-2">
        <div className="flex flex-wrap gap-2">
          {[
            { id: 'overview', label: 'Vue d\'ensemble', icon: ChartBarIcon },
            { id: 'calculator', label: 'Calculateur', icon: CalculatorIcon },
            { id: 'scenarios', label: 'Scénarios', icon: BookmarkIcon },
            { id: 'readiness', label: 'Préparation', icon: DocumentCheckIcon },
            { id: 'wishlist', label: 'Souhaits', icon: HeartIcon },
            { id: 'education', label: 'Éducation', icon: AcademicCapIcon },
            { id: 'status', label: 'Statut', icon: ClockIcon }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveSection(tab.id as 'overview' | 'calculator' | 'scenarios' | 'readiness' | 'wishlist' | 'education' | 'status')}
              className={`flex items-center space-x-2 px-4 py-3 rounded-xl font-medium transition-colors ${
                activeSection === tab.id
                  ? 'bg-gold-metallic text-night shadow-lg'
                  : 'text-night hover:bg-timberwolf/10'
              }`}
            >
              <tab.icon className="w-5 h-5" />
              <span className="hidden md:inline">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Section Content */}
      {renderSectionContent()}
    </div>
  );
}
