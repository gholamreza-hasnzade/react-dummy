import React from 'react';
import type { Table } from '@tanstack/react-table';
import { GlobalFilter } from './GlobalFilter';

interface DataTableToolbarProps<T extends object> {
  table: Table<T>;
  enableGlobalFilter?: boolean;
  globalFilterPlaceholder?: string;
  debounceMs?: number;
}

export function DataTableToolbar<T extends object>({
  table,
  enableGlobalFilter = true,
  globalFilterPlaceholder = "Search all columns...",
  debounceMs = 300,
}: DataTableToolbarProps<T>) {
  if (!enableGlobalFilter) {
    return null;
  }

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 sm:p-6 bg-white border-b border-gray-200 gap-4">
      <div className="flex items-center gap-4">
        <h3 className="text-lg sm:text-xl font-semibold text-gray-900">Data Table</h3>
      </div>
      <div className="flex items-center gap-4 w-full sm:w-auto">
        <GlobalFilter 
          table={table} 
          placeholder={globalFilterPlaceholder}
          className="w-full sm:w-80"
          debounceMs={debounceMs}
        />
      </div>
    </div>
  );
} 