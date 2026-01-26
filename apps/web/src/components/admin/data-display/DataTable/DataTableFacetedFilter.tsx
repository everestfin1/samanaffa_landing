import * as React from 'react';
import Select from '../../forms/Select';

export interface FacetOption {
  label: string;
  value: string;
}

interface DataTableFacetedFilterProps {
  label: string;
  options: FacetOption[];
  value?: string;
  onChange?: (value: string) => void;
  simple?: boolean;
}

const DataTableFacetedFilter = ({ label, options, value, onChange, simple }: DataTableFacetedFilterProps) => {
  const current = value ?? '';

  if (simple) {
    return (
      <Select 
        value={current} 
        onChange={(val) => onChange?.(val)} 
        options={options} 
        placeholder={label}
      />
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </div>
      <div className="flex flex-wrap items-center gap-2">
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange?.(option.value)}
            className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors ${current === option.value ? 'bg-emerald-600 text-white' : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'}`}
          >
            {option.label}
          </button>
        ))}
        <div className="min-w-[160px]">
          <Select value={current} onChange={(val) => onChange?.(val)} options={options} />
        </div>
      </div>
    </div>
  );
};

export default DataTableFacetedFilter;
