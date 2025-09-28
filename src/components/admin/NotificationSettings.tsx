'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Button from '@/components/common/Button'
import {
  Settings,
  Mail,
  MessageSquare,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Save,
  RotateCcw
} from 'lucide-react'

interface NotificationSettings {
  enableEmailNotifications: boolean
  enableSMSNotifications: boolean
  enableKYCApprovalSMS: boolean
  enableKYCRejectionSMS: boolean
  enableKYCUnderReviewSMS: boolean
  enableTransactionSMS: boolean
  smsOnlyForCritical: boolean
  emailTemplate: string
  smsTemplate: string
}

export default function NotificationSettings() {
  const [settings, setSettings] = useState<NotificationSettings>({
    enableEmailNotifications: true,
    enableSMSNotifications: false,
    enableKYCApprovalSMS: false,
    enableKYCRejectionSMS: true,
    enableKYCUnderReviewSMS: false,
    enableTransactionSMS: false,
    smsOnlyForCritical: true,
    emailTemplate: 'default',
    smsTemplate: 'default'
  })

  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('admin_token')
      const response = await fetch('/api/admin/settings/notifications', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      const data = await response.json()
      if (data.success) {
        setSettings(data.settings)
      }
    } catch (error) {
      console.error('Error fetching notification settings:', error)
      setMessage('Erreur lors du chargement des paramètres')
    } finally {
      setLoading(false)
    }
  }

  const saveSettings = async () => {
    try {
      setSaving(true)
      setMessage('')

      const token = localStorage.getItem('admin_token')
      const response = await fetch('/api/admin/settings/notifications', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(settings)
      })

      const data = await response.json()
      
      if (data.success) {
        setMessage('Paramètres sauvegardés avec succès!')
        setTimeout(() => setMessage(''), 3000)
      } else {
        setMessage(`Erreur: ${data.error}`)
      }
    } catch (error) {
      console.error('Error saving notification settings:', error)
      setMessage('Erreur lors de la sauvegarde')
    } finally {
      setSaving(false)
    }
  }

  const resetToDefaults = () => {
    setSettings({
      enableEmailNotifications: true,
      enableSMSNotifications: false,
      enableKYCApprovalSMS: false,
      enableKYCRejectionSMS: true,
      enableKYCUnderReviewSMS: false,
      enableTransactionSMS: false,
      smsOnlyForCritical: true,
      emailTemplate: 'default',
      smsTemplate: 'default'
    })
  }

  const handleSettingChange = (key: keyof NotificationSettings, value: boolean | string) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }))
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-3">Chargement des paramètres...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Paramètres de Notification</h2>
          <p className="text-gray-600">Configurez les méthodes de communication pour les notifications KYC</p>
        </div>
        <div className="flex space-x-3">
          <Button
            onClick={resetToDefaults}
            variant="outline"
            className="flex items-center space-x-2"
          >
            <RotateCcw className="h-4 w-4" />
            <span>Réinitialiser</span>
          </Button>
          <Button
            onClick={saveSettings}
            disabled={saving}
            className="flex items-center space-x-2"
          >
            {saving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Sauvegarde...</span>
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                <span>Sauvegarder</span>
              </>
            )}
          </Button>
        </div>
      </div>

      {/* General Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Settings className="h-5 w-5" />
            <span>Paramètres Généraux</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center space-x-3">
              <Mail className="h-5 w-5 text-blue-500" />
              <div>
                <h3 className="font-medium">Notifications Email</h3>
                <p className="text-sm text-gray-500">Envoyer des notifications par email</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={settings.enableEmailNotifications}
                onChange={(e) => handleSettingChange('enableEmailNotifications', e.target.checked)}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center space-x-3">
              <MessageSquare className="h-5 w-5 text-green-500" />
              <div>
                <h3 className="font-medium">Notifications SMS</h3>
                <p className="text-sm text-gray-500">Envoyer des notifications par SMS</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={settings.enableSMSNotifications}
                onChange={(e) => handleSettingChange('enableSMSNotifications', e.target.checked)}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </CardContent>
      </Card>

      {/* KYC Notifications */}
      <Card>
        <CardHeader>
          <CardTitle>Notifications KYC par SMS</CardTitle>
          <p className="text-sm text-gray-500">
            Configurez quand envoyer des SMS pour les changements de statut KYC (indépendant du paramètre SMS général)
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center space-x-3">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <div>
                <h3 className="font-medium">KYC Approuvé</h3>
                <p className="text-sm text-gray-500">SMS quand le KYC est approuvé</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={settings.enableKYCApprovalSMS}
                onChange={(e) => handleSettingChange('enableKYCApprovalSMS', e.target.checked)}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center space-x-3">
              <XCircle className="h-5 w-5 text-red-500" />
              <div>
                <h3 className="font-medium">KYC Rejeté</h3>
                <p className="text-sm text-gray-500">SMS quand le KYC est rejeté (recommandé)</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={settings.enableKYCRejectionSMS}
                onChange={(e) => handleSettingChange('enableKYCRejectionSMS', e.target.checked)}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center space-x-3">
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
              <div>
                <h3 className="font-medium">KYC En Révision</h3>
                <p className="text-sm text-gray-500">SMS quand le KYC est en cours de révision</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={settings.enableKYCUnderReviewSMS}
                onChange={(e) => handleSettingChange('enableKYCUnderReviewSMS', e.target.checked)}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center space-x-3">
              <MessageSquare className="h-5 w-5 text-purple-500" />
              <div>
                <h3 className="font-medium">Transactions</h3>
                <p className="text-sm text-gray-500">SMS pour les notifications de transaction</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={settings.enableTransactionSMS}
                onChange={(e) => handleSettingChange('enableTransactionSMS', e.target.checked)}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </CardContent>
      </Card>

      {/* Advanced Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Paramètres Avancés</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div>
              <h3 className="font-medium">SMS Uniquement pour les Cas Critiques</h3>
              <p className="text-sm text-gray-500">
                Limiter les SMS aux changements de statut critiques (approuvé/rejeté)
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={settings.smsOnlyForCritical}
                onChange={(e) => handleSettingChange('smsOnlyForCritical', e.target.checked)}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </CardContent>
      </Card>

      {/* Status Message */}
      {message && (
        <div className={`p-4 rounded-lg ${
          message.includes('succès') 
            ? 'bg-green-50 border border-green-200 text-green-700'
            : 'bg-red-50 border border-red-200 text-red-700'
        }`}>
          <p className="text-sm">{message}</p>
        </div>
      )}

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-medium text-blue-900 mb-2">ℹ️ Information</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Les notifications email sont toujours recommandées pour une communication professionnelle</li>
          <li>• Les paramètres SMS KYC sont indépendants du paramètre SMS général</li>
          <li>• Vous pouvez activer des SMS spécifiques pour le KYC même si le SMS général est désactivé</li>
          <li>• Les notifications in-app sont toujours activées</li>
          <li>• Les changements prennent effet immédiatement après la sauvegarde</li>
        </ul>
      </div>
    </div>
  )
}
