# DataTable Empty State Feature

The DataTable component now includes a beautiful and customizable empty state that displays when there are no items to show.

## Features

- **Customizable Title & Description**: Set your own empty state message
- **Beautiful Design**: Clean, centered layout with icon and text
- **Responsive**: Works well on all screen sizes
- **Reusable Component**: EmptyState component can be used elsewhere
- **Default Fallback**: Sensible defaults if no custom text is provided

## Usage

### Basic Implementation

```tsx
import { DataTable } from "./components/molecules/dataTable";

<DataTable<Product>
  dataSource={data}
  columns={columns}
  emptyStateTitle="No products available"
  emptyStateDescription="We couldn't find any products matching your criteria."
  // ... other props
/>
```

### Available Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `emptyStateTitle` | `string` | `"No items found"` | Title displayed in the empty state |
| `emptyStateDescription` | `string` | `"Try adjusting your search or filters to find what you're looking for."` | Description displayed in the empty state |

### Using the EmptyState Component Directly

You can also use the EmptyState component independently:

```tsx
import { EmptyState } from "./components/molecules/dataTable/components";

<EmptyState
  title="No data available"
  description="Please check back later or contact support."
  icon={<CustomIcon />}
/>
```

## Visual Design

The empty state features:
- **Circular Icon Container**: Gray background with centered icon
- **Typography Hierarchy**: Clear title and descriptive text
- **Centered Layout**: Perfectly centered in the table area
- **Consistent Spacing**: Proper padding and margins
- **Gray Color Scheme**: Subtle, professional appearance

## Examples

### Default Empty State
```tsx
<DataTable dataSource={[]} columns={columns} />
```

### Custom Empty State for Products
```tsx
<DataTable
  dataSource={products}
  columns={columns}
  emptyStateTitle="No products available"
  emptyStateDescription="We couldn't find any products matching your criteria. Try adjusting your search terms or filters."
/>
```

### Custom Empty State for Users
```tsx
<DataTable
  dataSource={users}
  columns={columns}
  emptyStateTitle="No users found"
  emptyStateDescription="There are no users in the system yet. Create your first user to get started."
/>
```

### Custom Empty State for Orders
```tsx
<DataTable
  dataSource={orders}
  columns={columns}
  emptyStateTitle="No orders yet"
  emptyStateDescription="Orders will appear here once customers start placing them."
/>
```

## Custom Icons

You can create custom empty states with different icons:

```tsx
const searchIcon = (
  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

<EmptyState
  title="No search results"
  description="Try different keywords or check your spelling."
  icon={searchIcon}
/>
```

## Integration

The empty state integrates seamlessly with all DataTable features:
- Works with filtering and search
- Respects density settings
- Compatible with column visibility and pinning
- Maintains responsive design
- Preserves accessibility standards

## Styling

The empty state uses Tailwind CSS classes:
- Container: `flex flex-col items-center gap-4`
- Icon container: `w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center`
- Title: `text-lg font-semibold text-gray-900 mb-1`
- Description: `text-gray-500 text-sm`
- Table cell: `text-center py-16 px-4 sm:px-6`

## Accessibility

- Proper semantic HTML structure
- Screen reader friendly
- High contrast ratios
- Keyboard navigation support
- ARIA labels and descriptions 