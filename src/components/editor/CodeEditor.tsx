"use client";

/**
 * CodeEditor — Monaco editor wrapper with language-aware config
 * Handles theme, keybindings, and syncs with Zustand store
 */

import { useCallback, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import Editor, { type OnMount, type OnChange } from "@monaco-editor/react";
import type { editor as MonacoEditor } from "monaco-editor";
import { useEditorStore } from "@/stores";
import { LANGUAGES, type Language } from "@/types";
import { ALCHEMIST_THEME, THEME_NAME } from "@/lib/editor/alchemist-theme";

/** Default editor options for all languages */
const EDITOR_OPTIONS: MonacoEditor.IStandaloneEditorConstructionOptions = {
    fontSize: 14,
    fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace",
    fontLigatures: true,
    lineHeight: 1.6,
    padding: { top: 16, bottom: 16 },
    minimap: { enabled: false },
    scrollBeyondLastLine: false,
    wordWrap: "on",
    tabSize: 2,
    insertSpaces: true,
    renderWhitespace: "selection",
    smoothScrolling: true,
    cursorBlinking: "smooth",
    cursorSmoothCaretAnimation: "on",
    bracketPairColorization: { enabled: true },
    guides: {
        bracketPairs: true,
        indentation: true,
    },
    suggest: {
        showMethods: true,
        showFunctions: true,
        showVariables: true,
        showWords: true,
    },
    quickSuggestions: {
        other: true,
        comments: false,
        strings: false,
    },
};

interface CodeEditorProps {
    /** Override language - when provided, uses this instead of activeLanguage */
    language?: Language;
    /** Execute callback — called when user presses Cmd+Enter */
    onExecute: () => void;
    /** Initial code to load (from lesson) */
    defaultCode?: string;
}

export default function CodeEditor({ language: languageOverride, onExecute, defaultCode }: CodeEditorProps) {
    const { activeLanguage, editorCode, setEditorCode } = useEditorStore();
    const editorRef = useRef<MonacoEditor.IStandaloneCodeEditor | null>(null);

    const effectiveLanguage = languageOverride ?? activeLanguage;
    const langConfig = LANGUAGES[effectiveLanguage];
    const currentCode = editorCode[effectiveLanguage] || defaultCode || "";

    /** Store latest onExecute callback in a ref to avoid stale closures in Monaco keybindings */
    const onExecuteRef = useRef(onExecute);
    useEffect(() => {
        onExecuteRef.current = onExecute;
    }, [onExecute]);

    /** Handle editor mount — register theme and keybindings */
    const handleMount: OnMount = useCallback(
        (editor, monaco) => {
            editorRef.current = editor;

            // Register alchemical theme
            monaco.editor.defineTheme(THEME_NAME, ALCHEMIST_THEME);
            monaco.editor.setTheme(THEME_NAME);

            // ── Keybindings ──

            // Cmd/Ctrl + Enter → Transmute & Run
            editor.addAction({
                id: "codealchemist.run",
                label: "Transmute & Run",
                keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter],
                run: () => onExecuteRef.current(),
            });

            // Cmd/Ctrl + B → Toggle Golden Example
            editor.addAction({
                id: "codealchemist.toggleExample",
                label: "Toggle Golden Example",
                keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyB],
                run: () => useEditorStore.getState().toggleExample(),
            });

            // Focus editor
            editor.focus();
        },
        []
    );

    /** Handle code changes */
    const handleChange: OnChange = useCallback(
        (value) => {
            if (value !== undefined) {
                setEditorCode(effectiveLanguage, value);
            }
        },
        [effectiveLanguage, setEditorCode]
    );

    return (
        <div className="editor-panel relative h-full w-full">
            {/* ── Language indicator dot ── */}
            <div
                className="absolute top-3 right-3 z-10 flex items-center gap-1.5 px-2 py-1 rounded text-[10px] font-mono"
                style={{
                    background: langConfig.color + "22",
                    color: langConfig.color,
                    border: `1px solid ${langConfig.color}33`,
                }}
            >
                <span
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ background: langConfig.color }}
                />
                {langConfig.label}
            </div>

            <Editor
                height="100%"
                language={langConfig.monacoLang}
                value={currentCode}
                theme={THEME_NAME}
                options={EDITOR_OPTIONS}
                onMount={handleMount}
                onChange={handleChange}
                loading={
                    <div className="flex flex-col items-center justify-center h-full gap-3 bg-[var(--color-deep)] text-[var(--color-text-muted)]">
                        <div className="flex gap-1">
                            {[0, 1, 2].map((i) => (
                                <motion.div
                                    key={i}
                                    className="w-2 h-2 rounded-full"
                                    style={{ background: "var(--color-gold-dim)" }}
                                    animate={{
                                        y: [0, -6, 0],
                                        opacity: [0.3, 1, 0.3],
                                    }}
                                    transition={{
                                        duration: 0.8,
                                        repeat: Infinity,
                                        delay: i * 0.15,
                                    }}
                                />
                            ))}
                        </div>
                        <span className="text-xs font-mono">Summoning editor...</span>
                    </div>
                }
            />

            {/* ── Breakpoint glyph styles (injected) ── */}
            <style jsx global>{`
        .breakpoint-line {
          background: rgba(255, 59, 92, 0.1) !important;
        }
        .breakpoint-glyph {
          background: #ff3b5c;
          border-radius: 50%;
          width: 10px !important;
          height: 10px !important;
          margin-left: 4px;
          margin-top: 5px;
        }
      `}</style>
        </div>
    );
}
