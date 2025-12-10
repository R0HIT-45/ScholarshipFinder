'use client';

import { ReactNode } from 'react';

interface PremiumStatCardProps {
  title: string;
  value: string | number;
  icon?: ReactNode;
  valueClass?: string;
}

export default function PremiumStatCard({ 
  title, 
  value, 
  icon,
  valueClass = "text-4xl font-bold text-slate-900 dark:text-white"
}: PremiumStatCardProps) {
  return (
    <div className="stat-card">
      <div className="flex items-center gap-4">
        {icon && (
          <div className="p-3 rounded-xl bg-white/50 dark:bg-slate-700/50">
            {icon}
          </div>
        )}
        <div>
          <p className="text-sm text-slate-700 dark:text-slate-200 mb-2 font-semibold uppercase tracking-wide">{title}</p>
          <p className={valueClass}>{value}</p>
        </div>
      </div>
    </div>
  );
}