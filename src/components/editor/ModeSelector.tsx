"use client";

/**
 * ModeSelector — Radix-style toggle with sliding pill animation
 * Three modes: Guided | Challenge | Playground
 */

import { motion, useReducedMotion } from "framer-motion";
import { BookOpen, Swords, Flame, LucideIcon } from "lucide-react";
import { useEditorStore } from "@/stores";
import type { PracticeMode } from "@/types";
import { cn } from "@/lib/utils";

const MODES: { id: PracticeMode; label: string; icon: LucideIcon; color: string }[] = [
    { id: "guided", label: "Guided", icon: BookOpen, color: "var(--color-gold)" },
    { id: "challenge", label: "Challenge", icon: Swords, color: "var(--color-python)" },
    { id: "playground", label: "Forge", icon: Flame, color: "var(--color-typescript)" },
];

export default function ModeSelector() {
    const reduced = useReducedMotion();
    const {
        practiceMode,
        setPracticeMode,
        resetChallengeTimer,
        clearChallengeTimer,
        setEditorCode,
        activeLanguage,
        exampleRevealed,
        toggleExample,
    } = useEditorStore();

    const handleModeChange = (modeId: PracticeMode) => {
        if (modeId === practiceMode) return;

        setPracticeMode(modeId);

        if (exampleRevealed) {
            toggleExample();
        }

        if (modeId === "challenge") {
            resetChallengeTimer();
        } else {
            clearChallengeTimer();
        }

        if (modeId === "playground") {
            setEditorCode(activeLanguage, "");
        }
    };

    const activeIndex = MODES.findIndex((m) => m.id === practiceMode);

    return (
        <div
            className="flex items-center rounded-full p-0.5"
            style={{
                background: "var(--color-elevated)",
                border: "1px solid var(--color-border-dim)",
            }}
        >
            {MODES.map((mode, index) => {
                const isActive = practiceMode === mode.id;
                const Icon = mode.icon;

                return (
                    <button
                        key={mode.id}
                        onClick={() => handleModeChange(mode.id)}
                        className={cn(
                            "relative flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200",
                            isActive ? "z-10" : "hover:text-[var(--color-text-secondary)]"
                        )}
                        style={{
                            color: isActive ? "var(--color-text-primary)" : "var(--color-text-muted)",
                        }}
                    >
                        {isActive && !reduced && (
                            <motion.div
                                layoutId="mode-pill"
                                className="absolute inset-0 rounded-full"
                                style={{
                                    background: "var(--color-overlay)",
                                    border: `1px solid ${mode.color}`,
                                    boxShadow: `0 0 12px ${mode.color}20`,
                                }}
                                transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
                            />
                        )}
                        <Icon
                            size={13}
                            className="relative z-10"
                            style={{ 
                                color: isActive ? mode.color : "inherit"
                            }}
                        />
                        <span className="relative z-10">{mode.label}</span>
                    </button>
                );
            })}
        </div>
    );
}
