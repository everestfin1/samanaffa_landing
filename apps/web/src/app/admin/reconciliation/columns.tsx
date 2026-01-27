import { createColumnHelper } from '@tanstack/react-table';
import { Eye } from 'lucide-react';
import Badge from '../../../components/admin/data-display/Badge';
import { reconciliationStatusLabels } from '../../../components/admin/utils/statusLabels';
import { getStatusVariant } from '../../../components/admin/utils/statusVariants';

export type Reconciliation = {
  id: string;
  transactionId: string;
  intouchId: string;
  status: string;
  amount: number;
  date: string;
};

const columnHelper = createColumnHelper<Reconciliation>();

export const createReconciliationColumns = (onViewDetails: (item: Reconciliation) => void) => [
  columnHelper.accessor('transactionId', {
    header: 'ID Transaction',
    cell: (info) => <span className="font-mono text-sm text-slate-900">{info.getValue()}</span>,
  }),
  columnHelper.accessor('intouchId', {
    header: 'ID Intouch',
    cell: (info) => <span className="font-mono text-sm text-slate-600">{info.getValue()}</span>,
  }),
  columnHelper.accessor('status', {
    header: 'Statut',
    cell: (info) => {
      const status = info.getValue();
      const variant = getStatusVariant(status, 'reconciliation');
      return <Badge variant={variant}>{reconciliationStatusLabels[status] || status}</Badge>;
    },
  }),
  columnHelper.accessor('amount', {
    header: 'Montant',
    cell: (info) => `${info.getValue().toLocaleString()} FCFA`,
  }),
  columnHelper.accessor('date', {
    header: 'Date',
    cell: (info) => new Date(info.getValue()).toLocaleString('fr-FR'),
  }),
  columnHelper.display({
    id: 'actions',
    cell: (info) => (
      <button
        onClick={() => onViewDetails(info.row.original)}
        className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-emerald-600 transition-colors"
        title="Voir les détails"
      >
        <Eye className="h-4 w-4" />
      </button>
    ),
  }),
];

export const reconciliationColumns = createReconciliationColumns(() => {});
