"use client";

/**
 * GoldenExample — Read-only annotated code block
 * Shows the golden (solution) example with line-by-line annotations
 */

import { motion, AnimatePresence } from "framer-motion";
import { FlaskConical, X, Lightbulb } from "lucide-react";
import { useEditorStore } from "@/stores";
import { LANGUAGES } from "@/types";
import type { Exercise } from "@/types";

interface GoldenExampleProps {
    exercise: Exercise;
}

export default function GoldenExample({ exercise }: GoldenExampleProps) {
    const { activeLanguage, exampleRevealed, toggleExample } = useEditorStore();
    const langConfig = LANGUAGES[activeLanguage];

    const code = exercise.goldenExample[activeLanguage];
    const annotations = exercise.annotations[activeLanguage] || {};
    const lines = code.split("\n");

    return (
        <AnimatePresence>
            {exampleRevealed && (
                <motion.div
                    initial={{ opacity: 0, y: -20, height: 0 }}
                    animate={{ opacity: 1, y: 0, height: "auto" }}
                    exit={{ opacity: 0, y: -20, height: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="border-b overflow-hidden"
                    style={{ borderColor: "var(--color-gold)" + "44" }}
                >
                    {/* ── Header ── */}
                    <div
                        className="flex items-center justify-between px-4 py-2"
                        style={{
                            background: "linear-gradient(135deg, rgba(245, 197, 66, 0.1), rgba(245, 197, 66, 0.05))",
                            borderBottom: "1px solid var(--color-gold)" + "33",
                        }}
                    >
                        <div className="flex items-center gap-2">
                            <FlaskConical size={14} style={{ color: "var(--color-gold)" }} />
                            <span
                                className="text-xs font-semibold"
                                style={{ color: "var(--color-gold)" }}
                            >
                                Golden Example — {langConfig.label}
                            </span>
                        </div>
                        <button
                            onClick={toggleExample}
                            className="p-1 rounded hover:bg-[var(--color-surface-hover)] transition-colors"
                            aria-label="Close golden example"
                        >
                            <X size={14} style={{ color: "var(--color-text-muted)" }} />
                        </button>
                    </div>

                    {/* ── Code with annotations ── */}
                    <div
                        className="overflow-x-auto"
                        style={{ background: "var(--color-abyss)" }}
                    >
                        <pre className="text-xs leading-relaxed p-4">
                            {lines.map((line, idx) => {
                                const lineNum = idx + 1;
                                const annotation = annotations[lineNum];

                                return (
                                    <div key={idx}>
                                        {/* Code line */}
                                        <div className="flex group">
                                            {/* Line number */}
                                            <span
                                                className="select-none w-8 text-right pr-3 shrink-0"
                                                style={{ color: "var(--color-text-muted)" }}
                                            >
                                                {lineNum}
                                            </span>
                                            {/* Code content */}
                                            <code
                                                className="flex-1"
                                                style={{ color: "var(--color-text-primary)" }}
                                            >
                                                {line || " "}
                                            </code>
                                        </div>

                                        {/* Annotation (if any) */}
                                        {annotation && (
                                            <motion.div
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: idx * 0.05 }}
                                                className="flex items-start gap-2 pl-11 py-1"
                                                style={{
                                                    background: "rgba(245, 197, 66, 0.05)",
                                                }}
                                            >
                                                <Lightbulb
                                                    size={11}
                                                    className="shrink-0 mt-0.5"
                                                    style={{ color: "var(--color-gold-dim)" }}
                                                />
                                                <span
                                                    className="text-[11px] leading-snug"
                                                    style={{ color: "var(--color-gold-dim)" }}
                                                >
                                                    {annotation}
                                                </span>
                                            </motion.div>
                                        )}
                                    </div>
                                );
                            })}
                        </pre>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
