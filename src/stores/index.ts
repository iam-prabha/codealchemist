"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Language, PracticeMode, Badge } from "@/types";

/* ============================================================
   Editor Store — manages editor + execution UI state
   ============================================================ */

interface EditorState {
    /** Currently selected language tab */
    activeLanguage: Language;
    setActiveLanguage: (lang: Language) => void;

    /** Current code in the editor per language */
    editorCode: Record<Language, string>;
    setEditorCode: (lang: Language, code: string) => void;

    /** Whether the golden example is revealed */
    exampleRevealed: boolean;
    toggleExample: () => void;

    /** Current active layer */
    activeLayerId: number;
    setActiveLayerId: (id: number) => void;

    /** Current exercise index within the layer */
    activeExerciseIndex: number;
    setActiveExerciseIndex: (idx: number) => void;

    /** Practice mode */
    practiceMode: PracticeMode;
    setPracticeMode: (mode: PracticeMode) => void;

    /** Challenge mode timer — epoch ms when exercise started */
    challengeStartTime: number | null;
    resetChallengeTimer: () => void;
    clearChallengeTimer: () => void;

    /** Sidebar collapsed on mobile */
    sidebarOpen: boolean;
    toggleSidebar: () => void;
}

export const useEditorStore = create<EditorState>()((set) => ({
    activeLanguage: "python",
    setActiveLanguage: (lang) => set({ activeLanguage: lang }),

    editorCode: {
        python: "",
        rust: "",
        typescript: "",
    },
    setEditorCode: (lang, code) =>
        set((state) => ({
            editorCode: { ...state.editorCode, [lang]: code },
        })),

    exampleRevealed: false,
    toggleExample: () =>
        set((state) => ({ exampleRevealed: !state.exampleRevealed })),

    activeLayerId: 1,
    setActiveLayerId: (id) =>
        set({
            activeLayerId: id,
            activeExerciseIndex: 0,
            exampleRevealed: false,
            editorCode: { python: "", rust: "", typescript: "" },
        }),

    activeExerciseIndex: 0,
    setActiveExerciseIndex: (idx) =>
        set({
            activeExerciseIndex: idx,
            exampleRevealed: false,
            editorCode: { python: "", rust: "", typescript: "" },
        }),

    practiceMode: "guided",
    setPracticeMode: (mode) => set({ practiceMode: mode }),

    challengeStartTime: null,
    resetChallengeTimer: () => set({ challengeStartTime: Date.now() }),
    clearChallengeTimer: () => set({ challengeStartTime: null }),

    sidebarOpen: true,
    toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
}));

/* ============================================================
   Execution Store — manages code execution state
   ============================================================ */

interface ExecutionState {
    /** Whether code is currently being executed */
    isRunning: boolean;
    setIsRunning: (running: boolean) => void;

    /** Latest execution output */
    output: string;
    setOutput: (output: string) => void;

    /** Latest error message */
    error: string | null;
    setError: (error: string | null) => void;

    /** Execution time in ms */
    executionTimeMs: number | null;
    setExecutionTimeMs: (ms: number | null) => void;

    /** Current step index for visualization stepper */
    currentStep: number;
    setCurrentStep: (step: number) => void;
    stepForward: () => void;
    stepBackward: () => void;

    /** Total steps in the current execution */
    totalSteps: number;
    setTotalSteps: (count: number) => void;

    /** Is the debugger active? */
    debuggerActive: boolean;
    toggleDebugger: () => void;

    /** Breakpoint line numbers */
    breakpoints: number[];
    toggleBreakpoint: (line: number) => void;

    /** Store execution steps for the trace */
    steps: import("@/types").ExecutionStep[];
    setSteps: (steps: import("@/types").ExecutionStep[]) => void;

    /** Reset execution state */
    resetExecution: () => void;
}

export const useExecutionStore = create<ExecutionState>()((set) => ({
    isRunning: false,
    setIsRunning: (running) => set({ isRunning: running }),

    output: "",
    setOutput: (output) => set({ output }),

    error: null,
    setError: (error) => set({ error }),

    executionTimeMs: null,
    setExecutionTimeMs: (ms) => set({ executionTimeMs: ms }),

    currentStep: 0,
    setCurrentStep: (step) => set({ currentStep: step }),
    stepForward: () =>
        set((s) => ({
            currentStep: Math.min(s.currentStep + 1, s.totalSteps - 1),
        })),
    stepBackward: () =>
        set((s) => ({
            currentStep: Math.max(s.currentStep - 1, 0),
        })),

    totalSteps: 0,
    setTotalSteps: (count) => set({ totalSteps: count }),

    debuggerActive: false,
    toggleDebugger: () =>
        set((s) => ({ debuggerActive: !s.debuggerActive })),

    breakpoints: [],
    toggleBreakpoint: (line) =>
        set((s) => ({
            breakpoints: s.breakpoints.includes(line)
                ? s.breakpoints.filter((l) => l !== line)
                : [...s.breakpoints, line],
        })),

    steps: [],
    setSteps: (steps) => set({ steps }),

    resetExecution: () =>
        set({
            isRunning: false,
            output: "",
            error: null,
            executionTimeMs: null,
            currentStep: 0,
            totalSteps: 0,
            steps: [],
        }),
}));

/* ============================================================
   Progress Store — persisted user progress, XP, badges
   ============================================================ */

interface ProgressState {
    /** XP (Elixir) points */
    xp: number;
    addXp: (amount: number) => void;

    /** Current streak (consecutive days) */
    streak: number;
    setStreak: (count: number) => void;

    /** Mastery per layer per language (0-100) */
    mastery: Record<string, number>;
    setMastery: (layerId: number, lang: Language, pct: number) => void;
    getMastery: (layerId: number, lang: Language) => number;

    /** Completed exercise IDs */
    completed: string[];
    markCompleted: (exerciseId: string) => void;

    /** Earned badges */
    badges: Badge[];
    earnBadge: (badge: Badge) => void;

    /** Last activity date for streak tracking */
    lastActivityDate: string | null;
    updateActivity: () => void;
}

export const useProgressStore = create<ProgressState>()(
    persist(
        (set, get) => ({
            xp: 0,
            addXp: (amount) => set((s) => ({ xp: s.xp + amount })),

            streak: 0,
            setStreak: (count) => set({ streak: count }),

            mastery: {},
            setMastery: (layerId, lang, pct) =>
                set((s) => ({
                    mastery: { ...s.mastery, [`${layerId}-${lang}`]: pct },
                })),
            getMastery: (layerId, lang) => {
                return get().mastery[`${layerId}-${lang}`] || 0;
            },

            completed: [],
            markCompleted: (exerciseId) =>
                set((s) => ({
                    completed: s.completed.includes(exerciseId)
                        ? s.completed
                        : [...s.completed, exerciseId],
                })),

            badges: [],
            earnBadge: (badge) =>
                set((s) => ({
                    badges: s.badges.some((b) => b.id === badge.id)
                        ? s.badges
                        : [...s.badges, { ...badge, earnedAt: new Date() }],
                })),

            lastActivityDate: null,
            updateActivity: () => {
                const today = new Date().toISOString().split("T")[0];
                const last = get().lastActivityDate;
                const yesterday = new Date(Date.now() - 86400000)
                    .toISOString()
                    .split("T")[0];

                if (last === today) return; // Already logged today

                set({
                    lastActivityDate: today,
                    streak: last === yesterday ? get().streak + 1 : 1,
                });
            },
        }),
        {
            name: "codealchemist-progress",
        }
    )
);
