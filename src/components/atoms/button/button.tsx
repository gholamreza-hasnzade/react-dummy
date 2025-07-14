import React from "react";
import { Link, type LinkProps } from "react-router-dom";

type ColorKey =
  | "primary"
  | "secondary"
  | "success"
  | "error"
  | "warning"
  | "info";

type Size = "sm" | "md" | "lg";

type ButtonProps = {
  variant?: "contained" | "outlined" | "text";
  color?: ColorKey;
  loading?: boolean;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  disabled?: boolean;
  fullWidth?: boolean;
  iconOnly?: boolean;
  tooltip?: string;
  to?: LinkProps["to"];
  children?: React.ReactNode;
  type?: "button" | "submit" | "reset";
  size?: Size;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

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

const Spinner = () => (
  <span className="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
);

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "contained",
      color = "primary",
      loading = false,
      startIcon,
      endIcon,
      disabled = false,
      fullWidth = false,
      iconOnly = false,
      tooltip,
      children,
      type = "button",
      to,
      size = "md",
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || loading;
    const colorClasses = colorMap[color]?.[variant];

    const content = loading ? (
      <Spinner />
    ) : iconOnly ? (
      startIcon
    ) : (
      <>
        {startIcon && <span className="mx-2">{startIcon}</span>}
        {children}
        {endIcon && <span className="mx-2">{endIcon}</span>}
      </>
    );
    const sizeClasses = {
      sm: "px-3 py-1.5 text-sm",
      md: "px-4 py-2 text-base",
      lg: "px-5 py-3 text-lg",
    };
    const commonClassNames = [
      "p-1 min-w-[80px] cursor-pointer inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus:outline-none disabled:opacity-50 disabled:pointer-events-none",
      fullWidth && "w-full",
      colorClasses,
      sizeClasses[size],
      isDisabled && "cursor-not-allowed",
    ]
      .filter(Boolean)
      .join(" ");

    const sharedProps = {
      className: commonClassNames,
      title: tooltip,
      "aria-disabled": isDisabled,
      ...props,
    };

    if (to) {
      return (
        <Link to={to} {...sharedProps}>
          {content}
        </Link>
      );
    }

    return (
      <button ref={ref} type={type} disabled={isDisabled} {...sharedProps}>
        {content}
      </button>
    );
  }
);
