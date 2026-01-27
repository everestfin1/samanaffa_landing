import { createFileRoute, useNavigate } from '@tanstack/react-router';
import * as React from 'react';
import PageHeader from '../../../components/admin/layout/PageHeader';
import { DataTable } from '../../../components/admin/data-display/DataTable/DataTable';
import StatCard from '../../../components/admin/data-display/StatCard';
import { createApeSubscriptionColumns, type ApeSubscription } from './columns';
import { requireAdminAuth } from '../../../components/admin/hooks/useAdminAuth';
import { Landmark, CheckCircle, XCircle, Wallet } from 'lucide-react';
import type { StatusOption } from '../../../components/admin/data-display/DataTable/DataTableToolbar';
import Sheet from '../../../components/admin/feedback/Sheet';
import Badge from '../../../components/admin/data-display/Badge';
import Select from '../../../components/admin/forms/Select';
import { 
  User, 
  Phone, 
  Mail, 
  Globe, 
  Building2, 
  Calendar, 
  Hash, 
  CreditCard,
  FileText,
  ShieldCheck
} from 'lucide-react';
import { normalizeStatusParam } from '../../../components/admin/utils/searchParams';
import { 
  apeSubscriptionStatusLabels, 
  apeSubscriptionStatusOptions 
} from '../../../components/admin/utils/statusLabels';
import { getStatusVariant } from '../../../components/admin/utils/statusVariants';
import { useApeSubscriptions, useUpdateApeSubscription } from './queries';

export const Route = createFileRoute('/admin/ape-subscriptions/')({
  beforeLoad: requireAdminAuth,
  validateSearch: (search) => {
    const page = Number(search.page) || 1;
    const pageSize = Number(search.pageSize) || 25;
    const q = typeof search.q === 'string' ? search.q : '';
    const status = normalizeStatusParam(search.status);
    const country = typeof search.country === 'string' ? search.country : '';
    const date = typeof search.date === 'string' ? search.date : '';

    return {
      page: Math.max(1, page),
      pageSize: [10, 25, 50, 100].includes(pageSize) ? pageSize : 25,
      q,
      status,
      country,
      date,
    };
  },
  component: ApeSubscriptionsPage,
});

function ApeSubscriptionsPage() {
  const navigate = useNavigate({ from: Route.fullPath });
  const { page, pageSize, q, status, country, date } = Route.useSearch();
  const [selectedSubscriptionId, setSelectedSubscriptionId] = React.useState<string | null>(null);
  const [editStatus, setEditStatus] = React.useState<string>('');
  const [editProviderTransactionId, setEditProviderTransactionId] = React.useState<string>('');
  const [editAdminNotes, setEditAdminNotes] = React.useState<string>('');

  const { data } = useApeSubscriptions({ page, pageSize, q, status, country, date })
  const updateMutation = useUpdateApeSubscription()
  const stats = data?.stats
  const pagination = data?.pagination

  const selectedApiSubscription = React.useMemo(() => {
    if (!selectedSubscriptionId) return null
    return (data?.subscriptions ?? []).find((s) => s.id === selectedSubscriptionId) ?? null
  }, [data?.subscriptions, selectedSubscriptionId])

  const subscriptions: ApeSubscription[] = React.useMemo(() => {
    return (data?.subscriptions ?? []).map((s) => ({
      id: s.id,
      user: `${s.prenom} ${s.nom}`.trim(),
      plan: s.trancheInteresse,
      amount: Number(s.montantCfa),
      status: s.status,
      startDate: s.createdAt,
    }))
  }, [data?.subscriptions])

  const total = pagination?.total ?? subscriptions.length
  const totalPages = pagination?.totalPages ?? 1
  const currentPage = pagination?.page ?? page

  const volumeLabel = React.useMemo(() => {
    const value = stats?.totalVolume ?? 0
    return `${Math.round(value).toLocaleString('fr-FR')} FCFA`
  }, [stats?.totalVolume])

  const columns = React.useMemo(
    () => createApeSubscriptionColumns((id) => setSelectedSubscriptionId(id)),
    []
  );

  React.useEffect(() => {
    if (!selectedApiSubscription) return
    setEditStatus(selectedApiSubscription.status ?? '')
    setEditProviderTransactionId(selectedApiSubscription.providerTransactionId ?? '')
    setEditAdminNotes(selectedApiSubscription.adminNotes ?? '')
  }, [selectedApiSubscription])

  const handleCloseSheet = () => {
    setSelectedSubscriptionId(null)
  }

  const handleSave = async () => {
    if (!selectedApiSubscription) return

    await updateMutation.mutateAsync({
      id: selectedApiSubscription.id,
      status: editStatus,
      providerTransactionId: editProviderTransactionId ? editProviderTransactionId : null,
      adminNotes: editAdminNotes ? editAdminNotes : null,
    })
    setSelectedSubscriptionId(null)
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="APE Sénégal"
        description="Gérez les souscriptions au programme APE"
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total souscriptions" value={stats?.total ?? 0} icon={Landmark} color="info" />
        <StatCard label="Paiements réussis" value={stats?.payment_success ?? 0} icon={CheckCircle} color="success" />
        <StatCard label="Paiements échoués" value={stats?.payment_failed ?? 0} icon={XCircle} color="danger" />
        <StatCard label="Volume" value={volumeLabel} icon={Wallet} color="success" />
      </div>
      <DataTable
        columns={columns}
        data={subscriptions}
        toolbarProps={{
          search: q,
          onSearchChange: (value) =>
            navigate({
              search: (prev) => ({ ...prev, q: value, page: 1 }),
              replace: true,
            }),
          status,
          onStatusChange: (value) =>
            navigate({
              search: (prev) => ({ ...prev, status: value, page: 1 }),
              replace: true,
            }),
          date,
          onDateChange: (value) =>
            navigate({
              search: (prev) => ({ ...prev, date: value, page: 1 }),
              replace: true,
            }),
          statusOptions: apeSubscriptionStatusOptions,
          searchPlaceholder: 'Rechercher par utilisateur, plan...',
          facetedFilters: [
            {
              columnId: 'country',
              label: 'Pays',
              options: [
                { label: 'Tous', value: '' },
                { label: 'Sénégal', value: 'SENEGAL' },
                { label: 'Togo', value: 'TOGO' },
              ],
              value: country,
              onChange: (value) =>
                navigate({
                  search: (prev) => ({ ...prev, country: value, page: 1 }),
                  replace: true,
                }),
            },
          ],
        }}
        paginationProps={{
          page: currentPage,
          pageSize,
          total,
          totalPages,
          onPageChange: (nextPage) =>
            navigate({
              search: (prev) => ({ ...prev, page: nextPage }),
              replace: true,
            }),
          onPageSizeChange: (nextPageSize) =>
            navigate({
              search: (prev) => ({ ...prev, pageSize: nextPageSize, page: 1 }),
              replace: true,
            }),
        }}
      />

      <Sheet
        isOpen={!!selectedSubscriptionId}
        onClose={handleCloseSheet}
        title="Détails de la souscription"
        description={selectedApiSubscription?.referenceNumber}
        footer={
          <div className="flex justify-end gap-3 px-6 py-4 bg-slate-50 border-t border-slate-100 rounded-b-2xl">
            <button
              onClick={handleCloseSheet}
              className="px-6 py-2.5 text-[14px] font-black text-slate-600 hover:text-slate-900 transition-all"
            >
              Annuler
            </button>
            <button
              onClick={handleSave}
              disabled={!selectedApiSubscription || updateMutation.isPending}
              className="sama-button sama-button-primary px-8 py-2.5 text-[14px] font-black"
            >
              {updateMutation.isPending ? 'Enregistrement...' : 'Enregistrer les modifications'}
            </button>
          </div>
        }
      >
        {selectedApiSubscription && (
          <div className="flex flex-col h-full overflow-hidden">
            <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
              {/* Status & Highlights */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm">
                      <Hash className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Montant Total</p>
                      <p className="text-[18px] font-black text-slate-900">
                        {Number(selectedApiSubscription.montantCfa).toLocaleString('fr-FR')} FCFA
                      </p>
                    </div>
                  </div>
                  <div className="flex">
                    <Badge variant={getStatusVariant(selectedApiSubscription.status, 'apeSubscription')}>
                      {apeSubscriptionStatusLabels[selectedApiSubscription.status] || selectedApiSubscription.status}
                    </Badge>
                  </div>
                </div>
                <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm">
                      <Calendar className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Date Création</p>
                      <p className="text-[15px] font-bold text-slate-900">
                        {new Date(selectedApiSubscription.createdAt).toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                  <p className="text-[13px] font-medium text-slate-500">
                    Heure: {new Date(selectedApiSubscription.createdAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>

              {/* Client Info */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 px-1">
                  <User className="w-4 h-4 text-emerald-600" />
                  <h3 className="text-[14px] font-black text-slate-900 uppercase tracking-wider">Informations Client</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
                  <div className="space-y-1">
                    <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Nom Complet</p>
                    <p className="text-[15px] font-bold text-slate-900">
                      {selectedApiSubscription.civilite} {selectedApiSubscription.prenom} {selectedApiSubscription.nom}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Email</p>
                    <div className="flex items-center gap-2 text-slate-700">
                      <Mail className="w-3.5 h-3.5 text-slate-400" />
                      <p className="text-[14px] font-medium truncate">{selectedApiSubscription.email}</p>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Téléphone</p>
                    <div className="flex items-center gap-2 text-slate-700">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      <p className="text-[14px] font-medium">{selectedApiSubscription.telephone}</p>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Localisation</p>
                    <div className="flex items-center gap-2 text-slate-700">
                      <Globe className="w-3.5 h-3.5 text-slate-400" />
                      <p className="text-[14px] font-medium truncate">
                        {selectedApiSubscription.ville}, {selectedApiSubscription.paysResidence}
                      </p>
                    </div>
                  </div>
                  <div className="md:col-span-2 space-y-1 pt-2 border-t border-slate-50">
                    <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Profession</p>
                    <div className="flex items-center gap-2 text-slate-700">
                      <Building2 className="w-3.5 h-3.5 text-slate-400" />
                      <p className="text-[14px] font-medium">{selectedApiSubscription.categorieSocioprofessionnelle}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Admin Actions Form */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 px-1">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <h3 className="text-[14px] font-black text-slate-900 uppercase tracking-wider">Gestion Administrative</h3>
                </div>
                <div className="bg-slate-50/50 rounded-2xl p-6 border border-slate-100 space-y-5">
                  <div className="space-y-2">
                    <label className="text-[12px] font-black text-slate-500 uppercase tracking-widest px-1">
                      Mettre à jour le statut
                    </label>
                    <Select
                      value={editStatus}
                      onChange={setEditStatus}
                      options={apeSubscriptionStatusOptions.filter(o => o.value !== '')}
                      placeholder="Choisir un nouveau statut"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[12px] font-black text-slate-500 uppercase tracking-widest px-1">
                      ID Transaction Opérateur
                    </label>
                    <div className="relative group">
                      <CreditCard className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                      <input
                        value={editProviderTransactionId}
                        onChange={(e) => setEditProviderTransactionId(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 bg-white text-[14px] font-medium text-slate-900 shadow-sm focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all placeholder:text-slate-300"
                        placeholder="ex: CI12345678"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[12px] font-black text-slate-500 uppercase tracking-widest px-1">
                      Notes Internes
                    </label>
                    <div className="relative group">
                      <FileText className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                      <textarea
                        value={editAdminNotes}
                        onChange={(e) => setEditAdminNotes(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 min-h-[120px] rounded-xl border border-slate-200 bg-white text-[14px] font-medium text-slate-900 shadow-sm focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all placeholder:text-slate-300 resize-none"
                        placeholder="Ajouter des précisions sur cette intervention..."
                      />
                    </div>
                  </div>

                  {updateMutation.isError && (
                    <div className="flex items-center gap-3 px-4 py-3 rounded-xl border border-rose-100 bg-rose-50 text-[13px] font-bold text-rose-600 animate-in fade-in slide-in-from-top-2">
                      <div className="w-5 h-5 rounded-full bg-rose-100 flex items-center justify-center flex-shrink-0">
                        <Hash className="w-3 h-3" />
                      </div>
                      Erreur lors de la mise à jour des informations
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </Sheet>
    </div>
  );
}
