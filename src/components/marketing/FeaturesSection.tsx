"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import {
    Brain,
    Swords,
    Zap,
    Globe,
    Trophy,
    Lightbulb,
} from "lucide-react";

const features = [
    {
        icon: Brain,
        title: "Guided Learning",
        description: "Step-by-step exercises that build your understanding from fundamentals to advanced concepts.",
        color: "text-blue-400",
    },
    {
        icon: Swords,
        title: "Challenge Mode",
        description: "Timed coding battles to test your skills under pressure and build confidence.",
        color: "text-red-400",
    },
    {
        icon: Zap,
        title: "Transmute Engine",
        description: "Run your code instantly in the browser with real-time execution and debugging.",
        color: "text-yellow-400",
    },
    {
        icon: Globe,
        title: "Multi-Language",
        description: "Master Python, Rust, and TypeScript in one platform with language-specific exercises.",
        color: "text-green-400",
    },
    {
        icon: Trophy,
        title: "XP & Streaks",
        description: "Gamified progress tracking with experience points and daily streak rewards.",
        color: "text-purple-400",
    },
    {
        icon: Lightbulb,
        title: "AI Hints",
        description: "Get unstuck in seconds, not hours, with contextual AI-powered assistance.",
        color: "text-cyan-400",
    },
];

export default function FeaturesSection() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0 },
    };

    return (
        <section id="features" className="py-24 px-4">
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
                        Everything you need to level up
                    </h2>
                    <p className="text-lg text-text-muted max-w-2xl mx-auto">
                        A complete learning platform designed to take you from beginner to expert
                        across multiple programming languages.
                    </p>
                </motion.div>

                {/* Features Grid */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate={isInView ? "visible" : "hidden"}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                >
                    {features.map((feature, _index) => (
                        <motion.div
                            key={feature.title}
                            variants={itemVariants}
                            className="glass-card p-6 rounded-xl hover:border-gold/30 transition-colors group"
                        >
                            <div className="mb-4">
                                <feature.icon
                                    className={`w-8 h-8 ${feature.color} group-hover:scale-110 transition-transform`}
                                />
                            </div>
                            <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                            <p className="text-text-muted leading-relaxed">
                                {feature.description}
                            </p>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}