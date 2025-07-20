import React, { useState } from 'react';
import type { Column } from '@tanstack/react-table';
import { AdvancedFilter } from './AdvancedFilter';
import { getFilterDisplayText } from '../utils/filterFunctions';
import type { FilterValue } from '../utils/filterFunctions';

interface ColumnFilterProps<T extends object> {
  column: Column<T, unknown>;
  enableAdvancedFiltering?: boolean;
}

export function ColumnFilter<T extends object>({ column, enableAdvancedFiltering = true }: ColumnFilterProps<T>) {
  const [showAdvancedFilter, setShowAdvancedFilter] = useState(false);
  const columnFilterValue = column.getFilterValue() as FilterValue | string | undefined;

  const handleClearFilter = () => {
    column.setFilterValue(undefined);
  };

  const getFilterText = () => {
    if (!columnFilterValue) return '';
    
    if (typeof columnFilterValue === 'string') {
      return columnFilterValue;
    }
    
    if (typeof columnFilterValue === 'object' && columnFilterValue.type) {
      return getFilterDisplayText(columnFilterValue);
    }
    
    return '';
  };

  const filterText = getFilterText();
  const hasFilter = !!columnFilterValue;
  const isAdvancedFilter = typeof columnFilterValue === 'object' && columnFilterValue !== null && 'type' in columnFilterValue;

  const handleBasicInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    // Only set simple string filter if no advanced filter is active
    if (!isAdvancedFilter) {
      column.setFilterValue(value);
    }
  };

  return (
    <div className="relative">
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={filterText}
          onChange={handleBasicInputChange}
          disabled={isAdvancedFilter}
          placeholder={isAdvancedFilter ? "Advanced filter active" : `Filter ${typeof column.columnDef.header === 'string' ? column.columnDef.header : column.id}...`}
          className={`w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 placeholder-gray-400 ${
            isAdvancedFilter ? 'bg-gray-100 text-gray-600 cursor-not-allowed' : ''
          }`}
        />
        
        <div className="flex items-center gap-1">
          {enableAdvancedFiltering && (column.columnDef.meta as any)?.enableAdvancedFilter !== false && (
            <button
              onClick={() => setShowAdvancedFilter(!showAdvancedFilter)}
              className={`p-1.5 rounded transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                hasFilter 
                  ? 'text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100' 
                  : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
              }`}
              type="button"
              title="Advanced filter"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
              </svg>
            </button>
          )}
          
          {hasFilter && (
            <button
              onClick={handleClearFilter}
              className="p-1.5 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded transition-colors duration-200"
              type="button"
              title="Clear filter"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {showAdvancedFilter && (
        <AdvancedFilter
          column={column}
          onClose={() => setShowAdvancedFilter(false)}
        />
      )}
    </div>
  );
} 