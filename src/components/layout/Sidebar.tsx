"use client";

/**
 * Sidebar — Concept Layer Navigation
 * Simple vertical list of layers, hidden by default
 */

import { motion } from "framer-motion";
import { 
    ChevronRight,
    Beaker,
    Feather,
    Variable,
    FunctionSquare,
    List,
    Hash,
    TerminalSquare,
    ArrowRightLeft,
    Boxes,
    Layers,
    Puzzle,
    Microscope,
    Zap,
    Flame,
} from "lucide-react";
import { useEditorStore, useProgressStore } from "@/stores";
import { CURRICULUM_LAYERS, getLayerCompletion } from "@/data/curriculum";
import { cn } from "@/lib/utils";

const LAYER_ICONS: Record<string, React.ReactNode> = {
    "01": <Beaker className="w-4 h-4" />,
    "02": <Feather className="w-4 h-4" />,
    "03": <Variable className="w-4 h-4" />,
    "04": <FunctionSquare className="w-4 h-4" />,
    "05": <List className="w-4 h-4" />,
    "06": <Hash className="w-4 h-4" />,
    "07": <TerminalSquare className="w-4 h-4" />,
    "08": <ArrowRightLeft className="w-4 h-4" />,
    "09": <Boxes className="w-4 h-4" />,
    "10": <Layers className="w-4 h-4" />,
    "11": <Puzzle className="w-4 h-4" />,
    "12": <Microscope className="w-4 h-4" />,
};

export default function Sidebar() {
    const { activeLayerId, setActiveLayerId, sidebarOpen, toggleSidebar } = useEditorStore();
    const { xp, streak, completed } = useProgressStore();

    return (
        <aside 
            className={cn(
                "fixed inset-y-0 left-0 z-40 w-[220px] flex flex-col",
                "bg-[var(--color-abyss)] border-r border-[var(--color-border)]",
                "transform transition-transform duration-300 ease-in-out",
                sidebarOpen ? "translate-x-0" : "-translate-x-full"
            )}
        >
            {/* Header */}
            <div className="flex items-center justify-between px-3 py-3 border-b border-[var(--color-border)]">
                <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
                    Layers
                </span>
                <button 
                    onClick={toggleSidebar}
                    className="p-1 rounded hover:bg-[var(--color-surface-hover)] transition-colors"
                    aria-label="Close sidebar"
                >
                    <ChevronRight size={16} />
                </button>
            </div>

            {/* Layer List */}
            <nav className="flex-1 overflow-y-auto py-2">
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
                                "w-full flex items-center gap-3 px-3 py-2.5 text-sm transition-all duration-200",
                                "border-l-2",
                                isActive 
                                    ? "border-l-[var(--color-gold)] bg-[var(--color-surface)] text-[var(--color-text-primary)]"
                                    : "border-l-transparent text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)] hover:border-l-[var(--color-gold)]/30",
                                !hasContent && "opacity-40 cursor-not-allowed"
                            )}
                        >
                            {/* Layer Icon */}
                            <span className={cn(
                                "w-5 h-5 flex items-center justify-center",
                                isActive ? "text-[var(--color-gold)]" : "text-[var(--color-text-muted)]"
                            )}>
                                {LAYER_ICONS[String(layer.id).padStart(2, '0')]}
                            </span>

                            {/* Layer Number */}
                            <span className={cn(
                                "text-[10px] font-mono w-5",
                                isActive ? "text-[var(--color-gold)]" : "text-[var(--color-text-muted)]"
                            )}>
                                {String(layer.id).padStart(2, "0")}
                            </span>

                            {/* Layer Title */}
                            <span className="flex-1 text-left truncate text-xs">
                                {layer.title}
                            </span>

                            {/* Progress indicator */}
                            {hasContent && (
                                <span className="text-[10px] text-[var(--color-text-muted)]">
                                    {completion}%
                                </span>
                            )}
                        </motion.button>
                    );
                })}
            </nav>

            {/* Footer Stats */}
            <div className="p-3 border-t border-[var(--color-border)]">
                <div className="flex items-center gap-4 text-xs">
                    <div className="flex items-center gap-1.5">
                        <Zap size={12} className="text-[var(--color-gold)]" />
                        <span className="text-[var(--color-gold)]">{xp} XP</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <Flame size={12} className="text-[var(--color-warning)]" />
                        <span className="text-[var(--color-warning)]">{streak}</span>
                    </div>
                </div>
            </div>
        </aside>
    );
}
