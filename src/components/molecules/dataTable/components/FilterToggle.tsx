import React from "react";

interface FilterToggleProps {
  isVisible: boolean;
  onToggle: () => void;
}

const FilterIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z" />
  </svg>
);

const FilterOffIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z" />
    <line x1="2" y1="21" x2="22" y2="3" />
  </svg>
);

export const FilterToggle = ({ isVisible, onToggle }: FilterToggleProps) => {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
    >
      {isVisible ? <FilterOffIcon /> : <FilterIcon />}
      {isVisible ? "Hide Filters" : "Show Filters"}
    </button>
  );
}; 