'use client';

import { useState, useEffect } from 'react';
import {
  UserIcon,
  ShieldCheckIcon,
  DocumentTextIcon,
  CameraIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ClockIcon,
  EyeIcon,
  ArrowRightIcon,
  BanknotesIcon,
  ChartBarIcon,
  DevicePhoneMobileIcon,
  BuildingLibraryIcon,
  BellIcon,
  QuestionMarkCircleIcon,
  PhoneIcon,
  StarIcon
} from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';
import PortalHeader from '../../../components/portal/PortalHeader';

type KYCStatus = 'pending' | 'in_progress' | 'documents_required' | 'under_review' | 'approved' | 'rejected';

interface KYCStep {
  id: string;
  title: string;
  description: string;
  status: 'completed' | 'current' | 'pending' | 'failed';
  required: boolean;
}

interface UserData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  userId: string;
  isNewUser: boolean;
  kycStatus: KYCStatus;
}

export default function DashboardPage() {
  const router = useRouter();
  const [userData] = useState<UserData>({
    firstName: 'Amadou',
    lastName: 'Diallo',
    email: 'amadou.diallo@email.com',
    phone: '+221 77 123 45 67',
    userId: 'USR_2024_001',
    isNewUser: false,
    kycStatus: 'approved' 
  });

  const [kycSteps] = useState<KYCStep[]>([
    {
      id: 'personal_info',
      title: 'Informations personnelles',
      description: 'Nom, prénom, date de naissance, nationalité',
      status: 'completed',
      required: true
    },
    {
      id: 'identity_document',
      title: 'Pièce d\'identité',
      description: 'CNI, passeport ou permis de conduire',
      status: 'completed',
      required: true
    },
    {
      id: 'proof_of_address',
      title: 'Justificatif de domicile',
      description: 'Facture récente ou attestation de domicile',
      status: 'completed',
      required: true
    },
    {
      id: 'income_proof',
      title: 'Justificatif de revenus',
      description: 'Bulletins de salaire ou attestation d\'employeur',
      status: 'completed',
      required: true
    },
    {
      id: 'bank_account',
      title: 'Compte bancaire',
      description: 'RIB ou relevé bancaire récent',
      status: 'completed',
      required: false
    }
  ]);

  const handleLogout = () => {
    router.push('/login');
  };

  const renderApprovedDashboard = () => (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-gold-light/20 to-gold-metallic/10 rounded-2xl p-8 border border-gold-metallic/20">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-night mb-2">
              Bienvenue, {userData.firstName} !
            </h1>
            <p className="text-night/70 text-lg">
              Votre tableau de bord financier personnel
            </p>
          </div>
          <div className="hidden md:block">
            <div className="bg-gold-metallic/10 p-4 rounded-full">
              <ChartBarIcon className="w-12 h-12 text-gold-metallic" />
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
              <p className="text-2xl font-bold text-night">2 200 000 FCFA</p>
            </div>
            <BanknotesIcon className="w-8 h-8 text-gold-metallic" />
          </div>
          <div className="text-sm text-gold-dark">+12% ce mois</div>
        </div>

        <div className="bg-white rounded-xl border border-timberwolf/20 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-night/60">Investissements APE</p>
              <p className="text-2xl font-bold text-night">1 500 000 FCFA</p>
            </div>
            <BuildingLibraryIcon className="w-8 h-8 text-gold-dark" />
          </div>
          <div className="text-sm text-gold-dark">Rendement 6.85%</div>
        </div>

        <div className="bg-white rounded-xl border border-timberwolf/20 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-night/60">Objectifs actifs</p>
              <p className="text-2xl font-bold text-night">3</p>
            </div>
            <StarIcon className="w-8 h-8 text-gold-metallic" />
          </div>
          <div className="text-sm text-night/70">En bonne voie</div>
        </div>

        <div className="bg-white rounded-xl border border-timberwolf/20 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-night/60">Prochains intérêts</p>
              <p className="text-2xl font-bold text-night">51 625 FCFA</p>
            </div>
            <ClockIcon className="w-8 h-8 text-gold-dark" />
          </div>
          <div className="text-sm text-gold-dark">Dans 45 jours</div>
        </div>
      </div>

      {/* Quick Access Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <button 
          onClick={() => router.push('/portal/sama-naffa')}
          className="bg-white rounded-2xl border border-timberwolf/20 p-6 hover:shadow-lg transition-shadow text-left hover:border-gold-metallic/30"
        >
          <div className="flex items-center space-x-4 mb-4">
            <div className="bg-gold-metallic/10 p-3 rounded-xl">
              <DevicePhoneMobileIcon className="w-6 h-6 text-gold-metallic" />
            </div>
            <div>
              <h3 className="font-semibold text-night">Sama Naffa</h3>
              <p className="text-sm text-night/60">Épargne intelligente</p>
            </div>
          </div>
          <div className="text-sm text-night/70 mb-3">
            Gérez vos objectifs d'épargne, participez aux défis et créez des comptes joints.
          </div>
          <div className="flex items-center text-gold-metallic text-sm font-medium">
            <span>Accéder</span>
            <ArrowRightIcon className="w-4 h-4 ml-2" />
          </div>
        </button>

        <button 
          onClick={() => router.push('/portal/ape')}
          className="bg-white rounded-2xl border border-timberwolf/20 p-6 hover:shadow-lg transition-shadow text-left hover:border-gold-metallic/30"
        >
          <div className="flex items-center space-x-4 mb-4">
            <div className="bg-gold-dark/10 p-3 rounded-xl">
              <BuildingLibraryIcon className="w-6 h-6 text-gold-dark" />
            </div>
            <div>
              <h3 className="font-semibold text-night">APE Sénégal</h3>
              <p className="text-sm text-night/60">Obligations d'État</p>
            </div>
          </div>
          <div className="text-sm text-night/70 mb-3">
            Investissez dans les obligations souveraines avec un rendement garanti.
          </div>
          <div className="flex items-center text-gold-metallic text-sm font-medium">
            <span>Accéder</span>
            <ArrowRightIcon className="w-4 h-4 ml-2" />
          </div>
        </button>

        {/* Comparison tool removed as per simplification requirements */}
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-2xl border border-timberwolf/20 p-8">
        <h2 className="text-xl font-bold text-night mb-6">Activité récente</h2>
        <div className="space-y-4">
          <div className="flex items-center space-x-4 p-4 border border-timberwolf/20 rounded-lg">
            <div className="w-10 h-10 bg-gold-metallic/10 rounded-full flex items-center justify-center">
              <BanknotesIcon className="w-5 h-5 text-gold-metallic" />
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-night">Épargne automatique</h3>
              <p className="text-sm text-night/70">Versement de 75 000 FCFA sur votre objectif "Achat maison"</p>
            </div>
            <span className="text-sm text-night/60">Il y a 2 jours</span>
          </div>
          
          <div className="flex items-center space-x-4 p-4 border border-timberwolf/20 rounded-lg">
            <div className="w-10 h-10 bg-gold-dark/10 rounded-full flex items-center justify-center">
              <BuildingLibraryIcon className="w-5 h-5 text-gold-dark" />
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-night">Intérêts APE reçus</h3>
              <p className="text-sm text-night/70">Paiement semestriel de 34 750 FCFA</p>
            </div>
            <span className="text-sm text-night/60">Il y a 5 jours</span>
          </div>
          
          <div className="flex items-center space-x-4 p-4 border border-timberwolf/20 rounded-lg">
            <div className="w-10 h-10 bg-night/10 rounded-full flex items-center justify-center">
              <StarIcon className="w-5 h-5 text-night" />
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-night">Défi complété</h3>
              <p className="text-sm text-night/70">Félicitations ! Vous avez terminé le défi "52 semaines"</p>
            </div>
            <span className="text-sm text-night/60">Il y a 1 semaine</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-light">
      <PortalHeader
        userData={userData}
        kycStatus={userData.kycStatus}
        activeTab="dashboard"
        setActiveTab={() => {}} // Not used with navigation
        onLogout={handleLogout}
      />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderApprovedDashboard()}
      </main>
    </div>
  );
}
