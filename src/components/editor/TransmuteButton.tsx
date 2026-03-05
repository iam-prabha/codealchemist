"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Sparkles } from "lucide-react";

interface TransmuteButtonProps {
    onClick: () => void;
    isLoading?: boolean;
}

export default function TransmuteButton({ onClick, isLoading = false }: TransmuteButtonProps) {
    const shouldReduceMotion = useReducedMotion();

    return (
        <motion.button
            onClick={onClick}
            disabled={isLoading}
            className="relative overflow-hidden group"
            whileHover={!shouldReduceMotion ? { scale: 1.02 } : undefined}
            whileTap={!shouldReduceMotion ? { scale: 0.98 } : undefined}
        >
            {/* Background gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-gold via-gold-bright to-gold-dim" />
            
            {/* Shimmer effect */}
            {!shouldReduceMotion && (
                <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                    animate={{ x: ["-100%", "100%"] }}
                    transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 2 }}
                />
            )}

            {/* Glow effect */}
            {!shouldReduceMotion && (
                <motion.div
                    className="absolute inset-0 rounded-full glow-gold opacity-0 group-hover:opacity-100"
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                />
            )}

            {/* Button content */}
            <div className="relative flex items-center justify-center gap-2 px-6 py-3 text-text-inverse font-bold">
                {isLoading ? (
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-5 h-5 border-2 border-text-inverse/30 border-t-text-inverse rounded-full"
                    />
                ) : (
                    <Sparkles className="w-5 h-5" />
                )}
                <span className="text-lg">✦ Transmute</span>
            </div>
        </motion.button>
    );
}
