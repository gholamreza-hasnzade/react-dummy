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
  const [goToPage, setGoToPage] = React.useState('');

  const handleGoToPage = (e: React.FormEvent) => {
    e.preventDefault();
    const page = parseInt(goToPage) - 1;
    if (page >= 0 && page < computedPageCount) {
      setPageIndex(page);
      setGoToPage('');
    }
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(0, pageIndex - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(computedPageCount - 1, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(0, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  };
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between mt-6 gap-4 w-full px-4 sm:px-0">
      <div className="flex items-center gap-2">
        <button
          className="px-3 py-2 cursor-pointer border border-gray-300 rounded-md bg-white hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
          onClick={() => table.setPageIndex(0)}
          disabled={pageIndex === 0 || loading}
        >
          {'<<'}
        </button>
        <button
          className="px-3 py-2 cursor-pointer border border-gray-300 rounded-md bg-white hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage() || loading}
        >
          {'<'}
        </button>
        
        {/* Page Numbers - Between arrows */}
        <div className="flex items-center gap-1">
          {loading ? (
            getPageNumbers().map(pageNum => (
              <div
                key={pageNum}
                className={`px-3 py-2 border rounded-md text-sm font-medium ${
                  pageNum === pageIndex
                    ? 'bg-blue-600 border-blue-600'
                    : 'bg-gray-100 border-gray-200'
                }`}
              >
                <div className={`w-4 h-4 rounded animate-pulse ${
                  pageNum === pageIndex ? 'bg-white' : 'bg-gray-300'
                }`}></div>
              </div>
            ))
          ) : (
            getPageNumbers().map(pageNum => (
              <button
                key={pageNum}
                className={`px-3 cursor-pointer py-2 border rounded-md text-sm font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 ${
                  pageNum === pageIndex
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
                onClick={() => setPageIndex(pageNum)}
                disabled={loading}
              >
                {pageNum + 1}
              </button>
            ))
          )}
        </div>
        
        <button
          className="px-3 cursor-pointer py-2 border border-gray-300 rounded-md bg-white hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage() || loading}
        >
          {'>'}
        </button>
        <button
          className="px-3 cursor-pointer py-2 border border-gray-300 rounded-md bg-white hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
          onClick={() => table.setPageIndex(computedPageCount - 1)}
          disabled={pageIndex >= computedPageCount - 1 || loading}
        >
          {'>>'}
        </button>
        
        <span className="ml-4 text-sm text-gray-700">
          Page{' '}
          <strong className="text-gray-900">
            {pageIndex + 1} of {computedPageCount}
          </strong>
        </span>
        
        {/* Go to Page Input */}
        <form onSubmit={handleGoToPage} className="flex items-center gap-2 ml-4">
          <span className="text-sm text-gray-700">Go to:</span>
          <input
            type="number"
            min="1"
            max={computedPageCount}
            value={goToPage}
            onChange={(e) => setGoToPage(e.target.value)}
            className="w-16 px-2 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Page"
            disabled={loading}
          />
          <button
            type="submit"
            className="px-3 py-1 cursor-pointer bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading || !goToPage}
          >
            Go
          </button>
        </form>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-sm text-gray-700">Rows per page:</span>
        <select
          className="border border-gray-300 rounded-md px-3 py-2 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition-colors duration-200"
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