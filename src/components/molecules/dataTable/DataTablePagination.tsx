import React from 'react';
import type { Table } from '@tanstack/react-table';

interface DataTablePaginationProps<T> {
  table: Table<T>;
  pageIndex: number;
  setPageIndex: (idx: number) => void;
  pageSize: number;
  setPageSize: (size: number) => void;
  pageSizeOptions: number[];
  loading: boolean;
  computedPageCount: number;
}

export function DataTablePagination<T>({
  table,
  pageIndex,
  setPageIndex,
  pageSize,
  setPageSize,
  pageSizeOptions,
  loading,
  computedPageCount,
}: DataTablePaginationProps<T>) {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between mt-4 gap-2 w-full">
      <div className="flex items-center gap-2">
        <button
          className="px-2 py-1 border rounded bg-white hover:bg-gray-100 transition disabled:opacity-50"
          onClick={() => table.setPageIndex(0)}
          disabled={pageIndex === 0 || loading}
        >
          {'<<'}
        </button>
        <button
          className="px-2 py-1 border rounded bg-white hover:bg-gray-100 transition disabled:opacity-50"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage() || loading}
        >
          {'<'}
        </button>
        <button
          className="px-2 py-1 border rounded bg-white hover:bg-gray-100 transition disabled:opacity-50"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage() || loading}
        >
          {'>'}
        </button>
        <button
          className="px-2 py-1 border rounded bg-white hover:bg-gray-100 transition disabled:opacity-50"
          onClick={() => table.setPageIndex(computedPageCount - 1)}
          disabled={pageIndex >= computedPageCount - 1 || loading}
        >
          {'>>'}
        </button>
        <span className="ml-2 text-sm text-gray-700">
          Page{' '}
          <strong>
            {pageIndex + 1} of {computedPageCount}
          </strong>
        </span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-700">Rows per page:</span>
        <select
          className="border rounded px-2 py-1 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-200"
          value={pageSize}
          onChange={e => {
            setPageSize(Number(e.target.value));
            setPageIndex(0);
          }}
          disabled={loading}
        >
          {pageSizeOptions.map(size => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
} 