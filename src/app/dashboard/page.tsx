import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowRight, BookOpen, Code, Trophy, Zap } from "lucide-react";
import { motion } from "framer-motion";

export default async function DashboardPage() {
    const headersList = await headers();
    const session = await auth.api.getSession({ headers: headersList });

    if (!session) {
        redirect("/sign-in");
    }

    const user = session.user;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="space-y-8">
                {/* Welcome Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center space-y-4"
                >
                    <h1 className="text-4xl font-bold text-text-primary">
                        Welcome back, {user.name?.split(" ")[0] || "Alchemist"}! ⚗️
                    </h1>
                    <p className="text-lg text-text-muted max-w-2xl mx-auto">
                        Ready to continue your coding journey? Choose a language and start practicing.
                    </p>
                </motion.div>

                {/* Stats Cards */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-6"
                >
                    <div className="glass-card p-6 rounded-xl">
                        <div className="flex items-center gap-3 mb-2">
                            <Zap className="text-gold" size={24} />
                            <h3 className="font-semibold text-text-primary">XP Earned</h3>
                        </div>
                        <p className="text-2xl font-bold text-gold">1,247</p>
                        <p className="text-sm text-text-muted">Keep it up!</p>
                    </div>

                    <div className="glass-card p-6 rounded-xl">
                        <div className="flex items-center gap-3 mb-2">
                            <Trophy className="text-gold" size={24} />
                            <h3 className="font-semibold text-text-primary">Current Streak</h3>
                        </div>
                        <p className="text-2xl font-bold text-gold">7 days</p>
                        <p className="text-sm text-text-muted">Don&apos;t break it!</p>
                    </div>

                    <div className="glass-card p-6 rounded-xl">
                        <div className="flex items-center gap-3 mb-2">
                            <Code className="text-gold" size={24} />
                            <h3 className="font-semibold text-text-primary">Exercises Completed</h3>
                        </div>
                        <p className="text-2xl font-bold text-gold">42</p>
                        <p className="text-sm text-text-muted">Across all languages</p>
                    </div>
                </motion.div>

                {/* Language Selection */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="space-y-6"
                >
                    <h2 className="text-2xl font-bold text-text-primary text-center">
                        Choose Your Language
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                            {
                                name: "Python",
                                icon: "🐍",
                                description: "Perfect for beginners and data science",
                                exercises: 156,
                                href: "/workspace?lang=python",
                            },
                            {
                                name: "Rust",
                                icon: "🦀",
                                description: "Memory-safe systems programming",
                                exercises: 89,
                                href: "/workspace?lang=rust",
                            },
                            {
                                name: "TypeScript",
                                icon: "🔷",
                                description: "JavaScript with type safety",
                                exercises: 134,
                                href: "/workspace?lang=typescript",
                            },
                        ].map((lang, index) => (
                            <motion.div
                                key={lang.name}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 + index * 0.1 }}
                            >
                                <Link
                                    href={lang.href}
                                    className="block glass-card p-6 rounded-xl hover:glass-hover transition-all duration-200 group"
                                >
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <span className="text-3xl">{lang.icon}</span>
                                            <div>
                                                <h3 className="font-semibold text-text-primary text-lg">
                                                    {lang.name}
                                                </h3>
                                                <p className="text-sm text-text-muted">
                                                    {lang.exercises} exercises
                                                </p>
                                            </div>
                                        </div>
                                        <ArrowRight
                                            className="text-text-muted group-hover:text-gold transition-colors"
                                            size={20}
                                        />
                                    </div>
                                    <p className="text-text-secondary">{lang.description}</p>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* Quick Actions */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="glass-card p-6 rounded-xl"
                >
                    <h3 className="font-semibold text-text-primary mb-4 flex items-center gap-2">
                        <BookOpen size={20} />
                        Quick Start
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Link
                            href="/workspace?lang=python"
                            className="flex items-center gap-3 p-4 rounded-lg glass-hover transition-all duration-200 group"
                        >
                            <span className="text-2xl">🚀</span>
                            <div>
                                <p className="font-medium text-text-primary group-hover:text-gold">
                                    Jump into Python
                                </p>
                                <p className="text-sm text-text-muted">
                                    Start with our beginner-friendly exercises
                                </p>
                            </div>
                        </Link>
                        <Link
                            href="/workspace?lang=rust"
                            className="flex items-center gap-3 p-4 rounded-lg glass-hover transition-all duration-200 group"
                        >
                            <span className="text-2xl">⚡</span>
                            <div>
                                <p className="font-medium text-text-primary group-hover:text-gold">
                                    Challenge Yourself with Rust
                                </p>
                                <p className="text-sm text-text-muted">
                                    Tackle advanced systems programming
                                </p>
                            </div>
                        </Link>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}