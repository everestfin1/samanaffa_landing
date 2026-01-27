import { createFileRoute, useNavigate } from '@tanstack/react-router';
import * as React from 'react';
import PageHeader from '../../../components/admin/layout/PageHeader';
import { DataTable } from '../../../components/admin/data-display/DataTable/DataTable';
import StatCard from '../../../components/admin/data-display/StatCard';
import { createSponsorCodeColumns, type SponsorCode } from './columns';
import { Tag, CheckCircle, XCircle, Users } from 'lucide-react';
import type { StatusOption } from '../../../components/admin/data-display/DataTable/DataTableToolbar';
import Sheet from '../../../components/admin/feedback/Sheet';
import Badge from '../../../components/admin/data-display/Badge';
import { sponsorCodeStatusLabels } from '../../../components/admin/utils/statusLabels';
import { getStatusVariant } from '../../../components/admin/utils/statusVariants';

// Placeholder data
const sponsorCodes = [
  { id: '1', code: 'SPONSOR10', usageCount: 25, maxUsage: 100, status: 'ACTIVE', createdAt: new Date().toISOString() },
  { id: '2', code: 'WELCOME5', usageCount: 50, maxUsage: 50, status: 'INACTIVE', createdAt: new Date().toISOString() },
];

const sponsorCodeStatusOptions: StatusOption[] = [
  { label: 'Tous les statuts', value: '' },
  { label: 'Actif', value: 'ACTIVE' },
  { label: 'Inactif', value: 'INACTIVE' },
  { label: 'Expiré', value: 'EXPIRED' },
];

export const Route = createFileRoute('/admin/sponsor-codes/')({
  validateSearch: (search) => {
    const page = Number(search.page) || 1;
    const pageSize = Number(search.pageSize) || 25;
    const q = typeof search.q === 'string' ? search.q : '';
    const statusRaw = typeof search.status === 'string' ? search.status : '';
    const status = statusRaw ? statusRaw.toUpperCase() : '';
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
  const [selectedCode, setSelectedCode] = React.useState<SponsorCode | null>(null);

  const filteredSponsorCodes = React.useMemo(() => {
    const qNorm = q.trim().toLowerCase();
    const statusNorm = status.trim().toUpperCase();

    return sponsorCodes.filter((c) => {
      const matchesQ =
        qNorm.length === 0 ||
        c.code.toLowerCase().includes(qNorm) ||
        String(c.usageCount).includes(qNorm) ||
        String(c.maxUsage).includes(qNorm);

      const matchesStatus =
        statusNorm.length === 0 || c.status === statusNorm;

      const matchesDate = date.length === 0 || c.createdAt.slice(0, 10) === date;

      return matchesQ && matchesStatus && matchesDate;
    });
  }, [q, status, date]);

  const total = filteredSponsorCodes.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const currentPage = Math.min(page, totalPages);
  const startIndex = (currentPage - 1) * pageSize;
  const pagedSponsorCodes = filteredSponsorCodes.slice(startIndex, startIndex + pageSize);

  const columns = React.useMemo(
    () => createSponsorCodeColumns((code) => setSelectedCode(code)),
    []
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Codes parrain"
        description="Gérez les codes de parrainage et leurs utilisations"
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total codes" value={48} icon={Tag} color="info" />
        <StatCard label="Actifs" value={35} icon={CheckCircle} color="success" />
        <StatCard label="Expirés" value={13} icon={XCircle} color="danger" />
        <StatCard label="Utilisations" value={1245} icon={Users} color="success" />
      </div>
      <DataTable
        columns={columns}
        data={pagedSponsorCodes}
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
        isOpen={!!selectedCode}
        onClose={() => setSelectedCode(null)}
        title="Détails du code parrain"
        description={selectedCode?.code}
        footer={
          <div className="flex justify-end">
            <button
              onClick={() => setSelectedCode(null)}
              className="sama-button sama-button-outline px-4 py-2"
            >
              Fermer
            </button>
          </div>
        }
      >
        {selectedCode && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Code</p>
                <p className="font-mono text-slate-900">{selectedCode.code}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Statut</p>
                <div className="flex">
                  <Badge variant={getStatusVariant(selectedCode.status, 'sponsorCode')}>
                    {sponsorCodeStatusLabels[selectedCode.status] || selectedCode.status}
                  </Badge>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Utilisations</p>
                <p className="text-slate-900">{selectedCode.usageCount} / {selectedCode.maxUsage}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Créé le</p>
                <p className="text-slate-900">{new Date(selectedCode.createdAt).toLocaleString('fr-FR')}</p>
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-slate-100">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">ID</span>
                <span className="font-mono text-slate-600">{selectedCode.id}</span>
              </div>
            </div>
          </div>
        )}
      </Sheet>
    </div>
  );
}
