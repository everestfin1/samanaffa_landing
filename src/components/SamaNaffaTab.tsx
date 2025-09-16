'use client';

import { useState } from 'react';
import {
  WalletIcon,
  BanknotesIcon,
  UserGroupIcon,
  TrophyIcon,
  ChartBarIcon,
  PlusCircleIcon,
  StarIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

export default function SamaNaffaTab() {
  const [savingsGoal, setSavingsGoal] = useState({
    name: 'Maison familiale',
    target: 5000000,
    current: 1200000,
    monthlyContribution: 200000
  });

  const [challengeData, setChallengeData] = useState({
    weeklyAmount: 10000,
    weeks: 52
  });

  const calculateSavingsProgress = () => {
    const progress = (savingsGoal.current / savingsGoal.target) * 100;
    const remaining = savingsGoal.target - savingsGoal.current;
    const monthsToGoal = Math.ceil(remaining / savingsGoal.monthlyContribution);
    return { progress, remaining, monthsToGoal };
  };

  const calculate52WeekChallenge = () => {
    // 52-week challenge: week 1 = amount, week 2 = amount*2, etc.
    const totalSavings = challengeData.weeklyAmount * (52 * 53) / 2; // Sum of arithmetic sequence
    return totalSavings;
  };

  const { progress, remaining, monthsToGoal } = calculateSavingsProgress();
  const challengeTotal = calculate52WeekChallenge();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="heading-1 text-3xl md:text-4xl text-night mb-4">
          Sama Naffa
          <span className="text-gold-metallic"> - Banque Digitale</span>
        </h1>
        <p className="body-copy text-lg text-night/70 max-w-3xl">
          Découvrez l'avenir de la banque mobile au Sénégal. Gérez vos comptes, épargnez intelligemment, 
          participez à des tontines modernes et relevez des défis financiers ludiques.
        </p>
      </div>

      {/* Digital Wallet Preview */}
      <section className="mb-12">
        <h2 className="heading-2 text-2xl text-night mb-6 flex items-center">
          <WalletIcon className="w-6 h-6 text-gold-metallic mr-3" />
          Portefeuille Digital
        </h2>
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-gradient-to-br from-night to-night/90 text-white rounded-2xl p-8">
            <div className="flex justify-between items-start mb-6">
              <div>
                <p className="text-white/70 text-sm">Solde disponible</p>
                <p className="text-3xl font-bold">2,450,000 <span className="text-lg font-normal">FCFA</span></p>
              </div>
              <div className="bg-gold-metallic text-night px-3 py-1 rounded-full text-sm font-semibold">
                Démo
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-white/10">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center">
                    <span className="text-green-400 text-xs">+</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Virement reçu</p>
                    <p className="text-xs text-white/60">Aujourd'hui, 14:30</p>
                  </div>
                </div>
                <span className="text-green-400 font-semibold">+150,000 FCFA</span>
              </div>
              
              <div className="flex justify-between items-center py-2 border-b border-white/10">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center">
                    <span className="text-blue-400 text-xs">S</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Épargne automatique</p>
                    <p className="text-xs text-white/60">Hier, 08:00</p>
                  </div>
                </div>
                <span className="text-white/70 font-semibold">-50,000 FCFA</span>
              </div>
              
              <div className="flex justify-between items-center py-2">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-purple-500/20 rounded-full flex items-center justify-center">
                    <span className="text-purple-400 text-xs">T</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Tontine - Groupe Thiès</p>
                    <p className="text-xs text-white/60">15 Jan, 10:00</p>
                  </div>
                </div>
                <span className="text-white/70 font-semibold">-100,000 FCFA</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-white rounded-xl p-6 border border-timberwolf/20">
              <h4 className="font-semibold text-night mb-3">Actions rapides</h4>
              <div className="space-y-3">
                <button className="w-full bg-gold-metallic text-night py-3 rounded-lg font-medium hover:bg-gold-metallic/90 transition-colors">
                  Envoyer de l'argent
                </button>
                <button className="w-full border border-timberwolf text-night py-3 rounded-lg font-medium hover:bg-timberwolf/20 transition-colors">
                  Demander un paiement
                </button>
                <button className="w-full border border-timberwolf text-night py-3 rounded-lg font-medium hover:bg-timberwolf/20 transition-colors">
                  Recharger le compte
                </button>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 border border-timberwolf/20">
              <h4 className="font-semibold text-night mb-3">Convertisseur</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-night/70">1 EUR =</span>
                  <span className="font-semibold text-night">656 FCFA</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-night/70">1 USD =</span>
                  <span className="font-semibold text-night">605 FCFA</span>
                </div>
                <button className="w-full text-sm text-gold-metallic hover:underline">
                  Voir plus de devises
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Savings Goals Manager */}
      <section className="mb-12">
        <h2 className="heading-2 text-2xl text-night mb-6 flex items-center">
          <BanknotesIcon className="w-6 h-6 text-gold-metallic mr-3" />
          Objectifs d'Épargne
        </h2>
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl p-8 border border-timberwolf/20">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-xl font-semibold text-night mb-2">{savingsGoal.name}</h3>
                <p className="text-night/60">Objectif: {savingsGoal.target.toLocaleString()} FCFA</p>
              </div>
              <button className="text-gold-metallic hover:text-gold-metallic/80">
                <PlusCircleIcon className="w-6 h-6" />
              </button>
            </div>

            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-night/70">Progression</span>
                <span className="font-semibold text-night">{Math.round(progress)}%</span>
              </div>
              <div className="w-full bg-timberwolf/30 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-gold-metallic to-gold-metallic/80 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(progress, 100)}%` }}
                ></div>
              </div>
              <div className="flex justify-between items-center mt-2 text-sm">
                <span className="text-night/60">{savingsGoal.current.toLocaleString()} FCFA</span>
                <span className="text-night/60">{savingsGoal.target.toLocaleString()} FCFA</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="text-center p-3 bg-timberwolf/20 rounded-lg">
                <p className="text-lg font-bold text-night">{remaining.toLocaleString()}</p>
                <p className="text-xs text-night/60">FCFA restants</p>
              </div>
              <div className="text-center p-3 bg-timberwolf/20 rounded-lg">
                <p className="text-lg font-bold text-night">{monthsToGoal}</p>
                <p className="text-xs text-night/60">mois restants</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-night/70">Contribution mensuelle</label>
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    value={savingsGoal.monthlyContribution}
                    onChange={(e) => setSavingsGoal({...savingsGoal, monthlyContribution: parseInt(e.target.value) || 0})}
                    className="w-24 text-right border border-timberwolf rounded px-2 py-1 text-sm"
                  />
                  <span className="text-sm text-night/60">FCFA</span>
                </div>
              </div>
              <button className="w-full bg-night text-white py-3 rounded-lg font-medium hover:bg-night/90 transition-colors">
                Mettre à jour l'objectif
              </button>
            </div>
          </div>

          <div className="space-y-6">
            {/* 52-Week Challenge */}
            <div className="bg-white rounded-xl p-6 border border-timberwolf/20">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold text-night">Défi 52 Semaines</h4>
                <TrophyIcon className="w-5 h-5 text-gold-metallic" />
              </div>
              <p className="text-sm text-night/70 mb-4">
                Commencez avec un petit montant et augmentez chaque semaine
              </p>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-night/70 mb-1">Montant de départ (semaine 1)</label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="number"
                      value={challengeData.weeklyAmount}
                      onChange={(e) => setChallengeData({...challengeData, weeklyAmount: parseInt(e.target.value) || 0})}
                      className="flex-1 border border-timberwolf rounded-lg px-3 py-2 text-sm"
                      placeholder="10,000"
                    />
                    <span className="text-sm text-night/60">FCFA</span>
                  </div>
                </div>
                
                <div className="bg-gold-metallic/10 rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <span className="text-night/70">Total après 52 semaines:</span>
                    <span className="font-bold text-night">{challengeTotal.toLocaleString()} FCFA</span>
                  </div>
                  <p className="text-xs text-night/60 mt-1">
                    Semaine 52: {(challengeData.weeklyAmount * 52).toLocaleString()} FCFA
                  </p>
                </div>

                <button className="w-full bg-gold-metallic text-night py-2 rounded-lg font-medium hover:bg-gold-metallic/90 transition-colors">
                  Commencer le défi
                </button>
              </div>
            </div>

            {/* Achievement Badges */}
            <div className="bg-white rounded-xl p-6 border border-timberwolf/20">
              <h4 className="font-semibold text-night mb-4">Mes Achievements</h4>
              <div className="grid grid-cols-3 gap-3">
                <div className="text-center">
                  <div className="w-12 h-12 bg-gold-metallic/10 rounded-full flex items-center justify-center mx-auto mb-2">
                    <StarIcon className="w-6 h-6 text-gold-metallic" />
                  </div>
                  <p className="text-xs text-night/70">Premier dépôt</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-timberwolf/20 rounded-full flex items-center justify-center mx-auto mb-2">
                    <TrophyIcon className="w-6 h-6 text-night/40" />
                  </div>
                  <p className="text-xs text-night/40">Épargnant régulier</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-timberwolf/20 rounded-full flex items-center justify-center mx-auto mb-2">
                    <CheckCircleIcon className="w-6 h-6 text-night/40" />
                  </div>
                  <p className="text-xs text-night/40">Objectif atteint</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tontine Management */}
      <section className="mb-12">
        <h2 className="heading-2 text-2xl text-night mb-6 flex items-center">
          <UserGroupIcon className="w-6 h-6 text-gold-metallic mr-3" />
          Tontines Modernes
        </h2>
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-2xl p-8 border border-timberwolf/20">
            <h3 className="text-xl font-semibold text-night mb-6">Calculateur de Tontine</h3>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-night/70 mb-2">Nombre de membres</label>
                  <select className="w-full border border-timberwolf rounded-lg px-3 py-2">
                    <option>10 membres</option>
                    <option>15 membres</option>
                    <option>20 membres</option>
                    <option>25 membres</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-night/70 mb-2">Contribution mensuelle</label>
                  <div className="relative">
                    <input
                      type="number"
                      className="w-full border border-timberwolf rounded-lg px-3 py-2 pr-12"
                      placeholder="50,000"
                    />
                    <span className="absolute right-3 top-2 text-night/50 text-sm">FCFA</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-night/70 mb-2">Durée du cycle</label>
                  <select className="w-full border border-timberwolf rounded-lg px-3 py-2">
                    <option>10 mois</option>
                    <option>12 mois</option>
                    <option>15 mois</option>
                    <option>20 mois</option>
                  </select>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-timberwolf/20 rounded-lg p-4">
                  <h4 className="font-semibold text-night mb-3">Résumé</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-night/70">Contribution totale:</span>
                      <span className="font-semibold">500,000 FCFA</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-night/70">Montant reçu:</span>
                      <span className="font-semibold">500,000 FCFA</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-night/70">Votre tour:</span>
                      <span className="font-semibold">Mois 5</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gold-metallic/10 rounded-lg p-4">
                  <h4 className="font-semibold text-night mb-2">Avantages</h4>
                  <ul className="text-sm text-night/70 space-y-1">
                    <li>• Épargne disciplinée</li>
                    <li>• Accès à un capital important</li>
                    <li>• Solidarité communautaire</li>
                    <li>• Gestion transparente</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="flex gap-4 mt-6">
              <button className="flex-1 bg-gold-metallic text-night py-3 rounded-lg font-medium hover:bg-gold-metallic/90 transition-colors">
                Créer une tontine
              </button>
              <button className="flex-1 border border-timberwolf text-night py-3 rounded-lg font-medium hover:bg-timberwolf/20 transition-colors">
                Rejoindre une tontine
              </button>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-xl p-6 border border-timberwolf/20">
              <h4 className="font-semibold text-night mb-4">Tontines Disponibles</h4>
              <div className="space-y-3">
                <div className="border border-timberwolf/30 rounded-lg p-3">
                  <div className="flex justify-between items-start mb-2">
                    <h5 className="font-medium text-night">Groupe Dakar Centre</h5>
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Ouvert</span>
                  </div>
                  <p className="text-sm text-night/70">15/20 membres • 100,000 FCFA/mois</p>
                  <button className="text-xs text-gold-metallic hover:underline mt-2">Voir détails</button>
                </div>

                <div className="border border-timberwolf/30 rounded-lg p-3">
                  <div className="flex justify-between items-start mb-2">
                    <h5 className="font-medium text-night">Entrepreneurs Thiès</h5>
                    <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">Bientôt</span>
                  </div>
                  <p className="text-sm text-night/70">8/12 membres • 200,000 FCFA/mois</p>
                  <button className="text-xs text-gold-metallic hover:underline mt-2">S'inscrire</button>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 border border-timberwolf/20">
              <h4 className="font-semibold text-night mb-4">Mes Tontines</h4>
              <div className="text-center py-8">
                <UserGroupIcon className="w-12 h-12 text-night/30 mx-auto mb-3" />
                <p className="text-night/60 text-sm">Aucune tontine active</p>
                <button className="text-gold-metallic text-sm hover:underline mt-2">
                  Rejoindre votre première tontine
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Educational Content */}
      <section>
        <h2 className="heading-2 text-2xl text-night mb-6 flex items-center">
          <ChartBarIcon className="w-6 h-6 text-gold-metallic mr-3" />
          Centre d'Éducation Financière
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl p-6 border border-timberwolf/20">
            <h4 className="font-semibold text-night mb-3">Banque Mobile 101</h4>
            <p className="text-sm text-night/70 mb-4">
              Apprenez les bases des services bancaires mobiles et de la sécurité numérique.
            </p>
            <div className="flex items-center justify-between">
              <span className="text-xs text-night/60">5 modules • 30 min</span>
              <button className="text-gold-metallic text-sm font-medium hover:underline">
                Commencer
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-timberwolf/20">
            <h4 className="font-semibold text-night mb-3">Stratégies d'Épargne</h4>
            <p className="text-sm text-night/70 mb-4">
              Découvrez comment épargner efficacement et atteindre vos objectifs financiers.
            </p>
            <div className="flex items-center justify-between">
              <span className="text-xs text-night/60">8 modules • 45 min</span>
              <button className="text-gold-metallic text-sm font-medium hover:underline">
                Commencer
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-timberwolf/20">
            <h4 className="font-semibold text-night mb-3">Tontines Modernes</h4>
            <p className="text-sm text-night/70 mb-4">
              Comprenez le fonctionnement des tontines digitales et leurs avantages.
            </p>
            <div className="flex items-center justify-between">
              <span className="text-xs text-night/60">6 modules • 35 min</span>
              <button className="text-gold-metallic text-sm font-medium hover:underline">
                Commencer
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
