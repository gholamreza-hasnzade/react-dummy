import type { Table } from '@tanstack/react-table';
import { useTranslation } from 'react-i18next';

interface TablePaginationProps<TData> {
  table: Table<TData>;
  isLoading?: boolean;
}

export const TablePagination = <TData extends object>({
  table,
  isLoading = false,
}: TablePaginationProps<TData>) => {
  const { t } = useTranslation();

  return (
    <div className="flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200">
      <div className="flex items-center gap-2">
        <button
          className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
          onClick={() => table.setPageIndex(0)}
          disabled={!table.getCanPreviousPage() || isLoading}
        >
          <span className="sr-only">{t('pagination.firstPage')}</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
          </svg>
        </button>
        <button
          className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage() || isLoading}
        >
          <span className="sr-only">{t('pagination.previousPage')}</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
        <button
          className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage() || isLoading}
        >
          <span className="sr-only">{t('pagination.nextPage')}</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
          onClick={() => table.setPageIndex(table.getPageCount() - 1)}
          disabled={!table.getCanNextPage() || isLoading}
        >
          <span className="sr-only">{t('pagination.lastPage')}</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
          </svg>
        </button>
      </div>
      <div className="flex items-center gap-2 text-sm text-gray-700">
        <span>{t('pagination.page')}</span>
        <strong className="flex items-center gap-1">
          <span>{table.getState().pagination.pageIndex + 1}</span>
          <span> {t('pagination.of')} </span>
          <span>{table.getPageCount()}</span>
        </strong>
      </div>
    </div>
  );
}; 