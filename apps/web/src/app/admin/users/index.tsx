import { createFileRoute, useNavigate } from '@tanstack/react-router';
import * as React from 'react';
import PageHeader from '../../../components/admin/layout/PageHeader';
import { DataTable } from '../../../components/admin/data-display/DataTable/DataTable';
import StatCard from '../../../components/admin/data-display/StatCard';
import { userColumns } from './columns';
import { useUsers } from './queries';
import { Users, UserCheck, Clock, UserX } from 'lucide-react';
import type { StatusOption } from '../../../components/admin/data-display/DataTable/DataTableToolbar';

const userStatusOptions: StatusOption[] = [
  { label: 'Tous les statuts', value: '' },
  { label: 'En attente', value: 'pending' },
  { label: 'Approuvé', value: 'approved' },
  { label: 'Rejeté', value: 'rejected' },
  { label: 'En révision', value: 'under_review' },
];

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

  const { data, isLoading } = useUsers({ page, pageSize });

  const users = data?.users ?? [];
  const pagination = data?.pagination ?? { total: 0, totalPages: 1 };

  const filteredUsers = React.useMemo(() => {
    const qNorm = q.trim().toLowerCase();
    const statusNorm = status.trim().toLowerCase();

    return users.filter((u) => {
      const matchesQ =
        qNorm.length === 0 ||
        `${u.firstName} ${u.lastName}`.toLowerCase().includes(qNorm) ||
        u.email.toLowerCase().includes(qNorm) ||
        u.phone.toLowerCase().includes(qNorm);

      const matchesStatus =
        statusNorm.length === 0 || u.kycStatus.toLowerCase().includes(statusNorm);

      const matchesDate = date.length === 0 || u.createdAt.slice(0, 10) === date;

      return matchesQ && matchesStatus && matchesDate;
    });
  }, [users, q, status, date]);

const stats = React.useMemo(() => {
    const total = pagination.total;
    const pending = users.filter(u => u.kycStatus === 'PENDING').length;
    const approved = users.filter(u => u.kycStatus === 'APPROVED').length;
    const rejected = users.filter(u => u.kycStatus === 'REJECTED').length;
    return { total, pending, approved, rejected };
  }, [users, pagination.total]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Utilisateurs"
        description="Gérez les comptes utilisateurs et leurs permissions"
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total" value={stats.total} icon={Users} color="info" />
        <StatCard label="Approuvés" value={stats.approved} icon={UserCheck} color="success" />
        <StatCard label="KYC en attente" value={stats.pending} icon={Clock} color="warning" />
        <StatCard label="Rejetés" value={stats.rejected} icon={UserX} color="danger" />
      </div>
      <DataTable
        columns={userColumns}
        data={users}
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
          statusOptions: userStatusOptions,
          searchPlaceholder: 'Rechercher par nom, email, téléphone...',
        }}
        paginationProps={{
          page,
          pageSize,
          total: pagination.total,
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
