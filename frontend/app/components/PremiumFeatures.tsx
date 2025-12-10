import { Shield, Zap, Globe, Award, Sparkles, Clock } from "lucide-react";
import PremiumSectionHeader from "./PremiumSectionHeader";

const features = [
    {
        icon: <Globe className="w-8 h-8 text-blue-500" />,
        title: "Global Reach",
        description: "Access scholarships from over 50 countries and thousands of institutions worldwide.",
    },
    {
        icon: <Sparkles className="w-8 h-8 text-purple-500" />,
        title: "AI Recommendations",
        description: "Our smart algorithm finds scholarships that perfectly match your profile and achievements.",
    },
    {
        icon: <Shield className="w-8 h-8 text-emerald-500" />,
        title: "Verified Trust",
        description: "Every scholarship is manually verified to ensure legitimacy and security for applicants.",
    },
    {
        icon: <Zap className="w-8 h-8 text-amber-500" />,
        title: "Fast Applications",
        description: "Apply to multiple scholarships with a single profile. Save hours of paperwork.",
    },
    {
        icon: <Award className="w-8 h-8 text-rose-500" />,
        title: "Premium Support",
        description: "Get guidance from scholarship experts to improve your essay and application chances.",
    },
    {
        icon: <Clock className="w-8 h-8 text-cyan-500" />,
        title: "Deadline Alerts",
        description: "Never miss an opportunity. Get timely notifications before applications close.",
    },
];

export default function PremiumFeatures() {
    return (
        <section className="py-20 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 left-0 w-full h-full bg-premium-light dark:bg-slate-900/50 -z-10"></div>
            <div className="absolute top-1/3 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -z-10"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6">
                <div className="text-center mb-16">
                    <PremiumSectionHeader title="Why Choose EduEquity?" />
                    <p className="max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-300">
                        We combine cutting-edge technology with premium design to give you the best scholarship search experience.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className="card-premium p-8 group hover:bg-white/80 dark:hover:bg-slate-800/80 transition-colors"
                        >
                            <div className="mb-6 p-4 rounded-2xl bg-white/50 dark:bg-slate-700/50 w-fit group-hover:scale-110 transition-transform duration-300 shadow-sm">
                                {feature.icon}
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors">
                                {feature.title}
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
