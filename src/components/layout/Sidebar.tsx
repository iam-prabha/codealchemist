"use client";

/**
 * Sidebar — Layer Navigation
 * Shows curriculum layers with progress tracking
 */

import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
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
    Check,
} from "lucide-react";
import { useEditorStore, useProgressStore } from "@/stores";
import { CURRICULUM_LAYERS, getLayerCompletion } from "@/data/curriculum";
import { cn } from "@/lib/utils";
import { useState } from "react";

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
    const reduced = useReducedMotion();
    const { activeLayerId, setActiveLayerId } = useEditorStore();
    const { xp, streak, completed } = useProgressStore();
    const [isExpanded, setIsExpanded] = useState(true);

    const toggleExpand = () => setIsExpanded(!isExpanded);

    return (
        <aside className="flex flex-col h-full">
            {/* Header */}
            <div 
                className="flex items-center justify-between px-3 py-3 cursor-pointer"
                style={{ borderBottom: "1px solid var(--color-border-dim)" }}
                onClick={toggleExpand}
            >
                <span 
                    className="text-[10px] font-semibold uppercase tracking-widest"
                    style={{ color: "var(--color-text-muted)" }}
                >
                    Layers
                </span>
                <motion.button
                    whileHover={!reduced ? { scale: 1.1 } : undefined}
                    whileTap={!reduced ? { scale: 0.9 } : undefined}
                    className="p-1 rounded hover:bg-[var(--color-overlay)] transition-colors"
                    aria-label={isExpanded ? "Collapse" : "Expand"}
                >
                    <motion.div
                        animate={{ rotate: isExpanded ? 0 : -90 }}
                        transition={{ duration: 0.2 }}
                    >
                        <ChevronRight size={14} style={{ color: "var(--color-text-muted)" }} />
                    </motion.div>
                </motion.button>
            </div>

            {/* Layer List */}
            <AnimatePresence>
                {isExpanded && (
                    <motion.nav
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="flex-1 overflow-y-auto py-2"
                    >
                        {CURRICULUM_LAYERS.map((layer) => {
                            const isActive = layer.id === activeLayerId;
                            const completion = getLayerCompletion(layer.id, completed);
                            const hasContent = layer.exercises.length > 0;
                            const isCompleted = completion === 100;

                            return (
                                <motion.button
                                    key={layer.id}
                                    whileHover={!reduced ? { x: 3 } : undefined}
                                    whileTap={!reduced ? { scale: 0.98 } : undefined}
                                    onClick={() => hasContent && setActiveLayerId(layer.id)}
                                    disabled={!hasContent}
                                    className={cn(
                                        "w-full flex items-center gap-2 px-3 py-2.5 text-sm transition-all duration-200",
                                        isActive ? "border-l-2" : "border-l-2 border-l-transparent"
                                    )}
                                    style={{
                                        background: isActive ? "var(--color-gold-subtle)" : "transparent",
                                        borderColor: isActive ? "var(--color-gold)" : "transparent",
                                        color: isActive 
                                            ? "var(--color-text-primary)" 
                                            : hasContent 
                                            ? "var(--color-text-secondary)" 
                                            : "var(--color-text-muted)",
                                        opacity: hasContent ? 1 : 0.4,
                                        cursor: hasContent ? "pointer" : "not-allowed",
                                    }}
                                >
                                    {/* Completion check or number */}
                                    <span 
                                        className="w-4 h-4 flex items-center justify-center text-[10px]"
                                        style={{
                                            color: isCompleted 
                                                ? "var(--color-success)" 
                                                : isActive 
                                                ? "var(--color-gold)" 
                                                : "var(--color-text-muted)",
                                        }}
                                    >
                                        {isCompleted ? (
                                            <Check size={12} />
                                        ) : (
                                            String(layer.id).padStart(2, "0")
                                        )}
                                    </span>

                                    {/* Layer Icon */}
                                    <span 
                                        className="w-4 h-4 flex items-center justify-center"
                                        style={{
                                            color: isActive 
                                                ? "var(--color-gold)" 
                                                : "var(--color-text-muted)",
                                        }}
                                    >
                                        {LAYER_ICONS[String(layer.id).padStart(2, '0')]}
                                    </span>

                                    {/* Layer Title */}
                                    <span className="flex-1 text-left truncate text-xs">
                                        {layer.title}
                                    </span>

                                    {/* Progress */}
                                    {hasContent && (
                                        <span 
                                            className="text-[10px]"
                                            style={{ 
                                                color: completion === 100 
                                                    ? "var(--color-success)" 
                                                    : "var(--color-text-muted)" 
                                            }}
                                        >
                                            {completion}%
                                        </span>
                                    )}
                                </motion.button>
                            );
                        })}
                    </motion.nav>
                )}
            </AnimatePresence>

            {/* Footer Stats */}
            <div 
                className="p-3 border-t space-y-2"
                style={{ borderColor: "var(--color-border-dim)" }}
            >
                {/* XP */}
                <div className="flex items-center gap-2 text-xs">
                    <Zap size={12} style={{ color: "var(--color-gold)" }} />
                    <span style={{ color: "var(--color-gold)" }}>{xp} XP</span>
                </div>
                
                {/* Streak */}
                {streak > 0 && (
                    <div className="flex items-center gap-2 text-xs">
                        <Flame size={12} style={{ color: "var(--color-warning)" }} />
                        <span style={{ color: "var(--color-warning)" }}>{streak} day streak</span>
                    </div>
                )}
            </div>
        </aside>
    );
}
