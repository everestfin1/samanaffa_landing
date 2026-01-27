import { createColumnHelper } from '@tanstack/react-table';
import type { KycDocument } from './queries';
import Badge from '../../../components/admin/data-display/Badge';
import { Eye } from 'lucide-react';
import { kycStatusLabels } from '../../../components/admin/utils/statusLabels';

const columnHelper = createColumnHelper<KycDocument>();

const statusBadgeColors: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  APPROVED: 'bg-green-100 text-green-800',
  REJECTED: 'bg-red-100 text-red-800',
  UNDER_REVIEW: 'bg-blue-100 text-blue-800',
};

export const createKycColumns = (onViewDetails: (doc: KycDocument) => void) => [
  columnHelper.accessor('userGroupKey', {
    header: 'Utilisateur',
    cell: (info) => {
      const name = (info.row.original.userName ?? '').trim();
      const shortId = info.row.original.userId.slice(0, 8);

      return (
        <span className="font-medium text-slate-900">
          {name.length > 0 ? `${name} (${shortId})` : shortId}
        </span>
      );
    },
  }),
  columnHelper.accessor('documentType', {
    header: 'Type de document',
    cell: (info) => (
      <span className="font-medium">{info.getValue()}</span>
    ),
  }),
  columnHelper.accessor('fileName', {
    header: 'Fichier',
    cell: (info) => (
      <span className="text-slate-600 truncate max-w-[200px] block">{info.getValue()}</span>
    ),
  }),
  columnHelper.accessor('verificationStatus', {
    header: 'Statut',
    cell: (info) => {
      const status = info.getValue();
      const variant =
        status === 'APPROVED'
          ? 'success'
          : status === 'PENDING' || status === 'UNDER_REVIEW'
            ? 'warning'
            : status === 'REJECTED'
              ? 'danger'
              : 'default';
      return (
        <Badge variant={variant}>{kycStatusLabels[status] || status}</Badge>
      );
    },
  }),
  columnHelper.accessor('uploadDate', {
    header: 'Date de soumission',
    cell: (info) => new Date(info.getValue()).toLocaleString('fr-FR'),
  }),
  columnHelper.display({
    id: 'actions',
    cell: (info) => {
      if (info.row.getIsGrouped?.()) return null;
      if (!info.row.original) return null;

      return (
        <button
          onClick={() => onViewDetails(info.row.original)}
          className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-emerald-600 transition-colors"
          title="Voir les détails"
        >
          <Eye className="h-4 w-4" />
        </button>
      );
    },
  }),
];

export const kycColumns = createKycColumns(() => {});
