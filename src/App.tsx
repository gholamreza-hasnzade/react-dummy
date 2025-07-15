import { DataTable } from './components/molecules/dataTable/dataTable';
import type { ColumnDef } from '@tanstack/react-table';

// Example product type
interface Product {
  id: number;
  title: string;
  price: number;
  brand: string;
}

const columns: ColumnDef<Product, unknown>[] = [
  { accessorKey: 'id', header: 'ID' },
  { accessorKey: 'title', header: 'Title' },
  { accessorKey: 'price', header: 'Price' },
  { accessorKey: 'brand', header: 'Brand' },
];

export  const App = () => {


  return (
    <div className="p-8">
      <DataTable<Product>
        dataSource={'https://dummyjson.com/products'}
        columns={columns}
        actions={[
          {
            label: "View",
            onClick: (row) => { console.log("Edit", row); },
            icon: 'edit'
          },
          {
            label: "Edit",
            onClick: (row) => { console.log("Edit", row); },
            icon: 'edit'
          },
          {
            label: "Edit",
            onClick: (row) => { console.log("Edit", row); },
            icon: 'edit'
          },
        ]}
      />
    </div>
  );
}
