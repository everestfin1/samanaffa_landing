import { createFileRoute, useNavigate } from '@tanstack/react-router';
import * as React from 'react';
import PageHeader from '../../../components/admin/layout/PageHeader';
import { DataTable } from '../../../components/admin/data-display/DataTable/DataTable';
import StatCard from '../../../components/admin/data-display/StatCard';
import { kycColumns } from './columns';
import { useKycDocuments } from './queries';
import { FileCheck, Clock, CheckCircle, XCircle } from 'lucide-react';
import type { StatusOption } from '../../../components/admin/data-display/DataTable/DataTableToolbar';

const kycStatusOptions: StatusOption[] = [
  { label: 'Tous les statuts', value: '' },
  { label: 'En attente', value: 'pending' },
  { label: 'Approuvé', value: 'approved' },
  { label: 'Rejeté', value: 'rejected' },
  { label: 'En révision', value: 'under_review' },
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

  const { data, isLoading } = useKycDocuments({ page, pageSize });

  const kycDocuments = data?.kycDocuments ?? [];
  const pagination = data?.pagination ?? { total: 0, totalPages: 1 };

  const filteredKycDocuments = React.useMemo(() => {
    const qNorm = q.trim().toLowerCase();
    const statusNorm = status.trim().toLowerCase();

    return kycDocuments.filter((d) => {
      const matchesQ =
        qNorm.length === 0 ||
        d.documentType.toLowerCase().includes(qNorm) ||
        d.fileName.toLowerCase().includes(qNorm) ||
        d.userId.toLowerCase().includes(qNorm);

      const matchesStatus =
        statusNorm.length === 0 || d.verificationStatus.toLowerCase().includes(statusNorm);

      const matchesDate = date.length === 0 || d.uploadDate.slice(0, 10) === date;

      return matchesQ && matchesStatus && matchesDate;
    });
  }, [kycDocuments, q, status, date]);

  const stats = React.useMemo(() => {
    const total = pagination.total;
    const pending = kycDocuments.filter(d => d.verificationStatus === 'PENDING').length;
    const approved = kycDocuments.filter(d => d.verificationStatus === 'APPROVED').length;
    const rejected = kycDocuments.filter(d => d.verificationStatus === 'REJECTED').length;
    return { total, pending, approved, rejected };
  }, [kycDocuments, pagination.total]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Documents KYC"
        description="Gérez les documents KYC des utilisateurs"
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total" value={stats.total} icon={FileCheck} color="info" />
        <StatCard label="En attente" value={stats.pending} icon={Clock} color="warning" />
        <StatCard label="Approuvés" value={stats.approved} icon={CheckCircle} color="success" />
        <StatCard label="Rejetés" value={stats.rejected} icon={XCircle} color="danger" />
      </div>
      <DataTable
        columns={kycColumns}
        data={kycDocuments}
        isLoading={isLoading}
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
          statusOptions: kycStatusOptions,
          searchPlaceholder: 'Rechercher par type, fichier...',
        }}
        paginationProps={{
          page,
          pageSize,
          total: pagination.total,
          totalPages: pagination.totalPages,
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
