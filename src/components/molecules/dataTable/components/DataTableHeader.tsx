import type { Table } from "@tanstack/react-table";
import { ColumnVisibilityToggle } from "./ColumnVisibilityToggle";
import { ColumnFilter } from "./ColumnFilter";

const SortIcon = ({ sorted }: { sorted: false | 'asc' | 'desc' }) => {
  if (!sorted) {
    return (
      <svg width="12" height="12" className="inline ml-1 opacity-30" viewBox="0 0 20 20" fill="none">
        <path d="M7 8l3 3 3-3" stroke="currentColor" strokeWidth="2" fill="none"/>
      </svg>
    );
  }
  if (sorted === "asc") {
    return (
      <svg width="12" height="12" className="inline ml-1 text-blue-600" viewBox="0 0 20 20" fill="none">
        <path d="M7 12l3-3 3 3" stroke="currentColor" strokeWidth="2" fill="none"/>
      </svg>
    );
  }
  return (
    <svg width="12" height="12" className="inline ml-1 text-blue-600" viewBox="0 0 20 20" fill="none">
      <path d="M7 8l3 3 3-3" stroke="currentColor" strokeWidth="2" fill="none"/>
    </svg>
  );
};

export const DataTableHeader = <T extends object>({
  table,
  actionsHorizontal = false,
  enableColumnVisibility = true,
  enableColumnFiltering = true,
}: {
  table: Table<T>;
  actionsHorizontal?: boolean;
  enableColumnVisibility?: boolean;
  enableColumnFiltering?: boolean;
}) => {
  return (
    <thead className="bg-gray-50 sticky top-0 z-10">
      {enableColumnVisibility && (
        <tr>
          <th colSpan={table.getAllColumns().length + (actionsHorizontal ? 1 : 0)} className="px-4 sm:px-6 py-3 bg-gray-50 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div className="text-sm text-gray-600">
                Showing {table.getVisibleLeafColumns().length} of {table.getAllLeafColumns().length} columns
              </div>
              <ColumnVisibilityToggle table={table} />
            </div>
          </th>
        </tr>
      )}
      
      {table.getHeaderGroups().map((headerGroup) => (
        <tr key={headerGroup.id}>
          {headerGroup.headers.map((header) => (
            <th
              key={header.id}
              className={
                `px-4 sm:px-6 py-3 text-xs font-semibold text-gray-700 uppercase tracking-wider bg-gray-50 border-b border-gray-200 ` +
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
                  : header.column.columnDef.size || 150,
                maxWidth: header.getSize
                  ? header.getSize()
                  : header.column.columnDef.size,
                ...(header.column.id === "actions"
                  ? { width: 50, minWidth: 50, maxWidth: 50 }
                  : {}),
              }}
            >
              {header.isPlaceholder ? null : (
                header.column.getCanSort() ? (
                  <button
                    type="button"
                    onClick={header.column.getToggleSortingHandler()}
                    className="group inline-flex items-center select-none focus:outline-none hover:text-blue-600 transition-colors duration-200"
                    style={{ background: "none", border: "none", padding: 0, margin: 0, cursor: "pointer" }}
                    tabIndex={0}
                  >
                    {typeof header.column.columnDef.header === "function"
                      ? header.column.columnDef.header(header.getContext())
                      : header.column.columnDef.header}
                    <SortIcon sorted={header.column.getIsSorted()} />
                  </button>
                ) : (
                  typeof header.column.columnDef.header === "function"
                    ? header.column.columnDef.header(header.getContext())
                    : header.column.columnDef.header
                )
              )}
            </th>
          ))}
          {actionsHorizontal && (
            <th className="px-4 sm:px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider bg-gray-50 border-b border-gray-200">
              Actions
            </th>
          )}
        </tr>
      ))}
      
      {enableColumnFiltering && (
        <tr>
          {table.getVisibleLeafColumns().map((column) => (
            <th key={column.id} className="px-4 sm:px-6 py-3 bg-gray-50 border-b border-gray-200">
              {column.getCanFilter() ? (
                <ColumnFilter column={column} />
              ) : (
                <div className="h-10" /> 
              )}
            </th>
          ))}
          {actionsHorizontal && (
            <th className="px-4 sm:px-6 py-3 bg-gray-50 border-b border-gray-200">
              <div className="h-10" /> 
            </th>
          )}
        </tr>
      )}
    </thead>
  );
}; 