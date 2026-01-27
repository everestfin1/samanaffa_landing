import { createFileRoute, useNavigate } from '@tanstack/react-router';
import * as React from 'react';
import PageHeader from '../../../components/admin/layout/PageHeader';
import { DataTable } from '../../../components/admin/data-display/DataTable/DataTable';
import StatCard from '../../../components/admin/data-display/StatCard';
import { createTransactionColumns } from './columns';
import { useTransactions, type Transaction } from './queries';
import { Wallet, Clock, CheckCircle, XCircle } from 'lucide-react';
import type { StatusOption } from '../../../components/admin/data-display/DataTable/DataTableToolbar';
import type { FacetOption } from '../../../components/admin/data-display/DataTable/DataTableFacetedFilter';
import Sheet from '../../../components/admin/feedback/Sheet';
import Badge from '../../../components/admin/data-display/Badge';
import { transactionStatusLabels } from '../../../components/admin/utils/statusLabels';

const transactionStatusOptions: StatusOption[] = [
  { label: 'Tous les statuts', value: '' },
  { label: 'En attente', value: 'pending' },
  { label: 'En cours', value: 'processing' },
  { label: 'Complétée', value: 'completed' },
  { label: 'Annulée', value: 'cancelled' },
  { label: 'Échouée', value: 'failed' },
];

const typeFacetOptions: FacetOption[] = [
  { label: 'Tous', value: '' },
  { label: 'Dépôt', value: 'DEPOSIT' },
  { label: 'Investissement', value: 'INVESTMENT' },
  { label: 'Retrait', value: 'WITHDRAWAL' },
];

const paymentFacetOptions: FacetOption[] = [
  { label: 'Tous', value: '' },
  { label: 'Intouch', value: 'INTOUCH' },
  { label: 'Carte', value: 'CARD' },
  { label: 'Wave', value: 'WAVE' },
  { label: 'Orange Money', value: 'ORANGE_MONEY' },
];

export const Route = createFileRoute('/admin/transactions/')({
  validateSearch: (search) => {
    const page = Number(search.page) || 1;
    const pageSize = Number(search.pageSize) || 25;
    const q = typeof search.q === 'string' ? search.q : '';
    const status = typeof search.status === 'string' ? search.status : '';
    const date = typeof search.date === 'string' ? search.date : '';

    return {
      page: Math.max(1, page),
      pageSize: [10, 25, 50, 100].includes(pageSize) ? pageSize : 25,
      q,
      status,
      date,
    };
  },
  component: TransactionsPage,
});

function TransactionsPage() {
  const navigate = useNavigate({ from: Route.fullPath });
  const { page, pageSize, q, status, date } = Route.useSearch();
  const [typeFilter, setTypeFilter] = React.useState('');
  const [paymentFilter, setPaymentFilter] = React.useState('');
  const [selectedTransaction, setSelectedTransaction] = React.useState<Transaction | null>(null);

  const { data, isLoading } = useTransactions({ page, pageSize, q, status, date });

  const transactions = data?.transactions ?? [];
  const pagination = data?.pagination ?? { total: 0, totalPages: 1 };

  const columns = React.useMemo(() => 
    createTransactionColumns((transaction) => setSelectedTransaction(transaction)),
    []
  );

  const filteredTransactions = React.useMemo(() => {
    return transactions.filter((t) => {
      const matchesType = !typeFilter || t.intentType === typeFilter;
      const matchesPayment = !paymentFilter || t.paymentMethod === paymentFilter;
      return matchesType && matchesPayment;
    });
  }, [transactions, typeFilter, paymentFilter]);

  const stats = React.useMemo(() => {
    const totalVolume = filteredTransactions.reduce((sum, t) => sum + parseFloat(t.amount || '0'), 0);
    const pending = filteredTransactions.filter(t => t.status === 'PENDING').length;
    const completed = filteredTransactions.filter(t => t.status === 'COMPLETED').length;
    const failed = filteredTransactions.filter(t => t.status === 'FAILED').length;
    return { totalVolume, pending, completed, failed };
  }, [filteredTransactions]);

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
      <DataTable
        columns={columns}
        data={filteredTransactions}
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
          statusOptions: transactionStatusOptions,
          searchPlaceholder: 'Rechercher par référence, montant...',
          facetedFilters: [
            {
              columnId: 'intentType',
              label: 'Type de transaction',
              options: typeFacetOptions,
              value: typeFilter,
              onChange: (value) => {
                setTypeFilter(value);
                navigate({
                  search: (prev) => ({ ...prev, page: 1 }),
                  replace: true,
                });
              },
            },
            {
              columnId: 'paymentMethod',
              label: 'Moyen de paiement',
              options: paymentFacetOptions,
              value: paymentFilter,
              onChange: (value) => {
                setPaymentFilter(value);
                navigate({
                  search: (prev) => ({ ...prev, page: 1 }),
                  replace: true,
                });
              },
            },
          ],
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
        isOpen={!!selectedTransaction}
        onClose={() => setSelectedTransaction(null)}
        title="Détails de la transaction"
        description={selectedTransaction?.referenceNumber}
        footer={
          <div className="flex justify-end">
            <button
              onClick={() => setSelectedTransaction(null)}
              className="sama-button sama-button-outline px-4 py-2"
            >
              Fermer
            </button>
          </div>
        }
      >
        {selectedTransaction && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Référence</p>
                <p className="font-mono text-slate-900">{selectedTransaction.referenceNumber}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Statut</p>
                <div className="flex">
                  <Badge
                    variant={
                      selectedTransaction.status === 'COMPLETED'
                        ? 'success'
                        : selectedTransaction.status === 'PENDING' ||
                            selectedTransaction.status === 'PROCESSING'
                          ? 'warning'
                          : selectedTransaction.status === 'FAILED'
                            ? 'danger'
                            : 'default'
                    }
                  >
                    {transactionStatusLabels[selectedTransaction.status] ?? selectedTransaction.status}
                  </Badge>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Montant</p>
                <p className="text-lg font-bold text-slate-900">
                  {parseFloat(selectedTransaction.amount).toLocaleString()} FCFA
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Date</p>
                <p className="text-slate-900">{new Date(selectedTransaction.createdAt).toLocaleString('fr-FR')}</p>
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-slate-100">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Type de transaction</span>
                <span className="font-medium text-slate-900">{selectedTransaction.intentType}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Moyen de paiement</span>
                <span className="font-medium text-slate-900">{selectedTransaction.paymentMethod}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">ID Utilisateur</span>
                <span className="font-mono text-slate-600">{selectedTransaction.userId}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">ID Provider</span>
                <span className="font-mono text-slate-600">{selectedTransaction.providerTransactionId || 'N/A'}</span>
              </div>
            </div>
          </div>
        )}
      </Sheet>
    </div>
  );
}
