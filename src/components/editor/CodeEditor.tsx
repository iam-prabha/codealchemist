"use client"

import { useCallback, useRef, useEffect } from "react"
import { motion } from "framer-motion"
import Editor, { type OnMount, type OnChange } from "@monaco-editor/react"
import type { editor as MonacoEditor } from "monaco-editor"
import { useEditorStore, useExecutionStore } from "@/stores"
import { type Language } from "@/types"
import { ALCHEMIST_THEME, THEME_NAME } from "@/lib/editor/alchemist-theme"

const LANGUAGE_COLORS: Record<Language, string> = {
  python: "var(--color-python)",
  rust: "var(--color-rust)",
  typescript: "var(--color-typescript)",
}

const LANGUAGE_MAP: Record<Language, string> = {
  python: "python",
  rust: "rust",
  typescript: "typescript",
}

const EDITOR_OPTIONS: MonacoEditor.IStandaloneEditorConstructionOptions = {
  fontSize: 13,
  fontFamily: "var(--font-mono), 'JetBrains Mono', monospace",
  fontLigatures: true,
  lineHeight: 22,
  padding: { top: 16, bottom: 16 },
  minimap: { enabled: false },
  scrollBeyondLastLine: false,
  wordWrap: "on",
  tabSize: 2,
  insertSpaces: true,
  smoothScrolling: true,
  cursorBlinking: "smooth",
  cursorSmoothCaretAnimation: "on",
  bracketPairColorization: { enabled: true },
  guides: { bracketPairs: true, indentation: true },
  scrollbar: { vertical: "auto", horizontal: "auto" },
  glyphMargin: false,
  folding: false,
  lineDecorationsWidth: 8,
  lineNumbersMinChars: 3,
  renderLineHighlight: "gutter",
}

interface CodeEditorProps {
  language: Language
  onExecute: () => void
}

export default function CodeEditor({ language, onExecute }: CodeEditorProps) {
  const editorRef = useRef<MonacoEditor.IStandaloneCodeEditor | null>(null)

  const { editorCode, setEditorCode } = useEditorStore()
  const { isRunning } = useExecutionStore()

  const value = editorCode[language] ?? ""
  const borderColor = LANGUAGE_COLORS[language]

  const onExecuteRef = useRef(onExecute)
  useEffect(() => {
    onExecuteRef.current = onExecute
  }, [onExecute])

  const handleMount: OnMount = useCallback((editor, monaco) => {
    editorRef.current = editor
    monaco.editor.defineTheme(THEME_NAME, ALCHEMIST_THEME)
    monaco.editor.setTheme(THEME_NAME)

    editor.addAction({
      id: "codealchemist.run",
      label: "Transmute & Run",
      keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter],
      run: () => onExecuteRef.current(),
    })

    editor.addAction({
      id: "codealchemist.toggleExample",
      label: "Toggle Golden Example",
      keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyB],
      run: () => useEditorStore.getState().toggleExample(),
    })

    editor.focus()
  }, [])

  const handleChange: OnChange = useCallback(
    (val) => {
      if (val !== undefined) {
        setEditorCode(language, val)
      }
    },
    [language, setEditorCode]
  )

  return (
    <div
      className="h-full w-full relative overflow-hidden"
      style={{
        borderLeft: `2px solid ${borderColor}`,
        transition: "border-color 0.2s ease",
      }}
    >
      <Editor
        height="100%"
        language={LANGUAGE_MAP[language]}
        value={value}
        theme={THEME_NAME}
        options={{ ...EDITOR_OPTIONS, readOnly: isRunning }}
        onMount={handleMount}
        onChange={handleChange}
        loading={
          <div className="flex items-center justify-center h-full w-full" style={{ background: "var(--color-surface)" }}>
            <motion.div
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              style={{ color: "var(--color-text-muted)" }}
            >
              ⚗️ Summoning editor...
            </motion.div>
          </div>
        }
      />
    </div>
  )
}
