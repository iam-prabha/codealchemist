"use client";

/**
 * OutputPane — Console output display
 * Shows execution results, errors, and execution time
 */

import { motion, AnimatePresence } from "framer-motion";
import {
    Terminal,
    CheckCircle2,
    XCircle,
    Clock,
    Trash2,
    Sparkles,
} from "lucide-react";
import { useExecutionStore, useEditorStore } from "@/stores";
import { getLayer } from "@/data/curriculum";

export default function OutputPane() {
    const { activeLayerId, activeExerciseIndex, activeLanguage, practiceMode } = useEditorStore();
    const layer = getLayer(activeLayerId);
    const currentExercise = layer?.exercises[activeExerciseIndex];

    const { output, error, executionTimeMs, isRunning, resetExecution } =
        useExecutionStore();

    const hasOutput = output.length > 0 || error !== null;
    
    const isChallengeMode = practiceMode === "challenge";
    const isPass = isChallengeMode && currentExercise && output.trim() === currentExercise.expectedOutput[activeLanguage]?.trim();

    return (
        <div 
            className="output-panel flex flex-col h-full w-full relative transition-colors duration-300"
            style={{
                boxShadow: isRunning ? "inset 0 0 0 1px var(--color-gold-dim)" : "none",
            }}
        >
            {/* ── Header ── */}
            <div
                className="flex items-center justify-between px-4 py-2 shrink-0"
                style={{
                    background: "var(--color-abyss)",
                    borderBottom: "1px solid var(--color-border)",
                }}
            >
                <div className="flex items-center gap-2">
                    <Terminal size={14} style={{ color: "var(--color-text-muted)" }} />
                    <span className="text-xs font-semibold" style={{ color: "var(--color-text-secondary)" }}>
                        Output
                    </span>

                    {/* Execution status indicator */}
                    {isRunning && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex items-center gap-1"
                        >
                            <Sparkles
                                size={12}
                                className="animate-spin"
                                style={{ color: "var(--color-gold)" }}
                            />
                            <span className="text-[10px]" style={{ color: "var(--color-gold)" }}>
                                Transmuting...
                            </span>
                        </motion.div>
                    )}

                    {!isRunning && executionTimeMs !== null && (
                        <div className="flex items-center gap-1">
                            <Clock size={11} style={{ color: "var(--color-text-muted)" }} />
                            <span className="text-[10px]" style={{ color: "var(--color-text-muted)" }}>
                                {executionTimeMs}ms
                            </span>
                        </div>
                    )}
                </div>

                {/* Clear button */}
                {hasOutput && (
                    <button
                        onClick={resetExecution}
                        className="p-1 rounded hover:bg-[var(--color-surface-hover)] transition-colors"
                        aria-label="Clear output"
                    >
                        <Trash2 size={12} style={{ color: "var(--color-text-muted)" }} />
                    </button>
                )}
            </div>

            {/* ── Output content ── */}
            <div className="flex-1 overflow-auto p-4 font-mono text-xs leading-relaxed min-h-0">
                <AnimatePresence mode="wait">
                    {isRunning && (
                        <motion.div
                            key="running"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex items-center gap-3"
                        >
                            {/* Alchemical loading animation */}
                            <div className="flex gap-1">
                                {[0, 1, 2].map((i) => (
                                    <motion.div
                                        key={i}
                                        className="w-2 h-2 rounded-full"
                                        style={{ background: "var(--color-gold)" }}
                                        animate={{
                                            y: [0, -8, 0],
                                            opacity: [0.4, 1, 0.4],
                                        }}
                                        transition={{
                                            duration: 0.8,
                                            repeat: Infinity,
                                            delay: i * 0.15,
                                        }}
                                    />
                                ))}
                            </div>
                            <span style={{ color: "var(--color-text-muted)" }}>
                                Transmuting your code...
                            </span>
                        </motion.div>
                    )}

                    {!isRunning && error && (
                        <motion.div
                            key="error"
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-2"
                        >
                            <div className="flex items-center gap-2">
                                <XCircle size={14} style={{ color: "var(--color-error)" }} />
                                <span className="font-semibold" style={{ color: "var(--color-error)" }}>
                                    Transmutation Failed
                                </span>
                            </div>
                            <pre
                                className="whitespace-pre-wrap font-mono text-[13px] leading-relaxed relative p-4 rounded-md border border-[var(--color-error)]"
                                style={{
                                    background: "rgba(255, 59, 92, 0.05)",
                                    color: "var(--color-error)",
                                    border: "1px solid rgba(255, 59, 92, 0.2)",
                                }}
                            >
                                <span className="opacity-50 select-none mr-2 font-bold text-[var(--color-error)]">!</span>
                                {error}
                            </pre>

                            {/* Alchemize this error button */}
                            <button
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all hover:brightness-110"
                                style={{
                                    background: "linear-gradient(135deg, var(--color-neon-magenta-glow), var(--color-surface))",
                                    color: "var(--color-neon-magenta)",
                                    border: "1px solid var(--color-neon-magenta)" + "33",
                                }}
                            >
                                <Sparkles size={12} />
                                Alchemize this error
                            </button>
                        </motion.div>
                    )}

                    {!isRunning && !error && output && (
                        <motion.div
                            key="output"
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-2"
                        >
                            <div className="flex items-center gap-2 mb-2">
                                {isChallengeMode ? (
                                    isPass ? (
                                        <>
                                            <CheckCircle2 size={14} style={{ color: "var(--color-success)" }} />
                                            <span className="font-semibold" style={{ color: "var(--color-success)" }}>
                                                Challenge Passed!
                                            </span>
                                            <span className="text-[10px] px-1.5 py-0.5 rounded-full" style={{ background: "rgba(46, 213, 115, 0.1)", color: "var(--color-success)" }}>
                                                +XP Bonus
                                            </span>
                                        </>
                                    ) : (
                                        <>
                                            <XCircle size={14} style={{ color: "var(--color-warning)" }} />
                                            <span className="font-semibold" style={{ color: "var(--color-warning)" }}>
                                                Output mismatch
                                            </span>
                                            <span className="text-xs" style={{ color: "var(--color-text-muted)" }}>
                                                Keep trying!
                                            </span>
                                        </>
                                    )
                                ) : (
                                    <>
                                        <CheckCircle2 size={14} style={{ color: "var(--color-success)" }} />
                                        <span className="font-semibold" style={{ color: "var(--color-success)" }}>
                                            Transmutation Successful
                                        </span>
                                    </>
                                )}
                            </div>
                            <pre
                                className="whitespace-pre-wrap font-mono text-[13px] leading-relaxed relative"
                                style={{ color: "var(--color-success)" }}
                            >
                                <span className="opacity-50 select-none mr-2">$</span>
                                {output}
                            </pre>
                        </motion.div>
                    )}

                    {!isRunning && !hasOutput && (
                        <motion.div
                            key="empty"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex flex-col items-start gap-2 h-full py-2 px-2 w-full"
                        >
                            <div className="flex items-center text-xs opacity-60">
                                <span className="font-mono text-[var(--color-success)] mr-2">$</span>
                                <span className="text-[var(--color-text-muted)] italic">
                                    Terminal ready...
                                </span>
                                <motion.div 
                                    className="w-1.5 h-3 ml-1 bg-[var(--color-gold)]"
                                    animate={{ opacity: [1, 0, 1] }}
                                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                />
                            </div>
                            <div className="flex flex-col items-center justify-center w-full h-full mt-4">
                                <Terminal
                                    size={24}
                                    style={{ color: "var(--color-text-muted)", opacity: 0.2 }}
                                    className="mb-2"
                                />
                                <p className="text-[10px] opacity-40 text-center" style={{ color: "var(--color-text-muted)" }}>
                                    Press{" "}
                                    <kbd
                                        className="px-1.5 py-0.5 rounded text-[9px] font-mono mx-0.5"
                                        style={{
                                            background: "var(--color-surface)",
                                            border: "1px solid var(--color-border)",
                                        }}
                                    >
                                        Ctrl+Enter
                                    </kbd>{" "}
                                    to transmute & run
                                </p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
