import PremiumSectionHeader from "./PremiumSectionHeader";
import { Star } from "lucide-react";

const testimonials = [
    {
        name: "Sarah Jenkins",
        role: "Stanford University",
        image: "https://i.pravatar.cc/150?u=sarah",
        content: "EduEquity completely changed my life. The AI recommendations were spot on, and I secured $45,000 in funding!",
        rating: 5,
    },
    {
        name: "David Chen",
        role: "MIT",
        image: "https://i.pravatar.cc/150?u=david",
        content: "The premium design and ease of use are unmatched. It feels like using a high-end tool, not a clunky government site.",
        rating: 5,
    },
    {
        name: "Amara Okeke",
        role: "Oxford University",
        image: "https://i.pravatar.cc/150?u=amara",
        content: "I love the deadline tracking. It saved me from missing out on a major grant. Highly recommended for every student.",
        rating: 5,
    },
];

export default function PremiumTestimonials() {
    return (
        <section className="py-20 relative">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
                <div className="mb-16 text-center">
                    <PremiumSectionHeader title="Trusted by Top Students" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {testimonials.map((t, i) => (
                        <div key={i} className="card-premium p-8 flex flex-col items-center text-center relative">
                            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500 opacity-50"></div>

                            <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-white dark:border-slate-700 shadow-lg mb-6">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={t.image} alt={t.name} className="w-full h-full object-cover" />
                            </div>

                            <div className="flex gap-1 mb-4 text-amber-400">
                                {[...Array(t.rating)].map((_, r) => (
                                    <Star key={r} fill="currentColor" size={16} />
                                ))}
                            </div>

                            <p className="text-gray-600 dark:text-gray-300 mb-6 italic text-lg leading-relaxed">
                                "{t.content}"
                            </p>

                            <div>
                                <h4 className="font-bold text-gray-900 dark:text-white text-lg">{t.name}</h4>
                                <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">{t.role}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
