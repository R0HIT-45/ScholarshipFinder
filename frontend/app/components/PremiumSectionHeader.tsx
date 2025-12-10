'use client';

import { ReactNode } from 'react';

interface PremiumSectionHeaderProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  className?: string;
}

export default function PremiumSectionHeader({ 
  title, 
  subtitle, 
  action,
  className = ""
}: PremiumSectionHeaderProps) {
  return (
    <div className={`flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 ${className}`}>
      <div>
        <h2 className="section-header mb-2">{title}</h2>
        {subtitle && (
          <p className="text-gray-600 dark:text-gray-400">{subtitle}</p>
        )}
      </div>
      {action}
    </div>
  );
}