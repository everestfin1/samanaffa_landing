'use client';

import { useState } from 'react';
import {
  BanknotesIcon,
  ArrowTrendingUpIcon,
  ArrowRightIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  InformationCircleIcon,
  EyeIcon,
  EyeSlashIcon
} from '@heroicons/react/24/outline';
import TransferModal from '../modals/TransferModal';
import Image from 'next/image';

export default function SamaNaffaPortal() {
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [transferType, setTransferType] = useState<'deposit' | 'withdraw'>('deposit');
  const [selectedAccount, setSelectedAccount] = useState<string>('');
  const [showBalance, setShowBalance] = useState(false);
  
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
        </div>

        {/* Account Balance Card */}
        <div className="mb-8">
          {/* Card Design */}
          <div className="relative bg-gradient-to-br from-sama-secondary-green-dark via-sama-secondary-green to-sama-primary-green-dark rounded-2xl p-8 text-white overflow-hidden">
            {/* Grainy texture overlay */}
            <div className="absolute inset-0 opacity-80 z-10" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
              mixBlendMode: 'overlay'
            }}></div>
            
            {/* Decorative circles */}
            <div className="absolute top-4 right-4 w-32 h-32 border border-white/10 rounded-full"></div>
            <div className="absolute top-8 right-8 w-24 h-24 border border-white/10 rounded-full"></div>
            <div className="absolute -top-4 -right-4 w-16 h-16 border border-white/10 rounded-full"></div>
            
            {/* Logo */}
            <div className="absolute top-6 right-6 z-30">
                <Image 
                  src="/sama_naffa_logo.png" 
                  alt="Sama Naffa Logo" 
                  className="h-12 w-auto"
                  width={100}
                  height={100}
                  quality={100}
                />
            </div>

            {/* Card Content */}
            <div className="relative z-10">
              <div className="mb-8">
                <h4 className="text-lg font-medium text-white/90 mb-2">Solde Naffa</h4>
                <div className="flex items-center space-x-3">
                  <div className="text-2xl font-bold tracking-wider">
                    {showBalance ? `${primaryNaffa.currentAmount.toLocaleString()} FCFA` : '••••••••••••'}
                  </div>
                  <button 
                    onClick={() => setShowBalance(!showBalance)}
                    className="text-white/80 hover:text-white transition-colors"
                  >
                    {showBalance ? <EyeSlashIcon className="w-6 h-6" /> : <EyeIcon className="w-6 h-6" />}
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-white/70 text-sm mb-1">Association</p>
                  <p className="text-lg font-mono tracking-wider">{primaryNaffa.accountNumber}</p>
                </div>
                
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-white/70 text-xs">Taux d'intérêt</p>
                    <p className="text-lg font-semibold">{primaryNaffa.interestRate}% annuel</p>
                  </div>
                  <div className="text-right">
                    <p className="text-white/70 text-xs">Intérêts acquis</p>
                    <p className="text-lg font-semibold">{primaryNaffa.interestEarned.toLocaleString()} FCFA</p>
                  </div>
                </div>
              </div>
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

      {/* Transaction History */}
      <div className="bg-white rounded-2xl border border-timberwolf/20 p-8">
        <h3 className="text-xl font-bold text-night mb-6">Historique des transactions</h3>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-timberwolf/20">
                <th className="text-left py-3 px-2 text-sm font-semibold text-night/70">Date</th>
                <th className="text-left py-3 px-2 text-sm font-semibold text-night/70">Type</th>
                <th className="text-left py-3 px-2 text-sm font-semibold text-night/70">Description</th>
                <th className="text-right py-3 px-2 text-sm font-semibold text-night/70">Montant</th>
                <th className="text-right py-3 px-2 text-sm font-semibold text-night/70">Solde</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-timberwolf/10">
              {[
                {
                  date: '2025-09-15',
                  type: 'Dépôt',
                  description: 'Virement depuis compte courant',
                  amount: 200000,
                  balance: 1700000,
                  isCredit: true
                },
                {
                  date: '2025-09-10',
                  type: 'Intérêts',
                  description: 'Intérêts mensuels',
                  amount: 10625,
                  balance: 1500000,
                  isCredit: true
                },
                {
                  date: '2025-09-05',
                  type: 'Dépôt',
                  description: 'Dépôt en espèces',
                  amount: 150000,
                  balance: 1489375,
                  isCredit: true
                },
                {
                  date: '2025-08-28',
                  type: 'Retrait',
                  description: 'Retrait ATM',
                  amount: 50000,
                  balance: 1339375,
                  isCredit: false
                },
                {
                  date: '2025-08-20',
                  type: 'Dépôt',
                  description: 'Virement depuis compte courant',
                  amount: 300000,
                  balance: 1389375,
                  isCredit: true
                },
                {
                  date: '2025-08-10',
                  type: 'Intérêts',
                  description: 'Intérêts mensuels',
                  amount: 8125,
                  balance: 1089375,
                  isCredit: true
                }
              ].map((transaction, index) => (
                <tr key={index} className="hover:bg-timberwolf/5 transition-colors">
                  <td className="py-4 px-2 text-sm text-night">
                    {new Date(transaction.date).toLocaleDateString('fr-FR')}
                  </td>
                  <td className="py-4 px-2">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      transaction.type === 'Dépôt' ? 'bg-green-100 text-green-800' :
                      transaction.type === 'Retrait' ? 'bg-red-100 text-red-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {transaction.type}
                    </span>
                  </td>
                  <td className="py-4 px-2 text-sm text-night/70">
                    {transaction.description}
                  </td>
                  <td className={`py-4 px-2 text-sm font-semibold text-right ${
                    transaction.isCredit ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {transaction.isCredit ? '+' : '-'}{transaction.amount.toLocaleString()} FCFA
                  </td>
                  <td className="py-4 px-2 text-sm font-medium text-right text-night">
                    {transaction.balance.toLocaleString()} FCFA
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6 flex justify-center">
          <button className="bg-gold-metallic/10 text-gold-metallic hover:bg-gold-metallic hover:text-white border border-gold-metallic/20 py-2 px-6 rounded-lg font-medium text-sm transition-colors">
            Charger plus de transactions
          </button>
        </div>
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