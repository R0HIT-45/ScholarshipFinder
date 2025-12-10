"use client";
import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export default function ApplyPage() {
  const router = useRouter();
  const params = useParams();
  const [formData, setFormData] = useState({
    studentName: "",
    email: "",
    essay: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("accessToken");
    let userId: number | undefined;
    if (token) {
      try {
        const profileRes = await fetch(`${API_BASE}/auth/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (profileRes.ok) {
          const me = await profileRes.json();
          userId = me.id;
        }
      } catch (err) {
        console.error(err);
      }
    }

    const response = await fetch(`${API_BASE}/scholarships/apply`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        scholarshipId: Number(params.id),
        userId,
        ...formData,
      }),
    });

    if (response.ok) {
      toast.success("Application submitted successfully");
      router.push("/");
    } else {
      toast.error("Error submitting application.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col justify-center items-center p-4 sm:p-6">
      {/* Back Link */}
      <div className="w-full max-w-2xl mb-4 sm:mb-6">
        <Link href="/" className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 flex items-center transition">
          ← Back to Scholarships
        </Link>
      </div>

      <div className="bg-white dark:bg-slate-800 p-6 sm:p-10 rounded-2xl shadow-xl w-full max-w-2xl border border-gray-100 dark:border-white/10">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2 text-slate-800 dark:text-white">Scholarship Application</h1>
        <p className="text-slate-700 dark:text-slate-300 mb-6 sm:mb-8 border-b dark:border-white/10 pb-4 sm:pb-6 font-medium">Please complete the form below accurately.</p>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {/* Name */}
            <div>
              <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">Full Name</label>
              <input
                required
                type="text"
                value={formData.studentName}
                className="w-full p-3 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white dark:focus:bg-slate-600 transition outline-none text-gray-900 dark:text-white"
                placeholder="John Doe"
                onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">Email Address</label>
              <input
                required
                type="email"
                value={formData.email}
                className="w-full p-3 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white dark:focus:bg-slate-600 transition outline-none text-gray-900 dark:text-white"
                placeholder="john@example.com"
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
          </div>

          {/* Essay */}
          <div>
            <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
              Why do you deserve this scholarship?
              <span className="text-slate-500 dark:text-slate-400 font-normal ml-2">(Min 100 words)</span>
            </label>
            <textarea
              required
              value={formData.essay}
              className="w-full p-4 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white dark:focus:bg-slate-600 transition outline-none h-40 resize-y text-gray-900 dark:text-white"
              placeholder="Start typing your essay here..."
              onChange={(e) => setFormData({ ...formData, essay: e.target.value })}
            ></textarea>
          </div>

          {/* Submit */}
          <div className="pt-4">
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 sm:py-4 rounded-lg font-bold text-base sm:text-lg hover:bg-blue-700 dark:hover:bg-blue-500 transition shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Submit Application
            </button>
            <p className="text-center text-sm text-slate-600 dark:text-slate-400 mt-4 font-medium">
              By clicking Submit, you agree to our Terms of Service and Privacy Policy.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}