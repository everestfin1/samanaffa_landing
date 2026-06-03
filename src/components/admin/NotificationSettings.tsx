'use client'

import { useState, useEffect, type ReactNode } from 'react'
import {
  Settings,
  Mail,
  MessageSquare,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Save,
  RotateCcw,
  Info,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

interface NotificationSettingsData {
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

function BrandToggle({
  checked,
  onChange,
}: {
  checked: boolean
  onChange: (value: boolean) => void
}) {
  return (
    <label className="relative inline-flex shrink-0 cursor-pointer items-center">
      <input
        type="checkbox"
        className="peer sr-only"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span className="relative h-6 w-11 rounded-full bg-slate-200 transition-colors peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#435933]/30 peer-checked:bg-[#435933] after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-slate-200 after:bg-white after:transition-all peer-checked:after:translate-x-5" />
    </label>
  )
}

function SettingsPanel({
  title,
  description,
  children,
}: {
  title: string
  description?: string
  children: ReactNode
}) {
  return (
    <div className="overflow-hidden rounded-[1.5rem] border border-white bg-white shadow-[0_8px_30px_-16px_rgba(1,8,27,0.12)]">
      <div className="border-b border-slate-100 px-6 py-4">
        <h2 className="text-sm font-bold text-slate-800">{title}</h2>
        {description ? <p className="mt-1 text-xs text-slate-500">{description}</p> : null}
      </div>
      <div className="space-y-3 p-6">{children}</div>
    </div>
  )
}

function SettingRow({
  icon: Icon,
  iconClass,
  title,
  description,
  control,
}: {
  icon: LucideIcon
  iconClass: string
  title: string
  description: string
  control: ReactNode
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-slate-100 bg-slate-50/40 p-4">
      <div className="flex min-w-0 items-center gap-3">
        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white shadow-sm">
          <Icon size={18} className={iconClass} />
        </div>
        <div className="min-w-0">
          <h3 className="text-sm font-semibold text-slate-800">{title}</h3>
          <p className="text-xs text-slate-500">{description}</p>
        </div>
      </div>
      {control}
    </div>
  )
}

export default function NotificationSettings() {
  const [settings, setSettings] = useState<NotificationSettingsData>({
    enableEmailNotifications: true,
    enableSMSNotifications: false,
    enableKYCApprovalSMS: false,
    enableKYCRejectionSMS: true,
    enableKYCUnderReviewSMS: false,
    enableTransactionSMS: false,
    smsOnlyForCritical: true,
    emailTemplate: 'default',
    smsTemplate: 'default',
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
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
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
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      })

      const data = await response.json()

      if (data.success) {
        setMessage('Paramètres sauvegardés avec succès')
        setTimeout(() => setMessage(''), 3000)
      } else {
        setMessage(`Erreur : ${data.error}`)
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
      smsTemplate: 'default',
    })
  }

  const handleSettingChange = (
    key: keyof NotificationSettingsData,
    value: boolean | string,
  ) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  if (loading) {
    return (
      <div>
        <header className="mb-8">
          <h1 className="text-[2.25rem] font-bold leading-none tracking-tight">Paramètres</h1>
          <p className="mt-2 text-[15px] text-slate-500">Configuration des canaux de notification.</p>
        </header>
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="h-40 animate-pulse rounded-[1.5rem] border border-white bg-white shadow-[0_8px_30px_-16px_rgba(1,8,27,0.1)]"
            />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div>
      <header className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-[2.25rem] font-bold leading-none tracking-tight">Paramètres</h1>
          <p className="mt-2 text-[15px] text-slate-500">
            Canaux email et SMS pour les notifications KYC et transactions.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={resetToDefaults}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-50"
          >
            <RotateCcw size={16} />
            Réinitialiser
          </button>
          <button
            type="button"
            onClick={saveSettings}
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-xl bg-[#435933] px-4 py-2.5 text-sm font-semibold text-white shadow-[0_8px_24px_-10px_rgba(67,89,51,0.6)] transition-colors hover:bg-[#36482a] disabled:opacity-50"
          >
            {saving ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                Sauvegarde...
              </>
            ) : (
              <>
                <Save size={16} />
                Sauvegarder
              </>
            )}
          </button>
        </div>
      </header>

      {message && (
        <div
          className={`mb-6 rounded-xl border px-4 py-3 text-sm font-medium ${
            message.includes('succès')
              ? 'border-[#c6e0c6] bg-[#f0f8f0] text-[#2f5233]'
              : 'border-rose-200 bg-rose-50 text-rose-700'
          }`}
        >
          {message}
        </div>
      )}

      <div className="space-y-6">
        <SettingsPanel title="Paramètres généraux">
          <SettingRow
            icon={Mail}
            iconClass="text-[#435933]"
            title="Notifications email"
            description="Envoyer des notifications par email"
            control={
              <BrandToggle
                checked={settings.enableEmailNotifications}
                onChange={(v) => handleSettingChange('enableEmailNotifications', v)}
              />
            }
          />
          <SettingRow
            icon={MessageSquare}
            iconClass="text-[#C38D1C]"
            title="Notifications SMS"
            description="Activer l’envoi SMS global"
            control={
              <BrandToggle
                checked={settings.enableSMSNotifications}
                onChange={(v) => handleSettingChange('enableSMSNotifications', v)}
              />
            }
          />
        </SettingsPanel>

        <SettingsPanel
          title="Notifications KYC par SMS"
          description="Indépendant du paramètre SMS général — choisissez les événements KYC notifiés par SMS."
        >
          <SettingRow
            icon={CheckCircle2}
            iconClass="text-[#435933]"
            title="KYC approuvé"
            description="SMS lors de l’approbation du dossier"
            control={
              <BrandToggle
                checked={settings.enableKYCApprovalSMS}
                onChange={(v) => handleSettingChange('enableKYCApprovalSMS', v)}
              />
            }
          />
          <SettingRow
            icon={XCircle}
            iconClass="text-rose-500"
            title="KYC rejeté"
            description="SMS lors du rejet (recommandé)"
            control={
              <BrandToggle
                checked={settings.enableKYCRejectionSMS}
                onChange={(v) => handleSettingChange('enableKYCRejectionSMS', v)}
              />
            }
          />
          <SettingRow
            icon={AlertTriangle}
            iconClass="text-[#C38D1C]"
            title="KYC en révision"
            description="SMS lors du passage en révision"
            control={
              <BrandToggle
                checked={settings.enableKYCUnderReviewSMS}
                onChange={(v) => handleSettingChange('enableKYCUnderReviewSMS', v)}
              />
            }
          />
          <SettingRow
            icon={MessageSquare}
            iconClass="text-[#0284c7]"
            title="Transactions"
            description="SMS pour les notifications de transaction"
            control={
              <BrandToggle
                checked={settings.enableTransactionSMS}
                onChange={(v) => handleSettingChange('enableTransactionSMS', v)}
              />
            }
          />
        </SettingsPanel>

        <SettingsPanel title="Paramètres avancés">
          <SettingRow
            icon={Settings}
            iconClass="text-slate-500"
            title="SMS uniquement pour les cas critiques"
            description="Limiter les SMS aux changements de statut critiques (approuvé / rejeté)"
            control={
              <BrandToggle
                checked={settings.smsOnlyForCritical}
                onChange={(v) => handleSettingChange('smsOnlyForCritical', v)}
              />
            }
          />
        </SettingsPanel>

        <div className="rounded-[1.25rem] border border-[#c6e0c6] bg-[#f0f8f0] p-5">
          <div className="flex gap-3">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white text-[#435933]">
              <Info size={18} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#2f5233]">À savoir</h3>
              <ul className="mt-2 space-y-1 text-sm text-[#435933]/90">
                <li>Les notifications email restent recommandées pour une communication professionnelle.</li>
                <li>Les SMS KYC sont indépendants du paramètre SMS général.</li>
                <li>Les notifications in-app restent toujours actives.</li>
                <li>Les changements prennent effet immédiatement après sauvegarde.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
