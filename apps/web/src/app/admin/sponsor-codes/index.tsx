import { createFileRoute, useNavigate } from '@tanstack/react-router';
import * as React from 'react';
import PageHeader from '../../../components/admin/layout/PageHeader';
import { DataTable } from '../../../components/admin/data-display/DataTable/DataTable';
import StatCard from '../../../components/admin/data-display/StatCard';
import { sponsorCodeColumns } from './columns';
import { Tag, CheckCircle, XCircle, Users } from 'lucide-react';

// Placeholder data
const sponsorCodes = [
  { id: '1', code: 'SPONSOR10', usageCount: 25, maxUsage: 100, status: 'Active', createdAt: new Date().toISOString() },
  { id: '2', code: 'WELCOME5', usageCount: 50, maxUsage: 50, status: 'Inactive', createdAt: new Date().toISOString() },
];

export const Route = createFileRoute('/admin/sponsor-codes/')({
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
  component: SponsorCodesPage,
});

function SponsorCodesPage() {
  const navigate = useNavigate({ from: Route.fullPath });
  const { page, pageSize, q, status, date } = Route.useSearch();

  const filteredSponsorCodes = React.useMemo(() => {
    const qNorm = q.trim().toLowerCase();
    const statusNorm = status.trim().toLowerCase();

    return sponsorCodes.filter((c) => {
      const matchesQ =
        qNorm.length === 0 ||
        c.code.toLowerCase().includes(qNorm) ||
        String(c.usageCount).includes(qNorm) ||
        String(c.maxUsage).includes(qNorm);

      const matchesStatus =
        statusNorm.length === 0 ||
        c.status.toLowerCase().includes(statusNorm);

      const matchesDate = date.length === 0 || c.createdAt.slice(0, 10) === date;

      return matchesQ && matchesStatus && matchesDate;
    });
  }, [q, status, date]);

  const total = filteredSponsorCodes.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const currentPage = Math.min(page, totalPages);
  const startIndex = (currentPage - 1) * pageSize;
  const pagedSponsorCodes = filteredSponsorCodes.slice(startIndex, startIndex + pageSize);

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
        columns={sponsorCodeColumns}
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
        }}
        paginationProps={{
          page: currentPage,
          pageSize,
          total,
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
    </div>
  );
}
