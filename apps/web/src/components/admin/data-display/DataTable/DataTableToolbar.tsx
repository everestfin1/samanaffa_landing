import * as React from 'react';
import { Download, X } from 'lucide-react';
import SearchInput from '../../forms/SearchInput';
import Select from '../../forms/Select';
import DatePicker from '../../forms/DatePicker';
import DataTableFacetedFilter, { type FacetOption } from './DataTableFacetedFilter';
import DataTableViewOptions from './DataTableViewOptions';
import { Table } from '@tanstack/react-table';

export interface StatusOption {
  label: string;
  value: string;
}

const defaultStatusOptions: StatusOption[] = [
  { label: 'Tous les statuts', value: '' },
  { label: 'En attente', value: 'PENDING' },
  { label: 'Approuvé', value: 'APPROVED' },
  { label: 'Rejeté', value: 'REJECTED' },
];

export interface DataTableToolbarProps<TData> {
  table?: Table<TData>;
  search?: string;
  onSearchChange?: (value: string) => void;
  status?: string;
  onStatusChange?: (value: string) => void;
  date?: string;
  onDateChange?: (value: string) => void;
  onExportClick?: () => void;
  statusOptions?: StatusOption[];
  statusLabel?: string;
  searchPlaceholder?: string;
  selectedCount?: number;
  facetedFilters?: Array<{
    columnId?: string;
    label: string;
    options: FacetOption[];
    value?: string;
    onChange?: (value: string) => void;
  }>;
}

const DataTableToolbar = <TData,>({
  table,
  search: controlledSearch,
  onSearchChange,
  status: controlledStatus,
  onStatusChange,
  date: controlledDate,
  onDateChange,
  onExportClick,
  statusOptions,
  searchPlaceholder,
  selectedCount,
  facetedFilters,
}: DataTableToolbarProps<TData>) => {
  const [uncontrolledSearch, setUncontrolledSearch] = React.useState('');
  const [uncontrolledStatus, setUncontrolledStatus] = React.useState('');
  const [uncontrolledDate, setUncontrolledDate] = React.useState('');

  const safeStatusOptions = statusOptions ?? defaultStatusOptions;
  const safeFacetedFilters = facetedFilters ?? [];

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

  const hasFilters = safeStatusOptions.length > 0 || safeFacetedFilters.length > 0;
  const hasActiveFilters = search || status || date || safeFacetedFilters.some(f => f.value);

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm animate-fade-in">
      {/* Search Input */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="w-full lg:max-w-xs">
          <SearchInput 
            value={search} 
            onChange={setSearch} 
            placeholder={searchPlaceholder} 
            className="sama-input" 
          />
        </div>
        
        {/* Secondary Actions (Export, Visibility) */}
        <div className="flex items-center gap-2">
          {table ? <DataTableViewOptions table={table as any} /> : null}
          <button
            type="button"
            onClick={onExportClick}
            className="sama-button sama-button-primary inline-flex items-center gap-2 px-3 py-2 text-sm font-semibold h-[38px]"
          >
            <Download className="h-4 w-4" />
            {typeof selectedCount === 'number' && selectedCount > 0 ? `Exporter (${selectedCount})` : 'Export CSV'}
          </button>
        </div>
      </div>

      {/* Grouped Filters Section (Status, Date, and Faceted Filters) */}
      {(safeStatusOptions.length > 0 || safeFacetedFilters.length > 0) && (
        <div className="flex flex-wrap items-center gap-x-8 gap-y-4 border-t border-slate-50 pt-3">
          {/* Status Filter */}
          <div className="flex flex-col gap-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
              <div className="h-1 w-1 rounded-full bg-emerald-500" />
              Statut
            </span>
            <div className="w-40">
              <Select 
                value={status} 
                onChange={setStatus} 
                options={safeStatusOptions} 
                placeholder="Filtrer par statut"
              />
            </div>
          </div>

          {/* Date Filter */}
          <div className="flex flex-col gap-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
              <div className="h-1 w-1 rounded-full bg-emerald-500" />
              Date
            </span>
            <div className="w-40">
              <DatePicker 
                value={date} 
                onChange={setDate} 
                placeholder="Filtrer par date"
              />
            </div>
          </div>

          {/* Faceted Filters */}
          {safeFacetedFilters.map((filter) => (
            <div key={filter.label} className="flex flex-col gap-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                <div className="h-1 w-1 rounded-full bg-emerald-500" />
                {filter.label}
              </span>
              <div className="w-40">
                <DataTableFacetedFilter
                  label={filter.label}
                  options={filter.options}
                  value={filter.value}
                  onChange={filter.onChange}
                  simple
                />
              </div>
            </div>
          ))}

          {/* Reset Button */}
          {hasActiveFilters && (
            <button
              type="button"
              onClick={() => {
                setSearch('');
                setStatus('');
                setDate('');
                safeFacetedFilters.forEach(f => f.onChange?.(''));
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
            >
              <X className="h-4 w-4" />
              Réinitialiser
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default DataTableToolbar;
