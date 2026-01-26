import { createColumnHelper } from '@tanstack/react-table';
import type { KycDocument } from './queries';

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
      return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusBadgeColors[status] || 'bg-gray-100 text-gray-800'}`}>
          {statusLabels[status] || status}
        </span>
      );
    },
  }),
  columnHelper.accessor('uploadDate', {
    header: 'Date de soumission',
    cell: (info) => new Date(info.getValue()).toLocaleString('fr-FR'),
  }),
];
