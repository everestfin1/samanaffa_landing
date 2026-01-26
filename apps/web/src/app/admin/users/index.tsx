import { createFileRoute, useNavigate } from '@tanstack/react-router';
import * as React from 'react';
import PageHeader from '../../../components/admin/layout/PageHeader';
import { DataTable } from '../../../components/admin/data-display/DataTable/DataTable';
import StatCard from '../../../components/admin/data-display/StatCard';
import { userColumns } from './columns';
import { Users, UserCheck, Clock, UserX } from 'lucide-react';

// Placeholder data
const users = [
  { id: '1', name: 'Aliou Wade', email: 'aliou@example.com', status: 'Active', createdAt: new Date().toISOString() },
  { id: '2', name: 'Astou Ndiaye', email: 'astou@example.com', status: 'Pending', createdAt: new Date().toISOString() },
];

const stats = {
  total: 123,
  active: 100,
  pendingKyc: 15,
  suspended: 8,
};

export const Route = createFileRoute('/admin/users/')({
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
  component: UsersPage,
});

function UsersPage() {
  const navigate = useNavigate({ from: Route.fullPath });
  const { page, pageSize, q, status, date } = Route.useSearch();

  const filteredUsers = React.useMemo(() => {
    const qNorm = q.trim().toLowerCase();
    const statusNorm = status.trim().toLowerCase();

    return users.filter((u) => {
      const matchesQ =
        qNorm.length === 0 ||
        u.name.toLowerCase().includes(qNorm) ||
        u.email.toLowerCase().includes(qNorm);

      const matchesStatus =
        statusNorm.length === 0 ||
        u.status.toLowerCase().includes(statusNorm);

      const matchesDate = date.length === 0 || u.createdAt.slice(0, 10) === date;

      return matchesQ && matchesStatus && matchesDate;
    });
  }, [q, status, date]);

  const total = filteredUsers.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const currentPage = Math.min(page, totalPages);
  const startIndex = (currentPage - 1) * pageSize;
  const pagedUsers = filteredUsers.slice(startIndex, startIndex + pageSize);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Utilisateurs"
        description="Gérez les comptes utilisateurs et leurs permissions"
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total" value={stats.total} icon={Users} color="info" />
        <StatCard label="Actifs" value={stats.active} icon={UserCheck} color="success" />
        <StatCard label="KYC en attente" value={stats.pendingKyc} icon={Clock} color="warning" />
        <StatCard label="Suspendus" value={stats.suspended} icon={UserX} color="danger" />
      </div>
      <DataTable
        columns={userColumns}
        data={pagedUsers}
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
