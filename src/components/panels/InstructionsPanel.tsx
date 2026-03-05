"use client";

import { motion } from "framer-motion";
import { useEditorStore } from "@/store/useEditorStore";
import { getChapter } from "@/lib/sampleData";
import StepNavigator from "./StepNavigator";
import HintsAccordion from "./HintsAccordion";
import { BookOpen, Lightbulb } from "lucide-react";

export default function InstructionsPanel() {
    const { activeChapterId, currentStep, totalSteps, activeLanguage } = useEditorStore();
    const chapter = getChapter(activeChapterId);
    const exercise = chapter?.exercises[0];

    if (!chapter || !exercise) {
        return (
            <div className="flex items-center justify-center h-full text-text-muted">
                Select a chapter to begin
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col bg-background">
            {/* Step Navigator */}
            <div className="shrink-0 border-b border-border">
                <StepNavigator
                    currentStep={currentStep}
                    totalSteps={totalSteps}
                    title={`${exercise.title} (${currentStep}/${totalSteps})`}
                />
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto custom-scrollbar">
                <div className="p-4 md:p-6">
                    {/* Exercise Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white/5 backdrop-blur-sm border border-border rounded-2xl p-6 mb-6"
                    >
                        <div className="flex items-start gap-4 mb-4">
                            <div className="w-12 h-12 rounded-xl bg-gold/20 flex items-center justify-center shrink-0">
                                <BookOpen className="w-6 h-6 text-gold" />
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-text-primary mb-1">
                                    {exercise.title}
                                </h2>
                                <p className="text-sm text-text-muted">
                                    {chapter.title} — Exercise {currentStep}
                                </p>
                            </div>
                        </div>

                        <div className="prose prose-invert prose-sm max-w-none">
                            <p className="text-text-primary leading-relaxed">
                                {exercise.instructions}
                            </p>
                        </div>

                        {/* Hint button */}
                        <div className="mt-4 flex items-center gap-2">
                            <button className="flex items-center gap-2 px-3 py-1.5 text-sm text-accent-blue hover:bg-accent-blue/10 rounded-lg transition-colors">
                                <Lightbulb className="w-4 h-4" />
                                💡 Hint
                            </button>
                        </div>
                    </motion.div>

                    {/* Hints Accordion */}
                    {exercise.hints.length > 0 && (
                        <HintsAccordion hints={exercise.hints} />
                    )}
                </div>
            </div>
        </div>
    );
}
