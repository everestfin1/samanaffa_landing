'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
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
  ArrowRightIcon,
  CloudArrowUpIcon
} from '@heroicons/react/24/outline';
import PortalHeader from '../../../components/portal/PortalHeader';

type KYCStatus = 'PENDING' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED';

interface UserData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth?: string;
  nationality?: string;
  address?: string;
  city?: string;
  preferredLanguage?: string;
  emailVerified: boolean;
  phoneVerified: boolean;
  kycStatus: KYCStatus;
  createdAt: string;
  accounts: Array<{
    id: string;
    accountType: string;
    accountNumber: string;
    balance: number;
    status: string;
  }>;
  kycDocuments: Array<{
    id: string;
    documentType: string;
    fileUrl: string;
    fileName: string;
    uploadDate: string;
    verificationStatus: string;
    adminNotes?: string;
  }>;
}

interface KYCDocument {
  id: string;
  documentType: string;
  fileUrl: string;
  fileName: string;
  uploadDate: string;
  verificationStatus: 'pending' | 'verified' | 'rejected';
  adminNotes?: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editForm, setEditForm] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    address: '',
    city: '',
    preferredLanguage: 'fr'
  });
  const [uploadingFile, setUploadingFile] = useState(false);

  // Fetch user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      if (status === 'loading') return;
      
      if (!session) {
        router.push('/login');
        return;
      }

      try {
        const response = await fetch('/api/users/profile');
        const data = await response.json();

        if (data.success) {
          setUserData(data.user);
          setEditForm({
            firstName: data.user.firstName,
            lastName: data.user.lastName,
            phone: data.user.phone,
            address: data.user.address || '',
            city: data.user.city || '',
            preferredLanguage: data.user.preferredLanguage || 'fr'
          });
        } else {
          setError('Erreur lors du chargement des données');
        }
      } catch (error) {
        setError('Erreur de connexion');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [session, status, router]);

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/login' });
  };

  const handleSaveProfile = async () => {
    setIsSaving(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('/api/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editForm),
      });

      const data = await response.json();

      if (data.success) {
        setUserData(prev => prev ? { ...prev, ...data.user } : null);
        setSuccess('Profil mis à jour avec succès');
        setIsEditing(false);
      } else {
        setError(data.error || 'Erreur lors de la mise à jour');
      }
    } catch (error) {
      setError('Erreur de connexion');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelEdit = () => {
    if (userData) {
      setEditForm({
        firstName: userData.firstName,
        lastName: userData.lastName,
        phone: userData.phone,
        address: userData.address || '',
        city: userData.city || '',
        preferredLanguage: userData.preferredLanguage || 'fr'
      });
    }
    setIsEditing(false);
  };

  const handleFileUpload = async (file: File, documentType: string) => {
    setUploadingFile(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('documentType', documentType);

      const response = await fetch('/api/kyc/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        setSuccess('Document téléchargé avec succès');
        // Refresh user data to get updated documents
        const profileResponse = await fetch('/api/users/profile');
        const profileData = await profileResponse.json();
        if (profileData.success) {
          setUserData(profileData.user);
        }
      } else {
        setError(data.error || 'Erreur lors du téléchargement');
      }
    } catch (error) {
      setError('Erreur de connexion');
    } finally {
      setUploadingFile(false);
    }
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

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-light flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-gold-metallic border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-night/70">Chargement de votre profil...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (!userData) {
    return (
      <div className="min-h-screen bg-gray-light flex items-center justify-center">
        <div className="text-center">
          <ExclamationTriangleIcon className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-night/70 mb-4">Erreur lors du chargement de votre profil</p>
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
        userData={{
          firstName: userData.firstName,
          lastName: userData.lastName,
          email: userData.email,
          phone: userData.phone,
          userId: userData.id,
          isNewUser: false,
          kycStatus: userData.kycStatus as KYCStatus
        }}
        kycStatus={userData.kycStatus}
        activeTab="profile"
        setActiveTab={() => {}} // Not used with navigation
        onLogout={handleLogout}
      />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Error/Success Messages */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-2">
              <ExclamationTriangleIcon className="w-5 h-5 text-red-500" />
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}

          {success && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center space-x-2">
              <CheckCircleIcon className="w-5 h-5 text-green-500" />
              <p className="text-green-800 text-sm">{success}</p>
            </div>
          )}

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
                    <div>
                      <label className="block text-sm font-medium text-night mb-2">Adresse</label>
                      <textarea
                        value={editForm.address}
                        onChange={(e) => setEditForm({...editForm, address: e.target.value})}
                        rows={3}
                        className="w-full px-4 py-3 border border-timberwolf/30 rounded-lg focus:ring-2 focus:ring-gold-metallic focus:border-transparent resize-none"
                      />
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-night mb-2">Ville</label>
                        <input
                          type="text"
                          value={editForm.city}
                          onChange={(e) => setEditForm({...editForm, city: e.target.value})}
                          className="w-full px-4 py-3 border border-timberwolf/30 rounded-lg focus:ring-2 focus:ring-gold-metallic focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-night mb-2">Langue préférée</label>
                        <select
                          value={editForm.preferredLanguage}
                          onChange={(e) => setEditForm({...editForm, preferredLanguage: e.target.value})}
                          className="w-full px-4 py-3 border border-timberwolf/30 rounded-lg focus:ring-2 focus:ring-gold-metallic focus:border-transparent"
                        >
                          <option value="fr">Français</option>
                          <option value="en">English</option>
                        </select>
                      </div>
                    </div>
                    <div className="flex space-x-3">
                      <button
                        onClick={handleSaveProfile}
                        disabled={isSaving}
                        className={`flex items-center space-x-2 px-6 py-2 rounded-lg font-medium transition-colors ${
                          isSaving
                            ? 'bg-timberwolf/50 text-night/50 cursor-not-allowed'
                            : 'bg-gold-metallic text-night hover:bg-gold-dark'
                        }`}
                      >
                        {isSaving && <div className="w-4 h-4 border-2 border-night/30 border-t-night rounded-full animate-spin" />}
                        <span>{isSaving ? 'Sauvegarde...' : 'Sauvegarder'}</span>
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        disabled={isSaving}
                        className="border border-timberwolf/30 text-night px-6 py-2 rounded-lg font-medium hover:bg-timberwolf/10 transition-colors disabled:opacity-50"
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
                      {userData.emailVerified && (
                        <CheckCircleIcon className="w-4 h-4 text-green-500" />
                      )}
                    </div>
                    <div className="flex items-center space-x-3">
                      <PhoneIcon className="w-5 h-5 text-night/70" />
                      <span className="text-night/70">{userData.phone}</span>
                      {userData.phoneVerified && (
                        <CheckCircleIcon className="w-4 h-4 text-green-500" />
                      )}
                    </div>
                    <div className="flex items-center space-x-3">
                      <MapPinIcon className="w-5 h-5 text-night/70" />
                      <span className="text-night/70">{userData.address || 'Non renseignée'}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <IdentificationIcon className="w-5 h-5 text-night/70" />
                      <span className="text-night/70">ID: {userData.id}</span>
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
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-night">Documents KYC</h2>
              <button
                onClick={() => document.getElementById('file-upload')?.click()}
                disabled={uploadingFile}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  uploadingFile
                    ? 'bg-timberwolf/50 text-night/50 cursor-not-allowed'
                    : 'bg-gold-metallic text-night hover:bg-gold-dark'
                }`}
              >
                {uploadingFile ? (
                  <div className="w-4 h-4 border-2 border-night/30 border-t-night rounded-full animate-spin" />
                ) : (
                  <CloudArrowUpIcon className="w-4 h-4" />
                )}
                <span>{uploadingFile ? 'Téléchargement...' : 'Télécharger'}</span>
              </button>
              <input
                id="file-upload"
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    handleFileUpload(file, 'identity_document');
                  }
                }}
                className="hidden"
              />
            </div>
            <div className="space-y-4">
              {userData.kycDocuments && userData.kycDocuments.length > 0 ? (
                userData.kycDocuments.map((doc) => (
                  <div key={doc.id} className="flex items-center justify-between p-4 border border-timberwolf/20 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-gold-metallic/10 rounded-lg flex items-center justify-center">
                        <DocumentTextIcon className="w-5 h-5 text-gold-metallic" />
                      </div>
                      <div>
                        <h3 className="font-medium text-night">{doc.documentType}</h3>
                        <p className="text-sm text-night/60">{doc.fileName}</p>
                        <p className="text-xs text-night/50">Téléchargé le {new Date(doc.uploadDate).toLocaleDateString('fr-FR')}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(doc.verificationStatus)}`}>
                        {getStatusText(doc.verificationStatus)}
                      </span>
                      {getStatusIcon(doc.verificationStatus)}
                      <a
                        href={doc.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 text-night/60 hover:text-night transition-colors"
                      >
                        <EyeIcon className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-night/60">
                  <DocumentTextIcon className="w-12 h-12 mx-auto mb-4 text-night/30" />
                  <p>Aucun document téléchargé</p>
                  <p className="text-sm">Téléchargez vos documents d'identité pour compléter votre profil</p>
                </div>
              )}
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
