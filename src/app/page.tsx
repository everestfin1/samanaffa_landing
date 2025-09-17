'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  PlayIcon, 
  CheckCircleIcon, 
  StarIcon, 
  ShieldCheckIcon, 
  ArrowTrendingUpIcon, 
  CalculatorIcon,
  DevicePhoneMobileIcon,
  BuildingLibraryIcon,
  UserGroupIcon,
  TrophyIcon,
  ChartBarIcon,
  BanknotesIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';

export default function Home() {
  const router = useRouter();
  const [calculatorData, setCalculatorData] = useState({
    amount: 100000,
    term: 12,
  });

  const [savingsData, setSavingsData] = useState({
    monthlyAmount: 50000,
    months: 12,
  });

  const calculateReturns = () => {
    const monthlyRate = 0.08 / 12; // 8% annual rate
    const maturityAmount = calculatorData.amount * Math.pow(1 + monthlyRate, calculatorData.term);
    const totalReturn = maturityAmount - calculatorData.amount;
    return { maturityAmount, totalReturn };
  };

  const { maturityAmount, totalReturn } = calculateReturns();

  const calculateSavingsFutureValue = () => {
    const monthlyRate = 0.03 / 12; // 3% annual rate for savings preview
    const n = savingsData.months;
    const fv = monthlyRate > 0
      ? savingsData.monthlyAmount * ((Math.pow(1 + monthlyRate, n) - 1) / monthlyRate)
      : savingsData.monthlyAmount * n;
    return fv;
  };

  const savingsFV = calculateSavingsFutureValue();

  return (
    <div className="min-h-screen bg-white-smoke">
      {/* Skip to content */}
      <a href="#main" className="skip-link">Aller au contenu principal</a>

      {/* Hero Section */}
      <main id="main">
        <section className="relative bg-gradient-to-br from-white via-white-smoke to-timberwolf py-20 lg:py-32" aria-label="Hero">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-8">
                <div className="space-y-4">
                  <div className="inline-flex items-center px-4 py-2 bg-gold-metallic/10 rounded-full text-sm font-medium text-night" aria-label="Confiance et conformité">
                    <ShieldCheckIcon className="w-4 h-4 mr-2 text-gold-metallic" />
                    Conforme BCEAO - Sécurisé et Réglementé
                  </div>
                  <h1 className="heading-1 text-4xl md:text-6xl text-night leading-tight">
                    Votre épargne,
                    <span className="text-gold-metallic"> notre expertise</span>
                  </h1>
                  <p className="body-copy text-xl text-night/70 leading-relaxed">
                    Découvrez Sama Naffa, la plateforme d'épargne et d'investissement qui transforme vos objectifs financiers en réalité. 
                    Épargne sécurisée, investissement dans l'Appel Public à l'Épargne de l'État, accompagnement personnalisé.
                  </p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <button 
                    onClick={() => router.push('/sama-naffa')}
                    className="bg-gold-metallic text-night px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gold-metallic/90 transition-all transform hover:scale-105 shadow-lg"
                  >
                    Ouvrir un compte épargne
                  </button>
                  <button 
                    onClick={() => router.push('/ape')}
                    className="border-2 border-night text-night px-8 py-4 rounded-lg font-semibold text-lg hover:bg-night hover:text-white transition-all"
                  >
                    Découvrir l'APE
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-6 pt-8 border-t border-timberwolf/30">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-night">10,000+</div>
                    <div className="text-sm text-night/60">Clients satisfaits</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-night">8%</div>
                    <div className="text-sm text-night/60">Rendement APE</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-night">24/7</div>
                    <div className="text-sm text-night/60">Support client</div>
                  </div>
                </div>
              </div>

              {/* Calculator Component */}
              <div id="calculator" className="relative" aria-label="Simulateur APE">
                <div className="bg-white rounded-2xl shadow-2xl p-8 border border-timberwolf/20">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="heading-3 text-xl font-semibold text-night">Simulateur APE</h2>
                    <CalculatorIcon className="w-6 h-6 text-gold-metallic" />
                  </div>
                  
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-night/70 mb-2" htmlFor="amount">Montant d'investissement</label>
                      <div className="relative">
                        <input
                          type="number"
                          id="amount"
                          value={calculatorData.amount}
                          onChange={(e) => setCalculatorData({...calculatorData, amount: parseInt(e.target.value) || 0})}
                          className="w-full px-4 py-3 border border-timberwolf rounded-lg focus:ring-2 focus:ring-gold-metallic focus:border-transparent text-night"
                          placeholder="100,000"
                        />
                        <span className="absolute right-3 top-3 text-night/50">FCFA</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-night/70 mb-2" htmlFor="term">Durée (mois)</label>
                      <select
                        id="term"
                        value={calculatorData.term}
                        onChange={(e) => setCalculatorData({...calculatorData, term: parseInt(e.target.value)})}
                        className="w-full px-4 py-3 border border-timberwolf rounded-lg focus:ring-2 focus:ring-gold-metallic focus:border-transparent text-night"
                      >
                        <option value={6}>6 mois</option>
                        <option value={12}>12 mois</option>
                        <option value={24}>24 mois</option>
                        <option value={36}>36 mois</option>
                      </select>
                    </div>

                    <div className="bg-gold-metallic/10 rounded-lg p-4 space-y-2">
                      <div className="flex justify-between">
                        <span className="text-night/70">Capital investi:</span>
                        <span className="font-semibold text-night">{calculatorData.amount.toLocaleString()} FCFA</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-night/70">Gains estimés:</span>
                        <span className="font-semibold text-gold-metallic">+{Math.round(totalReturn).toLocaleString()} FCFA</span>
                      </div>
                      <div className="flex justify-between text-lg font-bold pt-2 border-t border-gold-metallic/20">
                        <span className="text-night">Total à maturité:</span>
                        <span className="text-night">{Math.round(maturityAmount).toLocaleString()} FCFA</span>
                      </div>
                    </div>

                    <button 
                      onClick={() => router.push('/ape')}
                      className="w-full bg-gold-metallic text-night py-3 rounded-lg font-semibold hover:bg-gold-metallic/90 transition-colors"
                    >
                      Souscrire maintenant
                    </button>
                  </div>
                </div>

                {/* Savings Estimator Preview */}
                <div className="bg-white rounded-2xl shadow-xl p-6 border border-timberwolf/20 mt-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-night">Aperçu épargne mensuelle</h3>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-night/70 mb-2" htmlFor="monthlyAmount">Montant mensuel</label>
                      <div className="relative">
                        <input
                          type="number"
                          id="monthlyAmount"
                          value={savingsData.monthlyAmount}
                          onChange={(e) => setSavingsData({...savingsData, monthlyAmount: parseInt(e.target.value) || 0})}
                          className="w-full px-4 py-3 border border-timberwolf rounded-lg focus:ring-2 focus:ring-gold-metallic focus:border-transparent text-night"
                          placeholder="50,000"
                        />
                        <span className="absolute right-3 top-3 text-night/50">FCFA</span>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-night/70 mb-2" htmlFor="months">Durée (mois)</label>
                      <select
                        id="months"
                        value={savingsData.months}
                        onChange={(e) => setSavingsData({...savingsData, months: parseInt(e.target.value)})}
                        className="w-full px-4 py-3 border border-timberwolf rounded-lg focus:ring-2 focus:ring-gold-metallic focus:border-transparent text-night"
                      >
                        <option value={6}>6</option>
                        <option value={12}>12</option>
                        <option value={24}>24</option>
                        <option value={36}>36</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-4 pt-3 border-t border-timberwolf/30">
                    <span className="text-night/70">Total estimé à terme:</span>
                    <span className="text-night font-bold">{Math.round(savingsFV).toLocaleString()} FCFA</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Entrances Section */}
        <section id="entrees" className="py-16 bg-white" aria-label="Portes d'entrée">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <h2 className="heading-2 text-3xl md:text-4xl text-night mb-3">Choisissez votre parcours</h2>
              <p className="body-copy text-night/70">Deux portes d'entrée claires pour avancer selon vos besoins</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="rounded-2xl border border-timberwolf/30 bg-white p-6 shadow-sm hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-3 mb-3">
                  <DevicePhoneMobileIcon className="w-6 h-6 text-gold-metallic" />
                  <h3 className="text-xl font-semibold text-night">Sama Naffa (Banque Digitale)</h3>
                </div>
                <p className="text-night/70 mb-4">Épargne, portefeuille digital, comptes joints et tontines modernes.</p>
                <ul className="list-disc pl-5 text-night/70 space-y-1 mb-5">
                  <li>Objectifs d'épargne et suivi</li>
                  <li>Comptes joints et gestion de groupe</li>
                  <li>Challenges d'épargne</li>
                </ul>
                <Link 
                  href="/sama-naffa"
                  className="inline-flex items-center px-5 py-3 rounded-lg bg-night text-white font-medium hover:bg-night/90 transition-colors"
                >
                  Entrer côté Sama Naffa
                </Link>
              </div>

              <div className="rounded-2xl border border-timberwolf/30 bg-white p-6 shadow-sm hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-3 mb-3">
                  <BuildingLibraryIcon className="w-6 h-6 text-gold-metallic" />
                  <h3 className="text-xl font-semibold text-night">APE Sénégal (Appel Public à l'Épargne)</h3>
                </div>
                <p className="text-night/70 mb-4">L'Appel Public à l'Épargne de l'État du Sénégal - investissement sécurisé avec rendement fixe et échéances définies.</p>
                <ul className="list-disc pl-5 text-night/70 space-y-1 mb-5">
                  <li>Calculateur de rendement</li>
                  <li>Scénarios et maturités</li>
                  <li>Étapes et documents requis</li>
                </ul>
                <Link 
                  href="/ape"
                  className="inline-flex items-center px-5 py-3 rounded-lg bg-gold-metallic text-night font-medium hover:bg-gold-metallic/90 transition-colors"
                >
                  Explorer l'APE
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Value Propositions */}
        <section id="about" className="py-20 bg-white" aria-label="Valeur ajoutée">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="heading-2 text-3xl md:text-4xl text-night mb-4">
                Pourquoi choisir Sama Naffa ?
              </h2>
              <p className="body-copy text-xl text-night/70 max-w-3xl mx-auto">
                Une expertise financière reconnue au service de vos ambitions, avec des solutions adaptées à chaque profil d'épargnant.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center space-y-3 p-6 rounded-xl border border-timberwolf/30 bg-white hover:shadow-lg transition-shadow">
                <div className="w-14 h-14 bg-gold-metallic/10 rounded-full flex items-center justify-center mx-auto">
                  <DevicePhoneMobileIcon className="w-7 h-7 text-gold-metallic" />
                </div>
                <h3 className="text-lg font-semibold text-night">Banque mobile-first</h3>
                <p className="text-night/70">Wallet, épargne, comptes joints et outils modernes, pensés mobile.</p>
              </div>

              <div className="text-center space-y-3 p-6 rounded-xl border border-timberwolf/30 bg-white hover:shadow-lg transition-shadow">
                <div className="w-14 h-14 bg-gold-metallic/10 rounded-full flex items-center justify-center mx-auto">
                  <BuildingLibraryIcon className="w-7 h-7 text-gold-metallic" />
                </div>
                <h3 className="text-lg font-semibold text-night">Investissement APE</h3>
                <p className="text-night/70">L'Appel Public à l'Épargne de l'État du Sénégal, rendement fixe garanti.</p>
              </div>

              <div className="text-center space-y-3 p-6 rounded-xl border border-timberwolf/30 bg-white hover:shadow-lg transition-shadow">
                <div className="w-14 h-14 bg-gold-metallic/10 rounded-full flex items-center justify-center mx-auto">
                  <UserGroupIcon className="w-7 h-7 text-gold-metallic" />
                </div>
                <h3 className="text-lg font-semibold text-night">Tontines modernisées</h3>
                <p className="text-night/70">Groupes d'épargne digitaux avec suivi, rôles et objectifs clairs.</p>
              </div>

              <div className="text-center space-y-3 p-6 rounded-xl border border-timberwolf/30 bg-white hover:shadow-lg transition-shadow">
                <div className="w-14 h-14 bg-gold-metallic/10 rounded-full flex items-center justify-center mx-auto">
                  <TrophyIcon className="w-7 h-7 text-gold-metallic" />
                </div>
                <h3 className="text-lg font-semibold text-night">Challenges & gamification</h3>
                <p className="text-night/70">Défis d'épargne ludiques pour tenir le cap et célébrer vos progrès.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Educational Content */}
        <section className="py-20 bg-timberwolf/20" aria-label="Éducation financière">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="heading-2 text-3xl md:text-4xl text-night mb-6">
                  Comprendre l'APE
                  <span className="text-gold-metallic"> (Appel Public à l'Épargne)</span>
                </h2>
                <div className="space-y-6">
                  <p className="body-copy text-lg text-night/70">
                    L'APE est un instrument financier de l'État du Sénégal qui vous permet de faire fructifier votre épargne 
                    tout en contribuant au financement des projets publics et au développement économique national.
                  </p>
                  
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <CheckCircleIcon className="w-6 h-6 text-gold-metallic mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-night">Rendements prévisibles</h4>
                        <p className="text-night/70">Taux d'intérêt fixes connus à l'avance</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <CheckCircleIcon className="w-6 h-6 text-gold-metallic mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-night">Sécurité gouvernementale</h4>
                        <p className="text-night/70">Garanti par l'État du Sénégal</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <CheckCircleIcon className="w-6 h-6 text-gold-metallic mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-night">Impact national</h4>
                        <p className="text-night/70">Soutenez le développement économique du Sénégal</p>
                      </div>
                    </div>
                  </div>

                  <Link 
                    href="/ape"
                    className="bg-night text-white px-8 py-3 rounded-lg font-semibold hover:bg-night/90 transition-colors"
                  >
                    En savoir plus sur l'APE
                  </Link>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-white rounded-xl p-6 shadow-lg border border-timberwolf/20">
                  <h4 className="text-lg font-semibold text-night mb-3">Épargne Sama Naffa</h4>
                  <ul className="space-y-2 text-night/70">
                    <li>• Compte accessible 24/7</li>
                    <li>• Pas de frais de tenue de compte</li>
                    <li>• Intérêts calculés quotidiennement</li>
                    <li>• Retraits flexibles</li>
                  </ul>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-lg border border-timberwolf/20">
                  <h4 className="text-lg font-semibold text-night mb-3">Investissement APE</h4>
                  <ul className="space-y-2 text-night/70">
                    <li>• Rendements jusqu'à 8% par an</li>
                    <li>• Durées de 6 à 36 mois</li>
                    <li>• Capital garanti à maturité</li>
                    <li>• Suivi en temps réel</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section id="testimonials" className="py-20 bg-white" aria-label="Témoignages clients">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="heading-2 text-3xl md:text-4xl text-night mb-4">
                Ce que disent nos clients
              </h2>
              <p className="body-copy text-xl text-night/70">
                Plus de 10,000 épargnants nous font confiance
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Video Testimonial Placeholders */}
              <div className="bg-timberwolf/10 rounded-xl p-6 text-center space-y-4">
                <div className="relative bg-night/5 rounded-lg h-48 flex items-center justify-center group cursor-pointer">
                  <PlayIcon className="w-16 h-16 text-gold-metallic group-hover:scale-110 transition-transform" />
                  <div className="absolute inset-0 bg-gradient-to-t from-night/20 to-transparent rounded-lg"></div>
                </div>
                <div>
                  <h4 className="font-semibold text-night">Aminata Diallo</h4>
                  <p className="text-sm text-night/60">Commerçante, Dakar</p>
                  <div className="flex justify-center space-x-1 mt-2">
                    {[...Array(5)].map((_, i) => (
                      <StarIcon key={i} className="w-4 h-4 fill-gold-metallic text-gold-metallic" />
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-timberwolf/10 rounded-xl p-6 text-center space-y-4">
                <div className="relative bg-night/5 rounded-lg h-48 flex items-center justify-center group cursor-pointer">
                  <PlayIcon className="w-16 h-16 text-gold-metallic group-hover:scale-110 transition-transform" />
                  <div className="absolute inset-0 bg-gradient-to-t from-night/20 to-transparent rounded-lg"></div>
                </div>
                <div>
                  <h4 className="font-semibold text-night">Mamadou Sy</h4>
                  <p className="text-sm text-night/60">Entrepreneur, Thiès</p>
                  <div className="flex justify-center space-x-1 mt-2">
                    {[...Array(5)].map((_, i) => (
                      <StarIcon key={i} className="w-4 h-4 fill-gold-metallic text-gold-metallic" />
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-timberwolf/10 rounded-xl p-6 text-center space-y-4">
                <div className="relative bg-night/5 rounded-lg h-48 flex items-center justify-center group cursor-pointer">
                  <PlayIcon className="w-16 h-16 text-gold-metallic group-hover:scale-110 transition-transform" />
                  <div className="absolute inset-0 bg-gradient-to-t from-night/20 to-transparent rounded-lg"></div>
                </div>
                <div>
                  <h4 className="font-semibold text-night">Fatou Ndiaye</h4>
                  <p className="text-sm text-night/60">Professeure, Saint-Louis</p>
                  <div className="flex justify-center space-x-1 mt-2">
                    {[...Array(5)].map((_, i) => (
                      <StarIcon key={i} className="w-4 h-4 fill-gold-metallic text-gold-metallic" />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-night to-night/90" aria-label="Appel à l'action">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="heading-2 text-3xl md:text-4xl text-white mb-6">
              Prêt à faire fructifier votre épargne ?
            </h2>
            <p className="body-copy text-xl text-white/80 mb-8">
              Rejoignez des milliers d'épargnants qui ont choisi Sama Naffa pour sécuriser et développer leur patrimoine.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/sama-naffa"
                className="bg-gold-metallic text-night px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gold-metallic/90 transition-all transform hover:scale-105"
              >
                Ouvrir mon compte épargne
              </Link>
              <Link 
                href="/ape"
                className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-night transition-all"
              >
                Découvrir l'investissement APE
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-night text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-2xl font-bold mb-4 text-gold-metallic">Sama Naffa</h3>
              <p className="text-white/70 mb-4">
                Votre partenaire de confiance pour l'épargne et l'investissement au Sénégal.
              </p>
              <div className="flex space-x-4">
                <div className="w-8 h-8 bg-gold-metallic/20 rounded-full flex items-center justify-center">
                  <span className="text-gold-metallic text-sm">f</span>
                </div>
                <div className="w-8 h-8 bg-gold-metallic/20 rounded-full flex items-center justify-center">
                  <span className="text-gold-metallic text-sm">t</span>
                </div>
                <div className="w-8 h-8 bg-gold-metallic/20 rounded-full flex items-center justify-center">
                  <span className="text-gold-metallic text-sm">in</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Produits</h4>
              <ul className="space-y-2 text-white/70">
                <li><button onClick={() => router.push('/sama-naffa')} className="hover:text-gold-metallic transition-colors">Compte épargne</button></li>
                <li><button onClick={() => router.push('/ape')} className="hover:text-gold-metallic transition-colors">Investissement APE</button></li>
                <li><a href="#calculator" className="hover:text-gold-metallic transition-colors">Calculateurs</a></li>
                <li><a href="#about" className="hover:text-gold-metallic transition-colors">Éducation financière</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-white/70">
                <li><a href="#" className="hover:text-gold-metallic transition-colors">Centre d'aide</a></li>
                <li><a href="#" className="hover:text-gold-metallic transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-gold-metallic transition-colors">FAQ</a></li>
                <li><a href="#" className="hover:text-gold-metallic transition-colors">Sécurité</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <div className="space-y-2 text-white/70">
                <p>+221 33 XXX XX XX</p>
                <p>contact@samanaffa.sn</p>
                <p>Dakar, Sénégal</p>
              </div>
            </div>
          </div>

          <div className="border-t border-white/20 mt-8 pt-8 text-center text-white/60">
            <p>&copy; 2024 Sama Naffa. Tous droits réservés. | Conforme BCEAO</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
