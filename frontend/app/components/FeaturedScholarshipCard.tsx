'use client';

import Link from 'next/link';
import PremiumBadge from './PremiumBadge';

interface Scholarship {
  id: number;
  title: string;
  description: string;
  amount: string;
  deadline: string;
  [key: string]: any; // Allow additional properties
}

interface FeaturedScholarshipCardProps {
  scholarship: Scholarship;
}

export default function FeaturedScholarshipCard({ scholarship }: FeaturedScholarshipCardProps) {
  return (
    <div className="card-premium p-6 flex flex-col group">
      <div className="flex justify-between items-start mb-4">
        <h3 className="font-bold text-slate-900 dark:text-white line-clamp-2 text-lg group-hover:text-blue-600 transition-colors">
          {scholarship.title}
        </h3>
        <PremiumBadge variant="secondary">Featured</PremiumBadge>
      </div>
      <p className="text-2xl font-extrabold bg-gradient-to-r from-green-600 to-emerald-500 bg-clip-text text-transparent mb-2">
        {scholarship.amount}
      </p>
      <p className="text-sm text-slate-700 dark:text-slate-300 mb-4 flex items-center font-medium">
        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
        </svg>
        Deadline: <span className="font-semibold">{scholarship.deadline}</span>
      </p>
      <Link 
        href={`/apply/${scholarship.id}`} 
        className="mt-auto inline-block text-center btn-premium text-sm"
      >
        Apply Now
      </Link>
    </div>
  );
}