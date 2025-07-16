# Global Filtering Feature

This implementation adds global filtering functionality to the DataTable component with API integration, allowing users to search across all columns using a single search input.

## Features

- **Global Search**: Single search input that searches across all columns
- **API Integration**: Uses dedicated search endpoints for server-side filtering
- **Real-time Search**: Search results update as you type
- **Clear Button**: Easy way to clear the search
- **Responsive Design**: Search input works well with the existing table layout
- **Search Icon**: Visual indicator for the search functionality

## API Integration

The global filter integrates with APIs that support search:
- **With search endpoint**: `https://dummyjson.com/products/search?q=phone`
- **Without search endpoint**: `https://api.example.com/users?q=john`
- Supports pagination parameters (`limit`, `skip`)
- Automatically switches between regular and search endpoints

## Usage

### Basic Usage with API Search

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
      dataSource={"https://dummyjson.com/products"}
      columns={columns}
      enableGlobalFilter={true}
      globalFilterPlaceholder="Search products..."
      searchEndpoint="https://dummyjson.com/products/search"
    />
  );
};
```

### With All Features Enabled

```tsx
<DataTable<Product>
  dataSource={"https://dummyjson.com/products"}
  columns={columns}
  enableColumnVisibility={true}
  enableColumnFiltering={true}
  enableGlobalFilter={true}
  globalFilterPlaceholder="Search products..."
  searchEndpoint="https://dummyjson.com/products/search"
  initialColumnVisibility={{
    id: true,
    title: true,
    price: true,
    brand: false,
  }}
/>
```

### Disable Global Filtering

```tsx
<DataTable<Product>
  dataSource={"https://dummyjson.com/products"}
  columns={columns}
  enableGlobalFilter={false} // Disables the feature entirely
/>
```

## Props

### DataTable Props

- `enableGlobalFilter?: boolean` - Enable/disable the global filtering feature (default: `true`)
- `globalFilterPlaceholder?: string` - Placeholder text for the search input (default: "Search all columns...")
- `searchEndpoint?: string` - Optional search endpoint (e.g., "https://dummyjson.com/products/search")


## API Endpoint Requirements

Your search API endpoint should support:

### Query Parameters
- `q` - Search query string
- `limit` - Number of items per page
- `skip` - Number of items to skip (for pagination)

### Example API Response
```json
{
  "products": [
    {
      "id": 1,
      "title": "iPhone 9",
      "price": 549,
      "brand": "Apple"
    }
  ],
  "total": 100
}
```

### Example API Calls
```
GET https://dummyjson.com/products/search?q=phone&limit=10&skip=0
GET https://dummyjson.com/products/search?q=laptop&limit=20&skip=10
```

## Implementation Details

### Components

1. **GlobalFilter**: A search input component with clear button functionality
2. **DataTableToolbar**: A toolbar component that contains the global filter
3. **DataTable**: Main component updated with global filtering state management

### State Management

The global filtering state is managed using TanStack Table's built-in global filtering features:

- `globalFilter` state tracks the current search query
- `onGlobalFilterChange` handler updates the state when search changes
- API query automatically includes the global filter in the query key

### API Integration Logic

The component automatically switches between endpoints:

1. **Without Search**: 
   ```
   GET https://dummyjson.com/products?limit=10&skip=0
   ```

2. **With Search (using search endpoint)**: 
   ```
   GET https://dummyjson.com/products/search?q=phone&limit=10&skip=0
   ```

3. **With Search (no search endpoint)**: 
   ```
   GET https://dummyjson.com/products?q=phone&limit=10&skip=0
   ```

### Search Behavior

- **Server-side filtering**: Uses API endpoints for searching
- **Real-time updates**: Results update as you type
- **Pagination support**: Search results are properly paginated
- **Query debouncing**: Built-in React Query caching prevents excessive API calls

## UI Features

### Search Input
- Search icon for visual clarity
- Placeholder text customization
- Focus states with blue ring
- Responsive width (320px by default)

### Clear Button
- Appears when there's a search query
- "Clear" text for clear indication
- Hover effects for better UX

### Toolbar Layout
- Clean toolbar design above the table
- Title section on the left
- Search section on the right
- Proper spacing and alignment

## Styling

The global filter uses Tailwind CSS classes and matches the existing table design:

- Clean input field with search icon
- Consistent border and focus states
- Hover effects for interactive elements
- Responsive layout that works with the table structure

## Browser Compatibility

This feature works with all modern browsers that support:
- React 18+
- TanStack Table v8+
- CSS Grid/Flexbox
- Input event handling

## Performance Considerations

- **API Caching**: React Query caches search results
- **Query Key Optimization**: Includes search parameters in query key
- **Automatic Refetching**: Refetches when search parameters change
- **Pagination**: Only loads necessary data

## Integration with Other Features

The global filtering feature works seamlessly with:
- **Column Visibility**: Hidden columns don't affect search
- **Column Filtering**: Can be used alongside individual column filters
- **Pagination**: Search results are properly paginated
- **API Data Sources**: Works with any API that supports search

## Error Handling

- **API Errors**: Handled gracefully with error states
- **Network Issues**: React Query handles retries
- **Invalid Responses**: Fallback to empty results
- **Loading States**: Shows loading indicators during search 