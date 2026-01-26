import * as React from 'react';

export interface DataTablePaginationProps {
  page: number;
  pageSize: number;
  total: number;
  totalPages?: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  className?: string;
}

const pageSizeOptions = [10, 25, 50, 100];

const DataTablePagination = ({
  page,
  pageSize,
  total,
  totalPages,
  onPageChange,
  onPageSizeChange,
  className = '',
}: DataTablePaginationProps) => {
  const computedTotalPages = Math.max(1, Math.ceil(total / pageSize));
  const effectiveTotalPages = Math.max(1, totalPages ?? computedTotalPages);
  const clampedPage = Math.min(Math.max(1, page), effectiveTotalPages);

  const from = total === 0 ? 0 : (clampedPage - 1) * pageSize + 1;
  const to = Math.min(clampedPage * pageSize, total);

  return (
    <div className={`flex flex-col gap-2 rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-600 lg:flex-row lg:items-center lg:justify-between ${className}`}>
      <div>
        {from}-{to} sur {total} résultats
      </div>
      <div className="flex items-center gap-2">
        <span className="hidden sm:inline">Par page</span>
        <select
          value={pageSize}
          onChange={(event) => onPageSizeChange(Number(event.target.value))}
          className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
        >
          {pageSizeOptions.map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>

        <button
          type="button"
          onClick={() => onPageChange(clampedPage - 1)}
          disabled={clampedPage <= 1}
          className="rounded-lg border border-slate-200 bg-white px-3 py-1 text-sm font-semibold shadow-sm disabled:opacity-50"
        >
          ◀
        </button>
        <div className="min-w-[120px] text-center">
          Page {clampedPage} / {effectiveTotalPages}
        </div>
        <button
          type="button"
          onClick={() => onPageChange(clampedPage + 1)}
          disabled={clampedPage >= effectiveTotalPages}
          className="rounded-lg border border-slate-200 bg-white px-3 py-1 text-sm font-semibold shadow-sm disabled:opacity-50"
        >
          ▶
        </button>
      </div>
    </div>
  );
};

export default DataTablePagination;
