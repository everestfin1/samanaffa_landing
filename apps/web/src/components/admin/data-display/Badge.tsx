import * as React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'danger';
}

const Badge = ({ children, variant = 'default' }: BadgeProps) => {
  const baseClasses = 'px-2 py-1 text-xs font-medium rounded-full';
  const variants = {
    default: 'bg-gray-200 text-gray-800',
    success: 'bg-green-200 text-green-800',
    warning: 'bg-yellow-200 text-yellow-800',
    danger: 'bg-red-200 text-red-800',
  };

  return <span className={`${baseClasses} ${variants[variant]}`}>{children}</span>;
};

export default Badge;
