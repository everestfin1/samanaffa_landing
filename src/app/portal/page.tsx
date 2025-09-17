'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
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
import PortalHeader from '../../components/portal/PortalHeader';

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

export default function PortalPage() {
  const router = useRouter();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [kycStatus, setKYCStatus] = useState<KYCStatus>('pending');
  const [showKYCFlow, setShowKYCFlow] = useState(false);
  const [currentKYCStep, setCurrentKYCStep] = useState(0);
  const [uploadedDocuments, setUploadedDocuments] = useState<{[key: string]: boolean}>({});

  // Load user data on mount
  useEffect(() => {
    const storedUserData = localStorage.getItem('userData');
    const kycRequired = localStorage.getItem('kycRequired') === 'true';
    const userSource = localStorage.getItem('userSource');

    if (storedUserData) {
      const parsedUserData = JSON.parse(storedUserData);
      setUserData(parsedUserData);
      setKYCStatus(parsedUserData.kycStatus);

      // Show KYC flow for new users or users with incomplete KYC
      if (kycRequired || parsedUserData.kycStatus !== 'approved') {
        setShowKYCFlow(true);
      } else {
        // Redirect approved users to dashboard
        router.replace('/portal/dashboard');
      }
    } else {
      // No user data found, check if user accessed portal directly
      if (!userSource) {
        // User accessed portal directly without login/register, provide fallback
        const fallbackUserData = {
          firstName: 'Amadou',
          lastName: 'Diallo',
          email: 'amadou.diallo@demo.com',
          phone: '+221 77 123 45 67',
          userId: 'USR_DEMO_001',
          isNewUser: false,
          kycStatus: 'approved' as KYCStatus
        };
        
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('userData', JSON.stringify(fallbackUserData));
        localStorage.setItem('userSource', 'direct');
        
        setUserData(fallbackUserData);
        setKYCStatus('approved');
        
        // Trigger storage event to update navigation
        window.dispatchEvent(new Event('storage'));
        router.replace('/portal/dashboard');
      } else {
        // User should have data but doesn't, redirect to login
        router.push('/login');
      }
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userData');
    localStorage.removeItem('kycRequired');
    localStorage.removeItem('userSource');
    window.dispatchEvent(new Event('storage'));
    router.push('/');
  };

  const kycSteps: KYCStep[] = [
    {
      id: 'personal_verification',
      title: 'Vérification d\'identité',
      description: 'Confirmez vos informations personnelles',
      status: currentKYCStep === 0 ? 'current' : currentKYCStep > 0 ? 'completed' : 'pending',
      required: true
    },
    {
      id: 'document_upload',
      title: 'Documents requis',
      description: 'Téléchargez vos pièces justificatives',
      status: currentKYCStep === 1 ? 'current' : currentKYCStep > 1 ? 'completed' : 'pending',
      required: true
    },
    {
      id: 'verification_review',
      title: 'Vérification en cours',
      description: 'Nos équipes examinent votre dossier',
      status: currentKYCStep === 2 ? 'current' : currentKYCStep > 2 ? 'completed' : 'pending',
      required: true
    },
    {
      id: 'account_activation',
      title: 'Activation du compte',
      description: 'Votre compte est prêt à être utilisé',
      status: currentKYCStep === 3 ? 'current' : currentKYCStep > 3 ? 'completed' : 'pending',
      required: true
    }
  ];

  const handleKYCNext = () => {
    if (currentKYCStep < kycSteps.length - 1) {
      setCurrentKYCStep(prev => prev + 1);
    } else {
      // KYC completed, update user status
      if (userData) {
        const updatedUserData = { ...userData, kycStatus: 'approved' as KYCStatus };
        setUserData(updatedUserData);
        setKYCStatus('approved');
        localStorage.setItem('userData', JSON.stringify(updatedUserData));
        localStorage.removeItem('kycRequired');
        setShowKYCFlow(false);
        router.push('/portal/dashboard');
      }
    }
  };

  const handleDocumentUpload = (docType: string) => {
    // Simulate document upload
    setUploadedDocuments(prev => ({ ...prev, [docType]: true }));
  };

  const renderKYCFlow = () => (
    <div className="min-h-screen bg-gray-light">
      <PortalHeader
        userData={userData!}
        kycStatus={kycStatus}
        activeTab="dashboard"
        setActiveTab={() => {}}
        onLogout={handleLogout}
      />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* KYC Header */}
          <div className="text-center">
            <div className="bg-gold-metallic/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShieldCheckIcon className="w-8 h-8 text-gold-metallic" />
            </div>
            <h1 className="text-3xl font-bold text-night mb-2">
              Vérification de votre identité
            </h1>
            <p className="text-night/70 text-lg">
              Bienvenue {userData?.firstName} ! Pour accéder à tous nos services, nous devons vérifier votre identité.
            </p>
          </div>

          {/* Progress Steps */}
          <div className="bg-white rounded-2xl border border-timberwolf/20 p-8">
            <div className="flex items-center justify-between mb-8">
              {kycSteps.map((step, index) => (
                <div key={step.id} className="flex flex-col items-center flex-1">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                    step.status === 'completed' ? 'bg-gold-metallic text-white' :
                    step.status === 'current' ? 'bg-gold-metallic/20 text-gold-metallic border-2 border-gold-metallic' :
                    'bg-timberwolf/30 text-night/50'
                  }`}>
                    {step.status === 'completed' ? (
                      <CheckCircleIcon className="w-6 h-6" />
                    ) : (
                      <span className="font-semibold">{index + 1}</span>
                    )}
                  </div>
                  <div className="text-center">
                    <div className={`text-sm font-medium ${
                      step.status === 'current' ? 'text-gold-metallic' : 
                      step.status === 'completed' ? 'text-night' : 'text-night/50'
                    }`}>
                      {step.title}
                    </div>
                    <div className="text-xs text-night/50 mt-1">{step.description}</div>
                  </div>
                  {index < kycSteps.length - 1 && (
                    <div className={`absolute h-0.5 w-20 mt-5 ${
                      step.status === 'completed' ? 'bg-gold-metallic' : 'bg-timberwolf/30'
                    }`} style={{ left: `${(index + 1) * 25}%`, transform: 'translateX(-50%)' }} />
                  )}
                </div>
              ))}
            </div>

            {/* Current Step Content */}
            <div className="space-y-6">
              {currentKYCStep === 0 && (
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-night">Vérifiez vos informations</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="p-4 border border-timberwolf/20 rounded-lg">
                      <label className="text-sm text-night/60">Prénom</label>
                      <div className="font-semibold text-night">{userData?.firstName}</div>
                    </div>
                    <div className="p-4 border border-timberwolf/20 rounded-lg">
                      <label className="text-sm text-night/60">Nom</label>
                      <div className="font-semibold text-night">{userData?.lastName}</div>
                    </div>
                    <div className="p-4 border border-timberwolf/20 rounded-lg">
                      <label className="text-sm text-night/60">Email</label>
                      <div className="font-semibold text-night">{userData?.email}</div>
                    </div>
                    <div className="p-4 border border-timberwolf/20 rounded-lg">
                      <label className="text-sm text-night/60">Téléphone</label>
                      <div className="font-semibold text-night">{userData?.phone}</div>
                    </div>
                  </div>
                </div>
              )}

              {currentKYCStep === 1 && (
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-night">Téléchargez vos documents</h3>
                  <div className="space-y-4">
                    {[
                      { id: 'identity', name: 'Pièce d\'identité', desc: 'CNI, passeport ou permis de conduire' },
                      { id: 'address', name: 'Justificatif de domicile', desc: 'Facture récente ou attestation' },
                      { id: 'income', name: 'Justificatif de revenus', desc: 'Bulletins de salaire ou attestation' }
                    ].map((doc) => (
                      <div key={doc.id} className="flex items-center justify-between p-4 border border-timberwolf/20 rounded-lg">
                        <div>
                          <div className="font-semibold text-night">{doc.name}</div>
                          <div className="text-sm text-night/60">{doc.desc}</div>
                        </div>
                        {uploadedDocuments[doc.id] ? (
                          <div className="flex items-center space-x-2 text-gold-metallic">
                            <CheckCircleIcon className="w-5 h-5" />
                            <span className="text-sm font-medium">Téléchargé</span>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleDocumentUpload(doc.id)}
                            className="bg-gold-metallic text-night px-4 py-2 rounded-lg font-medium hover:bg-gold-dark transition-colors"
                          >
                            Télécharger
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {currentKYCStep === 2 && (
                <div className="text-center space-y-4">
                  <ClockIcon className="w-16 h-16 text-gold-metallic mx-auto" />
                  <h3 className="text-xl font-bold text-night">Vérification en cours</h3>
                  <p className="text-night/70">
                    Nos équipes examinent vos documents. Cette étape peut prendre 24 à 48 heures.
                  </p>
                  <div className="bg-gold-light/20 rounded-lg p-4">
                    <p className="text-sm text-night/70">
                      Vous recevrez une notification par email dès que la vérification sera terminée.
                    </p>
                  </div>
                </div>
              )}

              {currentKYCStep === 3 && (
                <div className="text-center space-y-4">
                  <CheckCircleIcon className="w-16 h-16 text-gold-metallic mx-auto" />
                  <h3 className="text-xl font-bold text-night">Félicitations !</h3>
                  <p className="text-night/70">
                    Votre compte est maintenant vérifié. Vous avez accès à tous nos services.
                  </p>
                </div>
              )}

              <div className="flex justify-between pt-6">
                <button
                  onClick={() => setCurrentKYCStep(prev => Math.max(prev - 1, 0))}
                  disabled={currentKYCStep === 0}
                  className="px-6 py-2 border border-timberwolf/30 text-night rounded-lg font-medium hover:bg-timberwolf/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Précédent
                </button>
                
                <button
                  onClick={handleKYCNext}
                  disabled={currentKYCStep === 1 && Object.keys(uploadedDocuments).length < 3}
                  className="bg-gold-metallic text-night px-6 py-2 rounded-lg font-medium hover:bg-gold-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {currentKYCStep === kycSteps.length - 1 ? 'Terminer' : 'Suivant'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );

  // Show loading state while checking user data
  if (!userData) {
    return (
      <div className="min-h-screen bg-gray-light flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-gold-metallic border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-night/70">Chargement...</p>
        </div>
      </div>
    );
  }

  // Show KYC flow for new users or users with incomplete KYC
  if (showKYCFlow) {
    return renderKYCFlow();
  }

  // Redirect approved users to dashboard (this shouldn't normally be reached due to useEffect redirect)
  return (
    <div className="min-h-screen bg-gray-light flex items-center justify-center">
      <div className="text-center">
        <div className="w-8 h-8 border-4 border-gold-metallic border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-night/70">Redirection vers le tableau de bord...</p>
      </div>
    </div>
  );
}