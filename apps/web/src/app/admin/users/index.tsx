import { createFileRoute, useNavigate } from '@tanstack/react-router';
import * as React from 'react';
import PageHeader from '../../../components/admin/layout/PageHeader';
import { DataTable } from '../../../components/admin/data-display/DataTable/DataTable';
import StatCard from '../../../components/admin/data-display/StatCard';
import { createUserColumns } from './columns';
import { useUsers } from './queries';
import { Users, UserCheck, Clock, UserX } from 'lucide-react';
import type { StatusOption } from '../../../components/admin/data-display/DataTable/DataTableToolbar';
import Sheet from '../../../components/admin/feedback/Sheet';
import type { User } from './queries';
import Badge from '../../../components/admin/data-display/Badge';

const kycStatusLabels: Record<string, string> = {
  PENDING: 'En attente',
  APPROVED: 'Approuvé',
  REJECTED: 'Rejeté',
  UNDER_REVIEW: 'En révision',
};

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
  const [selectedUser, setSelectedUser] = React.useState<User | null>(null);

  const { data, isLoading } = useUsers({ page, pageSize, q, status, date });

  const users = data?.users ?? [];
  const pagination = data?.pagination ?? { total: 0, totalPages: 1 };

const stats = React.useMemo(() => {
    const total = pagination.total;
    const pending = users.filter(u => u.kycStatus === 'PENDING').length;
    const approved = users.filter(u => u.kycStatus === 'APPROVED').length;
    const rejected = users.filter(u => u.kycStatus === 'REJECTED').length;
    return { total, pending, approved, rejected };
  }, [users, pagination.total]);

  const columns = React.useMemo(
    () => createUserColumns((user) => setSelectedUser(user)),
    []
  );

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
        columns={columns}
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
        isOpen={!!selectedUser}
        onClose={() => setSelectedUser(null)}
        title="Détails de l'utilisateur"
        description={selectedUser ? `${selectedUser.firstName} ${selectedUser.lastName}` : undefined}
        footer={
          <div className="flex justify-end">
            <button
              onClick={() => setSelectedUser(null)}
              className="sama-button sama-button-outline px-4 py-2"
            >
              Fermer
            </button>
          </div>
        }
      >
        {selectedUser && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Nom</p>
                <p className="font-medium text-slate-900">{selectedUser.firstName} {selectedUser.lastName}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Statut KYC</p>
                <div className="flex">
                  <Badge
                    variant={
                      selectedUser.kycStatus === 'APPROVED'
                        ? 'success'
                        : selectedUser.kycStatus === 'PENDING' || selectedUser.kycStatus === 'UNDER_REVIEW'
                          ? 'warning'
                          : selectedUser.kycStatus === 'REJECTED'
                            ? 'danger'
                            : 'default'
                    }
                  >
                    {kycStatusLabels[selectedUser.kycStatus] ?? selectedUser.kycStatus}
                  </Badge>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Email</p>
                <p className="text-slate-900">{selectedUser.email}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Téléphone</p>
                <p className="text-slate-900">{selectedUser.phone}</p>
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-slate-100">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">ID Utilisateur</span>
                <span className="font-mono text-slate-600">{selectedUser.id}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Date d'inscription</span>
                <span className="font-medium text-slate-900">{new Date(selectedUser.createdAt).toLocaleString('fr-FR')}</span>
              </div>
            </div>
          </div>
        )}
      </Sheet>
    </div>
  );
}
