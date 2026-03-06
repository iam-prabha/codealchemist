"use client";

/**
 * TransmuteButton — THE PRIMARY ACTION
 * Gold gradient with shimmer animation, Cinzel font
 */

import { motion, useReducedMotion } from "framer-motion";
import { Sparkles, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface TransmuteButtonProps {
    onClick: () => void;
    isLoading?: boolean;
    disabled?: boolean;
}

export default function TransmuteButton({ onClick, isLoading = false, disabled = false }: TransmuteButtonProps) {
    const reduced = useReducedMotion();

    return (
        <motion.button
            onClick={onClick}
            disabled={isLoading || disabled}
            whileHover={!reduced && !disabled ? { scale: 1.03 } : undefined}
            whileTap={!reduced && !disabled ? { scale: 0.97 } : undefined}
            className={cn(
                "relative overflow-hidden flex items-center gap-2 px-5 py-2.5 rounded-full font-semibold text-sm transition-all",
                disabled && "opacity-60 cursor-not-allowed"
            )}
            style={{
                background: disabled 
                    ? "var(--color-gold-dim)"
                    : "linear-gradient(135deg, var(--color-gold-dim), var(--color-gold), var(--color-gold-bright))",
                boxShadow: disabled 
                    ? "none"
                    : "0 4px 20px var(--color-gold-glow)",
                fontFamily: "var(--font-cinzel)",
                color: "var(--color-text-inverse)",
                border: "none",
                cursor: isLoading || disabled ? "not-allowed" : "pointer",
            }}
        >
            {/* Shimmer effect */}
            {!reduced && !disabled && (
                <motion.div
                    className="absolute inset-0"
                    style={{
                        background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent)",
                    }}
                    animate={{ x: ["-100%", "100%"] }}
                    transition={{ duration: 1.8, repeat: Infinity, repeatDelay: 2.5 }}
                />
            )}
            
            {/* Button content */}
            <span className="relative flex items-center gap-2">
                {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                    <Sparkles className="w-4 h-4" />
                )}
                <span>{isLoading ? "⚗️ Transmuting..." : "✦ Transmute"}</span>
            </span>

            {/* Keyboard hint */}
            <span 
                className="hidden lg:inline text-[10px] ml-2 opacity-60"
                style={{ fontFamily: "var(--font-mono)" }}
            >
                Ctrl+Enter
            </span>
        </motion.button>
    );
}
