"use client"

import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import dynamic from "next/dynamic"
import { useEditorStore } from "@/stores"
import LanguageSwitcher from "./LanguageSwitcher"
import TerminalPanel from "./TerminalPanel"

const CodeEditor = dynamic(
  () => import("@/components/editor/CodeEditor"),
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
          ⚗️ Loading editor...
        </motion.div>
      </div>
    ),
  }
)

interface EditorPanelProps {
  onExecute: () => void
}

export default function EditorPanel({ onExecute }: EditorPanelProps) {
  const reduced = useReducedMotion()
  const { activeLanguage } = useEditorStore()

  return (
    <div
      className="flex flex-col h-full overflow-hidden"
      style={{ background: "var(--color-surface)" }}
    >
      <LanguageSwitcher />

      <AnimatePresence mode="wait">
        <motion.div
          key={activeLanguage}
          className="flex-1 overflow-hidden"
          initial={!reduced ? { opacity: 0 } : undefined}
          animate={{ opacity: 1 }}
          exit={!reduced ? { opacity: 0 } : undefined}
          transition={{ duration: 0.12 }}
        >
          <CodeEditor 
            language={activeLanguage} 
            onExecute={onExecute}
          />
        </motion.div>
      </AnimatePresence>

      <TerminalPanel />
    </div>
  )
}
