'use client';

import { ButtonHTMLAttributes, forwardRef } from 'react';

interface PremiumButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline';
  isLoading?: boolean;
}

const PremiumButton = forwardRef<HTMLButtonElement, PremiumButtonProps>(({
  children,
  variant = 'primary',
  isLoading = false,
  className = '',
  ...props
}, ref) => {
  const baseClasses = "px-6 py-3 rounded-xl font-semibold transition-all duration-300 ease-in-out transform cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variantClasses = variant === 'primary' 
    ? "btn-premium"
    : "btn-premium-outline";
  
  const loadingClasses = isLoading ? "opacity-75 cursor-not-allowed" : "";
  
  return (
    <button
      ref={ref}
      className={`${baseClasses} ${variantClasses} ${loadingClasses} ${className}`}
      {...props}
    >
      {isLoading ? (
        <span className="flex items-center justify-center">
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Loading...
        </span>
      ) : children}
    </button>
  );
});

PremiumButton.displayName = 'PremiumButton';

export default PremiumButton;