import * as React from 'react';
import { Column } from '@tanstack/react-table';
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';

interface DataTableColumnHeaderProps<TData, TValue> {
  column: Column<TData, TValue>;
  title: string;
  className?: string;
}

export function DataTableColumnHeader<TData, TValue>({
  column,
  title,
  className,
}: DataTableColumnHeaderProps<TData, TValue>) {
  const isSortable = column.getCanSort();
  const sort = column.getIsSorted();

  const Icon = sort === 'asc' ? ArrowUp : sort === 'desc' ? ArrowDown : ArrowUpDown;

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {isSortable ? (
        <button
          type="button"
          onClick={column.getToggleSortingHandler()}
          className={`inline-flex items-center gap-1.5 text-left transition-colors duration-200 ${
            sort ? 'text-emerald-700 font-bold' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <span className="truncate">{title}</span>
          <div className={`flex h-5 w-5 items-center justify-center rounded-md transition-colors ${
            sort ? 'bg-emerald-50 text-emerald-600' : 'text-slate-400 group-hover:text-slate-500'
          }`}>
            <Icon className={`h-3.5 w-3.5 ${!sort && 'opacity-50'}`} />
          </div>
        </button>
      ) : (
        <span className="text-slate-600">{title}</span>
      )}
    </div>
  );
}
