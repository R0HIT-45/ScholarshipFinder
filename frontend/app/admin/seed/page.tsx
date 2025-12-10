"use client";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

type SeedItem = {
  title: string;
  amount: string;
  deadline: string; // ISO string or yyyy-mm-dd
  description: string;
};

const SAMPLE_SEED: SeedItem[] = [
  {
    title: "Future Tech Leader Scholarship",
    amount: "$10,000",
    deadline: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
    description:
      "Awarded to students showing leadership in AI, ML, Data Science, or cutting-edge software engineering projects.",
  },
  {
    title: "Women in STEM Excellence Grant",
    amount: "$7,500",
    deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
    description: "Supports women pursuing degrees in STEM fields with strong academic performance and community impact.",
  },
  {
    title: "First-Gen Innovators Fund",
    amount: "$5,000",
    deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
    description: "For first-generation college students demonstrating resilience and innovation in their studies.",
  },
  {
    title: "Global Cybersecurity Talent Award",
    amount: "$8,000",
    deadline: new Date(Date.now() + 75 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
    description: "Recognizes students building careers in cybersecurity, ethical hacking, or digital forensics.",
  },
  {
    title: "Sustainable Tech Impact Scholarship",
    amount: "$6,500",
    deadline: new Date(Date.now() + 50 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
    description: "Rewards eco-focused tech projects addressing climate change, energy, or circular economy challenges.",
  },
];

export default function SeedScholarshipsPage() {
  const router = useRouter();
  const [jsonText, setJsonText] = useState<string>(JSON.stringify(SAMPLE_SEED, null, 2));
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) router.push("/login");
  }, [router]);

  const items = useMemo(() => {
    try {
      const parsed = JSON.parse(jsonText) as SeedItem[];
      return parsed.filter((i) => i && i.title && i.amount && i.deadline && i.description);
    } catch {
      return [] as SeedItem[];
    }
  }, [jsonText]);

  async function seedAll() {
    const token = localStorage.getItem("accessToken");
    if (!token) { toast.error("Login required"); router.push("/login"); return; }
    if (!items.length) { toast.error("No valid items to seed"); return; }

    setIsSubmitting(true);
    let success = 0;
    for (const it of items) {
      try {
        const res = await fetch(`${API_BASE}/scholarships`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(it),
        });
        if (res.ok) success++;
      } catch (e) {
        // continue
      }
    }
    setIsSubmitting(false);
    toast.success(`Seeded ${success}/${items.length} scholarships`);
    const ts = Date.now();
    router.push(`/?seeded=1&ts=${ts}`);
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-8 flex justify-center items-start pt-16">
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-4xl overflow-hidden">
        <div className="bg-slate-900 dark:bg-slate-950 p-4 sm:p-6 flex justify-between items-center">
          <h1 className="text-xl sm:text-2xl font-bold text-white">Seed Scholarships (Bulk)</h1>
          <button
            onClick={() => setJsonText(JSON.stringify(SAMPLE_SEED, null, 2))}
            className="text-gray-300 hover:text-white text-sm"
            type="button"
          >
            Load Sample
          </button>
        </div>

        <div className="p-4 sm:p-6 space-y-4">
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Paste/edit an array of scholarships (title, amount, deadline yyyy-mm-dd, description) and click Seed.
          </p>
          <textarea
            rows={18}
            value={jsonText}
            onChange={(e) => setJsonText(e.target.value)}
            className="w-full p-3 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white font-mono text-sm"
          />
          <div className="flex gap-3">
            <button
              onClick={seedAll}
              disabled={isSubmitting}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
              type="button"
            >
              {isSubmitting ? "Seeding..." : "Seed Scholarships"}
            </button>
            <button
              onClick={() => router.push("/admin")}
              className="px-4 py-2 rounded border dark:border-white/10"
              type="button"
            >
              Back to Admin
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
