import { useEffect, useState, useMemo } from 'react';
import { Link } from '@tanstack/react-router';
import type { Product } from '@/types/product';
import { apiService } from '@/service/api';
import { toast } from 'react-hot-toast';
import { getCachedProducts, setCachedProducts, isCacheComplete, clearProductCache } from '@/utils/productCache';
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  getSortedRowModel,
  getPaginationRowModel,
  type SortingState,
  type Row,
} from '@tanstack/react-table';

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
    <td className="px-6 py-4">
      <div className="h-4 bg-gray-200 rounded w-1/3"></div>
    </td>
    <td className="px-6 py-4">
      <div className="h-4 bg-gray-200 rounded w-1/4"></div>
    </td>
  </tr>
);

export const ProductList = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalProducts, setTotalProducts] = useState(0);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const columns = useMemo(
    () => [
      {
        accessorKey: 'title',
        header: 'Product',
        cell: ({ row }: { row: Row<Product> }) => (
          <Link
            to="/product/$id"
            params={{ id: row.original.id.toString() }}
            className="text-blue-600 hover:text-blue-800"
          >
            {row.original.title}
          </Link>
        ),
      },
      {
        accessorKey: 'rating',
        header: 'Rating',
        cell: ({ row }: { row: Row<Product> }) => (
          <div className="flex items-center">
            <span className="text-yellow-500 mr-1">★</span>
            <span>{row.original.rating.toFixed(1)}</span>
            <span className="text-gray-500 ml-1">({row.original.reviews.length})</span>
          </div>
        ),
      },
      {
        accessorKey: 'price',
        header: 'Price',
        cell: ({ row }: { row: Row<Product> }) => (
          <div className="flex items-center space-x-2">
            <span className="font-semibold">${row.original.price.toFixed(2)}</span>
            {row.original.discountPercentage > 0 && (
              <span className="text-green-600 text-sm">
                {row.original.discountPercentage}% off
              </span>
            )}
          </div>
        ),
      },
      {
        accessorKey: 'brand',
        header: 'Brand',
        cell: ({ row }: { row: Row<Product> }) => (
          <span className="text-gray-500">{row.original.brand}</span>
        ),
      },
      {
        accessorKey: 'category',
        header: 'Category',
        cell: ({ row }: { row: Row<Product> }) => (
          <span className="text-gray-500">{row.original.category}</span>
        ),
      },
      {
        accessorKey: 'availabilityStatus',
        header: 'Status',
        cell: ({ row }: { row: Row<Product> }) => (
          <span
            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
              row.original.availabilityStatus === 'In Stock'
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
            }`}
          >
            {row.original.availabilityStatus}
          </span>
        ),
      },
    ],
    []
  );

  const table = useReactTable({
    data: products,
    columns,
    state: {
      sorting,
      pagination,
    },
    onSortingChange: setSorting,
    onPaginationChange: (updater) => {
      setIsLoading(true);
      setPagination(updater);
    },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    pageCount: Math.ceil(totalProducts / pagination.pageSize),
    manualPagination: true,
  });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const skip = pagination.pageIndex * pagination.pageSize;
        const limit = pagination.pageSize;

        // 1. Try cache first
        const cached = getCachedProducts();
        if (cached && isCacheComplete(cached, cached.total)) {
          const startIndex = skip;
          const endIndex = skip + limit;
          const paginatedProducts = cached.products.slice(startIndex, endIndex);
          setProducts(paginatedProducts);
          setTotalProducts(cached.total);
          return;
        }

        // 2. If no valid cache, fetch from API
        const response = await apiService.get<{ products: Product[]; total: number }>(
          `products?limit=${limit}&skip=${skip}`
        );
        setProducts(response.data.products);
        setTotalProducts(response.data.total);
        setCachedProducts(response.data.products, response.data.total);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to fetch products';
        setError(message);
        toast.error(message);
        clearProductCache();
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, [pagination.pageIndex, pagination.pageSize]);

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Products</h1>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead className="bg-gray-50">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    <div className="flex items-center space-x-1">
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      {{
                        asc: ' 🔼',
                        desc: ' 🔽',
                      }[header.column.getIsSorted() as string] ?? null}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-gray-200">
            {isLoading ? (
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
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-2">
          <button
            className="px-3 py-1 border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage() || isLoading}
          >
            {'<<'}
          </button>
          <button
            className="px-3 py-1 border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage() || isLoading}
          >
            {'<'}
          </button>
          <button
            className="px-3 py-1 border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage() || isLoading}
          >
            {'>'}
          </button>
          <button
            className="px-3 py-1 border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage() || isLoading}
          >
            {'>>'}
          </button>
        </div>
        <span className="flex items-center gap-1">
          <div>Page</div>
          <strong>
            {table.getState().pagination.pageIndex + 1} of{' '}
            {table.getPageCount()}
          </strong>
        </span>
      </div>
    </div>
  );
}; 