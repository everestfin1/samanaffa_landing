import { createColumnHelper } from '@tanstack/react-table';
import type { Transaction } from './queries';
import { Eye } from 'lucide-react';
import Badge from '../../../components/admin/data-display/Badge';

const columnHelper = createColumnHelper<Transaction>();

const statusBadgeColors: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  PROCESSING: 'bg-blue-100 text-blue-800',
  COMPLETED: 'bg-green-100 text-green-800',
  CANCELLED: 'bg-gray-100 text-gray-800',
  FAILED: 'bg-red-100 text-red-800',
};

const statusLabels: Record<string, string> = {
  PENDING: 'En attente',
  PROCESSING: 'En cours',
  COMPLETED: 'Complétée',
  CANCELLED: 'Annulée',
  FAILED: 'Échouée',
};

const typeLabels: Record<string, string> = {
  DEPOSIT: 'Dépôt',
  INVESTMENT: 'Investissement',
  WITHDRAWAL: 'Retrait',
};

export const createTransactionColumns = (onViewDetails: (transaction: Transaction) => void) => [
  columnHelper.accessor('referenceNumber', {
    header: 'Référence',
    cell: (info) => (
      <span className="font-mono text-sm">{info.getValue()}</span>
    ),
  }),
  columnHelper.accessor('amount', {
    header: 'Montant',
    cell: (info) => (
      <span className="font-medium">{parseFloat(info.getValue()).toLocaleString()} FCFA</span>
    ),
  }),
  columnHelper.accessor('intentType', {
    header: 'Type',
    cell: (info) => typeLabels[info.getValue()] || info.getValue(),
    filterFn: (row, id, value) => {
      if (!value) return true;
      return String(row.getValue(id)).toLowerCase() === String(value).toLowerCase();
    },
  }),
  columnHelper.accessor('status', {
    header: 'Statut',
    cell: (info) => {
      const status = info.getValue();
      const variant =
        status === 'COMPLETED'
          ? 'success'
          : status === 'PROCESSING'
            ? 'info'
            : status === 'PENDING'
              ? 'warning'
              : status === 'FAILED'
                ? 'danger'
                : 'default';
      return (
        <Badge variant={variant}>{statusLabels[status] || status}</Badge>
      );
    },
    filterFn: (row, id, value) => {
      if (!value) return true;
      const cell = String(row.getValue(id)).toLowerCase();
      return cell.includes(String(value).toLowerCase());
    },
  }),
  columnHelper.accessor('paymentMethod', {
    header: 'Méthode',
    cell: (info) => (
      <span className="text-slate-600">{info.getValue()}</span>
    ),
    filterFn: (row, id, value) => {
      if (!value) return true;
      return String(row.getValue(id)).toLowerCase() === String(value).toLowerCase();
    },
  }),
  columnHelper.accessor('createdAt', {
    header: 'Date',
    cell: (info) => new Date(info.getValue()).toLocaleString('fr-FR'),
    filterFn: (row, id, value) => {
      if (!value) return true;
      const cellValue = String(row.getValue(id));
      return cellValue.slice(0, 10) === String(value);
    },
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

export const transactionColumns = createTransactionColumns(() => {});
