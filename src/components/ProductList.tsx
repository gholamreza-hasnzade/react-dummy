import { useState, useCallback } from 'react';
import { Link } from '@tanstack/react-router';
import type { Product } from '@/types/product';
import { DataTable } from './DataTable';
import { Badge } from './Badge';
import type { ColumnDef } from '@tanstack/react-table';

export const ProductList = () => {

  const columns: ColumnDef<Product>[] = [
    {
      header: 'نام محصول',
      accessorKey: 'title',
      size: 200,
      cell: ({ row }) => (
        <div className="flex flex-col gap-1">
          <Link
            to="/product/$id"
            params={{ id: row.original.id.toString() }}
            className="text-blue-600 hover:text-blue-800 text-xs"
          >
            {row.original.title}
          </Link>
          <span className="text-gray-600 text-xs">{row.original.brand}</span>
        </div>
      ),
    },
    {
      header: 'امتیاز',
      accessorKey: 'rating',
      size: 150,
      cell: ({ row }) => (
        <div className="flex items-center">
          <span className="text-yellow-500 mr-1">★</span>
          <span className="text-xs">{row.original.rating.toFixed(1)}</span>
          <span className="text-gray-500 ml-1 text-xs">({row.original.reviews.length})</span>
        </div>
      ),
    },
    {
      header: 'قیمت',
      accessorKey: 'price',
      size: 150,
      cell: ({ row }) => (
        <div className="flex items-center space-x-2">
          <span className="font-semibold text-xs">${row.original.price.toFixed(2)}</span>
          {row.original.discountPercentage > 0 && (
            <span className="text-green-600 text-xs">
              {row.original.discountPercentage}% تخفیف
            </span>
          )}
        </div>
      ),
    },
    {
      header: 'دسته‌بندی',
      accessorKey: 'category',
      size: 150,
      cell: ({ row }) => (
        <span className="text-gray-500 text-xs">{row.original.category}</span>
      ),
    },
    {
      header: 'وضعیت',
      accessorKey: 'availabilityStatus',
      size: 150,
      cell: ({ row }) => (
        <Badge
          variant="text"
          color={row.original.availabilityStatus === 'In Stock' ? 'success' : 'error'}
        >
          {row.original.availabilityStatus === 'In Stock' ? 'موجود' : 'ناموجود'}
        </Badge>
      ),
    },
  ];

 

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">محصولات</h1>

      <DataTable
        columns={columns}
       /*  isLoading={isLoading} */
        enableSorting={false}
        enableColumnResizing={false}
        enableColumnHiding={false}
        enableGlobalFilter={false}
        enablePagination={true}
        enableColumnFiltering={false}
        apiConfig={{
          endpoint: "/products",
        }}
      />
    </div>
  );
}; 