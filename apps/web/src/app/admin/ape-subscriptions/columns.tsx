import { createColumnHelper } from '@tanstack/react-table';

// Placeholder type
type ApeSubscription = {
  id: string;
  user: string;
  plan: string;
  status: string;
  startDate: string;
};

const columnHelper = createColumnHelper<ApeSubscription>();

export const apeSubscriptionColumns = [
  columnHelper.accessor('user', {
    header: 'Utilisateur',
  }),
  columnHelper.accessor('plan', {
    header: 'Plan',
  }),
  columnHelper.accessor('status', {
    header: 'Statut',
  }),
  columnHelper.accessor('startDate', {
    header: 'Date de début',
    cell: (info) => new Date(info.getValue()).toLocaleDateString(),
  }),
];
