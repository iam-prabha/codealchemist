"use client";

import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEditorStore } from "@/stores";
import { getLayer } from "@/data/curriculum";

interface StepNavigatorProps {
    currentStep: number;
    totalSteps: number;
    title: string;
}

export default function StepNavigator({
    currentStep,
    totalSteps,
    title,
}: StepNavigatorProps) {
    const { activeLayerId, activeExerciseIndex, setActiveExerciseIndex } = useEditorStore();
    const layer = getLayer(activeLayerId);
    const maxSteps = layer?.exercises.length || 1;

    const nextStep = () => {
        if (activeExerciseIndex < maxSteps - 1) {
            setActiveExerciseIndex(activeExerciseIndex + 1);
        }
    };

    const prevStep = () => {
        if (activeExerciseIndex > 0) {
            setActiveExerciseIndex(activeExerciseIndex - 1);
        }
    };

    return (
        <div className="flex items-center justify-between px-4 py-3 bg-surface">
            {/* Previous button */}
            <button
                onClick={prevStep}
                disabled={currentStep <= 1}
                className="p-2 hover:bg-panel rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                aria-label="Previous step"
            >
                <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Title and dots */}
            <div className="flex flex-col items-center gap-1">
                <span className="text-sm font-medium text-text-primary truncate max-w-[200px] sm:max-w-none">
                    {title}
                </span>
                <div className="flex items-center gap-1.5">
                    {Array.from({ length: totalSteps }).map((_, i) => (
                        <motion.div
                            key={i}
                            className={`w-2 h-2 rounded-full ${
                                i + 1 === currentStep
                                    ? "bg-gold"
                                    : i + 1 < currentStep
                                    ? "bg-gold/50"
                                    : "bg-border"
                            }`}
                            animate={{
                                scale: i + 1 === currentStep ? 1.2 : 1,
                            }}
                        />
                    ))}
                </div>
            </div>

            {/* Next button */}
            <button
                onClick={nextStep}
                disabled={currentStep >= totalSteps}
                className="p-2 hover:bg-panel rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                aria-label="Next step"
            >
                <ChevronRight className="w-5 h-5" />
            </button>
        </div>
    );
}
