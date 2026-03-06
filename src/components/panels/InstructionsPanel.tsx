"use client";

/**
 * InstructionsPanel — Formula and hints display
 * Dot-grid background, glass morphism card
 */

import { motion, useReducedMotion } from "framer-motion";
import { useEditorStore } from "@/stores";
import { getLayer } from "@/data/curriculum";
import StepNavigator from "./StepNavigator";
import HintsAccordion from "./HintsAccordion";
import { BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";

export default function InstructionsPanel() {
    const reduced = useReducedMotion();
    const { activeLayerId, activeExerciseIndex } = useEditorStore();
    const layer = getLayer(activeLayerId);
    const currentStep = activeExerciseIndex + 1;
    const totalSteps = layer?.exercises.length || 0;
    const exercise = layer?.exercises[activeExerciseIndex];

    if (!layer || !exercise) {
        return (
            <div 
                className="flex items-center justify-center h-full"
                style={{ color: "var(--color-text-muted)" }}
            >
                Select a chapter to begin
            </div>
        );
    }

    return (
        <div 
            className={cn(
                "h-full flex flex-col dot-grid",
                "before:absolute before:inset-0 before:pointer-events-none"
            )}
            style={{ 
                background: "var(--color-surface)",
                position: "relative"
            }}
        >
            {/* Step Navigator */}
            <div 
                className="shrink-0"
                style={{ borderBottom: "1px solid var(--color-border-dim)" }}
            >
                <StepNavigator
                    currentStep={currentStep}
                    totalSteps={totalSteps}
                    title={exercise.title}
                />
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto custom-scrollbar">
                <div className="p-4 md:p-6 relative z-10">
                    {/* Exercise Card - Glass morphism */}
                    <motion.div
                        initial={!reduced ? { opacity: 0, y: 20 } : undefined}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                        className="glass rounded-xl p-5 mb-6"
                    >
                        <div className="flex items-start gap-4 mb-4">
                            <div 
                                className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                                style={{ background: "var(--color-gold-subtle)" }}
                            >
                                <BookOpen 
                                    className="w-5 h-5" 
                                    style={{ color: "var(--color-gold)" }} 
                                />
                            </div>
                            <div>
                                <h2 
                                    className="text-base font-semibold mb-1"
                                    style={{ 
                                        color: "var(--color-text-primary)",
                                        fontFamily: "var(--font-cinzel)" 
                                    }}
                                >
                                    {exercise.title}
                                </h2>
                                <p 
                                    className="text-xs"
                                    style={{ color: "var(--color-text-muted)" }}
                                >
                                    {layer.title} — Formula {currentStep}/{totalSteps}
                                </p>
                            </div>
                        </div>

                        <div className="space-y-1">
                            <p 
                                className="text-sm leading-relaxed"
                                style={{ 
                                    color: "var(--color-text-secondary)",
                                    lineHeight: 1.7 
                                }}
                            >
                                {exercise.instructions}
                            </p>
                        </div>
                    </motion.div>

                    {/* Hints Accordion */}
                    {exercise.hints && exercise.hints.length > 0 && (
                        <HintsAccordion hints={exercise.hints} />
                    )}
                </div>
            </div>
        </div>
    );
}
