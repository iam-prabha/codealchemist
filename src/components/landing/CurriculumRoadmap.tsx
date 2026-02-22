"use client";

/**
 * CurriculumRoadmap — Vertical timeline showing all 12 alchemy layers
 * Connected by a gold line, with staggered scroll animations
 */

import { motion, type Variants } from "framer-motion";
import { CURRICULUM_LAYERS } from "@/data/curriculum";

const nodeVariants: Variants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i: number) => ({
        opacity: 1,
        x: 0,
        transition: { duration: 0.4, delay: i * 0.07, ease: "easeOut" as const },
    }),
};

export default function CurriculumRoadmap() {
    return (
        <section id="curriculum" className="py-24 px-6">
            <div className="max-w-3xl mx-auto">
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
                        Your{" "}
                        <span className="shimmer-gold">Learning Path</span>
                    </h2>
                    <p className="text-base max-w-xl mx-auto" style={{ color: "var(--color-text-secondary)" }}>
                        12 progressive layers from fundamentals to mastery. Each layer builds on the last.
                    </p>
                </motion.div>

                {/* Timeline */}
                <div className="relative">
                    {/* Vertical line */}
                    <div
                        className="absolute left-[19px] top-0 bottom-0 w-px"
                        style={{
                            background: "linear-gradient(to bottom, var(--color-gold), var(--color-border) 30%, var(--color-border) 70%, transparent)",
                        }}
                    />

                    {/* Nodes */}
                    <div className="space-y-1">
                        {CURRICULUM_LAYERS.map((layer, i) => {
                            const hasExercises = layer.exercises.length > 0;
                            return (
                                <motion.div
                                    key={layer.id}
                                    custom={i}
                                    initial="hidden"
                                    whileInView="visible"
                                    viewport={{ once: true, margin: "-40px" }}
                                    variants={nodeVariants}
                                    className="relative flex items-start gap-5 py-3 group"
                                >
                                    {/* Node circle */}
                                    <div
                                        className="relative z-10 w-10 h-10 rounded-full flex items-center justify-center shrink-0 text-xs font-bold transition-all duration-200"
                                        style={{
                                            background: hasExercises
                                                ? "linear-gradient(135deg, var(--color-gold), var(--color-gold-bright))"
                                                : "var(--color-surface)",
                                            color: hasExercises
                                                ? "var(--color-text-inverse)"
                                                : "var(--color-text-muted)",
                                            border: hasExercises
                                                ? "2px solid var(--color-gold)"
                                                : "2px solid var(--color-border)",
                                            boxShadow: hasExercises
                                                ? "0 0 16px var(--color-gold-glow)"
                                                : "none",
                                        }}
                                    >
                                        {String(layer.id).padStart(2, "0")}
                                    </div>

                                    {/* Content */}
                                    <div
                                        className="flex-1 rounded-xl px-5 py-4 transition-all duration-200"
                                        style={{
                                            background: hasExercises
                                                ? "linear-gradient(135deg, rgba(26, 16, 48, 0.8), rgba(34, 24, 66, 0.6))"
                                                : "transparent",
                                            border: hasExercises
                                                ? "1px solid var(--color-border)"
                                                : "1px solid transparent",
                                        }}
                                    >
                                        <div className="flex items-center gap-2.5">
                                            <span className="text-lg">{layer.icon}</span>
                                            <h3
                                                className="text-sm font-semibold"
                                                style={{
                                                    fontFamily: "Space Grotesk, sans-serif",
                                                    color: hasExercises
                                                        ? "var(--color-text-primary)"
                                                        : "var(--color-text-muted)",
                                                }}
                                            >
                                                {layer.title}
                                            </h3>

                                            {hasExercises && (
                                                <span
                                                    className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider"
                                                    style={{
                                                        background: "rgba(57, 255, 20, 0.12)",
                                                        color: "var(--color-neon-green)",
                                                        border: "1px solid rgba(57, 255, 20, 0.25)",
                                                    }}
                                                >
                                                    Live
                                                </span>
                                            )}
                                        </div>
                                        <p
                                            className="text-xs mt-1"
                                            style={{ color: "var(--color-text-muted)" }}
                                        >
                                            {hasExercises
                                                ? `${layer.exercises.length} exercise${layer.exercises.length !== 1 ? "s" : ""} available`
                                                : layer.subtitle}
                                        </p>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
}
