"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

interface SavedItem {
  id: number;
  title: string;
  description: string;
  amount: string;
  deadline: string;
  status?: "Planned" | "In Progress" | "Submitted";
}

export default function SavedPage() {
  const [items, setItems] = useState<SavedItem[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("savedScholarships") || "[]";
      const arr = JSON.parse(raw) as SavedItem[];
      setItems(arr.map((i) => ({ ...i, status: i.status || "Planned" })));
    } catch {
      setItems([]);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("savedScholarships", JSON.stringify(items));
    } catch {}
  }, [items]);

  function updateStatus(id: number, status: SavedItem["status"]) {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, status } : i)));
  }

  function removeItem(id: number) {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Saved Scholarships</h1>
        <span className="text-sm text-slate-700 dark:text-slate-300 font-semibold bg-slate-100 dark:bg-slate-700 px-3 py-1.5 rounded-full">{items.length} saved</span>
      </div>

      {!items.length ? (
        <div className="text-center bg-white dark:bg-slate-800 rounded-lg p-10 border border-gray-100 dark:border-white/10">
          <p className="text-slate-700 dark:text-slate-300 mb-4 font-semibold text-lg">No saved scholarships yet.</p>
          <Link href="/scholarships" className="text-blue-600 font-semibold hover:underline">Browse scholarships</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {items.map((s) => (
            <div key={s.id} className="bg-white dark:bg-slate-800 rounded-lg shadow border border-gray-100 dark:border-white/10 p-5">
              <div className="flex justify-between items-start gap-3">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">{s.title}</h3>
                  <p className="text-sm text-slate-700 dark:text-slate-300 font-medium">Deadline: {new Date(s.deadline).toLocaleDateString()}</p>
                </div>
                <button onClick={() => removeItem(s.id)} className="text-red-600 hover:underline text-sm">Remove</button>
              </div>
              <p className="text-slate-700 dark:text-slate-300 text-sm mt-3 line-clamp-3 font-medium">{s.description}</p>
              <div className="flex items-center justify-between mt-4">
                <span className="text-green-600 font-bold">{s.amount}</span>
                <div className="flex items-center gap-2">
                  <label className="text-sm text-slate-700 dark:text-slate-300 font-semibold">Status:</label>
                  <select
                    value={s.status}
                    onChange={(e) => updateStatus(s.id, e.target.value as SavedItem["status"])}
                    className="text-sm px-2 py-1 border rounded dark:bg-slate-700 dark:border-slate-600 dark:text-white font-medium"
                  >
                    <option value="Planned">Planned</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Submitted">Submitted</option>
                  </select>
                </div>
              </div>
              <div className="mt-4 flex gap-2">
                <Link href={`/apply/${s.id}`} className="flex-1 text-center bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 font-semibold">Apply</Link>
                <Link href={`/scholarships`} className="px-4 py-2 rounded border dark:border-white/10 font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700">Explore more</Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
