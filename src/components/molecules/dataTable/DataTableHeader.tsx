import type { Table } from "@tanstack/react-table";

export const DataTableHeader = <T extends object>({
  table,
  actionsHorizontal = false,
}: {
  table: Table<T>;
  actionsHorizontal?: boolean;
}) => {
  return (
    <thead className="bg-gray-50 sticky top-0 z-10">
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
