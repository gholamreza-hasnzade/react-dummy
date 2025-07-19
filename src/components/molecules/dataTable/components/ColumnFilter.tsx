import React from 'react';
import type { Column } from '@tanstack/react-table';

interface ColumnFilterProps<T extends object> {
  column: Column<T, unknown>;
}

export function ColumnFilter<T extends object>({ column }: ColumnFilterProps<T>) {
  const columnFilterValue = column.getFilterValue();

  return (
    <div className="flex items-center gap-2">
      <input
        type="text"
        value={(columnFilterValue ?? '') as string}
        onChange={(event) => column.setFilterValue(event.target.value)}
        placeholder={`Filter ${typeof column.columnDef.header === 'string' ? column.columnDef.header : column.id}...`}
        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 placeholder-gray-400"
      />
      {!!columnFilterValue && (
        <button
          onClick={() => column.setFilterValue('')}
          className="p-1.5 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded transition-colors duration-200"
          type="button"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
} 