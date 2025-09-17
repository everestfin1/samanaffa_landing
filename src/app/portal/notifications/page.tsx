'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  BellIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  BanknotesIcon,
  BuildingLibraryIcon,
  UserGroupIcon,
  StarIcon,
  ClockIcon,
  EyeIcon,
  TrashIcon,
  Cog6ToothIcon
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
  const [kycStatus] = useState<KYCStatus>('approved');
  const [userData] = useState<UserData>({
    firstName: 'Amadou',
    lastName: 'Diallo',
    email: 'amadou.diallo@email.com',
    phone: '+221 77 123 45 67',
    userId: 'USR_2024_001',
    isNewUser: false,
    kycStatus: 'approved'
  });

  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      title: 'Paiement d\'intérêts APE reçu',
      message: 'Vous avez reçu un paiement de 34 750 FCFA pour vos investissements APE Sénégal.',
      type: 'success',
      category: 'investment',
      timestamp: '2025-09-17T10:30:00Z',
      read: false,
      actionUrl: '/portal/ape'
    },
    {
      id: '2',
      title: 'Objectif d\'épargne atteint',
      message: 'Félicitations ! Vous avez atteint 75% de votre objectif "Achat maison".',
      type: 'success',
      category: 'account',
      timestamp: '2025-09-16T14:20:00Z',
      read: false,
      actionUrl: '/portal/sama-naffa'
    },
    {
      id: '3',
      title: 'Nouvelle tranche APE disponible',
      message: 'Une allocation supplémentaire de la Tranche D est maintenant disponible.',
      type: 'info',
      category: 'investment',
      timestamp: '2025-09-15T09:15:00Z',
      read: true,
      actionUrl: '/portal/ape'
    },
    {
      id: '4',
      title: 'Défi d\'épargne terminé',
      message: 'Bravo ! Vous avez complété le défi "52 semaines" avec succès.',
      type: 'success',
      category: 'account',
      timestamp: '2025-09-14T16:45:00Z',
      read: true,
      actionUrl: '/portal/sama-naffa'
    },
    {
      id: '5',
      title: 'Rappel: Échéance investissement',
      message: 'Votre investissement APE Tranche A arrive à échéance dans 30 jours.',
      type: 'warning',
      category: 'investment',
      timestamp: '2025-09-13T11:00:00Z',
      read: true,
      actionUrl: '/portal/ape'
    },
    {
      id: '6',
      title: 'Mise à jour des conditions',
      message: 'Nos conditions générales ont été mises à jour. Consultez les changements.',
      type: 'info',
      category: 'system',
      timestamp: '2025-09-12T08:30:00Z',
      read: true
    }
  ]);

  const [filter, setFilter] = useState<'all' | 'unread' | 'investment' | 'account' | 'system'>('all');

  const handleLogout = () => {
    router.push('/login');
  };

  const markAsRead = (notificationId: string) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === notificationId ? { ...notif, read: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notif => ({ ...notif, read: true }))
    );
  };

  const deleteNotification = (notificationId: string) => {
    setNotifications(prev =>
      prev.filter(notif => notif.id !== notificationId)
    );
  };

  const getNotificationIcon = (type: string, category: string) => {
    if (category === 'investment') return <BuildingLibraryIcon className="w-5 h-5" />;
    if (category === 'transaction') return <BanknotesIcon className="w-5 h-5" />;
    if (category === 'account') return <StarIcon className="w-5 h-5" />;
    
    switch (type) {
      case 'success':
        return <CheckCircleIcon className="w-5 h-5" />;
      case 'warning':
        return <ExclamationTriangleIcon className="w-5 h-5" />;
      case 'error':
        return <ExclamationTriangleIcon className="w-5 h-5" />;
      default:
        return <InformationCircleIcon className="w-5 h-5" />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'text-gold-metallic bg-gold-light/20';
      case 'warning':
        return 'text-gold-dark bg-gold-light/30';
      case 'error':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-night bg-timberwolf/20';
    }
  };

  const filteredNotifications = notifications.filter(notif => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !notif.read;
    return notif.category === filter;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 1) return 'À l\'instant';
    if (diffInHours < 24) return `Il y a ${Math.floor(diffInHours)} heures`;
    if (diffInHours < 48) return 'Hier';
    return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
  };

  return (
    <div className="min-h-screen bg-gray-light">
      <PortalHeader
        userData={userData}
        kycStatus={kycStatus}
        activeTab="notifications"
        setActiveTab={() => {}} // Not used with navigation
        onLogout={handleLogout}
      />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-night">Notifications</h1>
              <p className="text-night/70 mt-1">
                {unreadCount > 0 ? `${unreadCount} notification${unreadCount > 1 ? 's' : ''} non lue${unreadCount > 1 ? 's' : ''}` : 'Toutes vos notifications sont lues'}
              </p>
            </div>
            <div className="flex items-center space-x-3">
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="bg-gold-metallic text-night px-4 py-2 rounded-lg font-medium hover:bg-gold-dark transition-colors"
                >
                  Tout marquer comme lu
                </button>
              )}
              <button className="p-2 text-night/70 hover:text-night hover:bg-timberwolf/20 rounded-lg transition-colors">
                <Cog6ToothIcon className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="bg-white rounded-2xl border border-timberwolf/20 p-2">
            <div className="flex flex-wrap gap-2">
              {[
                { id: 'all', label: 'Toutes', count: notifications.length },
                { id: 'unread', label: 'Non lues', count: unreadCount },
                { id: 'investment', label: 'Investissements', count: notifications.filter(n => n.category === 'investment').length },
                { id: 'account', label: 'Compte', count: notifications.filter(n => n.category === 'account').length },
                { id: 'system', label: 'Système', count: notifications.filter(n => n.category === 'system').length }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setFilter(tab.id as 'all' | 'unread' | 'investment' | 'account' | 'system')}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                    filter === tab.id
                      ? 'bg-gold-metallic text-night'
                      : 'text-night/70 hover:text-night hover:bg-timberwolf/10'
                  }`}
                >
                  <span>{tab.label}</span>
                  {tab.count > 0 && (
                    <span className={`px-2 py-0.5 rounded-full text-xs ${
                      filter === tab.id
                        ? 'bg-night/20 text-night'
                        : 'bg-timberwolf/30 text-night/60'
                    }`}>
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Notifications List */}
          <div className="space-y-4">
            {filteredNotifications.length === 0 ? (
              <div className="bg-white rounded-2xl border border-timberwolf/20 p-12 text-center">
                <BellIcon className="w-12 h-12 text-night/30 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-night mb-2">Aucune notification</h3>
                <p className="text-night/60">
                  {filter === 'unread' ? 'Toutes vos notifications sont lues' : 'Aucune notification dans cette catégorie'}
                </p>
              </div>
            ) : (
              filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`bg-white rounded-2xl border p-6 transition-all hover:shadow-md ${
                    notification.read 
                      ? 'border-timberwolf/20' 
                      : 'border-gold-metallic/30 bg-gold-light/5'
                  }`}
                >
                  <div className="flex items-start space-x-4">
                    {/* Icon */}
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${getNotificationColor(notification.type)}`}>
                      {getNotificationIcon(notification.type, notification.category)}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className={`font-semibold ${notification.read ? 'text-night' : 'text-night font-bold'}`}>
                          {notification.title}
                        </h3>
                        <div className="flex items-center space-x-2 ml-4">
                          <span className="text-sm text-night/50 whitespace-nowrap">
                            {formatDate(notification.timestamp)}
                          </span>
                          {!notification.read && (
                            <div className="w-2 h-2 bg-gold-metallic rounded-full"></div>
                          )}
                        </div>
                      </div>
                      
                      <p className="text-night/70 mb-3 leading-relaxed">
                        {notification.message}
                      </p>

                      {/* Actions */}
                      <div className="flex items-center space-x-3">
                        {notification.actionUrl && (
                          <button
                            onClick={() => {
                              markAsRead(notification.id);
                              router.push(notification.actionUrl!);
                            }}
                            className="text-gold-metallic hover:text-gold-dark font-medium text-sm"
                          >
                            Voir détails
                          </button>
                        )}
                        
                        {!notification.read && (
                          <button
                            onClick={() => markAsRead(notification.id)}
                            className="flex items-center space-x-1 text-night/60 hover:text-night text-sm"
                          >
                            <EyeIcon className="w-4 h-4" />
                            <span>Marquer comme lu</span>
                          </button>
                        )}
                        
                        <button
                          onClick={() => deleteNotification(notification.id)}
                          className="flex items-center space-x-1 text-red-600 hover:text-red-700 text-sm"
                        >
                          <TrashIcon className="w-4 h-4" />
                          <span>Supprimer</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Settings Card */}
          <div className="bg-white rounded-2xl border border-timberwolf/20 p-8">
            <h2 className="text-xl font-bold text-night mb-6">Préférences de notification</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-timberwolf/20 rounded-lg">
                <div>
                  <h3 className="font-medium text-night">Notifications d'investissement</h3>
                  <p className="text-sm text-night/60">Intérêts, échéances, nouvelles opportunités</p>
                </div>
                <button className="bg-gold-metallic w-12 h-6 rounded-full relative transition-colors">
                  <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transform translate-x-6 transition-transform"></div>
                </button>
              </div>
              
              <div className="flex items-center justify-between p-4 border border-timberwolf/20 rounded-lg">
                <div>
                  <h3 className="font-medium text-night">Notifications de compte</h3>
                  <p className="text-sm text-night/60">Objectifs atteints, défis, activité de compte</p>
                </div>
                <button className="bg-gold-metallic w-12 h-6 rounded-full relative transition-colors">
                  <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transform translate-x-6 transition-transform"></div>
                </button>
              </div>
              
              <div className="flex items-center justify-between p-4 border border-timberwolf/20 rounded-lg">
                <div>
                  <h3 className="font-medium text-night">Notifications système</h3>
                  <p className="text-sm text-night/60">Mises à jour, maintenance, sécurité</p>
                </div>
                <button className="bg-timberwolf w-12 h-6 rounded-full relative transition-colors">
                  <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform"></div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
