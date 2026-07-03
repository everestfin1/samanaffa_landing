'use client'

import { useState } from 'react'
import { Upload, CheckCircle, AlertCircle, XCircle, FileSpreadsheet, Clock, CalendarSearch } from 'lucide-react'
import { useAdminData } from '@/lib/admin/AdminDataProvider'

interface IntouchTransaction {
  id: string
  idTransaction: string
  telephone: string
  montant: number
  service: string
  date: string
  idPartenaireDistributeur: string
  reference: string
  statut: string
}

type MatchType = 'exact' | 'amount_mismatch' | 'callback_missing'

interface ReconciliationMatch {
  referenceNumber: string
  intentId: string
  phone: string
  dbAmount: number
  dbStatus: string
  intouchAmount: number
  intouchTransactionId: string
  intouchDate: string
  matchType: MatchType
  discrepancy?: number
}

interface PendingIntent {
  referenceNumber: string
  intentId: string
  phone: string
  amount: number
  status: string
  createdAt: string
}

interface ReconciliationResult {
  matches: ReconciliationMatch[]
  notFoundInDb: IntouchTransaction[]
  pendingInDb: PendingIntent[]
  summary: {
    total: number
    exact: number
    amountMismatch: number
    callbackMissing: number
    notFoundInDb: number
    pendingInDb: number
  }
}

const MATCH_LABEL: Record<MatchType, string> = {
  exact: 'Confirmé',
  amount_mismatch: 'Écart montant',
  callback_missing: 'Callback manquant',
}

interface IntouchReconciliationProps {
  onReconcileSuccess?: () => void | Promise<void>
}

export default function IntouchReconciliation({ onReconcileSuccess }: IntouchReconciliationProps) {
  const { notifyError, notifySuccess } = useAdminData()
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [reconciling, setReconciling] = useState(false)
  const [result, setResult] = useState<ReconciliationResult | null>(null)
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')

  const parseIntouchCSV = (csvText: string): IntouchTransaction[] => {
    const lines = csvText.split('\n').filter((line) => line.trim())
    if (lines.length < 2) return []
    const headers = lines[0].split(';')
    const transactions: IntouchTransaction[] = []

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(';')
      if (values.length < headers.length) continue

      const transaction: IntouchTransaction = {
        id: values[0]?.trim() || '',
        idTransaction: values[1]?.trim() || '',
        telephone: values[2]?.trim() || '',
        montant: parseFloat(values[3]?.replace(',', '.') || '0'),
        service: values[4]?.trim() || '',
        date: values[10]?.trim() || '',
        idPartenaireDistributeur: values[16]?.trim() || '',
        reference: values[17]?.trim() || '',
        statut: values[13]?.trim() || '',
      }

      // Sama Naffa deposits only (SN-…)
      if (transaction.idPartenaireDistributeur.startsWith('SN-')) {
        transactions.push(transaction)
      }
    }
    return transactions
  }

  const applyResult = (data: { success: boolean; result?: ReconciliationResult; error?: string }) => {
    if (data.success && data.result) {
      setResult(data.result)
      const preselect = new Set<string>(
        data.result.matches
          .filter((m) => m.matchType === 'callback_missing')
          .map((m) => m.intentId),
      )
      setSelected(preselect)
    } else {
      notifyError(data.error ?? 'Erreur lors de la réconciliation')
    }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0]
    if (!uploadedFile) return
    setFile(uploadedFile)
    setLoading(true)
    setResult(null)
    setSelected(new Set())

    try {
      const text = await uploadedFile.text()
      const intouchTransactions = parseIntouchCSV(text)
      const token = localStorage.getItem('admin_token')
      const response = await fetch('/api/admin/reconciliation', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ intouchTransactions }),
      })
      applyResult(await response.json())
    } catch {
      notifyError("Erreur lors de l'analyse du fichier CSV")
    } finally {
      setLoading(false)
    }
  }

  const handleDateScan = async () => {
    if (!dateFrom && !dateTo) {
      notifyError('Sélectionnez au moins une date')
      return
    }
    setFile(null)
    setLoading(true)
    setResult(null)
    setSelected(new Set())
    try {
      const token = localStorage.getItem('admin_token')
      const response = await fetch('/api/admin/reconciliation', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ dateFrom: dateFrom || undefined, dateTo: dateTo || undefined }),
      })
      applyResult(await response.json())
    } catch {
      notifyError('Erreur lors de l’analyse par période')
    } finally {
      setLoading(false)
    }
  }

  const handleReconcile = async () => {
    if (!result) return
    const toReconcile = result.matches.filter((m) => selected.has(m.intentId))
    if (toReconcile.length === 0) {
      notifyError('Veuillez sélectionner au moins une transaction à confirmer')
      return
    }
    setReconciling(true)
    try {
      const token = localStorage.getItem('admin_token')
      const response = await fetch('/api/admin/reconciliation', {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ matches: toReconcile }),
      })
      const data = await response.json()
      if (!data.success) throw new Error(data.error)
      await onReconcileSuccess?.()
      notifySuccess(`${data.updated} dépôt(s) confirmé(s) avec succès`)
      setFile(null)
      setResult(null)
      setSelected(new Set())
    } catch {
      notifyError('Erreur lors de la réconciliation')
    } finally {
      setReconciling(false)
    }
  }

  const toggle = (intentId: string) => {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(intentId)) next.delete(intentId)
      else next.add(intentId)
      return next
    })
  }

  const confirmable = result?.matches.filter((m) => m.matchType !== 'exact') ?? []

  return (
    <div className="space-y-6">
      {/* Inputs */}
      <div className="admin-grid admin-grid-2">
        <div className="admin-card">
          <div className="admin-card-header">
            <div>
              <h3 className="admin-card-title">
                <FileSpreadsheet className="admin-card-title-icon" />
                Import CSV Intouch
              </h3>
              <p className="admin-card-subtitle">
                Rapprochez les paiements Intouch avec les dépôts Sama Naffa (références SN-…)
              </p>
            </div>
          </div>
          <div className="admin-card-content">
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-[var(--admin-bg-tertiary)] transition-colors border-[var(--admin-border-light)]">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Upload className="w-10 h-10 mb-3 text-[var(--admin-text-muted)]" />
                <p className="mb-2 text-sm text-[var(--admin-text-secondary)]">
                  <span className="font-semibold">Cliquez pour télécharger</span> ou glissez-déposez
                </p>
                <p className="text-xs text-[var(--admin-text-muted)]">Fichier CSV Intouch (RapportExcel_*.csv)</p>
              </div>
              <input type="file" className="hidden" accept=".csv" onChange={handleFileUpload} disabled={loading || reconciling} />
            </label>
            {file && (
              <div className="mt-4 text-sm text-[var(--admin-text-secondary)]">
                📄 Fichier: <span className="font-medium">{file.name}</span>
              </div>
            )}
          </div>
        </div>

        <div className="admin-card">
          <div className="admin-card-header">
            <div>
              <h3 className="admin-card-title">
                <CalendarSearch className="admin-card-title-icon" />
                Analyse par période
              </h3>
              <p className="admin-card-subtitle">Repérez les dépôts non confirmés (PENDING / PROCESSING) sur une période</p>
            </div>
          </div>
          <div className="admin-card-content space-y-3">
            <div className="flex gap-3">
              <label className="flex-1 text-sm">
                <span className="block mb-1 text-[var(--admin-text-secondary)]">Du</span>
                <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className="w-full rounded-lg border border-[var(--admin-border-light)] px-3 py-2 text-sm" />
              </label>
              <label className="flex-1 text-sm">
                <span className="block mb-1 text-[var(--admin-text-secondary)]">Au</span>
                <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} className="w-full rounded-lg border border-[var(--admin-border-light)] px-3 py-2 text-sm" />
              </label>
            </div>
            <button onClick={handleDateScan} disabled={loading || reconciling} className="admin-btn admin-btn-secondary admin-btn-sm">
              Analyser la période
            </button>
          </div>
        </div>
      </div>

      {loading && (
        <div className="admin-card">
          <div className="admin-card-content text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--admin-primary)] mx-auto mb-4" />
            <p className="text-[var(--admin-text-secondary)]">Analyse en cours...</p>
          </div>
        </div>
      )}

      {result && (
        <>
          <div className="admin-grid admin-grid-4">
            <div className="admin-stat-card" data-color="emerald">
              <div className="admin-stat-header">
                <span className="admin-stat-label">Confirmés</span>
                <div className="admin-stat-icon"><CheckCircle className="w-5 h-5" /></div>
              </div>
              <div className="admin-stat-value colored">{result.summary.exact}</div>
            </div>
            <div className="admin-stat-card" data-color="sky">
              <div className="admin-stat-header">
                <span className="admin-stat-label">Callback manquant</span>
                <div className="admin-stat-icon"><Clock className="w-5 h-5" /></div>
              </div>
              <div className="admin-stat-value colored">{result.summary.callbackMissing}</div>
            </div>
            <div className="admin-stat-card" data-color="amber">
              <div className="admin-stat-header">
                <span className="admin-stat-label">Écarts de montant</span>
                <div className="admin-stat-icon"><AlertCircle className="w-5 h-5" /></div>
              </div>
              <div className="admin-stat-value colored">{result.summary.amountMismatch}</div>
            </div>
            <div className="admin-stat-card" data-color="rose">
              <div className="admin-stat-header">
                <span className="admin-stat-label">Introuvables / en attente</span>
                <div className="admin-stat-icon"><XCircle className="w-5 h-5" /></div>
              </div>
              <div className="admin-stat-value colored">{result.summary.notFoundInDb + result.summary.pendingInDb}</div>
            </div>
          </div>

          {confirmable.length > 0 && (
            <div className="admin-card">
              <div className="admin-card-header">
                <div className="flex items-center justify-between w-full">
                  <h3 className="admin-card-title">À confirmer ({selected.size} sélectionnés)</h3>
                  <button onClick={handleReconcile} disabled={reconciling || selected.size === 0} className="admin-btn admin-btn-success admin-btn-sm">
                    {reconciling ? 'Confirmation...' : `Confirmer (${selected.size})`}
                  </button>
                </div>
              </div>
              <div className="admin-card-content p-0">
                <div className="admin-table-wrapper">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th className="w-12" />
                        <th>Référence</th>
                        <th>Téléphone</th>
                        <th>Montant SN</th>
                        <th>Montant Intouch</th>
                        <th>Transaction ID</th>
                        <th>Statut DB</th>
                        <th>Type</th>
                      </tr>
                    </thead>
                    <tbody>
                      {confirmable.map((m) => (
                        <tr key={m.intentId}>
                          <td>
                            <input type="checkbox" checked={selected.has(m.intentId)} onChange={() => toggle(m.intentId)} className="rounded" />
                          </td>
                          <td className="admin-table-cell-mono">{m.referenceNumber}</td>
                          <td className="admin-table-cell-mono">{m.phone}</td>
                          <td className="admin-table-cell-primary">{m.dbAmount.toLocaleString('fr-FR')} FCFA</td>
                          <td className={m.matchType === 'amount_mismatch' ? 'text-[var(--admin-amber)]' : ''}>
                            {m.intouchAmount.toLocaleString('fr-FR')} FCFA
                            {m.discrepancy ? <span className="text-xs block">Écart: {m.discrepancy.toLocaleString('fr-FR')} FCFA</span> : null}
                          </td>
                          <td className="admin-table-cell-mono text-xs">{m.intouchTransactionId}</td>
                          <td className="text-xs">{m.dbStatus}</td>
                          <td>
                            <span className={`admin-badge ${m.matchType === 'amount_mismatch' ? 'admin-badge-warning' : 'admin-badge-info'}`}>
                              {MATCH_LABEL[m.matchType]}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {result.notFoundInDb.length > 0 && (
            <div className="admin-card">
              <div className="admin-card-header">
                <h3 className="admin-card-title">Paiements Intouch sans dépôt correspondant ({result.notFoundInDb.length})</h3>
              </div>
              <div className="admin-card-content p-0">
                <div className="admin-table-wrapper">
                  <table className="admin-table">
                    <thead>
                      <tr><th>Référence</th><th>Téléphone</th><th>Montant</th><th>Transaction ID</th><th>Date</th></tr>
                    </thead>
                    <tbody>
                      {result.notFoundInDb.map((t) => (
                        <tr key={t.idTransaction}>
                          <td className="admin-table-cell-mono">{t.idPartenaireDistributeur}</td>
                          <td className="admin-table-cell-mono">{t.telephone}</td>
                          <td>{t.montant.toLocaleString('fr-FR')} FCFA</td>
                          <td className="admin-table-cell-mono text-xs">{t.idTransaction}</td>
                          <td className="text-xs">{t.date}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {result.pendingInDb.length > 0 && (
            <div className="admin-card">
              <div className="admin-card-header">
                <h3 className="admin-card-title">Dépôts Sama Naffa non confirmés ({result.pendingInDb.length})</h3>
              </div>
              <div className="admin-card-content p-0">
                <div className="admin-table-wrapper">
                  <table className="admin-table">
                    <thead>
                      <tr><th>Référence</th><th>Téléphone</th><th>Montant</th><th>Statut</th><th>Créé le</th></tr>
                    </thead>
                    <tbody>
                      {result.pendingInDb.map((p) => (
                        <tr key={p.intentId}>
                          <td className="admin-table-cell-mono">{p.referenceNumber}</td>
                          <td className="admin-table-cell-mono">{p.phone}</td>
                          <td>{p.amount.toLocaleString('fr-FR')} FCFA</td>
                          <td className="text-xs">{p.status}</td>
                          <td className="text-xs">{new Date(p.createdAt).toLocaleDateString('fr-FR')}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
