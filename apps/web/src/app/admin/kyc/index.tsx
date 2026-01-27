import { createFileRoute, useNavigate } from '@tanstack/react-router';
import * as React from 'react';
import type { GroupingState, ExpandedState } from '@tanstack/react-table';
import PageHeader from '../../../components/admin/layout/PageHeader';
import { DataTable } from '../../../components/admin/data-display/DataTable/DataTable';
import StatCard from '../../../components/admin/data-display/StatCard';
import { createKycColumns } from './columns';
import { useKycDocuments } from './queries';
import { 
  FileCheck, 
  Clock, 
  CheckCircle, 
  XCircle,
  FileText,
  User,
  Calendar,
  ShieldCheck,
  ExternalLink,
  Hash,
  Eye
} from 'lucide-react';
import type { StatusOption } from '../../../components/admin/data-display/DataTable/DataTableToolbar';
import Sheet from '../../../components/admin/feedback/Sheet';
import Badge from '../../../components/admin/data-display/Badge';
import type { KycDocument } from './queries';
import { normalizeStatusParam } from '../../../components/admin/utils/searchParams';
import { 
  kycStatusLabels, 
  kycStatusOptions 
} from '../../../components/admin/utils/statusLabels';
import { getStatusVariant } from '../../../components/admin/utils/statusVariants';

export const Route = createFileRoute('/admin/kyc/')({
  validateSearch: (search) => {
    const page = Number(search.page) || 1;
    const pageSize = Number(search.pageSize) || 25;
    const q = typeof search.q === 'string' ? search.q : '';
    const status = normalizeStatusParam(search.status);
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
          <div className="flex justify-end gap-3 px-6 py-4 bg-slate-50 border-t border-slate-100 rounded-b-2xl">
            <button
              onClick={() => setSelectedDoc(null)}
              className="px-6 py-2.5 text-[14px] font-black text-slate-600 hover:text-slate-900 transition-all"
            >
              Fermer
            </button>
          </div>
        }
      >
        {selectedDoc && (
          <div className="flex flex-col h-full overflow-hidden">
            <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
              {/* Status & Highlights */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm">
                      <FileCheck className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Type de Document</p>
                      <p className="text-[15px] font-black text-slate-900">{selectedDoc.documentType}</p>
                    </div>
                  </div>
                  <div className="flex">
                    <Badge variant={getStatusVariant(selectedDoc.verificationStatus, 'kyc')}>
                      {kycStatusLabels[selectedDoc.verificationStatus] ?? selectedDoc.verificationStatus}
                    </Badge>
                  </div>
                </div>
                <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm">
                      <Calendar className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Date de soumission</p>
                      <p className="text-[15px] font-bold text-slate-900">
                        {new Date(selectedDoc.uploadDate).toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                  <p className="text-[13px] font-medium text-slate-500">
                    {new Date(selectedDoc.uploadDate).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>

              {/* Identity Info */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 px-1">
                  <User className="w-4 h-4 text-emerald-600" />
                  <h3 className="text-[14px] font-black text-slate-900 uppercase tracking-wider">Identité Utilisateur</h3>
                </div>
                <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
                  <div className="space-y-1">
                    <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Nom / ID</p>
                    <p className="text-[15px] font-bold text-slate-900">
                      {(selectedDoc.userName ?? '').trim() || selectedDoc.userId.slice(0, 8)}
                    </p>
                    <p className="text-[12px] font-mono text-slate-400">{selectedDoc.userId}</p>
                  </div>
                </div>
              </div>

              {/* File Info */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 px-1">
                  <FileText className="w-4 h-4 text-emerald-600" />
                  <h3 className="text-[14px] font-black text-slate-900 uppercase tracking-wider">Fichier</h3>
                </div>
                <div className="bg-slate-50/50 rounded-2xl p-6 border border-slate-100 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="min-w-0">
                      <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Nom du fichier</p>
                      <p className="text-[14px] font-medium text-slate-900 truncate">{selectedDoc.fileName}</p>
                    </div>
                    <a 
                      href={selectedDoc.fileUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl border border-slate-200 text-[13px] font-black text-slate-700 hover:text-emerald-600 hover:border-emerald-200 hover:shadow-sm transition-all"
                    >
                      <Eye className="w-4 h-4" />
                      Visualiser
                    </a>
                  </div>
                  <div className="pt-3 border-t border-slate-100">
                    <div className="flex justify-between items-center">
                      <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">ID Document</span>
                      <span className="font-mono text-[12px] font-bold text-slate-600">{selectedDoc.id}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </Sheet>
    </div>
  );
}
