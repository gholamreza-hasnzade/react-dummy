import React from 'react';
import type { Table } from '@tanstack/react-table';

export function DataTableHeader<T>({ table, actionsHorizontal = false }: { table: Table<T>; actionsHorizontal?: boolean }) {
  return (
    <thead className="bg-gray-50 sticky top-0 z-10">
      {table.getHeaderGroups().map(headerGroup => (
        <tr key={headerGroup.id}>
          {headerGroup.headers.map(header => (
            <th
              key={header.id}
              className={
                `px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider bg-gray-50 border-b border-gray-200 ` +
                (header.column.id === 'actions' ? 'sticky right-0 z-20' : '')
              }
              style={header.column.id === 'actions' ? { width: 150, minWidth: 150, maxWidth: 150 } : {}}
            >
              {header.isPlaceholder
                ? null
                : header.column.columnDef.header && typeof header.column.columnDef.header === 'function'
                  ? header.column.columnDef.header(header.getContext())
                  : header.column.columnDef.header}
            </th>
          ))}
          {actionsHorizontal && (
            <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider bg-gray-50 border-b border-gray-200">Actions</th>
          )}
        </tr>
      ))}
    </thead>
  );
} 