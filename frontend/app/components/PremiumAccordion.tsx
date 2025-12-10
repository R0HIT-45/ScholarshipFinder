'use client';

import { ReactNode, useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface PremiumAccordionProps {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
}

export default function PremiumAccordion({ 
  title, 
  children, 
  defaultOpen = false
}: PremiumAccordionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="card-premium mb-4">
      <button
        className="flex justify-between items-center w-full p-6 text-left"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-lg font-medium text-gray-900 dark:text-white">
          {title}
        </span>
        <ChevronDown 
          className={`transform transition-transform ${isOpen ? 'rotate-180' : ''}`} 
          size={20} 
        />
      </button>
      
      {isOpen && (
        <div className="px-6 pb-6 pt-2 border-t border-white/20 dark:border-slate-700/50">
          {children}
        </div>
      )}
    </div>
  );
}