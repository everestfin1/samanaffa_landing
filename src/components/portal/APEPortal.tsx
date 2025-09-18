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
    // Here you would handle the actual investment
  };

  const totalInvestment = investments.reduce((sum, inv) => sum + inv.amount, 0);
  const totalProjectedValue = investments.reduce((sum, inv) => sum + inv.totalValue, 0);

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-gold-light/20 to-gold-metallic/10 rounded-2xl p-8 border border-gold-metallic/20">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-night mb-2">APE Sénégal</h2>
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
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl border border-timberwolf/20 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-night/60">Investissement Total</p>
              <p className="text-2xl font-bold text-night">{totalInvestment.toLocaleString()} FCFA</p>
            </div>
            <BanknotesIcon className="w-8 h-8 text-gold-metallic" />
          </div>
          <div className="text-sm text-gold-dark">{investments.length} investissement(s) actif(s)</div>
        </div>

        <div className="bg-white rounded-xl border border-timberwolf/20 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-night/60">Valeur Projetée</p>
              <p className="text-2xl font-bold text-night">{totalProjectedValue.toLocaleString()} FCFA</p>
            </div>
            <ArrowTrendingUpIcon className="w-8 h-8 text-green-600" />
          </div>
          <div className="text-sm text-green-600">
            +{(totalProjectedValue - totalInvestment).toLocaleString()} FCFA d'intérêts
          </div>
        </div>

        <div className="bg-white rounded-xl border border-timberwolf/20 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-night/60">Rendement Moyen</p>
              <p className="text-2xl font-bold text-night">
                {investments.length > 0 
                  ? (investments.reduce((sum, inv) => sum + inv.interestRate, 0) / investments.length).toFixed(2)
                  : '0.00'
                }%
              </p>
            </div>
            <ShieldCheckIcon className="w-8 h-8 text-night" />
          </div>
          <div className="text-sm text-night/70">Garanti par l'État</div>
        </div>
      </div>

      {/* Quick Investment */}
      <div className="bg-white rounded-2xl border border-timberwolf/20 p-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-night">Effectuer un nouvel investissement</h3>
          <button 
            onClick={() => setShowInvestmentModal(true)}
            className="bg-gold-metallic text-white px-6 py-3 rounded-lg font-semibold hover:bg-gold-dark transition-colors flex items-center space-x-2"
          >
            <PlusIcon className="w-5 h-5" />
            <span>Investir maintenant</span>
          </button>
        </div>

        <div className="grid md:grid-cols-4 gap-4">
          {trancheOptions.map((option) => (
            <div 
              key={option.value}
              className="border border-timberwolf/20 rounded-lg p-4 hover:border-gold-metallic/30 transition-colors"
            >
              <div className="text-center">
                <h4 className="font-bold text-night mb-2">{option.label}</h4>
                <p className="text-sm text-night/60 mb-2">{option.description}</p>
                <div className="text-lg font-bold text-gold-metallic">{option.rate}%</div>
                <div className="text-xs text-night/50">par an</div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-start space-x-3">
            <InformationCircleIcon className="w-6 h-6 text-blue-500 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-night mb-1">Informations importantes</h4>
              <ul className="text-sm text-night/70 space-y-1">
                <li>• Investissement minimum: 10,000 FCFA</li>
                <li>• Intérêts versés semestriellement</li>
                <li>• Capital garanti par l'État du Sénégal</li>
                <li>• Possibilité de revente sur le marché secondaire</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Current Investments */}
      {investments.length > 0 && (
        <div className="bg-white rounded-2xl border border-timberwolf/20 p-8">
          <h3 className="text-xl font-bold text-night mb-6">Mes investissements APE</h3>
          <div className="space-y-4">
            {investments.map((investment) => (
              <div key={investment.id} className="border border-timberwolf/20 rounded-lg p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center space-x-3 mb-2">
                      <h4 className="font-semibold text-night">Tranche {investment.tranche}</h4>
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                        {investment.term} ans
                      </span>
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                        {investment.interestRate}%
                      </span>
                    </div>
                    <p className="text-sm text-night/60">
                      Acheté le {new Date(investment.purchaseDate).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-night">
                      {investment.amount.toLocaleString()} FCFA
                    </div>
                    <div className="text-sm text-night/60">Investi</div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-night/60">Prochain paiement</span>
                    <div className="font-semibold text-gold-metallic">
                      {new Date(investment.nextPayment).toLocaleDateString('fr-FR')}
                    </div>
                  </div>
                  <div>
                    <span className="text-night/60">Valeur à maturité</span>
                    <div className="font-semibold text-green-600">
                      {investment.totalValue.toLocaleString()} FCFA
                    </div>
                  </div>
                  <div>
                    <span className="text-night/60">Plus-value projetée</span>
                    <div className="font-semibold text-green-600">
                      +{(investment.totalValue - investment.amount).toLocaleString()} FCFA
                    </div>
                  </div>
                </div>

                <div className="mt-4">
                  <button 
                    onClick={() => setShowInvestmentModal(true)}
                    className="bg-gold-metallic text-white py-2 px-4 rounded-lg font-medium hover:bg-gold-dark transition-colors flex items-center space-x-2"
                  >
                    <ArrowDownIcon className="w-4 h-4" />
                    <span>Investir davantage</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Investment Modal */}
      <InvestmentModal
        isOpen={showInvestmentModal}
        onClose={() => setShowInvestmentModal(false)}
        onConfirm={handleInvestmentConfirm}
      />
    </div>
  );
}