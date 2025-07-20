# DataTable Density Toggle Feature

The DataTable component now includes a density toggle feature that allows users to switch between different row heights for better data visualization and user experience.

## Features

- **Three Density Levels**: Compact, Normal, and Comfortable
- **Visual Toggle**: Easy-to-use toggle buttons with icons and labels
- **Responsive Design**: Works on both desktop and mobile devices
- **Smooth Transitions**: Animated transitions between density changes
- **Persistent State**: Density setting is maintained during table interactions

## Usage

### Basic Implementation

```tsx
import { DataTable } from "./components/molecules/dataTable";

<DataTable<Product>
  dataSource={data}
  columns={columns}
  enableDensityToggle={true}
  initialDensity="normal"
  onDensityChange={(density) => {
    console.log("Density changed:", density);
  }}
  // ... other props
/>
```

### Available Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `enableDensityToggle` | `boolean` | `false` | Enable/disable the density toggle feature |
| `initialDensity` | `'compact' \| 'normal' \| 'comfortable'` | `'normal'` | Initial density setting |
| `onDensityChange` | `(density: Density) => void` | `undefined` | Callback when density changes |

### Density Levels

1. **Compact** (`py-1`): Minimal padding for maximum data density
2. **Normal** (`py-3`): Standard padding for balanced readability
3. **Comfortable** (`py-6`): Generous padding for enhanced readability

## Visual Design

The density toggle appears in the toolbar as a group of three buttons:
- Each button has an icon representing the density level
- Active density is highlighted with a white background and shadow
- Inactive buttons have a subtle hover effect
- Labels are hidden on small screens, only icons are shown

## Integration

The density toggle integrates seamlessly with existing DataTable features:
- Works with column visibility, filtering, and pinning
- Compatible with row selection and actions
- Respects responsive design patterns
- Maintains accessibility standards

## Example

```tsx
export const App = () => {
  return (
    <div className="w-full h-screen p-4 bg-gray-50">
      <DataTable<Product>
        dataSource={"https://dummyjson.com/products"}
        columns={columns}
        enableDensityToggle={true}
        initialDensity="normal"
        onDensityChange={(density) => {
          console.log("Density changed:", density);
          // You can save the preference to localStorage or send to server
        }}
        // ... other props
      />
    </div>
  );
};
```

## Styling

The density toggle uses Tailwind CSS classes and follows the existing design system:
- Background: `bg-gray-100`
- Active state: `bg-white text-gray-900 shadow-sm`
- Inactive state: `text-gray-600 hover:text-gray-900 hover:bg-gray-50`
- Transitions: `transition-all duration-200`

## Accessibility

- Proper ARIA labels and titles
- Keyboard navigation support
- Screen reader friendly
- High contrast ratios
- Focus indicators 