"use client"

import { useCallback, useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import dynamic from "next/dynamic"
import { useEditorStore, useExecutionStore, useProgressStore } from "@/stores"
import { getLayer } from "@/data/curriculum"
import { executeCode } from "@/lib/execution/executor"

import Sidebar from "@/components/layout/Sidebar"
import TopBar from "@/components/layout/TopBar"
import InstructionsPanel from "@/components/panels/InstructionsPanel"
import MobileActionBar from "@/components/editor/MobileActionBar"

const EditorPanel = dynamic(
    () => import("@/components/editor/EditorPanel"),
    {
        ssr: false,
        loading: () => (
            <div className="flex items-center justify-center h-full w-full" style={{ background: "var(--color-surface)" }}>
                <motion.div
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    style={{ color: "var(--color-text-muted)" }}
                >
                    ⚗️ Loading editor...
                </motion.div>
            </div>
        ),
    }
)

interface WorkspaceClientProps {
    _initialLayerId: number
    _initialExerciseIndex: number
    _initialLanguage: "python" | "rust" | "typescript"
}

export default function WorkspaceClient({
    _initialLayerId,
    _initialExerciseIndex,
    _initialLanguage,
}: WorkspaceClientProps) {
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
        mobileView,
        setMobileView,
    } = useEditorStore()

    const {
        isRunning,
        setIsRunning,
        setOutput,
        setError,
        setExecutionTimeMs,
        setTerminalOpen,
    } = useExecutionStore()

    const { addXp, updateActivity, markCompleted } = useProgressStore()

    const layer = getLayer(activeLayerId)
    const currentExercise = layer?.exercises[activeExerciseIndex]

    const [mounted, setMounted] = useState(false)

    useEffect(() => setMounted(true), [])

    useEffect(() => {
        if (currentExercise) {
            const starterCode = currentExercise.starterCode[activeLanguage]
            if (starterCode && !editorCode[activeLanguage]) {
                setEditorCode(activeLanguage, starterCode)
            }
        }
    }, [activeLayerId, activeExerciseIndex, activeLanguage, currentExercise, editorCode, setEditorCode])

    useEffect(() => {
        if (practiceMode === "challenge") {
            resetChallengeTimer()
        }
    }, [activeLayerId, activeExerciseIndex, practiceMode, resetChallengeTimer])

    const handleTransmute = useCallback(async () => {
        if (isRunning) return

        const code = editorCode[activeLanguage]
        if (!code?.trim()) {
            setError("No code to transmute! Write some code first.")
            setTerminalOpen(true)
            return
        }

        setIsRunning(true)
        setTerminalOpen(true)

        try {
            const result = await executeCode(code, activeLanguage, false)

            setOutput(result.output || "")
            setError(result.error)
            setExecutionTimeMs(result.executionTimeMs ?? null)

            if (result.success && !result.error && practiceMode !== "playground") {
                addXp(10)
                updateActivity()

                if (currentExercise && result.output.trim() === currentExercise.expectedOutput[activeLanguage]?.trim()) {
                    let bonus = 50
                    
                    if (practiceMode === "challenge" && challengeStartTime) {
                        const elapsedMs = Date.now() - challengeStartTime
                        if (elapsedMs < 60000) {
                            bonus *= 2
                        }
                    }
                    
                    addXp(bonus)
                    markCompleted(currentExercise.id)
                }
            }
        } catch (err) {
            setError(
                err instanceof Error ? err.message : "Transmutation failed unexpectedly"
            )
        } finally {
            setIsRunning(false)
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
    ])

    if (!mounted) return null

    return (
        <div
            className="h-screen overflow-hidden"
            style={{
                display: "grid",
                gridTemplateRows: "52px 1fr",
                gridTemplateColumns: sidebarOpen ? "220px 320px 1fr" : "0px 0px 1fr",
                gridTemplateAreas: `
                    "topnav topnav topnav"
                    "sidebar instruct editors"
                `,
                background: "var(--color-void)",
            }}
        >
            {/* TopNav */}
            <div style={{ gridArea: "topnav", overflow: "hidden" }}>
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

            {/* Desktop: Instructions Panel (md+) */}
            <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.05 }}
                className="overflow-hidden hidden md:block"
                style={{ 
                    gridArea: "instruct",
                    background: "var(--color-surface)",
                    borderRight: "1px solid var(--color-border-dim)",
                }}
            >
                <InstructionsPanel />
            </motion.div>

            {/* Desktop: Editor Panel (md+) */}
            <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="flex flex-col min-h-0 overflow-hidden hidden md:flex"
                style={{ 
                    gridArea: "editors",
                    background: "var(--color-surface)",
                }}
            >
                <EditorPanel onExecute={handleTransmute} />
            </motion.div>

            {/* Mobile: Editor or Instructions (mobile only) */}
            <div className="md:hidden" style={{ gridArea: "editors" }}>
                <AnimatePresence mode="wait">
                    {mobileView === "editor" ? (
                        <motion.div
                            key="editor"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="flex flex-col h-full"
                        >
                            <EditorPanel onExecute={handleTransmute} />
                        </motion.div>
                    ) : (
                        <motion.div
                            key="instructions"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="flex flex-col h-full"
                        >
                            {/* Back button strip */}
                            <div
                                className="flex items-center px-4"
                                style={{
                                    height: 44,
                                    background: "var(--color-panel)",
                                    borderBottom: "1px solid var(--color-border-dim)",
                                }}
                            >
                                <button
                                    onClick={() => setMobileView("editor")}
                                    style={{
                                        background: "none",
                                        border: "none",
                                        color: "var(--color-text-muted)",
                                        fontSize: 12,
                                        cursor: "pointer",
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 6,
                                        padding: 0,
                                    }}
                                >
                                    ← Back to Editor
                                </button>
                            </div>
                            <div className="flex-1 overflow-y-auto">
                                <InstructionsPanel />
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <MobileActionBar onTransmute={handleTransmute} />
        </div>
    )
}
