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
  { label: 'En attente', value: 'pending' },
  { label: 'Approuvé', value: 'approved' },
  { label: 'Rejeté', value: 'rejected' },
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
  statusOptions = defaultStatusOptions,
  searchPlaceholder,
  selectedCount,
  facetedFilters = [],
}: DataTableToolbarProps<TData>) => {
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

  const hasActiveFilters = search || status || date || facetedFilters.some(f => f.value);

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm animate-fade-in">
      {/* Search and Primary Filters */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-1 flex-wrap items-center gap-3">
          <div className="w-full lg:max-w-xs">
            <SearchInput 
              value={search} 
              onChange={setSearch} 
              placeholder={searchPlaceholder} 
              className="sama-input" 
            />
          </div>
          <div className="w-full lg:w-48">
            <Select 
              value={status} 
              onChange={setStatus} 
              options={statusOptions} 
              placeholder="Filtrer par statut"
            />
          </div>
          <div className="w-full lg:w-48">
            <DatePicker 
              value={date} 
              onChange={setDate} 
              placeholder="Filtrer par date"
            />
          </div>
          
          {hasActiveFilters && (
            <button
              type="button"
              onClick={() => {
                setSearch('');
                setStatus('');
                setDate('');
                facetedFilters.forEach(f => f.onChange?.(''));
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
            >
              <X className="h-4 w-4" />
              Réinitialiser
            </button>
          )}
        </div>
        
        {/* Secondary Actions (Export, Visibility) */}
        <div className="flex items-center gap-2 border-t border-slate-100 pt-3 lg:border-t-0 lg:pt-0">
          <DataTableViewOptions table={table} />
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

      {/* Grouped Secondary/Faceted Filters */}
      {facetedFilters.length > 0 && (
        <div className="flex flex-wrap items-center gap-x-8 gap-y-4 border-t border-slate-50 pt-3">
          {facetedFilters.map((filter) => (
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
        </div>
      )}
    </div>
  );
};

export default DataTableToolbar;
