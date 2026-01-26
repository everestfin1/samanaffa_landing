import * as React from 'react';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  PaginationState,
  SortingState,
  ColumnFiltersState,
  RowSelectionState,
} from '@tanstack/react-table';
import DataTableToolbar, { type DataTableToolbarProps } from './DataTableToolbar';
import DataTablePagination, { type DataTablePaginationProps } from './DataTablePagination';
import { DataTableColumnHeader } from './DataTableColumnHeader';

interface DataTableProps<TData> {
  columns: ColumnDef<TData, any>[];
  data: TData[];
  pageCount?: number;
  pageSize?: number;
  pageIndex?: number;
  onPaginationChange?: (pagination: PaginationState) => void;
  sorting?: SortingState;
  onSortingChange?: (sorting: SortingState) => void;
  columnFilters?: ColumnFiltersState;
  onColumnFiltersChange?: (filters: ColumnFiltersState) => void;
  globalFilter?: string;
  onGlobalFilterChange?: (value: string) => void;
  rowSelection?: RowSelectionState;
  onRowSelectionChange?: (selection: RowSelectionState) => void;
  enableRowSelection?: boolean;
  statusFilterId?: string;
  dateFilterId?: string;
  isLoading?: boolean;
  toolbarProps?: DataTableToolbarProps<TData>;
  paginationProps?: DataTablePaginationProps;
}

export function DataTable<TData>({
  columns,
  data,
  isLoading,
  enableRowSelection = true,
  statusFilterId = 'status',
  dateFilterId = 'createdAt',
  toolbarProps,
  paginationProps,
}: DataTableProps<TData>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = React.useState('');
  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: paginationProps?.pageSize ?? 25,
  });

  React.useEffect(() => {
    if (typeof toolbarProps?.search !== 'string') return;
    setGlobalFilter(toolbarProps.search);
  }, [toolbarProps?.search]);

  const facetedFiltersKey = React.useMemo(() => {
    return (toolbarProps?.facetedFilters ?? [])
      .map((f) => `${f.columnId ?? ''}:${f.value ?? ''}`)
      .join('|');
  }, [toolbarProps?.facetedFilters]);

  React.useEffect(() => {
    if (!toolbarProps) return;
    
    const facetColumnIds = (toolbarProps.facetedFilters ?? [])
      .map((f) => f.columnId)
      .filter(Boolean) as string[];

    setColumnFilters((prev) => {
      const next = prev.filter(
        (filter) =>
          filter.id !== statusFilterId &&
          filter.id !== dateFilterId &&
          !facetColumnIds.includes(filter.id)
      );

      if (toolbarProps.status) {
        next.push({ id: statusFilterId, value: toolbarProps.status });
      }

      if (toolbarProps.date) {
        next.push({ id: dateFilterId, value: toolbarProps.date });
      }

      (toolbarProps.facetedFilters ?? []).forEach((facet) => {
        if (!facet.columnId || !facet.value) return;
        next.push({ id: facet.columnId, value: facet.value });
      });

      return next;
    });
  }, [toolbarProps?.status, toolbarProps?.date, facetedFiltersKey, toolbarProps?.facetedFilters, statusFilterId, dateFilterId]);

  React.useEffect(() => {
    if (!paginationProps) return;
    setPagination((prev) => ({
      ...prev,
      pageIndex: Math.max(0, (paginationProps.page ?? 1) - 1),
      pageSize: paginationProps.pageSize,
    }));
  }, [paginationProps?.page, paginationProps?.pageSize]);

  const columnsWithSelection = React.useMemo<ColumnDef<TData, any>[]>(() => {
    if (!enableRowSelection) return columns;

    const selectionCol: ColumnDef<TData, any> = {
      id: '__select',
      header: ({ table }) => (
        <input
          type="checkbox"
          checked={table.getIsAllPageRowsSelected()}
          onChange={(e) => table.toggleAllPageRowsSelected(e.target.checked)}
          className="h-4 w-4 rounded border-slate-300"
          aria-label="Sélectionner tout"
        />
      ),
      cell: ({ row }) => (
        <input
          type="checkbox"
          checked={row.getIsSelected()}
          onChange={(e) => row.toggleSelected(e.target.checked)}
          className="h-4 w-4 rounded border-slate-300"
          aria-label="Sélectionner la ligne"
        />
      ),
      enableSorting: false,
    };

    return [selectionCol, ...columns];
  }, [columns, enableRowSelection]);

  const table = useReactTable({
    data,
    columns: columnsWithSelection,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      sorting,
      globalFilter,
      rowSelection,
      columnFilters,
      pagination,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    onRowSelectionChange: setRowSelection,
    onColumnFiltersChange: setColumnFilters,
    onPaginationChange: setPagination,
    enableRowSelection: true,
    isMultiSortEvent: (e: any) => e.shiftKey,
  });

  const handleExport = React.useCallback(() => {
    const selected = table.getSelectedRowModel().rows;
    const rowsToExport = selected.length > 0 ? selected : table.getFilteredRowModel().rows;
    const items = rowsToExport.map((r) => r.original as any);
    if (items.length === 0) return;

    // Get only visible columns (excluding internal columns like __select and actions)
    const visibleColumns = table.getAllColumns().filter(
      (col) => col.getIsVisible() && col.id !== '__select' && col.id !== 'actions'
    );

    const headers = visibleColumns.map((col) => {
      if (typeof col.columnDef.header === 'string') return col.columnDef.header;
      return col.id;
    });

    const escapeCell = (value: unknown) => {
      if (value === null || value === undefined) return '';
      const str = typeof value === 'string' ? value : JSON.stringify(value);
      return `"${str.replaceAll('"', '""')}"`;
    };

    const csvRows = [headers.join(',')];

    rowsToExport.forEach((row) => {
      const rowData = visibleColumns.map((col) => {
        const value = row.getValue(col.id);
        return escapeCell(value);
      });
      csvRows.push(rowData.join(','));
    });

    const csv = csvRows.join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `export-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }, [table]);

  return (
    <div className="space-y-4">
      <DataTableToolbar
        table={table}
        search={toolbarProps?.search ?? globalFilter}
        onSearchChange={toolbarProps?.onSearchChange ?? ((value) => setGlobalFilter(value))}
        onExportClick={toolbarProps?.onExportClick ?? handleExport}
        selectedCount={table.getSelectedRowModel().rows.length}
        {...toolbarProps}
      />
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b border-slate-200">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id} className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    {header.isPlaceholder
                      ? null
                      : typeof header.column.columnDef.header === 'string'
                        ? (
                          <DataTableColumnHeader
                            column={header.column}
                            title={header.column.columnDef.header}
                          />
                        )
                        : flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-slate-100">
            {isLoading ? (
              <tr>
                <td colSpan={columnsWithSelection.length} className="text-center py-8 text-slate-500">
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                    Chargement...
                  </div>
                </td>
              </tr>
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="hover:bg-slate-50 transition-colors">
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-4 py-3 text-slate-700">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columnsWithSelection.length} className="text-center py-8 text-slate-500">
                  Aucun résultat trouvé.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {paginationProps ? (
        <DataTablePagination
          {...paginationProps}
          page={pagination.pageIndex + 1}
          pageSize={pagination.pageSize}
          total={paginationProps.total}
          onPageChange={(nextPage) => {
            setPagination((prev) => ({ ...prev, pageIndex: Math.max(0, nextPage - 1) }));
            paginationProps.onPageChange(nextPage);
          }}
          onPageSizeChange={(nextPageSize) => {
            setPagination((prev) => ({ ...prev, pageSize: nextPageSize, pageIndex: 0 }));
            paginationProps.onPageSizeChange(nextPageSize);
          }}
        />
      ) : null}
    </div>
  );
}
