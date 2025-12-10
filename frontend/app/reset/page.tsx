"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [form, setForm] = useState({ token: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch(`${API_BASE}/auth/reset-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (res.ok) {
      toast.success("Password reset. Please login.");
      router.push("/login");
    } else {
      toast.error(data.message || "Reset failed");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-950 p-6">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-gray-100 dark:border-white/10 p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold mb-2 text-slate-900 dark:text-white">Reset password</h1>
        <p className="text-sm text-gray-500 dark:text-gray-300 mb-4">Paste the reset token and choose a new password.</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-1">Token</label>
            <input
              required
              className="w-full p-3 rounded-lg bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-white/10 outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e) => setForm({ ...form, token: e.target.value })}
              placeholder="Reset token"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">New password</label>
            <input
              required
              minLength={6}
              type="password"
              className="w-full p-3 rounded-lg bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-white/10 outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="At least 6 characters"
            />
          </div>
          <button disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition disabled:opacity-60">
            {loading ? "Updating..." : "Reset password"}
          </button>
        </form>
      </div>
    </div>
  );
}




