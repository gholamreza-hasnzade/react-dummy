# DataTable Performance Optimization Guide

This document outlines the performance optimizations implemented in the DataTable component to ensure smooth rendering and efficient data handling.

## 🚀 **Optimizations Implemented**

### 1. **Memoization with useMemo**

#### Client Data Processing
```tsx
const isClientData = useMemo(() => Array.isArray(dataSource), [dataSource]);

const clientData = useMemo(() => {
  if (!isClientData) return [];
  return enablePagination 
    ? (dataSource as T[]).slice(
        pageIndex * pageSize,
        (pageIndex + 1) * pageSize
      )
    : (dataSource as T[]);
}, [isClientData, dataSource, enablePagination, pageIndex, pageSize]);
```

#### Sorting State
```tsx
const sortBy = useMemo(() => sorting[0]?.id, [sorting]);
const order = useMemo(() => sorting[0]?.desc ? "desc" : "asc", [sorting]);
```

#### Density Classes
```tsx
const getDensityClasses = useMemo(() => {
  switch (density) {
    case 'compact': return 'py-1';
    case 'comfortable': return 'py-6';
    default: return 'py-3';
  }
}, [density]);
```

### 2. **Callback Optimization with useCallback**

#### Event Handlers
```tsx
const handleRowSelectionChange = useCallback((updater: Updater<RowSelectionState>) => {
  const next = typeof updater === "function" ? updater(rowSelection) : updater;
  setRowSelection(next);
  
  if (onRowSelectionChange) {
    const selectedRowIndices = Object.keys(next).filter(key => next[key]);
    const selectedRows = selectedRowIndices.map(index => {
      const rowIndex = parseInt(index);
      return data[rowIndex];
    }).filter(Boolean);
    
    onRowSelectionChange(selectedRows);
  }
}, [rowSelection, onRowSelectionChange, data]);

const handleDensityChange = useCallback((newDensity: Density) => {
  setDensity(newDensity);
  if (onDensityChange) {
    onDensityChange(newDensity);
  }
}, [onDensityChange]);
```

#### Component Functions
```tsx
const ActionsRow = useCallback(({ actions, row }: { actions: Action<T>[]; row: T }) => {
  return (
    <div className="flex gap-2">
      {actions.map((action, idx) => (
        <button
          key={action.label + idx}
          className="px-3 py-1.5 rounded-md bg-gray-100 hover:bg-gray-200 text-sm flex items-center gap-1.5 transition-colors duration-200 font-medium text-gray-700"
          onClick={() => action.onClick(row)}
          type="button"
        >
          {action.icon && <span className="flex-shrink-0">{action.icon}</span>}
          <span className="truncate">{action.label}</span>
        </button>
      ))}
    </div>
  );
}, []);
```

### 3. **Memoized Row Component**

Created a separate `DataTableRow` component with `React.memo` to prevent unnecessary re-renders:

```tsx
export const DataTableRow = memo(<T extends object>({
  row,
  idx,
  actions,
  actionsHorizontal = false,
  enableColumnPinning = false,
  densityClasses,
  isSelected,
  selectedRowClassName,
  customRowClass,
  onSelectSingleRow,
  onRowClick,
  ActionsRow,
}: DataTableRowProps<T>) => {
  // Component implementation
});
```

### 4. **Column Memoization**

#### Actions Column
```tsx
const columnsWithActions = React.useMemo(() => {
  if (!actions || actionsHorizontal) return columns;
  return [
    ...columns,
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }: { row: Row<T> }) => (
        <ActionsDropdown actions={actions} row={row.original} />
      ),
      enableSorting: false,
      enableResizing: false,
      meta: { isAction: true },
    },
  ];
}, [columns, actions, actionsHorizontal]);
```

#### Selection Column
```tsx
const selectionColumn = React.useMemo(
  () => ({
    id: "select",
    header: ({ table }: HeaderContext<T, unknown>) => {
      if (onSelectSingleRow) {
        return <span className="text-gray-400 text-xs">Select</span>;
      }
      return (
        <IndeterminateCheckbox
          checked={table.getIsAllRowsSelected()}
          indeterminate={table.getIsSomeRowsSelected()}
          onChange={table.getToggleAllRowsSelectedHandler()}
        />
      );
    },
    cell: ({ row }: CellContext<T, unknown>) => (
      <IndeterminateCheckbox
        checked={row.getIsSelected()}
        disabled={!row.getCanSelect()}
        indeterminate={row.getIsSomeSelected()}
        onChange={row.getToggleSelectedHandler()}
      />
    ),
    enableSorting: false,
    enableResizing: false,
    size: 32,
    meta: { isSelection: true },
  }),
  [onSelectSingleRow]
);
```

## 📊 **Performance Benefits**

### 1. **Reduced Re-renders**
- Memoized computations prevent unnecessary recalculations
- Callback optimization prevents child component re-renders
- Row component memoization prevents individual row re-renders

### 2. **Efficient Data Processing**
- Client data slicing is memoized and only recalculates when dependencies change
- Sorting state is memoized to prevent unnecessary API calls
- Column definitions are memoized to prevent table re-initialization

### 3. **Memory Optimization**
- Reusable components reduce memory footprint
- Proper dependency arrays prevent memory leaks
- Efficient event handler management

## 🔧 **Best Practices Applied**

### 1. **Dependency Arrays**
- Always include all dependencies in useMemo and useCallback
- Avoid creating objects/arrays in dependency arrays
- Use primitive values when possible

### 2. **Component Structure**
- Separate complex logic into smaller, memoized components
- Use React.memo for components that receive stable props
- Implement proper key props for list rendering

### 3. **State Management**
- Minimize state updates
- Batch related state changes
- Use functional updates when new state depends on previous state

### 4. **Event Handling**
- Memoize event handlers to prevent child re-renders
- Use stable references for callback props
- Implement proper cleanup in useEffect

## 🎯 **Usage Guidelines**

### 1. **When to Use useMemo**
- Expensive calculations
- Object/array creation that's used in dependencies
- Computed values that depend on multiple state variables

### 2. **When to Use useCallback**
- Event handlers passed to child components
- Functions used in useEffect dependencies
- Callbacks that are passed as props

### 3. **When to Use React.memo**
- Components that receive stable props
- Components that render frequently
- Components in lists or grids

## 📈 **Performance Monitoring**

### 1. **React DevTools Profiler**
- Use the Profiler to identify performance bottlenecks
- Monitor component render times
- Check for unnecessary re-renders

### 2. **Key Metrics to Watch**
- Component render frequency
- Time spent in expensive calculations
- Memory usage patterns
- Bundle size impact

### 3. **Optimization Checklist**
- [ ] All expensive calculations are memoized
- [ ] Event handlers are wrapped in useCallback
- [ ] List items have proper keys
- [ ] Components are memoized where appropriate
- [ ] Dependencies are correctly specified
- [ ] No unnecessary state updates

## 🚀 **Future Optimizations**

### 1. **Virtual Scrolling**
- Implement virtual scrolling for large datasets
- Only render visible rows
- Reduce DOM nodes for better performance

### 2. **Lazy Loading**
- Implement lazy loading for images and heavy content
- Use Intersection Observer for on-demand loading
- Progressive enhancement for better UX

### 3. **Web Workers**
- Move heavy computations to web workers
- Keep UI thread responsive
- Handle large data processing efficiently

### 4. **Code Splitting**
- Split components into smaller chunks
- Load features on demand
- Reduce initial bundle size 