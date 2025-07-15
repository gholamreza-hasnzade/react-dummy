import React, { useState, useRef, useEffect } from 'react';
import type { Row } from '@tanstack/react-table';
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  flexRender,
  type ColumnDef,
} from '@tanstack/react-table';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

interface Action<T> {
  label: string;
  onClick: (row: T) => void;
  icon?: React.ReactNode;
}

interface DataTableProps<T extends object> {
  dataSource: string | T[];
  columns: ColumnDef<T, unknown>[];
  pageSizeOptions?: number[];
  initialPageSize?: number;
  actions?: Action<T>[];
}

interface ApiResponse<T> {
  data?: T[];
  products?: T[];
  total: number;
}

export function DataTable<T extends object>({
  dataSource,
  columns = [],
  pageSizeOptions = [10, 20, 30, 50],
  initialPageSize = 10,
  actions,
}: DataTableProps<T>) {
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(initialPageSize);

  // For client-side data
  const isClientData = Array.isArray(dataSource);
  const clientData = isClientData
    ? (dataSource as T[]).slice(pageIndex * pageSize, (pageIndex + 1) * pageSize)
    : [];
  const clientTotal = isClientData ? (dataSource as T[]).length : 0;

  // For API data
  const {
    data: apiData,
    isLoading,
    isError,
    error,
  } = useQuery<{ items: T[]; total: number }>(
    {
      queryKey: [typeof dataSource === 'string' ? dataSource : '', pageIndex, pageSize],
      queryFn: async () => {
        if (typeof dataSource === 'string') {
          const url = new URL(dataSource, window.location.origin);
          url.searchParams.set('limit', pageSize.toString());
          url.searchParams.set('skip', (pageIndex * pageSize).toString());
          const res = await axios.get(url.toString());
          const json: ApiResponse<T> = res.data;
          return {
            items: json.data ?? json.products ?? [],
            total: json.total,
          };
        }
        return { items: [], total: 0 };
      },
      enabled: typeof dataSource === 'string',
    }
  );

  const safeApiData = apiData ?? { items: [], total: 0 };
  const data = isClientData ? clientData : safeApiData.items;
  const total = isClientData ? clientTotal : safeApiData.total;
  const loading = isClientData ? false : isLoading;
  const errorMsg = isClientData ? null : isError ? (error instanceof Error ? error.message : 'Unknown error') : null;

  // Add actions column if actions are provided
  const columnsWithActions = React.useMemo(() => {
    if (!actions) return columns;
    return [
      ...columns,
      {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }: { row: Row<T> }) => <ActionsDropdown actions={actions} row={row.original} />, // row.original is the data
        enableSorting: false,
        enableResizing: false,
        meta: { isAction: true },
      },
    ];
  }, [columns, actions]);

  const table = useReactTable({
    data,
    columns: columnsWithActions,
    pageCount: Math.ceil(total / pageSize),
    state: {
      pagination: { pageIndex, pageSize },
    },
    manualPagination: true,
    onPaginationChange: updater => {
      if (typeof updater === 'function') {
        const next = updater({ pageIndex, pageSize });
        setPageIndex(next.pageIndex);
        setPageSize(next.pageSize);
      } else {
        setPageIndex(updater.pageIndex);
        setPageSize(updater.pageSize);
      }
    },
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="flex flex-col w-full max-w-full">
      <div className="overflow-x-auto w-full">
        <div className="inline-block min-w-full align-middle">
          <div className="overflow-hidden border border-gray-200 rounded-lg shadow-sm">
            <div className="max-h-96 min-h-[20rem] overflow-y-auto w-full">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50 sticky top-0 z-10">
                  {table.getHeaderGroups().map(headerGroup => (
                    <tr key={headerGroup.id}>
                      {headerGroup.headers.map(header => (
                        <th
                          key={header.id}
                          className={
                            `px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider bg-gray-50 border-b border-gray-200 ` +
                            (header.column.id === 'actions' ? 'sticky right-0 z-20' : '')
                          }
                          style={header.column.id === 'actions' ? { width: 150, minWidth: 150, maxWidth: 150 } : {}}
                        >
                          {header.isPlaceholder
                            ? null
                            : flexRender(header.column.columnDef.header, header.getContext())}
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {loading ? (
                    Array.from({ length: 5 }).map((_, rowIdx) => (
                      <tr key={`skeleton-row-${rowIdx}`}> 
                        {Array.from({ length: Array.isArray(columns) ? columns.length : 1 }).map((_, colIdx) => (
                          <td key={`skeleton-cell-${rowIdx}-${colIdx}`} className="px-6 py-6 whitespace-nowrap text-sm border-b border-gray-100 text-right font-medium">
                            <div className="h-4 w-full bg-gray-200 rounded animate-pulse mx-auto" />
                          </td>
                        ))}
                      </tr>
                    ))
                  ) : errorMsg ? (
                    <tr>
                      <td colSpan={Array.isArray(columns) ? columns.length : 1} className="text-center text-red-500 py-8">
                        {errorMsg}
                      </td>
                    </tr>
                  ) : data.length === 0 ? (
                    <tr>
                      <td colSpan={Array.isArray(columns) ? columns.length : 1} className="text-center py-8 text-gray-400">
                        No data
                      </td>
                    </tr>
                  ) : (
                    table.getRowModel().rows.map((row, idx) => (
                      <tr key={row.id} className={`hover:bg-blue-50 transition-colors ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}> 
                        {row.getVisibleCells().map(cell => (
                          <td
                            key={cell.id}
                            className={
                              cell.column.id === 'actions'
                                ? 'px-6 py-6 whitespace-nowrap text-sm text-gray-900 border-b border-gray-100 text-right font-medium sticky right-0 z-10'
                                : 'px-6 py-6 whitespace-nowrap text-sm text-gray-900 border-b border-gray-100 text-right font-medium'
                            }
                            style={cell.column.id === 'actions' ? { width: 150, minWidth: 150, maxWidth: 150 } : {}}
                          >
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </td>
                        ))}
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      {/* Pagination Controls */}
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
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={pageIndex >= table.getPageCount() - 1 || loading}
          >
            {'>>'}
          </button>
          <span className="ml-2 text-sm text-gray-700">
            Page{' '}
            <strong>
              {pageIndex + 1} of {table.getPageCount()}
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
    </div>
  );
}

// Simple dropdown for actions
function ActionsDropdown<T>({ actions, row }: { actions: Action<T>[]; row: T }) {
  const [open, setOpen] = React.useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  return (
    <div className="relative flex justify-center items-center" ref={ref}>
      <button
        className="p-2 rounded-full  transition"
        onClick={() => setOpen(o => !o)}
        type="button"
        aria-label="Actions"
      >
        <svg width="20" height="20" fill="none" viewBox="0 0 20 20" stroke="currentColor">
          <circle cx="10" cy="4" r="1.5" />
          <circle cx="10" cy="10" r="1.5" />
          <circle cx="10" cy="16" r="1.5" />
        </svg>
      </button>
      {open && (
        <div className="absolute top-full -right-24 mt-2 w-36 bg-white border rounded shadow-lg z-30">
          {actions.map((action, idx) => (
            <button
              key={action.label + idx}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-100 text-right"
              onClick={() => { action.onClick(row); setOpen(false); }}
              type="button"
            >
              {action.icon && <span>{action.icon}</span>}
              {action.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
