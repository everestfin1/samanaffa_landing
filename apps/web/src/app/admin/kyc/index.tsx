import { createFileRoute, useNavigate } from '@tanstack/react-router';
import * as React from 'react';
import PageHeader from '../../../components/admin/layout/PageHeader';
import { DataTable } from '../../../components/admin/data-display/DataTable/DataTable';
import StatCard from '../../../components/admin/data-display/StatCard';
import { kycColumns } from './columns';
import { FileCheck, Clock, CheckCircle, XCircle } from 'lucide-react';

// Placeholder data
const kycDocuments = [
  { id: '1', user: 'Moussa Diop', documentType: 'ID Card', status: 'Pending', submittedAt: new Date().toISOString() },
  { id: '2', user: 'Fatou Sow', documentType: 'Passport', status: 'Approved', submittedAt: new Date().toISOString() },
];

export const Route = createFileRoute('/admin/kyc/')({
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
  component: KycPage,
});

function KycPage() {
  const navigate = useNavigate({ from: Route.fullPath });
  const { page, pageSize, q, status, date } = Route.useSearch();

  const filteredKycDocuments = React.useMemo(() => {
    const qNorm = q.trim().toLowerCase();
    const statusNorm = status.trim().toLowerCase();

    return kycDocuments.filter((d) => {
      const matchesQ =
        qNorm.length === 0 ||
        d.user.toLowerCase().includes(qNorm) ||
        d.documentType.toLowerCase().includes(qNorm);

      const matchesStatus =
        statusNorm.length === 0 ||
        d.status.toLowerCase().includes(statusNorm);

      const matchesDate = date.length === 0 || d.submittedAt.slice(0, 10) === date;

      return matchesQ && matchesStatus && matchesDate;
    });
  }, [q, status, date]);

  const total = filteredKycDocuments.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const currentPage = Math.min(page, totalPages);
  const startIndex = (currentPage - 1) * pageSize;
  const pagedKycDocuments = filteredKycDocuments.slice(startIndex, startIndex + pageSize);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Documents KYC"
        description="Gérez les documents KYC des utilisateurs"
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total" value={45} icon={FileCheck} color="info" />
        <StatCard label="En attente" value={12} icon={Clock} color="warning" />
        <StatCard label="Approuvés" value={30} icon={CheckCircle} color="success" />
        <StatCard label="Rejetés" value={3} icon={XCircle} color="danger" />
      </div>
      <DataTable
        columns={kycColumns}
        data={pagedKycDocuments}
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
    </div>
  );
}
