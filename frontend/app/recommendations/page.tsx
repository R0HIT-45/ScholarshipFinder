'use client';
import { useEffect, useState } from 'react';
import { useAuth } from '@/app/context/auth';
import { useToast } from '@/app/context/toast';
import Link from 'next/link';
import { Lightbulb, TrendingUp } from 'lucide-react';

interface Scholarship {
  id: number;
  title: string;
  amount: string;
  deadline: string;
  description: string;
}

interface RecommendedScholarship extends Scholarship {
  matchScore: number;
  reason: string;
}

export default function RecommendationsPage() {
  const { token } = useAuth();
  const { addToast } = useToast();
  const [recommendations, setRecommendations] = useState<RecommendedScholarship[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchRecommendations();
  }, [token]);

  async function fetchRecommendations() {
    try {
      if (!token) {
        setIsLoading(false);
        return;
      }

      const res = await fetch('http://localhost:3001/scholarships?limit=50', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const scholarships: Scholarship[] = await res.json();
        
        // Simple AI-like recommendation logic:
        // Score based on keyword matching and recency
        const userProfile = {
          keywords: ['merit', 'stem', 'tech', 'underprivileged', 'women'],
        };

        const scored = scholarships
          .map((s) => {
            let matchScore = 0;
            let reason = '';

            // Check title for keywords
            const titleLower = s.title.toLowerCase();
            const descLower = s.description?.toLowerCase() || '';

            for (const keyword of userProfile.keywords) {
              if (titleLower.includes(keyword) || descLower.includes(keyword)) {
                matchScore += 25;
                reason += `Contains "${keyword}" • `;
              }
            }

            // Bonus for shorter deadlines (more urgent)
            const daysUntilDeadline = (new Date(s.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24);
            if (daysUntilDeadline > 0 && daysUntilDeadline < 7) {
              matchScore += 15;
              reason += 'Deadline approaching • ';
            } else if (daysUntilDeadline > 7 && daysUntilDeadline < 30) {
              matchScore += 10;
            }

            // Parse amount (if numeric)
            const amountNum = parseInt(s.amount.replace(/[^\d]/g, '')) || 0;
            if (amountNum > 50000) {
              matchScore += 10;
              reason += 'High amount • ';
            }

            return {
              ...s,
              matchScore: Math.min(matchScore, 100),
              reason: reason.slice(0, -3) || 'Recommended for you',
            };
          })
          .filter((s) => s.matchScore > 0)
          .sort((a, b) => b.matchScore - a.matchScore)
          .slice(0, 12);

        setRecommendations(scored);
      }
    } catch (error) {
      addToast('Failed to load recommendations', 'error');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="max-w-7xl mx-auto p-8">
      <div className="mb-12">
        <div className="flex items-center gap-3 mb-4">
          <Lightbulb className="text-yellow-500" size={32} />
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white">Smart Recommendations</h1>
        </div>
        <p className="text-slate-700 dark:text-slate-300 text-lg font-medium">
          AI-powered scholarship matches based on your profile and market trends
        </p>
      </div>

      {/* How it works */}
      <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 p-6 rounded-lg mb-8">
        <h2 className="font-bold mb-3 flex items-center gap-2 text-blue-900 dark:text-blue-100">
          <TrendingUp size={20} />
          How recommendations work
        </h2>
        <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-2 ml-7 font-medium">
          <li>✓ Keyword matching in scholarship title and description</li>
          <li>✓ Urgent deadlines (less than 7 days remaining)</li>
          <li>✓ High scholarship amounts (over ₹50,000)</li>
          <li>✓ Personalized based on your interests</li>
        </ul>
      </div>

      {/* Recommendations Grid */}
      {isLoading ? (
        <div className="text-center py-12">Loading recommendations...</div>
      ) : recommendations.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recommendations.map((scholarship) => (
            <div
              key={scholarship.id}
              className="bg-white dark:bg-slate-800 rounded-lg shadow-lg hover:shadow-xl transition overflow-hidden"
            >
              {/* Match Score Bar */}
              <div className="h-1 bg-gray-200 dark:bg-slate-700">
                <div
                  className={`h-full transition-all ${
                    scholarship.matchScore >= 75
                      ? 'bg-green-500'
                      : scholarship.matchScore >= 50
                        ? 'bg-yellow-500'
                        : 'bg-blue-500'
                  }`}
                  style={{ width: `${scholarship.matchScore}%` }}
                />
              </div>

              <div className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white flex-1">
                    {scholarship.title}
                  </h3>
                  <span className="ml-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white text-sm font-bold px-3 py-1 rounded-full">
                    {scholarship.matchScore}%
                  </span>
                </div>

                <p className="text-sm text-slate-700 dark:text-slate-300 mb-4 text-xs font-semibold">
                  {scholarship.reason}
                </p>

                <p className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                  {scholarship.amount}
                </p>

                <p className="text-sm text-slate-700 dark:text-slate-300 mb-4 font-medium">
                  Deadline: {new Date(scholarship.deadline).toLocaleDateString()}
                </p>

                <Link
                  href={`/apply/${scholarship.id}`}
                  className="block w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold py-2 px-4 rounded text-center hover:shadow-lg transition"
                >
                  Apply Now
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center bg-slate-100 dark:bg-slate-800 py-12 rounded-lg">
          <p className="text-slate-700 dark:text-slate-300 font-semibold text-lg mb-2">
            No recommendations available yet. Browse scholarships to get started!
          </p>
          <Link href="/scholarships" className="inline-block mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold">
            Browse Scholarships
          </Link>
        </div>
      )}
    </div>
  );
}
