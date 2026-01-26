import { createFileRoute } from '@tanstack/react-router';
import * as React from 'react';
import PageHeader from '../../../components/admin/layout/PageHeader';
import { DataTable } from '../../../components/admin/data-display/DataTable/DataTable';
import StatCard from '../../../components/admin/data-display/StatCard';
import { transactionColumns } from './columns';
import { Wallet, Clock, CheckCircle, XCircle } from 'lucide-react';

// Placeholder data
const transactions = [
  { id: '1', user: 'Aliou Wade', amount: 50000, status: 'Completed', type: 'Deposit', createdAt: new Date().toISOString() },
  { id: '2', user: 'Astou Ndiaye', amount: 25000, status: 'Pending', type: 'Deposit', createdAt: new Date().toISOString() },
];

const stats = {
  totalVolume: 1250000,
  pending: 5,
  completed: 150,
  failed: 2,
};

export const Route = createFileRoute('/admin/transactions/')({
  component: TransactionsPage,
});

function TransactionsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Transactions"
        description="Gérez les transactions des utilisateurs"
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Volume Total" value={`${stats.totalVolume.toLocaleString()} FCFA`} icon={Wallet} color="info" />
        <StatCard label="En attente" value={stats.pending} icon={Clock} color="warning" />
        <StatCard label="Complétées" value={stats.completed} icon={CheckCircle} color="success" />
        <StatCard label="Échouées" value={stats.failed} icon={XCircle} color="danger" />
      </div>
      <DataTable columns={transactionColumns} data={transactions} />
    </div>
  );
}
