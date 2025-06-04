import { Link } from "@tanstack/react-router";
import type { Product } from "@/types/product";
import { DataTable } from "../components/molecules/dataTable/DataTable";
import { Badge } from "../components/atoms/Badge";
import { ProductRatingIcon } from "../components/atoms/ProductRatingIcon";
import type { ColumnDef } from "@tanstack/react-table";

export const ProductList = () => {
  const columns: ColumnDef<Product>[] = [
    {
      header: "تصویر",
      accessorKey: "thumbnail",
      size: 100,
      cell: ({ row }) => {
        const rating = row.original.rating || 0;
        let imageIndex = 0;
        if (rating < 3) {
          imageIndex = 0;
        } else if (rating >= 3 && rating <= 4) {
          imageIndex = 1;
        } else {
          imageIndex = 2;
        }
        const imageSrc =
          row.original.images?.[imageIndex] || row.original.thumbnail;
        return (
          <div className="w-8 h-8 rounded-lg overflow-hidden">
            <img
              src={imageSrc}
              alt={row.original.title}
              className="w-full h-full object-cover"
            />
          </div>
        );
      },
    },
    {
      header: "نام محصول",
      accessorKey: "title",
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
      header: "امتیاز",
      accessorKey: "rating",
      size: 150,
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <ProductRatingIcon rating={row.original.rating} />
        </div>
      ),
    },
    {
      header: "قیمت",
      accessorKey: "price",
      size: 150,
      cell: ({ row }) => (
        <div className="flex items-center space-x-2">
          <span className="font-semibold text-xs">
            ${row.original.price.toFixed(2)}
          </span>
          {row.original.discountPercentage > 0 && (
            <span className="text-green-600 text-xs">
              {row.original.discountPercentage}% تخفیف
            </span>
          )}
        </div>
      ),
    },
    {
      header: "دسته‌بندی",
      accessorKey: "category",
      size: 150,
      cell: ({ row }) => (
        <span className="text-gray-500 text-xs">{row.original.category}</span>
      ),
    },
    {
      header: "وضعیت",
      accessorKey: "availabilityStatus",
      size: 150,
      cell: ({ row }) => (
        <Badge
          variant="text"
          color={
            row.original.availabilityStatus === "In Stock" ? "success" : "error"
          }
        >
          {row.original.availabilityStatus === "In Stock" ? "موجود" : "ناموجود"}
        </Badge>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">محصولات</h1>

      <DataTable
        columns={columns}
        enableSorting={true}
        enableGlobalFilter={false}
        enablePagination={true}
        apiConfig={{
          endpoint: "/products",
        }}
      />
    </div>
  );
};
