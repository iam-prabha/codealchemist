"use client";

/**
 * Features — 4-feature grid highlighting core CodeAlchemist capabilities
 */

import { motion, type Variants } from "framer-motion";
import { Zap, FlaskConical, Bug, Layers } from "lucide-react";

const FEATURES = [
    {
        icon: Zap,
        title: "Real-Time Execution",
        description: "Run Python, Rust, and TypeScript code instantly in your browser. See output as you type \u2014 no setup required.",
        accent: "var(--color-neon-green)",
    },
    {
        icon: FlaskConical,
        title: "Golden Examples",
        description: "Toggle expert solutions with line-by-line annotations. Learn the \u201Cwhy\u201D behind every pattern, not just the \u201Chow.\u201D",
        accent: "var(--color-gold)",
    },
    {
        icon: Bug,
        title: "Debug Visualization",
        description: "Step through code execution with a visual debugger. Watch variables, call stacks, and data flow in real time.",
        accent: "var(--color-neon-cyan)",
    },
    {
        icon: Layers,
        title: "12-Layer Curriculum",
        description: "Progress from variables and types through async, generics, and performance mastery. A structured path from beginner to expert.",
        accent: "var(--color-neon-magenta)",
    },
];

const featureVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i: number) => ({
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, delay: i * 0.1, ease: "easeOut" as const },
    }),
};

export default function Features() {
    return (
        <section id="features" className="py-24 px-6">
            <div className="max-w-7xl mx-auto">
                {/* Section header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <h2
                        className="text-3xl md:text-4xl font-bold mb-4"
                        style={{ fontFamily: "Space Grotesk, sans-serif", color: "var(--color-text-primary)" }}
                    >
                        Built for{" "}
                        <span className="shimmer-gold">Real Learning</span>
                    </h2>
                    <p className="text-base max-w-xl mx-auto" style={{ color: "var(--color-text-secondary)" }}>
                        Not another passive tutorial. CodeAlchemist is an interactive workspace designed to make you code.
                    </p>
                </motion.div>

                {/* Feature grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {FEATURES.map((feature, i) => {
                        const Icon = feature.icon;
                        return (
                            <motion.div
                                key={feature.title}
                                custom={i}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true, margin: "-60px" }}
                                variants={featureVariants}
                                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                                className="group rounded-2xl p-6 flex flex-col transition-all duration-300"
                                style={{
                                    background: "linear-gradient(135deg, rgba(26, 16, 48, 0.7), rgba(17, 11, 32, 0.6))",
                                    border: "1px solid var(--color-border)",
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.borderColor = feature.accent;
                                    e.currentTarget.style.boxShadow = `0 0 30px ${feature.accent}22`;
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.borderColor = "var(--color-border)";
                                    e.currentTarget.style.boxShadow = "none";
                                }}
                            >
                                {/* Icon */}
                                <div
                                    className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                                    style={{
                                        background: `${feature.accent}15`,
                                        border: `1px solid ${feature.accent}30`,
                                    }}
                                >
                                    <Icon size={20} style={{ color: feature.accent }} />
                                </div>

                                {/* Title */}
                                <h3
                                    className="text-base font-semibold mb-2"
                                    style={{ fontFamily: "Space Grotesk, sans-serif", color: "var(--color-text-primary)" }}
                                >
                                    {feature.title}
                                </h3>

                                {/* Description */}
                                <p className="text-sm leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
                                    {feature.description}
                                </p>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
