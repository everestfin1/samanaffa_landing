'use client';

import { useState } from 'react';
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
  PencilIcon,
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  IdentificationIcon,
  BanknotesIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';
import PortalHeader from '../../../components/portal/PortalHeader';

type KYCStatus = 'pending' | 'in_progress' | 'documents_required' | 'under_review' | 'approved' | 'rejected';

interface UserData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  userId: string;
  isNewUser: boolean;
  kycStatus: KYCStatus;
}

interface KYCDocument {
  id: string;
  title: string;
  type: string;
  status: 'uploaded' | 'verified' | 'rejected' | 'pending';
  uploadDate: string;
  expiryDate?: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const [userData, setUserData] = useState<UserData>({
    firstName: 'Amadou',
    lastName: 'Diallo',
    email: 'amadou.diallo@email.com',
    phone: '+221 77 123 45 67',
    userId: 'USR_2024_001',
    isNewUser: false,
    kycStatus: 'completed'
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    firstName: userData.firstName,
    lastName: userData.lastName,
    phone: userData.phone
  });

  const [documents] = useState<KYCDocument[]>([
    {
      id: '1',
      title: 'Carte d\'identité nationale',
      type: 'CNI',
      status: 'verified',
      uploadDate: '2025-01-15',
      expiryDate: '2030-01-15'
    },
    {
      id: '2',
      title: 'Justificatif de domicile',
      type: 'Facture électricité',
      status: 'verified',
      uploadDate: '2025-01-15'
    },
    {
      id: '3',
      title: 'Justificatif de revenus',
      type: 'Bulletin de salaire',
      status: 'verified',
      uploadDate: '2025-01-15'
    },
    {
      id: '4',
      title: 'RIB bancaire',
      type: 'Relevé bancaire',
      status: 'verified',
      uploadDate: '2025-01-15'
    }
  ]);

  const handleLogout = () => {
    router.push('/login');
  };

  const handleSaveProfile = () => {
    setUserData({
      ...userData,
      firstName: editForm.firstName,
      lastName: editForm.lastName,
      phone: editForm.phone
    });
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditForm({
      firstName: userData.firstName,
      lastName: userData.lastName,
      phone: userData.phone
    });
    setIsEditing(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified':
        return <CheckCircleIcon className="w-5 h-5 text-gold-metallic" />;
      case 'pending':
        return <ClockIcon className="w-5 h-5 text-gold-dark" />;
      case 'rejected':
        return <ExclamationTriangleIcon className="w-5 h-5 text-red-500" />;
      default:
        return <DocumentTextIcon className="w-5 h-5 text-night/50" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'verified':
        return 'Vérifié';
      case 'pending':
        return 'En cours';
      case 'rejected':
        return 'Rejeté';
      default:
        return 'En attente';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified':
        return 'bg-gold-light/20 text-gold-dark';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-light">
      <PortalHeader
        userData={userData}
        kycStatus={userData.kycStatus}
        activeTab="profile"
        setActiveTab={() => {}} // Not used with navigation
        onLogout={handleLogout}
      />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Profile Header */}
          <div className="bg-white rounded-2xl border border-timberwolf/20 p-8">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-3xl font-bold text-night">Mon Profil</h1>
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center space-x-2 bg-gold-metallic text-night px-4 py-2 rounded-lg font-medium hover:bg-gold-dark transition-colors"
                >
                  <PencilIcon className="w-4 h-4" />
                  <span>Modifier</span>
                </button>
              )}
            </div>

            <div className="flex items-start space-x-6">
              {/* Avatar */}
              <div className="relative">
                <div className="w-24 h-24 bg-gradient-to-r from-gold-metallic to-gold-dark rounded-full flex items-center justify-center">
                  <span className="text-3xl font-bold text-white">
                    {userData.firstName.charAt(0)}{userData.lastName.charAt(0)}
                  </span>
                </div>
                <button className="absolute -bottom-2 -right-2 w-8 h-8 bg-white border-2 border-gold-metallic rounded-full flex items-center justify-center hover:bg-gold-light/20 transition-colors">
                  <CameraIcon className="w-4 h-4 text-gold-metallic" />
                </button>
              </div>

              {/* Profile Info */}
              <div className="flex-1 space-y-4">
                {isEditing ? (
                  <div className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-night mb-2">Prénom</label>
                        <input
                          type="text"
                          value={editForm.firstName}
                          onChange={(e) => setEditForm({...editForm, firstName: e.target.value})}
                          className="w-full px-4 py-3 border border-timberwolf/30 rounded-lg focus:ring-2 focus:ring-gold-metallic focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-night mb-2">Nom</label>
                        <input
                          type="text"
                          value={editForm.lastName}
                          onChange={(e) => setEditForm({...editForm, lastName: e.target.value})}
                          className="w-full px-4 py-3 border border-timberwolf/30 rounded-lg focus:ring-2 focus:ring-gold-metallic focus:border-transparent"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-night mb-2">Téléphone</label>
                      <input
                        type="tel"
                        value={editForm.phone}
                        onChange={(e) => setEditForm({...editForm, phone: e.target.value})}
                        className="w-full px-4 py-3 border border-timberwolf/30 rounded-lg focus:ring-2 focus:ring-gold-metallic focus:border-transparent"
                      />
                    </div>
                    <div className="flex space-x-3">
                      <button
                        onClick={handleSaveProfile}
                        className="bg-gold-metallic text-night px-6 py-2 rounded-lg font-medium hover:bg-gold-dark transition-colors"
                      >
                        Sauvegarder
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="border border-timberwolf/30 text-night px-6 py-2 rounded-lg font-medium hover:bg-timberwolf/10 transition-colors"
                      >
                        Annuler
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <UserIcon className="w-5 h-5 text-night/70" />
                      <span className="text-xl font-semibold text-night">
                        {userData.firstName} {userData.lastName}
                      </span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <EnvelopeIcon className="w-5 h-5 text-night/70" />
                      <span className="text-night/70">{userData.email}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <PhoneIcon className="w-5 h-5 text-night/70" />
                      <span className="text-night/70">{userData.phone}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <IdentificationIcon className="w-5 h-5 text-night/70" />
                      <span className="text-night/70">ID: {userData.userId}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* KYC Status */}
          <div className="bg-white rounded-2xl border border-timberwolf/20 p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-night">Statut de vérification</h2>
              <div className="flex items-center space-x-2 bg-gold-light/20 text-gold-dark px-3 py-1 rounded-full">
                <CheckCircleIcon className="w-5 h-5" />
                <span className="font-medium">Vérifié</span>
              </div>
            </div>
            <p className="text-night/70">
              Votre compte est entièrement vérifié. Vous avez accès à tous nos services.
            </p>
          </div>

          {/* Documents */}
          <div className="bg-white rounded-2xl border border-timberwolf/20 p-8">
            <h2 className="text-xl font-bold text-night mb-6">Documents KYC</h2>
            <div className="space-y-4">
              {documents.map((doc) => (
                <div key={doc.id} className="flex items-center justify-between p-4 border border-timberwolf/20 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-gold-metallic/10 rounded-lg flex items-center justify-center">
                      <DocumentTextIcon className="w-5 h-5 text-gold-metallic" />
                    </div>
                    <div>
                      <h3 className="font-medium text-night">{doc.title}</h3>
                      <p className="text-sm text-night/60">{doc.type}</p>
                      <p className="text-xs text-night/50">Téléchargé le {new Date(doc.uploadDate).toLocaleDateString('fr-FR')}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(doc.status)}`}>
                      {getStatusText(doc.status)}
                    </span>
                    {getStatusIcon(doc.status)}
                    <button className="p-2 text-night/60 hover:text-night transition-colors">
                      <EyeIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Account Settings */}
          <div className="bg-white rounded-2xl border border-timberwolf/20 p-8">
            <h2 className="text-xl font-bold text-night mb-6">Paramètres du compte</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-timberwolf/20 rounded-lg">
                <div>
                  <h3 className="font-medium text-night">Notifications par email</h3>
                  <p className="text-sm text-night/60">Recevoir les mises à jour par email</p>
                </div>
                <button className="bg-gold-metallic w-12 h-6 rounded-full relative transition-colors">
                  <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transform translate-x-6 transition-transform"></div>
                </button>
              </div>
              
              <div className="flex items-center justify-between p-4 border border-timberwolf/20 rounded-lg">
                <div>
                  <h3 className="font-medium text-night">Notifications SMS</h3>
                  <p className="text-sm text-night/60">Recevoir les alertes importantes par SMS</p>
                </div>
                <button className="bg-gold-metallic w-12 h-6 rounded-full relative transition-colors">
                  <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transform translate-x-6 transition-transform"></div>
                </button>
              </div>
              
              <div className="flex items-center justify-between p-4 border border-timberwolf/20 rounded-lg">
                <div>
                  <h3 className="font-medium text-night">Authentification à deux facteurs</h3>
                  <p className="text-sm text-night/60">Sécurité renforcée pour votre compte</p>
                </div>
                <button className="bg-timberwolf w-12 h-6 rounded-full relative transition-colors">
                  <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform"></div>
                </button>
              </div>
            </div>
          </div>

          {/* Security Actions */}
          <div className="bg-white rounded-2xl border border-timberwolf/20 p-8">
            <h2 className="text-xl font-bold text-night mb-6">Sécurité</h2>
            <div className="space-y-3">
              <button className="w-full text-left p-4 border border-timberwolf/20 rounded-lg hover:bg-timberwolf/5 transition-colors">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-night">Changer le mot de passe</span>
                  <ArrowRightIcon className="w-4 h-4 text-night/50" />
                </div>
              </button>
              
              <button className="w-full text-left p-4 border border-timberwolf/20 rounded-lg hover:bg-timberwolf/5 transition-colors">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-night">Sessions actives</span>
                  <ArrowRightIcon className="w-4 h-4 text-night/50" />
                </div>
              </button>
              
              <button className="w-full text-left p-4 border border-red-200 rounded-lg hover:bg-red-50 transition-colors text-red-600">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Supprimer le compte</span>
                  <ArrowRightIcon className="w-4 h-4" />
                </div>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
