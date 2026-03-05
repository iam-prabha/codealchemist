"use client";

/**
 * Sidebar — VS Code-style Explorer Panel
 * Collapsible file/tree navigation for curriculum layers
 */

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
    ChevronRight, 
    ChevronDown, 
    BookOpen, 
    CheckCircle2, 
    Circle,
    Flame,
    Code2,
    Database,
    Lock,
    GitBranch,
    Terminal,
    Zap,
    Atom,
    Sparkles,
    Blocks,
    Cpu,
    Variable,
    List,
    Hash,
    FunctionSquare,
    Binary,
    TerminalSquare,
    ArrowRightLeft,
    Boxes,
    Layers,
    Puzzle,
    Beaker,
    Microscope,
    Feather,
    FileCode,
    FileJson,
    FileText,
    Folder,
    FolderOpen
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

interface TreeItemProps {
    label: string;
    icon?: React.ReactNode;
    isActive?: boolean;
    isCompleted?: boolean;
    onClick?: () => void;
    children?: React.ReactNode;
    defaultExpanded?: boolean;
}

function TreeItem({ label, icon, isActive, isCompleted, onClick, children, defaultExpanded = false }: TreeItemProps) {
    const [expanded, setExpanded] = useState(defaultExpanded);
    const hasChildren = !!children;

    return (
        <div>
            <motion.button
                whileHover={{ x: 2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                    if (hasChildren) setExpanded(!expanded);
                    onClick?.();
                }}
                className={cn(
                    "w-full flex items-center gap-1.5 px-2 py-1.5 text-sm rounded-md transition-colors",
                    isActive 
                        ? "bg-[var(--color-surface-active)] text-[var(--color-text-primary)]" 
                        : "text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text-primary)]"
                )}
            >
                {hasChildren ? (
                    <span className="w-4 h-4 flex items-center justify-center">
                        {expanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
                    </span>
                ) : (
                    <span className="w-4" />
                )}
                
                {icon && <span className={cn("w-4 h-4", isCompleted ? "text-[var(--color-success)]" : "text-[var(--color-text-muted)]")}>
                    {isCompleted ? <CheckCircle2 size={14} /> : icon}
                </span>}
                
                <span className="flex-1 text-left truncate text-xs">{label}</span>
                
                {isCompleted && !icon && (
                    <CheckCircle2 size={12} className="text-[var(--color-success)]" />
                )}
            </motion.button>
            
            <AnimatePresence>
                {expanded && hasChildren && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="ml-3 border-l border-[var(--color-border)] pl-1"
                    >
                        {children}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default function Sidebar() {
    const { activeLayerId, setActiveLayerId, sidebarOpen, toggleSidebar } = useEditorStore();
    const { xp, streak, completed } = useProgressStore();

    const totalCompleted = completed.length;
    const totalExercises = CURRICULUM_LAYERS.reduce((acc, layer) => acc + layer.exercises.length, 0);

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
                    "flex flex-col z-50",
                    "fixed inset-y-0 left-0 w-[240px] lg:relative lg:translate-x-0 transition-transform duration-300",
                    sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
                )}
                style={{ background: "var(--color-abyss)" }}
            >
                {/* ── Explorer Header ── */}
                <div className="flex items-center justify-between px-3 py-2 border-b border-[var(--color-border)]">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
                        Explorer
                    </span>
                    <div className="flex items-center gap-1">
                        <button 
                            onClick={toggleSidebar}
                            className="p-1 rounded hover:bg-[var(--color-surface-hover)]"
                            aria-label="Collapse sidebar"
                        >
                            <ChevronRight size={14} className={cn("transition-transform", sidebarOpen && "rotate-180")} />
                        </button>
                    </div>
                </div>

                {/* ── CodeAlchemist Section (VS Code style) ── */}
                <div className="flex flex-col">
                    <div className="flex items-center gap-1.5 px-3 py-2 text-[11px] font-semibold uppercase tracking-wider text-[var(--color-text-muted)] hover:bg-[var(--color-surface-hover)] cursor-pointer">
                        <ChevronRight size={12} />
                        <span>CODEALCHEMIST</span>
                    </div>
                    
                    <div className="flex flex-col px-1">
                        {CURRICULUM_LAYERS.map((layer) => {
                            const isActive = layer.id === activeLayerId;
                            const completion = getLayerCompletion(layer.id, completed);
                            const hasContent = layer.exercises.length > 0;
                            const layerCompleted = completion === 100;
                            
                            return (
                                <TreeItem
                                    key={layer.id}
                                    label={layer.title}
                                    icon={LAYER_ICONS[String(layer.id).padStart(2, '0')]}
                                    isActive={isActive}
                                    isCompleted={layerCompleted}
                                    onClick={() => {
                                        setActiveLayerId(layer.id);
                                        if (window.innerWidth < 1024) toggleSidebar();
                                    }}
                                    defaultExpanded={isActive}
                                >
                                    {layer.exercises.slice(0, 5).map((exercise, idx) => (
                                        <TreeItem
                                            key={exercise.id}
                                            label={`${idx + 1}. ${exercise.title}`}
                                            isCompleted={completed.includes(exercise.id)}
                                            onClick={() => {
                                                setActiveLayerId(layer.id);
                                                if (window.innerWidth < 1024) toggleSidebar();
                                            }}
                                        />
                                    ))}
                                    {layer.exercises.length > 5 && (
                                        <TreeItem
                                            label={`+${layer.exercises.length - 5} more...`}
                                            onClick={() => {
                                                setActiveLayerId(layer.id);
                                                if (window.innerWidth < 1024) toggleSidebar();
                                            }}
                                        />
                                    )}
                                </TreeItem>
                            );
                        })}
                    </div>
                </div>

                {/* ── Progress Section ── */}
                <div className="mt-auto border-t border-[var(--color-border)] p-3">
                    <div className="flex items-center justify-between text-xs mb-2">
                        <span className="text-[var(--color-text-muted)]">Progress</span>
                        <span className="text-[var(--color-gold)]">{totalCompleted}/{totalExercises}</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-[var(--color-surface-active)] overflow-hidden">
                        <motion.div 
                            className="h-full rounded-full bg-[var(--color-gold)]"
                            initial={{ width: 0 }}
                            animate={{ width: `${(totalCompleted / totalExercises) * 100}%` }}
                        />
                    </div>
                    
                    <div className="flex items-center gap-3 mt-3">
                        <div className="flex items-center gap-1.5 text-xs">
                            <Zap size={12} className="text-[var(--color-gold)]" />
                            <span className="text-[var(--color-gold)]">{xp} XP</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs">
                            <Flame size={12} className="text-[var(--color-warning)]" />
                            <span className="text-[var(--color-warning)]">{streak} day streak</span>
                        </div>
                    </div>
                </div>
            </aside>
        </>
    );
}
