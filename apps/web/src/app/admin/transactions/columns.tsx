import { createColumnHelper } from '@tanstack/react-table';

// Placeholder type
type Transaction = {
  id: string;
  user: string;
  amount: number;
  status: string;
  type: string;
  createdAt: string;
};

const columnHelper = createColumnHelper<Transaction>();

export const transactionColumns = [
  columnHelper.accessor('user', {
    header: 'Utilisateur',
  }),
  columnHelper.accessor('amount', {
    header: 'Montant',
    cell: (info) => `${info.getValue().toLocaleString()} FCFA`,
  }),
  columnHelper.accessor('status', {
    header: 'Statut',
  }),
  columnHelper.accessor('type', {
    header: 'Type',
  }),
  columnHelper.accessor('createdAt', {
    header: 'Date',
    cell: (info) => new Date(info.getValue()).toLocaleString(),
  }),
];
