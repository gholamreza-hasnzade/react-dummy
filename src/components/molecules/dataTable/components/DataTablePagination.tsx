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
    <div className="flex flex-col sm:flex-row items-center justify-between mt-6 gap-4 w-full px-4 sm:px-0">
      <div className="flex items-center gap-2">
        <button
          className="px-3 py-2 border border-gray-300 rounded-md bg-white hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
          onClick={() => table.setPageIndex(0)}
          disabled={pageIndex === 0 || loading}
        >
          {'<<'}
        </button>
        <button
          className="px-3 py-2 border border-gray-300 rounded-md bg-white hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage() || loading}
        >
          {'<'}
        </button>
        <button
          className="px-3 py-2 border border-gray-300 rounded-md bg-white hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage() || loading}
        >
          {'>'}
        </button>
        <button
          className="px-3 py-2 border border-gray-300 rounded-md bg-white hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
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