import { createFileRoute, useNavigate } from '@tanstack/react-router';
import * as React from 'react';
import PageContainer from '../../../components/admin/layout/PageContainer';
import PageHeader from '../../../components/admin/layout/PageHeader';
import { DataTable } from '../../../components/admin/data-display/DataTable/DataTable';
import type { StatusOption } from '../../../components/admin/data-display/DataTable/DataTableToolbar';
import Sheet from '../../../components/admin/feedback/Sheet';
import Badge from '../../../components/admin/data-display/Badge';
import { normalizeStatusParam } from '../../../components/admin/utils/searchParams';
import { 
  peeLeadStatusLabels, 
  peeLeadStatusOptions 
} from '../../../components/admin/utils/statusLabels';
import { getStatusVariant } from '../../../components/admin/utils/statusVariants';
import { createPeeLeadColumns, type PeeLead } from './peeColumns';
import { usePeeLeads } from './queries';

export const Route = createFileRoute('/admin/leads/pee')({
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
  component: PeeLeadsPage,
});

function PeeLeadsPage() {
  const navigate = useNavigate({ from: Route.fullPath });
  const { page, pageSize, q, status, date } = Route.useSearch();
  const [selectedLead, setSelectedLead] = React.useState<PeeLead | null>(null);

  const { data } = usePeeLeads({ page, pageSize, q, status, date })
  const pagination = data?.pagination

  const leads: PeeLead[] = React.useMemo(() => {
    return (data?.peeLeads ?? []).map((l) => ({
      id: l.id,
      name: `${l.prenom} ${l.nom}`.trim(),
      email: l.email,
      status: l.status,
      createdAt: l.createdAt,
    }))
  }, [data?.peeLeads])

  const total = pagination?.total ?? leads.length
  const totalPages = pagination?.totalPages ?? 1
  const currentPage = pagination?.page ?? page

  const columns = React.useMemo(() => createPeeLeadColumns((lead) => setSelectedLead(lead)), []);

  return (
    <PageContainer>
      <PageHeader
        title="PEE Leads"
        description="Gérez les leads du programme PEE"
      />
      <DataTable
        columns={columns}
        data={leads}
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
          statusOptions: peeLeadStatusOptions,
          searchPlaceholder: 'Rechercher par nom, email...',
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
                <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Nom</p>
                <p className="font-medium text-slate-900">{selectedLead.name}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Statut</p>
                <div className="flex">
                  <Badge variant={getStatusVariant(selectedLead.status, 'peeLead')}>
                    {peeLeadStatusLabels[selectedLead.status] || selectedLead.status}
                  </Badge>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Email</p>
                <p className="text-slate-900">{selectedLead.email ?? '—'}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Date</p>
                <p className="text-slate-900">{new Date(selectedLead.createdAt).toLocaleString('fr-FR')}</p>
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-slate-100">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">ID</span>
                <span className="font-mono text-slate-600">{selectedLead.id}</span>
              </div>
            </div>
          </div>
        )}
      </Sheet>
    </PageContainer>
  );
}
