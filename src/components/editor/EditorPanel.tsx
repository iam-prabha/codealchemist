"use client";

import { useRef, useEffect } from "react";
import Editor from "@monaco-editor/react";
import { useEditorStore } from "@/store/useEditorStore";
import type { Language } from "@/types";

const languageLabels: Record<Language, string> = {
    python: "Python",
    rust: "Rust",
    typescript: "TypeScript",
};

const languageColors: Record<Language, string> = {
    python: "#3776ab",
    rust: "#ce422b",
    typescript: "#3178c6",
};

interface EditorPanelProps {
    onExecute?: () => void;
}

function EditorPanelContent({ onExecute }: EditorPanelProps) {
    const { activeLanguage, activeChapterId, setCode, getCode } = useEditorStore();
    const editorRef = useRef<Parameters<NonNullable<Parameters<typeof Editor>[0]["onMount"]>>[0] | null>(null);

    const currentCode = getCode(activeChapterId, activeLanguage);

    const handleEditorMount = (
        editor: Parameters<NonNullable<Parameters<typeof Editor>[0]["onMount"]>>[0]
    ) => {
        editorRef.current = editor;
        editor.focus();
    };

    const handleChange = (value: string | undefined) => {
        setCode(activeChapterId, activeLanguage, value || "");
    };

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
                e.preventDefault();
                onExecute?.();
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [onExecute]);

    return (
        <div className="relative h-full w-full">
            <div className="absolute top-2 right-2 z-10">
                <div
                    className="px-3 py-1 rounded-full text-xs font-mono font-medium text-white"
                    style={{ backgroundColor: languageColors[activeLanguage] }}
                >
                    {languageLabels[activeLanguage]}
                </div>
            </div>

            <Editor
                height="100%"
                language={activeLanguage === "typescript" ? "typescript" : activeLanguage}
                value={currentCode}
                onChange={handleChange}
                onMount={handleEditorMount}
                theme="vs-dark"
                options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                    fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                    lineNumbers: "on",
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                    tabSize: 4,
                    wordWrap: "on",
                    padding: { top: 48, bottom: 16 },
                    scrollbar: {
                        verticalScrollbarSize: 6,
                        horizontalScrollbarSize: 6,
                    },
                }}
                aria-label="Code editor"
            />
        </div>
    );
}

export default function EditorPanel({ onExecute }: EditorPanelProps) {
    return (
        <div className="h-full w-full bg-[#1e1e1e]">
            <EditorPanelContent onExecute={onExecute} />
        </div>
    );
}
