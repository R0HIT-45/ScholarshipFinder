'use client';

import Link from 'next/link';
import { BookmarkPlus, Share2 } from 'lucide-react';
import { toast } from 'sonner';
import PremiumBadge from './PremiumBadge';

interface Scholarship {
  id: number;
  title: string;
  description: string;
  amount: string;
  deadline: string;
  [key: string]: any; // Allow additional properties
}

interface PremiumScholarshipCardProps {
  scholarship: Scholarship;
  showActions?: boolean;
}

export default function PremiumScholarshipCard({ 
  scholarship, 
  showActions = true 
}: PremiumScholarshipCardProps) {
  const handleSave = () => {
    try {
      const raw = localStorage.getItem('savedScholarships') || '[]';
      const arr = JSON.parse(raw) as any[];
      if (!arr.find((it) => it.id === scholarship.id)) {
        arr.push({ ...scholarship, status: 'Planned' });
        localStorage.setItem('savedScholarships', JSON.stringify(arr));
        toast.success('Saved to wishlist');
      } else {
        toast.info('Already saved to wishlist');
      }
    } catch {
      toast.error('Unable to save');
    }
  };

  const handleShare = async () => {
    const url = `${location.origin}/apply/${scholarship.id}`;
    const text = `${scholarship.title} – ${scholarship.amount} – Deadline ${scholarship.deadline}`;
    
    if (navigator.share) {
      try {
        await navigator.share({ title: scholarship.title, text, url });
        return;
      } catch {
        // Fall back to WhatsApp if share fails
      }
    }
    
    const wa = `https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`;
    window.open(wa, '_blank');
  };

  return (
    <div className="card-premium overflow-hidden group relative">
      {/* Gradient top border with shimmer effect */}
      <div className="h-1.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-t-3xl"></div>
      
      <div className="p-8 flex-grow flex flex-col">
        <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 transition-all duration-300">
          {scholarship.title}
        </h3>
        
        <p className="text-slate-700 dark:text-slate-300 text-base mb-6 line-clamp-3 flex-grow font-medium leading-relaxed">
          {scholarship.description}
        </p>

        <div className="space-y-3 mb-8">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 rounded-xl">
              <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z"/>
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd"/>
              </svg>
            </div>
            <p className="text-4xl font-black bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 dark:from-green-400 dark:via-emerald-400 dark:to-teal-400 bg-clip-text text-transparent">
              {scholarship.amount}
            </p>
          </div>
          
          <div className="flex items-center gap-3 p-3 bg-slate-100 dark:bg-slate-800/50 rounded-xl">
            <div className="p-2 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-lg">
              <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
            </div>
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wide">Deadline</p>
              <p className="text-slate-900 dark:text-white font-bold text-sm">{scholarship.deadline}</p>
            </div>
          </div>
        </div>

        {showActions && (
          <div className="flex gap-3 mt-auto">
            <Link
              href={`/apply/${scholarship.id}`}
              className="flex-1 text-center btn-premium text-base py-4"
            >
              Apply Now →
            </Link>
            <button
              onClick={handleSave}
              className="px-4 py-4 rounded-xl border-2 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-gradient-to-br hover:from-blue-500 hover:to-purple-500 hover:text-white hover:border-transparent transition-all duration-300 transform hover:scale-105 active:scale-95"
              aria-label="Save scholarship"
              type="button"
              title="Save to wishlist"
            >
              <BookmarkPlus size={20} strokeWidth={2.5} />
            </button>
            <button
              onClick={handleShare}
              className="px-4 py-4 rounded-xl border-2 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-gradient-to-br hover:from-pink-500 hover:to-rose-500 hover:text-white hover:border-transparent transition-all duration-300 transform hover:scale-105 active:scale-95"
              aria-label="Share scholarship"
              type="button"
              title="Share with friends"
            >
              <Share2 size={20} strokeWidth={2.5} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}