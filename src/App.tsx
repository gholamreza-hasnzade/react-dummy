import { DataTable } from "./components/molecules/dataTable";
import type { ColumnDef } from "@tanstack/react-table";

interface Product {
  id: number;
  title: string;
  price: number;
  brand: string;
  description: string;
  minimumOrderQuantity: number;
  stock: number;
  sku: string;
}

const columns: ColumnDef<Product, unknown>[] = [
  {
    accessorKey: "id",
    header: "ID",
    size: 80,
    enableHiding: true,
    enableColumnFilter: true,
    enableSorting: true,
  },
  {
    size: 300,
    accessorKey: "title",
    header: "Title",
    enableHiding: true,
    enableColumnFilter: true,
    enableSorting: true,
    cell: ({ getValue }) => (
      <span className="font-semibold text-blue-600 flex items-center gap-2">
        <svg width="16" height="16" fill="currentColor">
          <circle cx="8" cy="8" r="8" />
        </svg>
        {String(getValue())}
      </span>
    ),
  },
  {
    size: 120,
    accessorKey: "price",
    header: "Price",
    enableHiding: true,
    enableColumnFilter: true,
    enableSorting: true,
    cell: ({ getValue }) => (
      <span className="font-medium text-green-600">
        ${String(getValue())}
      </span>
    ),
  },
  {
    size: 150,
    accessorKey: "brand",
    header: "Brand",
    enableHiding: true,
    enableColumnFilter: true,
    enableSorting: true,
  },
  {
    size: 250,
    accessorKey: "description",
    header: "Description",
    enableHiding: true,
    enableColumnFilter: true,
    enableSorting: false,
    cell: ({ getValue }) => (
      <span className="text-gray-600 line-clamp-2">
        {String(getValue())}
      </span>
    ),
  },
  {
    size: 180,
    accessorKey: "minimumOrderQuantity",
    header: "Min Order Qty",
    enableHiding: true,
    enableColumnFilter: true,
    enableSorting: true,
  },
  {
    size: 120,
    accessorKey: "stock",
    header: "Stock",
    enableHiding: true,
    enableColumnFilter: true,
    enableSorting: true,
    cell: ({ getValue }) => {
      const stock = Number(getValue());
      return (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          stock > 50 ? 'bg-green-100 text-green-800' :
          stock > 10 ? 'bg-yellow-100 text-yellow-800' :
          'bg-red-100 text-red-800'
        }`}>
          {stock}
        </span>
      );
    },
  },
  {
    size: 120,
    accessorKey: "sku",
    header: "SKU",
    enableHiding: true,
    enableColumnFilter: true,
    enableSorting: true,
  },
];

const viewIcon = (
  <svg width="16" height="16" fill="none" viewBox="0 0 20 20">
    <path
      d="M1.75 10C3.5 5.75 7.5 3 10 3s6.5 2.75 8.25 7c-1.75 4.25-5.75 7-8.25 7s-6.5-2.75-8.25-7z"
      stroke="#2563eb"
      strokeWidth="1.5"
      fill="none"
    />
    <circle
      cx="10"
      cy="10"
      r="3"
      stroke="#2563eb"
      strokeWidth="1.5"
      fill="none"
    />
    <circle cx="10" cy="10" r="1.5" fill="#2563eb" />
  </svg>
);

const editIcon = (
  <svg width="16" height="16" fill="none" viewBox="0 0 20 20">
    <path
      d="M13.5 3.5l3 3L6.5 16.5H3.5v-3L13.5 3.5z"
      stroke="#f59e42"
      strokeWidth="1.5"
      fill="none"
    />
    <path d="M12.5 4.5l3 3" stroke="#f59e42" strokeWidth="1.5" />
  </svg>
);

const deleteIcon = (
  <svg width="16" height="16" fill="none" viewBox="0 0 20 20">
    <rect
      x="5"
      y="7"
      width="10"
      height="8"
      rx="2"
      stroke="#ef4444"
      strokeWidth="1.5"
      fill="none"
    />
    <path d="M8 7V5a2 2 0 0 1 4 0v2" stroke="#ef4444" strokeWidth="1.5" />
    <path d="M3 7h14" stroke="#ef4444" strokeWidth="1.5" />
  </svg>
);

export const App = () => {
  return (
    <div className="w-full h-screen p-4 bg-gray-50">
      <DataTable<Product>
        dataSource={"https://dummyjson.com/products"}
        columns={columns}
        actionsHorizontal={false}
        enableColumnVisibility={true}
        enableColumnFiltering={true}
        enableGlobalFilter={true}
        globalFilterPlaceholder="Search products..."
        searchEndpoint="https://dummyjson.com/products/search"
        debounceMs={500}
        
        initialColumnVisibility={{
          id: true,
          title: true,
          price: true,
          brand: true,
          description: true,
          minimumOrderQuantity: true,
          stock: true,
          sku: true,
        }}
        getRowId={(row) => String(row.id)}
        actions={[
          {
            label: "View",
            onClick: (row) => {
              console.log("View", row);
            },
            icon: viewIcon,
          },
          {
            label: "Edit",
            onClick: (row) => {
              console.log("Edit", row);
            },
            icon: editIcon,
          },
          {
            label: "Delete",
            onClick: (row) => {
              console.log("Delete", row);
            },
            icon: deleteIcon, 
          },
        ]}
        onSelectSingleRow={(selectedRow) => {
          console.log("Single row selected:", selectedRow);
        }}
        getRowClassName={(row) => {
          if (row.id === 5) return "bg-green-100 hover:bg-green-200";
          if (row.id % 2 === 0) return "bg-blue-50 hover:bg-blue-100";
          if (row.stock < 10) return "bg-red-50 hover:bg-red-100";
          if (row.stock < 50) return "bg-yellow-50 hover:bg-yellow-100";
          if (row.price > 1000) return "bg-purple-50 hover:bg-purple-100";
        
          return ""; 
        }}
        /*  onRowSelectionChange={(selectedRowsOnPage) => {
          console.log("Selected rows:", selectedRowsOnPage);
        }} */
      />
    </div>
  );
};
