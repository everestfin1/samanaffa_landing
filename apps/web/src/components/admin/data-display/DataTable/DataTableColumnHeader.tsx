import * as React from 'react';
import { Column } from '@tanstack/react-table';

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
  return (
    <div className={className}>
      <span>{title}</span>
      {/* Sorting controls will be added here */}
    </div>
  );
}
