import React, { useState, useRef, useEffect } from 'react';

interface Action<T> {
  label: string;
  onClick: (row: T) => void;
  icon?: React.ReactNode;
}

export function ActionsDropdown<T>({ actions, row }: { actions: Action<T>[]; row: T }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  return (
    <div className="relative flex justify-center items-center" ref={ref}>
      <button
        className="p-2 rounded-full  transition"
        onClick={() => setOpen(o => !o)}
        type="button"
        aria-label="Actions"
      >
        <svg width="20" height="20" fill="none" viewBox="0 0 20 20" stroke="currentColor">
          <circle cx="10" cy="4" r="1.5" />
          <circle cx="10" cy="10" r="1.5" />
          <circle cx="10" cy="16" r="1.5" />
        </svg>
      </button>
      {open && (
        <div className="absolute top-full -right-24 mt-2 w-36 bg-white border rounded shadow-lg z-30">
          {actions.map((action, idx) => (
            <button
              key={action.label + idx}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-100 text-right"
              onClick={() => { action.onClick(row); setOpen(false); }}
              type="button"
            >
              {action.icon && <span>{action.icon}</span>}
              {action.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
} 