"use client";

/**
 * CodeAlchemist — Main Application Page
 * Tab-based mobile layout, large touch targets, resizable panels
 */

import { useCallback, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import { Panel, Group as PanelGroup, Separator as PanelResizeHandle } from "react-resizable-panels";
import Sidebar from "@/components/layout/Sidebar";
import TopBar from "@/components/layout/TopBar";
import LanguageTabs from "@/components/editor/LanguageTabs";
import ModeSelector from "@/components/editor/ModeSelector";
import EditorToolbar from "@/components/editor/EditorToolbar";
import ExerciseInstructions from "@/components/editor/ExerciseInstructions";
import GoldenExample from "@/components/editor/GoldenExample";
import OutputPane from "@/components/editor/OutputPane";
import ParticleEffect from "@/components/effects/ParticleEffect";
import { useEditorStore, useExecutionStore, useProgressStore } from "@/stores";
import { getLayer } from "@/data/curriculum";
import { executeCode } from "@/lib/execution/executor";
import { cn } from "@/lib/utils";

const CodeEditor = dynamic(
    () => import("@/components/editor/CodeEditor"),
    {
        ssr: false,
        loading: () => (
            <div className="flex items-center justify-center h-full w-full bg-[var(--color-deep)] text-[var(--color-text-muted)]">
                <motion.div
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="text-sm"
                >
                    ⚗️ Loading editor...
                </motion.div>
            </div>
        ),
    }
);

type MobileTab = "editor" | "instructions";

export default function WorkspacePage() {
    const {
        activeLayerId,
        activeExerciseIndex,
        activeLanguage,
        editorCode,
        setEditorCode,
        practiceMode,
        challengeStartTime,
        resetChallengeTimer
    } = useEditorStore();

    const {
        isRunning,
        setIsRunning,
        setOutput,
        setError,
        setExecutionTimeMs,
        resetExecution,
        isTerminalOpen,
        setTerminalOpen,
    } = useExecutionStore();

    const { addXp, updateActivity, markCompleted } = useProgressStore();

    const layer = getLayer(activeLayerId);
    const currentExercise = layer?.exercises[activeExerciseIndex];

    const [mounted, setMounted] = useState(false);
    const [mobileTab, setMobileTab] = useState<MobileTab>("editor");

    useEffect(() => setMounted(true), []);

    useEffect(() => {
        if (currentExercise && !editorCode[activeLanguage]) {
            setEditorCode(activeLanguage, currentExercise.starterCode[activeLanguage] || "");
        }
    }, [activeLayerId, activeExerciseIndex, activeLanguage, currentExercise, editorCode, setEditorCode]);

    useEffect(() => {
        if (practiceMode === "challenge") {
            resetChallengeTimer();
        }
    }, [activeLayerId, activeExerciseIndex, practiceMode, resetChallengeTimer]);

    const handleExecute = useCallback(async () => {
        if (isRunning) return;

        const code = editorCode[activeLanguage];
        if (!code?.trim()) {
            setError("No code to transmute! Write some code first.");
            return;
        }

        resetExecution();
        setIsRunning(true);
        setTerminalOpen(true);

        try {
            const result = await executeCode(code, activeLanguage, false);

            setOutput(result.output);
            setError(result.error);
            setExecutionTimeMs(result.executionTimeMs);
            
            if (result.success && !result.error && practiceMode !== "playground") {
                addXp(10);
                updateActivity();

                if (currentExercise && result.output.trim() === currentExercise.expectedOutput[activeLanguage]?.trim()) {
                    let bonus = 50;
                    
                    if (practiceMode === "challenge" && challengeStartTime) {
                        const elapsedMs = Date.now() - challengeStartTime;
                        if (elapsedMs < 60000) {
                            bonus *= 2;
                        }
                    }
                    
                    addXp(bonus);
                    markCompleted(currentExercise.id);
                }
            }
        } catch (err) {
            setError(
                err instanceof Error ? err.message : "Transmutation failed unexpectedly"
            );
        } finally {
            setIsRunning(false);
        }
    }, [
        isRunning,
        activeLanguage,
        editorCode,
        currentExercise,
        resetExecution,
        setIsRunning,
        setOutput,
        setError,
        setExecutionTimeMs,
        setTerminalOpen,
        addXp,
        updateActivity,
        markCompleted,
        practiceMode,
        challengeStartTime,
    ]);

    if (!mounted) return null;

    return (
        <>
            <ParticleEffect count={15} />

            <Sidebar />
            <TopBar />

            {/* Mobile Tab Switcher - only visible on small screens */}
            <div className="fixed bottom-0 left-0 right-0 z-30 lg:hidden bg-[var(--color-surface)] border-t border-[var(--color-border)] flex">
                <button
                    onClick={() => setMobileTab("editor")}
                    className={cn(
                        "flex-1 py-4 text-sm font-medium transition-colors",
                        mobileTab === "editor"
                            ? "text-[var(--color-gold)] border-b-2 border-[var(--color-gold)]"
                            : "text-[var(--color-text-muted)]"
                    )}
                >
                    ✏️ Editor
                </button>
                <button
                    onClick={() => setMobileTab("instructions")}
                    className={cn(
                        "flex-1 py-4 text-sm font-medium transition-colors",
                        mobileTab === "instructions"
                            ? "text-[var(--color-gold)] border-b-2 border-[var(--color-gold)]"
                            : "text-[var(--color-text-muted)]"
                    )}
                >
                    📖 Instructions
                </button>
            </div>

            {/* Main content */}
            <main className="flex flex-col h-screen pt-14 lg:pl-[280px] pb-14 lg:pb-0 bg-[var(--color-void)]">
                <div className="flex-1 flex flex-col min-h-0">
                    
                    {/* Desktop: horizontal split | Mobile: tab-based */}
                    <PanelGroup orientation="horizontal" className="flex-1">
                        
                        {/* Instructions Panel - visible on desktop, or mobile when tab selected */}
                        <AnimatePresence mode="wait">
                            {(mobileTab === "instructions" || !mounted || window.innerWidth >= 1024) && (
                                <Panel 
                                    defaultSize={40} 
                                    minSize={25} 
                                    className={cn(
                                        "flex flex-col h-full bg-[var(--color-surface)] border-r border-[var(--color-border)]",
                                        "lg:flex", 
                                        mobileTab === "instructions" ? "absolute inset-0 z-20 w-full" : "hidden lg:flex"
                                    )}
                                >
                                    <div className="flex flex-col h-full overflow-hidden">
                                        <div className="shrink-0 z-10 border-b border-[var(--color-border)] shadow-sm">
                                            <LanguageTabs />
                                            <ModeSelector />
                                        </div>
                                        
                                        <div className="flex-1 overflow-y-auto custom-scrollbar">
                                            <div className="p-4 md:p-6 pb-24">
                                                <ExerciseInstructions />
                                                {currentExercise && practiceMode === "guided" && (
                                                    <div className="mt-8">
                                                        <GoldenExample exercise={currentExercise} />
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </Panel>
                            )}
                        </AnimatePresence>

                        {/* Resize Handle - only on desktop */}
                        <ResizeHandle className="hidden lg:flex" />

                        {/* Editor Panel - always visible */}
                        <Panel 
                            defaultSize={60} 
                            minSize={35} 
                            className={cn(
                                "flex flex-col h-full bg-[var(--color-deep)] relative",
                                mobileTab === "instructions" ? "hidden lg:flex" : "flex"
                            )}
                        >
                            <div className="shrink-0 z-10">
                                <EditorToolbar onExecute={handleExecute} />
                            </div>

                            <div className="flex-1 min-h-0 w-full relative">
                                <CodeEditor
                                    onExecute={handleExecute}
                                    defaultCode={currentExercise?.starterCode[activeLanguage] || ""}
                                />
                            </div>

                            {/* Terminal Drawer - 20% height */}
                            <motion.div 
                                initial={false}
                                animate={{ 
                                    height: isTerminalOpen ? "20%" : "0px",
                                    opacity: isTerminalOpen ? 1 : 0,
                                }}
                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                className="absolute bottom-0 left-0 right-0 bg-[var(--color-abyss)] border-t border-[var(--color-border)] z-20 shadow-2xl flex flex-col overflow-hidden"
                            >
                                <div 
                                    className="flex items-center justify-between px-4 py-3 bg-[var(--color-surface)] border-b border-[var(--color-border)] cursor-pointer select-none min-h-[44px]"
                                    onClick={() => setTerminalOpen(!isTerminalOpen)}
                                >
                                    <span className="text-xs font-mono font-bold text-[var(--color-text-secondary)]">
                                        {isRunning ? "⚡ Running..." : "📟 Terminal"}
                                    </span>
                                    <button 
                                        className="text-[var(--color-text-muted)] hover:text-white transition-colors p-2 min-w-[44px] min-h-[44px] flex items-center justify-center"
                                        aria-label="Toggle terminal"
                                    >
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <polyline points={isTerminalOpen ? "6 15 12 9 18 15" : "6 9 12 15 18 9"}></polyline>
                                        </svg>
                                    </button>
                                </div>
                                
                                <div className="flex-1 overflow-auto min-h-0">
                                    <OutputPane />
                                </div>
                            </motion.div>
                        </Panel>
                    </PanelGroup>
                </div>
            </main>
        </>
    );
}

function ResizeHandle({ className }: { className?: string }) {
    return (
        <PanelResizeHandle className={cn("flex items-center justify-center transition-colors bg-[var(--color-void)] hover:bg-[var(--color-surface-active)] w-1 cursor-col-resize h-full", className)}>
            <div className="w-0.5 h-8 rounded-full bg-[var(--color-border)]" />
        </PanelResizeHandle>
    );
}
