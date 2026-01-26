import { createFileRoute } from '@tanstack/react-router';
import * as React from 'react';
import PageContainer from '../../../components/admin/layout/PageContainer';
import PageHeader from '../../../components/admin/layout/PageHeader';
import { DataTable } from '../../../components/admin/data-display/DataTable/DataTable';

// Placeholder data and columns
const abandonedLeads = [
  { id: '1', email: 'unknown1@example.com', lastStep: 'Cart', value: 50000, detectedAt: new Date().toISOString() },
  { id: '2', email: 'unknown2@example.com', lastStep: 'Payment', value: 25000, detectedAt: new Date().toISOString() },
];

const columns = [
  { header: 'Email', accessorKey: 'email' },
  { header: 'Last Step', accessorKey: 'lastStep' },
  { header: 'Value', accessorKey: 'value' },
  { header: 'Detected At', accessorKey: 'detectedAt' },
];

export const Route = createFileRoute('/admin/leads/abandoned')({
  component: AbandonedLeadsPage,
});

function AbandonedLeadsPage() {
  return (
    <PageContainer>
      <PageHeader
        title="Abandoned Leads"
        description="Gérez les leads abandonnés"
      />
      <DataTable columns={columns} data={abandonedLeads} />
    </PageContainer>
  );
}
