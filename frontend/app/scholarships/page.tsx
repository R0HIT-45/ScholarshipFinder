'use client';
import { useEffect, useState } from 'react';
import { useAuth } from '@/app/context/auth';
import { useToast } from '@/app/context/toast';
import Link from 'next/link';
import { Download, Search } from 'lucide-react';
import PremiumScholarshipCard from '@/app/components/PremiumScholarshipCard';
import PremiumSearchBar from '@/app/components/PremiumSearchBar';
import PremiumFilter from '@/app/components/PremiumFilter';
import PremiumSectionHeader from '@/app/components/PremiumSectionHeader';
import PremiumSelect from '@/app/components/PremiumSelect';

interface Scholarship {
  id: number;
  title: string;
  description: string;
  amount: string;
  deadline: string;
}

export default function ScholarshipsPage() {
  const { token } = useAuth();
  const { addToast } = useToast();
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'deadline' | 'amount'>('deadline');
  const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
  const [minAmount, setMinAmount] = useState('');
  const [maxAmount, setMaxAmount] = useState('');
  const [deadlineBefore, setDeadlineBefore] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    fetchScholarships();
  }, [searchTerm, sortBy]);

  async function fetchScholarships() {
    try {
      const params = new URLSearchParams({
        search: searchTerm,
        sortBy,
        limit: '100',
        ...(minAmount ? { minAmount } : {}),
        ...(maxAmount ? { maxAmount } : {}),
        ...(deadlineBefore ? { deadlineBefore } : {}),
      });

      // Cache buster ensures latest data after seeding
      params.set('_ts', String(Date.now()));
      const res = await fetch(`${API_BASE}/scholarships?${params}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      if (res.ok) {
        setScholarships(await res.json());
      }
    } catch (error) {
      addToast('Failed to load scholarships', 'error');
    } finally {
      setIsLoading(false);
    }
  }

  async function handleExportCSV() {
    try {
      if (!token) {
        addToast('Please login to export', 'error');
        return;
      }

      const res = await fetch(`${API_BASE}/scholarships/applications/export`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `scholarships-${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        addToast('Export successful!', 'success');
      }
    } catch (error) {
      addToast('Export failed', 'error');
    }
  }

  async function handleExportPDF() {
    try {
      addToast('PDF export coming soon!', 'info');
    } catch (error) {
      addToast('PDF export not yet available', 'info');
    }
  }

  return (
    <div className="max-w-7xl mx-auto p-8">
      <PremiumSectionHeader 
        title="Scholarships" 
        subtitle="Browse and apply to opportunities"
        action={
          <div className="flex gap-2">
            <button
              onClick={handleExportCSV}
              className="btn-premium-outline flex items-center gap-2"
              title="Export as CSV"
            >
              <Download size={18} />
              CSV
            </button>
            <button
              onClick={handleExportPDF}
              className="btn-premium-outline flex items-center gap-2"
              title="Export as PDF"
            >
              <Download size={18} />
              PDF
            </button>
          </div>
        }
      />

      {/* Filters */}
      <div className="card-premium p-6 mb-8 space-y-6">
        <div className="flex flex-col md:flex-row gap-4">
          <PremiumSearchBar 
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            placeholder="Search scholarships..."
          />
          <PremiumSelect
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'deadline' | 'amount')}
            className="px-4 py-3"
          >
            <option value="deadline">Sort by Deadline</option>
            <option value="amount">Sort by Amount</option>
          </PremiumSelect>
        </div>
        
        <PremiumFilter 
          onFilterChange={({ minAmount, maxAmount, deadlineBefore }) => {
            setMinAmount(minAmount || '');
            setMaxAmount(maxAmount || '');
            setDeadlineBefore(deadlineBefore || '');
          }}
          initialFilters={{
            minAmount,
            maxAmount,
            deadlineBefore
          }}
        />
        
        <div className="pt-4 border-t border-white/20 dark:border-slate-700/50">
          <div className="flex flex-col md:flex-row gap-3 md:items-center">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Subscribe for new scholarships via email"
              className="input-premium flex-1 px-4 py-3"
            />
            <button
              onClick={async () => {
                if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { addToast('Enter a valid email', 'error'); return; }
                try {
                  const res = await fetch(`${API_BASE}/subscriptions`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email }) });
                  if (!res.ok) throw new Error();
                  addToast('Subscribed!', 'success');
                  setEmail('');
                } catch {
                  localStorage.setItem('eduequity:email-subscription', email);
                  addToast('Subscribed locally (offline mode)', 'info');
                  setEmail('');
                }
              }}
              className="btn-premium"
            >
              Subscribe
            </button>
          </div>
        </div>
      </div>

      {/* Scholarships Grid */}
      {isLoading ? (
        <div className="text-center py-12">Loading scholarships...</div>
      ) : scholarships.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {scholarships.map((scholarship) => (
            <PremiumScholarshipCard key={scholarship.id} scholarship={scholarship} />
          ))}
        </div>
      ) : (
        <div className="text-center card-premium py-16 rounded-lg">
          <p className="text-slate-700 dark:text-slate-300 mb-2 font-semibold text-lg">No scholarships found.</p>
          <p className="text-slate-600 dark:text-slate-400 font-medium">Try adjusting your search terms.</p>
        </div>
      )}
    </div>
  );
}
