'use client'

import { Ban, CheckCircle2, Edit, Gift, Trash2 } from 'lucide-react'
import AdminMetricStrip from '@/components/admin/layout/AdminMetricStrip'
import AdminPanel from '@/components/admin/layout/AdminPanel'
import AdminEmptyState from '@/components/admin/layout/AdminEmptyState'

export interface SponsorCode {
  id: string
  code: string
  description?: string
  status: string
  usageCount: number
  maxUsage?: number
  expiresAt?: string
  createdAt: string
  updatedAt: string
  createdBy: string
  createdByAdmin?: {
    id: string
    name: string
    email: string
  }
}

export interface SponsorCodeStats {
  total: number
  active: number
  inactive: number
  expired: number
}

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  ACTIVE: { label: 'Actif', color: 'success' },
  INACTIVE: { label: 'Inactif', color: 'warning' },
  EXPIRED: { label: 'Expiré', color: 'danger' },
}

const FILTER_OPTIONS = [
  { value: '', label: 'Tous' },
  { value: 'ACTIVE', label: 'Actifs' },
  { value: 'INACTIVE', label: 'Inactifs' },
  { value: 'EXPIRED', label: 'Expirés' },
] as const

interface SponsorCodesTabProps {
  codes: SponsorCode[]
  stats: SponsorCodeStats
  statusFilter: string
  onStatusFilterChange: (value: string) => void
  onCreateClick: () => void
  onEdit: (code: SponsorCode) => void
  onToggleStatus: (code: SponsorCode) => void
  onDelete: (code: SponsorCode) => void
}

export default function SponsorCodesTab({
  codes,
  stats,
  statusFilter,
  onStatusFilterChange,
  onCreateClick,
  onEdit,
  onToggleStatus,
  onDelete,
}: SponsorCodesTabProps) {
  const filtered = codes.filter(
    (code) => !statusFilter || code.status === statusFilter
  )

  return (
    <div className="admin-page">
      <AdminMetricStrip
        metrics={[
          { id: 'total', label: 'Total', value: stats.total, tone: 'info' },
          { id: 'active', label: 'Actifs', value: stats.active, tone: 'success' },
          { id: 'inactive', label: 'Inactifs', value: stats.inactive, tone: 'muted' },
          { id: 'expired', label: 'Expirés', value: stats.expired, tone: 'danger' },
        ]}
      />

      <AdminPanel
        title="Liste des codes"
        description="Création, activation et suivi d’utilisation."
        flush
        toolbar={
          <>
            <div className="admin-filter-bar" role="tablist" aria-label="Filtrer par statut">
              {FILTER_OPTIONS.map((opt) => (
                <button
                  key={opt.value || 'all'}
                  type="button"
                  role="tab"
                  aria-selected={statusFilter === opt.value}
                  className={`admin-filter-chip ${statusFilter === opt.value ? 'active' : ''}`}
                  onClick={() => onStatusFilterChange(opt.value)}
                >
                  {opt.label}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={onCreateClick}
              className="admin-btn admin-btn-primary"
            >
              <Gift className="w-4 h-4" />
              Nouveau code
            </button>
          </>
        }
      >
        {filtered.length > 0 ? (
          <div className="admin-table-scroll">
            <table className="admin-table-v2">
              <thead>
                <tr>
                  <th>Code</th>
                  <th>Description</th>
                  <th>Statut</th>
                  <th>Utilisations</th>
                  <th>Limite</th>
                  <th>Expiration</th>
                  <th>Créé par</th>
                  <th>Créé le</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((code) => {
                  const statusConfig =
                    STATUS_CONFIG[code.status] ?? {
                      label: code.status,
                      color: 'neutral',
                    }
                  return (
                    <tr key={code.id}>
                      <td>
                        <span className="admin-table-mono">{code.code}</span>
                      </td>
                      <td>{code.description || '—'}</td>
                      <td>
                        <span
                          className={`admin-badge admin-badge-${statusConfig.color}`}
                        >
                          {statusConfig.label}
                        </span>
                      </td>
                      <td>
                        <span className="admin-table-primary">
                          {code.usageCount}
                        </span>
                      </td>
                      <td>{code.maxUsage ?? 'Illimité'}</td>
                      <td>
                        {code.expiresAt
                          ? new Date(code.expiresAt).toLocaleDateString('fr-FR')
                          : 'Jamais'}
                      </td>
                      <td>{code.createdByAdmin?.name ?? '—'}</td>
                      <td>
                        {new Date(code.createdAt).toLocaleDateString('fr-FR')}
                      </td>
                      <td>
                        <div className="admin-table-actions">
                          <button
                            type="button"
                            onClick={() => onEdit(code)}
                            className="admin-btn admin-btn-ghost admin-btn-sm"
                            title="Modifier"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => onToggleStatus(code)}
                            className="admin-btn admin-btn-ghost admin-btn-sm"
                            title={
                              code.status === 'ACTIVE' ? 'Désactiver' : 'Activer'
                            }
                            disabled={code.status === 'EXPIRED'}
                          >
                            {code.status === 'ACTIVE' ? (
                              <Ban className="w-4 h-4" />
                            ) : (
                              <CheckCircle2 className="w-4 h-4" />
                            )}
                          </button>
                          <button
                            type="button"
                            onClick={() => onDelete(code)}
                            className="admin-btn admin-btn-ghost admin-btn-sm"
                            title="Supprimer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <AdminEmptyState
            icon={Gift}
            title="Aucun code"
            description={
              statusFilter
                ? 'Aucun code pour ce filtre. Essayez un autre statut.'
                : 'Créez un code pour les souscriptions APE Sénégal.'
            }
            action={
              <button
                type="button"
                onClick={onCreateClick}
                className="admin-btn admin-btn-primary"
              >
                <Gift className="w-4 h-4" />
                Créer un code
              </button>
            }
          />
        )}
      </AdminPanel>
    </div>
  )
}
