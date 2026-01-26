import { createFileRoute, useNavigate } from '@tanstack/react-router';
import * as React from 'react';
import PageContainer from '../../../components/admin/layout/PageContainer';
import PageHeader from '../../../components/admin/layout/PageHeader';
import { DataTable } from '../../../components/admin/data-display/DataTable/DataTable';

// Placeholder data and columns
const abandonedLeads = [
  { id: '1', email: 'unknown1@example.com', lastStep: 'Cart', value: 50000, detectedAt: new Date().toISOString() },
  { id: '2', email: 'unknown2@example.com', lastStep: 'Payment', value: 25000, detectedAt: new Date().toISOString() },
];

const columns = [
  { header: 'Email', accessorKey: 'email' },
  { header: 'Last Step', accessorKey: 'lastStep' },
  { header: 'Value', accessorKey: 'value' },
  { header: 'Detected At', accessorKey: 'detectedAt' },
];

export const Route = createFileRoute('/admin/leads/abandoned')({
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
  component: AbandonedLeadsPage,
});

function AbandonedLeadsPage() {
  const navigate = useNavigate({ from: Route.fullPath });
  const { page, pageSize, q, status, date } = Route.useSearch();

  const filteredLeads = React.useMemo(() => {
    const qNorm = q.trim().toLowerCase();
    const statusNorm = status.trim().toLowerCase();

    return abandonedLeads.filter((l) => {
      const matchesQ =
        qNorm.length === 0 ||
        l.email.toLowerCase().includes(qNorm) ||
        l.lastStep.toLowerCase().includes(qNorm) ||
        String(l.value).includes(qNorm);

      const matchesStatus =
        statusNorm.length === 0 ||
        l.lastStep.toLowerCase().includes(statusNorm);

      const matchesDate = date.length === 0 || l.detectedAt.slice(0, 10) === date;

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
        title="Abandoned Leads"
        description="Gérez les leads abandonnés"
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
        }}
        paginationProps={{
          page: currentPage,
          pageSize,
          total,
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
