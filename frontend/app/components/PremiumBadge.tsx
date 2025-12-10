'use client';

import { ReactNode } from 'react';

interface PremiumBadgeProps {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
  className?: string;
}

export default function PremiumBadge({ 
  children, 
  variant = 'primary',
  className = ''
}: PremiumBadgeProps) {
  const baseClasses = "inline-flex items-center px-3 py-1 rounded-full text-xs font-bold";
  
  const variantClasses = {
    primary: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    secondary: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
    success: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    warning: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200",
    danger: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
  };
  
  return (
    <span className={`${baseClasses} ${variantClasses[variant]} ${className}`}>
      {children}
    </span>
  );
}