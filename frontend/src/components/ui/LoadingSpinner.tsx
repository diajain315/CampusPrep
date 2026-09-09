import React from 'react';

export interface LoadingSpinnerProps {
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  label = 'Loading placement intelligence...',
  size = 'md',
  className = '',
}) => {
  const sizeMap = {
    sm: 'w-4 h-4 border-2',
    md: 'w-6 h-6 border-2',
    lg: 'w-8 h-8 border-3',
  };

  return (
    <div
      className={`flex flex-col items-center justify-center p-8 gap-3 text-slate-500 ${className}`}
      role="status"
      aria-live="polite"
    >
      <div
        className={`${sizeMap[size]} border-brand-200 border-t-brand-600 rounded-full animate-spin`}
      />
      {label && <span className="text-xs font-medium text-slate-500">{label}</span>}
      <span className="sr-only">{label}</span>
    </div>
  );
};
