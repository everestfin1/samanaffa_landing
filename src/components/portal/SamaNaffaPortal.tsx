'use client';

import { useState } from 'react';
import {
  BanknotesIcon,
  ArrowTrendingUpIcon,
  ArrowRightIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';
import TransferModal from '../modals/TransferModal';

export default function SamaNaffaPortal() {
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [transferType, setTransferType] = useState<'deposit' | 'withdraw'>('deposit');
  const [selectedAccount, setSelectedAccount] = useState<string>('');
  
  // Simplified: Only primary Naffa (savings account)
  const [primaryNaffa] = useState({
    id: 'primary',
    title: 'Mon Compte Naffa Principal',
    currentAmount: 1700000,
    interestEarned: 125000,
    interestRate: 7.5,
    lastDeposit: '2025-09-15',
    accountNumber: 'NF-2025-001'
  });

  const handleTransferConfirm = (data: { amount: number; method: string; note?: string }) => {
    console.log('Transfer data:', data);
    setShowTransferModal(false);
    // Here you would handle the actual transaction
  };

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-gold-light/20 to-gold-metallic/10 rounded-2xl p-8 border border-gold-metallic/20">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-night mb-2">Sama Naffa</h2>
            <p className="text-night/70 text-lg">Votre compte d'épargne principal</p>
          </div>
          <div className="hidden md:block">
            <div className="bg-gold-metallic/10 p-4 rounded-full">
              <BanknotesIcon className="w-12 h-12 text-gold-metallic" />
            </div>
          </div>
        </div>
      </div>

      {/* Primary Naffa Account */}
      <div className="bg-white rounded-2xl border border-timberwolf/20 p-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-night">{primaryNaffa.title}</h3>
          <span className="text-sm text-night/60">Compte N°: {primaryNaffa.accountNumber}</span>
        </div>

        {/* Account Balance */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div className="bg-gradient-to-r from-gold-metallic/10 to-gold-light/10 rounded-2xl p-6 border border-gold-metallic/20">
            <div className="flex items-center space-x-3 mb-4">
              <BanknotesIcon className="w-8 h-8 text-gold-metallic" />
              <div>
                <h4 className="text-lg font-semibold text-night">Solde Principal</h4>
                <p className="text-sm text-night/60">Montant total épargné</p>
              </div>
            </div>
            <div className="text-3xl font-bold text-night mb-2">
              {primaryNaffa.currentAmount.toLocaleString()} FCFA
            </div>
            <div className="text-sm text-night/60">
              Dernier dépôt: {new Date(primaryNaffa.lastDeposit).toLocaleDateString('fr-FR')}
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-50 to-green-100/50 rounded-2xl p-6 border border-green-200/50">
            <div className="flex items-center space-x-3 mb-4">
              <ArrowTrendingUpIcon className="w-8 h-8 text-green-600" />
              <div>
                <h4 className="text-lg font-semibold text-night">Intérêts Acquis</h4>
                <p className="text-sm text-night/60">Taux: {primaryNaffa.interestRate}% annuel</p>
              </div>
            </div>
            <div className="text-3xl font-bold text-green-600 mb-2">
              {primaryNaffa.interestEarned.toLocaleString()} FCFA
            </div>
            <div className="text-sm text-night/60">
              Intérêts cumulés depuis l'ouverture
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex space-x-4">
          <button 
            onClick={() => {setTransferType('deposit'); setSelectedAccount(primaryNaffa.id); setShowTransferModal(true);}}
            className="flex-1 bg-gold-metallic text-white py-4 px-6 rounded-xl font-semibold hover:bg-gold-dark transition-colors flex items-center justify-center space-x-2"
          >
            <ArrowDownIcon className="w-5 h-5" />
            <span>Effectuer un dépôt</span>
          </button>
          <button 
            onClick={() => {setTransferType('withdraw'); setSelectedAccount(primaryNaffa.id); setShowTransferModal(true);}}
            className="flex-1 border-2 border-gold-metallic text-gold-metallic py-4 px-6 rounded-xl font-semibold hover:bg-gold-metallic/5 transition-colors flex items-center justify-center space-x-2"
          >
            <ArrowUpIcon className="w-5 h-5" />
            <span>Effectuer un retrait</span>
          </button>
        </div>
      </div>

      {/* Create New Naffa */}
      <div className="bg-white rounded-2xl border border-timberwolf/20 p-8">
        <h3 className="text-xl font-bold text-night mb-6">Ouvrir un nouveau compte Naffa</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-night mb-2">Nom du compte</label>
            <input 
              type="text" 
              placeholder="Ex: Épargne voyage"
              className="w-full px-4 py-3 border border-timberwolf/30 rounded-lg focus:ring-2 focus:ring-gold-metallic focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-night mb-2">Dépôt initial (FCFA)</label>
            <input 
              type="number" 
              placeholder="50000"
              min="10000"
              className="w-full px-4 py-3 border border-timberwolf/30 rounded-lg focus:ring-2 focus:ring-gold-metallic focus:border-transparent"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-night mb-2">Objectif (optionnel)</label>
            <input 
              type="text" 
              placeholder="Décrire l'objectif de ce compte..."
              className="w-full px-4 py-3 border border-timberwolf/30 rounded-lg focus:ring-2 focus:ring-gold-metallic focus:border-transparent"
            />
          </div>
        </div>
        
        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-start space-x-3">
            <InformationCircleIcon className="w-6 h-6 text-blue-500 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-night mb-1">Information importante</h4>
              <p className="text-sm text-night/70">
                • Taux d'intérêt: {primaryNaffa.interestRate}% annuel<br/>
                • Dépôt minimum: 10,000 FCFA<br/>
                • Aucuns frais de tenue de compte<br/>
                • Accès 24h/24 à vos fonds
              </p>
            </div>
          </div>
        </div>

        <button className="w-full bg-gold-metallic text-white py-3 px-6 rounded-lg font-semibold hover:bg-gold-dark transition-colors mt-6">
          Ouvrir le compte
        </button>
      </div>
      
      {/* Transfer Modal */}
      <TransferModal
        isOpen={showTransferModal}
        onClose={() => setShowTransferModal(false)}
        type={transferType}
        accountName={primaryNaffa.title}
        onConfirm={handleTransferConfirm}
      />
    </div>
  );
}