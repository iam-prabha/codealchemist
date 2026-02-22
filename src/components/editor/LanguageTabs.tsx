"use client";

/**
 * LanguageTabs — Python | Rust | TypeScript tab switcher
 * Colored indicators per language with glow effect on active tab
 */

import { motion } from "framer-motion";
import { useEditorStore } from "@/stores";
import { LANGUAGES, type Language } from "@/types";
import { cn } from "@/lib/utils";

const TAB_ORDER: Language[] = ["python", "rust", "typescript"];

export default function LanguageTabs() {
    const { activeLanguage, setActiveLanguage } = useEditorStore();

    return (
        <div
            className="flex items-center border-b"
            style={{ borderColor: "var(--color-border)" }}
        >
            {TAB_ORDER.map((lang) => {
                const config = LANGUAGES[lang];
                const isActive = activeLanguage === lang;

                return (
                    <motion.button
                        key={lang}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => setActiveLanguage(lang)}
                        className={cn(
                            "relative flex items-center gap-2 px-5 py-3 text-sm font-medium transition-all duration-200",
                            isActive
                                ? "text-[var(--color-text-primary)]"
                                : "text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)]"
                        )}
                    >
                        {/* Language icon */}
                        <span className="text-base">{config.icon}</span>

                        {/* Language name */}
                        <span style={{ fontFamily: "Space Grotesk, sans-serif" }}>
                            {config.label}
                        </span>

                        {/* Active indicator line */}
                        {isActive && (
                            <motion.div
                                layoutId="activeLanguageTab"
                                className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full"
                                style={{
                                    background: config.color,
                                    boxShadow: `0 0 12px ${config.color}66`,
                                }}
                                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                            />
                        )}
                    </motion.button>
                );
            })}

            {/* ── Right side: file extension indicator ── */}
            <div className="ml-auto pr-4 flex items-center gap-1.5">
                <span
                    className="text-[10px] font-mono px-2 py-0.5 rounded"
                    style={{
                        background: LANGUAGES[activeLanguage].color + "22",
                        color: LANGUAGES[activeLanguage].color,
                    }}
                >
                    {LANGUAGES[activeLanguage].fileExt}
                </span>
            </div>
        </div>
    );
}
