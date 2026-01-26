import { createColumnHelper } from '@tanstack/react-table';

// Placeholder type
type Reconciliation = {
  id: string;
  transactionId: string;
  intouchId: string;
  status: string;
  amount: number;
  date: string;
};

const columnHelper = createColumnHelper<Reconciliation>();

export const reconciliationColumns = [
  columnHelper.accessor('transactionId', {
    header: 'ID Transaction',
  }),
  columnHelper.accessor('intouchId', {
    header: 'ID Intouch',
  }),
  columnHelper.accessor('status', {
    header: 'Statut',
  }),
  columnHelper.accessor('amount', {
    header: 'Montant',
    cell: (info) => `${info.getValue().toLocaleString()} FCFA`,
  }),
  columnHelper.accessor('date', {
    header: 'Date',
    cell: (info) => new Date(info.getValue()).toLocaleString(),
  }),
];
