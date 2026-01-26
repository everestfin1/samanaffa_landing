import { createColumnHelper } from '@tanstack/react-table';

// Placeholder type
type User = {
  id: string;
  name: string;
  email: string;
  status: string;
  createdAt: string;
};

const columnHelper = createColumnHelper<User>();

export const userColumns = [
  columnHelper.accessor('name', {
    header: 'Nom',
  }),
  columnHelper.accessor('email', {
    header: 'Email',
  }),
  columnHelper.accessor('status', {
    header: 'Statut',
  }),
  columnHelper.accessor('createdAt', {
    header: 'Date',
    cell: (info) => new Date(info.getValue()).toLocaleDateString(),
  }),
];
