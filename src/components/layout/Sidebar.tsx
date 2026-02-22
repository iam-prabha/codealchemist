"use client";

/**
 * Sidebar — Navigation through 12 curriculum layers
 * Features: layer list, progress indicators, XP display
 */

import { motion } from "framer-motion";
import { useEditorStore, useProgressStore } from "@/stores";
import { CURRICULUM_LAYERS, getLayerCompletion } from "@/data/curriculum";
import { cn } from "@/lib/utils";

export default function Sidebar() {
    const { activeLayerId, setActiveLayerId, sidebarOpen, toggleSidebar } = useEditorStore();
    const { xp, streak, completed } = useProgressStore();

    return (
        <>
            {/* Mobile backdrop */}
            {sidebarOpen && (
                <div 
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
                    onClick={toggleSidebar}
                />
            )}
            
            <aside 
                className={cn(
                    "app-sidebar flex flex-col z-50",
                    "fixed inset-y-0 left-0 w-[280px] lg:static lg:w-auto transform transition-transform duration-300 ease-in-out",
                    sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
                )}
            >
            {/* ── Logo ── */}
            <div className="p-5 border-b border-[var(--color-border)]">
                <h1 className="text-lg font-bold tracking-tight" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
                    <span className="shimmer-gold">⚗️ CodeAlchemist</span>
                </h1>
                <p className="text-xs mt-1" style={{ color: "var(--color-text-muted)" }}>
                    Transmute code into mastery
                </p>
            </div>

            {/* ── Stats Bar ── */}
            <div className="flex items-center gap-4 px-5 py-3 border-b border-[var(--color-border)]">
                <div className="flex items-center gap-1.5 text-xs">
                    <span>✨</span>
                    <span style={{ color: "var(--color-gold)" }}>{xp} XP</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs">
                    <span>🔥</span>
                    <span style={{ color: "var(--color-warning)" }}>{streak} streak</span>
                </div>
            </div>

            {/* ── Layer List ── */}
            <nav className="flex-1 overflow-y-auto py-2">
                <div className="px-4 py-2">
                    <span
                        className="text-[10px] font-semibold uppercase tracking-widest"
                        style={{ color: "var(--color-text-muted)" }}
                    >
                        Concept Layers
                    </span>
                </div>
                {CURRICULUM_LAYERS.map((layer) => {
                    const isActive = layer.id === activeLayerId;
                    const completion = getLayerCompletion(layer.id, completed);
                    const hasContent = layer.exercises.length > 0;

                    return (
                        <motion.button
                            key={layer.id}
                            whileHover={{ x: 4 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setActiveLayerId(layer.id)}
                            disabled={!hasContent}
                            className={cn(
                                "w-full text-left px-4 py-3 flex items-start gap-3 transition-all duration-200 group",
                                "border-l-2 border-transparent",
                                isActive && "border-l-[var(--color-gold)] bg-[var(--color-surface)]",
                                !isActive && hasContent && "hover:bg-[var(--color-surface-hover)]",
                                !hasContent && "opacity-40 cursor-not-allowed"
                            )}
                        >
                            {/* Layer icon */}
                            <span className="text-lg leading-none mt-0.5">{layer.icon}</span>

                            {/* Layer info */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                    <span
                                        className={cn(
                                            "text-[10px] font-mono",
                                            isActive ? "text-[var(--color-gold)]" : "text-[var(--color-text-muted)]"
                                        )}
                                    >
                                        {String(layer.id).padStart(2, "0")}
                                    </span>
                                    <span
                                        className={cn(
                                            "text-sm font-medium truncate",
                                            isActive ? "text-[var(--color-text-primary)]" : "text-[var(--color-text-secondary)]"
                                        )}
                                    >
                                        {layer.title}
                                    </span>
                                </div>

                                {/* Progress bar (only for layers with content) */}
                                {hasContent && (
                                    <div className="mt-1.5 h-1 rounded-full overflow-hidden" style={{ background: "var(--color-surface-active)" }}>
                                        <motion.div
                                            className="h-full rounded-full"
                                            style={{ background: "var(--color-gold)" }}
                                            initial={{ width: 0 }}
                                            animate={{ width: `${completion}%` }}
                                            transition={{ duration: 0.5, ease: "easeOut" }}
                                        />
                                    </div>
                                )}
                                {!hasContent && (
                                    <span className="text-[10px]" style={{ color: "var(--color-text-muted)" }}>
                                        Coming soon
                                    </span>
                                )}
                            </div>
                        </motion.button>
                    );
                })}
            </nav>

            {/* ── Footer ── */}
            <div className="p-4 border-t border-[var(--color-border)]">
                <div className="text-[10px] text-center" style={{ color: "var(--color-text-muted)" }}>
                    Built with ⚗️ by CodeAlchemist
                </div>
            </div>
        </aside>
        </>
    );
}
