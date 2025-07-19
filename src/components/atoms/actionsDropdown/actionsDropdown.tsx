import React, { useState, useRef, useEffect } from "react";

interface Action<T> {
  label: string;
  onClick: (row: T) => void;
  icon?: React.ReactNode;
}

export function ActionsDropdown<T>({
  actions,
  row,
}: {
  actions: Action<T>[];
  row: T;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  return (
    <div className="flex justify-end items-center" ref={ref}>
      <div className="relative">
        <button
          className="p-1.5 sm:p-2 rounded-full hover:bg-gray-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
          onClick={() => setOpen((o) => !o)}
          type="button"
          aria-label="Actions"
        >
          <svg
            width="16"
            height="16"
            className="sm:w-5 sm:h-5 text-gray-600"
            fill="none"
            viewBox="0 0 20 20"
            stroke="currentColor"
          >
            <circle cx="10" cy="4" r="1.5" />
            <circle cx="10" cy="10" r="1.5" />
            <circle cx="10" cy="16" r="1.5" />
          </svg>
        </button>
        {open && (
          <div className="absolute top-6 -right-16 translate-x-1/2 mt-1 w-36 sm:w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-30">
            <button
              className="sr-only"
              onClick={() => setOpen(false)}
              aria-label="Close actions menu"
              tabIndex={0}
            >
              ×
            </button>
            {actions.map((action, idx) => (
              <button
                key={action.label + idx}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-50 text-right transition-colors duration-150 first:rounded-t-lg last:rounded-b-lg"
                onClick={() => {
                  action.onClick(row);
                  setOpen(false);
                }}
                type="button"
              >
                {action.icon && (
                  <span className="flex-shrink-0">{action.icon}</span>
                )}
                <span className="truncate text-gray-700">{action.label}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
