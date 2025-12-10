"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Download } from "lucide-react";

// Types
interface Application {
  id: number;
  studentName: string;
  email: string;
  essay: string;
  scholarshipId: number;
  status: string;
}

interface Scholarship {
  id: number;
  title: string;
  amount: string;
  deadline: string;
}

interface Stats {
  totalScholarships: number;
  totalApps: number;
  approvedApps: number;
  pendingApps: number;
}

interface ActivityLog {
  id: number;
  action: string;
  entityType?: string;
  entityId?: number;
  createdAt: string;
}

interface User {
  id: number;
  email: string;
  name: string;
  role: string;
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export default function AdminDashboard() {
  const router = useRouter();
  const [applications, setApplications] = useState<Application[]>([]);
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) { router.push("/login"); return; }
    setToken(accessToken);
    // verify admin
    fetch(`${API_BASE}/auth/profile`, { headers: { Authorization: `Bearer ${accessToken}` }})
      .then(res => res.json())
      .then(me => {
        if (me.role !== "admin") {
          toast.error("Admin access only");
          router.push("/dashboard");
          return;
        }
        refreshAll(accessToken);
      })
      .catch(() => router.push("/login"));
  }, [router]);

  const refreshAll = (authToken: string) => {
    // 1. Get Stats
    fetch(`${API_BASE}/scholarships/stats`, { headers: { Authorization: `Bearer ${authToken}` }}).then(res => res.json()).then(data => setStats(data));
    // 2. Get Apps
    fetch(`${API_BASE}/scholarships/applications`, { headers: { Authorization: `Bearer ${authToken}` }}).then(res => res.json()).then(data => setApplications(data));
    // 3. Get Scholarships (For the delete table)
    fetch(`${API_BASE}/scholarships`, { headers: { Authorization: `Bearer ${authToken}` }}).then(res => res.json()).then(data => setScholarships(data));
    // 4. Logs
    fetch(`${API_BASE}/logs/recent`, { headers: { Authorization: `Bearer ${authToken}` }}).then(res => res.json()).then(setLogs);
    // 5. Users
    fetch(`${API_BASE}/users`, { headers: { Authorization: `Bearer ${authToken}` }}).then(res => res.json()).then(setUsers);
  };

  // Logic: Delete Scholarship
  const handleDeleteScholarship = async (id: number) => {
    if (!token) return;
    if(!confirm("Are you sure? This will delete the scholarship from the website.")) return;
    
    await fetch(`${API_BASE}/scholarships/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
    toast.success("Scholarship deleted");
    refreshAll(token!);
  };

  // Logic: Update Status
  const updateStatus = async (id: number, newStatus: string) => {
    if (!token) return;
    await fetch(`${API_BASE}/scholarships/applications/${id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ status: newStatus }),
    });
    toast.success(`Marked as ${newStatus}`);
    refreshAll(token!);
  };

  const downloadCsv = async () => {
    if (!token) return;
    const res = await fetch(`${API_BASE}/scholarships/applications/export`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "applications.csv";
    a.click();
  };

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    router.push("/login");
  }

  return (
    <div className="max-w-7xl mx-auto p-8 min-h-screen pb-20 bg-white dark:bg-gray-900">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
           <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Admin Dashboard</h1>
           <p className="text-slate-700 dark:text-slate-300 font-medium">Manage your funding platform</p>
        </div>
        <div className="flex gap-4">
          <Link href="/admin/create" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded shadow transition">
            + New Scholarship
          </Link>
          <Link href="/admin/seed" className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded shadow transition">
            Seed Bulk
          </Link>
          <button onClick={handleLogout} className="bg-red-100 text-red-600 hover:bg-red-200 font-bold py-2 px-4 rounded transition">
            Logout
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md border-l-4 border-blue-500">
          <h3 className="text-slate-700 dark:text-slate-300 text-sm font-bold uppercase">Total Scholarships</h3>
          <p className="text-3xl font-bold text-slate-900 dark:text-white">{stats?.totalScholarships || 0}</p>
        </div>
        <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md border-l-4 border-purple-500">
          <h3 className="text-slate-700 dark:text-slate-300 text-sm font-bold uppercase">Total Applications</h3>
          <p className="text-3xl font-bold text-slate-900 dark:text-white">{stats?.totalApps || 0}</p>
        </div>
        <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md border-l-4 border-yellow-500">
          <h3 className="text-slate-700 dark:text-slate-300 text-sm font-bold uppercase">Pending Review</h3>
          <p className="text-3xl font-bold text-slate-900 dark:text-white">{stats?.pendingApps || 0}</p>
        </div>
        <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md border-l-4 border-green-500">
          <h3 className="text-slate-700 dark:text-slate-300 text-sm font-bold uppercase">Approved</h3>
          <p className="text-3xl font-bold text-slate-900 dark:text-white">{stats?.approvedApps || 0}</p>
        </div>
      </div>

      {/* Logs + Export */}
      <div className="grid md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-gray-100 dark:border-white/10 p-4 md:col-span-2">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-bold text-gray-800 dark:text-white">Recent Activity</h3>
            <span className="text-xs text-gray-500 dark:text-gray-400">audit log</span>
          </div>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {logs.map(log => (
              <div key={log.id} className="flex justify-between text-sm border-b border-gray-100 dark:border-white/10 py-2">
                <div>
                  <p className="font-semibold text-gray-800 dark:text-white">{log.action}</p>
                  <p className="text-gray-500 dark:text-gray-400">{log.entityType} #{log.entityId}</p>
                </div>
                <span className="text-gray-400 dark:text-gray-500">{new Date(log.createdAt).toLocaleString()}</span>
              </div>
            ))}
            {!logs.length && <p className="text-gray-500 dark:text-gray-400 text-sm">No activity yet.</p>}
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-gray-100 dark:border-white/10 p-4 flex flex-col gap-3">
          <h3 className="text-lg font-bold text-gray-800 dark:text-white">Reports</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Download all applications as CSV to share with reviewers.</p>
          <button onClick={downloadCsv} className="inline-flex items-center justify-center gap-2 bg-slate-900 dark:bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-600 dark:hover:bg-blue-700">
            <Download size={16} /> Export CSV
          </button>
        </div>
      </div>

      {/* SECTION 1: Manage Applications */}
      <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Pending Applications</h2>
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg overflow-hidden border border-gray-100 dark:border-white/10 mb-12">
        <table className="min-w-full text-left">
          <thead className="bg-slate-50 dark:bg-slate-700 text-gray-500 dark:text-gray-300 text-xs uppercase border-b dark:border-white/10">
            <tr>
              <th className="px-6 py-4">Student</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-center">Review</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-white/10">
            {applications.map((app) => (
              <tr key={app.id} className="hover:bg-gray-50 dark:hover:bg-slate-700">
                <td className="px-6 py-4">
                  <div className="font-bold text-slate-900 dark:text-white">{app.studentName}</div>
                  <div className="text-sm text-gray-400 dark:text-gray-400">{app.email}</div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-xs font-bold 
                    ${app.status === 'Approved' ? 'bg-green-100 text-green-700' : 
                      app.status === 'Rejected' ? 'bg-red-100 text-red-700' : 
                      'bg-yellow-100 text-yellow-700'}`}>
                    {app.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-center flex justify-center gap-3">
                  {/* View Full Button */}
                  <Link href={`/admin/view/${app.id}`} className="text-blue-600 hover:underline text-sm font-bold">
                    View Full Essay
                  </Link>
                  
                  {/* Quick Actions */}
                  {app.status === 'Pending' && (
                    <>
                      <button onClick={() => updateStatus(app.id, 'Approved')} className="text-green-600 hover:bg-green-100 px-2 rounded">✔</button>
                      <button onClick={() => updateStatus(app.id, 'Rejected')} className="text-red-600 hover:bg-red-100 px-2 rounded">✖</button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Users */}
      <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Users</h2>
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg overflow-hidden border border-gray-100 dark:border-white/10 mb-12">
        <table className="min-w-full text-left">
          <thead className="bg-slate-50 dark:bg-slate-700 text-gray-500 dark:text-gray-300 text-xs uppercase border-b dark:border-white/10">
            <tr>
              <th className="px-6 py-4">Name</th>
              <th className="px-6 py-4">Email</th>
              <th className="px-6 py-4">Role</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-white/10">
            {users.map(user => (
              <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-slate-700">
                <td className="px-6 py-4 font-semibold text-gray-800 dark:text-white">{user.name}</td>
                <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{user.email}</td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 text-xs font-bold rounded bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300">{user.role}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* SECTION 2: Manage Scholarships */}
      <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Active Scholarships</h2>
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg overflow-hidden border border-gray-100 dark:border-white/10">
        <table className="min-w-full text-left">
          <thead className="bg-slate-50 dark:bg-slate-700 text-gray-500 dark:text-gray-300 text-xs uppercase border-b dark:border-white/10">
            <tr>
              <th className="px-6 py-4">Title</th>
              <th className="px-6 py-4">Amount</th>
              <th className="px-6 py-4">Deadline</th>
              <th className="px-6 py-4 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-white/10">
            {scholarships.map((s) => (
              <tr key={s.id} className="hover:bg-gray-50 dark:hover:bg-slate-700">
                <td className="px-6 py-4 font-bold text-gray-800 dark:text-white">{s.title}</td>
                <td className="px-6 py-4 text-green-600 dark:text-green-400 font-bold">{s.amount}</td>
                <td className="px-6 py-4 text-gray-500 dark:text-gray-400">{s.deadline}</td>
                <td className="px-6 py-4 text-center">
                  <button 
                    onClick={() => handleDeleteScholarship(s.id)}
                    className="text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/30 px-3 py-1 rounded text-sm transition"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}