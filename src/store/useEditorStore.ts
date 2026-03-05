import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Language, PracticeMode } from "@/types";

interface EditorState {
    activeChapterId: string;
    activeLanguage: Language;
    activeMode: PracticeMode;
    code: Record<string, Record<Language, string>>;
    currentStep: number;
    totalSteps: number;
    
    setChapter: (chapterId: string) => void;
    setLanguage: (language: Language) => void;
    setMode: (mode: PracticeMode) => void;
    setCode: (chapterId: string, language: Language, code: string) => void;
    getCode: (chapterId: string, language: Language) => string;
    nextStep: () => void;
    prevStep: () => void;
    setStep: (step: number) => void;
    reset: () => void;
}

const DEFAULT_CODE: Record<Language, string> = {
    python: "# Start coding here\n",
    rust: "// Start coding here\n",
    typescript: "// Start coding here\n",
};

export const useEditorStore = create<EditorState>()(
    persist(
        (set, get) => ({
            activeChapterId: "ch-1",
            activeLanguage: "python",
            activeMode: "guided",
            code: {},
            currentStep: 1,
            totalSteps: 2,

            setChapter: (chapterId: string) => {
                set({
                    activeChapterId: chapterId,
                    currentStep: 1,
                });
            },

            setLanguage: (language: Language) => {
                set({ activeLanguage: language });
            },

            setMode: (mode: PracticeMode) => {
                set({ activeMode: mode });
            },

            setCode: (chapterId: string, language: Language, code: string) => {
                set((state) => ({
                    code: {
                        ...state.code,
                        [chapterId]: {
                            ...(state.code[chapterId] || DEFAULT_CODE),
                            [language]: code,
                        },
                    },
                }));
            },

            getCode: (chapterId: string, language: Language) => {
                const state = get();
                return state.code[chapterId]?.[language] || DEFAULT_CODE[language];
            },

            nextStep: () => {
                const { currentStep, totalSteps } = get();
                if (currentStep < totalSteps) {
                    set({ currentStep: currentStep + 1 });
                }
            },

            prevStep: () => {
                const { currentStep } = get();
                if (currentStep > 1) {
                    set({ currentStep: currentStep - 1 });
                }
            },

            setStep: (step: number) => {
                const { totalSteps } = get();
                if (step >= 1 && step <= totalSteps) {
                    set({ currentStep: step });
                }
            },

            reset: () => {
                set({
                    activeChapterId: "ch-1",
                    activeLanguage: "python",
                    activeMode: "guided",
                    code: {},
                    currentStep: 1,
                    totalSteps: 2,
                });
            },
        }),
        {
            name: "codealchemist-editor",
            partialize: (state) => ({
                activeChapterId: state.activeChapterId,
                activeLanguage: state.activeLanguage,
                activeMode: state.activeMode,
                code: state.code,
            }),
        }
    )
);
