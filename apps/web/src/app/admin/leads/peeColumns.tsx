import { createColumnHelper } from '@tanstack/react-table';
import { Eye } from 'lucide-react';
import Badge from '../../../components/admin/data-display/Badge';
import { peeLeadStatusLabels } from '../../../components/admin/utils/statusLabels';
import { getStatusVariant } from '../../../components/admin/utils/statusVariants';

export type PeeLead = {
  id: string;
  name: string;
  email: string;
  status: string;
  createdAt: string;
};

const columnHelper = createColumnHelper<PeeLead>();

export const createPeeLeadColumns = (onViewDetails: (lead: PeeLead) => void) => [
  columnHelper.accessor('name', {
    header: 'Nom',
    cell: (info) => <span className="font-medium text-slate-900">{info.getValue()}</span>,
  }),
  columnHelper.accessor('email', {
    header: 'Email',
    cell: (info) => <span className="text-slate-600">{info.getValue()}</span>,
  }),
  columnHelper.accessor('status', {
    header: 'Statut',
    cell: (info) => {
      const status = info.getValue();
      const variant = getStatusVariant(status, 'peeLead');
      return <Badge variant={variant}>{peeLeadStatusLabels[status] || status}</Badge>;
    },
  }),
  columnHelper.accessor('createdAt', {
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

export const peeLeadColumns = createPeeLeadColumns(() => {});
