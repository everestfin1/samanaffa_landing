'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  ClockIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  DocumentTextIcon,
  CameraIcon,
  ShieldCheckIcon,
  ArrowRightIcon,
  PhoneIcon,
  EnvelopeIcon
} from '@heroicons/react/24/outline';

type KYCStatus = 'PENDING' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED';

interface KYCStatusHandlerProps {
  kycStatus: KYCStatus;
  userData: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  onLogout: () => void;
}

interface KYCStep {
  id: string;
  title: string;
  description: string;
  status: 'completed' | 'current' | 'pending';
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

export default function KYCStatusHandler({ kycStatus, userData, onLogout }: KYCStatusHandlerProps) {
  const router = useRouter();
  const [kycSteps, setKycSteps] = useState<KYCStep[]>([]);

  useEffect(() => {
    const steps: KYCStep[] = [
      {
        id: 'registration',
        title: 'Inscription terminée',
        description: 'Votre compte a été créé avec succès',
        status: 'completed',
        icon: CheckCircleIcon
      },
      {
        id: 'documents',
        title: 'Documents téléchargés',
        description: 'Vos documents d\'identité ont été soumis',
        status: kycStatus === 'PENDING' ? 'completed' : 'completed',
        icon: DocumentTextIcon
      },
      {
        id: 'verification',
        title: 'Vérification en cours',
        description: 'Nos équipes vérifient vos documents',
        status: kycStatus === 'UNDER_REVIEW' ? 'current' : 
                kycStatus === 'APPROVED' ? 'completed' : 'pending',
        icon: ShieldCheckIcon
      },
      {
        id: 'approval',
        title: 'Validation finale',
        description: 'Accès complet à votre portail',
        status: kycStatus === 'APPROVED' ? 'completed' : 'pending',
        icon: CheckCircleIcon
      }
    ];

    setKycSteps(steps);
  }, [kycStatus]);

  const getStatusInfo = () => {
    switch (kycStatus) {
      case 'PENDING':
        return {
          title: 'Vérification en attente',
          message: 'Vos documents sont en cours de traitement par nos équipes.',
          color: 'yellow',
          icon: ClockIcon
        };
      case 'UNDER_REVIEW':
        return {
          title: 'Vérification en cours',
          message: 'Nos experts examinent vos documents. Vous serez notifié dès que possible.',
          color: 'blue',
          icon: DocumentTextIcon
        };
      case 'REJECTED':
        return {
          title: 'Documents rejetés',
          message: 'Vos documents n\'ont pas été acceptés. Veuillez contacter le support.',
          color: 'red',
          icon: ExclamationTriangleIcon
        };
      default:
        return null;
    }
  };

  const statusInfo = getStatusInfo();

  if (kycStatus === 'APPROVED') {
    return null; // Don't render anything for approved users
  }

  return (
    <div className="min-h-screen bg-gray-light">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-night">Vérification d'identité</h1>
              <p className="text-night/70">Bienvenue {userData.firstName} !</p>
            </div>
            <button
              onClick={onLogout}
              className="text-night/60 hover:text-night transition-colors"
            >
              Se déconnecter
            </button>
          </div>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Status Card */}
        {statusInfo && (
          <div className={`bg-${statusInfo.color}-50 border border-${statusInfo.color}-200 rounded-2xl p-8 mb-8`}>
            <div className="flex items-start space-x-4">
              <div className={`bg-${statusInfo.color}-100 p-3 rounded-full`}>
                <statusInfo.icon className={`w-8 h-8 text-${statusInfo.color}-600`} />
              </div>
              <div className="flex-1">
                <h2 className={`text-2xl font-bold text-${statusInfo.color}-800 mb-2`}>
                  {statusInfo.title}
                </h2>
                <p className={`text-${statusInfo.color}-700 text-lg mb-4`}>
                  {statusInfo.message}
                </p>
                {kycStatus === 'REJECTED' && (
                  <div className="flex space-x-4">
                    <button
                      onClick={() => router.push('/contact')}
                      className="bg-red-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-red-700 transition-colors"
                    >
                      Contacter le support
                    </button>
                    <button
                      onClick={() => router.push('/register')}
                      className="border border-red-600 text-red-600 px-6 py-3 rounded-lg font-medium hover:bg-red-50 transition-colors"
                    >
                      Recommencer l'inscription
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Progress Steps */}
        <div className="bg-white rounded-2xl border border-timberwolf/20 p-8 mb-8">
          <h3 className="text-xl font-bold text-night mb-6">Étapes de vérification</h3>
          <div className="space-y-6">
            {kycSteps.map((step, index) => {
              const IconComponent = step.icon;
              return (
                <div key={step.id} className="flex items-center space-x-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    step.status === 'completed' ? 'bg-green-100 text-green-600' :
                    step.status === 'current' ? 'bg-blue-100 text-blue-600' :
                    'bg-gray-100 text-gray-400'
                  }`}>
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h4 className={`font-semibold ${
                      step.status === 'completed' ? 'text-green-800' :
                      step.status === 'current' ? 'text-blue-800' :
                      'text-gray-500'
                    }`}>
                      {step.title}
                    </h4>
                    <p className={`text-sm ${
                      step.status === 'completed' ? 'text-green-600' :
                      step.status === 'current' ? 'text-blue-600' :
                      'text-gray-400'
                    }`}>
                      {step.description}
                    </p>
                  </div>
                  {index < kycSteps.length - 1 && (
                    <div className={`w-px h-8 ${
                      step.status === 'completed' ? 'bg-green-200' : 'bg-gray-200'
                    }`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-gradient-to-r from-gold-light/10 to-gold-metallic/5 rounded-2xl border border-gold-metallic/20 p-8">
          <h3 className="text-xl font-bold text-night mb-4">Besoin d'aide ?</h3>
          <p className="text-night/70 mb-6">
            Notre équipe de support est là pour vous accompagner dans le processus de vérification.
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex items-center space-x-4">
              <div className="bg-gold-metallic/10 p-3 rounded-lg">
                <PhoneIcon className="w-6 h-6 text-gold-metallic" />
              </div>
              <div>
                <h4 className="font-semibold text-night">Téléphone</h4>

               <div className="flex justify-between gap-4 items-end">
                <span className="text-sm">+221 33 822 87 00</span>
                <span className="text-sm">ou</span>
                <span className="text-sm"></span>
              </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-gold-metallic/10 p-3 rounded-lg">
                <EnvelopeIcon className="w-6 h-6 text-gold-metallic" />
              </div>
              <div>
                <h4 className="font-semibold text-night">Email</h4>
                <span className="text-sm text-night/70">contact@everestfin.com</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
