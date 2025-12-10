'use client';

import { useState } from 'react';

interface PremiumFilterProps {
  onFilterChange: (filters: {
    minAmount?: string;
    maxAmount?: string;
    deadlineBefore?: string;
  }) => void;
  initialFilters?: {
    minAmount?: string;
    maxAmount?: string;
    deadlineBefore?: string;
  };
}

export default function PremiumFilter({ 
  onFilterChange,
  initialFilters = {}
}: PremiumFilterProps) {
  const [minAmount, setMinAmount] = useState(initialFilters.minAmount || '');
  const [maxAmount, setMaxAmount] = useState(initialFilters.maxAmount || '');
  const [deadlineBefore, setDeadlineBefore] = useState(initialFilters.deadlineBefore || '');

  const handleApply = () => {
    onFilterChange({
      minAmount: minAmount || undefined,
      maxAmount: maxAmount || undefined,
      deadlineBefore: deadlineBefore || undefined
    });
  };

  const handleReset = () => {
    setMinAmount('');
    setMaxAmount('');
    setDeadlineBefore('');
    onFilterChange({});
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Min Amount ($)
        </label>
        <input
          type="number"
          min={0}
          value={minAmount}
          onChange={(e) => setMinAmount(e.target.value)}
          placeholder="0"
          className="input-premium px-4 py-3"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Max Amount ($)
        </label>
        <input
          type="number"
          min={0}
          value={maxAmount}
          onChange={(e) => setMaxAmount(e.target.value)}
          placeholder="Any"
          className="input-premium px-4 py-3"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Deadline Before
        </label>
        <input
          type="date"
          value={deadlineBefore}
          onChange={(e) => setDeadlineBefore(e.target.value)}
          className="input-premium px-4 py-3"
        />
      </div>
      
      <div className="md:col-span-3 flex gap-3 pt-2">
        <button
          onClick={handleApply}
          className="btn-premium px-6 py-3"
        >
          Apply Filters
        </button>
        <button
          onClick={handleReset}
          className="btn-premium-outline px-6 py-3"
        >
          Reset
        </button>
      </div>
    </div>
  );
}