import React from 'react';
import type { Table } from '@tanstack/react-table';
import { GlobalFilter } from './GlobalFilter';

interface DataTableToolbarProps<T extends object> {
  table: Table<T>;
  enableGlobalFilter?: boolean;
  globalFilterPlaceholder?: string;
}

export function DataTableToolbar<T extends object>({
  table,
  enableGlobalFilter = true,
  globalFilterPlaceholder = "Search all columns...",
}: DataTableToolbarProps<T>) {
  if (!enableGlobalFilter) {
    return null;
  }

  return (
    <div className="flex items-center justify-between p-4 bg-white border-b border-gray-200">
      <div className="flex items-center gap-4">
        <h3 className="text-lg font-medium text-gray-900">Data Table</h3>
      </div>
      <div className="flex items-center gap-4">
        <GlobalFilter 
          table={table} 
          placeholder={globalFilterPlaceholder}
          className="w-80"
        />
      </div>
    </div>
  );
} 