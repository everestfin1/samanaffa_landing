import * as React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export interface DataTablePaginationProps {
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  className?: string;
}

const pageSizeOptions = [10, 25, 50, 100];

const DataTablePagination = ({
  page,
  pageSize,
  total,
  onPageChange,
  onPageSizeChange,
  className = '',
}: DataTablePaginationProps) => {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const clampedPage = Math.min(Math.max(1, page), totalPages);

  const canGoPrevious = clampedPage > 1;
  const canGoNext = clampedPage < totalPages;

  const from = total === 0 ? 0 : (clampedPage - 1) * pageSize + 1;
  const to = Math.min(clampedPage * pageSize, total);

  return (
    <div className={`flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm text-sm text-slate-600 lg:flex-row lg:items-center lg:justify-between ${className}`}>
      <div className="flex items-center gap-2">
        <span className="font-medium text-slate-900">{from}-{to}</span>
        <span>sur</span>
        <span className="font-medium text-slate-900">{total}</span>
        <span>résultats</span>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="hidden sm:inline text-xs font-semibold uppercase tracking-wider text-slate-400">Par page</span>
          <select
            value={pageSize}
            onChange={(event) => onPageSizeChange(Number(event.target.value))}
            className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-sm font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 transition-all"
          >
            {pageSizeOptions.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>

        <div className="h-8 w-px bg-slate-100 hidden sm:block" />

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => onPageChange(clampedPage - 1)}
            disabled={!canGoPrevious}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 shadow-sm transition-all hover:bg-slate-50 disabled:opacity-30 disabled:hover:bg-white disabled:cursor-not-allowed"
            title="Page précédente"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          
          <div className="flex items-center gap-1 px-2">
            <span className="text-slate-400 text-xs uppercase font-bold tracking-tighter">Page</span>
            <span className="font-bold text-slate-900 min-w-[1.5rem] text-center">{clampedPage}</span>
            <span className="text-slate-300">/</span>
            <span className="text-slate-500 font-medium">{totalPages}</span>
          </div>

          <button
            type="button"
            onClick={() => onPageChange(clampedPage + 1)}
            disabled={!canGoNext}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 shadow-sm transition-all hover:bg-slate-50 disabled:opacity-30 disabled:hover:bg-white disabled:cursor-not-allowed"
            title="Page suivante"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default DataTablePagination;
