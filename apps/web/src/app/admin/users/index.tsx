import { createFileRoute } from '@tanstack/react-router';
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
  component: UsersPage,
});

function UsersPage() {
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
      <DataTable columns={userColumns} data={users} />
    </div>
  );
}
