'use client';

import { 
  ExclamationTriangleIcon, 
  ClockIcon, 
  DocumentTextIcon,
  ShieldCheckIcon,
  PhoneIcon,
  EnvelopeIcon
} from '@heroicons/react/24/outline';

type KYCStatus = 'PENDING' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED';

interface KYCVerificationMessageProps {
  kycStatus: KYCStatus;
  variant?: 'banner' | 'modal' | 'inline';
  onContactSupport?: () => void;
  onRestartRegistration?: () => void;
}

export default function KYCVerificationMessage({ 
  kycStatus, 
  variant = 'banner',
  onContactSupport,
  onRestartRegistration 
}: KYCVerificationMessageProps) {
  if (kycStatus === 'APPROVED') return null;

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
  if (!statusInfo) return null;

  const baseClasses = `bg-${statusInfo.color}-50 border border-${statusInfo.color}-200 rounded-2xl`;
  const paddingClasses = variant === 'modal' ? 'p-8' : variant === 'inline' ? 'p-4' : 'p-6';
  
  return (
    <div className={`${baseClasses} ${paddingClasses}`}>
      <div className="flex items-start space-x-4">
        <div className={`bg-${statusInfo.color}-100 p-3 rounded-full`}>
          <statusInfo.icon className={`w-6 h-6 text-${statusInfo.color}-600`} />
        </div>
        <div className="flex-1">
          <h2 className={`text-xl font-bold text-${statusInfo.color}-800 mb-2`}>
            {statusInfo.title}
          </h2>
          <p className={`text-${statusInfo.color}-700 mb-4`}>
            {statusInfo.message}
          </p>
          
          {kycStatus === 'REJECTED' && (
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={onContactSupport}
                className="bg-red-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700 transition-colors"
              >
                Contacter le support
              </button>
              <button
                onClick={onRestartRegistration}
                className="border border-red-600 text-red-600 px-4 py-2 rounded-lg font-medium hover:bg-red-50 transition-colors"
              >
                Recommencer l'inscription
              </button>
            </div>
          )}

          {/* Contact Information */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-600 mb-3">
              Besoin d'aide ? Notre équipe de support est là pour vous accompagner.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center space-x-3">
                <div className="bg-gold-metallic/10 p-2 rounded-lg">
                  <PhoneIcon className="w-4 h-4 text-gold-metallic" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-gray-800">Téléphone</h4>
                  <div className="text-xs text-gray-600">
                    <div>+221 33 822 87 00</div>
                    <div></div>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="bg-gold-metallic/10 p-2 rounded-lg">
                  <EnvelopeIcon className="w-4 h-4 text-gold-metallic" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-gray-800">Email</h4>
                  <div className="text-xs text-gray-600">contact@everestfin.com</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
