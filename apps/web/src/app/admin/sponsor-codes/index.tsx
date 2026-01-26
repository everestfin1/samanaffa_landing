import { createFileRoute } from '@tanstack/react-router';
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
  component: SponsorCodesPage,
});

function SponsorCodesPage() {
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
      <DataTable columns={sponsorCodeColumns} data={sponsorCodes} />
    </div>
  );
}
