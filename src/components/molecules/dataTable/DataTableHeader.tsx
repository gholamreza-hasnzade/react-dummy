import type { Table } from "@tanstack/react-table";
import { ColumnVisibilityToggle } from "./ColumnVisibilityToggle";

export const DataTableHeader = <T extends object>({
  table,
  actionsHorizontal = false,
  enableColumnVisibility = true,
}: {
  table: Table<T>;
  actionsHorizontal?: boolean;
  enableColumnVisibility?: boolean;
}) => {
  return (
    <thead className="bg-gray-50 sticky top-0 z-10">
      {/* Column Visibility Controls Row */}
      {enableColumnVisibility && (
        <tr>
          <th colSpan={table.getAllColumns().length + (actionsHorizontal ? 1 : 0)} className="px-6 py-2 bg-gray-50 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-600">
                Showing {table.getVisibleLeafColumns().length} of {table.getAllLeafColumns().length} columns
              </div>
              <ColumnVisibilityToggle table={table} />
            </div>
          </th>
        </tr>
      )}
      
      {/* Column Headers Row */}
      {table.getHeaderGroups().map((headerGroup) => (
        <tr key={headerGroup.id}>
          {headerGroup.headers.map((header) => (
            <th
              key={header.id}
              className={
                `px-6 py-3 text-xs font-semibold text-gray-700 uppercase tracking-wider bg-gray-50 border-b border-gray-200 ` +
                (header.column.id === "actions"
                  ? "text-left sticky left-0 z-20"
                  : "text-right")
              }
              style={{
                width: header.getSize
                  ? header.getSize()
                  : header.column.columnDef.size,
                minWidth: header.getSize
                  ? header.getSize()
                  : header.column.columnDef.size,
                maxWidth: header.getSize
                  ? header.getSize()
                  : header.column.columnDef.size,
                ...(header.column.id === "actions"
                  ? { width: 50, minWidth: 50, maxWidth: 50 }
                  : {}),
              }}
            >
              {header.isPlaceholder
                ? null
                : header.column.columnDef.header &&
                  typeof header.column.columnDef.header === "function"
                ? header.column.columnDef.header(header.getContext())
                : header.column.columnDef.header}
            </th>
          ))}
          {actionsHorizontal && (
            <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider bg-gray-50 border-b border-gray-200">
              Actions
            </th>
          )}
        </tr>
      ))}
    </thead>
  );
};
