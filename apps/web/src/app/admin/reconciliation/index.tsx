import { createFileRoute } from '@tanstack/react-router';
import * as React from 'react';
import PageHeader from '../../../components/admin/layout/PageHeader';
import { DataTable } from '../../../components/admin/data-display/DataTable/DataTable';
import StatCard from '../../../components/admin/data-display/StatCard';
import { reconciliationColumns } from './columns';
import { RefreshCcw, CheckCircle, AlertTriangle, Clock } from 'lucide-react';

// Placeholder data
const reconciliationData = [
  { id: '1', transactionId: 'TX123', intouchId: 'IT456', status: 'Matched', amount: 50000, date: new Date().toISOString() },
  { id: '2', transactionId: 'TX789', intouchId: 'IT012', status: 'Mismatched', amount: 25000, date: new Date().toISOString() },
];

export const Route = createFileRoute('/admin/reconciliation/')({
  component: ReconciliationPage,
});

function ReconciliationPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Réconciliation"
        description="Réconciliez les transactions avec Intouch"
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total" value={234} icon={RefreshCcw} color="info" />
        <StatCard label="Correspondantes" value={220} icon={CheckCircle} color="success" />
        <StatCard label="Divergences" value={8} icon={AlertTriangle} color="danger" />
        <StatCard label="En attente" value={6} icon={Clock} color="warning" />
      </div>
      <DataTable columns={reconciliationColumns} data={reconciliationData} />
    </div>
  );
}
