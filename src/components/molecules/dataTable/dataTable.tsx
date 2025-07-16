import React, { useState } from 'react';
import type { Row } from '@tanstack/react-table';
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  flexRender,
  type ColumnDef,
} from '@tanstack/react-table';
import { ActionsDropdown } from './ActionsDropdown';

import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { DataTablePagination } from './DataTablePagination';
import { DataTableHeader } from './DataTableHeader';
import { DataTableToolbar } from './DataTableToolbar';

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
  actionsHorizontal?: boolean;
  enableColumnVisibility?: boolean;
  initialColumnVisibility?: Record<string, boolean>;
  enableColumnFiltering?: boolean;
  enableGlobalFilter?: boolean;
  globalFilterPlaceholder?: string;
  searchEndpoint?: string;
  debounceMs?: number;
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
  actionsHorizontal = false,
  enableColumnVisibility = true,
  initialColumnVisibility = {},
  enableColumnFiltering = true,
  enableGlobalFilter = true,
  globalFilterPlaceholder = "Search all columns...",
  searchEndpoint,
  debounceMs = 300,
}: DataTableProps<T>) {
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [columnSizing, setColumnSizing] = useState({});
  const [columnVisibility, setColumnVisibility] = useState(initialColumnVisibility);
  const [columnFilters, setColumnFilters] = useState<Array<{ id: string; value: unknown }>>([]);
  const [globalFilter, setGlobalFilter] = useState('');

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
      queryKey: [
        typeof dataSource === 'string' ? dataSource : '', 
        pageIndex, 
        pageSize, 
        globalFilter
      ],
      queryFn: async () => {
        if (typeof dataSource === 'string') {
          let url: URL;
          
          // Use search endpoint if global filter is provided and search endpoint is configured
          if (globalFilter && searchEndpoint) {
            url = new URL(searchEndpoint, window.location.origin);
            url.searchParams.set('q', globalFilter);
          } else {
            url = new URL(dataSource, window.location.origin);
            // Add search query to main endpoint if no search endpoint is provided
            if (globalFilter) {
              url.searchParams.set('q', globalFilter);
            }
          }
          
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
    if (!actions || actionsHorizontal) return columns;
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
  }, [columns, actions, actionsHorizontal]);

  // Inline ActionsRow component
  function ActionsRow({ actions, row }: { actions: Action<T>[]; row: T }) {
    return (
      <div className="flex gap-2">
        {actions.map((action, idx) => (
          <button
            key={action.label + idx}
            className="px-2 py-1 rounded bg-gray-100 hover:bg-gray-200 text-sm flex items-center gap-1"
            onClick={() => action.onClick(row)}
            type="button"
          >
            {action.icon && <span>{action.icon}</span>}
            {action.label}
          </button>
        ))}
      </div>
    );
  }

  const table = useReactTable({
    data,
    columns: columnsWithActions,
    pageCount: Math.ceil(total / pageSize),
    state: {
      pagination: { pageIndex, pageSize },
      columnSizing,
      columnVisibility: enableColumnVisibility ? columnVisibility : {},
      columnFilters: enableColumnFiltering ? columnFilters : [],
      globalFilter: enableGlobalFilter ? globalFilter : '',
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
    onColumnVisibilityChange: enableColumnVisibility ? setColumnVisibility : undefined,
    onColumnFiltersChange: enableColumnFiltering ? setColumnFilters : undefined,
    onGlobalFilterChange: enableGlobalFilter ? setGlobalFilter : undefined,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: (enableColumnFiltering || enableGlobalFilter) ? getFilteredRowModel() : undefined,
    getPaginationRowModel: getPaginationRowModel(),
    enableColumnResizing: true,
    columnResizeMode: 'onChange',
    onColumnSizingChange: setColumnSizing,
  });

  const computedPageCount = table.getPageCount();

  return (
    <div className="flex flex-col w-full max-w-full">
      <DataTableToolbar 
        table={table} 
        enableGlobalFilter={enableGlobalFilter}
        globalFilterPlaceholder={globalFilterPlaceholder}
        debounceMs={debounceMs}
      />
      <div className="overflow-x-auto w-full">
        <div className="inline-block min-w-full align-middle">
          <div className="overflow-hidden border border-gray-200 rounded-lg shadow-sm">
            <div className="max-h-96 min-h-[20rem] overflow-y-auto w-full">
              <table className="min-w-full divide-y divide-gray-200">
                <DataTableHeader table={table} actionsHorizontal={actionsHorizontal} enableColumnVisibility={enableColumnVisibility} enableColumnFiltering={enableColumnFiltering} />
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
                        {actionsHorizontal ? (
                          <>
                            {row.getVisibleCells().map(cell => (
                              <td
                                key={cell.id}
                                className="px-6 py-6 whitespace-nowrap text-sm text-gray-900 border-b border-gray-100 text-right font-medium"
                              >
                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                              </td>
                            ))}
                            <td className="px-6 py-6 whitespace-nowrap text-sm text-gray-900 border-b border-gray-100 text-right font-medium">
                              <ActionsRow actions={actions ?? []} row={row.original} />
                            </td>
                          </>
                        ) : (
                          row.getVisibleCells().map(cell => (
                            <td 
                              key={cell.id}
                              className={
                                cell.column.id === 'actions'
                                  ? 'px-6 py-6 text-sm text-gray-900 border-b border-gray-100 text-right font-medium'
                                  : 'px-6 py-6 text-sm text-gray-900 border-b border-gray-100 text-right font-medium truncate max-w-full overflow-hidden whitespace-nowrap'
                              }
                              style={{
                                width: cell.column.getSize ? cell.column.getSize() : cell.column.columnDef.size,
                                minWidth: cell.column.getSize ? cell.column.getSize() : cell.column.columnDef.size,
                                maxWidth: cell.column.getSize ? cell.column.getSize() : cell.column.columnDef.size,
                                ...(cell.column.id === 'actions' ? { width: 50, minWidth: 50, maxWidth: 50 } : {})
                              }}
                            >
                              <span title={String(cell.getValue?.() ?? '')}>
                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                              </span>
                            </td>
                          ))
                        )}
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <DataTablePagination
        table={table}
        pageIndex={pageIndex}
        setPageIndex={setPageIndex}
        pageSize={pageSize}
        setPageSize={setPageSize}
        pageSizeOptions={pageSizeOptions}
        loading={loading}
        computedPageCount={computedPageCount}
      />
    </div>
  );
}

