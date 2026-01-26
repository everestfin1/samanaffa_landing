import { createFileRoute } from '@tanstack/react-router';
import * as React from 'react';
import PageHeader from '../../../components/admin/layout/PageHeader';
import { DataTable } from '../../../components/admin/data-display/DataTable/DataTable';
import StatCard from '../../../components/admin/data-display/StatCard';
import { kycColumns } from './columns';
import { FileCheck, Clock, CheckCircle, XCircle } from 'lucide-react';

// Placeholder data
const kycDocuments = [
  { id: '1', user: 'Moussa Diop', documentType: 'ID Card', status: 'Pending', submittedAt: new Date().toISOString() },
  { id: '2', user: 'Fatou Sow', documentType: 'Passport', status: 'Approved', submittedAt: new Date().toISOString() },
];

export const Route = createFileRoute('/admin/kyc/')({
  component: KycPage,
});

function KycPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Documents KYC"
        description="Gérez les documents KYC des utilisateurs"
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total" value={45} icon={FileCheck} color="info" />
        <StatCard label="En attente" value={12} icon={Clock} color="warning" />
        <StatCard label="Approuvés" value={30} icon={CheckCircle} color="success" />
        <StatCard label="Rejetés" value={3} icon={XCircle} color="danger" />
      </div>
      <DataTable columns={kycColumns} data={kycDocuments} />
    </div>
  );
}
