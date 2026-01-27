import { createFileRoute, useNavigate } from '@tanstack/react-router';
import * as React from 'react';
import PageHeader from '../../../components/admin/layout/PageHeader';
import { DataTable } from '../../../components/admin/data-display/DataTable/DataTable';
import StatCard from '../../../components/admin/data-display/StatCard';
import { createApeSubscriptionColumns, type ApeSubscription } from './columns';
import { Landmark, CheckCircle, XCircle, Wallet } from 'lucide-react';
import type { StatusOption } from '../../../components/admin/data-display/DataTable/DataTableToolbar';
import Sheet from '../../../components/admin/feedback/Sheet';
import Badge from '../../../components/admin/data-display/Badge';
import { apeSubscriptionStatusLabels } from '../../../components/admin/utils/statusLabels';
import { getStatusVariant } from '../../../components/admin/utils/statusVariants';
import { useApeSubscriptions } from './queries';

const apeSubscriptionStatusOptions: StatusOption[] = [
  { label: 'Tous les statuts', value: '' },
  { label: 'En attente', value: 'PENDING' },
  { label: 'Paiement initié', value: 'PAYMENT_INITIATED' },
  { label: 'Paiement réussi', value: 'PAYMENT_SUCCESS' },
  { label: 'Paiement échoué', value: 'PAYMENT_FAILED' },
  { label: 'Annulée', value: 'CANCELLED' },
];

export const Route = createFileRoute('/admin/ape-subscriptions/')({
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
  component: ApeSubscriptionsPage,
});

function ApeSubscriptionsPage() {
  const navigate = useNavigate({ from: Route.fullPath });
  const { page, pageSize, q, status, date } = Route.useSearch();
  const [selectedSubscription, setSelectedSubscription] = React.useState<ApeSubscription | null>(null);

  const { data } = useApeSubscriptions({ page, pageSize, q, status, date })
  const stats = data?.stats
  const pagination = data?.pagination

  const subscriptions: ApeSubscription[] = React.useMemo(() => {
    return (data?.subscriptions ?? []).map((s) => ({
      id: s.id,
      user: `${s.prenom} ${s.nom}`.trim(),
      plan: s.trancheInteresse,
      amount: Number(s.montantCfa),
      status: s.status,
      startDate: s.createdAt,
    }))
  }, [data?.subscriptions])

  const total = pagination?.total ?? subscriptions.length
  const totalPages = pagination?.totalPages ?? 1
  const currentPage = pagination?.page ?? page

  const volumeLabel = React.useMemo(() => {
    const value = stats?.totalVolume ?? 0
    return `${Math.round(value).toLocaleString('fr-FR')} FCFA`
  }, [stats?.totalVolume])

  const columns = React.useMemo(
    () => createApeSubscriptionColumns((sub) => setSelectedSubscription(sub)),
    []
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="APE Sénégal"
        description="Gérez les souscriptions au programme APE"
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total souscriptions" value={stats?.total ?? 0} icon={Landmark} color="info" />
        <StatCard label="Paiements réussis" value={stats?.payment_success ?? 0} icon={CheckCircle} color="success" />
        <StatCard label="Paiements échoués" value={stats?.payment_failed ?? 0} icon={XCircle} color="danger" />
        <StatCard label="Volume" value={volumeLabel} icon={Wallet} color="success" />
      </div>
      <DataTable
        columns={columns}
        data={subscriptions}
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
          statusOptions: apeSubscriptionStatusOptions,
          searchPlaceholder: 'Rechercher par utilisateur, plan...',
        }}
        paginationProps={{
          page: currentPage,
          pageSize,
          total,
          totalPages,
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
        isOpen={!!selectedSubscription}
        onClose={() => setSelectedSubscription(null)}
        title="Détails de la souscription"
        description={selectedSubscription?.id}
        footer={
          <div className="flex justify-end">
            <button
              onClick={() => setSelectedSubscription(null)}
              className="sama-button sama-button-outline px-4 py-2"
            >
              Fermer
            </button>
          </div>
        }
      >
        {selectedSubscription && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Utilisateur</p>
                <p className="font-medium text-slate-900">{selectedSubscription.user}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Statut</p>
                <div className="flex">
                  <Badge variant={getStatusVariant(selectedSubscription.status, 'apeSubscription')}>
                    {apeSubscriptionStatusLabels[selectedSubscription.status] || selectedSubscription.status}
                  </Badge>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Plan</p>
                <p className="text-slate-900">{selectedSubscription.plan}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Date de début</p>
                <p className="text-slate-900">{new Date(selectedSubscription.startDate).toLocaleString('fr-FR')}</p>
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-slate-100">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">ID</span>
                <span className="font-mono text-slate-600">{selectedSubscription.id}</span>
              </div>
            </div>
          </div>
        )}
      </Sheet>
    </div>
  );
}
