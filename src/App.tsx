import { DataTable } from "./components/molecules/dataTable/dataTable";
import type { ColumnDef } from "@tanstack/react-table";

interface Product {
  id: number;
  title: string;
  price: number;
  brand: string;
}

const columns: ColumnDef<Product, unknown>[] = [
  {
    accessorKey: "id",
    header: "ID",
    size: 50,
    enableHiding: true,
    enableColumnFilter: false,
    enableSorting: false,
  },
  {
    size: 140,
    accessorKey: "title",
    header: "Title",
    enableHiding: true,
    enableColumnFilter: false,
    enableSorting: false,
    cell: ({ getValue }) => (
      <span className="font-bold text-blue-600 flex items-center gap-2">
        <svg width="16" height="16" fill="currentColor">
          <circle cx="8" cy="8" r="8" />
        </svg>
        {String(getValue())}
      </span>
    ),
  },
  {
    accessorKey: "price",
    header: "Price",
    enableHiding: true,
    enableColumnFilter: false,
    enableSorting: false,
  },
  {
    accessorKey: "brand",
    header: "Brand",
    enableHiding: true,
    enableColumnFilter: false,
    enableSorting: false,
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
    <div className="p-8">
      <DataTable<Product>
        dataSource={"https://dummyjson.com/products"}
        columns={columns}
        actionsHorizontal={false}
        enableColumnVisibility={false}
        enableColumnFiltering={false}
        enableGlobalFilter={false}
        globalFilterPlaceholder="Search products..."
        searchEndpoint="https://dummyjson.com/products/search"
        debounceMs={500}
        initialColumnVisibility={{
          id: true,
          title: true,
          price: true,
          brand: true,
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
       /*  onRowSelectionChange={(selectedRowsOnPage) => {
          console.log(selectedRowsOnPage);
        }} */
      />
    </div>
  );
};
