import * as React from 'react';
import { Table as TableIcon, Settings2, Check } from 'lucide-react';
import { Table } from '@tanstack/react-table';

interface DataTableViewOptionsProps<TData> {
  table: Table<TData> | any;
}

const DataTableViewOptions = <TData,>({ table }: DataTableViewOptionsProps<TData>) => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="sama-button sama-button-outline inline-flex items-center gap-2 px-3 py-2 text-sm font-semibold"
      >
        <Settings2 className="h-4 w-4" />
        Colonnes
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 top-full z-20 mt-2 w-56 rounded-xl border border-slate-200 bg-white p-2 shadow-lg animate-fade-in">
            <div className="mb-2 px-2 py-1.5 text-xs font-bold uppercase tracking-wider text-slate-400">
              Afficher les colonnes
            </div>
            <div className="max-h-64 overflow-auto">
              {table
                .getAllColumns()
                .filter(
                  (column) =>
                    typeof column.accessorFn !== 'undefined' && column.getCanHide()
                )
                .map((column) => {
                  return (
                    <button
                      key={column.id}
                      onClick={() => column.toggleVisibility(!column.getIsVisible())}
                      className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-sm text-slate-600 hover:bg-slate-50 transition-colors"
                    >
                      <div className={`flex h-4 w-4 items-center justify-center rounded border ${column.getIsVisible() ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-slate-300'}`}>
                        {column.getIsVisible() && <Check className="h-3 w-3" />}
                      </div>
                      <span className="capitalize">
                        {typeof column.columnDef.header === 'string' 
                          ? column.columnDef.header 
                          : column.id}
                      </span>
                    </button>
                  );
                })}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default DataTableViewOptions;
