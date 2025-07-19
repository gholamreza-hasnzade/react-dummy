import type { ColumnDef, Table, Column } from "@tanstack/react-table";

export interface Action<T> {
  label: string;
  onClick: (row: T) => void;
  icon?: React.ReactNode;
}

export interface DataTableProps<T extends object> {
  dataSource: string | T[];
  columns: ColumnDef<T, unknown>[];
  pageSizeOptions?: number[];
  initialPageSize?: number;
  actions?: Action<T>[];
  actionsHorizontal?: boolean;
  enableColumnVisibility?: boolean;
  initialColumnVisibility?: Record<string, boolean>;
  enableColumnFiltering?: boolean;
  enableGlobalFilter?: boolean;
  globalFilterPlaceholder?: string;
  searchEndpoint?: string;
  debounceMs?: number;
  getRowId?: (originalRow: T, index: number, parent?: unknown) => string;
  onRowSelectionChange?: (selectedRowsOnPage: T[]) => void;
  onSelectSingleRow?: (selectedRow: T) => void;
  selectedRowClassName?: string;
}

export interface ApiResponse<T> {
  data?: T[];
  products?: T[];
  total: number;
}

export interface DataTablePaginationProps {
  table: Table<unknown>;
  pageIndex: number;
  setPageIndex: (idx: number) => void;
  pageSize: number;
  setPageSize: (size: number) => void;
  pageSizeOptions: number[];
  loading: boolean;
  computedPageCount: number;
}

export interface DataTableToolbarProps {
  table: Table<unknown>;
  enableGlobalFilter?: boolean;
  globalFilterPlaceholder?: string;
  debounceMs?: number;
}

export interface GlobalFilterProps {
  table: Table<unknown>;
  placeholder?: string;
  className?: string;
  debounceMs?: number;
}

export interface ColumnFilterProps {
  column: Column<unknown, unknown>;
}

export interface ColumnVisibilityToggleProps {
  table: Table<unknown>;
}

export interface DataTableHeaderProps {
  table: Table<unknown>;
  actionsHorizontal?: boolean;
  enableColumnVisibility?: boolean;
  enableColumnFiltering?: boolean;
} 