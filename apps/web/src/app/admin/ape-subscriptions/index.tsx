import { createFileRoute, useNavigate } from '@tanstack/react-router';
import * as React from 'react';
import PageHeader from '../../../components/admin/layout/PageHeader';
import { DataTable } from '../../../components/admin/data-display/DataTable/DataTable';
import StatCard from '../../../components/admin/data-display/StatCard';
import { apeSubscriptionColumns } from './columns';
import { Landmark, CheckCircle, XCircle, Wallet } from 'lucide-react';

// Placeholder data
const apeSubscriptions = [
  { id: '1', user: 'Cheikh Fall', plan: 'APE Premium', status: 'Active', startDate: new Date().toISOString() },
  { id: '2', user: 'Awa Gueye', plan: 'APE Basic', status: 'Cancelled', startDate: new Date().toISOString() },
];

export const Route = createFileRoute('/admin/ape-subscriptions/')({
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
  component: ApeSubscriptionsPage,
});

function ApeSubscriptionsPage() {
  const navigate = useNavigate({ from: Route.fullPath });
  const { page, pageSize, q, status, date } = Route.useSearch();

  const filteredSubscriptions = React.useMemo(() => {
    const qNorm = q.trim().toLowerCase();
    const statusNorm = status.trim().toLowerCase();

    return apeSubscriptions.filter((s) => {
      const matchesQ =
        qNorm.length === 0 ||
        s.user.toLowerCase().includes(qNorm) ||
        s.plan.toLowerCase().includes(qNorm);

      const matchesStatus =
        statusNorm.length === 0 ||
        s.status.toLowerCase().includes(statusNorm);

      const matchesDate = date.length === 0 || s.startDate.slice(0, 10) === date;

      return matchesQ && matchesStatus && matchesDate;
    });
  }, [q, status, date]);

  const total = filteredSubscriptions.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const currentPage = Math.min(page, totalPages);
  const startIndex = (currentPage - 1) * pageSize;
  const pagedSubscriptions = filteredSubscriptions.slice(startIndex, startIndex + pageSize);

  return (
    <div className="space-y-6">
      <PageHeader
        title="APE Sénégal"
        description="Gérez les souscriptions au programme APE"
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total souscriptions" value={156} icon={Landmark} color="info" />
        <StatCard label="Actives" value={142} icon={CheckCircle} color="success" />
        <StatCard label="Annulées" value={14} icon={XCircle} color="danger" />
        <StatCard label="Volume" value="78M FCFA" icon={Wallet} color="success" />
      </div>
      <DataTable
        columns={apeSubscriptionColumns}
        data={pagedSubscriptions}
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
