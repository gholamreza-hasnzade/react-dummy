import React, { useState, useEffect, useRef, useCallback } from "react";

type ColorKey =
  | "primary"
  | "secondary"
  | "success"
  | "error"
  | "warning"
  | "info";

type Size = "sm" | "md" | "lg";

type Option = {
  [key: string]: string | number; 
};

type SelectProps = {
  apiUrl?: string; 
  titleKey: string | string[]; // changed here
  valueKey: string;
  variant?: "contained" | "outlined" | "text";
  color?: ColorKey;
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  width?: string | number; 
  size?: Size;
  multiple?: boolean;
  value?: Option | Option[] | undefined;
  onChange?: (value: Option | Option[]) => void;
  searchParamKey?: string; 
  urlParams?: Record<string, string | number>; 
  error?: string; 
  required?: boolean;
  label?: string; 
  id?: string; 
  name?: string; 
  options?: Option[]; 
  editMode?: boolean; 
  defaultValue?: string | string[]; 
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
  editMode = false,
  defaultValue,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const getInitialValues = () => {
    if (value !== undefined) {
      if (Array.isArray(value)) {
        return value.map(v => String(v[valueKey]));
      } else if (typeof value === 'object' && value !== null) {
        return [String(value[valueKey])];
      }
      return [];
    }
    if (editMode && defaultValue !== undefined) {
      return Array.isArray(defaultValue) ? defaultValue : [defaultValue];
    }
    return [];
  };
  
  const [selectedValues, setSelectedValues] = useState<string[]>(getInitialValues());
  
  useEffect(() => {
    if (value !== undefined) {
      if (Array.isArray(value)) {
        setSelectedValues(value.map(v => String(v[valueKey])));
      } else if (typeof value === 'object' && value !== null) {
        setSelectedValues([String(value[valueKey])]);
      }
    }
  }, [value]);

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const selectRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 400);
    return () => clearTimeout(handler);
  }, [search]);

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

  const [optionsData, setOptionsData] = useState<Option[]>([]);
  const [skip, setSkip] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const limit = 10;
  const dropdownRef = useRef<HTMLDivElement>(null);

  const fetchOptions = useCallback(async (reset = false) => {
    if (!apiUrl) return;
    setLoadingMore(true);
    const url = new URL(apiUrl);
    url.searchParams.set("limit", String(limit));
    url.searchParams.set("skip", String(reset ? 0 : skip));
    if (debouncedSearch) {
      url.searchParams.set(searchParamKey, debouncedSearch);
    }
    Object.entries(urlParams).forEach(([key, value]) => {
      url.searchParams.set(key, String(value));
    });
    const response = await fetch(url.toString());
    const result = await response.json();
    const newOptions = result.products || result;
    setOptionsData(prev =>
      reset ? newOptions : [...prev, ...newOptions]
    );
    setHasMore(newOptions.length === limit);
    setLoadingMore(false);
    if (reset) setSkip(limit);
    else setSkip(prev => prev + limit);
  }, [apiUrl, skip, limit, debouncedSearch, searchParamKey, urlParams]);

  useEffect(() => {
    if (isOpen && apiUrl && !options) {
      fetchOptions(true);
    }
    // eslint-disable-next-line
  }, [isOpen, debouncedSearch, apiUrl]);

  useEffect(() => {
    if (options) {
      setOptionsData(options);
    }
  }, [options]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    if (scrollHeight - scrollTop <= clientHeight + 50 && hasMore && !loadingMore) {
      fetchOptions();
    }
  };

  const data: Option[] = options ? options : optionsData;
  const isDisabled = disabled || loading || loadingMore;

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
      return ''; 
    }
    return 'min-w-[400px] w-auto'; 
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
      const selectedObjects = data.filter((item: Option) =>
        newSelectedValues.includes(String(item[valueKey]))
      );
      onChange?.(selectedObjects);
    } else {
      setSelectedValues([selectedValue]);
      const selectedObject = data.find((item: Option) => String(item[valueKey]) === selectedValue);
      if (selectedObject) {
        onChange?.(selectedObject);
      }
      setIsOpen(false);
    }
  };

  const handleRemove = (valueToRemove: string) => {
    const newSelectedValues = selectedValues.filter(v => v !== valueToRemove);
    setSelectedValues(newSelectedValues);
    const selectedObjects = data.filter((item: Option) =>
      newSelectedValues.includes(String(item[valueKey]))
    );
    onChange?.(selectedObjects);
  };

  const getTitleFromItem = (item: Option): string => {
    if (Array.isArray(titleKey)) {
      return [...titleKey].reverse().map(key => String(item[key] ?? "")).join("  ");
    }
    return String(item[titleKey] ?? "");
  };

  const getSelectedTitles = () => {
    return selectedValues.map(value => {
      const item = data.find((item: Option) => String(item[valueKey]) === value);
      return item ? getTitleFromItem(item) : value;
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

  return (
    <div className={`${fullWidth ? 'w-full' : ''}`} style={getInlineWidthStyle()}>
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
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
                          <span className="relative group bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full cursor-pointer">
                            ... +{count}
                            <div className="absolute left-1/2 top-full z-20 mt-1 w-max min-w-[120px] max-w-xs -translate-x-1/2 bg-gray-900 text-white text-xs rounded px-3 py-2 shadow-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity">
                              {(() => {
                                const hidden = getSelectedTitles().slice(2);
                                return hidden.length > 0 ? (
                                  hidden.map((title, idx) => (
                                    <div key={idx} className="whitespace-normal break-words py-0.5">{title}</div>
                                  ))
                                ) : (
                                  <div className="whitespace-normal break-words py-0.5">No hidden items</div>
                                );
                              })()}
                            </div>
                          </span>
                        )}
                      </>
                    );
                  })()}
                </>
              ) : (
                <span className="text-gray-500">
                  {editMode ? "No items selected" : "Select options..."}
                </span>
              )
            ) : (
              <span>
                {selectedValues.length > 0 ? getSelectedTitles()[0] : 
                  editMode ? "No option selected" : "Select an option"}
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
          <div
            ref={dropdownRef}
            onScroll={handleScroll}
            className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto"
          >
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
            {loading && <div className="px-3 py-2 text-gray-500">Loading...</div>}
            {data?.length === 0 && !loading && (
              <div className="px-3 py-2 text-gray-400">No options</div>
            )}
            {data?.map((item: Option) => {
              const itemValue = String(item[valueKey]);
              const itemTitle = getTitleFromItem(item); // changed here
              const isSelected = selectedValues.includes(itemValue);
              return (
                <div
                  key={String(itemValue)}
                  className={`px-3 py-2 cursor-pointer hover:bg-gray-100 flex items-center justify-between ${
                    isSelected ? 'bg-blue-50 text-blue-600' : ''
                  }`}
                  onClick={() => handleSelect(itemValue)}
                >
                  <span
                    className="truncate max-w-[400px] block"
                    title={itemTitle}
                  >
                    {itemTitle.length > 100 ? itemTitle.slice(0, 100) + '...' : itemTitle}
                  </span>
                  {isSelected && (
                    <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
              );
            })}
            {loadingMore && <div className="px-3 py-2 text-gray-500">Loading more...</div>}
            {!hasMore && data.length > 0 && <div className="px-3 py-2 text-gray-400">No more options</div>}
          </div>
        )}
      </div>

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
