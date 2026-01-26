import { createFileRoute, useNavigate } from '@tanstack/react-router';
import * as React from 'react';
import PageHeader from '../../../components/admin/layout/PageHeader';
import { DataTable } from '../../../components/admin/data-display/DataTable/DataTable';
import StatCard from '../../../components/admin/data-display/StatCard';
import { transactionColumns } from './columns';
import { Wallet, Clock, CheckCircle, XCircle } from 'lucide-react';

// Placeholder data
const transactions = [
  { id: '1', user: 'Aliou Wade', amount: 50000, status: 'Completed', type: 'Deposit', createdAt: new Date().toISOString() },
  { id: '2', user: 'Astou Ndiaye', amount: 25000, status: 'Pending', type: 'Deposit', createdAt: new Date().toISOString() },
];

const stats = {
  totalVolume: 1250000,
  pending: 5,
  completed: 150,
  failed: 2,
};

export const Route = createFileRoute('/admin/transactions/')({
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
  component: TransactionsPage,
});

function TransactionsPage() {
  const navigate = useNavigate({ from: Route.fullPath });
  const { page, pageSize, q, status, date } = Route.useSearch();

  const filteredTransactions = React.useMemo(() => {
    const qNorm = q.trim().toLowerCase();
    const statusNorm = status.trim().toLowerCase();

    return transactions.filter((t) => {
      const matchesQ =
        qNorm.length === 0 ||
        t.user.toLowerCase().includes(qNorm) ||
        String(t.amount).includes(qNorm) ||
        t.type.toLowerCase().includes(qNorm);

      const matchesStatus =
        statusNorm.length === 0 ||
        t.status.toLowerCase().includes(statusNorm);

      const matchesDate = date.length === 0 || t.createdAt.slice(0, 10) === date;

      return matchesQ && matchesStatus && matchesDate;
    });
  }, [q, status, date]);

  const total = filteredTransactions.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const currentPage = Math.min(page, totalPages);
  const startIndex = (currentPage - 1) * pageSize;
  const pagedTransactions = filteredTransactions.slice(startIndex, startIndex + pageSize);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Transactions"
        description="Gérez les transactions des utilisateurs"
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Volume Total" value={`${stats.totalVolume.toLocaleString()} FCFA`} icon={Wallet} color="info" />
        <StatCard label="En attente" value={stats.pending} icon={Clock} color="warning" />
        <StatCard label="Complétées" value={stats.completed} icon={CheckCircle} color="success" />
        <StatCard label="Échouées" value={stats.failed} icon={XCircle} color="danger" />
      </div>
      <DataTable
        columns={transactionColumns}
        data={pagedTransactions}
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
