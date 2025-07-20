# DataTable Advanced Filtering Feature

The DataTable component now includes comprehensive advanced filtering capabilities with multiple filter types for precise data filtering.

## 🚀 **Features**

- **13 Filter Types**: Equals, Contains, Starts with, Ends with, Between, Greater/Less than, In/Not in list, Null checks
- **Smart Input Fields**: Different input types based on filter type (single value, range, list)
- **Visual Filter Indicators**: Clear visual feedback when filters are active
- **Easy Filter Management**: Apply, clear, and modify filters with intuitive UI
- **Type-Safe Implementation**: Full TypeScript support with proper type checking

## 📋 **Available Filter Types**

### Text Filters
| Filter Type | Description | Example |
|-------------|-------------|---------|
| `equals` | Exact match | `"John"` |
| `contains` | Contains substring | `"john"` (matches "Johnny", "Johnson") |
| `startsWith` | Starts with string | `"Jo"` (matches "John", "Joseph") |
| `endsWith` | Ends with string | `"n"` (matches "John", "Ryan") |

### Numeric Filters
| Filter Type | Description | Example |
|-------------|-------------|---------|
| `between` | Range between two values | `10 - 50` |
| `greaterThan` | Greater than value | `> 100` |
| `lessThan` | Less than value | `< 50` |
| `greaterThanOrEqual` | Greater than or equal | `≥ 100` |
| `lessThanOrEqual` | Less than or equal | `≤ 50` |

### List Filters
| Filter Type | Description | Example |
|-------------|-------------|---------|
| `in` | Value is in list | `"apple, banana, orange"` |
| `notIn` | Value is not in list | `"red, blue"` |

### Null Filters
| Filter Type | Description | Example |
|-------------|-------------|---------|
| `isNull` | Value is null/undefined | No value required |
| `isNotNull` | Value is not null/undefined | No value required |

## 🎯 **Usage**

### Basic Implementation

The advanced filtering is automatically available when `enableColumnFiltering` is enabled:

```tsx
<DataTable<Product>
  dataSource={data}
  columns={columns}
  enableColumnFiltering={true}
  // ... other props
/>
```

### Column Configuration

You can control which columns have filtering enabled:

```tsx
const columns: ColumnDef<Product, unknown>[] = [
  {
    accessorKey: "title",
    header: "Title",
    enableColumnFilter: true, // Enable filtering for this column
  },
  {
    accessorKey: "id",
    header: "ID",
    enableColumnFilter: false, // Disable filtering for this column
  },
];
```

## 🎨 **User Interface**

### Filter Input
- **Basic Input**: Simple text input for quick filtering
- **Advanced Button**: Click the filter icon to open advanced options
- **Visual Indicators**: Active filters show blue styling
- **Clear Button**: Easy filter removal

### Advanced Filter Modal
- **Filter Type Dropdown**: Select from 13 filter types
- **Dynamic Input Fields**: Input type changes based on filter type
- **Apply/Clear Buttons**: Confirm or clear filter changes
- **Responsive Design**: Works on all screen sizes

## 📊 **Filter Examples**

### Text Filtering
```tsx
// Find products containing "phone"
Filter Type: contains
Value: phone

// Find products starting with "iPhone"
Filter Type: startsWith
Value: iPhone
```

### Numeric Filtering
```tsx
// Find products between $100 and $500
Filter Type: between
Min Value: 100
Max Value: 500

// Find products greater than $1000
Filter Type: greaterThan
Value: 1000
```

### List Filtering
```tsx
// Find products in specific categories
Filter Type: in
Value: Electronics, Clothing, Books

// Exclude specific brands
Filter Type: notIn
Value: BrandA, BrandB
```

### Null Filtering
```tsx
// Find products without description
Filter Type: isNull

// Find products with description
Filter Type: isNotNull
```

## 🔧 **Technical Implementation**

### Filter Function
```tsx
import { createAdvancedFilterFn } from './utils/filterFunctions';

// The filter function handles all filter types
const filterFn = createAdvancedFilterFn(row, columnId, filterValue);
```

### Filter Value Structure
```tsx
interface FilterValue {
  type: FilterType;
  value: string | number | { min: string; max: string } | string[] | null;
}
```

### Column Configuration
```tsx
const table = useReactTable({
  // ... other config
  filterFns: {
    advanced: createAdvancedFilterFn,
  },
});
```

## 🎯 **Best Practices**

### 1. **Column Configuration**
- Enable filtering only on relevant columns
- Use appropriate filter types for data types
- Consider performance for large datasets

### 2. **User Experience**
- Provide clear filter labels
- Use meaningful placeholder text
- Show filter status clearly

### 3. **Performance**
- Filters are applied efficiently
- Large datasets are handled well
- Memory usage is optimized

## 📈 **Performance Considerations**

### Filter Optimization
- Filters are applied only when needed
- Efficient string and numeric comparisons
- Smart handling of null/undefined values

### Memory Management
- Filter state is properly managed
- No memory leaks from filter operations
- Efficient re-rendering

## 🔍 **Debugging Filters**

### Check Active Filters
```tsx
// Log current filter state
console.log('Column filters:', table.getState().columnFilters);
```

### Filter Display Text
```tsx
import { getFilterDisplayText } from './utils/filterFunctions';

const displayText = getFilterDisplayText(filterValue);
console.log('Filter display:', displayText);
```

## 🚀 **Future Enhancements**

### Planned Features
- **Date Range Filtering**: Filter by date ranges
- **Custom Filter Functions**: User-defined filter logic
- **Filter Presets**: Save and load filter configurations
- **Bulk Filter Operations**: Apply filters to multiple columns

### Advanced Features
- **Regex Filtering**: Pattern-based filtering
- **Fuzzy Search**: Approximate text matching
- **Filter History**: Track and restore previous filters
- **Export Filtered Data**: Export only filtered results

## 📝 **Examples**

### Complete Example
```tsx
import { DataTable } from './components/molecules/dataTable';

const columns: ColumnDef<Product, unknown>[] = [
  {
    accessorKey: "title",
    header: "Product Title",
    enableColumnFilter: true,
  },
  {
    accessorKey: "price",
    header: "Price",
    enableColumnFilter: true,
    cell: ({ getValue }) => `$${getValue()}`,
  },
  {
    accessorKey: "category",
    header: "Category",
    enableColumnFilter: true,
  },
];

export const App = () => {
  return (
    <DataTable<Product>
      dataSource={products}
      columns={columns}
      enableColumnFiltering={true}
      enableGlobalFilter={true}
      // ... other props
    />
  );
};
```

### Custom Filter Display
```tsx
// Custom column with specific filter behavior
{
  accessorKey: "status",
  header: "Status",
  enableColumnFilter: true,
  cell: ({ getValue }) => {
    const status = getValue() as string;
    return (
      <span className={`px-2 py-1 rounded text-xs ${
        status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
      }`}>
        {status}
      </span>
    );
  },
}
```

The advanced filtering system provides powerful and flexible data filtering capabilities while maintaining excellent performance and user experience! 