import { createFileRoute, useNavigate } from '@tanstack/react-router';
import * as React from 'react';
import PageContainer from '../../../components/admin/layout/PageContainer';
import PageHeader from '../../../components/admin/layout/PageHeader';
import StatCard from '../../../components/admin/data-display/StatCard';
import { DataTable } from '../../../components/admin/data-display/DataTable/DataTable';
import Badge from '../../../components/admin/data-display/Badge';
import Sheet from '../../../components/admin/feedback/Sheet';
import Select from '../../../components/admin/forms/Select';
import { useAbandonedLeads, useUpdateAbandonedLead } from './queries';
import { createColumnHelper } from '@tanstack/react-table';
import type { AbandonedLead } from './queries';
import type { StatusOption } from '../../../components/admin/data-display/DataTable/DataTableToolbar';
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
  ShieldCheck,
  MousePointer2,
  Activity,
  UserCheck,
  Clock,
  Eye,
  Users,
  XCircle,
  Database
} from 'lucide-react';
import { normalizeStatusParam } from '../../../components/admin/utils/searchParams';
import { 
  abandonedLeadStatusLabels, 
  abandonedLeadStatusOptions 
} from '../../../components/admin/utils/statusLabels';
import { getStatusVariant } from '../../../components/admin/utils/statusVariants';

const columnHelper = createColumnHelper<AbandonedLead>();

const statusBadgeColors: Record<string, string> = {
  ABANDONED: 'bg-yellow-100 text-yellow-800',
  CONTACTED: 'bg-blue-100 text-blue-800',
  CONVERTED: 'bg-green-100 text-green-800',
  DISMISSED: 'bg-gray-100 text-gray-800',
};

const createAbandonedColumns = (onViewDetails: (lead: AbandonedLead) => void) => [
  columnHelper.accessor('email', {
    header: 'Email',
    cell: (info) => (
      <span className="font-medium">{info.getValue() || 'N/A'}</span>
    ),
  }),
  columnHelper.accessor('phone', {
    header: 'Téléphone',
    cell: (info) => (
      <span className="text-slate-600">{info.getValue() || 'N/A'}</span>
    ),
  }),
  columnHelper.accessor('stepReached', {
    header: 'Étape atteinte',
    cell: (info) => (
      <span className="text-slate-600">{info.getValue() || 'N/A'}</span>
    ),
  }),
  columnHelper.accessor('score', {
    header: 'Score',
    cell: (info) => (
      <span className={`font-medium ${info.getValue() >= 50 ? 'text-green-600' : 'text-slate-600'}`}>
        {info.getValue()}%
      </span>
    ),
  }),
  columnHelper.accessor('status', {
    header: 'Statut',
    cell: (info) => {
      const status = info.getValue();
      const variant = getStatusVariant(status, 'abandonedLead');
      return (
        <Badge variant={variant}>{abandonedLeadStatusLabels[status] || status}</Badge>
      );
    },
  }),
  columnHelper.accessor('lastActivityAt', {
    header: 'Dernière activité',
    cell: (info) => new Date(info.getValue()).toLocaleString('fr-FR'),
  }),
  columnHelper.display({
    id: 'actions',
    cell: (info) => (
      <button
        onClick={() => onViewDetails(info.row.original)}
        className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-emerald-600 transition-colors"
        title="Voir les détails"
      >
        <Eye className="h-4 w-4" />
      </button>
    ),
  }),
];

const abandonedColumns = createAbandonedColumns(() => {});

export const Route = createFileRoute('/admin/leads/abandoned')({
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
  component: AbandonedLeadsPage,
});

function AbandonedLeadsPage() {
  const navigate = useNavigate({ from: Route.fullPath });
  const { page, pageSize, q, status, date } = Route.useSearch();
  const [selectedLead, setSelectedLead] = React.useState<AbandonedLead | null>(null);
  const [editStatus, setEditStatus] = React.useState<string>('');
  const [editAdminNotes, setEditAdminNotes] = React.useState<string>('');

  const { data, isLoading } = useAbandonedLeads({ page, pageSize, q, status, date });
  const updateMutation = useUpdateAbandonedLead();

  const drafts = data?.drafts ?? [];
  const pagination = data?.pagination ?? { total: 0, totalPages: 1 };

  const stats = React.useMemo(() => {
    const total = pagination.total;
    const abandoned = drafts.filter((d) => d.status === 'ABANDONED').length;
    const contacted = drafts.filter((d) => d.status === 'CONTACTED').length;
    const converted = drafts.filter((d) => d.status === 'CONVERTED').length;
    const dismissed = drafts.filter((d) => d.status === 'DISMISSED').length;
    return { total, abandoned, contacted, converted, dismissed };
  }, [drafts, pagination.total]);

  const columns = React.useMemo(
    () => createAbandonedColumns((lead) => setSelectedLead(lead)),
    []
  );

  React.useEffect(() => {
    if (!selectedLead) return
    setEditStatus(selectedLead.status ?? '')
    setEditAdminNotes(selectedLead.adminNotes ?? '')
  }, [selectedLead])

  const handleSave = async () => {
    if (!selectedLead) return

    await updateMutation.mutateAsync({
      id: selectedLead.id,
      status: editStatus,
      adminNotes: editAdminNotes ? editAdminNotes : null,
    })

    setSelectedLead(null)
  }

  return (
    <PageContainer>
      <PageHeader
        title="Leads abandonnés"
        description="Gérez les formulaires abandonnés et relancez les prospects"
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Total" value={stats.total} icon={Users} color="info" />
        <StatCard label="Abandonnés" value={stats.abandoned} icon={XCircle} color="warning" />
        <StatCard label="Contactés" value={stats.contacted} icon={Phone} color="info" />
        <StatCard label="Convertis" value={stats.converted} icon={UserCheck} color="success" />
      </div>
      <DataTable
        columns={columns}
        data={drafts}
        isLoading={isLoading}
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
          statusOptions: abandonedLeadStatusOptions,
          searchPlaceholder: 'Rechercher par email, téléphone...',
        }}
        paginationProps={{
          page,
          pageSize,
          total: pagination.total,
          totalPages: pagination.totalPages,
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
        isOpen={!!selectedLead}
        onClose={() => setSelectedLead(null)}
        title="Détails du Lead Abandonné"
        description={selectedLead?.id}
        footer={
          <div className="flex justify-end gap-3 px-6 py-4 bg-slate-50 border-t border-slate-100 rounded-b-2xl">
            <button
              onClick={() => setSelectedLead(null)}
              className="px-6 py-2.5 text-[14px] font-black text-slate-600 hover:text-slate-900 transition-all"
            >
              Annuler
            </button>
            <button
              onClick={handleSave}
              disabled={!selectedLead || updateMutation.isPending}
              className="sama-button sama-button-primary px-8 py-2.5 text-[14px] font-black"
            >
              {updateMutation.isPending ? 'Enregistrement...' : 'Enregistrer les modifications'}
            </button>
          </div>
        }
      >
        {selectedLead && (
          <div className="flex flex-col h-full overflow-hidden">
            <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
              {/* Status & Score */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm">
                      <Activity className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Score d'engagement</p>
                      <p className={`text-[18px] font-black ${selectedLead.score >= 50 ? 'text-emerald-600' : 'text-slate-900'}`}>
                        {selectedLead.score}%
                      </p>
                    </div>
                  </div>
                  <div className="flex">
                    <Badge variant={getStatusVariant(selectedLead.status, 'abandonedLead')}>
                      {abandonedLeadStatusLabels[selectedLead.status] || selectedLead.status}
                    </Badge>
                  </div>
                </div>
                <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm">
                      <Clock className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Dernière Activité</p>
                      <p className="text-[15px] font-bold text-slate-900">
                        {new Date(selectedLead.lastActivityAt).toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                  <p className="text-[13px] font-medium text-slate-500">
                    Heure: {new Date(selectedLead.lastActivityAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>

              {/* Contact Info */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 px-1">
                  <User className="w-4 h-4 text-emerald-600" />
                  <h3 className="text-[14px] font-black text-slate-900 uppercase tracking-wider">Coordonnées Prospect</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
                  <div className="space-y-1">
                    <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Email</p>
                    <div className="flex items-center gap-2 text-slate-700">
                      <Mail className="w-3.5 h-3.5 text-slate-400" />
                      <p className="text-[14px] font-medium truncate">{selectedLead.email || 'Non renseigné'}</p>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Téléphone</p>
                    <div className="flex items-center gap-2 text-slate-700">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      <p className="text-[14px] font-medium">{selectedLead.phone || 'Non renseigné'}</p>
                    </div>
                  </div>
                  <div className="md:col-span-2 space-y-1 pt-2 border-t border-slate-50">
                    <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Étape atteinte</p>
                    <div className="flex items-center gap-2 text-slate-700">
                      <MousePointer2 className="w-3.5 h-3.5 text-slate-400" />
                      <p className="text-[14px] font-medium">{selectedLead.stepReached || 'N/A'}</p>
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
                      options={abandonedLeadStatusOptions.filter(o => o.value !== '')}
                      placeholder="Choisir un nouveau statut"
                    />
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
                        placeholder="Ajouter des précisions sur la relance..."
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

              {/* Draft Data Snapshot */}
              {selectedLead.draftData && Object.keys(selectedLead.draftData as object).length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 px-1">
                    <Database className="w-4 h-4 text-emerald-600" />
                    <h3 className="text-[14px] font-black text-slate-900 uppercase tracking-wider">Données Saisies (Draft)</h3>
                  </div>
                  <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                    <div className="p-4 bg-slate-50/50 border-b border-slate-100">
                      <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Contenu JSON</p>
                    </div>
                    <pre className="p-6 text-[12px] font-mono text-slate-600 overflow-auto max-h-[300px] custom-scrollbar bg-slate-50/20">
                      {JSON.stringify(selectedLead.draftData, null, 2)}
                    </pre>
                  </div>
                </div>
              )}

              {/* Technical Info */}
              <div className="space-y-4 pt-4 border-t border-slate-100">
                <div className="flex justify-between text-[12px] px-1">
                  <span className="text-slate-500 font-medium">ID Système</span>
                  <span className="font-mono text-slate-400">{selectedLead.id}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </Sheet>
    </PageContainer>
  );
}
