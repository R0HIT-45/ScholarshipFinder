"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export default function CreateScholarship() {
  const router = useRouter();
  const [form, setForm] = useState({
    title: "",
    amount: "",
    deadline: "",
    description: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const token = localStorage.getItem("accessToken");
    if (!token) {
      router.push("/login");
      setIsSubmitting(false);
      return;
    }
    
    try {
      const res = await fetch(`${API_BASE}/scholarships`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        toast.success("Scholarship created!");
        router.push("/");
      } else {
        const data = await res.json();
        toast.error(data.message || "Failed to create scholarship.");
      }
    } catch (error) {
      toast.error("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-8 flex justify-center items-start pt-16">
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-slate-900 dark:bg-slate-950 p-4 sm:p-6 flex justify-between items-center">
          <h1 className="text-xl sm:text-2xl font-bold text-white">Create New Scholarship</h1>
          <Link href="/admin" className="text-gray-300 hover:text-white text-sm transition">
            Cancel
          </Link>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-8 space-y-4 sm:space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-bold text-slate-900 dark:text-white mb-2">Scholarship Title</label>
            <input
              required
              type="text"
              value={form.title}
              className="w-full p-3 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition"
              placeholder="e.g. Women in Tech Grant"
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {/* Amount */}
            <div>
              <label className="block text-sm font-bold text-slate-900 dark:text-white mb-2">Grant Amount</label>
              <input
                required
                type="text"
                value={form.amount}
                className="w-full p-3 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition"
                placeholder="e.g. $5,000"
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
              />
            </div>
            
            {/* Deadline */}
            <div>
              <label className="block text-sm font-bold text-slate-900 dark:text-white mb-2">Deadline</label>
              <input
                required
                type="date"
                value={form.deadline}
                className="w-full p-3 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition"
                onChange={(e) => setForm({ ...form, deadline: e.target.value })}
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-bold text-slate-900 dark:text-white mb-2">Description</label>
            <textarea
              required
              rows={5}
              value={form.description}
              className="w-full p-3 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition resize-y"
              placeholder="Describe eligibility, requirements, and details..."
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            ></textarea>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 text-white font-bold py-3 sm:py-4 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-500 transition shadow-lg transform hover:-translate-y-0.5 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Publishing...' : 'Publish Scholarship'}
          </button>
        </form>
      </div>
    </div>
  );
}