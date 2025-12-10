'use client';

import { SelectHTMLAttributes, forwardRef } from 'react';

interface PremiumSelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  error?: string;
}

const PremiumSelect = forwardRef<HTMLSelectElement, PremiumSelectProps>(({
  error,
  className = '',
  children,
  ...props
}, ref) => {
  const baseClasses = "input-premium";
  const errorClasses = error ? "border-red-500" : "";
  
  return (
    <div className="relative">
      <select
        ref={ref}
        className={`${baseClasses} ${errorClasses} ${className}`}
        {...props}
      >
        {children}
      </select>
      {error && (
        <p className="mt-1 text-sm text-red-600 dark:text-red-500">{error}</p>
      )}
    </div>
  );
});

PremiumSelect.displayName = 'PremiumSelect';

export default PremiumSelect;