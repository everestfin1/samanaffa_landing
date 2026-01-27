import { createFileRoute, useNavigate } from '@tanstack/react-router';
import * as React from 'react';
import PageContainer from '../../../components/admin/layout/PageContainer';
import PageHeader from '../../../components/admin/layout/PageHeader';
import StatCard from '../../../components/admin/data-display/StatCard';
import { DataTable } from '../../../components/admin/data-display/DataTable/DataTable';
import Badge from '../../../components/admin/data-display/Badge';
import Sheet from '../../../components/admin/feedback/Sheet';
import { useAbandonedLeads } from './queries';
import { createColumnHelper } from '@tanstack/react-table';
import type { AbandonedLead } from './queries';
import type { StatusOption } from '../../../components/admin/data-display/DataTable/DataTableToolbar';
import { Users, UserCheck, Phone, XCircle, Eye } from 'lucide-react';
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

  const { data, isLoading } = useAbandonedLeads({ page, pageSize, q, status, date });

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
        title="Détails du lead"
        description={selectedLead?.id}
        footer={
          <div className="flex justify-end">
            <button
              onClick={() => setSelectedLead(null)}
              className="sama-button sama-button-outline px-4 py-2"
            >
              Fermer
            </button>
          </div>
        }
      >
        {selectedLead && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Email</p>
                <p className="text-slate-900">{selectedLead.email || 'N/A'}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Téléphone</p>
                <p className="text-slate-900">{selectedLead.phone || 'N/A'}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Statut</p>
                <div className="flex">
                  <Badge
                    variant={getStatusVariant(selectedLead.status, 'abandonedLead')}
                  >
                    {abandonedLeadStatusLabels[selectedLead.status] || selectedLead.status}
                  </Badge>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Dernière activité</p>
                <p className="text-slate-900">{new Date(selectedLead.lastActivityAt).toLocaleString('fr-FR')}</p>
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-slate-100">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">ID</span>
                <span className="font-mono text-slate-600">{selectedLead.id}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Étape atteinte</span>
                <span className="font-medium text-slate-900">{selectedLead.stepReached || 'N/A'}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Score</span>
                <span className="font-medium text-slate-900">{selectedLead.score}%</span>
              </div>
            </div>
          </div>
        )}
      </Sheet>
    </PageContainer>
  );
}
