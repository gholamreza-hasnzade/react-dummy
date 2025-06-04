import { useState, useCallback } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  getSortedRowModel,
  getPaginationRowModel,
  type SortingState,
  type ColumnDef,
} from '@tanstack/react-table';
import { useQuery } from '@tanstack/react-query';
import { apiService } from '@/service/api';
import { TablePagination } from './TablePagination';
import { TableSkeleton } from './TableSkeleton';

interface RowAction {
  label: string;
  icon: React.ReactNode;
  onClick: (row: unknown) => void;
}

interface ApiConfig {
  endpoint: string;
}

interface ApiResponse<TData> {
  products: TData[];
  total: number;
}

interface DataTableProps<TData> {
  columns: ColumnDef<TData>[];
  rowActions?: RowAction[];
  apiConfig?: ApiConfig;
  enableGlobalFilter?: boolean;
  onGlobalFilterChange?: (value: string) => void;
  globalFilterPlaceholder?: string;
  enableSorting?: boolean;
  enablePagination?: boolean;
  data?: TData[];
  isLoading?: boolean;
}

const CACHE_KEY = 'products_cache';
const CACHE_TIMESTAMP_KEY = 'products_cache_timestamp';
const CACHE_DURATION = 24 * 60 * 60 * 1000; 

const getCachedData = (): ApiResponse<unknown> | null => {
  try {
    const cachedData = localStorage.getItem(CACHE_KEY);
    const timestamp = localStorage.getItem(CACHE_TIMESTAMP_KEY);
    
    if (!cachedData || !timestamp) return null;
    
    const now = new Date().getTime();
    const cacheAge = now - parseInt(timestamp);
    
    if (cacheAge > CACHE_DURATION) return null;
    
    return JSON.parse(cachedData);
  } catch (error) {
    console.error('Error reading from cache:', error);
    return null;
  }
};

const setCachedData = (data: ApiResponse<unknown>) => {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(data));
    localStorage.setItem(CACHE_TIMESTAMP_KEY, new Date().getTime().toString());
  } catch (error) {
    console.error('Error writing to cache:', error);
  }
};

export const DataTable = <TData extends object>({
  columns,
  rowActions,
  apiConfig,
  enableGlobalFilter = false,
  onGlobalFilterChange,
  globalFilterPlaceholder,
  enableSorting = false,
  enablePagination = true,
  data = [],
  isLoading = false,
}: DataTableProps<TData>) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const fetchData = async () => {
    if (!apiConfig?.endpoint) {
      return { products: data, total: data.length };
    }

    // Always fetch from API when pagination changes
    const queryParams = new URLSearchParams({
      limit: pagination.pageSize.toString(),
      skip: (pagination.pageIndex * pagination.pageSize).toString()
    });

    if (enableSorting && sorting.length > 0) {
      const { id, desc } = sorting[0];
      queryParams.append('sortBy', id);
      queryParams.append('order', desc ? 'desc' : 'asc');
    }

    const response = await apiService.get<ApiResponse<TData>>(
      `${apiConfig.endpoint}?${queryParams.toString()}`
    );

    const existingCache = getCachedData();
    
    if (existingCache) {
      const start = pagination.pageIndex * pagination.pageSize;
      const updatedCache = {
        ...existingCache,
        products: [
          ...existingCache.products.slice(0, start),
          ...response.data.products,
          ...existingCache.products.slice(start + response.data.products.length)
        ]
      };
      setCachedData(updatedCache);
    } else {
      setCachedData(response.data);
    }
    
    return response.data;
  };

  const { data: queryData, isLoading: isTableLoading } = useQuery({
    queryKey: ['tableData', apiConfig?.endpoint, pagination, sorting],
    queryFn: fetchData,
    enabled: !!apiConfig?.endpoint,
    staleTime: CACHE_DURATION,
    gcTime: CACHE_DURATION,
  });

  const tableData = (queryData as ApiResponse<TData>)?.products || data;
  const totalItems = (queryData as ApiResponse<TData>)?.total || data.length;

  const handlePaginationChange = useCallback((updater: typeof pagination | ((old: typeof pagination) => typeof pagination)) => {
    const newPagination = typeof updater === 'function' ? updater(pagination) : updater;
    setPagination(newPagination);
  }, [pagination]);

  const table = useReactTable({
    data: tableData,
    columns,
    state: {
      sorting,
      pagination,
    },
    onSortingChange: setSorting,
    onPaginationChange: handlePaginationChange,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: true,
    pageCount: Math.ceil(totalItems / pagination.pageSize),
    enableSorting,
  });

  return (
    <div className="space-y-4">
      {enableGlobalFilter && (
        <div className="flex justify-end">
          <input
            type="text"
            placeholder={globalFilterPlaceholder}
            className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) => onGlobalFilterChange?.(e.target.value)}
          />
        </div>
      )}

      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                    style={{ width: header.getSize() }}
                  >
                    <div className="flex items-center justify-start space-x-1">
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      {enableSorting && header.column.getCanSort() && (
                        <button
                          onClick={header.column.getToggleSortingHandler()}
                          className="cursor-pointer hover:text-gray-700 transition-colors"
                        >
                          {{
                            asc: '↑',
                            desc: '↓',
                          }[header.column.getIsSorted() as string] ?? '↕'}
                        </button>
                      )}
                    </div>
                  </th>
                ))}
                {rowActions && <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">عملیات</th>}
              </tr>
            ))}
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {(isLoading || isTableLoading) ? (
              <TableSkeleton columns={columns.length + (rowActions ? 1 : 0)} rows={pagination.pageSize} />
            ) : (
              table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50 transition-colors">
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                  {rowActions && (
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end space-x-2">
                        {rowActions.map((action, index) => (
                          <button
                            key={index}
                            onClick={() => action.onClick(row.original)}
                            className="text-gray-600 hover:text-gray-900 transition-colors"
                            title={action.label}
                          >
                            {action.icon}
                          </button>
                        ))}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {enablePagination && (
        <TablePagination table={table} isLoading={isLoading || isTableLoading} />
      )}
    </div>
  );
}; 