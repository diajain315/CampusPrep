import React from 'react';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'brand' | 'success' | 'warning' | 'danger' | 'neutral' | 'outline';
  size?: 'sm' | 'md';
  className?: string;
  icon?: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  size = 'md',
  className = '',
  icon,
}) => {
  const sizeStyles = {
    sm: 'px-2 py-0.5 text-[11px]',
    md: 'px-2.5 py-1 text-xs',
  };

  const variantStyles = {
    brand: 'bg-brand-50 text-brand-800 border border-brand-200/80 font-medium',
    success: 'bg-emerald-50 text-emerald-800 border border-emerald-200/80 font-medium',
    warning: 'bg-amber-50 text-amber-900 border border-amber-200/80 font-medium',
    danger: 'bg-rose-50 text-rose-800 border border-rose-200/80 font-medium',
    neutral: 'bg-slate-100 text-slate-700 border border-slate-200 font-medium',
    outline: 'bg-transparent text-slate-700 border border-slate-300 font-medium',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
    >
      {icon}
      {children}
    </span>
  );
};
