import { createColumnHelper } from '@tanstack/react-table';
import type { User } from './queries';

const columnHelper = createColumnHelper<User>();

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

export const userColumns = [
  columnHelper.accessor((row) => `${row.firstName} ${row.lastName}`, {
    id: 'name',
    header: 'Nom',
    cell: (info) => (
      <div className="font-medium text-slate-900">{info.getValue()}</div>
    ),
  }),
  columnHelper.accessor('email', {
    header: 'Email',
    cell: (info) => (
      <span className="text-slate-600">{info.getValue()}</span>
    ),
  }),
  columnHelper.accessor('phone', {
    header: 'Téléphone',
    cell: (info) => (
      <span className="text-slate-600">{info.getValue()}</span>
    ),
  }),
  columnHelper.accessor('kycStatus', {
    header: 'Statut KYC',
    cell: (info) => {
      const status = info.getValue();
      return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusBadgeColors[status] || 'bg-gray-100 text-gray-800'}`}>
          {statusLabels[status] || status}
        </span>
      );
    },
  }),
  columnHelper.accessor('createdAt', {
    header: 'Date inscription',
    cell: (info) => new Date(info.getValue()).toLocaleDateString('fr-FR'),
  }),
];
