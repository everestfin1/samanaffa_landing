import { createFileRoute, useNavigate } from '@tanstack/react-router'
import * as React from 'react'
import PageHeader from '../../../components/admin/layout/PageHeader'
import StatCard from '../../../components/admin/data-display/StatCard'
import { 
  FileSpreadsheet, 
  CheckCircle, 
  AlertCircle, 
  XCircle, 
  Upload, 
  Search,
  History,
  ChevronRight,
  Database,
  ArrowRightLeft,
  FileCheck
} from 'lucide-react'
import {
  analyzeReconciliation,
  applyReconciliation,
  type IntouchTransaction,
  type ReconciliationMatch,
  type ReconciliationResult,
} from './queries'

export const Route = createFileRoute('/admin/reconciliation/')({
  component: ReconciliationPage,
});

function ReconciliationPage() {
  const navigate = useNavigate();
  const [fileName, setFileName] = React.useState<string | null>(null)
  const [parsedTransactions, setParsedTransactions] = React.useState<IntouchTransaction[]>([])
  const [analyzing, setAnalyzing] = React.useState(false)
  const [applying, setApplying] = React.useState(false)
  const [result, setResult] = React.useState<ReconciliationResult | null>(null)
  const [selectedMatches, setSelectedMatches] = React.useState<Set<string>>(new Set())
  const [analyzeError, setAnalyzeError] = React.useState<string | null>(null)
  const [applyError, setApplyError] = React.useState<string | null>(null)
  const [applySuccess, setApplySuccess] = React.useState<string | null>(null)

  const toggleMatch = (ref: string) => {
    setSelectedMatches((prev) => {
      const next = new Set(prev)
      if (next.has(ref)) next.delete(ref)
      else next.add(ref)
      return next
    })
  }

  const toggleAll = () => {
    if (!result) return

    setSelectedMatches((prev) => {
      if (prev.size === result.matches.length) return new Set()
      return new Set(result.matches.map((m) => m.apeReferenceNumber))
    })
  }

  const onFileChange: React.ChangeEventHandler<HTMLInputElement> = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    setFileName(file.name)
    setAnalyzeError(null)
    setApplyError(null)
    setApplySuccess(null)
    const text = await file.text()
    const parsed = parseIntouchCsv(text)
    setParsedTransactions(parsed)
    setResult(null)
    setSelectedMatches(new Set())
  }

  const onAnalyze = async () => {
    if (parsedTransactions.length === 0) return

    setAnalyzing(true)
    setAnalyzeError(null)
    setApplyError(null)
    setApplySuccess(null)
    try {
      const res = await analyzeReconciliation(parsedTransactions)
      setResult(res.result)

      const autoSelected = new Set(
        res.result.matches.filter((m) => m.matchType === 'exact').map((m) => m.apeReferenceNumber)
      )
      setSelectedMatches(autoSelected)
    } catch (e) {
      setAnalyzeError('Erreur lors de l\'analyse du fichier. Vérifiez le format CSV et réessayez.')
    } finally {
      setAnalyzing(false)
    }
  }

  const onApply = async () => {
    if (!result) return
    if (selectedMatches.size === 0) return

    const matchesToApply: ReconciliationMatch[] = result.matches.filter((m) => selectedMatches.has(m.apeReferenceNumber))

    setApplying(true)
    setApplyError(null)
    setApplySuccess(null)
    try {
      const res = await applyReconciliation(matchesToApply)
      if (res.success) {
        setApplySuccess(`Réconciliation terminée: ${res.updated} souscriptions mises à jour.`)
      }
    } catch (e) {
      setApplyError('Erreur lors de la réconciliation. Réessayez ou vérifiez votre sélection.')
    } finally {
      setApplying(false)
    }
  }

  return (
    <div className="space-y-8 max-w-[1600px] mx-auto">
      <PageHeader
        title="Réconciliation"
        description="Réconciliez les transactions avec Intouch"
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Stats & Table */}
        <div className="lg:col-span-2 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <StatCard label="Total CSV" value={result?.summary.total ?? 0} icon={FileSpreadsheet} color="info" />
            <StatCard label="Matches Exacts" value={result?.summary.exact ?? 0} icon={CheckCircle} color="success" />
            <StatCard label="Écarts" value={result?.summary.amountMismatch ?? 0} icon={AlertCircle} color="warning" />
            <StatCard label="Inconnus" value={result?.summary.notFound ?? 0} icon={XCircle} color="danger" />
          </div>

          {result ? (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200/50 overflow-hidden">
              <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h2 className="text-[18px] font-bold text-slate-900">Résultats de l'analyse</h2>
                  <p className="text-xs font-bold text-slate-400 mt-1">{selectedMatches.size} sélectionnés pour réconciliation</p>
                </div>
                <div className="flex gap-2">
                  <button 
                    type="button" 
                    className="px-4 py-2 text-[13px] font-black text-slate-600 hover:bg-slate-50 rounded-xl transition-all"
                    onClick={toggleAll}
                  >
                    {selectedMatches.size === result.matches.length ? 'Désélectionner tout' : 'Tout sélectionner'}
                  </button>
                  <button 
                    type="button" 
                    className="px-6 py-2 text-[13px] font-black text-white bg-[#435933] hover:bg-[#30461f] rounded-xl transition-all shadow-sm disabled:opacity-50"
                    disabled={applying || selectedMatches.size === 0}
                    onClick={onApply}
                  >
                    {applying ? 'Traitement...' : `Réconcilier (${selectedMatches.size})`}
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/50">
                      <th className="px-8 py-4 w-12">
                        <input
                          type="checkbox"
                          className="w-4 h-4 rounded border-slate-300 text-[#435933] focus:ring-[#435933]"
                          checked={selectedMatches.size === result.matches.length && result.matches.length > 0}
                          onChange={toggleAll}
                        />
                      </th>
                      <th className="px-4 py-4 text-[12px] font-black text-slate-400 uppercase tracking-wider">Référence / Client</th>
                      <th className="px-4 py-4 text-[12px] font-black text-slate-400 uppercase tracking-wider">Montant</th>
                      <th className="px-4 py-4 text-[12px] font-black text-slate-400 uppercase tracking-wider text-right px-8">Statut</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {result.matches.map((m) => {
                      const checked = selectedMatches.has(m.apeReferenceNumber)
                      const isMismatch = m.matchType === 'amount_mismatch'
                      return (
                        <tr key={m.apeReferenceNumber} className="hover:bg-slate-50/80 transition-colors group">
                          <td className="px-8 py-5">
                            <input 
                              type="checkbox" 
                              className="w-4 h-4 rounded border-slate-300 text-[#435933] focus:ring-[#435933]"
                              checked={checked} 
                              onChange={() => toggleMatch(m.apeReferenceNumber)} 
                            />
                          </td>
                          <td className="px-4 py-5">
                            <div className="flex flex-col">
                              <span className="text-[14px] font-black text-slate-900 font-mono leading-none">{m.apeReferenceNumber}</span>
                              <span className="text-[12px] font-bold text-slate-400 mt-1">{m.apeTelephone}</span>
                            </div>
                          </td>
                          <td className="px-4 py-5">
                            <div className="flex flex-col">
                              <span className="text-[14px] font-black text-slate-900 leading-none">
                                {m.intouchMontant.toLocaleString('fr-FR')} FCFA
                              </span>
                              {isMismatch && (
                                <span className="text-[11px] font-bold text-amber-600 mt-1">
                                  Attendu: {m.apeMontant.toLocaleString('fr-FR')}
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-4 py-5 text-right px-8">
                            {isMismatch ? (
                              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-50 text-amber-700 text-[12px] font-black border border-amber-100">
                                <AlertCircle className="w-3.5 h-3.5" /> Écart
                              </div>
                            ) : (
                              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-50 text-[#435933] text-[12px] font-black border border-emerald-100">
                                <CheckCircle className="w-3.5 h-3.5" /> Exact
                              </div>
                            )}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200/50 p-12 text-center flex flex-col items-center justify-center space-y-4">
              <div className="w-20 h-20 rounded-3xl bg-slate-50 flex items-center justify-center text-slate-300 border border-slate-100">
                <Search className="w-10 h-10" strokeWidth={1.5} />
              </div>
              <div className="max-w-xs">
                <h3 className="text-[16px] font-black text-slate-900">Prêt pour l'analyse</h3>
                <p className="text-[13px] font-bold text-slate-400 mt-1">
                  Importez un fichier CSV Intouch à droite pour commencer la réconciliation.
                </p>
              </div>
            </div>
          )}

          {result && (
            <div className="grid grid-cols-1 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200/50 overflow-hidden">
                <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center border border-amber-100">
                      <AlertCircle className="w-5 h-5 text-amber-600" />
                    </div>
                    <div>
                      <h3 className="text-[15px] font-black text-slate-900">Transactions Intouch non trouvées dans APE</h3>
                      <p className="text-[12px] font-bold text-slate-400 mt-0.5">{result.notFoundInApe.length} élément(s) orphelins</p>
                    </div>
                  </div>
                </div>
                <div className="p-0">
                  {result.notFoundInApe.length === 0 ? (
                    <div className="p-12 text-center">
                      <p className="text-[14px] font-bold text-slate-400 italic">Toutes les transactions Intouch ont été identifiées dans APE.</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-slate-50/50">
                            <th className="px-8 py-3 text-[11px] font-black text-slate-400 uppercase tracking-wider">ID Partenaire</th>
                            <th className="px-4 py-3 text-[11px] font-black text-slate-400 uppercase tracking-wider">Téléphone</th>
                            <th className="px-8 py-3 text-[11px] font-black text-slate-400 uppercase tracking-wider text-right">Montant</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {result.notFoundInApe.slice(0, 25).map((t) => (
                            <tr key={t.idTransaction} className="hover:bg-slate-50/80 transition-colors">
                              <td className="px-8 py-4 font-mono text-[13px] font-bold text-slate-700">{t.idPartenaireDistributeur}</td>
                              <td className="px-4 py-4 font-mono text-[13px] text-slate-500">{t.telephone}</td>
                              <td className="px-8 py-4 text-[14px] font-black text-slate-900 text-right">{Number(t.montant).toLocaleString('fr-FR')} FCFA</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      {result.notFoundInApe.length > 25 && (
                        <div className="px-8 py-4 bg-slate-50/50 border-t border-slate-100 text-[12px] font-bold text-slate-400 text-center uppercase tracking-widest">
                          + {result.notFoundInApe.length - 25} autres éléments masqués
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-slate-200/50 overflow-hidden">
                <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center border border-rose-100">
                      <Database className="w-5 h-5 text-rose-600" />
                    </div>
                    <div>
                      <h3 className="text-[15px] font-black text-slate-900">Souscriptions APE non trouvées dans Intouch</h3>
                      <p className="text-[12px] font-bold text-slate-400 mt-0.5">{result.notFoundInIntouch.length} élément(s) en attente</p>
                    </div>
                  </div>
                </div>
                <div className="p-8">
                  {result.notFoundInIntouch.length === 0 ? (
                    <div className="text-center py-4">
                      <p className="text-[14px] font-bold text-slate-400 italic">Toutes les souscriptions APE sont présentes dans le rapport Intouch.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                      {result.notFoundInIntouch.slice(0, 40).map((ref) => (
                        <div key={ref} className="flex items-center justify-center rounded-xl border border-slate-100 bg-slate-50/50 px-4 py-2.5 hover:bg-white hover:border-emerald-200 hover:shadow-sm transition-all group">
                          <span className="font-mono text-[12px] font-black text-slate-600 group-hover:text-emerald-700">{ref}</span>
                        </div>
                      ))}
                      {result.notFoundInIntouch.length > 40 && (
                        <div className="flex items-center justify-center rounded-xl border border-dashed border-slate-200 bg-white px-4 py-2.5">
                          <span className="text-[11px] font-black text-slate-400 uppercase">+{result.notFoundInIntouch.length - 40} autres</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Actions */}
        <div className="space-y-8">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200/50 flex flex-col">
            <div className="px-8 py-6 border-b border-slate-100">
              <h2 className="text-[18px] font-black text-slate-900">Actions</h2>
            </div>
            <div className="p-6 space-y-4">
              {analyzeError && (
                <div className="rounded-2xl border border-rose-200 bg-rose-50 px-5 py-4 text-[13px] font-bold text-rose-700">
                  {analyzeError}
                </div>
              )}
              {applyError && (
                <div className="rounded-2xl border border-rose-200 bg-rose-50 px-5 py-4 text-[13px] font-bold text-rose-700">
                  {applyError}
                </div>
              )}
              {applySuccess && (
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-[13px] font-bold text-[#435933]">
                  {applySuccess}
                </div>
              )}

              <div className="relative group">
                <input 
                  type="file" 
                  accept=".csv,text/csv" 
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                  onChange={onFileChange} 
                />
                <div className="w-full flex items-center gap-4 px-5 py-5 text-[15px] font-black text-left rounded-2xl transition-all duration-300 hover:shadow-xl hover:shadow-slate-200/50 hover:-translate-y-1 group bg-slate-50 text-slate-600 border-2 border-dashed border-slate-200 group-hover:border-[#435933]/30">
                  <div className="w-11 h-11 rounded-xl bg-white flex items-center justify-center flex-shrink-0 shadow-sm group-hover:rotate-6 transition-transform">
                    <Upload className="w-6 h-6 text-[#435933]" strokeWidth={2.5} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="truncate">{fileName ?? 'Importer CSV'}</p>
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">Rapport Intouch</p>
                  </div>
                </div>
              </div>

              <button 
                type="button"
                className="w-full flex items-center gap-4 px-5 py-5 text-[15px] font-black text-left rounded-2xl transition-all duration-300 hover:shadow-xl hover:shadow-[#435933]/5 hover:-translate-y-1 group border-2 border-transparent disabled:opacity-50 disabled:hover:translate-y-0"
                style={{ backgroundColor: '#F2F8F4', color: '#435933' }}
                disabled={analyzing || parsedTransactions.length === 0}
                onClick={onAnalyze}
              >
                <div className="w-11 h-11 rounded-xl bg-white flex items-center justify-center flex-shrink-0 shadow-sm group-hover:rotate-6 transition-transform">
                  <Search className="w-6 h-6" strokeWidth={2.5} />
                </div>
                <span className="flex-1">{analyzing ? 'Analyse...' : 'Lancer l\'analyse'}</span>
                <ChevronRight className="w-5 h-5 opacity-40 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
              </button>

              <button 
                type="button"
                className="w-full flex items-center gap-4 px-5 py-5 text-[15px] font-black text-left rounded-2xl transition-all duration-300 hover:shadow-xl hover:shadow-[#0284C7]/5 hover:-translate-y-1 group border-2 border-transparent"
                style={{ backgroundColor: '#F0F9FF', color: '#0284C7' }}
                onClick={() => navigate({ 
                  to: '/admin/ape-subscriptions',
                  search: { page: 1, pageSize: 25, q: '', status: '', date: '' }
                })}
              >
                <div className="w-11 h-11 rounded-xl bg-white flex items-center justify-center flex-shrink-0 shadow-sm group-hover:rotate-6 transition-transform">
                  <History className="w-6 h-6" strokeWidth={2.5} />
                </div>
                <span className="flex-1">Voir historique APE</span>
                <ChevronRight className="w-5 h-5 opacity-40 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
              </button>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-200/50 p-6">
            <h3 className="text-[14px] font-black text-slate-900 uppercase tracking-widest mb-4">Informations</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-[13px] font-bold text-slate-500">
                <div className="w-1.5 h-1.5 rounded-full bg-[#435933] mt-1.5 flex-shrink-0" />
                Le séparateur CSV doit être le point-virgule (;)
              </li>
              <li className="flex items-start gap-3 text-[13px] font-bold text-slate-500">
                <div className="w-1.5 h-1.5 rounded-full bg-[#435933] mt-1.5 flex-shrink-0" />
                La colonne "ID Partenaire DIST" est utilisée pour le matching
              </li>
              <li className="flex items-start gap-3 text-[13px] font-bold text-slate-500">
                <div className="w-1.5 h-1.5 rounded-full bg-[#435933] mt-1.5 flex-shrink-0" />
                Les correspondances exactes sont pré-sélectionnées par défaut
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

function parseIntouchCsv(text: string): IntouchTransaction[] {
  const lines = text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0)

  if (lines.length === 0) return []

  const header = lines[0].split(';').map((h) => h.trim().toLowerCase())
  const idx = (name: string) => header.indexOf(name)

  const idxId = idx('id')
  const idxIdTransaction = idx('idtransaction')
  const idxTelephone = header.findIndex((h) => h.includes('telephone'))
  const idxMontant = header.findIndex((h) => h.includes('montant'))
  const idxDate = header.findIndex((h) => h.includes('date'))
  const idxIdPartenaire = header.findIndex((h) => h.includes('id partenaire') || h.includes('id_partenaire') || h.includes('id partenaire dist'))

  const out: IntouchTransaction[] = []

  for (const line of lines.slice(1)) {
    const cells = line.split(';')

    const id = (idxId >= 0 ? cells[idxId] : '')?.trim()
    const idTransaction = (idxIdTransaction >= 0 ? cells[idxIdTransaction] : '')?.trim()
    const telephone = (idxTelephone >= 0 ? cells[idxTelephone] : '')?.trim()
    const montantRaw = (idxMontant >= 0 ? cells[idxMontant] : '')?.trim().replace(',', '.')
    const date = (idxDate >= 0 ? cells[idxDate] : '')?.trim()
    const idPartenaireDistributeur = (idxIdPartenaire >= 0 ? cells[idxIdPartenaire] : '')?.trim()

    if (!idPartenaireDistributeur) continue

    const montant = Number(montantRaw)

    out.push({
      id: id || crypto.randomUUID(),
      idTransaction,
      telephone,
      montant: Number.isFinite(montant) ? montant : 0,
      date,
      idPartenaireDistributeur,
    })
  }

  return out
}

