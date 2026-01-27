import { createColumnHelper } from '@tanstack/react-table';
import { Eye } from 'lucide-react';
import Badge from '../../../components/admin/data-display/Badge';
import { sponsorCodeStatusLabels } from '../../../components/admin/utils/statusLabels';
import { getStatusVariant } from '../../../components/admin/utils/statusVariants';

export type SponsorCode = {
  id: string;
  code: string;
  usageCount: number;
  maxUsage: number;
  status: string;
  createdAt: string;
};

const columnHelper = createColumnHelper<SponsorCode>();

export const createSponsorCodeColumns = (onViewDetails: (code: SponsorCode) => void) => [
  columnHelper.accessor('code', {
    header: 'Code',
    cell: (info) => <span className="font-mono text-sm text-slate-900">{info.getValue()}</span>,
  }),
  columnHelper.accessor('usageCount', {
    header: 'Utilisations',
    cell: (info) => (
      <span className="text-slate-600">{info.getValue()} / {info.row.original.maxUsage}</span>
    ),
  }),
  columnHelper.accessor('status', {
    header: 'Statut',
    cell: (info) => {
      const status = info.getValue();
      const variant = getStatusVariant(status, 'sponsorCode');
      return <Badge variant={variant}>{sponsorCodeStatusLabels[status] || status}</Badge>;
    },
  }),
  columnHelper.accessor('createdAt', {
    header: 'Date de création',
    cell: (info) => new Date(info.getValue()).toLocaleDateString('fr-FR'),
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

export const sponsorCodeColumns = createSponsorCodeColumns(() => {});
