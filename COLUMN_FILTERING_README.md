# Column Filtering Feature

This implementation adds column filtering functionality to the DataTable component, allowing users to filter data by individual columns.

## Features

- **Individual Column Filters**: Each column can have its own filter input
- **Real-time Filtering**: Filters are applied as you type
- **Clear Filter Button**: Easy way to clear individual column filters
- **Responsive Design**: Filter inputs work well with the existing table layout
- **Conditional Rendering**: Only shows filter inputs for filterable columns

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
  { accessorKey: "id", header: "ID", enableColumnFilter: true },
  { accessorKey: "title", header: "Title", enableColumnFilter: true },
  { accessorKey: "price", header: "Price", enableColumnFilter: true },
  { accessorKey: "brand", header: "Brand", enableColumnFilter: true },
];

export const App = () => {
  return (
    <DataTable<Product>
      dataSource={"https://api.example.com/products"}
      columns={columns}
      enableColumnFiltering={true}
    />
  );
};
```

### With Other Features

```tsx
<DataTable<Product>
  dataSource={"https://api.example.com/products"}
  columns={columns}
  enableColumnVisibility={true}
  enableColumnFiltering={true}
  initialColumnVisibility={{
    id: true,
    title: true,
    price: true,
    brand: false,
  }}
/>
```

### Disable Column Filtering

```tsx
<DataTable<Product>
  dataSource={"https://api.example.com/products"}
  columns={columns}
  enableColumnFiltering={false} // Disables the feature entirely
/>
```

## Column Configuration

To make a column filterable, add `enableColumnFilter: true` to the column definition:

```tsx
const columns: ColumnDef<Product, unknown>[] = [
  { accessorKey: "id", header: "ID", enableColumnFilter: true },
  { accessorKey: "title", header: "Title", enableColumnFilter: true },
  { accessorKey: "price", header: "Price", enableColumnFilter: true },
  { accessorKey: "brand", header: "Brand", enableColumnFilter: true },
];
```

## Props

### DataTable Props

- `enableColumnFiltering?: boolean` - Enable/disable the column filtering feature (default: `true`)

### Column Props

- `enableColumnFilter?: boolean` - Whether this column can be filtered (default: `false`)

## Implementation Details

### Components

1. **ColumnFilter**: A filter input component with clear button functionality
2. **DataTableHeader**: Updated to include a filter row with input fields
3. **DataTable**: Main component updated with column filtering state management

### State Management

The column filtering state is managed using TanStack Table's built-in filtering features:

- `columnFilters` state tracks active filters for each column
- `onColumnFiltersChange` handler updates the state when filters change
- `getFilteredRowModel` processes the data based on active filters

### Filter Behavior

- **Text-based filtering**: Filters work on string values
- **Case-insensitive**: Filtering is not case-sensitive
- **Partial matching**: Filters match partial strings
- **Real-time updates**: Results update as you type

### Styling

The filter inputs use Tailwind CSS classes and match the existing table design:

- Clean input fields with focus states
- Clear button with hover effects
- Consistent spacing and alignment
- Responsive layout that works with column sizing

## Filter Input Features

### Input Field
- Placeholder text shows "Filter [Column Name]..."
- Real-time filtering as you type
- Focus states with blue ring

### Clear Button
- Appears when there's a filter value
- X icon for clear visual indication
- Hover effects for better UX

### Layout
- Filter row appears below column headers
- Only shows for filterable columns
- Maintains table structure and alignment

## Browser Compatibility

This feature works with all modern browsers that support:
- React 18+
- TanStack Table v8+
- CSS Grid/Flexbox
- Input event handling

## Performance Considerations

- Filtering is performed client-side for better performance
- Real-time filtering may impact performance with large datasets
- Consider debouncing for very large datasets if needed

## Integration with Other Features

The column filtering feature works seamlessly with:
- **Column Visibility**: Hidden columns don't show filter inputs
- **Pagination**: Filtered results are properly paginated
- **Column Resizing**: Filter inputs adapt to column width changes
- **Actions**: Action columns don't show filter inputs 