'use client';

import { Filter, Search } from 'lucide-react';
import { useState } from 'react';

interface PremiumSearchBarProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  placeholder?: string;
  showFilterIcon?: boolean;
}

export default function PremiumSearchBar({
  searchTerm,
  onSearchChange,
  placeholder = "Search...",
  showFilterIcon = true
}: PremiumSearchBarProps) {
  return (
    <div className="relative flex-1 max-w-2xl">
      <div className="relative">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={placeholder}
          className="input-premium py-4 pl-12 pr-4 w-full"
        />
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" size={20} />
        {showFilterIcon && (
          <Filter className="absolute right-4 top-1/2 -translate-y-1/2 text-blue-600 dark:text-blue-400" size={20} />
        )}
      </div>
    </div>
  );
}