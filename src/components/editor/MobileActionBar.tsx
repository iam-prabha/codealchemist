"use client"

import { useEditorStore, useExecutionStore } from "@/stores"
import TransmuteButton from "./TransmuteButton"
import type { Language } from "@/types"

const LANG_CONFIG = {
  python: { emoji: "🐍", color: "var(--color-python)" },
  rust: { emoji: "🦀", color: "var(--color-rust)" },
  typescript: { emoji: "🔷", color: "var(--color-typescript)" },
} as const

interface MobileActionBarProps {
  onTransmute: () => void
}

export default function MobileActionBar({ onTransmute }: MobileActionBarProps) {
  const { activeLanguage, setActiveLanguage } = useEditorStore()
  const { isRunning } = useExecutionStore()

  return (
    <div
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 flex items-center justify-between px-3 gap-2"
      style={{
        height: 56,
        background: "var(--color-panel)",
        borderTop: "1px solid var(--color-border-mid)",
        backdropFilter: "blur(16px)",
      }}
    >
      <div className="flex items-center gap-1">
        {(Object.keys(LANG_CONFIG) as Language[]).map((lang) => {
          const cfg = LANG_CONFIG[lang]
          const isActive = activeLanguage === lang
          return (
            <button
              key={lang}
              onClick={() => setActiveLanguage(lang)}
              className="flex items-center justify-center w-10 h-8 rounded-md text-base transition-all duration-150"
              style={{
                background: isActive
                  ? `color-mix(in srgb, ${cfg.color} 20%, transparent)`
                  : "transparent",
                border: isActive
                  ? `1px solid color-mix(in srgb, ${cfg.color} 40%, transparent)`
                  : "1px solid transparent",
              }}
            >
              {cfg.emoji}
            </button>
          )
        })}
      </div>

      <TransmuteButton onClick={onTransmute} isLoading={isRunning} />
    </div>
  )
}
