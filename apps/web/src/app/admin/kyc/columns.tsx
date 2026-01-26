import { createColumnHelper } from '@tanstack/react-table';
import type { KycDocument } from './queries';
import Badge from '../../../components/admin/data-display/Badge';

const columnHelper = createColumnHelper<KycDocument>();

const statusBadgeColors: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  APPROVED: 'bg-green-100 text-green-800',
  REJECTED: 'bg-red-100 text-red-800',
  UNDER_REVIEW: 'bg-blue-100 text-blue-800',
};

const statusLabels: Record<string, string> = {
  PENDING: 'En attente',
  APPROVED: 'Approuvé',
  REJECTED: 'Rejeté',
  UNDER_REVIEW: 'En révision',
};

export const kycColumns = [
  columnHelper.accessor('userId', {
    header: 'ID Utilisateur',
    cell: (info) => (
      <span className="font-mono text-sm text-slate-600">{info.getValue().slice(0, 8)}...</span>
    ),
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
        <Badge variant={variant}>{statusLabels[status] || status}</Badge>
      );
    },
  }),
  columnHelper.accessor('uploadDate', {
    header: 'Date de soumission',
    cell: (info) => new Date(info.getValue()).toLocaleString('fr-FR'),
  }),
];
