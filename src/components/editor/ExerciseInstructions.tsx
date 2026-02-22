"use client";

/**
 * ExerciseInstructions — Shows current exercise instructions,
 * context intro, and hints
 */

import { motion } from "framer-motion";
import { BookOpen, Lightbulb, ChevronDown, Code2 } from "lucide-react";
import { useEditorStore } from "@/stores";
import { getLayer } from "@/data/curriculum";
import { LANGUAGES } from "@/types";
import { useState } from "react";

export default function ExerciseInstructions() {
    const { activeLayerId, activeExerciseIndex, activeLanguage, practiceMode } = useEditorStore();
    const [showHints, setShowHints] = useState(false);

    const layer = getLayer(activeLayerId);
    const exercise = layer?.exercises[activeExerciseIndex];
    const langConfig = LANGUAGES[activeLanguage];

    if (!layer || !exercise) {
        return (
            <div className="p-6 text-center" style={{ color: "var(--color-text-muted)" }}>
                <BookOpen size={32} className="mx-auto mb-3 opacity-30" />
                <p className="text-sm">Select a lesson layer to begin</p>
            </div>
        );
    }

    if (practiceMode === "playground") {
        return (
            <div
                className="flex flex-col items-center justify-center p-8 text-center"
                style={{
                    background: "var(--color-deep)",
                    borderBottom: "1px solid var(--color-border)",
                    minHeight: "150px"
                }}
            >
                <Code2 size={32} className="mb-3 opacity-30" style={{ color: "var(--color-neon-magenta)" }} />
                <h3 className="text-sm font-semibold mb-1" style={{ color: "var(--color-text-primary)" }}>
                    Playground Mode
                </h3>
                <p className="text-xs max-w-[250px]" style={{ color: "var(--color-text-muted)" }}>
                    A blank canvas for your alchemical experiments. Write anything you want in {langConfig.label}.
                </p>
            </div>
        );
    }

    return (
        <div
            className="overflow-auto"
            style={{
                background: "var(--color-deep)",
                borderBottom: "1px solid var(--color-border)",
            }}
        >
            {/* ── Concept intro ── */}
            <div
                className="px-4 py-3"
                style={{
                    background: "linear-gradient(135deg, var(--color-surface), var(--color-deep))",
                    borderBottom: "1px solid var(--color-border)",
                }}
            >
                <pre
                    className="text-[11px] leading-relaxed font-mono whitespace-pre-wrap"
                    style={{ color: "var(--color-text-muted)" }}
                >
                    {layer.conceptIntro[activeLanguage]}
                </pre>
            </div>

            {/* ── Exercise instructions ── */}
            <motion.div 
                key={exercise.id}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="px-4 py-3"
            >
                <div className="flex items-start gap-2 mb-2">
                    <BookOpen size={14} className="shrink-0 mt-0.5" style={{ color: "var(--color-gold)" }} />
                    <h3
                        className="text-sm font-semibold"
                        style={{ color: "var(--color-text-primary)", fontFamily: "Space Grotesk, sans-serif" }}
                    >
                        {exercise.title}
                    </h3>
                </div>
                <p className="text-xs leading-relaxed ml-5" style={{ color: "var(--color-text-secondary)" }}>
                    {exercise.instructions}
                </p>

                {/* ── Hints accordion ── */}
                {practiceMode === "guided" && exercise.hints.length > 0 && (
                    <div className="mt-3 ml-5">
                        <button
                            onClick={() => setShowHints(!showHints)}
                            className="flex items-center gap-1.5 text-[11px] font-medium transition-colors hover:text-[var(--color-gold)]"
                            style={{ color: "var(--color-text-muted)" }}
                        >
                            <Lightbulb size={12} />
                            {showHints ? "Hide hints" : `Show hints (${exercise.hints.length})`}
                            <motion.span
                                animate={{ rotate: showHints ? 180 : 0 }}
                                transition={{ duration: 0.2 }}
                            >
                                <ChevronDown size={12} />
                            </motion.span>
                        </button>

                        {showHints && (
                            <motion.ul
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                className="mt-2 space-y-1.5"
                            >
                                {exercise.hints.map((hint, i) => (
                                    <motion.li
                                        key={i}
                                        initial={{ opacity: 0, x: -8 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.1 }}
                                        className="text-[11px] flex items-start gap-2"
                                        style={{ color: "var(--color-text-muted)" }}
                                    >
                                        <span style={{ color: "var(--color-gold-dim)" }}>💡</span>
                                        {hint}
                                    </motion.li>
                                ))}
                            </motion.ul>
                        )}
                    </div>
                )}
            </motion.div>
        </div>
    );
}
