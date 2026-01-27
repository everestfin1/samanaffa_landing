import * as React from 'react';

interface SelectOption {
  label: string;
  value: string;
}

interface SelectProps {
  value?: string;
  onChange?: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  className?: string;
}

const Select = ({ value, onChange, options, placeholder = 'Sélectionner', className = '' }: SelectProps) => {
  const safeOptions = options ?? [];
  const hasEmptyOption = safeOptions.some((opt) => opt.value === '');
  
  return (
    <select
      value={value}
      onChange={(event) => onChange?.(event.target.value)}
      className={`rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 ${className}`}
    >
      {!hasEmptyOption && (
        <option value="" disabled>
          {placeholder}
        </option>
      )}
      {safeOptions.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};

export default Select;
