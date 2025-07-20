# Advanced Filtering Control Guide

The DataTable component now provides granular control over advanced filtering capabilities at both the table level and individual column level.

## 🎯 **Control Levels**

### 1. **Table-Level Control**
Control advanced filtering for the entire table with a single prop.

### 2. **Column-Level Control**
Control advanced filtering for specific columns using column metadata.

## 🚀 **Table-Level Control**

### Enable/Disable Advanced Filtering Globally

```tsx
<DataTable<Product>
  dataSource={data}
  columns={columns}
  enableColumnFiltering={true}
  enableAdvancedFiltering={true} // Enable advanced filtering for all columns
  // ... other props
/>
```

```tsx
<DataTable<Product>
  dataSource={data}
  columns={columns}
  enableColumnFiltering={true}
  enableAdvancedFiltering={false} // Disable advanced filtering for all columns
  // ... other props
/>
```

## 📋 **Column-Level Control**

### Enable Advanced Filtering for Specific Columns

```tsx
const columns: ColumnDef<Product, unknown>[] = [
  {
    accessorKey: "title",
    header: "Title",
    enableColumnFilter: true,
    meta: {
      enableAdvancedFilter: true, // Enable advanced filtering for this column
    },
  },
  {
    accessorKey: "price",
    header: "Price",
    enableColumnFilter: true,
    meta: {
      enableAdvancedFilter: false, // Disable advanced filtering for this column
    },
  },
];
```

### Default Behavior

- If `enableAdvancedFiltering` is `true` at table level and no column meta is specified, advanced filtering is enabled
- If `enableAdvancedFiltering` is `false` at table level, advanced filtering is disabled regardless of column meta
- Column meta takes precedence over table-level setting when table-level is `true`

## 🎨 **User Interface Behavior**

### When Advanced Filtering is Enabled
- **Filter Icon**: Blue filter icon appears next to the input field
- **Advanced Modal**: Clicking the icon opens the advanced filter modal
- **Visual Feedback**: Active filters show blue styling

### When Advanced Filtering is Disabled
- **Basic Input Only**: Only the simple text input is available
- **No Filter Icon**: Advanced filter button is hidden
- **Standard Filtering**: Uses basic contains/equals filtering

## 📊 **Use Cases**

### 1. **Mixed Filtering Strategy**
```tsx
const columns: ColumnDef<Product, unknown>[] = [
  {
    accessorKey: "title",
    header: "Title",
    enableColumnFilter: true,
    meta: { enableAdvancedFilter: true }, // Advanced filtering for text search
  },
  {
    accessorKey: "price",
    header: "Price",
    enableColumnFilter: true,
    meta: { enableAdvancedFilter: false }, // Basic filtering for numeric values
  },
  {
    accessorKey: "category",
    header: "Category",
    enableColumnFilter: true,
    meta: { enableAdvancedFilter: true }, // Advanced filtering for category selection
  },
];
```

### 2. **Performance Optimization**
```tsx
// Disable advanced filtering for large datasets to improve performance
<DataTable<Product>
  dataSource={largeDataset}
  columns={columns}
  enableColumnFiltering={true}
  enableAdvancedFiltering={false} // Disable for performance
/>
```

### 3. **User Experience Control**
```tsx
// Enable advanced filtering only for important columns
const columns: ColumnDef<Product, unknown>[] = [
  {
    accessorKey: "name",
    header: "Product Name",
    enableColumnFilter: true,
    meta: { enableAdvancedFilter: true }, // Important column - full filtering
  },
  {
    accessorKey: "sku",
    header: "SKU",
    enableColumnFilter: true,
    meta: { enableAdvancedFilter: false }, // Simple column - basic filtering
  },
];
```

## 🔧 **Technical Implementation**

### Table-Level Control
```tsx
interface DataTableProps<T extends object> {
  // ... other props
  enableAdvancedFiltering?: boolean; // Default: true
}
```

### Column-Level Control
```tsx
const column: ColumnDef<T, unknown> = {
  // ... other properties
  meta: {
    enableAdvancedFilter?: boolean; // Override table-level setting
  },
};
```

### Filter Component Logic
```tsx
// In ColumnFilter component
const showAdvancedFilter = enableAdvancedFiltering && 
  (column.columnDef.meta as any)?.enableAdvancedFilter !== false;
```

## 🎯 **Best Practices**

### 1. **When to Enable Advanced Filtering**
- **Text Columns**: Enable for flexible text search (contains, starts with, etc.)
- **Numeric Columns**: Enable for range filtering (between, greater than, etc.)
- **Category Columns**: Enable for list filtering (in, not in)
- **Important Data**: Enable for critical business data

### 2. **When to Disable Advanced Filtering**
- **Performance**: Large datasets where basic filtering is sufficient
- **Simple Data**: Columns with simple, predictable data patterns
- **User Experience**: When advanced options might confuse users
- **Mobile Interfaces**: When screen space is limited

### 3. **Mixed Approach**
- **Primary Columns**: Enable advanced filtering for main search fields
- **Secondary Columns**: Use basic filtering for less important fields
- **Performance Columns**: Disable for columns that don't need filtering

## 📈 **Performance Considerations**

### Advanced Filtering Impact
- **Memory Usage**: Slightly higher due to filter state management
- **Render Performance**: Minimal impact on table rendering
- **Filter Application**: Efficient algorithms for all filter types
- **User Experience**: Better filtering capabilities outweigh minor performance cost

### Optimization Strategies
```tsx
// Optimize for large datasets
const optimizedColumns = [
  {
    accessorKey: "id",
    header: "ID",
    enableColumnFilter: false, // No filtering for ID column
  },
  {
    accessorKey: "name",
    header: "Name",
    enableColumnFilter: true,
    meta: { enableAdvancedFilter: true }, // Enable for important column
  },
  {
    accessorKey: "description",
    header: "Description",
    enableColumnFilter: true,
    meta: { enableAdvancedFilter: false }, // Basic filtering for large text
  },
];
```

## 🔍 **Debugging and Monitoring**

### Check Filter Configuration
```tsx
// Log current filter settings
console.log('Table advanced filtering:', enableAdvancedFiltering);
console.log('Column filters:', columns.map(col => ({
  id: col.accessorKey,
  advancedFilter: (col.meta as any)?.enableAdvancedFilter
})));
```

### Monitor Filter Usage
```tsx
// Track which filter types are used
const handleFilterChange = (filterValue: FilterValue) => {
  console.log('Filter applied:', {
    column: columnId,
    type: filterValue.type,
    value: filterValue.value
  });
};
```

## 🚀 **Migration Guide**

### From Basic Filtering to Advanced Filtering

1. **Enable Globally**
```tsx
// Before
<DataTable enableColumnFiltering={true} />

// After
<DataTable 
  enableColumnFiltering={true}
  enableAdvancedFiltering={true} // Enable advanced filtering
/>
```

2. **Selective Enablement**
```tsx
// Enable only for specific columns
const columns = [
  {
    accessorKey: "name",
    meta: { enableAdvancedFilter: true }, // Enable advanced filtering
  },
  {
    accessorKey: "id",
    meta: { enableAdvancedFilter: false }, // Keep basic filtering
  },
];
```

3. **Gradual Rollout**
```tsx
// Start with a few columns, then expand
const phase1Columns = columns.map(col => ({
  ...col,
  meta: { 
    ...col.meta,
    enableAdvancedFilter: ['name', 'category'].includes(col.accessorKey as string)
  }
}));
```

## 📝 **Complete Example**

```tsx
import { DataTable } from './components/molecules/dataTable';

const columns: ColumnDef<Product, unknown>[] = [
  {
    accessorKey: "id",
    header: "ID",
    enableColumnFilter: false, // No filtering
  },
  {
    accessorKey: "title",
    header: "Title",
    enableColumnFilter: true,
    meta: { enableAdvancedFilter: true }, // Full advanced filtering
  },
  {
    accessorKey: "price",
    header: "Price",
    enableColumnFilter: true,
    meta: { enableAdvancedFilter: false }, // Basic filtering only
  },
  {
    accessorKey: "category",
    header: "Category",
    enableColumnFilter: true,
    meta: { enableAdvancedFilter: true }, // Advanced filtering for categories
  },
];

export const App = () => {
  return (
    <DataTable<Product>
      dataSource={products}
      columns={columns}
      enableColumnFiltering={true}
      enableAdvancedFiltering={true} // Global setting
      // ... other props
    />
  );
};
```

This control system provides maximum flexibility while maintaining excellent performance and user experience! 