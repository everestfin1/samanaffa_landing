'use client';

import { useState } from 'react';
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
  BuildingLibraryIcon
} from '@heroicons/react/24/outline';
import SamaNaffa from '../../components/SamaNaffa/SamaNaffa';
import APE from '../../components/APE/APE';
import { useRouter } from 'next/navigation';

type KYCStatus = 'pending' | 'in_progress' | 'documents_required' | 'under_review' | 'approved' | 'rejected';
type ActiveTab = 'overview' | 'sama-naffa' | 'ape' | 'kyc';

interface KYCStep {
  id: string;
  title: string;
  description: string;
  status: 'completed' | 'current' | 'pending' | 'failed';
  required: boolean;
}

export default function PortalPage() {
  const router = useRouter();
  const [kycStatus, setKYCStatus] = useState<KYCStatus>('pending');
  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');
  const [showKYCFlow, setShowKYCFlow] = useState(true);
  const [currentKYCStep, setCurrentKYCStep] = useState(0);
  const [uploadedDocuments, setUploadedDocuments] = useState<{[key: string]: boolean}>({});

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    window.dispatchEvent(new Event('storage'));
    router.push('/');
  };

  const kycSteps: KYCStep[] = [
    {
      id: 'personal_info',
      title: 'Vérification d\'identité',
      description: 'Confirmez vos informations personnelles',
      status: 'completed',
      required: true
    },
    {
      id: 'documents',
      title: 'Documents requis',
      description: 'Téléchargez vos pièces justificatives',
      status: 'current',
      required: true
    },
    {
      id: 'selfie',
      title: 'Photo de vérification',
      description: 'Prenez une photo pour vérifier votre identité',
      status: 'pending',
      required: true
    },
    {
      id: 'review',
      title: 'Examen en cours',
      description: 'Notre équipe examine vos informations',
      status: 'pending',
      required: true
    }
  ];

  const requiredDocuments = [
    {
      id: 'id_front',
      name: 'Pièce d\'identité (recto)',
      description: 'Photo claire du recto de votre CNI ou passeport',
      uploaded: uploadedDocuments.id_front || false
    },
    {
      id: 'id_back',
      name: 'Pièce d\'identité (verso)',
      description: 'Photo claire du verso de votre CNI',
      uploaded: uploadedDocuments.id_back || false
    },
    {
      id: 'address_proof',
      name: 'Justificatif de domicile',
      description: 'Facture récente (électricité, eau, téléphone) ou attestation',
      uploaded: uploadedDocuments.address_proof || false
    }
  ];

  const handleDocumentUpload = (documentId: string) => {
    // Simulate document upload
    setUploadedDocuments(prev => ({
      ...prev,
      [documentId]: true
    }));
  };

  const handleKYCNext = () => {
    if (currentKYCStep < kycSteps.length - 1) {
      setCurrentKYCStep(prev => prev + 1);
      
      // Update step statuses
      const newSteps = [...kycSteps];
      newSteps[currentKYCStep].status = 'completed';
      if (currentKYCStep + 1 < newSteps.length) {
        newSteps[currentKYCStep + 1].status = 'current';
      }
    } else {
      // Complete KYC process
      setKYCStatus('under_review');
      setShowKYCFlow(false);
      
      // Simulate review process
      setTimeout(() => {
        setKYCStatus('approved');
      }, 3000);
    }
  };

  const canProceedToNext = () => {
    const currentStep = kycSteps[currentKYCStep];
    
    switch (currentStep.id) {
      case 'documents':
        return requiredDocuments.every(doc => uploadedDocuments[doc.id]);
      case 'selfie':
        return uploadedDocuments.selfie || false;
      default:
        return true;
    }
  };

  const renderKYCStatus = () => {
    const statusConfig = {
      pending: { icon: ClockIcon, color: 'text-yellow-600', bg: 'bg-yellow-50', text: 'Vérification en attente' },
      in_progress: { icon: ClockIcon, color: 'text-blue-600', bg: 'bg-blue-50', text: 'Vérification en cours' },
      documents_required: { icon: DocumentTextIcon, color: 'text-orange-600', bg: 'bg-orange-50', text: 'Documents requis' },
      under_review: { icon: EyeIcon, color: 'text-blue-600', bg: 'bg-blue-50', text: 'Examen en cours' },
      approved: { icon: CheckCircleIcon, color: 'text-green-600', bg: 'bg-green-50', text: 'Compte vérifié' },
      rejected: { icon: ExclamationTriangleIcon, color: 'text-red-600', bg: 'bg-red-50', text: 'Vérification échouée' }
    };

    const config = statusConfig[kycStatus];
    const IconComponent = config.icon;

    return (
      <div className={`${config.bg} border border-opacity-20 rounded-lg p-4 mb-6`}>
        <div className="flex items-center space-x-3">
          <IconComponent className={`w-6 h-6 ${config.color}`} />
          <div>
            <h3 className={`font-semibold ${config.color}`}>Statut KYC: {config.text}</h3>
            {kycStatus === 'approved' ? (
              <p className="text-sm text-green-700">Votre compte est maintenant entièrement activé !</p>
            ) : kycStatus === 'under_review' ? (
              <p className="text-sm text-blue-700">Nous examinons vos documents. Cela peut prendre 24-48h.</p>
            ) : (
              <p className="text-sm text-gray-600">Complétez la vérification pour accéder à tous nos services.</p>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderKYCFlow = () => {
    if (!showKYCFlow || kycStatus === 'approved') return null;

    const currentStep = kycSteps[currentKYCStep];

    return (
      <div className="bg-white rounded-xl border border-timberwolf/20 p-6 mb-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-night mb-2">Vérification KYC</h2>
          <p className="text-night/70">Complétez ces étapes pour activer votre compte</p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {kycSteps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 text-sm font-medium ${
                  step.status === 'completed' 
                    ? 'bg-green-500 border-green-500 text-white'
                    : step.status === 'current'
                      ? 'border-gold-metallic text-gold-metallic bg-white'
                      : 'border-timberwolf/40 text-timberwolf/40 bg-white'
                }`}>
                  {step.status === 'completed' ? (
                    <CheckCircleIcon className="w-5 h-5" />
                  ) : (
                    index + 1
                  )}
                </div>
                {index < kycSteps.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-3 ${
                    step.status === 'completed' ? 'bg-green-500' : 'bg-timberwolf/20'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Current Step Content */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-night mb-2">{currentStep.title}</h3>
          <p className="text-night/70 mb-4">{currentStep.description}</p>

          {currentStep.id === 'documents' && (
            <div className="space-y-4">
              {requiredDocuments.map((doc) => (
                <div key={doc.id} className="border border-timberwolf/20 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium text-night">{doc.name}</h4>
                      <p className="text-sm text-night/60">{doc.description}</p>
                    </div>
                    {doc.uploaded ? (
                      <div className="flex items-center space-x-2 text-green-600">
                        <CheckCircleIcon className="w-5 h-5" />
                        <span className="text-sm font-medium">Téléchargé</span>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleDocumentUpload(doc.id)}
                        className="bg-gold-metallic text-night px-4 py-2 rounded-lg text-sm font-medium hover:bg-gold-metallic/90 transition-colors"
                      >
                        Télécharger
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {currentStep.id === 'selfie' && (
            <div className="text-center py-8">
              <div className="bg-timberwolf/10 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-4">
                <CameraIcon className="w-12 h-12 text-timberwolf/60" />
              </div>
              <p className="text-night/70 mb-4">Prenez une photo de vous-même en tenant votre pièce d'identité</p>
              <button
                onClick={() => handleDocumentUpload('selfie')}
                className="bg-gold-metallic text-night px-6 py-3 rounded-lg font-medium hover:bg-gold-metallic/90 transition-colors"
              >
                Prendre une photo
              </button>
            </div>
          )}

          {currentStep.id === 'review' && (
            <div className="text-center py-8">
              <div className="bg-blue-50 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-4">
                <EyeIcon className="w-12 h-12 text-blue-500" />
              </div>
              <p className="text-night/70">Nos équipes examinent vos documents. Vous recevrez une notification une fois la vérification terminée.</p>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex justify-end">
          <button
            onClick={handleKYCNext}
            disabled={!canProceedToNext()}
            className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-colors ${
              canProceedToNext()
                ? 'bg-gold-metallic text-night hover:bg-gold-metallic/90'
                : 'bg-timberwolf/30 text-timberwolf/60 cursor-not-allowed'
            }`}
          >
            <span>{currentKYCStep === kycSteps.length - 1 ? 'Terminer' : 'Continuer'}</span>
            <ArrowRightIcon className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  };

  const renderOverview = () => {
    if (kycStatus !== 'approved') return null;

    return (
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-gold-metallic/10 to-timberwolf/10 rounded-xl p-6">
          <h2 className="text-2xl font-bold text-night mb-2">Bienvenue dans votre portail</h2>
          <p className="text-night/70">Gérez vos comptes et investissements en toute simplicité</p>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl border border-timberwolf/20 p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="bg-gold-metallic/10 p-3 rounded-lg">
                <BanknotesIcon className="w-6 h-6 text-gold-metallic" />
              </div>
              <div>
                <h3 className="font-semibold text-night">Sama Naffa</h3>
                <p className="text-sm text-night/60">Compte d'épargne</p>
              </div>
            </div>
            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span className="text-night/70">Solde actuel:</span>
                <span className="font-semibold text-night">1 200 000 FCFA</span>
              </div>
              <div className="flex justify-between">
                <span className="text-night/70">Objectif:</span>
                <span className="text-night/70">5 000 000 FCFA</span>
              </div>
            </div>
            <button 
              onClick={() => setActiveTab('sama-naffa')}
              className="w-full bg-gold-metallic text-night py-2 rounded-lg font-medium hover:bg-gold-metallic/90 transition-colors"
            >
              Gérer l'épargne
            </button>
          </div>

          <div className="bg-white rounded-xl border border-timberwolf/20 p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="bg-gold-metallic/10 p-3 rounded-lg">
                <ChartBarIcon className="w-6 h-6 text-gold-metallic" />
              </div>
              <div>
                <h3 className="font-semibold text-night">APE Sénégal</h3>
                <p className="text-sm text-night/60">Investissements</p>
              </div>
            </div>
            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span className="text-night/70">Portefeuille:</span>
                <span className="font-semibold text-night">850 000 FCFA</span>
              </div>
              <div className="flex justify-between">
                <span className="text-night/70">Rendement:</span>
                <span className="text-green-600 font-medium">+8.2%</span>
              </div>
            </div>
            <button 
              onClick={() => setActiveTab('ape')}
              className="w-full bg-gold-metallic text-night py-2 rounded-lg font-medium hover:bg-gold-metallic/90 transition-colors"
            >
              Voir investissements
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'sama-naffa':
        return <SamaNaffa />;
      case 'ape':
        return <APE />;
      case 'kyc':
        return renderKYCFlow();
      default:
        return renderOverview();
    }
  };

  return (
    <div className="min-h-screen bg-white-smoke">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Portal Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-night mb-2">Mon Portail</h1>
              <p className="text-night/70">Gérez vos services financiers</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <UserIcon className="w-6 h-6 text-night/60" />
                <span className="text-night/70">Client</span>
              </div>
              <button
                onClick={handleLogout}
                className="text-night/70 hover:text-night transition-colors text-sm font-medium"
              >
                Se déconnecter
              </button>
            </div>
          </div>
        </div>

        {/* KYC Status */}
        {renderKYCStatus()}

        {/* Navigation Tabs */}
        {kycStatus === 'approved' && (
          <div className="mb-8">
            <div className="flex space-x-1 bg-timberwolf/20 rounded-lg p-1">
              <button
                onClick={() => setActiveTab('overview')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  activeTab === 'overview'
                    ? 'bg-white text-night shadow-sm'
                    : 'text-night/70 hover:text-night hover:bg-white/50'
                }`}
              >
                Vue d'ensemble
              </button>
              <button
                onClick={() => setActiveTab('sama-naffa')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  activeTab === 'sama-naffa'
                    ? 'bg-white text-night shadow-sm'
                    : 'text-night/70 hover:text-night hover:bg-white/50'
                }`}
              >
                <DevicePhoneMobileIcon className="w-4 h-4" />
                <span>Sama Naffa</span>
              </button>
              <button
                onClick={() => setActiveTab('ape')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  activeTab === 'ape'
                    ? 'bg-white text-night shadow-sm'
                    : 'text-night/70 hover:text-night hover:bg-white/50'
                }`}
              >
                <BuildingLibraryIcon className="w-4 h-4" />
                <span>APE Sénégal</span>
              </button>
            </div>
          </div>
        )}

        {/* Tab Content */}
        {renderTabContent()}
      </div>
    </div>
  );
}
