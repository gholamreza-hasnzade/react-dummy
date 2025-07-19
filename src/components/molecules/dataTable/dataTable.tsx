import React, { useState } from "react";
import type {
  Row,
  SortingState,
  HeaderContext,
  CellContext,
  RowSelectionState,
  Updater,
} from "@tanstack/react-table";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  flexRender,
} from "@tanstack/react-table";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

import { 
  DataTablePagination, 
  DataTableHeader, 
  DataTableToolbar 
} from "./components";

import type { Action, DataTableProps, ApiResponse } from "./types";
import { ActionsDropdown } from "@/components/atoms";

function IndeterminateCheckbox({
  indeterminate,
  className = "",
  ...rest
}: { indeterminate?: boolean } & React.HTMLProps<HTMLInputElement>) {
  const ref = React.useRef<HTMLInputElement>(null!);

  React.useEffect(() => {
    if (typeof indeterminate === "boolean") {
      ref.current.indeterminate = !rest.checked && indeterminate;
    }
  }, [ref, indeterminate, rest.checked]);

  return (
    <input
      type="checkbox"
      ref={ref}
      className={className + " cursor-pointer rounded border-gray-300 text-blue-600 focus:ring-blue-500"}
      {...rest}
    />
  );
}

export function DataTable<T extends object>({
  dataSource,
  columns = [],
  pageSizeOptions = [10, 20, 30, 50],
  initialPageSize = 10,
  actions,
  actionsHorizontal = false,
  enableColumnVisibility = true,
  initialColumnVisibility = {},
  enableColumnFiltering = true,
  enableGlobalFilter = true,
  globalFilterPlaceholder = "Search all columns...",
  searchEndpoint,
  debounceMs = 300,
  getRowId,
  onRowSelectionChange,
  onSelectSingleRow,
  selectedRowClassName,
  getRowClassName,
}: DataTableProps<T>) {
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [columnSizing, setColumnSizing] = useState({});
  const [columnVisibility, setColumnVisibility] = useState(
    initialColumnVisibility
  );
  const [columnFilters, setColumnFilters] = useState<
    Array<{ id: string; value: unknown }>
  >([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState<SortingState>([]);
  const [rowSelection, setRowSelection] = useState({});

  const isClientData = Array.isArray(dataSource);
  const clientData = isClientData
    ? (dataSource as T[]).slice(
        pageIndex * pageSize,
        (pageIndex + 1) * pageSize
      )
    : [];
  const clientTotal = isClientData ? (dataSource as T[]).length : 0;

  const sortBy = sorting[0]?.id;
  const order = sorting[0]?.desc ? "desc" : "asc";

  const {
    data: apiData,
    isLoading,
    isError,
    error,
  } = useQuery<{ items: T[]; total: number }>({
    queryKey: [
      typeof dataSource === "string" ? dataSource : "",
      pageIndex,
      pageSize,
      globalFilter,
      sorting,
    ],
    queryFn: async () => {
      if (typeof dataSource === "string") {
        let url: URL;

        if (globalFilter && searchEndpoint) {
          url = new URL(searchEndpoint, window.location.origin);
          url.searchParams.set("q", globalFilter);
        } else {
          url = new URL(dataSource, window.location.origin);
          if (globalFilter) {
            url.searchParams.set("q", globalFilter);
          }
        }

        url.searchParams.set("limit", pageSize.toString());
        url.searchParams.set("skip", (pageIndex * pageSize).toString());
        if (sortBy) url.searchParams.set("sortBy", sortBy);
        if (sortBy) url.searchParams.set("order", order);

        const res = await axios.get(url.toString());
        const json: ApiResponse<T> = res.data;
        return {
          items: json.data ?? json.products ?? [],
          total: json.total,
        };
      }
      return { items: [], total: 0 };
    },
    enabled: typeof dataSource === "string",
  });

  const safeApiData = apiData ?? { items: [], total: 0 };
  const data = isClientData ? clientData : safeApiData.items;
  const total = isClientData ? clientTotal : safeApiData.total;
  const loading = isClientData ? false : isLoading;
  const errorMsg = isClientData
    ? null
    : isError
    ? error instanceof Error
      ? error.message
      : "Unknown error"
    : null;

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

  const columnsWithSelection = React.useMemo(
    () => {
      if (onRowSelectionChange) {
        return [selectionColumn, ...columnsWithActions];
      }
      return columnsWithActions;
    },
    [selectionColumn, columnsWithActions, onRowSelectionChange]
  );

  function ActionsRow({ actions, row }: { actions: Action<T>[]; row: T }) {
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
  }

  const handleRowSelectionChange = (updater: Updater<RowSelectionState>) => {
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
  };

  const table = useReactTable({
    data,
    columns: columnsWithSelection,
    pageCount: Math.ceil(total / pageSize),
    state: {
      pagination: { pageIndex, pageSize },
      columnSizing,
      columnVisibility: enableColumnVisibility ? columnVisibility : {},
      columnFilters: enableColumnFiltering ? columnFilters : [],
      globalFilter: enableGlobalFilter ? globalFilter : "",
      sorting,
      rowSelection,
    },
    manualPagination: true,
    manualSorting: true,
    enableRowSelection: onRowSelectionChange ? true : false,
    enableMultiRowSelection: !onSelectSingleRow,
    onRowSelectionChange: onRowSelectionChange ? handleRowSelectionChange : undefined,
    onPaginationChange: (updater) => {
      if (typeof updater === "function") {
        const next = updater({ pageIndex, pageSize });
        setPageIndex(next.pageIndex);
        setPageSize(next.pageSize);
      } else {
        setPageIndex(updater.pageIndex);
        setPageSize(updater.pageSize);
      }
    },
    onSortingChange: setSorting,
    onColumnVisibilityChange: enableColumnVisibility
      ? setColumnVisibility
      : undefined,
    onColumnFiltersChange: enableColumnFiltering ? setColumnFilters : undefined,
    onGlobalFilterChange: enableGlobalFilter ? setGlobalFilter : undefined,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel:
      enableColumnFiltering || enableGlobalFilter
        ? getFilteredRowModel()
        : undefined,
    getPaginationRowModel: getPaginationRowModel(),
    enableColumnResizing: true,
    columnResizeMode: "onChange",
    onColumnSizingChange: setColumnSizing,
    ...(getRowId ? { getRowId } : {}),
  });

  const computedPageCount = table.getPageCount();

  return (
    <div className="flex flex-col w-full h-full bg-white rounded-lg shadow-sm border border-gray-200">
      <DataTableToolbar
        table={table}
        enableGlobalFilter={enableGlobalFilter}
        globalFilterPlaceholder={globalFilterPlaceholder}
        debounceMs={debounceMs}
      />
      <div className="flex-1 w-full overflow-hidden">
        <div className="w-full h-full overflow-x-auto table-container">
          <table className="w-full min-w-full divide-y divide-gray-200">
            <DataTableHeader
              table={table}
              actionsHorizontal={actionsHorizontal}
              enableColumnVisibility={enableColumnVisibility}
              enableColumnFiltering={enableColumnFiltering}
            />
            <tbody className="bg-white divide-y divide-gray-100">
              {loading ? (
                Array.from({ length: 5 }).map((_, rowIdx) => (
                  <tr key={`skeleton-row-${rowIdx}`}>
                    {Array.from({
                      length: Array.isArray(columnsWithSelection)
                        ? columnsWithSelection.length
                        : 1,
                    }).map((_, colIdx) => (
                      <td
                        key={`skeleton-cell-${rowIdx}-${colIdx}`}
                        className="px-4 sm:px-6 py-4 sm:py-6 whitespace-nowrap text-sm border-b border-gray-100 text-right"
                      >
                        <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : errorMsg ? (
                <tr>
                  <td
                    colSpan={
                      Array.isArray(columnsWithSelection)
                        ? columnsWithSelection.length
                        : 1
                    }
                    className="text-center text-red-500 py-12 px-4 sm:px-6"
                  >
                    <div className="flex flex-col items-center gap-2">
                      <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                      <span className="font-medium">{errorMsg}</span>
                    </div>
                  </td>
                </tr>
              ) : data.length === 0 ? (
                <tr>
                  <td
                    colSpan={
                      Array.isArray(columnsWithSelection)
                        ? columnsWithSelection.length
                        : 1
                    }
                    className="text-center py-12 px-4 sm:px-6"
                  >
                    <div className="flex flex-col items-center gap-2">
                      <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <span className="text-gray-500 font-medium">No data available</span>
                    </div>
                  </td>
                </tr>
              ) : (
                table.getRowModel().rows.map((row, idx) => {
                  const isSelected = row.getIsSelected();
                  const customRowClass = getRowClassName ? getRowClassName(row.original, idx) : "";
                  return (
                    <tr
                      key={row.id}
                      className={`transition-all duration-200 ${
                        isSelected 
                          ? selectedRowClassName || "bg-blue-100 border-l-4 border-blue-500 shadow-sm"
                          : customRowClass || (idx % 2 === 0 
                            ? "bg-white hover:bg-blue-50" 
                            : "bg-gray-50 hover:bg-blue-50")
                      } ${onSelectSingleRow ? "cursor-pointer" : ""}`}
                      onClick={onSelectSingleRow ? () => {
                        const newSelection = isSelected ? {} : { [row.id]: true };
                        setRowSelection(newSelection);
                        if (!isSelected) {
                          const selectedRow = data[idx];
                          if (selectedRow) {
                            onSelectSingleRow(selectedRow);
                          }
                        }
                      } : undefined}
                    >
                    {actionsHorizontal ? (
                      <>
                        {row.getVisibleCells().map((cell) => (
                          <td
                            key={cell.id}
                            className="px-4 sm:px-6 py-4 sm:py-6 whitespace-nowrap text-sm text-gray-900 border-b border-gray-100 text-right"
                            style={{
                              width: cell.column.getSize
                                ? cell.column.getSize()
                                : cell.column.columnDef.size,
                              minWidth: cell.column.getSize
                                ? cell.column.getSize()
                                : cell.column.columnDef.size || 150,
                              maxWidth: cell.column.getSize
                                ? cell.column.getSize()
                                : cell.column.columnDef.size,
                            }}
                          >
                            <span title={String(cell.getValue?.() ?? "")}>
                              {flexRender(
                                cell.column.columnDef.cell,
                                cell.getContext()
                              )}
                            </span>
                          </td>
                        ))}
                        <td className="px-4 sm:px-6 py-4 sm:py-6 whitespace-nowrap text-sm text-gray-900 border-b border-gray-100 text-right">
                          <ActionsRow
                            actions={actions ?? []}
                            row={row.original}
                          />
                        </td>
                      </>
                    ) : (
                      row.getVisibleCells().map((cell) => (
                        <td
                          key={cell.id}
                          className={
                            cell.column.id === "actions"
                              ? "px-4 sm:px-6 py-4 sm:py-6 text-sm text-gray-900 border-b border-gray-100 text-right"
                              : "px-4 sm:px-6 py-4 sm:py-6 text-sm text-gray-900 border-b border-gray-100 text-right"
                          }
                          style={{
                            width: cell.column.getSize
                              ? cell.column.getSize()
                              : cell.column.columnDef.size,
                            minWidth: cell.column.getSize
                              ? cell.column.getSize()
                              : cell.column.columnDef.size || 150,
                            maxWidth: cell.column.getSize
                              ? cell.column.getSize()
                              : cell.column.columnDef.size,
                          }}
                        >
                          <span title={String(cell.getValue?.() ?? "")}>
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </span>
                        </td>
                      ))
                    )}
                  </tr>
                );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
      {Object.keys(rowSelection).length > 0 && (
        <div className="px-4 sm:px-6 py-3 bg-blue-50 border-t border-blue-200">
          <div className="text-sm text-blue-700 font-medium">
            {Object.keys(rowSelection).length} row(s) selected
          </div>
        </div>
      )}
      <div className="px-4 sm:px-6 py-4 bg-gray-50 border-t border-gray-200">
        <DataTablePagination
          table={table}
          pageIndex={pageIndex}
          setPageIndex={setPageIndex}
          pageSize={pageSize}
          setPageSize={setPageSize}
          pageSizeOptions={pageSizeOptions}
          loading={loading}
          computedPageCount={computedPageCount}
        />
      </div>
    </div>
  );
}
