import { createFileRoute, useNavigate } from '@tanstack/react-router';
import * as React from 'react';
import PageHeader from '../../../components/admin/layout/PageHeader';
import { DataTable } from '../../../components/admin/data-display/DataTable/DataTable';
import StatCard from '../../../components/admin/data-display/StatCard';
import { reconciliationColumns } from './columns';
import { RefreshCcw, CheckCircle, AlertTriangle, Clock } from 'lucide-react';
import type { StatusOption } from '../../../components/admin/data-display/DataTable/DataTableToolbar';

// Placeholder data
const reconciliationData = [
  { id: '1', transactionId: 'TX123', intouchId: 'IT456', status: 'Matched', amount: 50000, date: new Date().toISOString() },
  { id: '2', transactionId: 'TX789', intouchId: 'IT012', status: 'Mismatched', amount: 25000, date: new Date().toISOString() },
];

const reconciliationStatusOptions: StatusOption[] = [
  { label: 'Tous les statuts', value: '' },
  { label: 'Correspondante', value: 'matched' },
  { label: 'Divergente', value: 'mismatched' },
];

export const Route = createFileRoute('/admin/reconciliation/')({
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
  component: ReconciliationPage,
});

function ReconciliationPage() {
  const navigate = useNavigate({ from: Route.fullPath });
  const { page, pageSize, q, status, date } = Route.useSearch();

  const filteredReconciliation = React.useMemo(() => {
    const qNorm = q.trim().toLowerCase();
    const statusNorm = status.trim().toLowerCase();

    return reconciliationData.filter((r) => {
      const matchesQ =
        qNorm.length === 0 ||
        r.transactionId.toLowerCase().includes(qNorm) ||
        r.intouchId.toLowerCase().includes(qNorm) ||
        String(r.amount).includes(qNorm);

      const matchesStatus =
        statusNorm.length === 0 ||
        r.status.toLowerCase().includes(statusNorm);

      const matchesDate = date.length === 0 || r.date.slice(0, 10) === date;

      return matchesQ && matchesStatus && matchesDate;
    });
  }, [q, status, date]);

  const total = filteredReconciliation.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const currentPage = Math.min(page, totalPages);
  const startIndex = (currentPage - 1) * pageSize;
  const pagedReconciliation = filteredReconciliation.slice(startIndex, startIndex + pageSize);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Réconciliation"
        description="Réconciliez les transactions avec Intouch"
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total" value={234} icon={RefreshCcw} color="info" />
        <StatCard label="Correspondantes" value={220} icon={CheckCircle} color="success" />
        <StatCard label="Divergences" value={8} icon={AlertTriangle} color="danger" />
        <StatCard label="En attente" value={6} icon={Clock} color="warning" />
      </div>
      <DataTable
        columns={reconciliationColumns}
        data={pagedReconciliation}
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
          statusOptions: reconciliationStatusOptions,
          searchPlaceholder: 'Rechercher par TX, Intouch...',
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
    </div>
  );
}
