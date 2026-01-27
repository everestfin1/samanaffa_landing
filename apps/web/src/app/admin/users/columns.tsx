import { createColumnHelper } from '@tanstack/react-table';
import type { User } from './queries';
import Badge from '../../../components/admin/data-display/Badge';
import { Eye } from 'lucide-react';
import { kycStatusLabels } from '../../../components/admin/utils/statusLabels';
import { getStatusVariant } from '../../../components/admin/utils/statusVariants';

const columnHelper = createColumnHelper<User>();

const statusBadgeColors: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  APPROVED: 'bg-green-100 text-green-800',
  REJECTED: 'bg-red-100 text-red-800',
  UNDER_REVIEW: 'bg-blue-100 text-blue-800',
};

export const createUserColumns = (onViewDetails: (user: User) => void) => [
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
      const variant = getStatusVariant(status, 'kyc');
      return (
        <Badge variant={variant}>{kycStatusLabels[status] || status}</Badge>
      );
    },
  }),
  columnHelper.accessor('createdAt', {
    header: 'Date inscription',
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

export const userColumns = createUserColumns(() => {});
