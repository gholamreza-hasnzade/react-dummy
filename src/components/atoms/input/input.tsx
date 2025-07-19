import React, { useState } from "react";
import type { InputHTMLAttributes } from "react";

type Size = "sm" | "md" | "lg";

type InputProps = {
  id: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  helperText?: string;
  required?: boolean;
  type?: string;
  placeholder?: string;
  className?: string;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  onIconLeftClick?: () => void;
  onIconRightClick?: () => void;
  readOnly?: boolean;
  size?: Size;
  fullWidth?: boolean;
} & Omit<
  InputHTMLAttributes<HTMLInputElement>,
  | "value"
  | "onChange"
  | "id"
  | "type"
  | "required"
  | "readOnly"
  | "placeholder"
  | "className"
  | "size"
>;

export const Input = ({
  id,
  label,
  value,
  onChange,
  error,
  helperText,
  required = false,
  type = "text",
  placeholder,
  iconLeft,
  iconRight,
  onIconLeftClick,
  onIconRightClick,
  readOnly = false,
  size = "md",
  fullWidth = false,
  className,
  ...rest
}: InputProps) => {
  const [isFocused, setIsFocused] = useState(false);

  const errorClasses = error ? "border-red-500 text-red-500" : "";
  const focusClasses = isFocused
    ? "border-blue-500 ring-1 ring-blue-200"
    : "border-gray-300";

  const sizeClasses = {
    sm: "text-sm px-2 py-1",
    md: "text-base px-3 py-2",
    lg: "text-lg px-4 py-3",
  };

  const widthClass = fullWidth ? "w-full" : "";

  const inputPaddingClasses = [
    iconLeft ? "pl-10" : "pl-5",
    iconRight ? "pr-10" : "pr-5",
    sizeClasses[size],
  ].join(" ");

  const readOnlyClasses = readOnly
    ? "bg-gray-200 cursor-not-allowed text-gray-500"
    : "";

  return (
    <div className={`relative ${widthClass}`}>
      <label
        htmlFor={id}
        className={`block text-sm font-medium text-gray-700 ${
          required ? "after:content-['*'] after:text-red-500" : ""
        }`}
      >
        {label}
      </label>

      <div className={`relative ${widthClass}`}>
        {iconLeft && (
          <span
            onClick={onIconLeftClick}
            className="absolute left-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
          >
            {iconLeft}
          </span>
        )}

        <input
          type={type}
          id={id}
          name={id}
          value={value}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          required={required}
          readOnly={readOnly}
          className={`mt-1 block w-full ${inputPaddingClasses} border rounded-md  focus:outline-none ${focusClasses} ${errorClasses} placeholder:text-gray-400 ${readOnlyClasses} ${
            className || ""
          }`}
          {...rest}
        />

        {iconRight && (
          <span
            onClick={onIconRightClick}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
          >
            {iconRight}
          </span>
        )}
      </div>

      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}

      {helperText && !error && (
        <p className="mt-1 text-xs text-gray-500">{helperText}</p>
      )}
    </div>
  );
};
