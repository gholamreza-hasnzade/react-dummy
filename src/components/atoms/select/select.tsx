import React, { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";

type ColorKey =
  | "primary"
  | "secondary"
  | "success"
  | "error"
  | "warning"
  | "info";

type Size = "sm" | "md" | "lg";

type Option = {
  [key: string]: string | number; // More specific typing for option values
};

type SelectProps = {
  apiUrl?: string; // Made optional since we can use options instead
  titleKey: string;
  valueKey: string;
  variant?: "contained" | "outlined" | "text";
  color?: ColorKey;
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  width?: string | number; // Custom width prop
  size?: Size;
  multiple?: boolean;
  value?: string | string[];
  onChange?: (value: string | string[]) => void;
  searchParamKey?: string; // Optional: allows custom search param key
  urlParams?: Record<string, string | number>; // Additional URL parameters
  error?: string; // Error message to display
  required?: boolean; // Whether the field is required
  label?: string; // Optional label for the select
  id?: string; // Unique identifier for the select
  name?: string; // Name attribute for form handling
  options?: Option[]; // Static options array
};

const colorMap = {
  primary: {
    contained:
      "bg-blue-600 text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-300 disabled:bg-blue-400",
    outlined:
      "border border-blue-600 text-blue-600 hover:bg-blue-100 hover:border-blue-700 focus:ring-2 focus:ring-blue-300 disabled:text-blue-400 disabled:border-blue-400",
    text: "text-blue-600 hover:text-blue-900 focus:ring-2 focus:ring-blue-300 disabled:text-blue-400",
  },
  secondary: {
    contained:
      "bg-gray-600 text-white hover:bg-gray-700 focus:ring-2 focus:ring-gray-300 disabled:bg-gray-400",
    outlined:
      "border border-gray-600 text-gray-600 hover:bg-gray-100 hover:border-gray-700 focus:ring-2 focus:ring-gray-300 disabled:text-gray-400 disabled:border-gray-400",
    text: "text-gray-600 hover:text-gray-900 focus:ring-2 focus:ring-gray-300 disabled:text-gray-400",
  },
  success: {
    contained:
      "bg-green-600 text-white hover:bg-green-700 focus:ring-2 focus:ring-green-300 disabled:bg-green-400",
    outlined:
      "border border-green-600 text-green-600 hover:bg-green-100 hover:border-green-700 focus:ring-2 focus:ring-green-300 disabled:text-green-400 disabled:border-green-400",
    text: "text-green-600 hover:text-green-900 focus:ring-2 focus:ring-green-300 disabled:text-green-400",
  },
  error: {
    contained:
      "bg-red-600 text-white hover:bg-red-700 focus:ring-2 focus:ring-red-300 disabled:bg-red-400",
    outlined:
      "border border-red-600 text-red-600 hover:bg-red-100 hover:border-red-700 focus:ring-2 focus:ring-red-300 disabled:text-red-400 disabled:border-red-400",
    text: "text-red-600 hover:text-red-700 focus:ring-2 focus:ring-red-300 disabled:text-red-400",
  },
  warning: {
    contained:
      "bg-yellow-500 text-black hover:bg-yellow-600 focus:ring-2 focus:ring-yellow-300 disabled:bg-yellow-300",
    outlined:
      "border border-yellow-500 text-yellow-600 hover:bg-yellow-100 hover:border-yellow-700 focus:ring-2 focus:ring-yellow-300 disabled:text-yellow-400 disabled:border-yellow-400",
    text: "text-yellow-600 hover:text-yellow-900 focus:ring-2 focus:ring-yellow-300 disabled:text-yellow-400",
  },
  info: {
    contained:
      "bg-sky-500 text-white hover:bg-sky-600 focus:ring-2 focus:ring-sky-300 disabled:bg-sky-300",
    outlined:
      "border border-sky-500 text-sky-500 hover:bg-sky-100 hover:border-sky-700 focus:ring-2 focus:ring-sky-300 disabled:text-sky-400 disabled:border-sky-400",
    text: "text-sky-500 hover:text-sky-900 focus:ring-2 focus:ring-sky-300 disabled:text-sky-400",
  },
};

export const Select: React.FC<SelectProps> = ({
  apiUrl,
  titleKey,
  valueKey,
  variant = "contained",
  color = "primary",
  loading = false,
  disabled = false,
  fullWidth = false,
  width,
  size = "md",
  multiple = false,
  value,
  onChange,
  searchParamKey = "q",
  urlParams = {},
  error,
  required = false,
  label,
  id,
  name,
  options,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValues, setSelectedValues] = useState<string[]>(
    Array.isArray(value) ? value : value ? [value] : []
  );
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const selectRef = useRef<HTMLDivElement>(null);

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 400);
    return () => clearTimeout(handler);
  }, [search]);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Build API URL with search param and additional params
  const buildApiUrl = (searchTerm: string) => {
    if (!apiUrl) return "";
    
    const url = new URL(apiUrl);
    
    // Add search parameter if provided
    if (searchTerm) {
      url.searchParams.set(searchParamKey, searchTerm);
    }
    
    // Add additional URL parameters
    Object.entries(urlParams).forEach(([key, value]) => {
      url.searchParams.set(key, String(value));
    });
    
    return url.toString();
  };

  const searchUrl = buildApiUrl(debouncedSearch);

  // Use static options or fetch from API
  const shouldUseApi = !options && !!apiUrl;
  
  const { data: apiData, isLoading, error: queryError } = useQuery({
    queryKey: [searchUrl],
    queryFn: async () => {
      const response = await fetch(searchUrl);
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const result = await response.json();
      if (result.products && Array.isArray(result.products)) {
        return result.products as Option[];
      }
      if (Array.isArray(result)) {
        return result as Option[];
      }
      return [] as Option[];
    },
    enabled: shouldUseApi, // Only run query if using API
  });

  // Use static options or API data
  const data: Option[] = options || apiData || [];
  const isDisabled = disabled || loading || (shouldUseApi && isLoading);

  const getErrorColorClasses = () => {
    if (error) {
      return {
        contained: "border-red-500 bg-red-50 text-red-900 hover:bg-red-100 focus:ring-2 focus:ring-red-300",
        outlined: "border-red-500 text-red-600 hover:bg-red-50 hover:border-red-600 focus:ring-2 focus:ring-red-300",
        text: "text-red-600 hover:text-red-800 focus:ring-2 focus:ring-red-300",
      };
    }
    return colorMap[color] || colorMap.primary;
  };

  const colorClasses = getErrorColorClasses()[variant];

  const sizeClasses = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-5 py-3 text-lg",
  };

  const getCustomWidthStyle = () => {
    if (fullWidth) return 'w-full';
    if (width) {
      return ''; // We'll handle custom width with inline styles
    }
    return 'min-w-[150px]';
  };

  const getInlineWidthStyle = () => {
    if (fullWidth) return {};
    if (width) {
      if (typeof width === 'number') {
        return { width: `${width}px` };
      }
      return { width };
    }
    return {};
  };

  const commonClassNames = [
    `${getCustomWidthStyle()} cursor-pointer inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus:outline-none disabled:opacity-50 disabled:pointer-events-none border`,
    colorClasses,
    sizeClasses[size],
    isDisabled && "cursor-not-allowed",
  ]
    .filter(Boolean)
    .join(" ");

  const handleToggle = () => {
    if (!isDisabled) {
      setIsOpen(!isOpen);
    }
  };

  const handleSelect = (selectedValue: string) => {
    if (multiple) {
      const newSelectedValues = selectedValues.includes(selectedValue)
        ? selectedValues.filter(v => v !== selectedValue)
        : [...selectedValues, selectedValue];
      
      setSelectedValues(newSelectedValues);
      onChange?.(newSelectedValues);
    } else {
      setSelectedValues([selectedValue]);
      onChange?.(selectedValue);
      setIsOpen(false);
    }
  };

  const handleRemove = (valueToRemove: string) => {
    const newSelectedValues = selectedValues.filter(v => v !== valueToRemove);
    setSelectedValues(newSelectedValues);
    onChange?.(newSelectedValues);
  };

  const getSelectedTitles = () => {
    return selectedValues.map(value => {
      const item = data.find((item: Option) => String(item[valueKey]) === value);
      return String(item?.[titleKey] || value);
    });
  };

  const getDisplayItems = () => {
    const titles = getSelectedTitles();
    if (titles.length <= 2) {
      return { visible: titles, count: 0 };
    }
    return {
      visible: titles.slice(0, 2),
      count: titles.length - 2
    };
  };

  // Filter options based on search if using static options
  const filteredData = options 
    ? data.filter((item: Option) => {
        const itemTitle = String(item[titleKey]).toLowerCase();
        return itemTitle.includes(debouncedSearch.toLowerCase());
      })
    : data;

  if (queryError instanceof Error) {
    return <div className="text-red-500">{queryError.message}</div>;
  }

  return (
    <div className={`${fullWidth ? 'w-full' : ''}`} style={getInlineWidthStyle()}>
      {/* Label */}
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      {/* Select Container */}
      <div 
        className={`relative ${fullWidth ? 'w-full' : ''}`} 
        style={getInlineWidthStyle()}
        ref={selectRef}
      >
        <button
          id={id}
          name={name}
          type="button"
          role="combobox"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          aria-labelledby={label ? id : undefined}
          aria-describedby={error && id ? `${id}-error` : undefined}
          aria-required={required}
          aria-invalid={!!error}
          className={`${commonClassNames} ${isOpen ? 'ring-2 ring-blue-300' : ''} ${error ? 'border-red-500' : ''}`}
          style={getInlineWidthStyle()}
          onClick={handleToggle}
          disabled={isDisabled}
        >
          <div className="flex flex-wrap gap-1 items-center min-h-[20px] flex-1">
            {multiple ? (
              selectedValues.length > 0 ? (
                <>
                  {(() => {
                    const { visible, count } = getDisplayItems();
                    return (
                      <>
                        {visible.map((title, index) => (
                          <span
                            key={selectedValues[index]}
                            className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full flex items-center gap-1"
                          >
                            {title}
                            <span
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRemove(selectedValues[index]);
                              }}
                              className="hover:bg-blue-200 rounded-full w-4 h-4 flex items-center justify-center cursor-pointer"
                              role="button"
                              tabIndex={0}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  handleRemove(selectedValues[index]);
                                }
                              }}
                            >
                              ×
                            </span>
                          </span>
                        ))}
                        {count > 0 && (
                          <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                            ... +{count}
                          </span>
                        )}
                      </>
                    );
                  })()}
                </>
              ) : (
                <span className="text-gray-500">Select options...</span>
              )
            ) : (
              <span>
                {selectedValues.length > 0 ? getSelectedTitles()[0] : "Select an option"}
              </span>
            )}
          </div>
          <svg
            className={`w-4 h-4 ml-2 transition-transform ${isOpen ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {isOpen && (
          <div className={`absolute z-10 ${fullWidth ? 'w-full' : 'w-full'} mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto`}>
            {/* Search bar */}
            <div className="p-2 border-b border-gray-200 bg-gray-50">
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search..."
                className="w-full px-2 py-1 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-200 text-sm"
                autoFocus
                onClick={e => e.stopPropagation()}
              />
            </div>
            {/* Loading indicator for list only */}
            {(isLoading || loading) ? (
              <div className="px-3 py-2 text-gray-500">Loading...</div>
            ) : filteredData?.length === 0 ? (
              <div className="px-3 py-2 text-gray-400">No options</div>
            ) : (
              filteredData?.map((item: Option) => {
                const itemValue = String(item[valueKey]);
                const itemTitle = String(item[titleKey]);
                const isSelected = selectedValues.includes(itemValue);
                
                return (
                  <div
                    key={String(itemValue)}
                    className={`px-3 py-2 cursor-pointer hover:bg-gray-100 flex items-center justify-between ${
                      isSelected ? 'bg-blue-50 text-blue-600' : ''
                    }`}
                    onClick={() => handleSelect(itemValue)}
                  >
                    <span>{itemTitle}</span>
                    {isSelected && (
                      <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <p id={`${id}-error`} className="mt-1 text-sm text-red-600 flex items-center">
          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
};
