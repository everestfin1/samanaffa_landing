import * as React from 'react';

interface DatePickerProps {
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
  placeholder?: string;
}

const DatePicker = ({ value, onChange, className = '', placeholder }: DatePickerProps) => {
  return (
    <input
      type="date"
      value={value}
      onChange={(event) => onChange?.(event.target.value)}
      placeholder={placeholder}
      className={`rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 ${className}`}
    />
  );
};

export default DatePicker;
