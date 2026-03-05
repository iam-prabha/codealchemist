"use client";

import * as Collapsible from "@radix-ui/react-collapsible";
import { useUIStore } from "@/store/useUIStore";
import { Terminal, ChevronUp, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function TerminalPanel() {
    const { terminalOpen, terminalOutput, toggleTerminal, clearOutput } = useUIStore();

    return (
        <Collapsible.Root open={terminalOpen} onOpenChange={toggleTerminal}>
            <Collapsible.Trigger asChild>
                <div className="flex items-center justify-between px-4 py-3 bg-surface border-t border-border cursor-pointer hover:bg-panel/50 transition-colors">
                    <div className="flex items-center gap-2">
                        <Terminal className="w-4 h-4 text-text-muted" />
                        <span className="text-xs font-mono font-bold text-text-secondary">
                            Terminal
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                clearOutput();
                            }}
                            className="p-1 hover:bg-panel rounded transition-colors"
                            aria-label="Clear terminal"
                        >
                            <Trash2 className="w-3 h-3 text-text-muted" />
                        </button>
                        <ChevronUp className="w-4 h-4 text-text-muted transition-transform" />
                    </div>
                </div>
            </Collapsible.Trigger>

            <Collapsible.Content>
                <div className="h-[120px] lg:h-[150px] bg-abyss overflow-y-auto custom-scrollbar font-mono text-sm">
                    <AnimatePresence mode="wait">
                        {terminalOutput.length === 0 ? (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="p-4 text-text-muted"
                            >
                                <span className="text-accent-green">$</span> Ready to transmute...
                            </motion.div>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                            >
                                {terminalOutput.map((line, index) => (
                                    <div
                                        key={index}
                                        className={`px-4 py-1 ${
                                            line.startsWith("Error")
                                                ? "text-red-400"
                                                : line.startsWith("✓")
                                                ? "text-accent-green"
                                                : "text-text-primary"
                                        }`}
                                    >
                                        <span className="text-accent-green mr-2">$</span>
                                        {line}
                                    </div>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </Collapsible.Content>
        </Collapsible.Root>
    );
}
