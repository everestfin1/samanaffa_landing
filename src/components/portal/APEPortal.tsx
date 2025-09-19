'use client';

import { useState } from 'react';
import {
  BuildingLibraryIcon,
  BanknotesIcon,
  ArrowTrendingUpIcon,
  ArrowDownIcon,
  InformationCircleIcon,
  CheckCircleIcon,
  PlusIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';
import InvestmentModal from '../modals/InvestmentModal';
import { ArrowRightIcon } from 'lucide-react';

interface Investment {
  id: string;
  tranche: 'A' | 'B' | 'C' | 'D';
  amount: number;
  term: 3 | 5 | 7 | 10;
  interestRate: number;
  purchaseDate: string;
  nextPayment: string;
  totalValue: number;
}

export default function APEPortal() {
  const [showInvestmentModal, setShowInvestmentModal] = useState(false);
  const [selectedTranche, setSelectedTranche] = useState<'A' | 'B' | 'C' | 'D' | null>(null);
  
  // Current investments
  const [investments] = useState<Investment[]>([
    {
      id: '1',
      tranche: 'D',
      amount: 1000000,
      term: 10,
      interestRate: 6.95,
      purchaseDate: '2025-08-15',
      nextPayment: '2026-02-15',
      totalValue: 1695000
    },
    {
      id: '2',
      tranche: 'B',
      amount: 500000,
      term: 5,
      interestRate: 6.60,
      purchaseDate: '2025-09-01',
      nextPayment: '2026-03-01',
      totalValue: 665000
    }
  ]);

  const trancheOptions = [
    { value: 'A' as const, label: 'Tranche A', term: 3, rate: 6.40, description: 'Court terme - 3 ans' },
    { value: 'B' as const, label: 'Tranche B', term: 5, rate: 6.60, description: 'Moyen terme - 5 ans' },
    { value: 'C' as const, label: 'Tranche C', term: 7, rate: 6.75, description: 'Long terme - 7 ans' },
    { value: 'D' as const, label: 'Tranche D', term: 10, rate: 6.95, description: 'Très long terme - 10 ans' }
  ];

  const handleInvestmentConfirm = (data: { amount: number; tranche: 'A' | 'B' | 'C' | 'D'; method: string }) => {
    console.log('Investment data:', data);
    setShowInvestmentModal(false);
    setSelectedTranche(null);
    // Here you would handle the actual investment
  };

  const handleTrancheClick = (tranche: 'A' | 'B' | 'C' | 'D') => {
    setSelectedTranche(tranche);
    setShowInvestmentModal(true);
  };

  const totalInvestment = investments.reduce((sum, inv) => sum + inv.amount, 0);
  const totalProjectedValue = investments.reduce((sum, inv) => sum + inv.totalValue, 0);

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-gold-light/20 to-gold-metallic/10 rounded-2xl p-8 border border-gold-metallic/20">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-night mb-2">Emprunt Obligataire</h2>
            <p className="text-night/70 text-lg">Investissez dans les obligations d'État du Sénégal</p>
          </div>
          <div className="hidden md:block">
            <div className="bg-gold-metallic/10 p-4 rounded-full">
              <BuildingLibraryIcon className="w-12 h-12 text-gold-metallic" />
            </div>
          </div>
        </div>
      </div>

      {/* Portfolio Overview */}
      <div className="grid grid-cols-1 gap-6">
        {/* Investment Total Card */}
        <div>
          <div className="relative bg-black/90 rounded-2xl p-8 text-white overflow-hidden">
            {/* Grainy texture overlay */}
            <div className="absolute inset-0 opacity-30 z-10" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
              mixBlendMode: 'overlay'
            }}></div>
            
            {/* Decorative circles */}
            <div className="absolute top-4 right-4 w-32 h-32 border border-white/10 rounded-full"></div>
            <div className="absolute top-8 right-8 w-24 h-24 border border-white/10 rounded-full"></div>
            <div className="absolute -top-4 -right-4 w-16 h-16 border border-white/10 rounded-full"></div>
            
            {/* Logo */}
            <div className="absolute top-6 right-6 z-50">
              <div className="bg-white/20 px-3 py-1 rounded-lg backdrop-blur-sm">
                <span className="text-xs font-bold text-white">APE</span>
              </div>
            </div>

            {/* Card Content */}
            <div className="relative z-10 h-full flex flex-col">
              {/* Header Section */}
              <div className="mb-6">
                <h4 className="text-lg font-medium text-white/90 mb-2">Investissement Total</h4>
                <div className="text-3xl font-bold tracking-wider">
                  {totalInvestment.toLocaleString()} FCFA
                </div>
              </div>

              {/* Main Content Grid */}
              <div className="flex-1 grid grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="space-y-4">
                  <div>
                    <p className="text-white/70 text-sm mb-1">Compte N°</p>
                    <p className="text-lg font-mono tracking-wider">APE-2025-001</p>
                  </div>
                  
                  <div>
                    <p className="text-white/70 text-sm mb-1">Investissements actifs</p>
                    <p className="text-2xl font-bold">{investments.length}</p>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-4">
                  <div>
                    <p className="text-white/70 text-sm mb-1">Rendement moyen</p>
                    <p className="text-2xl font-bold text-gold-light">
                      {investments.length > 0 
                        ? (investments.reduce((sum, inv) => sum + inv.interestRate, 0) / investments.length).toFixed(2)
                        : '0.00'
                      }%
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-white/70 text-sm mb-1">Valeur projetée</p>
                    <div className="flex items-baseline gap-2">
                      <p className="text-xl font-bold">{totalProjectedValue.toLocaleString()} FCFA</p>
                      <p className="text-sm text-sama-primary-green-light font-medium">
                        (+{(totalProjectedValue - totalInvestment).toLocaleString()})
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>


      </div>

      {/* Investment Tranches */}
      <div className="bg-white rounded-2xl border border-timberwolf/20 p-8">
        <div className="mb-8">
          <h3 className="text-xl font-bold text-night mb-2">Choisissez Votre Tranche d'Investissement</h3>
          <p className="text-night/70">4 options d'investissement adaptées à vos objectifs financiers</p>
        </div>

        <div className="grid md:grid-cols-4 gap-6">
          {trancheOptions.map((option, index) => {
            const colors = [
              { bg: 'bg-green-500', text: 'text-white' }, // Emission A - Green
              { bg: 'bg-yellow-400', text: 'text-black' }, // Emission B - Yellow
              { bg: 'bg-red-600', text: 'text-white' },    // Emission C - Red
              { bg: 'bg-gray-700', text: 'text-white' }    // Emission D - Dark Gray
            ];
            const color = colors[index];
            
            return (
              <div 
                key={option.value}
                className="bg-white rounded-2xl border border-timberwolf/20 p-6 hover:shadow-lg transition-all duration-300 group"
              >
                {/* Header with colored background */}
                <div className={`${color.bg} rounded-t-2xl -m-6 mb-4 p-4 ${color.text}`}>
                  <h4 className="font-bold text-lg uppercase">Emission {option.value}</h4>
                </div>
                
                {/* Interest Rate */}
                <div className="text-center mb-6">
                  <div className="text-4xl font-bold text-night mb-2">{option.rate}%</div>
                  <div className="text-sm text-night/60">SUR {option.term} ANS</div>
                </div>
                
                {/* Nominal Value */}
                <div className="border-t border-timberwolf/20 pt-4 mb-6">
                  <div className="text-sm text-night/60 mb-1">VALEUR NOMINALE:</div>
                  <div className="font-bold text-night">10 000 FCFA*</div>
                </div>
                
                {/* Emission Amount */}
                <div className="mb-6">
                  <div className="text-sm text-night/60 mb-1">Montant de l'émission:</div>
                  <div className="font-bold text-night">
                    {option.value === 'A' && '60 milliards de FCFA'}
                    {option.value === 'B' && '100 milliards de FCFA'}
                    {option.value === 'C' && '80 milliards de FCFA'}
                    {option.value === 'D' && '60 milliards de FCFA'}
                  </div>
                </div>
                
                {/* Invest Button */}
                <button
                  onClick={() => handleTrancheClick(option.value)}
                  className="w-full bg-gold-metallic text-white py-3 px-4 rounded-lg font-semibold hover:bg-gold-dark transition-colors flex items-center justify-center space-x-2 group-hover:scale-105 transform duration-200"
                >
                  <span>J'investis</span>
                  <ArrowRightIcon className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Investment History */}
      <div className="bg-white rounded-2xl border border-timberwolf/20 p-8">
        <h3 className="text-xl font-bold text-night mb-6">Historique des investissements</h3>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-timberwolf/20">
                <th className="text-left py-3 px-2 text-sm font-semibold text-night/70">Date</th>
                <th className="text-left py-3 px-2 text-sm font-semibold text-night/70">Type</th>
                <th className="text-left py-3 px-2 text-sm font-semibold text-night/70">Tranche</th>
                <th className="text-right py-3 px-2 text-sm font-semibold text-night/70">Montant</th>
                <th className="text-right py-3 px-2 text-sm font-semibold text-night/70">Taux</th>
                <th className="text-right py-3 px-2 text-sm font-semibold text-night/70">Échéance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-timberwolf/10">
              {[
                {
                  date: '2025-09-15',
                  type: 'Investissement',
                  tranche: 'D',
                  amount: 1000000,
                  rate: 6.95,
                  maturity: '2035-08-15',
                  isInvestment: true
                },
                {
                  date: '2025-09-01',
                  type: 'Investissement',
                  tranche: 'B',
                  amount: 500000,
                  rate: 6.60,
                  maturity: '2030-09-01',
                  isInvestment: true
                },
                {
                  date: '2025-08-15',
                  type: 'Intérêts',
                  tranche: 'D',
                  amount: 17375,
                  rate: 6.95,
                  maturity: '2035-08-15',
                  isInvestment: false
                },
                {
                  date: '2025-08-01',
                  type: 'Intérêts',
                  tranche: 'B',
                  amount: 8250,
                  rate: 6.60,
                  maturity: '2030-09-01',
                  isInvestment: false
                },
                {
                  date: '2025-07-15',
                  type: 'Intérêts',
                  tranche: 'D',
                  amount: 17375,
                  rate: 6.95,
                  maturity: '2035-08-15',
                  isInvestment: false
                },
                {
                  date: '2025-07-01',
                  type: 'Intérêts',
                  tranche: 'B',
                  amount: 8250,
                  rate: 6.60,
                  maturity: '2030-09-01',
                  isInvestment: false
                }
              ].map((transaction, index) => (
                <tr key={index} className="hover:bg-timberwolf/5 transition-colors">
                  <td className="py-4 px-2 text-sm text-night">
                    {new Date(transaction.date).toLocaleDateString('fr-FR')}
                  </td>
                  <td className="py-4 px-2">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      transaction.type === 'Investissement' ? 'bg-blue-100 text-blue-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {transaction.type}
                    </span>
                  </td>
                  <td className="py-4 px-2 text-sm text-night/70">
                    Tranche {transaction.tranche}
                  </td>
                  <td className={`py-4 px-2 text-sm font-semibold text-right ${
                    transaction.isInvestment ? 'text-blue-600' : 'text-green-600'
                  }`}>
                    {transaction.isInvestment ? '+' : '+'}{transaction.amount.toLocaleString()} FCFA
                  </td>
                  <td className="py-4 px-2 text-sm font-medium text-right text-night">
                    {transaction.rate}%
                  </td>
                  <td className="py-4 px-2 text-sm font-medium text-right text-night">
                    {new Date(transaction.maturity).toLocaleDateString('fr-FR')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6 flex justify-center">
          <button className="bg-gold-metallic/10 text-gold-metallic hover:bg-gold-metallic hover:text-white border border-gold-metallic/20 py-2 px-6 rounded-lg font-medium text-sm transition-colors">
            Charger plus d'investissements
          </button>
        </div>
      </div>

      {/* Investment Modal */}
      <InvestmentModal
        isOpen={showInvestmentModal}
        onClose={() => {
          setShowInvestmentModal(false);
          setSelectedTranche(null);
        }}
        onConfirm={handleInvestmentConfirm}
        preselectedTranche={selectedTranche}
      />
    </div>
  );
}