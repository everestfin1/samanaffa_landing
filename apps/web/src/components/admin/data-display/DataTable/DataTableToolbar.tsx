import * as React from 'react';
import { SlidersHorizontal, Download } from 'lucide-react';
import SearchInput from '../../forms/SearchInput';
import Select from '../../forms/Select';
import DatePicker from '../../forms/DatePicker';

const statusOptions = [
  { label: 'Tous les statuts', value: '' },
  { label: 'En attente', value: 'pending' },
  { label: 'Approuvé', value: 'approved' },
  { label: 'Rejeté', value: 'rejected' },
];

export interface DataTableToolbarProps {
  search?: string;
  onSearchChange?: (value: string) => void;
  status?: string;
  onStatusChange?: (value: string) => void;
  date?: string;
  onDateChange?: (value: string) => void;
  onExportClick?: () => void;
  onColumnsClick?: () => void;
}

const DataTableToolbar = ({
  search: controlledSearch,
  onSearchChange,
  status: controlledStatus,
  onStatusChange,
  date: controlledDate,
  onDateChange,
  onExportClick,
  onColumnsClick,
}: DataTableToolbarProps) => {
  const [uncontrolledSearch, setUncontrolledSearch] = React.useState('');
  const [uncontrolledStatus, setUncontrolledStatus] = React.useState('');
  const [uncontrolledDate, setUncontrolledDate] = React.useState('');

  const search = controlledSearch ?? uncontrolledSearch;
  const status = controlledStatus ?? uncontrolledStatus;
  const date = controlledDate ?? uncontrolledDate;

  const setSearch = (value: string) => {
    if (onSearchChange) {
      onSearchChange(value);
      return;
    }
    setUncontrolledSearch(value);
  };

  const setStatus = (value: string) => {
    if (onStatusChange) {
      onStatusChange(value);
      return;
    }
    setUncontrolledStatus(value);
  };

  const setDate = (value: string) => {
    if (onDateChange) {
      onDateChange(value);
      return;
    }
    setUncontrolledDate(value);
  };

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-3">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-1 flex-col gap-2 lg:flex-row lg:items-center">
          <SearchInput value={search} onChange={setSearch} className="w-full lg:max-w-xs" />
          <Select value={status} onChange={setStatus} options={statusOptions} className="w-full lg:w-48" />
          <DatePicker value={date} onChange={setDate} className="w-full lg:w-48" />
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onColumnsClick}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-600 shadow-sm hover:bg-slate-50"
          >
            <SlidersHorizontal className="h-4 w-4" />
            Colonnes
          </button>
          <button
            type="button"
            onClick={onExportClick}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-600 shadow-sm hover:bg-slate-50"
          >
            <Download className="h-4 w-4" />
            Export
          </button>
        </div>
      </div>
      {(search || status || date) && (
        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
          <span>Filtres actifs :</span>
          {search && <span className="rounded-full bg-emerald-50 px-2 py-1 text-emerald-700">Recherche</span>}
          {status && <span className="rounded-full bg-emerald-50 px-2 py-1 text-emerald-700">Statut</span>}
          {date && <span className="rounded-full bg-emerald-50 px-2 py-1 text-emerald-700">Date</span>}
          <button
            type="button"
            onClick={() => {
              setSearch('');
              setStatus('');
              setDate('');
            }}
            className="text-emerald-700 underline"
          >
            Effacer
          </button>
        </div>
      )}
    </div>
  );
};

export default DataTableToolbar;
