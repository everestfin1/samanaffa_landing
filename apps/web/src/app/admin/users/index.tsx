import { createFileRoute, useNavigate } from '@tanstack/react-router';
import * as React from 'react';
import PageHeader from '../../../components/admin/layout/PageHeader';
import { DataTable } from '../../../components/admin/data-display/DataTable/DataTable';
import StatCard from '../../../components/admin/data-display/StatCard';
import { createUserColumns } from './columns';
import { useUsers } from './queries';
import { 
  Users, 
  UserCheck, 
  Clock, 
  UserX,
  Mail,
  Phone,
  Calendar,
  ShieldCheck,
  Hash,
  Fingerprint
} from 'lucide-react';
import type { StatusOption } from '../../../components/admin/data-display/DataTable/DataTableToolbar';
import Sheet from '../../../components/admin/feedback/Sheet';
import type { User } from './queries';
import Badge from '../../../components/admin/data-display/Badge';
import { kycStatusLabels } from '../../../components/admin/utils/statusLabels';
import { getStatusVariant } from '../../../components/admin/utils/statusVariants';

const userStatusOptions: StatusOption[] = [
  { label: 'Tous les statuts', value: '' },
  { label: 'En attente', value: 'PENDING' },
  { label: 'Approuvé', value: 'APPROVED' },
  { label: 'Rejeté', value: 'REJECTED' },
  { label: 'En révision', value: 'UNDER_REVIEW' },
];

export const Route = createFileRoute('/admin/users/')({
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
          <div className="flex justify-end gap-3 px-6 py-4 bg-slate-50 border-t border-slate-100 rounded-b-2xl">
            <button
              onClick={() => setSelectedUser(null)}
              className="px-6 py-2.5 text-[14px] font-black text-slate-600 hover:text-slate-900 transition-all"
            >
              Fermer
            </button>
          </div>
        }
      >
        {selectedUser && (
          <div className="flex flex-col h-full overflow-hidden">
            <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
              {/* Status & Identity */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm">
                      <Fingerprint className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Statut KYC</p>
                      <div className="mt-1">
                        <Badge variant={getStatusVariant(selectedUser.kycStatus, 'kyc')}>
                          {kycStatusLabels[selectedUser.kycStatus] ?? selectedUser.kycStatus}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm">
                      <Calendar className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Date d'inscription</p>
                      <p className="text-[15px] font-bold text-slate-900">
                        {new Date(selectedUser.createdAt).toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Personal Info */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 px-1">
                  <Users className="w-4 h-4 text-emerald-600" />
                  <h3 className="text-[14px] font-black text-slate-900 uppercase tracking-wider">Profil Utilisateur</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
                  <div className="space-y-1">
                    <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Email</p>
                    <div className="flex items-center gap-2 text-slate-700">
                      <Mail className="w-3.5 h-3.5 text-slate-400" />
                      <p className="text-[14px] font-medium truncate">{selectedUser.email}</p>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Téléphone</p>
                    <div className="flex items-center gap-2 text-slate-700">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      <p className="text-[14px] font-medium">{selectedUser.phone || 'Non renseigné'}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* IDs */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 px-1">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <h3 className="text-[14px] font-black text-slate-900 uppercase tracking-wider">Sécurité</h3>
                </div>
                <div className="bg-slate-50/50 rounded-2xl p-6 border border-slate-100">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">ID Utilisateur</span>
                    <span className="font-mono text-[12px] font-bold text-slate-600">{selectedUser.id}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </Sheet>
    </div>
  );
}
