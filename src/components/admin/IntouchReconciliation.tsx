'use client'

import { useState } from 'react'
import { Upload, CheckCircle, AlertCircle, XCircle, FileSpreadsheet, Download } from 'lucide-react'

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

interface ReconciliationMatch {
  apeReferenceNumber: string
  apeId: string
  apeTelephone: string
  apeMontant: number
  intouchMontant: number
  intouchTransactionId: string
  intouchDate: string
  matchType: 'exact' | 'amount_mismatch' | 'not_found'
  discrepancy?: number
}

interface ReconciliationResult {
  matches: ReconciliationMatch[]
  notFoundInApe: IntouchTransaction[]
  notFoundInIntouch: string[]
  summary: {
    total: number
    exact: number
    amountMismatch: number
    notFound: number
  }
}

interface IntouchReconciliationProps {
  onReconcile: (matches: ReconciliationMatch[]) => Promise<void>
}

export default function IntouchReconciliation({ onReconcile }: IntouchReconciliationProps) {
  const [file, setFile] = useState<File | null>(null)
  const [parsing, setParsing] = useState(false)
  const [reconciling, setReconciling] = useState(false)
  const [result, setResult] = useState<ReconciliationResult | null>(null)
  const [selectedMatches, setSelectedMatches] = useState<Set<string>>(new Set())

  const parseIntouchCSV = (csvText: string): IntouchTransaction[] => {
    const lines = csvText.split('\n').filter(line => line.trim())
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
      
      // Only include APE transactions (reference starts with APE-)
      if (transaction.idPartenaireDistributeur.startsWith('APE-')) {
        transactions.push(transaction)
      }
    }
    
    return transactions
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0]
    if (!uploadedFile) return

    setFile(uploadedFile)
    setParsing(true)
    setResult(null)
    setSelectedMatches(new Set())

    try {
      const text = await uploadedFile.text()
      const intouchTransactions = parseIntouchCSV(text)

      // Call API to reconcile
      const token = localStorage.getItem('admin_token')
      const response = await fetch('/api/admin/ape-subscriptions/reconcile', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ intouchTransactions }),
      })

      const data = await response.json()
      
      if (data.success) {
        setResult(data.result)
        // Auto-select exact matches
        const exactMatches = new Set<string>(
          data.result.matches
            .filter((m: ReconciliationMatch) => m.matchType === 'exact')
            .map((m: ReconciliationMatch) => m.apeReferenceNumber)
        )
        setSelectedMatches(exactMatches)
      } else {
        alert('Erreur: ' + data.error)
      }
    } catch (error) {
      console.error('Error parsing CSV:', error)
      alert('Erreur lors de l\'analyse du fichier CSV')
    } finally {
      setParsing(false)
    }
  }

  const handleReconcile = async () => {
    if (!result) return

    const matchesToReconcile = result.matches.filter(m => 
      selectedMatches.has(m.apeReferenceNumber)
    )

    if (matchesToReconcile.length === 0) {
      alert('Veuillez sélectionner au moins une transaction à réconcilier')
      return
    }

    setReconciling(true)
    try {
      await onReconcile(matchesToReconcile)
      alert(`✅ ${matchesToReconcile.length} transaction(s) réconciliée(s) avec succès`)
      setFile(null)
      setResult(null)
      setSelectedMatches(new Set())
    } catch (error) {
      console.error('Reconciliation error:', error)
      alert('❌ Erreur lors de la réconciliation')
    } finally {
      setReconciling(false)
    }
  }

  const toggleMatch = (referenceNumber: string) => {
    setSelectedMatches(prev => {
      const newSet = new Set(prev)
      if (newSet.has(referenceNumber)) {
        newSet.delete(referenceNumber)
      } else {
        newSet.add(referenceNumber)
      }
      return newSet
    })
  }

  const toggleAll = () => {
    if (!result) return
    
    if (selectedMatches.size === result.matches.length) {
      setSelectedMatches(new Set<string>())
    } else {
      setSelectedMatches(new Set<string>(result.matches.map(m => m.apeReferenceNumber)))
    }
  }

  return (
    <div className="space-y-6">
      {/* Upload Section */}
      <div className="admin-card">
        <div className="admin-card-header">
          <div>
            <h3 className="admin-card-title">
              <FileSpreadsheet className="admin-card-title-icon" />
              Réconciliation Intouch
            </h3>
            <p className="admin-card-subtitle">
              Importez le rapport CSV depuis le back-office Intouch pour réconcilier les paiements
            </p>
          </div>
        </div>
        <div className="admin-card-content">
          <div className="flex items-center justify-center w-full">
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-[var(--admin-bg-tertiary)] transition-colors border-[var(--admin-border-light)]">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Upload className="w-10 h-10 mb-3 text-[var(--admin-text-muted)]" />
                <p className="mb-2 text-sm text-[var(--admin-text-secondary)]">
                  <span className="font-semibold">Cliquez pour télécharger</span> ou glissez-déposez
                </p>
                <p className="text-xs text-[var(--admin-text-muted)]">
                  Fichier CSV Intouch (RapportExcel_*.csv)
                </p>
              </div>
              <input
                type="file"
                className="hidden"
                accept=".csv"
                onChange={handleFileUpload}
                disabled={parsing || reconciling}
              />
            </label>
          </div>
          {file && (
            <div className="mt-4 text-sm text-[var(--admin-text-secondary)]">
              📄 Fichier: <span className="font-medium">{file.name}</span>
            </div>
          )}
        </div>
      </div>

      {/* Results Section */}
      {parsing && (
        <div className="admin-card">
          <div className="admin-card-content text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--admin-primary)] mx-auto mb-4"></div>
            <p className="text-[var(--admin-text-secondary)]">Analyse du fichier CSV en cours...</p>
          </div>
        </div>
      )}

      {result && (
        <>
          {/* Summary Stats */}
          <div className="admin-grid admin-grid-4">
            <div className="admin-stat-card" data-color="sky">
              <div className="admin-stat-header">
                <span className="admin-stat-label">Total</span>
                <div className="admin-stat-icon"><FileSpreadsheet className="w-5 h-5" /></div>
              </div>
              <div className="admin-stat-value">{result.summary.total}</div>
            </div>
            <div className="admin-stat-card" data-color="emerald">
              <div className="admin-stat-header">
                <span className="admin-stat-label">Correspondances exactes</span>
                <div className="admin-stat-icon"><CheckCircle className="w-5 h-5" /></div>
              </div>
              <div className="admin-stat-value colored">{result.summary.exact}</div>
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
                <span className="admin-stat-label">Non trouvés</span>
                <div className="admin-stat-icon"><XCircle className="w-5 h-5" /></div>
              </div>
              <div className="admin-stat-value colored">{result.summary.notFound}</div>
            </div>
          </div>

          {/* Matches Table */}
          <div className="admin-card">
            <div className="admin-card-header">
              <div className="flex items-center justify-between w-full">
                <h3 className="admin-card-title">
                  Transactions à réconcilier ({selectedMatches.size} sélectionnées)
                </h3>
                <div className="flex gap-2">
                  <button
                    onClick={toggleAll}
                    className="admin-btn admin-btn-secondary admin-btn-sm"
                  >
                    {selectedMatches.size === result.matches.length ? 'Tout désélectionner' : 'Tout sélectionner'}
                  </button>
                  <button
                    onClick={handleReconcile}
                    disabled={reconciling || selectedMatches.size === 0}
                    className="admin-btn admin-btn-success admin-btn-sm"
                  >
                    {reconciling ? 'Réconciliation...' : `Réconcilier (${selectedMatches.size})`}
                  </button>
                </div>
              </div>
            </div>
            <div className="admin-card-content p-0">
              <div className="admin-table-wrapper">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th className="w-12">
                        <input
                          type="checkbox"
                          checked={selectedMatches.size === result.matches.length && result.matches.length > 0}
                          onChange={toggleAll}
                          className="rounded"
                        />
                      </th>
                      <th>Référence APE</th>
                      <th>Téléphone</th>
                      <th>Montant APE</th>
                      <th>Montant Intouch</th>
                      <th>Transaction ID</th>
                      <th>Date</th>
                      <th>Statut</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.matches.map((match) => (
                      <tr key={match.apeReferenceNumber}>
                        <td>
                          <input
                            type="checkbox"
                            checked={selectedMatches.has(match.apeReferenceNumber)}
                            onChange={() => toggleMatch(match.apeReferenceNumber)}
                            className="rounded"
                          />
                        </td>
                        <td className="admin-table-cell-mono">{match.apeReferenceNumber}</td>
                        <td className="admin-table-cell-mono">{match.apeTelephone}</td>
                        <td className="admin-table-cell-primary">
                          {match.apeMontant.toLocaleString('fr-FR')} FCFA
                        </td>
                        <td className={match.matchType === 'amount_mismatch' ? 'text-[var(--admin-amber)]' : ''}>
                          {match.intouchMontant.toLocaleString('fr-FR')} FCFA
                          {match.discrepancy && (
                            <span className="text-xs block">
                              Écart: {match.discrepancy.toLocaleString('fr-FR')} FCFA
                            </span>
                          )}
                        </td>
                        <td className="admin-table-cell-mono text-xs">{match.intouchTransactionId}</td>
                        <td className="text-xs">{new Date(match.intouchDate).toLocaleDateString('fr-FR')}</td>
                        <td>
                          {match.matchType === 'exact' ? (
                            <span className="admin-badge admin-badge-success">
                              <CheckCircle className="w-3 h-3" />
                              Exact
                            </span>
                          ) : (
                            <span className="admin-badge admin-badge-warning">
                              <AlertCircle className="w-3 h-3" />
                              Écart
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
