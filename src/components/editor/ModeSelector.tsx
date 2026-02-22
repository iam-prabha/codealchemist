"use client";

import { motion } from "framer-motion";
import { BookOpen, Swords, Code2, LucideIcon } from "lucide-react";
import { useEditorStore } from "@/stores";
import type { PracticeMode } from "@/types";
import { cn } from "@/lib/utils";

const MODES: { id: PracticeMode; label: string; icon: LucideIcon; color: string; desc: string }[] = [
    {
        id: "guided",
        label: "Guided",
        icon: BookOpen,
        color: "var(--color-gold)",
        desc: "Step-by-step with hints and examples",
    },
    {
        id: "challenge",
        label: "Challenge",
        icon: Swords,
        color: "var(--color-neon-cyan)",
        desc: "No hints, timed, bonus XP",
    },
    {
        id: "playground",
        label: "Playground",
        icon: Code2,
        color: "var(--color-neon-magenta)",
        desc: "Blank canvas, no rules",
    },
];

export default function ModeSelector() {
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

        // Hide example if it's open when switching modes
        if (exampleRevealed) {
            toggleExample();
        }

        if (modeId === "challenge") {
            resetChallengeTimer();
        } else {
            clearChallengeTimer();
        }

        if (modeId === "playground") {
            // Clear editor code for the current language
            setEditorCode(activeLanguage, "");
        }
    };

    return (
        <div
            className="flex items-center gap-1 p-1.5"
            style={{
                background: "var(--color-deep)",
                borderBottom: "1px solid var(--color-border)",
            }}
        >
            <span
                className="text-[10px] font-semibold uppercase tracking-widest px-2"
                style={{ color: "var(--color-text-muted)" }}
            >
                Mode
            </span>
            <div className="flex bg-abyss rounded-lg p-0.5 border border-(--color-border)">
                {MODES.map((mode) => {
                    const isActive = practiceMode === mode.id;
                    const Icon = mode.icon;

                    return (
                        <button
                            key={mode.id}
                            onClick={() => handleModeChange(mode.id)}
                            className={cn(
                                "relative flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors",
                                isActive ? "text-text-primary" : "text-text-muted hover:text-text-secondary"
                            )}
                            title={mode.desc}
                        >
                            {isActive && (
                                <motion.div
                                    layoutId="mode-selector-bg"
                                    className="absolute inset-0 rounded-md bg-surface"
                                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                    style={{
                                        borderBottom: `2px solid ${mode.color}`,
                                    }}
                                />
                            )}
                            <Icon
                                size={14}
                                className="relative z-10"
                                style={{ color: isActive ? mode.color : "inherit" }}
                            />
                            <span className="relative z-10">{mode.label}</span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
