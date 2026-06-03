'use client'

import { useState, useEffect, useMemo, type ReactNode } from 'react'
import {
  Users,
  Send,
  Search,
  Mail,
  MessageSquare,
  Bell,
  Clock,
  CheckCircle2,
  ShieldCheck,
} from 'lucide-react'
import { useAdminData } from '@/lib/admin/AdminDataProvider'
import { Avatar, StatusPill } from '@/components/admin/layout/visuals'
import type { AdminUser } from '@/lib/admin/types'

const KYC_LABEL: Record<string, string> = {
  APPROVED: 'Approuvé',
  PENDING: 'En attente',
  UNDER_REVIEW: 'En révision',
  REJECTED: 'Rejeté',
}

interface NotificationForm {
  userId: string
  kycStatus: 'APPROVED' | 'REJECTED' | 'UNDER_REVIEW'
  rejectionReasons: string[]
  customMessage: string
  sendEmail: boolean
  sendSMS: boolean
}

const COMMON_REJECTION_REASONS = [
  'Document de qualité insuffisante',
  'Document expiré',
  'Document non lisible',
  'Informations incomplètes',
  'Document manquant',
  'Photo de profil non conforme',
  'Signature manquante ou non valide',
  'Adresse non vérifiable',
  'Numéro de téléphone incorrect',
  'Informations contradictoires',
]

function Panel({
  title,
  icon: Icon,
  children,
}: {
  title: string
  icon: typeof Users
  children: ReactNode
}) {
  return (
    <div className="overflow-hidden rounded-[1.5rem] border border-white bg-white shadow-[0_8px_30px_-16px_rgba(1,8,27,0.12)]">
      <div className="border-b border-slate-100 px-6 py-4">
        <h2 className="flex items-center gap-2 text-sm font-bold text-slate-800">
          <Icon size={16} className="text-[#435933]" />
          {title}
        </h2>
      </div>
      <div className="p-6">{children}</div>
    </div>
  )
}

export default function NotificationManagement() {
  const { users, loading, refresh, authedFetch } = useAdminData()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null)
  const [sending, setSending] = useState(false)
  const [message, setMessage] = useState('')

  const [notificationForm, setNotificationForm] = useState<NotificationForm>({
    userId: '',
    kycStatus: 'APPROVED',
    rejectionReasons: [],
    customMessage: '',
    sendEmail: true,
    sendSMS: true,
  })

  const stats = useMemo(() => {
    const total = users.length
    const pending = users.filter((u) => u.kycStatus === 'PENDING').length
    const approved = users.filter((u) => u.kycStatus === 'APPROVED').length
    const underReview = users.filter((u) => u.kycStatus === 'UNDER_REVIEW').length
    return { total, pending, approved, underReview }
  }, [users])

  const filteredUsers = useMemo(() => {
    const q = searchTerm.trim().toLowerCase()
    if (!q) return users
    return users.filter((user) => {
      const hay = [user.firstName, user.lastName, user.email, user.phone]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
      return hay.includes(q)
    })
  }, [users, searchTerm])

  useEffect(() => {
    if (!selectedUser) return
    setNotificationForm((prev) => ({
      ...prev,
      userId: selectedUser.id,
      kycStatus:
        selectedUser.kycStatus === 'PENDING'
          ? 'UNDER_REVIEW'
          : (selectedUser.kycStatus as NotificationForm['kycStatus']),
    }))
  }, [selectedUser])

  const handleRejectionReasonToggle = (reason: string) => {
    setNotificationForm((prev) => ({
      ...prev,
      rejectionReasons: prev.rejectionReasons.includes(reason)
        ? prev.rejectionReasons.filter((r) => r !== reason)
        : [...prev.rejectionReasons, reason],
    }))
  }

  const handleSendNotification = async () => {
    if (!selectedUser || !notificationForm.kycStatus) {
      setMessage('Veuillez sélectionner un utilisateur et un statut')
      return
    }

    try {
      setSending(true)
      setMessage('')

      const response = await authedFetch('/api/admin/notifications', {
        method: 'POST',
        body: JSON.stringify(notificationForm),
      })

      const data = await response.json()

      if (data.success) {
        setMessage('Notification envoyée avec succès')
        await refresh()
        setSelectedUser(null)
        setNotificationForm({
          userId: '',
          kycStatus: 'APPROVED',
          rejectionReasons: [],
          customMessage: '',
          sendEmail: true,
          sendSMS: true,
        })
      } else {
        setMessage(`Erreur : ${data.error}`)
      }
    } catch (error) {
      console.error('Error sending notification:', error)
      setMessage("Erreur lors de l'envoi de la notification")
    } finally {
      setSending(false)
    }
  }

  const userDisplayName = (user: AdminUser) =>
    [user.firstName, user.lastName].filter(Boolean).join(' ') || user.email || user.phone

  return (
    <div>
      <header className="mb-8">
        <h1 className="text-[2.25rem] font-bold leading-none tracking-tight">Notifications</h1>
        <p className="mt-2 text-[15px] text-slate-500">
          Envoi de notifications KYC par email et SMS aux clients.
        </p>
      </header>

      <div className="mb-7 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          { label: 'Clients', value: stats.total, icon: Users, tone: 'slate' },
          { label: 'KYC en attente', value: stats.pending, icon: Clock, tone: 'amber' },
          { label: 'KYC approuvé', value: stats.approved, icon: CheckCircle2, tone: 'green' },
          { label: 'En révision', value: stats.underReview, icon: ShieldCheck, tone: 'blue' },
        ].map((s) => {
          const Icon = s.icon
          const toneClass: Record<string, string> = {
            slate: 'text-slate-500',
            amber: 'text-[#C38D1C]',
            green: 'text-[#435933]',
            blue: 'text-[#0284c7]',
          }
          return (
            <div
              key={s.label}
              className="flex flex-col justify-between rounded-[1.25rem] border border-white bg-white p-5 shadow-[0_8px_30px_-16px_rgba(1,8,27,0.1)]"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-500">{s.label}</span>
                <Icon size={15} className={toneClass[s.tone]} />
              </div>
              <div className="mt-3 text-2xl font-bold tracking-tight tabular-nums">
                {loading ? (
                  <span className="inline-block h-7 w-12 animate-pulse rounded bg-slate-100" />
                ) : (
                  s.value
                )}
              </div>
            </div>
          )
        })}
      </div>

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

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Panel title="Sélectionner un utilisateur" icon={Users}>
          <div className="relative mb-4">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Rechercher (nom, email, téléphone...)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-full border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#435933]"
            />
          </div>

          <div className="max-h-80 space-y-2 overflow-y-auto">
            {loading ? (
              <div className="space-y-2 py-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-16 animate-pulse rounded-xl bg-slate-100" />
                ))}
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="py-12 text-center">
                <div className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-slate-50 text-slate-300">
                  <Users size={22} />
                </div>
                <p className="text-sm font-semibold text-slate-600">Aucun utilisateur trouvé</p>
                <p className="mt-1 text-sm text-slate-400">Modifiez votre recherche.</p>
              </div>
            ) : (
              filteredUsers.map((user) => {
                const name = userDisplayName(user)
                const selected = selectedUser?.id === user.id
                return (
                  <button
                    key={user.id}
                    type="button"
                    onClick={() => setSelectedUser(user)}
                    className={`flex w-full items-center justify-between gap-3 rounded-xl border p-3 text-left transition-colors ${
                      selected
                        ? 'border-[#435933] bg-[#f0f8f0]'
                        : 'border-slate-100 bg-slate-50/50 hover:border-slate-200 hover:bg-white'
                    }`}
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <Avatar name={name} size={36} />
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-slate-800">{name}</p>
                        <p className="truncate text-xs text-slate-500">{user.email}</p>
                        <p className="truncate text-xs text-slate-400">{user.phone}</p>
                      </div>
                    </div>
                    <StatusPill
                      status={user.kycStatus}
                      label={KYC_LABEL[user.kycStatus] ?? user.kycStatus}
                    />
                  </button>
                )
              })
            )}
          </div>
        </Panel>

        <Panel title="Envoyer une notification KYC" icon={Send}>
          {selectedUser ? (
            <div className="space-y-4">
              <div className="rounded-xl border border-slate-100 bg-slate-50/60 p-4">
                <p className="text-sm font-semibold text-slate-800">
                  {userDisplayName(selectedUser)}
                </p>
                <p className="text-xs text-slate-500">{selectedUser.email}</p>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <span className="text-xs text-slate-500">Statut actuel</span>
                  <StatusPill
                    status={selectedUser.kycStatus}
                    label={KYC_LABEL[selectedUser.kycStatus] ?? selectedUser.kycStatus}
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-slate-400">
                  Nouveau statut KYC
                </label>
                <select
                  value={notificationForm.kycStatus}
                  onChange={(e) =>
                    setNotificationForm((prev) => ({
                      ...prev,
                      kycStatus: e.target.value as NotificationForm['kycStatus'],
                    }))
                  }
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#435933]"
                >
                  <option value="APPROVED">Approuvé</option>
                  <option value="REJECTED">Rejeté</option>
                  <option value="UNDER_REVIEW">En révision</option>
                </select>
              </div>

              {notificationForm.kycStatus === 'REJECTED' && (
                <div>
                  <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-slate-400">
                    Raisons du rejet
                  </label>
                  <div className="max-h-36 space-y-2 overflow-y-auto rounded-xl border border-slate-100 bg-slate-50/40 p-3">
                    {COMMON_REJECTION_REASONS.map((reason) => (
                      <label key={reason} className="flex cursor-pointer items-start gap-2">
                        <input
                          type="checkbox"
                          checked={notificationForm.rejectionReasons.includes(reason)}
                          onChange={() => handleRejectionReasonToggle(reason)}
                          className="mt-0.5 rounded border-slate-300 text-[#435933] focus:ring-[#435933]"
                        />
                        <span className="text-sm text-slate-700">{reason}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-slate-400">
                  Message personnalisé (optionnel)
                </label>
                <textarea
                  value={notificationForm.customMessage}
                  onChange={(e) =>
                    setNotificationForm((prev) => ({
                      ...prev,
                      customMessage: e.target.value,
                    }))
                  }
                  rows={3}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#435933]"
                  placeholder="Message pour le client..."
                />
              </div>

              <div className="space-y-2 rounded-xl border border-slate-100 bg-slate-50/40 p-3">
                <label className="flex cursor-pointer items-center gap-2">
                  <input
                    type="checkbox"
                    checked={notificationForm.sendEmail}
                    onChange={(e) =>
                      setNotificationForm((prev) => ({
                        ...prev,
                        sendEmail: e.target.checked,
                      }))
                    }
                    className="rounded border-slate-300 text-[#435933] focus:ring-[#435933]"
                  />
                  <Mail size={15} className="text-[#435933]" />
                  <span className="text-sm text-slate-700">Envoyer par email</span>
                </label>
                <label className="flex cursor-pointer items-center gap-2">
                  <input
                    type="checkbox"
                    checked={notificationForm.sendSMS}
                    onChange={(e) =>
                      setNotificationForm((prev) => ({
                        ...prev,
                        sendSMS: e.target.checked,
                      }))
                    }
                    className="rounded border-slate-300 text-[#435933] focus:ring-[#435933]"
                  />
                  <MessageSquare size={15} className="text-[#435933]" />
                  <span className="text-sm text-slate-700">Envoyer par SMS</span>
                </label>
              </div>

              <button
                type="button"
                onClick={handleSendNotification}
                disabled={sending || (!notificationForm.sendEmail && !notificationForm.sendSMS)}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#435933] px-4 py-3 text-sm font-semibold text-white shadow-[0_8px_24px_-10px_rgba(67,89,51,0.6)] transition-colors hover:bg-[#36482a] disabled:opacity-50"
              >
                {sending ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Envoi en cours...
                  </>
                ) : (
                  <>
                    <Send size={16} />
                    Envoyer la notification
                  </>
                )}
              </button>
            </div>
          ) : (
            <div className="py-16 text-center">
              <div className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-[#f0f8f0] text-[#435933]">
                <Bell size={22} />
              </div>
              <p className="text-sm font-semibold text-slate-600">Aucun utilisateur sélectionné</p>
              <p className="mt-1 text-sm text-slate-400">
                Choisissez un client dans la liste pour composer une notification.
              </p>
            </div>
          )}
        </Panel>
      </div>
    </div>
  )
}
