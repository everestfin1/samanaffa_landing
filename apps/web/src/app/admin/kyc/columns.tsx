import { createColumnHelper } from '@tanstack/react-table';

// Placeholder type
type KycDocument = {
  id: string;
  user: string;
  documentType: string;
  status: string;
  submittedAt: string;
};

const columnHelper = createColumnHelper<KycDocument>();

export const kycColumns = [
  columnHelper.accessor('user', {
    header: 'Utilisateur',
  }),
  columnHelper.accessor('documentType', {
    header: 'Type de document',
  }),
  columnHelper.accessor('status', {
    header: 'Statut',
  }),
  columnHelper.accessor('submittedAt', {
    header: 'Date de soumission',
    cell: (info) => new Date(info.getValue()).toLocaleString(),
  }),
];
