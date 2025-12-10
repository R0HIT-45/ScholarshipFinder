"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

interface Application {
  id: number;
  studentName: string;
  email: string;
  essay: string;
  scholarshipId: number;
  status: string;
}

export default function ViewApplication() {
  const { id } = useParams();
  const router = useRouter();
  const [app, setApp] = useState<Application | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    fetch(`${API_BASE}/scholarships/applications/${id}`, { headers: { Authorization: `Bearer ${token}` }})
      .then((res) => res.json())
      .then((data) => setApp(data));
  }, [id]);

  const [isUpdating, setIsUpdating] = useState(false);

  const updateStatus = async (newStatus: string) => {
    if (isUpdating) return;
    setIsUpdating(true);
    const token = localStorage.getItem("accessToken");
    try {
      const res = await fetch(`${API_BASE}/scholarships/applications/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        toast.success(`Application marked as ${newStatus}`);
        router.push("/admin");
      } else {
        toast.error("Failed to update status");
      }
    } catch (error) {
      toast.error("Network error. Please try again.");
    } finally {
      setIsUpdating(false);
    }
  };

  if (!app) return <div className="p-10 text-center text-gray-500 dark:text-gray-400">Loading application...</div>;

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4 sm:p-8 flex justify-center">
      <div className="bg-white dark:bg-slate-800 max-w-3xl w-full rounded-xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="bg-slate-900 dark:bg-slate-950 text-white p-4 sm:p-6 flex justify-between items-center">
            <h1 className="text-xl sm:text-2xl font-bold">Application Review</h1>
            <Link href="/admin" className="text-gray-300 hover:text-white text-sm transition">Close ✕</Link>
        </div>

        <div className="p-4 sm:p-8">
            {/* Applicant Details */}
            <div className="flex flex-col sm:flex-row justify-between border-b dark:border-white/10 pb-4 sm:pb-6 mb-4 sm:mb-6 gap-4">
                <div>
                    <p className="text-gray-500 dark:text-gray-400 text-sm uppercase font-bold">Applicant</p>
                    <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-white">{app.studentName}</h2>
                    <p className="text-blue-600 dark:text-blue-400">{app.email}</p>
                </div>
                <div className="text-left sm:text-right">
                     <p className="text-gray-500 dark:text-gray-400 text-sm uppercase font-bold">Current Status</p>
                     <span className={`inline-block mt-1 px-3 py-1 rounded-full text-sm font-bold 
                        ${app.status === 'Approved' ? 'bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300' : 
                          app.status === 'Rejected' ? 'bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300' : 
                          'bg-yellow-100 dark:bg-yellow-900/50 text-yellow-700 dark:text-yellow-300'}`}>
                        {app.status}
                     </span>
                </div>
            </div>

            {/* Essay Section */}
            <div className="mb-6 sm:mb-8">
                <h3 className="text-gray-700 dark:text-gray-300 font-bold mb-3 border-l-4 border-blue-500 dark:border-blue-400 pl-3">Statement of Purpose</h3>
                <div className="bg-gray-50 dark:bg-slate-700 p-4 sm:p-6 rounded-lg text-gray-700 dark:text-gray-300 leading-relaxed border border-gray-200 dark:border-slate-600 whitespace-pre-wrap">
                    {app.essay}
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <button 
                    onClick={() => updateStatus('Approved')}
                    disabled={isUpdating || app.status === 'Approved'}
                    className="flex-1 bg-green-600 hover:bg-green-700 dark:hover:bg-green-500 text-white py-3 rounded-lg font-bold transition shadow-md active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isUpdating ? 'Updating...' : 'Approve Application'}
                </button>
                <button 
                    onClick={() => updateStatus('Rejected')}
                    disabled={isUpdating || app.status === 'Rejected'}
                    className="flex-1 bg-white dark:bg-slate-700 border-2 border-red-500 dark:border-red-400 text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 py-3 rounded-lg font-bold transition shadow-sm active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Reject Application
                </button>
            </div>
        </div>
      </div>
    </div>
  );
}