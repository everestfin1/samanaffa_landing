import { createFileRoute, useNavigate } from '@tanstack/react-router';
import * as React from 'react';
import type { GroupingState, ExpandedState } from '@tanstack/react-table';
import PageHeader from '../../../components/admin/layout/PageHeader';
import { DataTable } from '../../../components/admin/data-display/DataTable/DataTable';
import StatCard from '../../../components/admin/data-display/StatCard';
import { createKycColumns } from './columns';
import { useKycDocuments } from './queries';
import { FileCheck, Clock, CheckCircle, XCircle } from 'lucide-react';
import type { StatusOption } from '../../../components/admin/data-display/DataTable/DataTableToolbar';
import Sheet from '../../../components/admin/feedback/Sheet';
import Badge from '../../../components/admin/data-display/Badge';
import type { KycDocument } from './queries';

const verificationStatusLabels: Record<string, string> = {
  PENDING: 'En attente',
  APPROVED: 'Approuvé',
  REJECTED: 'Rejeté',
  UNDER_REVIEW: 'En révision',
};

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
  const [grouping, setGrouping] = React.useState<GroupingState>(['userGroupKey']);
  const [expanded, setExpanded] = React.useState<ExpandedState>({});
  const [selectedDoc, setSelectedDoc] = React.useState<KycDocument | null>(null);

  const { data, isLoading } = useKycDocuments({ page, pageSize, q, status, date });

  const kycDocuments = data?.kycDocuments ?? [];
  const pagination = data?.pagination ?? { total: 0, totalPages: 1 };

  const stats = React.useMemo(() => {
    const total = pagination.total;
    const pending = kycDocuments.filter(d => d.verificationStatus === 'PENDING').length;
    const approved = kycDocuments.filter(d => d.verificationStatus === 'APPROVED').length;
    const rejected = kycDocuments.filter(d => d.verificationStatus === 'REJECTED').length;
    return { total, pending, approved, rejected };
  }, [kycDocuments, pagination.total]);

  const columns = React.useMemo(
    () => createKycColumns((doc) => setSelectedDoc(doc)),
    []
  );

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
        columns={columns}
        data={kycDocuments}
        isLoading={isLoading}
        grouping={grouping}
        onGroupingChange={setGrouping}
        expanded={expanded}
        onExpandedChange={setExpanded}
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

      <Sheet
        isOpen={!!selectedDoc}
        onClose={() => setSelectedDoc(null)}
        title="Détails du document KYC"
        description={selectedDoc?.fileName}
        footer={
          <div className="flex justify-end">
            <button
              onClick={() => setSelectedDoc(null)}
              className="sama-button sama-button-outline px-4 py-2"
            >
              Fermer
            </button>
          </div>
        }
      >
        {selectedDoc && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Utilisateur</p>
                <p className="font-medium text-slate-900">
                  {(selectedDoc.userName ?? '').trim() || selectedDoc.userId.slice(0, 8)}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Statut</p>
                <div className="flex">
                  <Badge
                    variant={
                      selectedDoc.verificationStatus === 'APPROVED'
                        ? 'success'
                        : selectedDoc.verificationStatus === 'PENDING' ||
                            selectedDoc.verificationStatus === 'UNDER_REVIEW'
                          ? 'warning'
                          : selectedDoc.verificationStatus === 'REJECTED'
                            ? 'danger'
                            : 'default'
                    }
                  >
                    {verificationStatusLabels[selectedDoc.verificationStatus] ?? selectedDoc.verificationStatus}
                  </Badge>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Type de document</p>
                <p className="text-slate-900">{selectedDoc.documentType}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Date de soumission</p>
                <p className="text-slate-900">{new Date(selectedDoc.uploadDate).toLocaleString('fr-FR')}</p>
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-slate-100">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">ID Document</span>
                <span className="font-mono text-slate-600">{selectedDoc.id}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">ID Utilisateur</span>
                <span className="font-mono text-slate-600">{selectedDoc.userId}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Fichier</span>
                <span className="font-medium text-slate-900">{selectedDoc.fileName}</span>
              </div>
            </div>
          </div>
        )}
      </Sheet>
    </div>
  );
}
