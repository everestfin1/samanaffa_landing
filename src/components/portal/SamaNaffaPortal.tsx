'use client';

import { useState, useEffect } from 'react';
import {
  BanknotesIcon,
  ChartBarIcon,
  TrophyIcon,
  UserGroupIcon,
  BookOpenIcon,
  HeartIcon,
  PlusIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  StarIcon,
  CalendarDaysIcon,
  CurrencyDollarIcon,
  AcademicCapIcon,
  FireIcon,
  UsersIcon,
  CalculatorIcon,
  LightBulbIcon,
  ClockIcon,
  ShieldCheckIcon,
  PlayIcon,
  DocumentTextIcon,
  ArrowTrendingUpIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  WalletIcon,
  CreditCardIcon
} from '@heroicons/react/24/outline';

interface SavingsGoal {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: string;
  monthlyContribution: number;
  category: string;
  progress: number;
  projectedCompletion: string;
  interestRate: number;
}

interface Challenge {
  id: string;
  title: string;
  type: '52-week' | 'weekly' | 'daily';
  description: string;
  currentWeek: number;
  totalWeeks: number;
  currentAmount: number;
  targetAmount: number;
  streak: number;
  badges: string[];
}

interface TontineCalculation {
  id: string;
  name: string;
  groupSize: number;
  contribution: number;
  frequency: 'weekly' | 'monthly';
  duration: number;
  totalPayout: number;
  yourPosition: number;
  riskLevel: 'low' | 'medium' | 'high';
}

interface EducationModule {
  id: string;
  title: string;
  category: string;
  description: string;
  duration: number;
  progress: number;
  completed: boolean;
  lessons: number;
}

interface FinancialHealthScore {
  overall: number;
  savingsRate: number;
  goalCoverage: number;
  diversification: number;
  consistency: number;
  recommendations: string[];
}

export default function SamaNaffaPortal() {
  const [activeSection, setActiveSection] = useState<'overview' | 'naffas' | 'education' | 'health' | 'tontine'>('overview');
  const [activeNaffaTab, setActiveNaffaTab] = useState<'goals' | 'challenges' | 'joint'>('goals');
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [transferType, setTransferType] = useState<'deposit' | 'withdraw'>('deposit');
  const [selectedAccount, setSelectedAccount] = useState<string>('');
  const [savingsGoals, setSavingsGoals] = useState<SavingsGoal[]>([
    {
      id: '1',
      title: 'Achat d\'une maison',
      targetAmount: 5000000,
      currentAmount: 1250000,
      targetDate: '2027-12-31',
      monthlyContribution: 75000,
      category: 'Immobilier',
      progress: 25,
      projectedCompletion: '2027-11-15',
      interestRate: 7.0
    },
    {
      id: '2',
      title: 'Éducation des enfants',
      targetAmount: 2000000,
      currentAmount: 450000,
      targetDate: '2029-09-01',
      monthlyContribution: 35000,
      category: 'Éducation',
      progress: 22.5,
      projectedCompletion: '2029-08-20',
      interestRate: 6.0
    }
  ]);

  const [challenges, setChallenges] = useState<Challenge[]>([
    {
      id: '1',
      title: 'Défi 52 semaines',
      type: '52-week',
      description: 'Économisez progressivement chaque semaine',
      currentWeek: 12,
      totalWeeks: 52,
      currentAmount: 78000,
      targetAmount: 1378000,
      streak: 12,
      badges: ['Débutant', '10 semaines']
    },
    {
      id: '2',
      title: 'Micro-épargne quotidienne',
      type: 'daily',
      description: '1000 FCFA par jour pendant 365 jours',
      currentWeek: 45,
      totalWeeks: 365,
      currentAmount: 45000,
      targetAmount: 365000,
      streak: 45,
      badges: ['Régulier', 'Micro-épargnant']
    }
  ]);

  const [educationModules] = useState<EducationModule[]>([
    {
      id: '1',
      title: 'Bases de l\'épargne',
      category: 'Fondamentaux',
      description: 'Comprendre les principes de base de l\'épargne',
      duration: 30,
      progress: 100,
      completed: true,
      lessons: 5
    },
    {
      id: '2',
      title: 'Stratégies d\'investissement',
      category: 'Avancé',
      description: 'Techniques pour optimiser vos investissements',
      duration: 45,
      progress: 60,
      completed: false,
      lessons: 8
    },
    {
      id: '3',
      title: 'Finance communautaire',
      category: 'Culture',
      description: 'Tontines et autres pratiques traditionnelles',
      duration: 25,
      progress: 0,
      completed: false,
      lessons: 4
    }
  ]);

  const [financialHealth] = useState<FinancialHealthScore>({
    overall: 78,
    savingsRate: 85,
    goalCoverage: 72,
    diversification: 65,
    consistency: 90,
    recommendations: [
      'Augmentez votre taux d\'épargne de 2% pour atteindre vos objectifs plus rapidement',
      'Diversifiez vos investissements avec des produits complémentaires',
      'Créez un fonds d\'urgence équivalent à 6 mois de dépenses'
    ]
  });

  const renderOverview = () => (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-gold-light/20 to-gold-metallic/10 rounded-2xl p-8 border border-gold-metallic/20">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-night mb-2">Sama Naffa Portal</h2>
            <p className="text-night/70 text-lg">Gérez votre épargne intelligente et atteignez vos objectifs financiers</p>
          </div>
          <div className="hidden md:block">
            <div className="bg-gold-metallic/10 p-4 rounded-full">
              <BanknotesIcon className="w-12 h-12 text-gold-metallic" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl border border-timberwolf/20 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-night/60">Épargne totale</p>
              <p className="text-2xl font-bold text-night">1 700 000 FCFA</p>
            </div>
            <BanknotesIcon className="w-8 h-8 text-gold-metallic" />
          </div>
          <div className="text-sm text-gold-dark">+15% ce mois</div>
        </div>

        <div className="bg-white rounded-xl border border-timberwolf/20 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-night/60">Objectifs actifs</p>
              <p className="text-2xl font-bold text-night">{savingsGoals.length}</p>
            </div>
            <ChartBarIcon className="w-8 h-8 text-gold-dark" />
          </div>
          <div className="text-sm text-gold-dark">23.7% de progression moyenne</div>
        </div>

        <div className="bg-white rounded-xl border border-timberwolf/20 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-night/60">Défis en cours</p>
              <p className="text-2xl font-bold text-night">{challenges.length}</p>
            </div>
            <TrophyIcon className="w-8 h-8 text-gold-metallic" />
          </div>
          <div className="text-sm text-gold-dark">12 semaines de suite</div>
        </div>

        <div className="bg-white rounded-xl border border-timberwolf/20 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-night/60">Score santé financière</p>
              <p className="text-2xl font-bold text-night">{financialHealth.overall}/100</p>
            </div>
            <HeartIcon className="w-8 h-8 text-night" />
          </div>
          <div className="text-sm text-night/70">Excellent</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-3 gap-6">
        <button 
          onClick={() => {setActiveSection('naffas'); setActiveNaffaTab('goals');}}
          className="bg-white rounded-2xl border border-timberwolf/20 p-6 hover:shadow-lg transition-shadow text-left hover:border-gold-metallic/30"
        >
          <div className="flex items-center space-x-4">
            <div className="bg-gold-metallic/10 p-3 rounded-xl">
              <PlusIcon className="w-6 h-6 text-gold-metallic" />
            </div>
            <div>
              <h3 className="font-semibold text-night">Créer un objectif</h3>
              <p className="text-sm text-night/60">Planifiez votre prochain projet</p>
            </div>
          </div>
        </button>

        <button 
          onClick={() => {setActiveSection('naffas'); setActiveNaffaTab('challenges');}}
          className="bg-white rounded-2xl border border-timberwolf/20 p-6 hover:shadow-lg transition-shadow text-left hover:border-gold-metallic/30"
        >
          <div className="flex items-center space-x-4">
            <div className="bg-gold-dark/10 p-3 rounded-xl">
              <TrophyIcon className="w-6 h-6 text-gold-dark" />
            </div>
            <div>
              <h3 className="font-semibold text-night">Rejoindre un défi</h3>
              <p className="text-sm text-night/60">Défis d'épargne ludiques</p>
            </div>
          </div>
        </button>

        <button 
          onClick={() => setActiveSection('tontine')}
          className="bg-white rounded-2xl border border-timberwolf/20 p-6 hover:shadow-lg transition-shadow text-left hover:border-gold-metallic/30"
        >
          <div className="flex items-center space-x-4">
            <div className="bg-night/10 p-3 rounded-xl">
              <UserGroupIcon className="w-6 h-6 text-night" />
            </div>
            <div>
              <h3 className="font-semibold text-night">Calculateur tontine</h3>
              <p className="text-sm text-night/60">Simulez votre participation</p>
            </div>
          </div>
        </button>
      </div>

      {/* Recent Goals Progress */}
      <div className="bg-white rounded-2xl border border-timberwolf/20 p-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-night">Progression de vos objectifs</h3>
          <button 
            onClick={() => {setActiveSection('naffas'); setActiveNaffaTab('goals');}}
            className="text-gold-metallic hover:text-green-700 font-medium"
          >
            Voir tout
          </button>
        </div>
        <div className="space-y-4">
          {savingsGoals.slice(0, 2).map((goal) => (
            <div key={goal.id} className="border border-timberwolf/20 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-night">{goal.title}</h4>
                <span className="text-sm text-night/60">{goal.progress}%</span>
              </div>
              <div className="w-full bg-timberwolf/20 rounded-full h-2 mb-2">
                <div 
                  className="bg-gold-metallic h-2 rounded-full transition-all duration-300"
                  style={{ width: `${goal.progress}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-sm text-night/60">
                <span>{goal.currentAmount.toLocaleString()} FCFA</span>
                <span>{goal.targetAmount.toLocaleString()} FCFA</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderTransferModal = () => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-night">
            {transferType === 'deposit' ? 'Effectuer un dépôt' : 'Effectuer un retrait'}
          </h3>
          <button 
            onClick={() => setShowTransferModal(false)}
            className="text-night/60 hover:text-night"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-night mb-2">Montant (FCFA)</label>
            <input 
              type="number" 
              placeholder="50000"
              className="w-full px-4 py-3 border border-timberwolf/30 rounded-lg focus:ring-2 focus:ring-gold-metallic focus:border-transparent"
            />
          </div>
          
          {transferType === 'withdraw' && (
            <div>
              <label className="block text-sm font-medium text-night mb-2">Méthode de retrait</label>
              <select className="w-full px-4 py-3 border border-timberwolf/30 rounded-lg focus:ring-2 focus:ring-gold-metallic focus:border-transparent">
                <option>Orange Money</option>
                <option>Wave</option>
                <option>Virement bancaire</option>
                <option>Retrait en agence</option>
              </select>
            </div>
          )}
          
          {transferType === 'deposit' && (
            <div>
              <label className="block text-sm font-medium text-night mb-2">Méthode de dépôt</label>
              <select className="w-full px-4 py-3 border border-timberwolf/30 rounded-lg focus:ring-2 focus:ring-gold-metallic focus:border-transparent">
                <option>Orange Money</option>
                <option>Wave</option>
                <option>Virement bancaire</option>
                <option>Espèces en agence</option>
                <option>Carte bancaire</option>
              </select>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-night mb-2">Note (optionnel)</label>
            <textarea 
              placeholder="Motif de la transaction..."
              rows={3}
              className="w-full px-4 py-3 border border-timberwolf/30 rounded-lg focus:ring-2 focus:ring-gold-metallic focus:border-transparent"
            />
          </div>
        </div>

        <div className="flex space-x-3 mt-6">
          <button 
            onClick={() => setShowTransferModal(false)}
            className="flex-1 border border-timberwolf/30 text-night py-3 px-4 rounded-lg font-medium hover:bg-timberwolf/10 transition-colors"
          >
            Annuler
          </button>
          <button 
            onClick={() => {
              setShowTransferModal(false);
              // Here you would handle the actual transaction
            }}
            className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors text-white ${
              transferType === 'deposit' 
                ? 'bg-gold-metallic hover:bg-gold-dark' 
                : 'bg-red-600 hover:bg-red-700'
            }`}
          >
            {transferType === 'deposit' ? 'Déposer' : 'Retirer'}
          </button>
        </div>
      </div>
    </div>
  );

  const renderMesNaffas = () => (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-night">Mes Naffas</h2>
        {/* TODO: Add a button to add a new Naffa */}
      </div>

      {/* Sub Navigation */}
      <div className="bg-white rounded-xl border border-timberwolf/20 p-2">
        <div className="flex space-x-2">
          {[
            { id: 'goals', label: 'Objectifs d\'épargne', icon: BanknotesIcon },
            { id: 'challenges', label: 'Défis d\'épargne', icon: TrophyIcon },
            { id: 'joint', label: 'Comptes joints', icon: UsersIcon }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveNaffaTab(tab.id as 'goals' | 'challenges' | 'joint')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                activeNaffaTab === tab.id
                  ? 'bg-gold-metallic text-white shadow-lg'
                  : 'text-night hover:bg-timberwolf/10'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span className="hidden md:inline">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content based on active tab */}
      {activeNaffaTab === 'goals' && renderGoalsManager()}
      {activeNaffaTab === 'challenges' && renderChallenges()}
      {activeNaffaTab === 'joint' && renderJointAccounts()}
    </div>
  );

  const renderGoalsManager = () => (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-night">Gestionnaire d'objectifs d'épargne</h2>
        <button className="bg-gold-metallic text-white px-6 py-3 rounded-lg font-semibold hover:bg-gold-dark transition-colors flex items-center space-x-2">
          <PlusIcon className="w-5 h-5" />
          <span>Nouvel objectif</span>
        </button>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {savingsGoals.map((goal) => (
          <div key={goal.id} className="bg-white rounded-2xl border border-timberwolf/20 p-8 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold text-night mb-2">{goal.title}</h3>
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                  {goal.category}
                </span>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-gold-metallic">{goal.progress}%</div>
                <div className="text-sm text-night/60">Complété</div>
              </div>
            </div>

            <div className="space-y-4 mb-6">
              <div className="w-full bg-timberwolf/20 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-green-400 to-green-600 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${goal.progress}%` }}
                ></div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-night/60">Montant actuel</span>
                  <div className="font-bold text-night">{goal.currentAmount.toLocaleString()} FCFA</div>
                </div>
                <div>
                  <span className="text-night/60">Objectif</span>
                  <div className="font-bold text-night">{goal.targetAmount.toLocaleString()} FCFA</div>
                </div>
                <div>
                  <span className="text-night/60">Mensualité</span>
                  <div className="font-bold text-night">{goal.monthlyContribution.toLocaleString()} FCFA</div>
                </div>
                <div>
                  <span className="text-night/60">Taux d'intérêt</span>
                  <div className="font-bold text-gold-metallic">{goal.interestRate}%</div>
                </div>
              </div>
            </div>

            <div className="bg-timberwolf/5 rounded-lg p-4 mb-4">
              <div className="flex items-center space-x-2 mb-2">
                <CalendarDaysIcon className="w-5 h-5 text-blue-500" />
                <span className="font-medium text-night">Projection</span>
              </div>
              <p className="text-sm text-night/70">
                À ce rythme, vous atteindrez votre objectif le <strong>{goal.projectedCompletion}</strong>
              </p>
            </div>

            <div className="flex space-x-2">
              <button 
                onClick={() => {setTransferType('deposit'); setSelectedAccount(goal.id); setShowTransferModal(true);}}
                className="flex-1 bg-gold-metallic text-white py-2 px-3 rounded-lg font-medium hover:bg-gold-dark transition-colors flex items-center justify-center space-x-1 text-sm"
              >
                <ArrowDownIcon className="w-4 h-4" />
                <span>Déposer</span>
              </button>
              <button 
                onClick={() => {setTransferType('withdraw'); setSelectedAccount(goal.id); setShowTransferModal(true);}}
                className="flex-1 bg-red-600 text-white py-2 px-3 rounded-lg font-medium hover:bg-red-700 transition-colors flex items-center justify-center space-x-1 text-sm"
              >
                <ArrowUpIcon className="w-4 h-4" />
                <span>Retirer</span>
              </button>
              <button className="flex-1 border border-gold-metallic text-gold-metallic py-2 px-3 rounded-lg font-medium hover:bg-green-50 transition-colors text-sm">
                Détails
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Goal Creation Form */}
      <div className="bg-white rounded-2xl border border-timberwolf/20 p-8">
        <h3 className="text-xl font-bold text-night mb-6">Créer un nouvel objectif</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-night mb-2">Titre de l'objectif</label>
            <input 
              type="text" 
              placeholder="Ex: Achat d'une voiture"
              className="w-full px-4 py-3 border border-timberwolf/30 rounded-lg focus:ring-2 focus:ring-gold-metallic focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-night mb-2">Catégorie</label>
            <select className="w-full px-4 py-3 border border-timberwolf/30 rounded-lg focus:ring-2 focus:ring-gold-metallic focus:border-transparent">
              <option>Immobilier</option>
              <option>Éducation</option>
              <option>Transport</option>
              <option>Voyage</option>
              <option>Urgence</option>
              <option>Retraite</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-night mb-2">Montant cible (FCFA)</label>
            <input 
              type="number" 
              placeholder="1000000"
              className="w-full px-4 py-3 border border-timberwolf/30 rounded-lg focus:ring-2 focus:ring-gold-metallic focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-night mb-2">Date cible</label>
            <input 
              type="date" 
              className="w-full px-4 py-3 border border-timberwolf/30 rounded-lg focus:ring-2 focus:ring-gold-metallic focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-night mb-2">Contribution mensuelle (FCFA)</label>
            <input 
              type="number" 
              placeholder="50000"
              className="w-full px-4 py-3 border border-timberwolf/30 rounded-lg focus:ring-2 focus:ring-gold-metallic focus:border-transparent"
            />
          </div>
          <div className="flex items-end">
            <button className="w-full bg-gold-metallic text-white py-3 px-6 rounded-lg font-semibold hover:bg-gold-dark transition-colors">
              Créer l'objectif
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderChallenges = () => (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-night">Défis d'épargne</h2>
        <button className="bg-gold-metallic text-white px-6 py-3 rounded-lg font-semibold hover:bg-gold-dark transition-colors flex items-center space-x-2">
          <TrophyIcon className="w-5 h-5" />
          <span>Nouveau défi</span>
        </button>
      </div>

      {/* Active Challenges */}
      <div className="space-y-6">
        {challenges.map((challenge) => (
          <div key={challenge.id} className="bg-white rounded-2xl border border-timberwolf/20 p-8">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold text-night mb-2">{challenge.title}</h3>
                <p className="text-night/70">{challenge.description}</p>
              </div>
              <div className="flex items-center space-x-2">
                <FireIcon className="w-6 h-6 text-orange-500" />
                <span className="font-bold text-orange-500">{challenge.streak}</span>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-gold-dark">
                  {challenge.type === 'daily' ? challenge.currentWeek : `${challenge.currentWeek}/${challenge.totalWeeks}`}
                </div>
                <div className="text-sm text-night/60">
                  {challenge.type === 'daily' ? 'Jours' : 'Semaines'}
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gold-metallic">
                  {challenge.currentAmount.toLocaleString()} FCFA
                </div>
                <div className="text-sm text-night/60">Épargné</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gold-dark">
                  {challenge.targetAmount.toLocaleString()} FCFA
                </div>
                <div className="text-sm text-night/60">Objectif</div>
              </div>
            </div>

            <div className="w-full bg-timberwolf/20 rounded-full h-3 mb-4">
              <div 
                className="bg-gradient-to-r from-yellow-400 to-yellow-600 h-3 rounded-full transition-all duration-500"
                style={{ width: `${(challenge.currentAmount / challenge.targetAmount) * 100}%` }}
              ></div>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              {challenge.badges.map((badge, index) => (
                <span key={index} className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
                  <StarIcon className="w-4 h-4 inline mr-1" />
                  {badge}
                </span>
              ))}
            </div>

            <div className="flex space-x-2">
              <button 
                onClick={() => {setTransferType('deposit'); setSelectedAccount(challenge.id); setShowTransferModal(true);}}
                className="flex-1 bg-gold-metallic text-white py-2 px-3 rounded-lg font-medium hover:bg-gold-dark transition-colors flex items-center justify-center space-x-1 text-sm"
              >
                <ArrowDownIcon className="w-4 h-4" />
                <span>Déposer</span>
              </button>
              <button className="flex-1 border border-yellow-600 text-gold-dark py-2 px-3 rounded-lg font-medium hover:bg-yellow-50 transition-colors text-sm">
                Continuer
              </button>
              <button className="flex-1 border border-timberwolf/30 text-night py-2 px-3 rounded-lg font-medium hover:bg-timberwolf/10 transition-colors text-sm">
                Détails
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Available Challenges */}
      <div className="bg-white rounded-2xl border border-timberwolf/20 p-8">
        <h3 className="text-xl font-bold text-night mb-6">Défis disponibles</h3>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="border border-timberwolf/20 rounded-lg p-6 hover:shadow-lg transition-shadow">
            <div className="bg-purple-100 p-3 rounded-xl w-fit mb-4">
              <CalendarDaysIcon className="w-6 h-6 text-purple-600" />
            </div>
            <h4 className="font-bold text-night mb-2">Défi mensuel</h4>
            <p className="text-sm text-night/70 mb-4">Épargnez un montant fixe chaque mois</p>
            <button className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-purple-700 transition-colors">
              Commencer
            </button>
          </div>

          <div className="border border-timberwolf/20 rounded-lg p-6 hover:shadow-lg transition-shadow">
            <div className="bg-pink-100 p-3 rounded-xl w-fit mb-4">
              <CurrencyDollarIcon className="w-6 h-6 text-pink-600" />
            </div>
            <h4 className="font-bold text-night mb-2">Challenge 365 jours</h4>
            <p className="text-sm text-night/70 mb-4">1 FCFA le jour 1, 2 FCFA le jour 2...</p>
            <button className="w-full bg-pink-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-pink-700 transition-colors">
              Commencer
            </button>
          </div>

          <div className="border border-timberwolf/20 rounded-lg p-6 hover:shadow-lg transition-shadow">
            <div className="bg-indigo-100 p-3 rounded-xl w-fit mb-4">
              <UserGroupIcon className="w-6 h-6 text-indigo-600" />
            </div>
            <h4 className="font-bold text-night mb-2">Défi en groupe</h4>
            <p className="text-sm text-night/70 mb-4">Épargnez avec vos amis et famille</p>
            <button className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-indigo-700 transition-colors">
              Commencer
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTontineCalculator = () => (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-night">Calculateur de Tontine</h2>
        <button className="bg-gold-dark text-white px-6 py-3 rounded-lg font-semibold hover:bg-night transition-colors flex items-center space-x-2">
          <CalculatorIcon className="w-5 h-5" />
          <span>Nouvelle simulation</span>
        </button>
      </div>

      {/* Tontine Calculator Form */}
      <div className="bg-white rounded-2xl border border-timberwolf/20 p-8">
        <h3 className="text-xl font-bold text-night mb-6">Simuler une tontine</h3>
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-night mb-2">Nombre de participants</label>
            <select className="w-full px-4 py-3 border border-timberwolf/30 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <option value="12">12 personnes</option>
              <option value="24">24 personnes</option>
              <option value="36">36 personnes</option>
              <option value="52">52 personnes</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-night mb-2">Contribution par personne (FCFA)</label>
            <input 
              type="number" 
              placeholder="25000"
              className="w-full px-4 py-3 border border-timberwolf/30 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-night mb-2">Fréquence</label>
            <select className="w-full px-4 py-3 border border-timberwolf/30 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <option value="weekly">Hebdomadaire</option>
              <option value="monthly">Mensuelle</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-night mb-2">Durée (cycles)</label>
            <input 
              type="number" 
              placeholder="12"
              className="w-full px-4 py-3 border border-timberwolf/30 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
        <button className="w-full bg-gold-dark text-white py-3 px-6 rounded-lg font-semibold hover:bg-night transition-colors">
          Calculer la tontine
        </button>
      </div>

      {/* Sample Tontine Results */}
      <div className="bg-white rounded-2xl border border-timberwolf/20 p-8">
        <h3 className="text-xl font-bold text-night mb-6">Exemple: Tontine de 12 personnes</h3>
        
        <div className="grid md:grid-cols-3 gap-6 mb-6">
          <div className="text-center bg-blue-50 rounded-lg p-4">
            <div className="text-2xl font-bold text-gold-dark">300 000 FCFA</div>
            <div className="text-sm text-night/60">Payout par tour</div>
          </div>
          <div className="text-center bg-green-50 rounded-lg p-4">
            <div className="text-2xl font-bold text-gold-metallic">25 000 FCFA</div>
            <div className="text-sm text-night/60">Contribution mensuelle</div>
          </div>
          <div className="text-center bg-yellow-50 rounded-lg p-4">
            <div className="text-2xl font-bold text-gold-dark">12 mois</div>
            <div className="text-sm text-night/60">Durée totale</div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-timberwolf/5 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <ShieldCheckIcon className="w-5 h-5 text-green-500" />
              <span className="font-medium text-night">Avantages</span>
            </div>
            <ul className="text-sm text-night/70 space-y-1">
              <li>• Accès rapide à une somme importante</li>
              <li>• Discipline d'épargne collective</li>
              <li>• Pas d'intérêts à payer</li>
            </ul>
          </div>
          
          <div className="bg-orange-50 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <LightBulbIcon className="w-5 h-5 text-orange-500" />
              <span className="font-medium text-night">Points d'attention</span>
            </div>
            <ul className="text-sm text-night/70 space-y-1">
              <li>• Risque de défaillance d'un participant</li>
              <li>• Ordre de tirage important</li>
              <li>• Engagement sur toute la durée</li>
            </ul>
          </div>
        </div>

        <div className="mt-6 flex space-x-3">
          <button className="flex-1 bg-gold-dark text-white py-2 px-4 rounded-lg font-medium hover:bg-night transition-colors">
            Rejoindre une tontine
          </button>
          <button className="flex-1 border border-blue-600 text-gold-dark py-2 px-4 rounded-lg font-medium hover:bg-blue-50 transition-colors">
            Créer ma tontine
          </button>
        </div>
      </div>
    </div>
  );

  const renderEducation = () => (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-night">Centre d'éducation financière</h2>
        <div className="flex items-center space-x-2 bg-green-100 text-green-800 px-4 py-2 rounded-lg">
          <AcademicCapIcon className="w-5 h-5" />
          <span className="font-medium">Niveau: Intermédiaire</span>
        </div>
      </div>

      {/* Progress Overview */}
      <div className="bg-white rounded-2xl border border-timberwolf/20 p-8">
        <h3 className="text-xl font-bold text-night mb-6">Votre progression</h3>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-gold-metallic mb-2">1</div>
            <div className="text-sm text-night/60">Modules complétés</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-gold-dark mb-2">1</div>
            <div className="text-sm text-night/60">En cours</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-gold-dark mb-2">53%</div>
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
                    <span>{module.lessons} leçons</span>
                  </span>
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                    {module.category}
                  </span>
                </div>
              </div>
              <div className="text-right ml-4">
                <div className="text-2xl font-bold text-gold-dark mb-1">{module.progress}%</div>
                <div className="text-sm text-night/60">Complété</div>
              </div>
            </div>

            <div className="w-full bg-timberwolf/20 rounded-full h-2 mb-4">
              <div 
                className="bg-gradient-to-r from-blue-400 to-blue-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${module.progress}%` }}
              ></div>
            </div>

            <div className="flex space-x-3">
              {module.completed ? (
                <button className="flex-1 bg-gold-metallic text-white py-2 px-4 rounded-lg font-medium hover:bg-gold-dark transition-colors flex items-center justify-center space-x-2">
                  <CheckCircleIcon className="w-5 h-5" />
                  <span>Terminé</span>
                </button>
              ) : module.progress > 0 ? (
                <button className="flex-1 bg-gold-dark text-white py-2 px-4 rounded-lg font-medium hover:bg-night transition-colors flex items-center justify-center space-x-2">
                  <PlayIcon className="w-5 h-5" />
                  <span>Continuer</span>
                </button>
              ) : (
                <button className="flex-1 border border-blue-600 text-gold-dark py-2 px-4 rounded-lg font-medium hover:bg-blue-50 transition-colors flex items-center justify-center space-x-2">
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

      {/* Additional Resources */}
      <div className="bg-white rounded-2xl border border-timberwolf/20 p-8">
        <h3 className="text-xl font-bold text-night mb-6">Ressources supplémentaires</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="border border-timberwolf/20 rounded-lg p-6">
            <div className="flex items-center space-x-3 mb-3">
              <DocumentTextIcon className="w-6 h-6 text-blue-500" />
              <h4 className="font-semibold text-night">Guides PDF</h4>
            </div>
            <p className="text-sm text-night/70 mb-4">Téléchargez nos guides pratiques d'épargne</p>
            <button className="w-full bg-gold-dark text-white py-2 px-4 rounded-lg font-medium hover:bg-night transition-colors">
              Télécharger
            </button>
          </div>
          
          <div className="border border-timberwolf/20 rounded-lg p-6">
            <div className="flex items-center space-x-3 mb-3">
              <PlayIcon className="w-6 h-6 text-red-500" />
              <h4 className="font-semibold text-night">Webinaires</h4>
            </div>
            <p className="text-sm text-night/70 mb-4">Participez à nos sessions en direct</p>
            <button className="w-full bg-red-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-red-700 transition-colors">
              S'inscrire
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderHealthScore = () => (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-night">Score de santé financière</h2>
        <div className="flex items-center space-x-2">
          <div className="text-4xl font-bold text-gold-metallic">{financialHealth.overall}</div>
          <div className="text-night/60">/100</div>
        </div>
      </div>

      {/* Overall Score */}
      <div className="bg-white rounded-2xl border border-timberwolf/20 p-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-night">Score global</h3>
          <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
            Excellent
          </span>
        </div>
        
        <div className="w-full bg-timberwolf/20 rounded-full h-4 mb-4">
          <div 
            className="bg-gradient-to-r from-green-400 to-green-600 h-4 rounded-full transition-all duration-1000"
            style={{ width: `${financialHealth.overall}%` }}
          ></div>
        </div>

        <p className="text-night/70">
          Votre score de santé financière est excellent ! Vous êtes sur la bonne voie pour atteindre vos objectifs financiers.
        </p>
      </div>

      {/* Detailed Scores */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-timberwolf/20 p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-semibold text-night">Taux d'épargne</h4>
            <span className="text-xl font-bold text-gold-metallic">{financialHealth.savingsRate}/100</span>
          </div>
          <div className="w-full bg-timberwolf/20 rounded-full h-2 mb-2">
            <div 
              className="bg-gold-metallic h-2 rounded-full"
              style={{ width: `${financialHealth.savingsRate}%` }}
            ></div>
          </div>
          <p className="text-sm text-night/60">Excellent taux d'épargne</p>
        </div>

        <div className="bg-white rounded-xl border border-timberwolf/20 p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-semibold text-night">Couverture objectifs</h4>
            <span className="text-xl font-bold text-gold-dark">{financialHealth.goalCoverage}/100</span>
          </div>
          <div className="w-full bg-timberwolf/20 rounded-full h-2 mb-2">
            <div 
              className="bg-blue-500 h-2 rounded-full"
              style={{ width: `${financialHealth.goalCoverage}%` }}
            ></div>
          </div>
          <p className="text-sm text-night/60">Bonne progression vers vos objectifs</p>
        </div>

        <div className="bg-white rounded-xl border border-timberwolf/20 p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-semibold text-night">Diversification</h4>
            <span className="text-xl font-bold text-gold-dark">{financialHealth.diversification}/100</span>
          </div>
          <div className="w-full bg-timberwolf/20 rounded-full h-2 mb-2">
            <div 
              className="bg-yellow-500 h-2 rounded-full"
              style={{ width: `${financialHealth.diversification}%` }}
            ></div>
          </div>
          <p className="text-sm text-night/60">Peut être amélioré</p>
        </div>

        <div className="bg-white rounded-xl border border-timberwolf/20 p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-semibold text-night">Consistance</h4>
            <span className="text-xl font-bold text-gold-metallic">{financialHealth.consistency}/100</span>
          </div>
          <div className="w-full bg-timberwolf/20 rounded-full h-2 mb-2">
            <div 
              className="bg-gold-metallic h-2 rounded-full"
              style={{ width: `${financialHealth.consistency}%` }}
            ></div>
          </div>
          <p className="text-sm text-night/60">Très régulier dans vos contributions</p>
        </div>
      </div>

      {/* Recommendations */}
      <div className="bg-white rounded-2xl border border-timberwolf/20 p-8">
        <h3 className="text-xl font-bold text-night mb-6">Recommandations personnalisées</h3>
        <div className="space-y-4">
          {financialHealth.recommendations.map((recommendation, index) => (
            <div key={index} className="flex items-start space-x-3 p-4 bg-blue-50 rounded-lg">
              <LightBulbIcon className="w-6 h-6 text-blue-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-night font-medium">{recommendation}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Monthly Archive */}
      <div className="bg-white rounded-2xl border border-timberwolf/20 p-8">
        <h3 className="text-xl font-bold text-night mb-6">Évolution mensuelle</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-timberwolf/20 rounded-lg">
            <div>
              <div className="font-semibold text-night">Septembre 2025</div>
              <div className="text-sm text-night/60">Score: 78/100</div>
            </div>
            <ArrowTrendingUpIcon className="w-6 h-6 text-green-500" />
          </div>
          <div className="flex items-center justify-between p-4 border border-timberwolf/20 rounded-lg">
            <div>
              <div className="font-semibold text-night">Août 2025</div>
              <div className="text-sm text-night/60">Score: 75/100</div>
            </div>
            <ArrowTrendingUpIcon className="w-6 h-6 text-green-500" />
          </div>
          <div className="flex items-center justify-between p-4 border border-timberwolf/20 rounded-lg">
            <div>
              <div className="font-semibold text-night">Juillet 2025</div>
              <div className="text-sm text-night/60">Score: 72/100</div>
            </div>
            <ArrowTrendingUpIcon className="w-6 h-6 text-green-500" />
          </div>
        </div>
      </div>
    </div>
  );

  const renderJointAccounts = () => (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-night">Comptes joints</h2>
        <button className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors flex items-center space-x-2">
          <UsersIcon className="w-5 h-5" />
          <span>Créer un groupe</span>
        </button>
      </div>

      {/* Joint Account Preview */}
      <div className="bg-white rounded-2xl border border-timberwolf/20 p-8">
        <h3 className="text-xl font-bold text-night mb-6">Aperçu des comptes partagés</h3>
        
        <div className="grid md:grid-cols-2 gap-8">
          {/* Sample Joint Account */}
          <div className="border border-indigo-200 rounded-lg p-6 bg-indigo-50">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-bold text-night">Famille Diallo - Maison</h4>
              <span className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded text-sm">Actif</span>
            </div>
            
            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span className="text-night/70">Objectif:</span>
                <span className="font-semibold text-night">10 000 000 FCFA</span>
              </div>
              <div className="flex justify-between">
                <span className="text-night/70">Collecté:</span>
                <span className="font-semibold text-gold-metallic">3 500 000 FCFA</span>
              </div>
              <div className="flex justify-between">
                <span className="text-night/70">Participants:</span>
                <span className="font-semibold text-night">4 membres</span>
              </div>
            </div>

            <div className="w-full bg-white rounded-full h-2 mb-4">
              <div className="bg-indigo-500 h-2 rounded-full" style={{ width: '35%' }}></div>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-night/70">Papa Diallo</span>
                <span className="font-medium text-night">125 000 FCFA/mois</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-night/70">Maman Diallo</span>
                <span className="font-medium text-night">75 000 FCFA/mois</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-night/70">Vous</span>
                <span className="font-medium text-gold-metallic">50 000 FCFA/mois</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-night/70">Frère Moussa</span>
                <span className="font-medium text-night">40 000 FCFA/mois</span>
              </div>
            </div>

            <div className="flex space-x-2">
              <button 
                onClick={() => {setTransferType('deposit'); setSelectedAccount('joint-1'); setShowTransferModal(true);}}
                className="flex-1 bg-gold-metallic text-white py-2 px-3 rounded-lg font-medium hover:bg-gold-dark transition-colors flex items-center justify-center space-x-1 text-sm"
              >
                <ArrowDownIcon className="w-4 h-4" />
                <span>Déposer</span>
              </button>
              <button className="flex-1 bg-indigo-600 text-white py-2 px-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors text-sm">
                Détails
              </button>
            </div>
          </div>

          {/* Create New Joint Account */}
          <div className="border border-timberwolf/20 rounded-lg p-6">
            <h4 className="font-bold text-night mb-4">Créer un nouveau groupe</h4>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-night mb-2">Nom du groupe</label>
                <input 
                  type="text" 
                  placeholder="Ex: Famille - Projet maison"
                  className="w-full px-4 py-2 border border-timberwolf/30 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-night mb-2">Objectif (FCFA)</label>
                <input 
                  type="number" 
                  placeholder="5000000"
                  className="w-full px-4 py-2 border border-timberwolf/30 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-night mb-2">Date cible</label>
                <input 
                  type="date" 
                  className="w-full px-4 py-2 border border-timberwolf/30 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-night mb-2">Inviter des membres</label>
                <input 
                  type="email" 
                  placeholder="email@exemple.com"
                  className="w-full px-4 py-2 border border-timberwolf/30 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
            </div>

            <button className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-indigo-700 transition-colors mt-6">
              Créer le groupe
            </button>
          </div>
        </div>
      </div>

      {/* Approval Flow Simulation */}
      <div className="bg-white rounded-2xl border border-timberwolf/20 p-8">
        <h3 className="text-xl font-bold text-night mb-6">Processus d'approbation</h3>
        
        <div className="space-y-4">
          <div className="flex items-center space-x-4 p-4 bg-green-50 rounded-lg border border-green-200">
            <CheckCircleIcon className="w-6 h-6 text-green-500" />
            <div className="flex-1">
              <div className="font-medium text-night">Retrait approuvé - 150 000 FCFA</div>
              <div className="text-sm text-night/60">Approuvé par 3/4 membres • Il y a 2 jours</div>
            </div>
            <span className="text-sm text-gold-metallic font-medium">Traité</span>
          </div>

          <div className="flex items-center space-x-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <ClockIcon className="w-6 h-6 text-yellow-500" />
            <div className="flex-1">
              <div className="font-medium text-night">Demande de retrait - 75 000 FCFA</div>
              <div className="text-sm text-night/60">En attente d'approbation • 2/4 membres</div>
            </div>
            <div className="flex space-x-2">
              <button className="bg-gold-metallic text-white px-3 py-1 rounded text-sm hover:bg-gold-dark transition-colors">
                Approuver
              </button>
              <button className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition-colors">
                Rejeter
              </button>
            </div>
          </div>

          <div className="flex items-center space-x-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <UsersIcon className="w-6 h-6 text-blue-500" />
            <div className="flex-1">
              <div className="font-medium text-night">Nouveau membre ajouté</div>
              <div className="text-sm text-night/60">Aminata Sow a rejoint le groupe • Il y a 1 semaine</div>
            </div>
            <span className="text-sm text-gold-dark font-medium">Info</span>
          </div>
        </div>
      </div>

      {/* Features Overview */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl border border-timberwolf/20 p-6">
          <div className="bg-purple-100 p-3 rounded-xl w-fit mb-4">
            <ShieldCheckIcon className="w-6 h-6 text-purple-600" />
          </div>
          <h4 className="font-bold text-night mb-2">Sécurisé</h4>
          <p className="text-sm text-night/70">Toutes les transactions nécessitent l'approbation de la majorité des membres</p>
        </div>

        <div className="bg-white rounded-xl border border-timberwolf/20 p-6">
          <div className="bg-green-100 p-3 rounded-xl w-fit mb-4">
            <ArrowTrendingUpIcon className="w-6 h-6 text-gold-metallic" />
          </div>
          <h4 className="font-bold text-night mb-2">Transparent</h4>
          <p className="text-sm text-night/70">Tous les membres voient les contributions et les retraits en temps réel</p>
        </div>

        <div className="bg-white rounded-xl border border-timberwolf/20 p-6">
          <div className="bg-blue-100 p-3 rounded-xl w-fit mb-4">
            <UsersIcon className="w-6 h-6 text-gold-dark" />
          </div>
          <h4 className="font-bold text-night mb-2">Collaboratif</h4>
          <p className="text-sm text-night/70">Atteignez vos objectifs plus rapidement en épargnant ensemble</p>
        </div>
      </div>
    </div>
  );

  const renderSectionContent = () => {
    switch (activeSection) {
      case 'naffas':
        return renderMesNaffas();
      case 'tontine':
        return renderTontineCalculator();
      case 'education':
        return renderEducation();
      case 'health':
        return renderHealthScore();
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
            { id: 'naffas', label: 'Mes Naffas', icon: WalletIcon },
            { id: 'tontine', label: 'Tontines', icon: UserGroupIcon },
            { id: 'education', label: 'Éducation', icon: BookOpenIcon },
            { id: 'health', label: 'Santé financière', icon: HeartIcon }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveSection(tab.id as 'overview' | 'naffas' | 'tontine' | 'education' | 'health')}
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
      
      {/* Transfer Modal */}
      {showTransferModal && renderTransferModal()}
    </div>
  );
}
