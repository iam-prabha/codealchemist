"use client";

/**
 * VisualizationPanel — Execution visualization with stepper,
 * variable watch table, and call stack display
 */

import { motion, AnimatePresence } from "framer-motion";
import {
    Eye,
    Layers,
    Table2,
    Activity,
    ChevronRight,
} from "lucide-react";
import { useExecutionStore } from "@/stores";
import { useState } from "react";
import type { ExecutionStep, VariableSnapshot } from "@/types";

type VizTab = "variables" | "callstack" | "timeline";

export default function VisualizationPanel() {
    const { currentStep, steps } = useExecutionStore();
    const [activeTab, setActiveTab] = useState<VizTab>("variables");

    const step = steps[Math.min(currentStep, steps.length - 1)] as
        | ExecutionStep
        | undefined;

    const tabs = [
        { id: "variables" as VizTab, label: "Variables", icon: Table2 },
        { id: "callstack" as VizTab, label: "Call Stack", icon: Layers },
        { id: "timeline" as VizTab, label: "Timeline", icon: Activity },
    ];

    return (
        <div
            className="viz-panel flex flex-col h-full"
            style={{ borderLeft: "1px solid var(--color-border)" }}
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
                    <Eye size={14} style={{ color: "var(--color-neon-cyan)" }} />
                    <span className="text-xs font-semibold" style={{ color: "var(--color-text-secondary)" }}>
                        Visualization
                    </span>
                </div>
            </div>

            {/* ── Tab switcher ── */}
            <div className="flex border-b" style={{ borderColor: "var(--color-border)" }}>
                {tabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-1.5 px-3 py-2 text-[11px] font-medium transition-colors ${isActive
                                    ? "text-[var(--color-neon-cyan)] border-b border-[var(--color-neon-cyan)]"
                                    : "text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)]"
                                }`}
                        >
                            <Icon size={12} />
                            {tab.label}
                        </button>
                    );
                })}
            </div>

            {/* ── Content ── */}
            <div className="flex-1 overflow-auto p-3">
                <AnimatePresence mode="wait">
                    {/* Variables Tab */}
                    {activeTab === "variables" && (
                        <motion.div
                            key="variables"
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                        >
                            {step && Object.keys(step.variables).length > 0 ? (
                                <div className="space-y-2">
                                    {/* ── Step indicator ── */}
                                    <div className="text-[10px] font-mono mb-3" style={{ color: "var(--color-text-muted)" }}>
                                        Line {step.line} • Step {currentStep + 1}
                                    </div>

                                    {/* ── Variable cards ── */}
                                    {Object.values(step.variables).map((v: VariableSnapshot, i: number) => (
                                        <motion.div
                                            key={v.name}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: i * 0.05 }}
                                            className="flex items-center justify-between p-2.5 rounded-lg"
                                            style={{
                                                background: "var(--color-surface)",
                                                border: "1px solid var(--color-border)",
                                            }}
                                        >
                                            <div className="flex items-center gap-2">
                                                {/* Variable name */}
                                                <span
                                                    className="font-mono text-xs font-semibold"
                                                    style={{ color: "var(--color-neon-cyan)" }}
                                                >
                                                    {v.name}
                                                </span>
                                                {/* Type badge */}
                                                <span
                                                    className="text-[9px] px-1.5 py-0.5 rounded font-mono"
                                                    style={{
                                                        background: "var(--color-surface-active)",
                                                        color: "var(--color-text-muted)",
                                                    }}
                                                >
                                                    {v.type}
                                                </span>
                                                {/* Ownership badge (Rust) */}
                                                {v.ownership && (
                                                    <span
                                                        className="text-[9px] px-1.5 py-0.5 rounded font-mono"
                                                        style={{
                                                            background:
                                                                v.ownership === "owned"
                                                                    ? "rgba(57, 255, 20, 0.1)"
                                                                    : v.ownership === "borrowed"
                                                                        ? "rgba(0, 240, 255, 0.1)"
                                                                        : "rgba(255, 59, 92, 0.1)",
                                                            color:
                                                                v.ownership === "owned"
                                                                    ? "var(--color-success)"
                                                                    : v.ownership === "borrowed"
                                                                        ? "var(--color-neon-cyan)"
                                                                        : "var(--color-error)",
                                                        }}
                                                    >
                                                        {v.ownership}
                                                    </span>
                                                )}
                                            </div>
                                            {/* Value */}
                                            <span
                                                className="font-mono text-xs"
                                                style={{ color: "var(--color-gold)" }}
                                            >
                                                {v.value}
                                            </span>
                                        </motion.div>
                                    ))}
                                </div>
                            ) : (
                                <EmptyState message="Run code to see variable states" />
                            )}
                        </motion.div>
                    )}

                    {/* Call Stack Tab */}
                    {activeTab === "callstack" && (
                        <motion.div
                            key="callstack"
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                        >
                            {step && step.callStack.length > 0 ? (
                                <div className="space-y-1">
                                    {step.callStack.map((frame, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: i * 0.05 }}
                                            className="flex items-center gap-2 p-2 rounded-md"
                                            style={{
                                                background: i === step.callStack.length - 1
                                                    ? "var(--color-surface)"
                                                    : "transparent",
                                                borderLeft: i === step.callStack.length - 1
                                                    ? "2px solid var(--color-neon-cyan)"
                                                    : "2px solid transparent",
                                            }}
                                        >
                                            <ChevronRight
                                                size={10}
                                                style={{
                                                    color: i === step.callStack.length - 1
                                                        ? "var(--color-neon-cyan)"
                                                        : "var(--color-text-muted)",
                                                }}
                                            />
                                            <span
                                                className="font-mono text-xs"
                                                style={{
                                                    color: i === step.callStack.length - 1
                                                        ? "var(--color-text-primary)"
                                                        : "var(--color-text-muted)",
                                                }}
                                            >
                                                {frame}
                                            </span>
                                            {i === step.callStack.length - 1 && (
                                                <span
                                                    className="text-[9px] px-1 py-0.5 rounded"
                                                    style={{
                                                        background: "var(--color-neon-cyan-glow)",
                                                        color: "var(--color-neon-cyan)",
                                                    }}
                                                >
                                                    current
                                                </span>
                                            )}
                                        </motion.div>
                                    ))}
                                </div>
                            ) : (
                                <EmptyState message="Run code to see the call stack" />
                            )}
                        </motion.div>
                    )}

                    {/* Timeline Tab */}
                    {activeTab === "timeline" && (
                        <motion.div
                            key="timeline"
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                        >
                            {steps.length > 0 ? (
                                <div className="space-y-0">
                                    {steps.map((s, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ delay: i * 0.03 }}
                                            className="flex items-center gap-3 py-1.5"
                                        >
                                            {/* Step dot */}
                                            <div className="flex flex-col items-center">
                                                <div
                                                    className="w-2.5 h-2.5 rounded-full"
                                                    style={{
                                                        background:
                                                            i <= currentStep
                                                                ? "var(--color-gold)"
                                                                : "var(--color-surface-active)",
                                                        boxShadow:
                                                            i === currentStep
                                                                ? "0 0 8px var(--color-gold-glow)"
                                                                : "none",
                                                    }}
                                                />
                                                {i < steps.length - 1 && (
                                                    <div
                                                        className="w-px h-4"
                                                        style={{
                                                            background:
                                                                i < currentStep
                                                                    ? "var(--color-gold-dim)"
                                                                    : "var(--color-surface-active)",
                                                        }}
                                                    />
                                                )}
                                            </div>
                                            {/* Step info */}
                                            <div>
                                                <span
                                                    className="text-[11px] font-mono"
                                                    style={{
                                                        color:
                                                            i === currentStep
                                                                ? "var(--color-text-primary)"
                                                                : "var(--color-text-muted)",
                                                    }}
                                                >
                                                    Line {s.line}
                                                </span>
                                                {s.consoleOutput && (
                                                    <span
                                                        className="ml-2 text-[10px]"
                                                        style={{ color: "var(--color-success)" }}
                                                    >
                                                        → {s.consoleOutput}
                                                    </span>
                                                )}
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            ) : (
                                <EmptyState message="Run code to see execution timeline" />
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}

function EmptyState({ message }: { message: string }) {
    return (
        <div className="flex flex-col items-center justify-center py-12 gap-3 text-center">
            <Eye size={24} style={{ color: "var(--color-text-muted)", opacity: 0.3 }} />
            <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>
                {message}
            </p>
        </div>
    );
}
