import { createFileRoute } from '@tanstack/react-router';
import * as React from 'react';
import PageContainer from '../../../components/admin/layout/PageContainer';
import PageHeader from '../../../components/admin/layout/PageHeader';
import { DataTable } from '../../../components/admin/data-display/DataTable/DataTable';

// Placeholder data and columns
const peeLeads = [
  { id: '1', name: 'Ousmane Ba', email: 'ousmane@example.com', status: 'New', createdAt: new Date().toISOString() },
  { id: '2', name: 'Aissatou Diallo', email: 'aissatou@example.com', status: 'Contacted', createdAt: new Date().toISOString() },
];

const columns = [
  { header: 'Name', accessorKey: 'name' },
  { header: 'Email', accessorKey: 'email' },
  { header: 'Status', accessorKey: 'status' },
  { header: 'Date', accessorKey: 'createdAt' },
];

export const Route = createFileRoute('/admin/leads/pee')({
  component: PeeLeadsPage,
});

function PeeLeadsPage() {
  return (
    <PageContainer>
      <PageHeader
        title="PEE Leads"
        description="Gérez les leads du programme PEE"
      />
      <DataTable columns={columns} data={peeLeads} />
    </PageContainer>
  );
}
