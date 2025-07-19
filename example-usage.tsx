import React, { useState } from 'react';
import { DataTable } from './src/components/molecules/dataTable';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

const sampleData: User[] = [
  { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'User' },
  { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'User' },
  { id: 4, name: 'Alice Brown', email: 'alice@example.com', role: 'Admin' },
];

const columns = [
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    accessorKey: 'email',
    header: 'Email',
  },
  {
    accessorKey: 'role',
    header: 'Role',
  },
];

export function ExampleWithRowSelection() {
  const [selectedRows, setSelectedRows] = useState<User[]>([]);

  const handleRowSelectionChange = (selectedRowsOnPage: User[]) => {
    console.log('Selected rows changed:', selectedRowsOnPage);
    setSelectedRows(selectedRowsOnPage);
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">DataTable with Row Selection</h2>
      
      {/* Display selected rows info */}
      {selectedRows.length > 0 && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded">
          <h3 className="font-medium text-blue-800 mb-2">
            Selected Rows ({selectedRows.length}):
          </h3>
          <ul className="text-sm text-blue-700">
            {selectedRows.map((row) => (
              <li key={row.id}>
                {row.name} - {row.email} ({row.role})
              </li>
            ))}
          </ul>
        </div>
      )}

      <DataTable
        dataSource={sampleData}
        columns={columns}
        onRowSelectionChange={handleRowSelectionChange}
        selectedRowClassName="bg-green-100 border-l-4 border-green-500 shadow-md"
        enableColumnVisibility={true}
        enableColumnFiltering={true}
        enableGlobalFilter={true}
      />
    </div>
  );
} 