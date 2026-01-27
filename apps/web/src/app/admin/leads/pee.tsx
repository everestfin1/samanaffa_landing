import { createFileRoute, useNavigate } from '@tanstack/react-router';
import * as React from 'react';
import PageContainer from '../../../components/admin/layout/PageContainer';
import PageHeader from '../../../components/admin/layout/PageHeader';
import { DataTable } from '../../../components/admin/data-display/DataTable/DataTable';
import type { StatusOption } from '../../../components/admin/data-display/DataTable/DataTableToolbar';

// Placeholder data and columns
const peeLeads = [
  { id: '1', name: 'Ousmane Ba', email: 'ousmane@example.com', status: 'New', createdAt: new Date().toISOString() },
  { id: '2', name: 'Aissatou Diallo', email: 'aissatou@example.com', status: 'Contacted', createdAt: new Date().toISOString() },
];

const columns = [
  { header: 'Name', accessorKey: 'name' },
  { header: 'Email', accessorKey: 'email' },
  { header: 'Status', accessorKey: 'status' },
  { header: 'Date', accessorKey: 'createdAt' },
];

const peeStatusOptions: StatusOption[] = [
  { label: 'Tous les statuts', value: '' },
  { label: 'Nouveau', value: 'new' },
  { label: 'Contacté', value: 'contacted' },
];

export const Route = createFileRoute('/admin/leads/pee')({
  validateSearch: (search) => {
    const page = Number(search.page) || 1;
    const pageSize = Number(search.pageSize) || 25;
    const q = typeof search.q === 'string' ? search.q : '';
    const status = typeof search.status === 'string' ? search.status : '';
    const date = typeof search.date === 'string' ? search.date : '';

    return {
      page: Math.max(1, page),
      pageSize: [10, 25, 50, 100].includes(pageSize) ? pageSize : 25,
      q,
      status,
      date,
    };
  },
  component: PeeLeadsPage,
});

function PeeLeadsPage() {
  const navigate = useNavigate({ from: Route.fullPath });
  const { page, pageSize, q, status, date } = Route.useSearch();

  const filteredLeads = React.useMemo(() => {
    const qNorm = q.trim().toLowerCase();
    const statusNorm = status.trim().toLowerCase();

    return peeLeads.filter((l) => {
      const matchesQ =
        qNorm.length === 0 ||
        l.name.toLowerCase().includes(qNorm) ||
        l.email.toLowerCase().includes(qNorm);

      const matchesStatus =
        statusNorm.length === 0 ||
        l.status.toLowerCase().includes(statusNorm);

      const matchesDate = date.length === 0 || l.createdAt.slice(0, 10) === date;

      return matchesQ && matchesStatus && matchesDate;
    });
  }, [q, status, date]);

  const total = filteredLeads.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const currentPage = Math.min(page, totalPages);
  const startIndex = (currentPage - 1) * pageSize;
  const pagedLeads = filteredLeads.slice(startIndex, startIndex + pageSize);

  return (
    <PageContainer>
      <PageHeader
        title="PEE Leads"
        description="Gérez les leads du programme PEE"
      />
      <DataTable
        columns={columns}
        data={pagedLeads}
        toolbarProps={{
          search: q,
          onSearchChange: (value) =>
            navigate({
              search: (prev) => ({ ...prev, q: value, page: 1 }),
              replace: true,
            }),
          status,
          onStatusChange: (value) =>
            navigate({
              search: (prev) => ({ ...prev, status: value, page: 1 }),
              replace: true,
            }),
          date,
          onDateChange: (value) =>
            navigate({
              search: (prev) => ({ ...prev, date: value, page: 1 }),
              replace: true,
            }),
          statusOptions: peeStatusOptions,
          searchPlaceholder: 'Rechercher par nom, email...',
        }}
        paginationProps={{
          page: currentPage,
          pageSize,
          total,
          totalPages,
          onPageChange: (nextPage) =>
            navigate({
              search: (prev) => ({ ...prev, page: nextPage }),
              replace: true,
            }),
          onPageSizeChange: (nextPageSize) =>
            navigate({
              search: (prev) => ({ ...prev, pageSize: nextPageSize, page: 1 }),
              replace: true,
            }),
        }}
      />
    </PageContainer>
  );
}
