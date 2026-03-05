"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";
import { ArrowRight, Star } from "lucide-react";

const languages = [
    {
        id: "python",
        name: "Python",
        icon: "🐍",
        color: "#3776ab",
        description: "Great for beginners & data science",
        chapters: 12,
        difficulty: "Beginner-Friendly",
        gradient: "from-blue-500 to-blue-600",
    },
    {
        id: "rust",
        name: "Rust",
        icon: "🦀",
        color: "#ce422b",
        description: "Systems programming, blazing fast",
        chapters: 12,
        difficulty: "Intermediate",
        gradient: "from-red-500 to-red-600",
    },
    {
        id: "typescript",
        name: "TypeScript",
        icon: "🔷",
        color: "#3178c6",
        description: "Modern web, type-safe JS",
        chapters: 12,
        difficulty: "Intermediate",
        gradient: "from-blue-600 to-blue-700",
    },
];

export default function LanguagesSection() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0 },
    };

    return (
        <section id="languages" className="py-24 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <motion.div
                    ref={ref}
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                        Three languages. One platform.
                    </h2>
                    <p className="text-lg text-text-muted max-w-2xl mx-auto">
                        Choose your path and master multiple programming languages
                        with our comprehensive, language-specific curriculum.
                    </p>
                </motion.div>

                {/* Language Cards */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate={isInView ? "visible" : "hidden"}
                    className="grid grid-cols-1 md:grid-cols-3 gap-8"
                >
                    {languages.map((lang) => (
                        <motion.div
                            key={lang.id}
                            variants={itemVariants}
                            whileHover={{ y: -8 }}
                            className="glass-card p-8 rounded-xl hover:border-gold/30 transition-all duration-300 group cursor-pointer"
                        >
                            {/* Header */}
                            <div className="flex items-center justify-between mb-6">
                                <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${lang.gradient} flex items-center justify-center text-2xl`}>
                                    {lang.icon}
                                </div>
                                <div className="text-right">
                                    <div className="text-sm text-text-muted">Chapters</div>
                                    <div className="font-bold text-gold">{lang.chapters}</div>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="mb-6">
                                <h3 className="text-2xl font-bold mb-2">{lang.name}</h3>
                                <p className="text-text-muted mb-3">{lang.description}</p>
                                <div className="flex items-center gap-2">
                                    <Star className="w-4 h-4 text-gold" />
                                    <span className="text-sm text-text-muted">{lang.difficulty}</span>
                                </div>
                            </div>

                            {/* CTA */}
                            <Link
                                href={`/sign-up?lang=${lang.id}`}
                                className="flex items-center justify-between w-full p-3 bg-surface hover:bg-panel rounded-lg transition-colors group/link"
                            >
                                <span className="font-medium">Explore {lang.name}</span>
                                <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                            </Link>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}