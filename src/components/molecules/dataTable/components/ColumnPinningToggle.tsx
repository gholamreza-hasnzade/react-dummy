import React from "react";
import type { Table, Column } from "@tanstack/react-table";

interface ColumnPinningToggleProps<T> {
  table: Table<T>;
}

const PinLeftIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
  </svg>
);

const PinRightIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
  </svg>
);

const UnpinIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M6 18L18 6M6 6l12 12" />
  </svg>
);

export const ColumnPinningToggle = <T extends object>({
  table,
}: ColumnPinningToggleProps<T>) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const handlePinColumn = (
    column: Column<T, unknown>,
    direction: "left" | "right" | false
  ) => {
    column.pin(direction);
    setIsOpen(false);
  };

  const getPinnedColumns = () => {
    const pinnedColumns: {
      left: Column<T, unknown>[];
      right: Column<T, unknown>[];
    } = {
      left: [],
      right: [],
    };

    table.getAllLeafColumns().forEach((column) => {
      const pinned = column.getIsPinned();
      if (pinned === "left") {
        pinnedColumns.left.push(column);
      } else if (pinned === "right") {
        pinnedColumns.right.push(column);
      }
    });

    return pinnedColumns;
  };

  const pinnedColumns = getPinnedColumns();

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
        </svg>
        Pin Columns
        {Object.values(pinnedColumns).some((cols) => cols.length > 0) && (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-600 text-white">
            {pinnedColumns.left.length + pinnedColumns.right.length}
          </span>
        )}
        <svg
          width="12"
          height="12"
          className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-[90]"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-64 bg-white border border-blue-200 rounded-md shadow-lg z-[100]">
            <div className="p-3 border-b border-blue-200 bg-blue-50">
              <h3 className="text-sm font-medium text-blue-700">Pin Columns</h3>
            </div>

            <div className="max-h-64 overflow-y-auto">
              {table
                .getAllLeafColumns()
                .filter(
                  (column) => column.getCanPin() && column.id !== "select"
                )
                .map((column) => {
                  const isPinned = column.getIsPinned();
                  const pinnedDirection = isPinned;

                  return (
                    <div
                      key={column.id}
                      className="flex items-center justify-between p-3 hover:bg-blue-50 border-b border-blue-100 last:border-b-0 bg-white"
                    >
                      <span className="text-sm text-gray-700 truncate flex-1">
                        {typeof column.columnDef.header === "string"
                          ? column.columnDef.header
                          : column.id}
                      </span>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handlePinColumn(column, "left")}
                          className={`p-1 rounded ${
                            pinnedDirection === "left"
                              ? "bg-blue-600 text-white"
                              : "text-blue-600 hover:text-blue-800 hover:bg-blue-100"
                          }`}
                          title="Pin to left"
                        >
                          <PinLeftIcon />
                        </button>
                        <button
                          type="button"
                          onClick={() => handlePinColumn(column, "right")}
                          className={`p-1 rounded ${
                            pinnedDirection === "right"
                              ? "bg-blue-600 text-white"
                              : "text-blue-600 hover:text-blue-800 hover:bg-blue-100"
                          }`}
                          title="Pin to right"
                        >
                          <PinRightIcon />
                        </button>
                        {isPinned && (
                          <button
                            type="button"
                            onClick={() => handlePinColumn(column, false)}
                            className="p-1 rounded text-red-600 hover:text-red-800 hover:bg-red-100"
                            title="Unpin"
                          >
                            <UnpinIcon />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
            </div>

            {(pinnedColumns.left.length > 0 ||
              pinnedColumns.right.length > 0) && (
              <div className="p-3 border-t border-blue-200 bg-blue-50">
                <div className="text-xs text-blue-700">
                  <div className="flex justify-between">
                    <span>Left: {pinnedColumns.left.length}</span>
                    <span>Right: {pinnedColumns.right.length}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};
