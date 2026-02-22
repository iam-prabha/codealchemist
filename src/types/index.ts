/* ============================================================
   CodeAlchemist — Core Type Definitions
   ============================================================ */

/** Supported target languages */
export type Language = "python" | "rust" | "typescript";

/** Language metadata for UI rendering */
export interface LanguageConfig {
    id: Language;
    label: string;
    icon: string;
    color: string;
    monacoLang: string;
    fileExt: string;
}

/** All language configurations */
export const LANGUAGES: Record<Language, LanguageConfig> = {
    python: {
        id: "python",
        label: "Python",
        icon: "🐍",
        color: "var(--color-python)",
        monacoLang: "python",
        fileExt: ".py",
    },
    rust: {
        id: "rust",
        label: "Rust",
        icon: "🦀",
        color: "var(--color-rust)",
        monacoLang: "rust",
        fileExt: ".rs",
    },
    typescript: {
        id: "typescript",
        label: "TypeScript",
        icon: "🔷",
        color: "var(--color-typescript)",
        monacoLang: "typescript",
        fileExt: ".ts",
    },
};

/** A single lesson exercise */
export interface Exercise {
    id: string;
    title: string;
    instructions: string;
    /** Starter code per language */
    starterCode: Record<Language, string>;
    /** Golden example / solution per language */
    goldenExample: Record<Language, string>;
    /** Line-by-line annotations for golden examples */
    annotations: Record<Language, Record<number, string>>;
    /** Expected output per language */
    expectedOutput: Record<Language, string>;
    /** Hints for when learner is stuck */
    hints: string[];
    /** Difficulty: 1-5 */
    difficulty: number;
}

/** A curriculum layer (one of 12) */
export interface Layer {
    id: number;
    slug: string;
    title: string;
    subtitle: string;
    icon: string;
    description: string;
    /** Concept-level intro (shown before exercises) */
    conceptIntro: Record<Language, string>;
    exercises: Exercise[];
}

/** Execution result from running code */
export interface ExecutionResult {
    success: boolean;
    output: string;
    error: string | null;
    executionTimeMs: number;
    /** For visualization — execution steps */
    steps?: ExecutionStep[];
}

/** A single step in code execution (for visualization) */
export interface ExecutionStep {
    line: number;
    /** Variables in scope at this point */
    variables: Record<string, VariableSnapshot>;
    /** Call stack at this point */
    callStack: string[];
    /** Console output produced at this step */
    consoleOutput?: string;
}

/** Snapshot of a variable at a point in execution */
export interface VariableSnapshot {
    name: string;
    value: string;
    type: string;
    /** For Rust — ownership info */
    ownership?: "owned" | "borrowed" | "moved";
}

/** User progress for one layer + language */
export interface LessonProgress {
    layerId: number;
    language: Language;
    /** Mastery percentage 0-100 */
    mastery: number;
    completedExercises: string[];
    /** Toggle states per exercise */
    exampleRevealed: Record<string, boolean>;
}

/** Badge earned through progress */
export interface Badge {
    id: string;
    title: string;
    description: string;
    icon: string;
    earnedAt?: Date;
}

/** Practice mode type */
export type PracticeMode = "guided" | "challenge" | "playground";
