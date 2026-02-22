"use client";

/**
 * CodeAlchemist — Main Application Page
 * Assembles all components into the lesson workspace
 */

import { useCallback, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { Panel, Group as PanelGroup, Separator as PanelResizeHandle } from "react-resizable-panels";
import Sidebar from "@/components/layout/Sidebar";
import TopBar from "@/components/layout/TopBar";
import LanguageTabs from "@/components/editor/LanguageTabs";
import ModeSelector from "@/components/editor/ModeSelector";
import EditorToolbar from "@/components/editor/EditorToolbar";
import ExerciseInstructions from "@/components/editor/ExerciseInstructions";
import GoldenExample from "@/components/editor/GoldenExample";
import OutputPane from "@/components/editor/OutputPane";
import VisualizationPanel from "@/components/visualization/VisualizationPanel";
import ParticleEffect from "@/components/effects/ParticleEffect";
import { useEditorStore, useExecutionStore, useProgressStore } from "@/stores";
import { getLayer } from "@/data/curriculum";
import { executeCode } from "@/lib/execution/executor";

// Dynamically import Monaco editor (no SSR)
const CodeEditor = dynamic(
    () => import("@/components/editor/CodeEditor"),
    {
        ssr: false,
        loading: () => (
            <div
                className="flex items-center justify-center h-full w-full"
                style={{
                    background: "var(--color-deep)",
                    color: "var(--color-text-muted)",
                }}
            >
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
        resetChallengeTimer
    } = useEditorStore();

    const {
        isRunning,
        setIsRunning,
        setOutput,
        setError,
        setExecutionTimeMs,
        resetExecution,
        debuggerActive,
        setTotalSteps,
        setCurrentStep,
        setSteps,
    } = useExecutionStore();

    const { addXp, updateActivity, markCompleted } = useProgressStore();

    const layer = getLayer(activeLayerId);
    const currentExercise = layer?.exercises[activeExerciseIndex];

    // Mounted state to avoid hydration mismatch with react-resizable-panels
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);

    // ── Load starter code when exercise or language changes ──
    useEffect(() => {
        if (currentExercise && !editorCode[activeLanguage]) {
            setEditorCode(activeLanguage, currentExercise.starterCode[activeLanguage] || "");
        }
    }, [activeLayerId, activeExerciseIndex, activeLanguage, currentExercise, editorCode, setEditorCode]);

    // ── Reset challenge timer when exercise changes ──
    useEffect(() => {
        if (practiceMode === "challenge") {
            resetChallengeTimer();
        }
    }, [activeLayerId, activeExerciseIndex, practiceMode, resetChallengeTimer]);

    // ── Execute code callback ──
    const handleExecute = useCallback(async () => {
        if (isRunning) return;

        const code = editorCode[activeLanguage];
        if (!code?.trim()) {
            setError("No code to transmute! Write some code first.");
            return;
        }

        resetExecution();
        setIsRunning(true);

        try {
            const result = await executeCode(code, activeLanguage, debuggerActive);

            setOutput(result.output);
            setError(result.error);
            setExecutionTimeMs(result.executionTimeMs);
            
            if (result.steps) {
                setSteps(result.steps);
                setTotalSteps(result.steps.length);
                setCurrentStep(0);
            } else {
                setSteps([]);
                setTotalSteps(0);
                setCurrentStep(0);
            }

            // Award XP for successful execution
            if (result.success && !result.error && practiceMode !== "playground") {
                addXp(10);
                updateActivity();

                // Check if output matches expected
                if (currentExercise && result.output.trim() === currentExercise.expectedOutput[activeLanguage]?.trim()) {
                    let bonus = 50;
                    
                    if (practiceMode === "challenge" && challengeStartTime) {
                        const elapsedMs = Date.now() - challengeStartTime;
                        if (elapsedMs < 60000) {
                            bonus *= 2; // 2x bonus for fast solve
                        }
                    }
                    
                    addXp(bonus); // Bonus XP for correct answer
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
        debuggerActive,
        setTotalSteps,
        setCurrentStep,
        setSteps,
        addXp,
        updateActivity,
        markCompleted,
        practiceMode,
        challengeStartTime,
    ]);

    // Render a simple loading state until mounted for SSR
    if (!mounted) return null;

    return (
        <>
            {/* Background particles */}
            <ParticleEffect count={15} />

            <div className="app-layout relative z-10 h-screen w-full overflow-hidden">
                {/* ── Sidebar ── */}
                <Sidebar />

                {/* ── Top Bar ── */}
                <TopBar />

                {/* ── Main Content (Resizable Panels) ── */}
                <main className="app-main flex flex-col h-full w-full min-h-0 bg-[var(--color-void)]">
                    <PanelGroup orientation="horizontal" id="ca-horizontal-panels">
                            {/* ── Left: Editor & Terminal ── */}
                            <Panel defaultSize={70} minSize={30} className="flex flex-col h-full">
                                <PanelGroup orientation="vertical" id="ca-vertical-panels">
                                    
                                    {/* Top: Instructions & Golden Example */}
                                    <Panel defaultSize={20} minSize={10} className="flex flex-col overflow-auto bg-[var(--color-surface)] border-b border-[var(--color-border)]">
                                        <LanguageTabs />
                                        <ModeSelector />
                                        <ExerciseInstructions />
                                        {currentExercise && practiceMode === "guided" && <GoldenExample exercise={currentExercise} />}
                                    </Panel>
                                    
                                    <ResizeHandle />

                                    {/* Middle: Monaco Editor */}
                                    <Panel defaultSize={55} minSize={20} className="flex flex-col bg-[var(--color-deep)] relative">
                                        <EditorToolbar onExecute={handleExecute} />
                                        <div className="flex-1 min-h-0 w-full relative">
                                            <CodeEditor
                                                onExecute={handleExecute}
                                                defaultCode={currentExercise?.starterCode[activeLanguage] || ""}
                                            />
                                        </div>
                                    </Panel>
                                    
                                    <ResizeHandle />

                                    {/* Bottom: Output / Terminal */}
                                    <Panel defaultSize={25} minSize={10} className="flex flex-col min-h-0 bg-[var(--color-abyss)] border-t border-[var(--color-border)]">
                                        <OutputPane />
                                    </Panel>

                                </PanelGroup>
                            </Panel>

                            <ResizeHandle vertical />

                            {/* ── Right: Visualization Panel ── */}
                            <Panel defaultSize={30} minSize={15} className="hidden lg:flex flex-col h-full border-l border-[var(--color-border)] bg-[var(--color-abyss)]">
                                <VisualizationPanel />
                            </Panel>
                        </PanelGroup>
                    </main>
            </div>
        </>
    );
}

/** Custom Resize Handle styling */
function ResizeHandle({ vertical = false }: { vertical?: boolean }) {
    return (
        <PanelResizeHandle
            className={`flex items-center justify-center transition-colors bg-[var(--color-void)] hover:bg-[var(--color-surface-active)] ${
                vertical ? "w-1 cursor-col-resize h-full" : "h-1 cursor-row-resize w-full"
            }`}
        >
            <div
                className={`rounded-full bg-[var(--color-border)] ${
                    vertical ? "w-0.5 h-8" : "h-0.5 w-8"
                }`}
            />
        </PanelResizeHandle>
    );
}
