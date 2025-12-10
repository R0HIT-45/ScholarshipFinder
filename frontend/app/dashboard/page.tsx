"use client";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { CheckCircle, Clock, FileText } from "lucide-react";
import PremiumStatCard from "@/app/components/PremiumStatCard";
import PremiumSectionHeader from "@/app/components/PremiumSectionHeader";
import PremiumCard from "@/app/components/PremiumCard";

interface Application {
  id: number;
  scholarshipId: number;
  studentName: string;
  email: string;
  status: string;
  createdAt: string;
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export default function DashboardPage() {
  const router = useRouter();
  const [apps, setApps] = useState<Application[]>([]);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) { router.push("/login"); return; }

    fetch(`${API_BASE}/scholarships/applications/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => {
        if (res.status === 401) {
          router.push("/login");
        }
        return res.json();
      })
      .then(setApps)
      .catch(() => toast.error("Could not load your applications"));
  }, [router]);

  const summary = useMemo(() => {
    const total = apps.length;
    const approved = apps.filter(a => a.status === "Approved").length;
    const pending = apps.filter(a => a.status === "Pending").length;
    return { total, approved, pending };
  }, [apps]);

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8 bg-white dark:bg-gray-900 min-h-screen">
      <PremiumSectionHeader 
        title="My Dashboard" 
        subtitle="Track your submissions and status in real time."
        action={
          <Link href="/" className="btn-premium whitespace-nowrap">Browse Scholarships</Link>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <PremiumStatCard 
          title="Total Applications" 
          value={summary.total} 
          icon={<FileText className="text-blue-600 dark:text-blue-400" size={24} />}
        />
        <PremiumStatCard 
          title="Pending" 
          value={summary.pending} 
          icon={<Clock className="text-amber-500 dark:text-amber-400" size={24} />}
          valueClass="text-3xl font-bold text-amber-600"
        />
        <PremiumStatCard 
          title="Approved" 
          value={summary.approved} 
          icon={<CheckCircle className="text-green-500 dark:text-green-400" size={24} />}
          valueClass="text-3xl font-bold text-green-600"
        />
      </div>

      <PremiumCard 
        header={
          <div className="flex items-center justify-between p-6">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Recent Activity</h2>
            <span className="text-xs text-slate-700 dark:text-slate-300 bg-white/50 dark:bg-slate-700/50 px-3 py-1.5 rounded-full font-semibold">{apps.length} total</span>
          </div>
        }
      >
        <div className="divide-y divide-white/20 dark:divide-slate-700/50">
          {apps.map(app => (
            <div key={app.id} className="py-4 flex items-center justify-between hover:bg-white/20 dark:hover:bg-slate-700/20 transition-colors">
              <div>
                <p className="font-semibold text-slate-900 dark:text-white">Application #{app.id}</p>
                <p className="text-slate-600 dark:text-slate-400 text-sm mt-1 font-medium">Submitted on {new Date(app.createdAt).toLocaleDateString()}</p>
              </div>
              <span className={`px-3 py-1 text-xs font-bold rounded-full ${
                app.status === "Approved" ? "bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300" :
                app.status === "Rejected" ? "bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300" :
                "bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300"
              }`}>
                {app.status}
              </span>
            </div>
          ))}
          {!apps.length && (
            <div className="py-8 text-center text-slate-700 dark:text-slate-300">
              <p className="mb-2 font-semibold text-lg">No applications yet.</p>
              <p className="font-medium">Start by applying to a scholarship!</p>
            </div>
          )}
        </div>
      </PremiumCard>
    </div>
  );
}


