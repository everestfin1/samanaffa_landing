'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { useUserProfile, useUpdateUserProfile, useInvalidateUserProfile } from '../../../hooks/useUserProfile';
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
  CalendarDaysIcon,
} from '@heroicons/react/24/outline';
import PortalHeader from '../../../components/portal/PortalHeader';
import KYCInitiationModal from '../../../components/portal/KYCInitiationModal';
import { meetsVerifiedIdentityRequirements } from '@/lib/portal-profile-completion';

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

function formatDateOfBirth(value?: string | null): string | null {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export default function ProfilePage() {
  const router = useRouter();
  const { data: session, status } = useSession();

  // Use Tanstack Query hooks
  const { data: userData, isLoading, error: profileError } = useUserProfile();
  const updateProfileMutation = useUpdateUserProfile();
  const invalidateUserProfile = useInvalidateUserProfile();

  const [isEditing, setIsEditing] = useState(false);
  const [success, setSuccess] = useState('');
  const [editForm, setEditForm] = useState({
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    country: '',
    preferredLanguage: 'fr',
  });
  const [showKycModal, setShowKycModal] = useState(false);

  const error = profileError?.message || updateProfileMutation.error?.message || '';
  const identityVerified = userData
    ? meetsVerifiedIdentityRequirements({
        kycStatus: userData.kycStatus,
        lastName: userData.lastName,
        dateOfBirth: userData.dateOfBirth,
      })
    : false;

  // Initialize edit form when user data is loaded
  React.useEffect(() => {
    if (userData) {
      setEditForm({
        firstName: userData.firstName,
        lastName: userData.lastName,
        address: userData.address || '',
        city: userData.city || '',
        country: userData.country || 'Sénégal',
        preferredLanguage: userData.preferredLanguage || 'fr',
      });
    }
  }, [userData]);

  // Redirect to login if not authenticated
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-light flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-gold-metallic border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-night/70">Vérification de l'authentification...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    router.push('/login');
    return null;
  }

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/login' });
  };

  const handleSaveProfile = async () => {
    setSuccess('');

    if (!identityVerified && (!editForm.firstName.trim() || !editForm.lastName.trim())) {
      return;
    }

    try {
      await updateProfileMutation.mutateAsync({
        ...(identityVerified
          ? {}
          : {
              firstName: editForm.firstName.trim(),
              lastName: editForm.lastName.trim(),
            }),
        address: editForm.address.trim(),
        city: editForm.city.trim(),
        country: editForm.country.trim(),
        preferredLanguage: editForm.preferredLanguage,
      });
      setSuccess('Profil mis à jour avec succès');
      setIsEditing(false);
    } catch (error) {
      console.error('Profile update failed:', error);
    }
  };

  const displayEmail =
    userData?.email?.includes('@onboarding.samanaffa.tmp') ? '' : userData?.email;
  const formattedDateOfBirth = formatDateOfBirth(userData?.dateOfBirth);
  const dobFromKyc = userData?.kycStatus === 'APPROVED';

  const handleCancelEdit = () => {
    if (userData) {
      setEditForm({
        firstName: userData.firstName,
        lastName: userData.lastName,
        address: userData.address || '',
        city: userData.city || '',
        country: userData.country || 'Sénégal',
        preferredLanguage: userData.preferredLanguage || 'fr',
      });
    }
    setIsEditing(false);
    setSuccess(''); // Clear success message when canceling
  };

  const canStartDiditKyc =
    userData?.kycStatus === 'PENDING' ||
    userData?.kycStatus === 'REJECTED' ||
    userData?.kycStatus === 'UNDER_REVIEW';

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return <CheckCircleIcon className="w-5 h-5 text-gold-metallic" />;
      case 'PENDING':
        return <ClockIcon className="w-5 h-5 text-gold-dark" />;
      case 'REJECTED':
        return <ExclamationTriangleIcon className="w-5 h-5 text-red-500" />;
      case 'UNDER_REVIEW':
        return <ClockIcon className="w-5 h-5 text-blue-500" />;
      default:
        return <DocumentTextIcon className="w-5 h-5 text-night/50" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return 'Approuvé';
      case 'PENDING':
        return 'En attente';
      case 'REJECTED':
        return 'Rejeté';
      case 'UNDER_REVIEW':
        return 'En révision';
      default:
        return 'En attente';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return 'bg-green-100 text-green-800';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'REJECTED':
        return 'bg-red-100 text-red-800';
      case 'UNDER_REVIEW':
        return 'bg-blue-100 text-blue-800';
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
  if (error || (!isLoading && !userData)) {
    return (
      <div className="min-h-screen bg-gray-light flex items-center justify-center">
        <div className="text-center">
          <ExclamationTriangleIcon className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-night/70 mb-4">
            {error || 'Erreur lors du chargement de votre profil'}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="bg-gold-metallic text-white px-6 py-2 rounded-lg font-medium hover:bg-gold-dark transition-colors"
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
          firstName: userData?.firstName || '',
          lastName: userData?.lastName || '',
          email: userData?.email || '',
          phone: userData?.phone || '',
          userId: userData?.id || '',
          isNewUser: false,
          kycStatus: userData?.kycStatus as KYCStatus
        }}
        kycStatus={userData?.kycStatus as KYCStatus}
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

          {updateProfileMutation.isPending && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center space-x-2">
              <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-blue-800 text-sm">Sauvegarde en cours...</p>
            </div>
          )}

          {/* Profile Header */}
          <div className="bg-white rounded-2xl border border-timberwolf/20 p-8">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-3xl font-bold text-night">Mon Profil</h1>
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center space-x-2 bg-gold-metallic text-white px-4 py-2 rounded-lg font-medium hover:bg-gold-dark transition-colors"
                >
                  <PencilIcon className="w-4 h-4" />
                  <span>{identityVerified ? 'Modifier le contact' : 'Modifier'}</span>
                </button>
              )}
            </div>

            <div className="flex items-start space-x-6">
              {/* Avatar */}
              <div className="relative">
                <div className="w-24 h-24 bg-gradient-to-r from-gold-metallic to-gold-dark rounded-full flex items-center justify-center">
                  <span className="text-3xl font-bold text-white">
                    {userData?.firstName?.charAt(0)}{userData?.lastName?.charAt(0)}
                  </span>
                </div>
                <button className="absolute -bottom-2 -right-2 w-8 h-8 bg-white border-2 border-gold-metallic rounded-full flex items-center justify-center hover:bg-gold-light/20 transition-colors">
                  <CameraIcon className="w-4 h-4 text-gold-metallic" />
                </button>
              </div>

              {/* Profile Info */}
              <div className="flex-1 space-y-4">
                {identityVerified && (
                  <p className="text-sm text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2 mb-4">
                    Identité vérifiée par Didit — le prénom, nom et la date de naissance ne sont pas modifiables ici.
                  </p>
                )}
                {isEditing ? (
                  <div className="space-y-4">
                    {!identityVerified && (
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
                    )}
                    <div>
                      <label className="block text-sm font-medium text-night mb-2">Email</label>
                      <input
                        type="email"
                        value={displayEmail || ''}
                        readOnly
                        disabled
                        placeholder={
                          userData?.email?.includes('@onboarding.samanaffa.tmp')
                            ? "À compléter via le formulaire d'inscription"
                            : undefined
                        }
                        className="w-full px-4 py-3 border border-timberwolf/30 rounded-lg bg-timberwolf/10 text-night/60 cursor-not-allowed"
                      />
                      <p className="text-xs text-night/50 mt-1">
                        La modification de l&apos;email n&apos;est pas disponible ici pour le moment.
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-night mb-2">Téléphone</label>
                      <input
                        type="tel"
                        value={userData?.phone || ''}
                        readOnly
                        disabled
                        className="w-full px-4 py-3 border border-timberwolf/30 rounded-lg bg-timberwolf/10 text-night/60 cursor-not-allowed"
                      />
                      <p className="text-xs text-amber-700/90 mt-1">
                        Le changement de numéro nécessite une vérification par SMS (OTP). Cette option sera
                        disponible prochainement.
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-night mb-2">
                        Date de naissance
                      </label>
                      <input
                        type="text"
                        value={formattedDateOfBirth ?? ''}
                        readOnly
                        disabled
                        placeholder="Non renseignée — vérification d'identité requise"
                        className="w-full px-4 py-3 border border-timberwolf/30 rounded-lg bg-timberwolf/10 text-night/60 cursor-not-allowed"
                      />
                      {dobFromKyc && formattedDateOfBirth && (
                        <p className="text-xs text-night/50 mt-1">
                          Issue de votre vérification d&apos;identité (Didit).
                        </p>
                      )}
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
                        <label className="block text-sm font-medium text-night mb-2">Pays</label>
                        <input
                          type="text"
                          value={editForm.country}
                          onChange={(e) => setEditForm({...editForm, country: e.target.value})}
                          className="w-full px-4 py-3 border border-timberwolf/30 rounded-lg focus:ring-2 focus:ring-gold-metallic focus:border-transparent"
                        />
                      </div>
                      <div className="md:col-span-2">
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
                        disabled={updateProfileMutation.isPending}
                        className={`flex items-center space-x-2 px-6 py-2 rounded-lg font-medium transition-colors ${
                          updateProfileMutation.isPending
                            ? 'bg-timberwolf/50 text-night/50 cursor-not-allowed'
                            : 'bg-gold-metallic text-white hover:bg-gold-dark'
                        }`}
                      >
                        {updateProfileMutation.isPending && <div className="w-4 h-4 border-2 border-night/30 border-t-night rounded-full animate-spin" />}
                        <span>{updateProfileMutation.isPending ? 'Sauvegarde...' : 'Sauvegarder'}</span>
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        disabled={updateProfileMutation.isPending}
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
                        {userData?.firstName} {userData?.lastName}
                      </span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <EnvelopeIcon className="w-5 h-5 text-night/70" />
                      <span className="text-night/70">
                        {displayEmail || 'Email non renseigné — complétez votre profil depuis le tableau de bord'}
                      </span>
                      {userData?.emailVerified && displayEmail && (
                        <CheckCircleIcon className="w-4 h-4 text-green-500" />
                      )}
                    </div>
                    <div className="flex items-center space-x-3">
                      <PhoneIcon className="w-5 h-5 text-night/70" />
                      <span className="text-night/70">{userData?.phone}</span>
                      {userData?.phoneVerified && (
                        <CheckCircleIcon className="w-4 h-4 text-green-500" />
                      )}
                    </div>
                    <div className="flex items-center space-x-3">
                      <CalendarDaysIcon className="w-5 h-5 text-night/70" />
                      <span className="text-night/70">
                        {formattedDateOfBirth
                          ? `Né(e) le ${formattedDateOfBirth}`
                          : 'Date de naissance non renseignée'}
                      </span>
                      {dobFromKyc && formattedDateOfBirth && (
                        <CheckCircleIcon className="w-4 h-4 text-green-500" title="Vérifiée via Didit" />
                      )}
                    </div>
                    <div className="flex items-center space-x-3">
                      <MapPinIcon className="w-5 h-5 text-night/70" />
                      <span className="text-night/70">
                        {[userData?.address, userData?.city, userData?.country]
                          .filter(Boolean)
                          .join(', ') || 'Non renseignée'}
                      </span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <IdentificationIcon className="w-5 h-5 text-night/70" />
                      <span className="text-night/70">ID: {userData?.id}</span>
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
              <div className={`flex items-center space-x-2 px-3 py-1 rounded-full ${
                userData?.kycStatus === 'APPROVED'
                  ? 'bg-green-100 text-green-800'
                  : userData?.kycStatus === 'UNDER_REVIEW'
                  ? 'bg-blue-100 text-blue-800'
                  : userData?.kycStatus === 'REJECTED'
                  ? 'bg-red-100 text-red-800'
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {userData?.kycStatus === 'APPROVED' ? (
                  <CheckCircleIcon className="w-5 h-5" />
                ) : userData?.kycStatus === 'UNDER_REVIEW' ? (
                  <ClockIcon className="w-5 h-5" />
                ) : userData?.kycStatus === 'REJECTED' ? (
                  <ExclamationTriangleIcon className="w-5 h-5" />
                ) : (
                  <ClockIcon className="w-5 h-5" />
                )}
                <span className="font-medium">
                  {userData?.kycStatus === 'APPROVED'
                    ? 'Approuvé'
                    : userData?.kycStatus === 'UNDER_REVIEW'
                    ? 'En révision'
                    : userData?.kycStatus === 'REJECTED'
                    ? 'Rejeté'
                    : 'En attente'
                  }
                </span>
              </div>
            </div>
            <p className="text-night/70">
              {userData?.kycStatus === 'APPROVED'
                ? 'Votre compte est entièrement vérifié. Vous avez accès à tous nos services.'
                : userData?.kycStatus === 'UNDER_REVIEW'
                ? 'Votre vérification KYC est en cours de révision par notre équipe.'
                : userData?.kycStatus === 'REJECTED'
                ? 'Votre vérification KYC a été rejetée. Veuillez contacter le support.'
                : 'Complétez la vérification Didit (pièce d’identité et selfie en direct, sans import de fichier).'
              }
            </p>
            {canStartDiditKyc && (
              <button
                type="button"
                onClick={() => setShowKycModal(true)}
                className="mt-4 px-5 py-2.5 bg-gold-metallic text-white rounded-lg font-medium hover:bg-gold-dark transition-colors"
              >
                {userData?.kycStatus === 'REJECTED'
                  ? 'Relancer la vérification Didit'
                  : 'Vérifier mon identité (Didit)'}
              </button>
            )}
          </div>

          {/* Documents (Didit — no manual upload) */}
          <div className="bg-white rounded-2xl border border-timberwolf/20 p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-night">Vérification Didit</h2>
            </div>
            <p className="text-sm text-night/60 mb-4">
              La capture se fait en direct dans Didit (pas d&apos;import depuis la galerie).
            </p>
            <div className="space-y-4">
              {userData?.kycDocuments && userData.kycDocuments.length > 0 ? (
                userData.kycDocuments.map((doc) => {
                  const isDiditSession = doc.documentType === 'didit_kyc_session';
                  return (
                    <div
                      key={doc.id}
                      className="flex items-center justify-between p-4 border border-timberwolf/20 rounded-lg"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-gold-metallic/10 rounded-lg flex items-center justify-center">
                          <DocumentTextIcon className="w-5 h-5 text-gold-metallic" />
                        </div>
                        <div>
                          <h3 className="font-medium text-night">
                            {isDiditSession ? 'Session Didit' : doc.documentType}
                          </h3>
                          {!isDiditSession && (
                            <p className="text-sm text-night/60">{doc.fileName}</p>
                          )}
                          <p className="text-xs text-night/50">
                            {new Date(doc.uploadDate).toLocaleDateString('fr-FR')}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(doc.verificationStatus)}`}
                        >
                          {getStatusText(doc.verificationStatus)}
                        </span>
                        {getStatusIcon(doc.verificationStatus)}
                        {!isDiditSession && doc.fileUrl.startsWith('http') && (
                          <a
                            href={doc.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 text-night/60 hover:text-night transition-colors"
                          >
                            <EyeIcon className="w-4 h-4" />
                          </a>
                        )}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-8 text-night/60">
                  <DocumentTextIcon className="w-12 h-12 mx-auto mb-4 text-night/30" />
                  <p>Aucune vérification enregistrée</p>
                  <p className="text-sm">Lancez Didit pour vérifier votre identité</p>
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

      <KYCInitiationModal
        isOpen={showKycModal}
        onClose={() => setShowKycModal(false)}
        onComplete={() => {
          invalidateUserProfile();
          setShowKycModal(false);
        }}
      />
    </div>
  );
}
