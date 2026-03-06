"use client"

import { motion, useReducedMotion } from "framer-motion"
import { useEditorStore } from "@/stores"
import type { Language } from "@/types"

const LANGUAGES: {
  id: Language
  label: string
  emoji: string
  color: string
}[] = [
  { id: "python", label: "Python", emoji: "🐍", color: "var(--color-python)" },
  { id: "rust", label: "Rust", emoji: "🦀", color: "var(--color-rust)" },
  { id: "typescript", label: "TypeScript", emoji: "🔷", color: "var(--color-typescript)" },
]

function UnsavedDot({ language }: { language: Language }) {
  const { editorCode } = useEditorStore()
  const hasCode = editorCode[language]?.trim().length > 0

  if (!hasCode) return null

  return (
    <div
      className="w-1.5 h-1.5 rounded-full"
      style={{ background: "var(--color-text-muted)" }}
    />
  )
}

export default function LanguageSwitcher() {
  const reduced = useReducedMotion()
  const { activeLanguage, setActiveLanguage } = useEditorStore()

  const getFileName = (lang: Language) => {
    switch (lang) {
      case "python": return "main.py"
      case "rust": return "main.rs"
      case "typescript": return "main.ts"
    }
  }

  return (
    <div
      className="flex items-center gap-1 px-3"
      style={{
        height: 44,
        background: "var(--color-panel)",
        borderBottom: "1px solid var(--color-border-dim)",
        flexShrink: 0,
      }}
    >
      {LANGUAGES.map((lang) => {
        const isActive = activeLanguage === lang.id

        return (
          <button
            key={lang.id}
            onClick={() => setActiveLanguage(lang.id)}
            aria-label={`Switch to ${lang.label}`}
            aria-pressed={isActive}
            className="relative flex items-center gap-1.5 px-4 py-1.5 rounded-md transition-colors duration-150 focus-visible:outline-none"
            style={{
              fontFamily: "var(--font-dm-sans), sans-serif",
              fontSize: 13,
              fontWeight: isActive ? 600 : 400,
              color: isActive ? lang.color : "var(--color-text-muted)",
              background: isActive
                ? `color-mix(in srgb, ${lang.color} 10%, transparent)`
                : "transparent",
              border: "none",
              cursor: "pointer",
            }}
          >
            {isActive && !reduced && (
              <motion.div
                layoutId="lang-switcher-pill"
                className="absolute inset-0 rounded-md"
                style={{
                  background: `color-mix(in srgb, ${lang.color} 8%, transparent)`,
                  border: `1px solid color-mix(in srgb, ${lang.color} 30%, transparent)`,
                }}
                transition={{
                  type: "spring",
                  stiffness: 400,
                  damping: 30,
                }}
              />
            )}

            {isActive && (
              <motion.div
                layoutId="lang-switcher-line"
                className="absolute bottom-0 left-2 right-2"
                style={{
                  height: 2,
                  background: lang.color,
                  borderRadius: "2px 2px 0 0",
                  boxShadow: `0 0 8px ${lang.color}`,
                }}
                transition={
                  !reduced
                    ? { type: "spring", stiffness: 400, damping: 30 }
                    : { duration: 0 }
                }
              />
            )}

            <span className="relative flex items-center gap-1.5">
              <span style={{ fontSize: 15 }}>{lang.emoji}</span>
              <span className="hidden sm:inline">{lang.label}</span>
            </span>
          </button>
        )
      })}

      <div className="ml-auto flex items-center gap-2">
        <span
          style={{
            fontSize: 11,
            color: "var(--color-text-muted)",
            fontFamily: "var(--font-mono), monospace",
          }}
        >
          {getFileName(activeLanguage)}
        </span>
        <UnsavedDot language={activeLanguage} />
      </div>
    </div>
  )
}
