import { createFileRoute, useNavigate } from '@tanstack/react-router';
import * as React from 'react';
import PageHeader from '../../../components/admin/layout/PageHeader';
import { DataTable } from '../../../components/admin/data-display/DataTable/DataTable';
import StatCard from '../../../components/admin/data-display/StatCard';
import { createSponsorCodeColumns, type SponsorCode } from './columns';
import { requireAdminAuth } from '../../../components/admin/hooks/useAdminAuth';
import { 
  Tag, 
  CheckCircle, 
  XCircle, 
  Users, 
  Calendar, 
  Hash, 
  FileText, 
  Clock, 
  ShieldCheck,
  Plus,
  AlertCircle
} from 'lucide-react';
import type { StatusOption } from '../../../components/admin/data-display/DataTable/DataTableToolbar';
import Badge from '../../../components/admin/data-display/Badge';
import Sheet from '../../../components/admin/feedback/Sheet';
import Select from '../../../components/admin/forms/Select';
import { normalizeStatusParam } from '../../../components/admin/utils/searchParams';
import { 
  sponsorCodeStatusLabels, 
  sponsorCodeStatusOptions 
} from '../../../components/admin/utils/statusLabels';
import { getStatusVariant } from '../../../components/admin/utils/statusVariants';
import { useCreateSponsorCode, useSponsorCodes, useUpdateSponsorCode } from './queries';

export const Route = createFileRoute('/admin/sponsor-codes/')({
  beforeLoad: requireAdminAuth,
  validateSearch: (search) => {
    const page = Number(search.page) || 1;
    const pageSize = Number(search.pageSize) || 25;
    const q = typeof search.q === 'string' ? search.q : '';
    const status = normalizeStatusParam(search.status);
    const date = typeof search.date === 'string' ? search.date : '';

    return {
      page: Math.max(1, page),
      pageSize: [10, 25, 50, 100].includes(pageSize) ? pageSize : 25,
      q,
      status,
      date,
    };
  },
  component: SponsorCodesPage,
});

function SponsorCodesPage() {
  const navigate = useNavigate({ from: Route.fullPath });
  const { page, pageSize, q, status, date } = Route.useSearch();
  const [selectedCodeId, setSelectedCodeId] = React.useState<string | null>(null);
  const [isCreateOpen, setIsCreateOpen] = React.useState(false);
  const [createCode, setCreateCode] = React.useState('');
  const [createDescription, setCreateDescription] = React.useState('');
  const [createMaxUsage, setCreateMaxUsage] = React.useState('');
  const [createExpiresAt, setCreateExpiresAt] = React.useState('');
  const [editStatus, setEditStatus] = React.useState('');
  const [editDescription, setEditDescription] = React.useState('');
  const [editMaxUsage, setEditMaxUsage] = React.useState('');
  const [editExpiresAt, setEditExpiresAt] = React.useState('');

  const { data } = useSponsorCodes({ page, pageSize, q, status, date })
  const createMutation = useCreateSponsorCode()
  const updateMutation = useUpdateSponsorCode()
  const sponsorCodes = (data?.sponsorCodes ?? []) as SponsorCode[]
  const stats = data?.stats
  const pagination = data?.pagination

  const selectedApiCode = React.useMemo(() => {
    if (!selectedCodeId) return null
    return (data?.sponsorCodes ?? []).find((c) => c.id === selectedCodeId) ?? null
  }, [data?.sponsorCodes, selectedCodeId])

  const total = pagination?.total ?? sponsorCodes.length
  const totalPages = pagination?.totalPages ?? 1
  const currentPage = pagination?.page ?? page

  const columns = React.useMemo(
    () => createSponsorCodeColumns((id) => setSelectedCodeId(id)),
    []
  );

  React.useEffect(() => {
    if (!selectedApiCode) return
    setEditStatus(selectedApiCode.status ?? '')
    setEditDescription(selectedApiCode.description ?? '')
    setEditMaxUsage(selectedApiCode.maxUsage === null || selectedApiCode.maxUsage === undefined ? '' : String(selectedApiCode.maxUsage))
    setEditExpiresAt(selectedApiCode.expiresAt ? String(selectedApiCode.expiresAt).slice(0, 10) : '')
  }, [selectedApiCode])

  const openCreate = () => {
    setIsCreateOpen(true)
    setCreateCode('')
    setCreateDescription('')
    setCreateMaxUsage('')
    setCreateExpiresAt('')
  }

  const handleCreate = async () => {
    await createMutation.mutateAsync({
      code: createCode ? createCode : undefined,
      description: createDescription ? createDescription : null,
      maxUsage: createMaxUsage ? Number(createMaxUsage) : null,
      expiresAt: createExpiresAt ? new Date(createExpiresAt).toISOString() : null,
    })
    setIsCreateOpen(false)
  }

  const handleSave = async () => {
    if (!selectedApiCode) return
    await updateMutation.mutateAsync({
      id: selectedApiCode.id,
      status: editStatus,
      description: editDescription ? editDescription : null,
      maxUsage: editMaxUsage ? Number(editMaxUsage) : null,
      expiresAt: editExpiresAt ? new Date(editExpiresAt).toISOString() : null,
    })
    setSelectedCodeId(null)
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Codes parrain"
        description="Gérez les codes de parrainage et leurs utilisations"
        actions={
          <button
            type="button"
            onClick={openCreate}
            className="sama-button sama-button-primary px-6 py-2.5 flex items-center gap-2 text-[14px] font-black"
          >
            <Plus className="w-4 h-4" strokeWidth={3} />
            Nouveau code
          </button>
        }
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total codes" value={stats?.total ?? 0} icon={Tag} color="info" />
        <StatCard label="Actifs" value={stats?.active ?? 0} icon={CheckCircle} color="success" />
        <StatCard label="Expirés" value={stats?.expired ?? 0} icon={XCircle} color="danger" />
        <StatCard label="Utilisations" value={stats?.totalUsage ?? 0} icon={Users} color="success" />
      </div>
      <DataTable
        columns={columns}
        data={sponsorCodes}
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
          statusOptions: sponsorCodeStatusOptions,
          searchPlaceholder: 'Rechercher par code, usages...',
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
        isOpen={!!selectedCodeId}
        onClose={() => setSelectedCodeId(null)}
        title="Détails du code parrain"
        description={selectedApiCode?.code ?? selectedCodeId ?? undefined}
        footer={
          <div className="flex justify-end gap-3 px-6 py-4 bg-slate-50 border-t border-slate-100 rounded-b-2xl">
            <button
              onClick={() => setSelectedCodeId(null)}
              className="px-6 py-2.5 text-[14px] font-black text-slate-600 hover:text-slate-900 transition-all"
            >
              Annuler
            </button>
            <button
              onClick={handleSave}
              disabled={!selectedApiCode || updateMutation.isPending}
              className="sama-button sama-button-primary px-8 py-2.5 text-[14px] font-black"
            >
              {updateMutation.isPending ? 'Enregistrement...' : 'Enregistrer les modifications'}
            </button>
          </div>
        }
      >
        {selectedApiCode && (
          <div className="flex flex-col h-full overflow-hidden">
            <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
              {/* Status & Highlights */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm">
                      <Users className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Utilisations</p>
                      <p className="text-[18px] font-black text-slate-900">
                        {selectedApiCode.usageCount} / {selectedApiCode.maxUsage ?? '∞'}
                      </p>
                    </div>
                  </div>
                  <div className="flex">
                    <Badge variant={getStatusVariant(selectedApiCode.status, 'sponsorCode')}>
                      {sponsorCodeStatusLabels[selectedApiCode.status] || selectedApiCode.status}
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
                        {new Date(selectedApiCode.createdAt).toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                  <p className="text-[13px] font-medium text-slate-500">
                    ID: <span className="font-mono text-[11px]">{selectedApiCode.id}</span>
                  </p>
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
                      options={sponsorCodeStatusOptions.filter((o) => o.value !== '')}
                      placeholder="Choisir un statut"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[12px] font-black text-slate-500 uppercase tracking-widest px-1">
                      Description interne
                    </label>
                    <div className="relative group">
                      <FileText className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                      <textarea
                        value={editDescription}
                        onChange={(e) => setEditDescription(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 min-h-[100px] rounded-xl border border-slate-200 bg-white text-[14px] font-medium text-slate-900 shadow-sm focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all placeholder:text-slate-300 resize-none"
                        placeholder="Précisez l'usage de ce code parrain..."
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[12px] font-black text-slate-500 uppercase tracking-widest px-1">
                        Limite d'utilisations
                      </label>
                      <div className="relative group">
                        <Hash className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                        <input
                          value={editMaxUsage}
                          onChange={(e) => setEditMaxUsage(e.target.value)}
                          inputMode="numeric"
                          className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 bg-white text-[14px] font-medium text-slate-900 shadow-sm focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all placeholder:text-slate-300"
                          placeholder="Ex: 100 (vide = illimité)"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[12px] font-black text-slate-500 uppercase tracking-widest px-1">
                        Date d'expiration
                      </label>
                      <div className="relative group">
                        <Clock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                        <input
                          value={editExpiresAt}
                          onChange={(e) => setEditExpiresAt(e.target.value)}
                          type="date"
                          className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 bg-white text-[14px] font-medium text-slate-900 shadow-sm focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  {updateMutation.isError && (
                    <div className="flex items-center gap-3 px-4 py-3 rounded-xl border border-rose-100 bg-rose-50 text-[13px] font-bold text-rose-600 animate-in fade-in slide-in-from-top-2">
                      <AlertCircle className="w-4 h-4" />
                      Erreur lors de l'enregistrement des modifications
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </Sheet>

      <Sheet
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title="Nouveau code parrain"
        description="Générer un nouveau code de parrainage"
        footer={
          <div className="flex justify-end gap-3 px-6 py-4 bg-slate-50 border-t border-slate-100 rounded-b-2xl">
            <button
              onClick={() => setIsCreateOpen(false)}
              className="px-6 py-2.5 text-[14px] font-black text-slate-600 hover:text-slate-900 transition-all"
            >
              Annuler
            </button>
            <button
              onClick={handleCreate}
              disabled={createMutation.isPending}
              className="sama-button sama-button-primary px-8 py-2.5 text-[14px] font-black"
            >
              {createMutation.isPending ? 'Création...' : 'Créer le code'}
            </button>
          </div>
        }
      >
        <div className="p-6 space-y-8">
          <div className="bg-slate-50/50 rounded-2xl p-6 border border-slate-100 space-y-5">
            <div className="space-y-2">
              <label className="text-[12px] font-black text-slate-500 uppercase tracking-widest px-1">
                Valeur du code (Optionnel)
              </label>
              <div className="relative group">
                <Tag className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                <input
                  value={createCode}
                  onChange={(e) => setCreateCode(e.target.value.toUpperCase())}
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 bg-white text-[14px] font-black text-slate-900 shadow-sm focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all placeholder:text-slate-300"
                  placeholder="EX: WELCOME2024 (Auto si vide)"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[12px] font-black text-slate-500 uppercase tracking-widest px-1">
                Description interne
              </label>
              <div className="relative group">
                <FileText className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                <textarea
                  value={createDescription}
                  onChange={(e) => setCreateDescription(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 min-h-[100px] rounded-xl border border-slate-200 bg-white text-[14px] font-medium text-slate-900 shadow-sm focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all placeholder:text-slate-300 resize-none"
                  placeholder="Précisez l'usage de ce code parrain..."
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[12px] font-black text-slate-500 uppercase tracking-widest px-1">
                  Limite d'utilisations
                </label>
                <div className="relative group">
                  <Hash className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                  <input
                    value={createMaxUsage}
                    onChange={(e) => setCreateMaxUsage(e.target.value)}
                    inputMode="numeric"
                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 bg-white text-[14px] font-medium text-slate-900 shadow-sm focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all placeholder:text-slate-300"
                    placeholder="Ex: 100"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[12px] font-black text-slate-500 uppercase tracking-widest px-1">
                  Date d'expiration
                </label>
                <div className="relative group">
                  <Clock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                  <input
                    value={createExpiresAt}
                    onChange={(e) => setCreateExpiresAt(e.target.value)}
                    type="date"
                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 bg-white text-[14px] font-medium text-slate-900 shadow-sm focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all"
                  />
                </div>
              </div>
            </div>

            {createMutation.isError && (
              <div className="flex items-center gap-3 px-4 py-3 rounded-xl border border-rose-100 bg-rose-50 text-[13px] font-bold text-rose-600 animate-in fade-in slide-in-from-top-2">
                <AlertCircle className="w-4 h-4" />
                Erreur lors de la création du code
              </div>
            )}
          </div>
        </div>
      </Sheet>
    </div>
  );
}
