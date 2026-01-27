import { createColumnHelper } from '@tanstack/react-table';
import { Eye } from 'lucide-react';
import Badge from '../../../components/admin/data-display/Badge';
import { apeSubscriptionStatusLabels } from '../../../components/admin/utils/statusLabels';
import { getStatusVariant } from '../../../components/admin/utils/statusVariants';

export type ApeSubscription = {
  id: string;
  user: string;
  plan: string;
  amount: number;
  status: string;
  startDate: string;
};

const columnHelper = createColumnHelper<ApeSubscription>();

export const createApeSubscriptionColumns = (onViewDetails: (id: string) => void) => [
  columnHelper.accessor('user', {
    header: 'Utilisateur',
    cell: (info) => <span className="font-medium text-slate-900">{info.getValue()}</span>,
  }),
  columnHelper.accessor('plan', {
    header: 'Plan',
    cell: (info) => <span className="text-slate-600">{info.getValue()}</span>,
  }),
  columnHelper.accessor('amount', {
    header: 'Montant',
    cell: (info) => <span className="text-slate-600">{Math.round(info.getValue()).toLocaleString('fr-FR')} FCFA</span>,
  }),
  columnHelper.accessor('status', {
    header: 'Statut',
    cell: (info) => {
      const status = info.getValue();
      const variant = getStatusVariant(status, 'apeSubscription');
      return <Badge variant={variant}>{apeSubscriptionStatusLabels[status] || status}</Badge>;
    },
  }),
  columnHelper.accessor('startDate', {
    header: 'Date de début',
    cell: (info) => new Date(info.getValue()).toLocaleDateString('fr-FR'),
  }),
  columnHelper.display({
    id: 'actions',
    cell: (info) => (
      <button
        onClick={() => onViewDetails(info.row.original.id)}
        className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-emerald-600 transition-colors"
        title="Voir les détails"
      >
        <Eye className="h-4 w-4" />
      </button>
    ),
  }),
];

export const apeSubscriptionColumns = createApeSubscriptionColumns(() => {});
