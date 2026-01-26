import { createFileRoute } from '@tanstack/react-router';
import * as React from 'react';
import PageHeader from '../../../components/admin/layout/PageHeader';
import { DataTable } from '../../../components/admin/data-display/DataTable/DataTable';
import StatCard from '../../../components/admin/data-display/StatCard';
import { apeSubscriptionColumns } from './columns';
import { Landmark, CheckCircle, XCircle, Wallet } from 'lucide-react';

// Placeholder data
const apeSubscriptions = [
  { id: '1', user: 'Cheikh Fall', plan: 'APE Premium', status: 'Active', startDate: new Date().toISOString() },
  { id: '2', user: 'Awa Gueye', plan: 'APE Basic', status: 'Cancelled', startDate: new Date().toISOString() },
];

export const Route = createFileRoute('/admin/ape-subscriptions/')({
  component: ApeSubscriptionsPage,
});

function ApeSubscriptionsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="APE Sénégal"
        description="Gérez les souscriptions au programme APE"
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total souscriptions" value={156} icon={Landmark} color="info" />
        <StatCard label="Actives" value={142} icon={CheckCircle} color="success" />
        <StatCard label="Annulées" value={14} icon={XCircle} color="danger" />
        <StatCard label="Volume" value="78M FCFA" icon={Wallet} color="success" />
      </div>
      <DataTable columns={apeSubscriptionColumns} data={apeSubscriptions} />
    </div>
  );
}
