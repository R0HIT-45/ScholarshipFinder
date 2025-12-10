"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { ArrowUpDown } from "lucide-react";
import PremiumScholarshipCard from "@/app/components/PremiumScholarshipCard";
import FeaturedScholarshipCard from "@/app/components/FeaturedScholarshipCard";
import PremiumSearchBar from "@/app/components/PremiumSearchBar";
import PremiumStatCard from "@/app/components/PremiumStatCard";
import PremiumSectionHeader from "@/app/components/PremiumSectionHeader";
import PremiumLoadingSpinner from "@/app/components/PremiumLoadingSpinner";
import PremiumFeatures from "@/app/components/PremiumFeatures";
import PremiumTestimonials from "@/app/components/PremiumTestimonials";

interface Scholarship {
  id: number;
  title: string;
  description: string;
  amount: string;
  deadline: string;
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export default function Home() {
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"createdAt" | "deadline">("deadline");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    const fetchData = async () => {
      try {
        const params = new URLSearchParams({
          search: searchTerm,
          limit: "100",
        });
        // Many backends support 'deadline' but not 'createdAt'. Only send if deadline selected.
        if (sortBy === "deadline") params.set("sortBy", "deadline");
        // Cache buster to ensure latest list after seeding
        params.set("_ts", String(Date.now()));
        const res = await fetch(`${API_BASE}/scholarships?${params.toString()}`, { signal: controller.signal });
        const data = await res.json();
        const list = Array.isArray(data) ? data : (Array.isArray((data as any)?.items) ? (data as any).items : []);
        setScholarships(list);
      } catch (err) {
        toast.error("Unable to load scholarships");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
    return () => controller.abort();
  }, [searchTerm, sortBy]);

  const stats = useMemo(() => {
    const list = Array.isArray(scholarships) ? scholarships : [];
    const total = list.length;
    const closingSoon = list.filter((s) => new Date(s.deadline) < new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)).length;
    return { total, closingSoon };
  }, [scholarships]);

  const featured = useMemo(() => {
    const list = Array.isArray(scholarships) ? scholarships : [];
    return list.slice(0, 4);
  }, [scholarships]);

  return (
    <main className="min-h-screen font-sans bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-blue-950 dark:to-indigo-950">
      <div className="relative bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 dark:from-blue-700 dark:via-indigo-700 dark:to-purple-800 overflow-hidden py-24 px-4 md:py-40">
        {/* Animated floating elements */}
        <div className="absolute top-20 left-10 w-32 h-32 rounded-full bg-white/10 blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-64 h-64 rounded-full bg-purple-500/20 blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 left-1/4 w-40 h-40 rounded-full bg-cyan-400/15 blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-1/3 right-1/3 w-48 h-48 rounded-full bg-pink-400/15 blur-3xl animate-pulse" style={{animationDelay: '1.5s'}}></div>

        <div className="max-w-6xl mx-auto text-center relative z-10 space-y-10">
          <div className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-white/15 backdrop-blur-xl border border-white/30 text-white text-sm font-bold mb-6 shadow-lg">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            ✨ The #1 Platform for Scholarships - Trusted by 10,000+ Students
          </div>
          
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black leading-tight mb-8 text-white tracking-tight">
            Fund Your <span className="relative inline-block">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 via-emerald-300 to-lime-300 drop-shadow-2xl">Future</span>
              <svg className="absolute -bottom-2 left-0 right-0" viewBox="0 0 200 12" xmlns="http://www.w3.org/2000/svg">
                <path d="M0 8 Q50 2, 100 8 T200 8" stroke="#34D399" strokeWidth="3" fill="none" strokeLinecap="round"/>
              </svg>
            </span>
            <br />with <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-300 via-orange-300 to-pink-300">EduEquity</span>
          </h1>
          
          <p className="text-xl md:text-3xl text-white max-w-4xl mx-auto mb-16 font-medium leading-relaxed drop-shadow-lg">
            🎓 Discover scholarships tailored to you. Search, filter, and apply in minutes with our <span className="font-extrabold bg-white/20 px-3 py-1 rounded-lg">AI-powered</span> platform.
          </p>
          
          <div className="flex flex-col md:flex-row gap-6 md:items-center md:justify-center max-w-4xl mx-auto backdrop-blur-xl bg-white/10 p-4 rounded-3xl border border-white/20 shadow-2xl">
            <PremiumSearchBar
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              placeholder="Search by keyword (e.g. Tech, Merit, STEM)"
            />
            <button
              onClick={() => setSortBy(sortBy === "deadline" ? "createdAt" : "deadline")}
              className="btn-premium-outline flex items-center justify-center gap-3 px-8 py-5 bg-white/10 hover:bg-white/20 border-white/40 text-white hover:border-white font-bold text-base whitespace-nowrap"
            >
              <ArrowUpDown size={20} />
              <span>{sortBy === "deadline" ? "Sort: Newest First" : "Sort: Deadline"}</span>
            </button>
          </div>
        </div>
      </div>

      <PremiumFeatures />

      <div className="max-w-7xl mx-auto px-4 py-10">
        {featured.length > 0 && (
          <div className="mb-20">
            <PremiumSectionHeader
              title="Featured Scholarships"
              subtitle="Hand-picked opportunities just for you."
              action={
                <Link href="/scholarships" className="text-blue-600 hover:text-blue-800 font-semibold transition-colors flex items-center gap-1">
                  View all <span className="text-lg">→</span>
                </Link>
              }
            />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {featured.map((s) => (
                <FeaturedScholarshipCard key={s.id} scholarship={s} />
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          <PremiumStatCard
            title="Total opportunities"
            value={stats.total}
          />
          <PremiumStatCard
            title="Closing in 7 days"
            value={stats.closingSoon}
            valueClass="text-4xl font-bold text-amber-500"
          />
          <PremiumStatCard
            title="Active Search"
            value={searchTerm || "All scholarships"}
            valueClass="text-lg font-semibold text-slate-900 dark:text-white capitalize"
          />
        </div>

        <div className="mb-20">
          <PremiumSectionHeader
            title="Available Opportunities"
            subtitle="Explore the full list of funding options."
            action={
              <span className="badge-premium text-sm px-4 py-2">
                {scholarships.length} Results Found
              </span>
            }
          />

          {loading ? (
            <div className="flex justify-center py-20">
              <PremiumLoadingSpinner size="lg" />
            </div>
          ) : scholarships.length ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {scholarships.map((s) => (
                <PremiumScholarshipCard key={s.id} scholarship={s} />
              ))}
            </div>
          ) : (
            <div className="text-center py-24 glass rounded-3xl border border-gray-100 dark:border-white/10 mx-auto max-w-2xl">
              <div className="w-16 h-16 bg-gray-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🔍</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">No scholarships found</h3>
              <p className="text-gray-500 dark:text-gray-400">Try adjusting your search terms or filters to find what you're looking for.</p>
            </div>
          )}
        </div>
      </div>

      <PremiumTestimonials />
    </main>
  );
}