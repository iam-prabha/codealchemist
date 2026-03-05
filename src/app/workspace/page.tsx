"use client";

/**
 * CodeAlchemist — Main Application Page
 * VS Code-style workspace with collapsible sidebar, resizable panels
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

export default function WorkspacePage() {
    const {
        activeLayerId,
        activeExerciseIndex,
        activeLanguage,
        editorCode,
        setEditorCode,
        practiceMode,
        challengeStartTime,
        resetChallengeTimer,
        sidebarOpen,
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

            {/* Sidebar - collapsible on ALL screens */}
            <AnimatePresence>
                {sidebarOpen && <Sidebar />}
            </AnimatePresence>

            <TopBar />

            {/* Main content - adjusts based on sidebar */}
            <main className={cn(
                "flex flex-col h-screen pt-14 bg-[var(--color-void)] transition-all duration-300",
                sidebarOpen ? "pl-[220px]" : "pl-0"
            )}>
                <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
                    
                    {/* Main PanelGroup: Instructions | Editor+Terminal */}
                    <PanelGroup orientation="horizontal" className="flex-1">
                        
                        {/* Instructions Panel */}
                        <Panel 
                            defaultSize={30} 
                            minSize={20}
                            id="instructions"
                            className="flex flex-col h-full bg-[var(--color-surface)] border-r border-[var(--color-border)]"
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

                        {/* Resize Handle between Instructions and Editor */}
                        <PanelResizeHandle className="w-1 bg-[var(--color-void)] hover:bg-[var(--color-surface-active)] transition-colors cursor-col-resize flex items-center justify-center">
                            <div className="w-0.5 h-8 rounded-full bg-[var(--color-border)]" />
                        </PanelResizeHandle>

                        {/* Editor Panel - contains Editor + Terminal */}
                        <Panel 
                            defaultSize={70} 
                            minSize={40}
                            id="editor-panel"
                            className="flex flex-col h-full bg-[var(--color-deep)]"
                        >
                            {/* Vertical PanelGroup for Editor + Terminal */}
                            <PanelGroup orientation="vertical" id="editor-terminal" className="flex-1">
                                
                                {/* Code Editor */}
                                <Panel defaultSize={70} minSize={30} id="editor" className="flex flex-col relative">
                                    <div className="shrink-0 z-10">
                                        <EditorToolbar onExecute={handleExecute} />
                                    </div>
                                    <div className="flex-1 min-h-0 w-full relative">
                                        <CodeEditor
                                            onExecute={handleExecute}
                                            defaultCode={currentExercise?.starterCode[activeLanguage] || ""}
                                        />
                                    </div>
                                </Panel>

                                {/* Resize Handle between Editor and Terminal */}
                                <PanelResizeHandle className="h-1 bg-[var(--color-void)] hover:bg-[var(--color-surface-active)] transition-colors cursor-row-resize flex items-center justify-center">
                                    <div className="h-0.5 w-8 rounded-full bg-[var(--color-border)]" />
                                </PanelResizeHandle>

                                {/* Terminal */}
                                <Panel 
                                    defaultSize={30} 
                                    minSize={15}
                                    id="terminal"
                                    className="flex flex-col bg-[var(--color-abyss)]"
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
                                </Panel>
                            </PanelGroup>
                        </Panel>
                    </PanelGroup>
                </div>
            </main>
        </>
    );
}
