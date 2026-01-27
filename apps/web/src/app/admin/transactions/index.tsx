import { createFileRoute, useNavigate } from '@tanstack/react-router';
import * as React from 'react';
import PageHeader from '../../../components/admin/layout/PageHeader';
import { DataTable } from '../../../components/admin/data-display/DataTable/DataTable';
import StatCard from '../../../components/admin/data-display/StatCard';
import { createTransactionColumns } from './columns';
import { useTransactions, type Transaction } from './queries';
import { 
  Wallet, 
  Clock, 
  CheckCircle, 
  XCircle,
  Hash,
  Calendar,
  User,
  CreditCard,
  ArrowRightLeft,
  Activity,
  FileText
} from 'lucide-react';
import type { StatusOption } from '../../../components/admin/data-display/DataTable/DataTableToolbar';
import type { FacetOption } from '../../../components/admin/data-display/DataTable/DataTableFacetedFilter';
import Sheet from '../../../components/admin/feedback/Sheet';
import Badge from '../../../components/admin/data-display/Badge';
import { normalizeStatusParam } from '../../../components/admin/utils/searchParams';
import { 
  transactionStatusLabels, 
  transactionStatusOptions 
} from '../../../components/admin/utils/statusLabels';
import { getStatusVariant } from '../../../components/admin/utils/statusVariants';

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
    const status = normalizeStatusParam(search.status);
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
          <div className="flex justify-end gap-3 px-6 py-4 bg-slate-50 border-t border-slate-100 rounded-b-2xl">
            <button
              onClick={() => setSelectedTransaction(null)}
              className="px-6 py-2.5 text-[14px] font-black text-slate-600 hover:text-slate-900 transition-all"
            >
              Fermer
            </button>
          </div>
        }
      >
        {selectedTransaction && (
          <div className="flex flex-col h-full overflow-hidden">
            <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
              {/* Status & Highlights */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm">
                      <Hash className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Montant</p>
                      <p className="text-[18px] font-black text-slate-900">
                        {parseFloat(selectedTransaction.amount).toLocaleString('fr-FR')} FCFA
                      </p>
                    </div>
                  </div>
                  <div className="flex">
                    <Badge variant={getStatusVariant(selectedTransaction.status, 'transaction')}>
                      {transactionStatusLabels[selectedTransaction.status] ?? selectedTransaction.status}
                    </Badge>
                  </div>
                </div>
                <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm">
                      <Calendar className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Date & Heure</p>
                      <p className="text-[15px] font-bold text-slate-900">
                        {new Date(selectedTransaction.createdAt).toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                  <p className="text-[13px] font-medium text-slate-500">
                    {new Date(selectedTransaction.createdAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>

              {/* Transaction Info */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 px-1">
                  <ArrowRightLeft className="w-4 h-4 text-emerald-600" />
                  <h3 className="text-[14px] font-black text-slate-900 uppercase tracking-wider">Type & Paiement</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
                  <div className="space-y-1">
                    <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Type</p>
                    <div className="flex items-center gap-2">
                      <Activity className="w-3.5 h-3.5 text-slate-400" />
                      <p className="text-[14px] font-bold text-slate-900">{selectedTransaction.intentType}</p>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Méthode</p>
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-3.5 h-3.5 text-slate-400" />
                      <p className="text-[14px] font-bold text-slate-900">{selectedTransaction.paymentMethod}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Technical IDs */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 px-1">
                  <FileText className="w-4 h-4 text-emerald-600" />
                  <h3 className="text-[14px] font-black text-slate-900 uppercase tracking-wider">Identifiants</h3>
                </div>
                <div className="bg-slate-50/50 rounded-2xl p-6 border border-slate-100 space-y-4">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">ID Utilisateur</span>
                    <span className="font-mono text-[12px] font-bold text-slate-600">{selectedTransaction.userId}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm pt-3 border-t border-slate-100">
                    <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">ID Provider</span>
                    <span className="font-mono text-[12px] font-bold text-slate-600">{selectedTransaction.providerTransactionId || 'N/A'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </Sheet>
    </div>
  );
}
