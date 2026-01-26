import { createFileRoute, useNavigate } from '@tanstack/react-router';
import * as React from 'react';
import PageContainer from '../../../components/admin/layout/PageContainer';
import PageHeader from '../../../components/admin/layout/PageHeader';
import StatCard from '../../../components/admin/data-display/StatCard';
import { DataTable } from '../../../components/admin/data-display/DataTable/DataTable';
import Badge from '../../../components/admin/data-display/Badge';
import { useAbandonedLeads } from './queries';
import { createColumnHelper } from '@tanstack/react-table';
import type { AbandonedLead } from './queries';
import type { StatusOption } from '../../../components/admin/data-display/DataTable/DataTableToolbar';
import { Users, UserCheck, Phone, XCircle } from 'lucide-react';

const abandonedStatusOptions: StatusOption[] = [
  { label: 'Tous les statuts', value: '' },
  { label: 'Abandonné', value: 'abandoned' },
  { label: 'Contacté', value: 'contacted' },
  { label: 'Converti', value: 'converted' },
  { label: 'Rejeté', value: 'dismissed' },
];

const columnHelper = createColumnHelper<AbandonedLead>();

const statusBadgeColors: Record<string, string> = {
  ABANDONED: 'bg-yellow-100 text-yellow-800',
  CONTACTED: 'bg-blue-100 text-blue-800',
  CONVERTED: 'bg-green-100 text-green-800',
  DISMISSED: 'bg-gray-100 text-gray-800',
};

const statusLabels: Record<string, string> = {
  ABANDONED: 'Abandonné',
  CONTACTED: 'Contacté',
  CONVERTED: 'Converti',
  DISMISSED: 'Rejeté',
};

const abandonedColumns = [
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
      const variant =
        status === 'CONVERTED'
          ? 'success'
          : status === 'ABANDONED' || status === 'CONTACTED'
            ? 'warning'
            : status === 'DISMISSED'
              ? 'danger'
              : 'default';
      return (
        <Badge variant={variant}>{statusLabels[status] || status}</Badge>
      );
    },
  }),
  columnHelper.accessor('lastActivityAt', {
    header: 'Dernière activité',
    cell: (info) => new Date(info.getValue()).toLocaleString('fr-FR'),
  }),
];

export const Route = createFileRoute('/admin/leads/abandoned')({
  validateSearch: (search) => {
    const page = Number(search.page) || 1;
    const pageSize = Number(search.pageSize) || 25;
    const q = typeof search.q === 'string' ? search.q : '';
    const status = typeof search.status === 'string' ? search.status : '';
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

  const { data, isLoading } = useAbandonedLeads({ page, pageSize, q, status, date });

  const drafts = data?.drafts ?? [];
  const pagination = data?.pagination ?? { total: 0, totalPages: 1 };
  const statsFallback = data?.stats ?? { total: 0, abandoned: 0, contacted: 0, converted: 0, dismissed: 0 };

  const filteredDrafts = React.useMemo(() => {
    const qNorm = q.trim().toLowerCase();
    const statusNorm = status.trim().toLowerCase();

    return drafts.filter((d) => {
      const matchesQ =
        qNorm.length === 0 ||
        (d.email ?? '').toLowerCase().includes(qNorm) ||
        (d.phone ?? '').toLowerCase().includes(qNorm) ||
        (d.stepReached ?? '').toLowerCase().includes(qNorm) ||
        d.formType.toLowerCase().includes(qNorm);

      const matchesStatus =
        statusNorm.length === 0 || d.status.toLowerCase().includes(statusNorm);

      const matchesDate = date.length === 0 || d.lastActivityAt.slice(0, 10) === date;

      return matchesQ && matchesStatus && matchesDate;
    });
  }, [drafts, q, status, date]);

  const stats = React.useMemo(() => {
    const total = filteredDrafts.length;
    const abandoned = filteredDrafts.filter((d) => d.status === 'ABANDONED').length;
    const contacted = filteredDrafts.filter((d) => d.status === 'CONTACTED').length;
    const converted = filteredDrafts.filter((d) => d.status === 'CONVERTED').length;
    const dismissed = filteredDrafts.filter((d) => d.status === 'DISMISSED').length;
    return { total, abandoned, contacted, converted, dismissed };
  }, [filteredDrafts]);

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
        columns={abandonedColumns}
        data={filteredDrafts}
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
          statusOptions: abandonedStatusOptions,
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
    </PageContainer>
  );
}
