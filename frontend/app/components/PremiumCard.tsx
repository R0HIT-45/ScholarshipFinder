'use client';

import { ReactNode } from 'react';

interface PremiumCardProps {
  children: ReactNode;
  className?: string;
  header?: ReactNode;
  footer?: ReactNode;
}

export default function PremiumCard({ 
  children, 
  className = "", 
  header, 
  footer 
}: PremiumCardProps) {
  return (
    <div className={`card-premium overflow-hidden ${className}`}>
      {header && (
        <div className="border-b border-white/20 dark:border-slate-700/50">
          {header}
        </div>
      )}
      <div className="p-6">
        {children}
      </div>
      {footer && (
        <div className="border-t border-white/20 dark:border-slate-700/50">
          {footer}
        </div>
      )}
    </div>
  );
}