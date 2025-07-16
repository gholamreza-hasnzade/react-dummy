import React from 'react';
import type { Table } from '@tanstack/react-table';

interface GlobalFilterProps<T extends object> {
  table: Table<T>;
  placeholder?: string;
  className?: string;
}

export function GlobalFilter<T extends object>({ 
  table, 
  placeholder = "Search all columns...",
  className = ""
}: GlobalFilterProps<T>) {
  const globalFilterValue = table.getState().globalFilter;

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="relative flex-1">
        <input
          type="text"
          value={(globalFilterValue ?? '') as string}
          onChange={(event) => table.setGlobalFilter(event.target.value)}
          placeholder={placeholder}
          className="w-full px-4 py-2 pl-10 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>
      {globalFilterValue && (
        <button
          onClick={() => table.setGlobalFilter('')}
          className="px-3 py-2 text-sm text-gray-400 hover:text-gray-600 focus:outline-none border border-gray-300 rounded-md hover:bg-gray-50"
          type="button"
        >
          Clear
        </button>
      )}
    </div>
  );
} 