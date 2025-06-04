import { ReactNode } from 'react';

interface BadgeProps {
  children: ReactNode;
  variant?: 'text' | 'contained';
  color?: 'default' | 'success' | 'error' | 'warning' | 'info';
}

const colorClasses = {
  default: {
    text: 'text-gray-600 bg-gray-100',
    contained: 'bg-gray-100 text-gray-800',
  },
  success: {
    text: 'text-green-600 bg-green-100',
    contained: 'bg-green-100 text-green-800',
  },
  error: {
    text: 'text-red-600 bg-red-100',
    contained: 'bg-red-100 text-red-800',
  },
  warning: {
    text: 'text-yellow-600 bg-yellow-100',
    contained: 'bg-yellow-100 text-yellow-800',
  },
  info: {
    text: 'text-blue-600 bg-blue-100',
    contained: 'bg-blue-100 text-blue-800',
  },
};

export const Badge = ({ children, variant = 'text', color = 'default' }: BadgeProps) => {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
        colorClasses[color][variant]
      }`}
    >
      {children}
    </span>
  );
}; 