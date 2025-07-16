# Column Visibility Feature

This implementation adds column visibility functionality to the DataTable component, allowing users to show/hide columns dynamically.

## Features

- **Column Visibility Toggle**: A dropdown button that shows all available columns with checkboxes
- **Initial Column Visibility**: Configure which columns are visible by default
- **Dynamic Column Count**: Shows the current number of visible columns vs total columns
- **Click Outside to Close**: The dropdown closes when clicking outside of it
- **Responsive Design**: Works well with the existing table layout

## Usage

### Basic Usage

```tsx
import { DataTable } from "./components/molecules/dataTable/dataTable";
import type { ColumnDef } from "@tanstack/react-table";

interface Product {
  id: number;
  title: string;
  price: number;
  brand: string;
}

const columns: ColumnDef<Product, unknown>[] = [
  { accessorKey: "id", header: "ID", enableHiding: true },
  { accessorKey: "title", header: "Title", enableHiding: true },
  { accessorKey: "price", header: "Price", enableHiding: true },
  { accessorKey: "brand", header: "Brand", enableHiding: true },
];

export const App = () => {
  return (
    <DataTable<Product>
      dataSource={"https://api.example.com/products"}
      columns={columns}
      enableColumnVisibility={true}
    />
  );
};
```

### With Initial Column Visibility

```tsx
<DataTable<Product>
  dataSource={"https://api.example.com/products"}
  columns={columns}
  enableColumnVisibility={true}
  initialColumnVisibility={{
    id: true,
    title: true,
    price: true,
    brand: false, // This column will be hidden initially
  }}
/>
```

### Disable Column Visibility

```tsx
<DataTable<Product>
  dataSource={"https://api.example.com/products"}
  columns={columns}
  enableColumnVisibility={false} // Disables the feature entirely
/>
```

## Column Configuration

To make a column hideable, add `enableHiding: true` to the column definition:

```tsx
const columns: ColumnDef<Product, unknown>[] = [
  { accessorKey: "id", header: "ID", enableHiding: true },
  { accessorKey: "title", header: "Title", enableHiding: true },
  { accessorKey: "price", header: "Price", enableHiding: true },
  { accessorKey: "brand", header: "Brand", enableHiding: true },
];
```

## Props

### DataTable Props

- `enableColumnVisibility?: boolean` - Enable/disable the column visibility feature (default: `true`)
- `initialColumnVisibility?: Record<string, boolean>` - Initial visibility state for columns

### Column Props

- `enableHiding?: boolean` - Whether this column can be hidden/shown (default: `false`)

## Implementation Details

### Components

1. **ColumnVisibilityToggle**: A dropdown component that shows all hideable columns with checkboxes
2. **DataTableHeader**: Updated to include the column visibility controls row
3. **DataTable**: Main component updated with column visibility state management

### State Management

The column visibility state is managed using TanStack Table's built-in column visibility features:

- `columnVisibility` state tracks which columns are visible
- `onColumnVisibilityChange` handler updates the state when columns are toggled
- The state is passed to the table configuration

### Styling

The column visibility controls use Tailwind CSS classes and match the existing table design:

- Dropdown button with hover effects
- Checkbox list for column selection
- Responsive layout that works with the table structure
- Proper z-index handling for dropdown positioning

## Browser Compatibility

This feature works with all modern browsers that support:
- React 18+
- TanStack Table v8+
- CSS Grid/Flexbox
- Event delegation for click outside handling 