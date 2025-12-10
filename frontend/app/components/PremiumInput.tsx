'use client';

import { InputHTMLAttributes, forwardRef } from 'react';

interface PremiumInputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  icon?: React.ReactNode;
}

const PremiumInput = forwardRef<HTMLInputElement, PremiumInputProps>(({
  error,
  icon,
  className = '',
  ...props
}, ref) => {
  const baseClasses = "input-premium";
  const errorClasses = error ? "border-red-500" : "";
  
  return (
    <div className="relative">
      <input
        ref={ref}
        className={`${baseClasses} ${errorClasses} ${className}`}
        {...props}
      />
      {icon && (
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          {icon}
        </div>
      )}
      {error && (
        <p className="mt-1 text-sm text-red-600 dark:text-red-500">{error}</p>
      )}
    </div>
  );
});

PremiumInput.displayName = 'PremiumInput';

export default PremiumInput;