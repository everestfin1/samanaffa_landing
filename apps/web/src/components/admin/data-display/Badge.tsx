import * as React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
  className?: string;
}

const Badge = ({ children, variant = 'default', className = '' }: BadgeProps) => {
  const baseClasses = 'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold';
  
  const variantStyles = {
    default: { bg: '#F8FAFC', text: '#64748B', border: '#E2E8F0' },
    success: { bg: '#F2F8F4', text: '#435933', border: 'rgba(67, 89, 51, 0.12)' },
    warning: { bg: '#FEF9E7', text: '#C38D1C', border: 'rgba(195, 141, 28, 0.12)' },
    danger: { bg: '#FEF2F2', text: '#DC2626', border: 'rgba(220, 38, 38, 0.12)' },
    info: { bg: '#F0F9FF', text: '#0284C7', border: 'rgba(2, 132, 199, 0.12)' },
  };

  const styles = variantStyles[variant];

  return (
    <span 
      className={`${baseClasses} ${className}`}
      style={{ 
        backgroundColor: styles.bg, 
        color: styles.text,
        border: `1px solid ${styles.border}`
      }}
    >
      {children}
    </span>
  );
};

export default Badge;
