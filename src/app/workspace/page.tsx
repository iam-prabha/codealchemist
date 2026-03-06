"use client";

/**
 * CodeAlchemist — Workspace Page
 * CSS Grid layout: TopNav | Sidebar | Instructions | EditorPanel
 */

import { useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import { useEditorStore, useExecutionStore, useProgressStore } from "@/stores";
import { getLayer } from "@/data/curriculum";
import { executeCode } from "@/lib/execution/executor";

// Layout components
import Sidebar from "@/components/layout/Sidebar";
import TopBar from "@/components/layout/TopBar";
import TransmuteButton from "@/components/editor/TransmuteButton";
import TerminalPanel from "@/components/editor/TerminalPanel";
import InstructionsPanel from "@/components/panels/InstructionsPanel";

// Dynamic import for Monaco editor
const EditorPanel = dynamic(
    () => import("@/components/editor/EditorPanel"),
    {
        ssr: false,
        loading: () => (
            <div className="flex items-center justify-center h-full w-full" style={{ background: "var(--color-surface)" }}>
                <motion.div
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="text-sm"
                    style={{ color: "var(--color-text-muted)" }}
                >
                    ⚗️ Loading editors...
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
        setTerminalOpen,
    } = useExecutionStore();

    const { addXp, updateActivity, markCompleted } = useProgressStore();

    const layer = getLayer(activeLayerId);
    const currentExercise = layer?.exercises[activeExerciseIndex];

    const [mounted, setMounted] = useState(false);

    useEffect(() => setMounted(true), []);

    // Load starter code when exercise changes
    useEffect(() => {
        if (currentExercise) {
            const starterCode = currentExercise.starterCode[activeLanguage];
            if (starterCode && !editorCode[activeLanguage]) {
                setEditorCode(activeLanguage, starterCode);
            }
        }
    }, [activeLayerId, activeExerciseIndex, activeLanguage, currentExercise, editorCode, setEditorCode]);

    useEffect(() => {
        if (practiceMode === "challenge") {
            resetChallengeTimer();
        }
    }, [activeLayerId, activeExerciseIndex, practiceMode, resetChallengeTimer]);

    const handleTransmute = useCallback(async () => {
        if (isRunning) return;

        const code = editorCode[activeLanguage];
        if (!code?.trim()) {
            setError("No code to transmute! Write some code first.");
            setTerminalOpen(true);
            return;
        }

        setIsRunning(true);
        setTerminalOpen(true);

        try {
            const result = await executeCode(code, activeLanguage, false);

            setOutput(result.output || "");
            setError(result.error);
            setExecutionTimeMs(result.executionTimeMs ?? null);

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
        practiceMode,
        challengeStartTime,
        setIsRunning,
        setOutput,
        setError,
        setExecutionTimeMs,
        setTerminalOpen,
        addXp,
        updateActivity,
        markCompleted,
    ]);

    if (!mounted) return null;

    return (
        <div
            className="h-screen overflow-hidden"
            style={{
                display: "grid",
                gridTemplateRows: "52px 1fr",
                gridTemplateColumns: sidebarOpen ? "220px 380px 1fr" : "0px 0px 1fr",
                gridTemplateAreas: `
                    "topnav topnav topnav"
                    "sidebar instruct editors"
                `,
                background: "var(--color-void)",
            }}
        >
            {/* Top Navigation */}
            <div style={{ gridArea: "topnav" }}>
                <TopBar />
            </div>

            {/* Sidebar */}
            <AnimatePresence>
                {sidebarOpen && (
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.2 }}
                        style={{ 
                            gridArea: "sidebar",
                            background: "var(--color-panel)",
                            borderRight: "1px solid var(--color-border-dim)",
                            overflow: "hidden",
                        }}
                    >
                        <Sidebar />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Instructions Panel */}
            <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.05 }}
                className="overflow-hidden"
                style={{ 
                    gridArea: "instruct",
                    background: "var(--color-surface)",
                    borderRight: "1px solid var(--color-border-dim)",
                }}
            >
                <InstructionsPanel />
            </motion.div>

            {/* Editor + Terminal */}
            <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="flex flex-col min-h-0 overflow-hidden"
                style={{ 
                    gridArea: "editors",
                    background: "var(--color-surface)",
                }}
            >
                {/* Toolbar */}
                <div 
                    className="shrink-0 flex items-center justify-between px-4 h-12"
                    style={{
                        background: "var(--color-panel)",
                        borderBottom: "1px solid var(--color-border-dim)",
                    }}
                >
                    <div className="flex items-center gap-2">
                        <span 
                            className="text-sm font-medium"
                            style={{ 
                                color: "var(--color-text-secondary)",
                                fontFamily: "var(--font-cinzel)" 
                            }}
                        >
                            🐍 Python &nbsp; 🦀 Rust &nbsp; 🔷 TypeScript
                        </span>
                    </div>
                    
                    <TransmuteButton onClick={handleTransmute} isLoading={isRunning} />
                </div>

                {/* 3 Monaco Editors */}
                <div className="flex-1 min-h-0">
                    <EditorPanel onExecute={handleTransmute} />
                </div>

                {/* Terminal */}
                <TerminalPanel />
            </motion.div>
        </div>
    );
}
