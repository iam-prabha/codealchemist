"use client";

/**
 * TerminalPanel — Output display with execution status
 * Darkest background, collapsible, shows running/error/success states
 */

import * as Collapsible from "@radix-ui/react-collapsible";
import { useExecutionStore } from "@/stores";
import { Terminal, ChevronUp, ChevronDown, Trash2, Zap } from "lucide-react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

export default function TerminalPanel() {
    const reduced = useReducedMotion();
    const { 
        isTerminalOpen, 
        output, 
        error,
        isRunning,
        executionTimeMs,
        toggleTerminal, 
        setOutput,
        setError 
    } = useExecutionStore();

    const clearOutput = () => {
        setOutput("");
        setError(null);
    };

    const terminalOutput = output.split('\n').filter(line => line.trim() !== "");
    const hasOutput = terminalOutput.length > 0 || error;

    // Determine terminal state
    const getTerminalState = () => {
        if (isRunning) return "running";
        if (error) return "error";
        if (hasOutput) return "success";
        return "idle";
    };

    const state = getTerminalState();

    return (
        <Collapsible.Root 
            open={isTerminalOpen} 
            onOpenChange={toggleTerminal}
            className="shrink-0"
        >
            <Collapsible.Trigger asChild>
                <div 
                    className={cn(
                        "flex items-center justify-between px-4 py-2 cursor-pointer transition-all duration-200",
                        "border-t"
                    )}
                    style={{
                        background: "var(--color-panel)",
                        borderColor: "var(--color-border-dim)",
                    }}
                >
                    <div className="flex items-center gap-2">
                        <Terminal 
                            className="w-4 h-4" 
                            style={{ 
                                color: state === "error" 
                                    ? "var(--color-error)" 
                                    : state === "running"
                                    ? "var(--color-gold)"
                                    : "var(--color-text-muted)" 
                            }} 
                        />
                        <span 
                            className="text-xs font-mono font-bold uppercase tracking-wider"
                            style={{ 
                                color: state === "error" 
                                    ? "var(--color-error)" 
                                    : state === "running"
                                    ? "var(--color-gold)"
                                    : "var(--color-text-secondary)" 
                            }}
                        >
                            {state === "running" ? "⚗️ Transmuting..." : 
                             state === "error" ? "✗ Failed" :
                             state === "success" ? "✦ Complete" : 
                             "Terminal"}
                        </span>
                        
                        {/* Execution time */}
                        {executionTimeMs && (
                            <span 
                                className="text-[10px] font-mono ml-2"
                                style={{ color: "var(--color-text-muted)" }}
                            >
                                ↯ {executionTimeMs}ms
                            </span>
                        )}
                    </div>
                    
                    <div className="flex items-center gap-2">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                clearOutput();
                            }}
                            className="p-1 hover:bg-[var(--color-overlay)] rounded transition-colors"
                            aria-label="Clear terminal"
                            style={{ color: "var(--color-text-muted)" }}
                        >
                            <Trash2 className="w-3 h-3" />
                        </button>
                        
                        {isTerminalOpen ? (
                            <ChevronDown className="w-4 h-4" style={{ color: "var(--color-text-muted)" }} />
                        ) : (
                            <ChevronUp className="w-4 h-4" style={{ color: "var(--color-text-muted)" }} />
                        )}
                    </div>
                </div>
            </Collapsible.Trigger>

            <Collapsible.Content>
                <motion.div
                    initial={!reduced ? { height: 0 } : undefined}
                    animate={{ height: isTerminalOpen ? 160 : 0 }}
                    transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
                    className="overflow-hidden"
                    style={{ background: "var(--color-void)" }}
                >
                    <div 
                        className="h-[160px] overflow-y-auto custom-scrollbar font-mono text-xs"
                        style={{ fontFamily: "var(--font-mono)" }}
                    >
                        <AnimatePresence mode="wait">
                            {/* Running state */}
                            {isRunning && (
                                <motion.div
                                    key="running"
                                    initial={!reduced ? { opacity: 0 } : undefined}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="p-4"
                                >
                                    <div className="flex items-center gap-2 mb-2">
                                        <motion.span
                                            animate={{ opacity: [0.3, 1, 0.3] }}
                                            transition={{ duration: 1, repeat: Infinity }}
                                            style={{ color: "var(--color-gold)" }}
                                        >
                                            ⚗️
                                        </motion.span>
                                        <span style={{ color: "var(--color-gold)" }}>
                                            Transmuting...
                                        </span>
                                        <div className="flex gap-1 ml-1">
                                            <span className="pacing-dot" style={{ color: "var(--color-gold)" }}>•</span>
                                            <span className="pacing-dot" style={{ color: "var(--color-gold)" }}>•</span>
                                            <span className="pacing-dot" style={{ color: "var(--color-gold)" }}>•</span>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {/* Error state */}
                            {!isRunning && error && (
                                <motion.div
                                    key="error"
                                    initial={!reduced ? { opacity: 0, x: -4 } : undefined}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0 }}
                                    className="p-4"
                                >
                                    <div className="flex items-center gap-2 mb-2" style={{ color: "var(--color-error)" }}>
                                        <span>✗</span>
                                        <span className="font-semibold">Transmutation failed.</span>
                                    </div>
                                    <pre 
                                        className="whitespace-pre-wrap"
                                        style={{ color: "rgba(239, 68, 68, 0.9)" }}
                                    >
                                        {error}
                                    </pre>
                                </motion.div>
                            )}

                            {/* Success state with output */}
                            {!isRunning && !error && hasOutput && (
                                <motion.div
                                    key="success"
                                    initial={!reduced ? { opacity: 0 } : undefined}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="p-4"
                                >
                                    <div className="flex items-center gap-2 mb-2" style={{ color: "var(--color-success)" }}>
                                        <Zap size={12} />
                                        <span className="font-semibold">Transmutation complete.</span>
                                    </div>
                                    <div className="space-y-0.5">
                                        {terminalOutput.map((line, index) => (
                                            <motion.div
                                                key={index}
                                                initial={!reduced ? { opacity: 0, x: -4 } : undefined}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: index * 0.03 }}
                                                className="flex"
                                            >
                                                <span className="mr-2" style={{ color: "var(--color-gold)" }}>$</span>
                                                <span style={{ color: "var(--color-text-primary)" }}>
                                                    {line}
                                                </span>
                                            </motion.div>
                                        ))}
                                    </div>
                                </motion.div>
                            )}

                            {/* Idle state */}
                            {!isRunning && !error && !hasOutput && (
                                <motion.div
                                    key="idle"
                                    initial={!reduced ? { opacity: 0 } : undefined}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="p-4"
                                >
                                    <span style={{ color: "var(--color-text-muted)", fontStyle: "italic" }}>
                                        ⚗️ Awaiting transmutation...
                                    </span>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </motion.div>
            </Collapsible.Content>
        </Collapsible.Root>
    );
}
