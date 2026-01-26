import { createColumnHelper } from '@tanstack/react-table';

// Placeholder type
type SponsorCode = {
  id: string;
  code: string;
  usageCount: number;
  maxUsage: number;
  status: string;
  createdAt: string;
};

const columnHelper = createColumnHelper<SponsorCode>();

export const sponsorCodeColumns = [
  columnHelper.accessor('code', {
    header: 'Code',
  }),
  columnHelper.accessor('usageCount', {
    header: 'Utilisations',
    cell: (info) => `${info.getValue()} / ${info.row.original.maxUsage}`,
  }),
  columnHelper.accessor('status', {
    header: 'Statut',
  }),
  columnHelper.accessor('createdAt', {
    header: 'Date de création',
    cell: (info) => new Date(info.getValue()).toLocaleDateString(),
  }),
];
