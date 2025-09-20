'use client'; 

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import {
  BellIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  Cog6ToothIcon
} from '@heroicons/react/24/outline';
import PortalHeader from '../../../components/portal/PortalHeader';

type KYCStatus = 'PENDING' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED';

interface UserData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  userId: string;
  isNewUser: boolean;
  kycStatus: KYCStatus;
}

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'warning' | 'info' | 'error';
  category: 'transaction' | 'investment' | 'account' | 'system';
  timestamp: string;
  read: boolean;
  actionUrl?: string;
}

export default function NotificationsPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      if (status === 'loading') return;
      
      if (!session) {
        router.push('/login');
        return;
      }

      try {
        const profileResponse = await fetch('/api/users/profile');
        const profileData = await profileResponse.json();

        if (profileData.success) {
          setUserData({
            id: profileData.user.id,
            userId: profileData.user.id,
            firstName: profileData.user.firstName,
            lastName: profileData.user.lastName,
            email: profileData.user.email,
            phone: profileData.user.phone,
            kycStatus: profileData.user.kycStatus,
            isNewUser: profileData.user.isNewUser || false,
          });
        } else {
          setError('Erreur lors du chargement des données');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        setError('Erreur de connexion');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [session, status, router]);

  const handleLogout = () => {
    router.push('/login');
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-light flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-gold-metallic border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-night/70">Chargement des notifications...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (!userData) {
    return (
      <div className="min-h-screen bg-gray-light flex items-center justify-center">
        <div className="text-center">
          <ExclamationTriangleIcon className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-night/70 mb-4">Erreur lors du chargement des notifications</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-gold-metallic text-night px-6 py-2 rounded-lg font-medium hover:bg-gold-dark transition-colors"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-light">
      <PortalHeader
        userData={userData}
        kycStatus={userData.kycStatus}
        activeTab="notifications"
        setActiveTab={() => {}} // Not used with navigation
        onLogout={handleLogout}
      />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Header */}
          <div className="flex items-center justify-center text-center">
            <div>
              <h1 className="text-3xl font-bold text-night">Notifications</h1>
              <p className="text-night/70 mt-1">
                Système en développement - Notifications par email et SMS
              </p>
            </div>
          </div>


          {/* Development Message */}
          <div className="bg-white rounded-2xl border border-timberwolf/20 p-12 text-center">
            <div className="w-16 h-16 bg-gold-light/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <BellIcon className="w-8 h-8 text-gold-metallic" />
            </div>
            <h3 className="text-2xl font-bold text-night mb-4">Notifications en développement</h3>
            <p className="text-night/70 text-lg mb-6 max-w-2xl mx-auto leading-relaxed">
              Notre système de notifications est actuellement en cours de développement. 
              En attendant, vous recevrez toutes vos notifications importantes par <strong>email</strong> et <strong>SMS</strong>.
            </p>
            <div className="bg-gold-light/10 border border-gold-metallic/20 rounded-xl p-6 max-w-xl mx-auto">
              <h4 className="font-semibold text-night mb-3">Vous recevrez des notifications pour :</h4>
              <ul className="text-left text-night/70 space-y-2">
                <li className="flex items-center space-x-2">
                  <CheckCircleIcon className="w-5 h-5 text-gold-metallic flex-shrink-0" />
                  <span>Paiements d'intérêts APE/Emprunt Obligataire</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircleIcon className="w-5 h-5 text-gold-metallic flex-shrink-0" />
                  <span>Nouvelles tranches APE disponibles</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircleIcon className="w-5 h-5 text-gold-metallic flex-shrink-0" />
                  <span>Rappels d'échéances d'investissement</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircleIcon className="w-5 h-5 text-gold-metallic flex-shrink-0" />
                  <span>Dépôts et retraits Sama Naffa</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircleIcon className="w-5 h-5 text-gold-metallic flex-shrink-0" />
                  <span>Mises à jour importantes du système</span>
                </li>
              </ul>
            </div>
            <p className="text-sm text-night/50 mt-6">
              Le système de notifications dans l'application sera disponible prochainement.
            </p>
          </div>

          {/* Settings Card */}
          <div className="bg-white rounded-2xl border border-timberwolf/20 p-8">
            <h2 className="text-xl font-bold text-night mb-6">Préférences de notification</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-timberwolf/20 rounded-lg opacity-60">
                <div>
                  <h3 className="font-medium text-night">Notifications APE/Emprunt Obligataire</h3>
                  <p className="text-sm text-night/60">Intérêts, échéances, nouvelles tranches</p>
                </div>
                <div className="bg-timberwolf w-12 h-6 rounded-full relative">
                  <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-4 border border-timberwolf/20 rounded-lg opacity-60">
                <div>
                  <h3 className="font-medium text-night">Notifications Sama Naffa</h3>
                  <p className="text-sm text-night/60">Dépôts, retraits, transactions d'épargne</p>
                </div>
                <div className="bg-timberwolf w-12 h-6 rounded-full relative">
                  <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-4 border border-timberwolf/20 rounded-lg opacity-60">
                <div>
                  <h3 className="font-medium text-night">Notifications système</h3>
                  <p className="text-sm text-night/60">Mises à jour, maintenance, sécurité</p>
                </div>
                <div className="bg-timberwolf w-12 h-6 rounded-full relative">
                  <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                </div>
              </div>
            </div>
            <div className="mt-6 p-4 bg-gold-light/10 border border-gold-metallic/20 rounded-lg">
              <p className="text-sm text-night/70 text-center">
                <strong>Note :</strong> Les préférences de notification seront disponibles une fois le système de notifications activé.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
