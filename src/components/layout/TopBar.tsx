"use client";

/**
 * TopBar — Application header with mode selector, breadcrumb, and auth controls
 * Height: 52px, Dark panel background with gold accents
 */

import { useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import {
    EyeOff,
    Menu,
    Zap,
    FlaskConical,
    LogIn,
    PanelLeftClose,
    PanelLeft,
} from "lucide-react";
import { useEditorStore, useProgressStore } from "@/stores";
import { CURRICULUM_LAYERS } from "@/data/curriculum";
import { cn } from "@/lib/utils";
import { useSession } from "@/lib/auth-client";
import UserMenu from "@/components/auth/UserMenu";
import ModeSelector from "@/components/editor/ModeSelector";

export default function TopBar() {
    const reduced = useReducedMotion();
    const {
        activeLayerId,
        exampleRevealed,
        toggleExample,
        toggleSidebar,
        sidebarOpen,
        activeExerciseIndex,
    } = useEditorStore();
    const { xp, streak } = useProgressStore();
    const { data: session, isPending } = useSession();

    const activeLayer = CURRICULUM_LAYERS.find((l) => l.id === activeLayerId);
    const isAuthenticated = !!session?.user;
    const currentStep = activeExerciseIndex + 1;
    const totalSteps = activeLayer?.exercises.length || 0;

    return (
        <motion.header
            initial={!reduced ? { opacity: 0, y: -10 } : undefined}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
            className="flex items-center justify-between px-4 h-[52px] shrink-0"
            style={{
                background: "var(--color-panel)",
                borderBottom: "1px solid var(--color-border-dim)",
                gridArea: "topnav",
            }}
        >
            {/* Left: Sidebar toggle + Logo */}
            <div className="flex items-center gap-3">
                <button
                    onClick={toggleSidebar}
                    className={cn(
                        "p-2 rounded-md hover:bg-[var(--color-overlay)] min-w-[40px] min-h-[40px] items-center justify-center transition-colors",
                        sidebarOpen ? "text-[var(--color-gold)]" : "text-[var(--color-text-muted)]"
                    )}
                    aria-label={sidebarOpen ? "Close Explorer" : "Open Explorer"}
                >
                    {sidebarOpen ? <PanelLeftClose size={18} /> : <PanelLeft size={18} />}
                </button>

                <Link
                    href="/"
                    className="flex items-center gap-2 group"
                    title="Back to home"
                >
                    <span className="text-lg">⚗️</span>
                    <span
                        className="font-semibold text-lg tracking-wide hidden sm:block"
                        style={{ 
                            fontFamily: "var(--font-cinzel)", 
                            color: "var(--color-gold)" 
                        }}
                    >
                        CodeAlchemist
                    </span>
                </Link>
            </div>

            {/* Center: Mode Selector */}
            <div className="hidden md:block">
                <ModeSelector />
            </div>

            {/* Right: Breadcrumb + Stats + Auth */}
            <div className="flex items-center gap-3">
                {/* Breadcrumb */}
                <span 
                    className="text-xs hidden lg:block"
                    style={{ color: "var(--color-text-muted)" }}
                >
                    Layer {String(activeLayerId).padStart(2, "0")} · Formula {currentStep} of {totalSteps}
                </span>

                {/* Streak */}
                {streak > 0 && (
                    <div 
                        className="hidden sm:flex items-center gap-1 px-2 py-1 rounded-full"
                        style={{ background: "var(--color-overlay)" }}
                    >
                        <span className="text-xs">🔥</span>
                        <span 
                            className="text-xs font-medium"
                            style={{ color: "var(--color-warning)" }}
                        >
                            {streak}
                        </span>
                    </div>
                )}

                {/* XP Badge */}
                <div 
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
                    style={{ 
                        background: "var(--color-gold-subtle)",
                        border: "1px solid var(--color-gold-dim)"
                    }}
                >
                    <Zap size={14} style={{ color: "var(--color-gold)" }} />
                    <span 
                        className="text-xs font-mono font-medium"
                        style={{ color: "var(--color-gold)" }}
                    >
                        {xp} XP
                    </span>
                </div>

                {/* Toggle Golden Example */}
                <motion.button
                    whileHover={!reduced ? { scale: 1.05 } : undefined}
                    whileTap={!reduced ? { scale: 0.95 } : undefined}
                    onClick={toggleExample}
                    className={cn(
                        "hidden sm:flex items-center gap-1 px-2 md:px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
                        exampleRevealed
                            ? "bg-[var(--color-gold)] text-[var(--color-text-inverse)]"
                            : "glass glass-hover"
                    )}
                    style={!exampleRevealed ? { color: "var(--color-gold)" } : {}}
                >
                    {exampleRevealed ? (
                        <>
                            <EyeOff size={14} /> 
                            <span className="hidden md:inline">Hide</span>
                        </>
                    ) : (
                        <>
                            <FlaskConical size={14} /> 
                            <span className="hidden md:inline">Reveal</span>
                        </>
                    )}
                </motion.button>

                {/* Auth */}
                {isPending ? (
                    <div
                        className="w-20 h-8 rounded-lg animate-pulse"
                        style={{ background: "var(--color-elevated)" }}
                    />
                ) : isAuthenticated ? (
                    <UserMenu />
                ) : (
                    <motion.button
                        whileHover={!reduced ? { scale: 1.05 } : undefined}
                        whileTap={!reduced ? { scale: 0.95 } : undefined}
                        onClick={() => window.location.href = "/sign-in"}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium glass glass-hover"
                        style={{ color: "var(--color-gold)" }}
                    >
                        <LogIn size={14} />
                        <span className="hidden sm:inline">Sign In</span>
                    </motion.button>
                )}
            </div>
        </motion.header>
    );
}
