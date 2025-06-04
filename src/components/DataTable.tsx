import { useState, useEffect, useCallback } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  getSortedRowModel,
  getPaginationRowModel,
  type SortingState,
  type ColumnDef,
} from '@tanstack/react-table';
import { apiService } from '@/service/api';

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
  enableRowSelection?: boolean;
  onRowSelection?: (row: TData) => void;
  enableMultiRowSelection?: boolean;
  onRowSelectionChange?: (rows: TData[]) => void;
  enableColumnResizing?: boolean;
  enableColumnHiding?: boolean;
  enableGlobalFilter?: boolean;
  onGlobalFilterChange?: (value: string) => void;
  globalFilterPlaceholder?: string;
  enableSorting?: boolean;
  enablePagination?: boolean;
  enableColumnFiltering?: boolean;
  onColumnFilterChange?: (columnId: string, value: unknown) => void;
  data?: TData[];
  isLoading?: boolean;
}

const TableSkeleton = () => (
  <tr className="animate-pulse">
    <td className="px-6 py-4">
      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
    </td>
    <td className="px-6 py-4">
      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
    </td>
    <td className="px-6 py-4">
      <div className="h-4 bg-gray-200 rounded w-1/4"></div>
    </td>
    <td className="px-6 py-4">
      <div className="h-4 bg-gray-200 rounded w-1/3"></div>
    </td>
  </tr>
);

export const DataTable = <TData extends object>({
  columns,
  rowActions,
  apiConfig,
  enableRowSelection = false,
  onRowSelection,
  enableMultiRowSelection = false,
  onRowSelectionChange,
  enableColumnResizing = false,
  enableColumnHiding = false,
  enableGlobalFilter = false,
  onGlobalFilterChange,
  globalFilterPlaceholder,
  enableSorting = false,
  enablePagination = true,
  enableColumnFiltering = false,
  onColumnFilterChange,
  data = [],
  isLoading = false,
}: DataTableProps<TData>) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [tableData, setTableData] = useState<TData[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [isTableLoading, setIsTableLoading] = useState(false);
  const [cachedData, setCachedData] = useState<Record<string, { data: TData[]; total: number }>>({});

  const fetchData = useCallback(async (pageIndex: number, pageSize: number) => {
    if (!apiConfig?.endpoint) {
      setTableData(data);
      return;
    }

    const cacheKey = `${pageIndex}-${pageSize}`;
    if (cachedData[cacheKey]) {
      setTableData(cachedData[cacheKey].data);
      setTotalItems(cachedData[cacheKey].total);
      return;
    }

    //setIsTableLoading(true);
    try {
      const skip = pageIndex * pageSize;
      const limit = pageSize;
      const response = await apiService.get<ApiResponse<TData>>(
        `${apiConfig.endpoint}?limit=${limit}&skip=${skip}`
      );
      
      if (response.data.products) {
        setTableData(response.data.products);
        setTotalItems(response.data.total);
        setCachedData(prev => ({
          ...prev,
          [cacheKey]: {
            data: response.data.products,
            total: response.data.total
          }
        }));
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsTableLoading(false);
    }
  }, [apiConfig?.endpoint, data, cachedData]);

  useEffect(() => {
    fetchData(pagination.pageIndex, pagination.pageSize);
  }, [pagination.pageIndex, pagination.pageSize, fetchData]);

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
    enableColumnResizing,
    enableMultiRowSelection,
  });

  return (
    <div className="space-y-4">
      {enableGlobalFilter && (
        <div className="flex justify-end">
          <input
            type="text"
            placeholder={globalFilterPlaceholder}
            className="px-4 py-2 border rounded-md"
            onChange={(e) => onGlobalFilterChange?.(e.target.value)}
          />
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead className="bg-gray-50">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                    style={{ width: header.getSize() }}
                  >
                    <div className="flex items-center justify-end space-x-1">
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      {enableSorting && header.column.getCanSort() && (
                        <button
                          onClick={header.column.getToggleSortingHandler()}
                          className="cursor-pointer"
                        >
                          {{
                            asc: ' 🔼',
                            desc: ' 🔽',
                          }[header.column.getIsSorted() as string] ?? null}
                        </button>
                      )}
                    </div>
                  </th>
                ))}
                {rowActions && <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">عملیات</th>}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-gray-200">
            {(isLoading || isTableLoading) ? (
              Array.from({ length: pagination.pageSize }).map((_, index) => (
                <TableSkeleton key={index} />
              ))
            ) : (
              table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50">
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-6 py-4 whitespace-nowrap">
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
                            className="text-gray-600 hover:text-gray-900"
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
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-2">
            <button
              className="px-3 py-1 border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage() || isLoading || isTableLoading}
            >
              {'<<'}
            </button>
            <button
              className="px-3 py-1 border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage() || isLoading || isTableLoading}
            >
              {'<'}
            </button>
            <button
              className="px-3 py-1 border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage() || isLoading || isTableLoading}
            >
              {'>'}
            </button>
            <button
              className="px-3 py-1 border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage() || isLoading || isTableLoading}
            >
              {'>>'}
            </button>
          </div>
          <span className="flex items-center gap-1">
            <div>صفحه</div>
            <strong>
              {table.getState().pagination.pageIndex + 1} از{' '}
              {table.getPageCount()}
            </strong>
          </span>
        </div>
      )}
    </div>
  );
}; 